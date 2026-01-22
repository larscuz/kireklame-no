// src/app/api/claim/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServerClient, createClaim } from "@/lib/supabase/server";

export const runtime = "nodejs";

function norm(s: unknown) {
  return String(s ?? "").trim();
}

function parseEmails(envName: string): string[] {
  const raw = process.env[envName] ?? "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://kireklame-no.vercel.app";
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  try {
    // 1) må være innlogget
    const supabase = await supabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2) les body
    const body = await req.json().catch(() => null);

    const companySlug = norm(body?.companySlug);
    const companyIdFromClient = norm(body?.companyId);

    const fullName = norm(body?.fullName);
    const email = norm(body?.email);
    const phone = norm(body?.phone);
    const role = norm(body?.role);
    const message = norm(body?.message);

    if (!companySlug && !companyIdFromClient) {
      return NextResponse.json({ error: "Missing slug or companyId" }, { status: 400 });
    }

    // 3) finn company (via slug eller id)
    const db = supabaseAdmin();
    const q = db.from("companies").select("id,name,slug,is_active,is_placeholder");

    const { data: company, error: cErr } = companyIdFromClient
      ? await q.eq("id", companyIdFromClient).maybeSingle()
      : await q.eq("slug", companySlug).maybeSingle();

    if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    // 4) blokkér hvis allerede claimet av noen andre (approved)
    const { data: existingApproved, error: aErr } = await db
      .from("claims")
      .select("id,user_id,status")
      .eq("company_id", company.id)
      .eq("status", "approved")
      .maybeSingle();

    if (aErr) return NextResponse.json({ error: aErr.message }, { status: 500 });
    if (existingApproved && existingApproved.user_id !== user.id) {
      return NextResponse.json(
        { ok: false, code: "ALREADY_CLAIMED", error: "Already claimed" },
        { status: 409 }
      );
    }

    // 5) bygg claim-message (ta med kontaktdetaljer fra UI)
    const metaLines = [
      fullName ? `Navn: ${fullName}` : null,
      email ? `E-post: ${email}` : null,
      phone ? `Telefon: ${phone}` : null,
      role ? `Rolle: ${role}` : null,
      message ? `Melding: ${message}` : null,
      `User (auth): ${user.email ?? user.id}`,
    ].filter(Boolean);

    const claimMessage = metaLines.join("\n");

    // 6) opprett claim (idempotent)
    const created = await createClaim({
      companyId: company.id,
      userId: user.id,
      message: claimMessage,
    });

    if (!created.ok) {
      return NextResponse.json({ ok: false, error: created.error }, { status: 500 });
    }

    // 7) send admin mail (Resend inline)
    try {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.MAIL_FROM;

      if (!apiKey) throw new Error("Missing env: RESEND_API_KEY");
      if (!from) throw new Error("Missing env: MAIL_FROM");

      const to =
        parseEmails("ADMIN_NOTIFY_EMAILS").length > 0
          ? parseEmails("ADMIN_NOTIFY_EMAILS")
          : parseEmails("ADMIN_EMAILS");

      if (!to.length) throw new Error("Missing env: ADMIN_NOTIFY_EMAILS or ADMIN_EMAILS");

      const subject = `Ny claim: ${company.name}`;
      const adminUrl = `${siteUrl()}/admin/claims`;

      const html = `
        <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial; line-height:1.5">
          <h2 style="margin:0 0 12px">Ny claim sendt</h2>
          <p style="margin:0 0 8px"><b>Bedrift:</b> ${escapeHtml(company.name)} (${escapeHtml(company.slug ?? "")})</p>
          <p style="margin:0 0 8px"><b>Company ID:</b> ${escapeHtml(company.id)}</p>
          <p style="margin:0 0 16px"><b>Fra bruker:</b> ${escapeHtml(user.email ?? user.id)}</p>

          <pre style="white-space:pre-wrap; background:#f6f6f6; padding:12px; border-radius:10px; border:1px solid #e5e5e5">${escapeHtml(
            claimMessage
          )}</pre>

          <p style="margin:16px 0 0">
            <a href="${adminUrl}" style="display:inline-block; padding:10px 14px; border-radius:10px; background:#111; color:#fff; text-decoration:none">
              Åpne claims i admin
            </a>
          </p>
        </div>
      `;

      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        subject,
        html,
      });
    } catch (e) {
      console.error("[claim] admin mail failed:", e);
      // mail-feil stopper ikke claim
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
