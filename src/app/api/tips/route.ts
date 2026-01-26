// src/app/api/tips/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

    // Én URL per linje -> én rad per URL, lagres i kolonnen "urls"
    const rows = urls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean)
      .map((u) => ({ urls: u, email, comment }));

    if (rows.length === 0) {
      return NextResponse.json({ error: "Ingen gyldige URL-er" }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { data, error } = await db.from("tips").insert(rows).select("id,urls");

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

    // Admin-epost (skal ikke stoppe tipset hvis epost feiler)
    try {
      const adminEmail = (process.env.TIPS_NOTIFY_EMAIL ?? "").trim();
      const resendKey = (process.env.RESEND_API_KEY ?? "").trim();

      if (adminEmail && resendKey) {
        const resend = new Resend(resendKey);

        const safeUrls = rows.map((r) => escapeHtml(r.urls)).join("\n");
        const safeEmail = email ? escapeHtml(email) : "";
        const safeComment = comment ? escapeHtml(comment) : "";

        await resend.emails.send({
          from: "KiReklame <tips@kireklame.no>",
          to: [adminEmail],
          subject: `Nytt tips mottatt – KiReklame (${rows.length})`,
          html: `
            <h2>Nytt tips</h2>
            <p><strong>Antall URL-er:</strong> ${rows.length}</p>
            <p><strong>URL-er:</strong></p>
            <pre style="padding:12px;border:1px solid #ddd;border-radius:8px;white-space:pre-wrap;">${safeUrls}</pre>
            ${email ? `<p><strong>Avsender (valgfritt):</strong> ${safeEmail}</p>` : ""}
            ${comment ? `<p><strong>Kommentar (valgfritt):</strong><br/>${safeComment}</p>` : ""}
          `,
        });
      } else {
        if (!adminEmail) console.warn("TIPS_NOTIFY_EMAIL is not set");
        if (!resendKey) console.warn("RESEND_API_KEY is not set");
      }
    } catch (e) {
      console.error("Tips admin email failed:", e);
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
