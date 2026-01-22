// src/app/api/admin/company-cover/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireApprovedClaim } from "@/lib/supabase/server";

export const runtime = "nodejs";

function safeExtFromFile(file: File) {
  const name = (file.name || "").toLowerCase();
  const byName = name.split(".").pop();
  if (byName && byName.length <= 5) return byName;

  const type = (file.type || "").toLowerCase();
  if (type.includes("jpeg")) return "jpg";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("gif")) return "gif";

  return "jpg";
}

function assertEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
    // 1) parse form-data fra admin UI
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

    // ✅ Tillat: admin ELLER approved claim-owner
    await requireApprovedClaim(companyId);

    // 2) DB: sjekk at company finnes
    const db = supabaseAdmin();
    const { data: company, error: cErr } = await db
      .from("companies")
      .select("id")
      .eq("id", companyId)
      .maybeSingle();

    if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    // 3) bygg filnavn (cover.<ext>)
    const ext = safeExtFromFile(file);
    const filename = `cover.${ext}`;

    // 4) send til one.com upload.php
    const uploadUrl = assertEnv("ONECOM_UPLOAD_URL");
    const token = assertEnv("ONECOM_UPLOAD_TOKEN");

    const forward = new FormData();
    forward.set("kind", "cover");
    forward.set("companyId", companyId);
    forward.set("filename", filename);
    forward.set("file", file);

    const upRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: forward,
      // (ingen cache her)
    });

    const text = await upRes.text();
    let payload: any = null;
    try {
      payload = JSON.parse(text);
    } catch {
      // payload forblir null
    }

    if (!upRes.ok || !payload?.ok || !payload?.url) {
      return NextResponse.json(
        {
          error: "Upload failed",
          status: upRes.status,
          response: payload ?? text,
        },
        { status: 502 }
      );
    }

    const publicUrl: string = payload.url;

    // 5) oppdater companies.cover_image i Supabase DB (kun URL lagres)
    const { error: uErr } = await db
      .from("companies")
      .update({ cover_image: publicUrl })
      .eq("id", companyId);

    if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });

    // 6) redirect tilbake til admin edit side
    const origin = new URL(req.url).origin;
    return NextResponse.redirect(`${origin}/admin/companies/${companyId}`, { status: 303 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
