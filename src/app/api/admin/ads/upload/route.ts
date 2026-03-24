import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getUserOrNull, isAdminUser } from "@/lib/supabase/server";

export const runtime = "nodejs";

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

function toTrimmed(value?: string | null): string {
  return String(value ?? "").trim();
}

function normalizePrefix(prefix: string): string {
  return prefix.trim().replace(/^\/+/, "").replace(/\/+$/, "");
}

function safeExtFromNameAndType(nameInput: string, typeInput: string) {
  const name = (nameInput || "").toLowerCase();
  const byName = name.split(".").pop();
  if (byName && byName.length <= 8) return byName;

  const type = (typeInput || "").toLowerCase();
  if (type.includes("jpeg")) return "jpg";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  return "bin";
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

function buildObjectKey(args: { prefix: string; filename: string }): string {
  const folder = [args.prefix].filter(Boolean).join("/");
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
  const uploadPrefix = normalizePrefix(process.env.ADS_UPLOAD_PREFIX ?? "ki-reklame/ads");
  const accountId = toTrimmed(process.env.R2_ACCOUNT_ID) || toTrimmed(process.env.CLOUDFLARE_ACCOUNT_ID);
  const bucket = toTrimmed(process.env.ADS_UPLOAD_BUCKET) || toTrimmed(process.env.R2_BUCKET);
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

  const uploadUrl = process.env.ADS_UPLOAD_URL ?? process.env.ONECOM_UPLOAD_URL;
  const uploadToken = process.env.ADS_UPLOAD_TOKEN ?? process.env.ONECOM_UPLOAD_TOKEN;
  if (uploadUrl && uploadToken) {
    const usingFallbackOneCom = !process.env.ADS_UPLOAD_URL && Boolean(process.env.ONECOM_UPLOAD_URL);
    const defaultKind = usingFallbackOneCom ? "cover" : "ads-media";

    return {
      mode: "forward",
      uploadUrl,
      uploadToken,
      uploadKind: process.env.ADS_UPLOAD_KIND?.trim() || defaultKind,
      uploadPrefix,
      uploadBucket: toTrimmed(process.env.ADS_UPLOAD_BUCKET),
    };
  }

  const missing: string[] = [];
  if (!accountId) missing.push("R2_ACCOUNT_ID/CLOUDFLARE_ACCOUNT_ID");
  if (!bucket) missing.push("ADS_UPLOAD_BUCKET/R2_BUCKET");
  if (!accessKeyId) missing.push("R2_ACCESS_KEY_ID");
  if (!secretAccessKey) missing.push("R2_SECRET_ACCESS_KEY");
  if (!publicBaseUrl) missing.push("R2_PUBLIC_BASE_URL");

  throw new Error(
    `Missing upload env. Configure either direct R2 (${missing.join(
      ", "
    )}) or endpoint mode (ADS_UPLOAD_URL + ADS_UPLOAD_TOKEN / ONECOM_UPLOAD_URL + ONECOM_UPLOAD_TOKEN).`
  );
}

function validateFile(file: File): { ok: true; ext: string } | { ok: false; error: string } {
  const ext = safeExtFromNameAndType(file.name || "file", file.type || "application/octet-stream")
    .replace("jpeg", "jpg");
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

async function uploadViaForward(
  config: ForwardUploadConfig,
  args: { uploadId: string; filename: string; file: File }
) {
  const forward = new FormData();
  forward.set("kind", config.uploadKind);
  forward.set("entityId", args.uploadId);
  forward.set("companyId", args.uploadId);
  forward.set("scope", "ads");
  forward.set("mediaKind", "image");
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

  return String(payload.url);
}

async function uploadViaDirectR2(
  config: DirectR2UploadConfig,
  args: { filename: string; file: File; ext: string }
) {
  const key = buildObjectKey({
    prefix: config.uploadPrefix,
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

  return buildPublicObjectUrl(config.publicBaseUrl, key);
}

export async function POST(req: Request) {
  try {
    const user = await getUserOrNull();
    if (!user) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    if (!isAdminUser(user.email)) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ ok: false, error: "Empty file" }, { status: 400 });
    }

    const validation = validateFile(file);
    if (!validation.ok) {
      return NextResponse.json({ ok: false, error: validation.error }, { status: 415 });
    }

    const ext = validation.ext;
    const nameStem = sanitizeFilename(file.name).replace(/\.[^.]+$/, "") || "ad";
    const filename = `${nameStem}.${ext}`;
    const uploadId = crypto.randomUUID();
    const uploadConfig = resolveUploadConfig();
    const url =
      uploadConfig.mode === "r2"
        ? await uploadViaDirectR2(uploadConfig, { filename, file, ext })
        : await uploadViaForward(uploadConfig, { uploadId, filename, file });

    return NextResponse.json({
      ok: true,
      mode: uploadConfig.mode,
      url,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: String(error?.message ?? "Unknown error") },
      { status: 500 }
    );
  }
}
