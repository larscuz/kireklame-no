import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function assertEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function safeExtFromFile(file: File) {
  const name = (file.name || "").toLowerCase();
  const byName = name.split(".").pop();
  if (byName && byName.length <= 5) return byName;

  const type = (file.type || "").toLowerCase();
  if (type.includes("jpeg")) return "jpg";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  return "png";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
    }

    const ext = safeExtFromFile(file);
    const allowed = new Set(["png", "jpg", "jpeg", "webp"]);
    if (!allowed.has(ext)) {
      return NextResponse.json(
        { ok: false, error: "Only png/jpg/webp allowed" },
        { status: 415 }
      );
    }

    const id =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const uploadUrl = assertEnv("ONECOM_UPLOAD_URL");
    const token = assertEnv("ONECOM_UPLOAD_TOKEN");

    const forward = new FormData();
    forward.set("kind", "cover");
    forward.set("scope", "submissions");
    forward.set("companyId", id);
    forward.set("file", file);

    const upRes = await fetch(uploadUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: forward,
    });

    const text = await upRes.text();
    let payload: any = null;
    try {
      payload = JSON.parse(text);
    } catch {}

    if (!upRes.ok || !payload?.ok || !payload?.url) {
      return NextResponse.json(
        { ok: false, error: "Upload failed", status: upRes.status, response: payload ?? text },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, id, url: payload.url });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
