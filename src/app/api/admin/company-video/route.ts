// src/app/api/admin/company-video/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function safeExtFromFile(file: File) {
  const name = (file.name || "").toLowerCase();
  const byName = name.split(".").pop();
  if (byName && byName.length <= 6) return byName;

  const type = (file.type || "").toLowerCase();
  if (type.includes("mp4")) return "mp4";
  if (type.includes("webm")) return "webm";
  if (type.includes("quicktime")) return "mov";
  return "mp4";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const companyId = String(form.get("company_id") ?? "").trim();
    const file = form.get("file");

    if (!companyId) {
      return NextResponse.json({ error: "Missing company_id" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }

    // V1: enkel sjekk (du kan stramme inn senere)
    const type = (file.type || "").toLowerCase();
    const ext = safeExtFromFile(file);

    // Tillat mp4 (og ev. webm/mov om du vil)
    const allowed = ["mp4", "webm", "mov"];
    if (!allowed.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported file type. Please upload .mp4 (got .${ext})` },
        { status: 400 }
      );
    }

    // Valgfritt: maks 100MB (juster)
    const MAX = 100 * 1024 * 1024;
    if (file.size > MAX) {
      return NextResponse.json(
        { error: "File too large (max 100MB in v1)" },
        { status: 400 }
      );
    }

    const db = supabaseAdmin();

    // Sjekk at company finnes
    const { data: company, error: cErr } = await db
      .from("companies")
      .select("id")
      .eq("id", companyId)
      .maybeSingle();

    if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    const bucket = "company-videos";
    const path = `${companyId}/video.${ext}`;

    const { error: upErr } = await db.storage.from(bucket).upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
      cacheControl: "3600",
    });

    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    // Public URL
    const { data: pub } = db.storage.from(bucket).getPublicUrl(path);
    const publicUrl = pub.publicUrl;

    // Oppdater companies.video_url
    const { error: uErr } = await db
      .from("companies")
      .update({ video_url: publicUrl })
      .eq("id", companyId);

    if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });

    // Redirect tilbake
    const origin = new URL(req.url).origin;
    return NextResponse.redirect(`${origin}/admin/companies/${companyId}`, { status: 303 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
