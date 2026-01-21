// src/app/api/admin/company-cover/remove/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const companyId = String(form.get("company_id") ?? "").trim();

    if (!companyId) {
      return NextResponse.json({ error: "Missing company_id" }, { status: 400 });
    }

    const db = supabaseAdmin();

    // Null ut cover_image
    const { error } = await db
      .from("companies")
      .update({ cover_image: null })
      .eq("id", companyId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const origin = new URL(req.url).origin;
    return NextResponse.redirect(`${origin}/admin/companies/${companyId}`, {
      status: 303,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
