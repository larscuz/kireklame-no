// src/app/api/tips/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
      return NextResponse.json(
        { error: "Mangler URL-er" },
        { status: 400 }
      );
    }

    // Split på linjeskift → én rad per URL
    const rows = urls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean)
      .map((url) => ({
        url,
        email,
        comment,
      }));

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Ingen gyldige URL-er" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin()
      .from("tips")
      .insert(rows);

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Tips API error:", err);
    return NextResponse.json(
      { error: "Kunne ikke lagre tips" },
      { status: 500 }
    );
  }
}
