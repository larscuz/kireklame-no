import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUserOrNull, isAdminUser } from "@/lib/supabase/server";

export const runtime = "nodejs";

type MediaKind = "image" | "video";
type UploadedMedia = { publicUrl: string; posterUrl: string | null };
type FileMeta = { name: string; type: string; size: number };

type ForwardUploadConfig = {
  mode: "forward";
  uploadUrl: string;
  uploadToken: string;
  uploadKind: string;
  uploadPrefix: string;
  uploadBucket: string;
};

type DirectR2UploadConfig = {
  mode: "r2";
  accountId: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
  uploadPrefix: string;
};

type UploadConfig = ForwardUploadConfig | DirectR2UploadConfig;

type PrepareUploadInput = {
  action: "prepare";
  example_id: string;
  media_kind?: string;
  file_name: string;
  file_type?: string;
  file_size: number;
  poster_file_name?: string;
  poster_file_type?: string;
  poster_file_size?: number;
};

type CompleteUploadInput = {
  action: "complete";
  example_id: string;
  media_kind?: string;
  media_url: string;
  poster_url?: string | null;
};

function wantsJsonResponse(req: Request): boolean {
  return (req.headers.get("accept") ?? "").includes("application/json");
}

function normalizeMediaKind(value: string): MediaKind {
  return value === "video" ? "video" : "image";
}

function safeExtFromNameAndType(nameInput: string, typeInput: string) {
  const name = (nameInput || "").toLowerCase();
  const byName = name.split(".").pop();
  if (byName && byName.length <= 8) return byName;

  const type = (typeInput || "").toLowerCase();
  if (type.includes("jpeg")) return "jpg";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("mp4")) return "mp4";
  if (type.includes("webm")) return "webm";
  if (type.includes("quicktime")) return "mov";
  return "bin";
}

function safeExtFromFile(file: File) {
  return safeExtFromNameAndType(file.name || "", file.type || "");
}

function normalizePrefix(prefix: string): string {
  return prefix.trim().replace(/^\/+/, "").replace(/\/+$/, "");
}

function toTrimmed(value?: string | null): string {
  return String(value ?? "").trim();
}

function encodeRfc3986(input: string): string {
  return encodeURIComponent(String(input || "")).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function encodePath(pathValue: string): string {
  return String(pathValue || "")
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeRfc3986(segment))
    .join("/");
}

function toAmzDate(date = new Date()): string {
  const iso = date.toISOString();
  return iso.replace(/[:-]|\.\d{3}/g, "");
}

function toDateStamp(amzDate: string): string {
  return String(amzDate || "").slice(0, 8);
}

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function hmacSha256Buffer(key: Buffer | string, value: string): Buffer {
  return crypto.createHmac("sha256", key).update(value).digest();
}

function hmacSha256Hex(key: Buffer | string, value: string): string {
  return crypto.createHmac("sha256", key).update(value).digest("hex");
}

function buildSigningKey(secretAccessKey: string, dateStamp: string, region: string, service: string): Buffer {
  const kDate = hmacSha256Buffer(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmacSha256Buffer(kDate, region);
  const kService = hmacSha256Buffer(kRegion, service);
  return hmacSha256Buffer(kService, "aws4_request");
}

function sanitizeFilename(inputName: string): string {
  const raw = String(inputName || "").split("/").pop() || "file";
  const normalized = raw.normalize("NFKD").replace(/[^\x00-\x7F]/g, "");
  const collapsed = normalized
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
  return collapsed || "file";
}

function buildObjectKey(args: { prefix: string; mediaKind: MediaKind; filename: string }): string {
  const folder = [args.prefix, "ki-skole", args.mediaKind].filter(Boolean).join("/");
  const stamp = Date.now();
  const nonce = crypto.randomBytes(4).toString("hex");
  const safeName = sanitizeFilename(args.filename);
  return `${folder}/${stamp}-${nonce}-${safeName}`;
}

function buildPublicObjectUrl(publicBaseUrl: string, key: string): string {
  const base = String(publicBaseUrl || "").replace(/\/+$/, "");
  return `${base}/${encodePath(key)}`;
}

function contentTypeFromExt(ext: string, fallbackType: string): string {
  const normalized = String(ext || "").toLowerCase();
  if (normalized === "jpg" || normalized === "jpeg") return "image/jpeg";
  if (normalized === "png") return "image/png";
  if (normalized === "webp") return "image/webp";
  if (normalized === "mp4") return "video/mp4";
  if (normalized === "webm") return "video/webm";
  if (normalized === "mov") return "video/quicktime";
  return fallbackType || "application/octet-stream";
}

function createPresignedPutUrl(args: {
  accountId: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  key: string;
  expiresIn: number;
}) {
  const host = `${args.accountId}.r2.cloudflarestorage.com`;
  const method = "PUT";
  const region = "auto";
  const service = "s3";
  const now = new Date();
  const amzDate = toAmzDate(now);
  const dateStamp = toDateStamp(amzDate);
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalUri = `/${encodePath(args.bucket)}/${encodePath(args.key)}`;

  const query: Record<string, string> = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${args.accessKeyId}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(args.expiresIn),
    "X-Amz-SignedHeaders": "host",
  };

  const canonicalQueryString = Object.keys(query)
    .sort()
    .map((queryKey) => `${encodeRfc3986(queryKey)}=${encodeRfc3986(query[queryKey])}`)
    .join("&");

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    `host:${host}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = buildSigningKey(args.secretAccessKey, dateStamp, region, service);
  const signature = hmacSha256Hex(signingKey, stringToSign);
  return `https://${host}${canonicalUri}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
}

function resolveUploadConfig(): UploadConfig {
  const uploadPrefix = normalizePrefix(process.env.KI_SKOLE_UPLOAD_PREFIX ?? "ki-reklame");
  const accountId = toTrimmed(process.env.R2_ACCOUNT_ID) || toTrimmed(process.env.CLOUDFLARE_ACCOUNT_ID);
  const bucket = toTrimmed(process.env.KI_SKOLE_UPLOAD_BUCKET) || toTrimmed(process.env.R2_BUCKET);
  const accessKeyId = toTrimmed(process.env.R2_ACCESS_KEY_ID);
  const secretAccessKey = toTrimmed(process.env.R2_SECRET_ACCESS_KEY);
  const publicBaseUrl = toTrimmed(process.env.R2_PUBLIC_BASE_URL).replace(/\/+$/, "");
  const hasDirectR2Config = Boolean(accountId && bucket && accessKeyId && secretAccessKey && publicBaseUrl);

  if (hasDirectR2Config) {
    return {
      mode: "r2",
      accountId,
      bucket,
      accessKeyId,
      secretAccessKey,
      publicBaseUrl,
      uploadPrefix,
    };
  }

  const uploadUrl = process.env.KI_SKOLE_UPLOAD_URL ?? process.env.ONECOM_UPLOAD_URL;
  const uploadToken = process.env.KI_SKOLE_UPLOAD_TOKEN ?? process.env.ONECOM_UPLOAD_TOKEN;
  if (uploadUrl && uploadToken) {
    const usingFallbackOneCom = !process.env.KI_SKOLE_UPLOAD_URL && Boolean(process.env.ONECOM_UPLOAD_URL);
    const defaultKind = usingFallbackOneCom ? "cover" : "ki-skole-media";

    return {
      mode: "forward",
      uploadUrl,
      uploadToken,
      uploadKind: process.env.KI_SKOLE_UPLOAD_KIND?.trim() || defaultKind,
      uploadPrefix,
      uploadBucket: toTrimmed(process.env.KI_SKOLE_UPLOAD_BUCKET),
    };
  }

  const missingR2: string[] = [];
  if (!accountId) missingR2.push("R2_ACCOUNT_ID (or CLOUDFLARE_ACCOUNT_ID)");
  if (!bucket) missingR2.push("KI_SKOLE_UPLOAD_BUCKET (or R2_BUCKET)");
  if (!accessKeyId) missingR2.push("R2_ACCESS_KEY_ID");
  if (!secretAccessKey) missingR2.push("R2_SECRET_ACCESS_KEY");
  if (!publicBaseUrl) missingR2.push("R2_PUBLIC_BASE_URL");

  throw new Error(
    `Missing upload env. Configure either direct R2 (${missingR2.join(
      ", "
    )}) or endpoint mode (KI_SKOLE_UPLOAD_URL + KI_SKOLE_UPLOAD_TOKEN / ONECOM_UPLOAD_URL + ONECOM_UPLOAD_TOKEN).`
  );
}

async function uploadViaForward(
  config: ForwardUploadConfig,
  args: { exampleId: string; effectiveKind: MediaKind; filename: string; file: File }
): Promise<UploadedMedia> {
  const forward = new FormData();
  forward.set("kind", config.uploadKind);
  forward.set("entityId", args.exampleId);
  forward.set("companyId", args.exampleId);
  forward.set("scope", "ki-skole");
  forward.set("mediaKind", args.effectiveKind);
  forward.set("filename", args.filename);
  if (config.uploadPrefix) {
    forward.set("targetPrefix", config.uploadPrefix);
    forward.set("prefix", config.uploadPrefix);
  }
  if (config.uploadBucket) {
    forward.set("targetBucket", config.uploadBucket);
    forward.set("bucket", config.uploadBucket);
  }
  forward.set("file", args.file);

  const uploadResponse = await fetch(config.uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.uploadToken}`,
    },
    body: forward,
  });

  const rawBody = await uploadResponse.text();
  let payload: any = null;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    payload = null;
  }

  if (!uploadResponse.ok || !payload?.ok || !payload?.url) {
    throw new Error(
      `Upload failed (${uploadResponse.status}): ${JSON.stringify(payload ?? rawBody).slice(0, 500)}`
    );
  }

  return {
    publicUrl: String(payload.url),
    posterUrl:
      typeof payload.posterUrl === "string" && payload.posterUrl.trim().length > 0
        ? payload.posterUrl.trim()
        : null,
  };
}

async function uploadViaDirectR2(
  config: DirectR2UploadConfig,
  args: { effectiveKind: MediaKind; filename: string; file: File; ext: string }
): Promise<UploadedMedia> {
  const key = buildObjectKey({
    prefix: config.uploadPrefix,
    mediaKind: args.effectiveKind,
    filename: args.filename,
  });
  const uploadUrl = createPresignedPutUrl({
    accountId: config.accountId,
    bucket: config.bucket,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    key,
    expiresIn: 900,
  });
  const contentType = contentTypeFromExt(args.ext, args.file.type);
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: args.file,
  });

  if (!uploadResponse.ok) {
    const details = await uploadResponse.text().catch(() => "");
    throw new Error(`R2 PUT failed (${uploadResponse.status}): ${details.slice(0, 500) || "unknown error"}`);
  }

  return {
    publicUrl: buildPublicObjectUrl(config.publicBaseUrl, key),
    posterUrl: null,
  };
}

function prepareDirectR2Upload(
  config: DirectR2UploadConfig,
  args: { effectiveKind: MediaKind; filename: string; ext: string; fileType: string }
): { putUrl: string; publicUrl: string; contentType: string } {
  const key = buildObjectKey({
    prefix: config.uploadPrefix,
    mediaKind: args.effectiveKind,
    filename: args.filename,
  });

  const putUrl = createPresignedPutUrl({
    accountId: config.accountId,
    bucket: config.bucket,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    key,
    expiresIn: 900,
  });

  return {
    putUrl,
    publicUrl: buildPublicObjectUrl(config.publicBaseUrl, key),
    contentType: contentTypeFromExt(args.ext, args.fileType),
  };
}

async function loadExampleById(exampleId: string): Promise<{ id: string; media_kind: string } | null> {
  const db = supabaseAdmin();
  const { data: example, error } = await db
    .from("ki_skole_examples")
    .select("id,media_kind")
    .eq("id", exampleId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (example as { id: string; media_kind: string } | null) ?? null;
}

async function applyExampleMediaUpdate(args: {
  exampleId: string;
  effectiveKind: MediaKind;
  mediaUrl: string;
  posterUrl?: string | null;
}) {
  const db = supabaseAdmin();

  const updatePatch: Record<string, unknown> = {
    media_kind: args.effectiveKind,
    media_src: args.mediaUrl,
    is_placeholder: false,
  };

  if (args.effectiveKind === "image") {
    updatePatch.media_thumbnail_src = args.mediaUrl;
    updatePatch.media_poster_src = null;
  } else if (args.posterUrl) {
    updatePatch.media_poster_src = args.posterUrl;
    updatePatch.media_thumbnail_src = args.posterUrl;
  }

  const { error } = await db.from("ki_skole_examples").update(updatePatch).eq("id", args.exampleId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/ki-skole");
  revalidatePath("/norsk-prompting/eksempler");

  return {
    mediaUrl: args.mediaUrl,
    posterUrl: (updatePatch.media_poster_src as string | undefined) ?? null,
  };
}

function validateFileMeta(file: FileMeta, kind: MediaKind): { ok: true; ext: string } | { ok: false; error: string } {
  const ext = safeExtFromNameAndType(file.name, file.type).replace("jpeg", "jpg");

  if (kind === "image") {
    const allowed = new Set(["png", "jpg", "webp"]);
    if (!allowed.has(ext)) {
      return { ok: false, error: `Unsupported image type .${ext}. Allowed: png/jpg/webp.` };
    }

    const max = 20 * 1024 * 1024;
    if (file.size > max) {
      return { ok: false, error: "Image file too large (max 20MB)." };
    }
    return { ok: true, ext };
  }

  const allowed = new Set(["mp4", "webm", "mov"]);
  if (!allowed.has(ext)) {
    return { ok: false, error: `Unsupported video type .${ext}. Allowed: mp4/webm/mov.` };
  }

  const max = 250 * 1024 * 1024;
  if (file.size > max) {
    return { ok: false, error: "Video file too large (max 250MB)." };
  }

  return { ok: true, ext };
}

function validateFile(file: File, kind: MediaKind): { ok: true; ext: string } | { ok: false; error: string } {
  return validateFileMeta(
    {
      name: file.name || "file",
      type: file.type || "application/octet-stream",
      size: Number(file.size || 0),
    },
    kind
  );
}

export async function POST(req: Request) {
  const shouldReturnJson = wantsJsonResponse(req);

  try {
    const user = await getUserOrNull();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isAdminUser(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const contentType = req.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    if (isJson) {
      const payload = (await req.json()) as Partial<PrepareUploadInput | CompleteUploadInput>;
      const action = String(payload?.action ?? "").trim();

      if (action === "prepare") {
        const prepare = payload as Partial<PrepareUploadInput>;
        const exampleId = String(prepare.example_id ?? "").trim();
        const requestedKind = normalizeMediaKind(String(prepare.media_kind ?? "image"));
        const fileName = String(prepare.file_name ?? "").trim();
        const fileType = String(prepare.file_type ?? "application/octet-stream").trim();
        const fileSize = Number(prepare.file_size ?? 0);

        if (!exampleId) {
          return NextResponse.json({ error: "Missing example_id" }, { status: 400 });
        }
        if (!fileName || !Number.isFinite(fileSize) || fileSize <= 0) {
          return NextResponse.json({ error: "Missing file metadata" }, { status: 400 });
        }

        const example = await loadExampleById(exampleId);
        if (!example) {
          return NextResponse.json({ error: "Example not found" }, { status: 404 });
        }

        const effectiveKind = normalizeMediaKind(example.media_kind ?? requestedKind);
        const validation = validateFileMeta({ name: fileName, type: fileType, size: fileSize }, effectiveKind);
        if (!validation.ok) {
          return NextResponse.json({ error: validation.error }, { status: 415 });
        }

        const posterName = String(prepare.poster_file_name ?? "").trim();
        const posterType = String(prepare.poster_file_type ?? "application/octet-stream").trim();
        const posterSize = Number(prepare.poster_file_size ?? 0);
        const hasPoster = effectiveKind === "video" && posterName.length > 0 && Number.isFinite(posterSize) && posterSize > 0;

        const posterValidation =
          hasPoster
            ? validateFileMeta({ name: posterName, type: posterType, size: posterSize }, "image")
            : ({ ok: true, ext: "" } as const);
        if (!posterValidation.ok) {
          return NextResponse.json({ error: posterValidation.error }, { status: 415 });
        }

        const uploadConfig = resolveUploadConfig();
        if (uploadConfig.mode !== "r2") {
          return NextResponse.json(
            {
              error: "Direct upload unavailable. Configure R2 env for large media uploads.",
              code: "DIRECT_UPLOAD_UNAVAILABLE",
            },
            { status: 409 }
          );
        }

        const now = Date.now();
        const upload = prepareDirectR2Upload(uploadConfig, {
          effectiveKind,
          filename: `${exampleId}-${now}.${validation.ext}`,
          ext: validation.ext,
          fileType,
        });
        const posterUpload =
          hasPoster && posterValidation.ok
            ? prepareDirectR2Upload(uploadConfig, {
                effectiveKind: "image",
                filename: `${exampleId}-${now}-poster.${posterValidation.ext}`,
                ext: posterValidation.ext,
                fileType: posterType,
              })
            : null;

        return NextResponse.json({
          ok: true,
          mode: "direct-r2",
          effectiveKind,
          upload,
          posterUpload,
        });
      }

      if (action === "complete") {
        const complete = payload as Partial<CompleteUploadInput>;
        const exampleId = String(complete.example_id ?? "").trim();
        const requestedKind = normalizeMediaKind(String(complete.media_kind ?? "image"));
        const mediaUrl = String(complete.media_url ?? "").trim();
        const posterUrlRaw = String(complete.poster_url ?? "").trim();
        const posterUrl = posterUrlRaw.length > 0 ? posterUrlRaw : null;

        if (!exampleId) {
          return NextResponse.json({ error: "Missing example_id" }, { status: 400 });
        }
        if (!mediaUrl) {
          return NextResponse.json({ error: "Missing media_url" }, { status: 400 });
        }

        const example = await loadExampleById(exampleId);
        if (!example) {
          return NextResponse.json({ error: "Example not found" }, { status: 404 });
        }

        const effectiveKind = normalizeMediaKind(example.media_kind ?? requestedKind);
        const uploadConfig = resolveUploadConfig();
        if (uploadConfig.mode === "r2") {
          const base = uploadConfig.publicBaseUrl.replace(/\/+$/, "");
          if (!mediaUrl.startsWith(`${base}/`)) {
            return NextResponse.json({ error: "media_url is not under configured R2 public base URL." }, { status: 400 });
          }
          if (posterUrl && !posterUrl.startsWith(`${base}/`)) {
            return NextResponse.json({ error: "poster_url is not under configured R2 public base URL." }, { status: 400 });
          }
        }

        const persisted = await applyExampleMediaUpdate({
          exampleId,
          effectiveKind,
          mediaUrl,
          posterUrl,
        });

        return NextResponse.json({
          ok: true,
          mediaUrl: persisted.mediaUrl,
          posterUrl: persisted.posterUrl,
        });
      }

      return NextResponse.json({ error: "Missing or invalid action for JSON request." }, { status: 400 });
    }

    const form = await req.formData();
    const exampleId = String(form.get("example_id") ?? "").trim();
    const requestedKind = normalizeMediaKind(String(form.get("media_kind") ?? "image"));
    const file = form.get("file");
    const posterFileEntry = form.get("poster_file");
    const posterFile = posterFileEntry instanceof File && posterFileEntry.size > 0 ? posterFileEntry : null;

    if (!exampleId) {
      return NextResponse.json({ error: "Missing example_id" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }

    const example = await loadExampleById(exampleId);
    if (!example) {
      return NextResponse.json({ error: "Example not found" }, { status: 404 });
    }

    const effectiveKind = normalizeMediaKind(example.media_kind ?? requestedKind);
    const validation = validateFile(file, effectiveKind);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 415 });
    }
    const posterValidation =
      effectiveKind === "video" && posterFile ? validateFile(posterFile, "image") : ({ ok: true, ext: "" } as const);
    if (!posterValidation.ok) {
      return NextResponse.json({ error: posterValidation.error }, { status: 415 });
    }

    const ext = validation.ext;
    const uploadConfig = resolveUploadConfig();

    const now = Date.now();
    const filename = `${exampleId}-${now}.${ext}`;
    const uploaded =
      uploadConfig.mode === "r2"
        ? await uploadViaDirectR2(uploadConfig, { effectiveKind, filename, file, ext })
        : await uploadViaForward(uploadConfig, { exampleId, effectiveKind, filename, file });
    const uploadedPoster =
      effectiveKind === "video" && posterFile && posterValidation.ok
        ? uploadConfig.mode === "r2"
          ? await uploadViaDirectR2(uploadConfig, {
              effectiveKind: "image",
              filename: `${exampleId}-${now}-poster.${posterValidation.ext}`,
              file: posterFile,
              ext: posterValidation.ext,
            })
          : await uploadViaForward(uploadConfig, {
              exampleId,
              effectiveKind: "image",
              filename: `${exampleId}-${now}-poster.${posterValidation.ext}`,
              file: posterFile,
            })
        : null;

    const persisted = await applyExampleMediaUpdate({
      exampleId,
      effectiveKind,
      mediaUrl: uploaded.publicUrl,
      posterUrl: uploadedPoster?.publicUrl ?? uploaded.posterUrl,
    });

    if (shouldReturnJson) {
      return NextResponse.json({
        ok: true,
        mediaUrl: persisted.mediaUrl,
        posterUrl: persisted.posterUrl,
      });
    }

    const origin = new URL(req.url).origin;
    return NextResponse.redirect(`${origin}/admin/ki-skole`, { status: 303 });
  } catch (error: any) {
    return NextResponse.json({ error: String(error?.message ?? "Unknown error") }, { status: 500 });
  }
}
