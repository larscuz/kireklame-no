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
  // Sett gjerne NEXT_PUBLIC_SITE_URL=https://kireklame.no i Vercel (Production)
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://kireklame.no";
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function bearerTokenFromReq(req: Request) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim() || "";
}

export async function POST(req: Request) {
  const db = supabaseAdmin();

  console.log("[api/claim] HIT", {
    host: req.headers.get("host"),
    url: req.url,
  });

  try {
    // 1) Auth: prøv cookie-basert først (som før)
    let user: any = null;

    try {
      const supabase = await supabaseServerClient();
      const { data } = await supabase.auth.getUser();
      user = data?.user ?? null;
    } catch (e) {
      console.warn("[api/claim] cookie auth failed (ignored):", e);
    }

    // 2) Fallback: Authorization: Bearer <access_token>
    if (!user) {
      const token = bearerTokenFromReq(req);
      if (token) {
        const { data, error } = await db.auth.getUser(token);
        if (error) {
          console.warn("[api/claim] token auth failed:", error.message);
        } else {
          user = data?.user ?? null;
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 3) body
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

    // 4) finn company
    const q = db.from("companies").select("id,name,slug,is_active,is_placeholder");

    const { data: company, error: cErr } = companyIdFromClient
      ? await q.eq("id", companyIdFromClient).maybeSingle()
      : await q.eq("slug", companySlug).maybeSingle();

    if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    // 5) blokkér hvis allerede claimet av noen andre (approved)
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

    // 6) bygg claimMessage
    const metaLines = [
      fullName ? `Navn: ${fullName}` : null,
      email ? `E-post: ${email}` : null,
      phone ? `Telefon: ${phone}` : null,
      role ? `Rolle: ${role}` : null,
      message ? `Melding: ${message}` : null,
      `User (auth): ${user.email ?? user.id}`,
    ].filter(Boolean);

    const claimMessage = metaLines.join("\n");

    // 7) opprett claim (idempotent)
    const created = await createClaim({
      companyId: company.id,
      userId: user.id,
      message: claimMessage,
    });

    if (!created.ok) {
      return NextResponse.json({ ok: false, error: created.error }, { status: 500 });
    }

    // 8) mail (best-effort)
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.MAIL_FROM;

    const resendEnabled = !!apiKey && !!from;
    const resend = resendEnabled ? new Resend(apiKey!) : null;

    // admin
    try {
      if (!resend) throw new Error("Mail disabled (missing RESEND_API_KEY or MAIL_FROM)");

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

      await resend.emails.send({ from: from!, to, subject, html });
      console.log("[claim] admin mail sent");
    } catch (e) {
      console.error("[claim] admin mail failed:", e);
    }

    // claimant
    try {
      if (!resend) throw new Error("Mail disabled (missing RESEND_API_KEY or MAIL_FROM)");

      const claimantEmail = email || user.email;
      if (!claimantEmail) throw new Error("Missing claimant email");

      const subject = `Vi har mottatt claim på ${company.name} – KiReklame`;
      const meUrl = `${siteUrl()}/me`;
      const companyUrl = `${siteUrl()}/selskap/${encodeURIComponent(company.slug ?? "")}`;

      const html = `
        <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial; line-height:1.6">
          <h2 style="margin:0 0 12px">Claim mottatt</h2>
          <p style="margin:0 0 8px">
            Vi har mottatt forespørselen din om å claime <b>${escapeHtml(company.name)}</b>.
          </p>
          <p style="margin:0 0 16px">
            Neste steg: Admin godkjenner claimen. Du får beskjed når den er godkjent.
          </p>

          <p style="margin:0 0 16px">
            <a href="${meUrl}" style="display:inline-block; padding:10px 14px; border-radius:10px; background:#111; color:#fff; text-decoration:none">
              Gå til Min side
            </a>
            ${
              company.slug
                ? `<a href="${companyUrl}" style="display:inline-block; margin-left:10px; padding:10px 14px; border-radius:10px; background:#f3f3f3; color:#111; text-decoration:none">
                    Se bedriftssiden
                  </a>`
                : ""
            }
          </p>

          <div style="font-size:12px; color:#666">
            Hvis du ikke sendte denne forespørselen, kan du se bort fra e-posten.
          </div>
        </div>
      `;

      await resend.emails.send({ from: from!, to: claimantEmail, subject, html });
      console.log("[claim] claimant mail sent");
    } catch (e) {
      console.error("[claim] claimant mail failed:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[api/claim] fatal:", err);
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
