// src/app/api/tips/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      urls,
      email = null,
      comment = null,
    }: {
      urls: string;
      email?: string | null;
      comment?: string | null;
    } = body;

    if (!urls || !urls.trim()) {
      return NextResponse.json({ error: "Mangler URL-er" }, { status: 400 });
    }

    const rows = urls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean)
      .map((url) => ({ url, email, comment }));

    if (rows.length === 0) {
      return NextResponse.json({ error: "Ingen gyldige URL-er" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin().from("tips").insert(rows).select("id,url");

    if (error) {
      console.error("Tips insert error:", error);
      return NextResponse.json(
        {
          error: "Kunne ikke lagre tips",
          detail: error.message,
          code: error.code,
          hint: (error as any).hint ?? null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, inserted: data?.length ?? 0 });
  } catch (err: any) {
    console.error("Tips API error:", err);
    return NextResponse.json(
      { error: "Kunne ikke lagre tips", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
