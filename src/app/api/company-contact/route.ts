import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

function norm(value: FormDataEntryValue | null | undefined): string {
  return String(value ?? "").trim();
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[c] as string));
}

function isLikelyEmail(value: string): boolean {
  if (!value || value.length < 5 || value.length > 320) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseEmailList(raw: string): string[] {
  const seen = new Set<string>();
  return raw
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter((v) => isLikelyEmail(v) && !seen.has(v) && seen.add(v));
}

function safeReturnPath(rawPath: string, fallbackPath: string): string {
  const path = rawPath.trim();
  if (!path) return fallbackPath;
  if (!path.startsWith("/")) return fallbackPath;
  if (path.startsWith("//")) return fallbackPath;
  return path;
}

function redirectWithState(
  req: Request,
  path: string,
  state: { sent?: string; error?: string }
) {
  const url = new URL(path, req.url);
  if (state.sent) url.searchParams.set("sent", state.sent);
  if (state.error) url.searchParams.set("error", state.error);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(req: Request) {
  const form = await req.formData();
  const slug = norm(form.get("slug"));
  const fallbackPath = slug ? `/c/contact/${encodeURIComponent(slug)}` : "/selskaper";
  const returnPath = safeReturnPath(norm(form.get("return_to")), fallbackPath);

  // Honeypot (anti-spam): do not expose rejection signal to bots.
  if (norm(form.get("company"))) {
    return redirectWithState(req, returnPath, { sent: "1" });
  }

  const name = norm(form.get("name"));
  const email = norm(form.get("email")).toLowerCase();
  const subjectRaw = norm(form.get("subject"));
  const messageRaw = norm(form.get("message"));

  if (!slug || !name || !email || !subjectRaw || !messageRaw) {
    return redirectWithState(req, returnPath, { error: "missing" });
  }

  if (!isLikelyEmail(email)) {
    return redirectWithState(req, returnPath, { error: "invalid_email" });
  }

  if (!process.env.RESEND_API_KEY) {
    return redirectWithState(req, returnPath, { error: "config" });
  }

  const cleanName = name.slice(0, 120);
  const message = messageRaw.slice(0, 6000);
  const subject = subjectRaw.replace(/[\r\n]+/g, " ").slice(0, 160);
  const db = supabaseAdmin();

  const { data: company, error: companyErr } = await db
    .from("companies")
    .select("id, slug, name, email, is_active")
    .eq("slug", slug)
    .maybeSingle();

  if (companyErr || !company || company.is_active === false) {
    return redirectWithState(req, returnPath, { error: "not_found" });
  }

  const to = norm(company.email).toLowerCase();
  if (!isLikelyEmail(to)) {
    return redirectWithState(req, returnPath, { error: "no_email" });
  }

  const from =
    process.env.CONTACT_FROM_EMAIL ||
    process.env.MAIL_FROM ||
    "kontakt@kireklame.no";
  const monitorList = parseEmailList(
    process.env.CONTACT_TO_EMAIL ||
      process.env.ADMIN_NOTIFY_EMAILS ||
      ""
  );
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no";
  const companyProfileUrl = `${site.replace(/\/$/, "")}/selskap/${company.slug}`;

  try {
    await resend.emails.send({
      from,
      to,
      ...(monitorList.length ? { bcc: monitorList } : {}),
      replyTo: email,
      subject: `[KiReklame] ${subject}`,
      html: `
        <div style="font-family: system-ui; line-height: 1.6">
          <h2>Ny kontaktmelding via KiReklame</h2>
          <p><strong>Til:</strong> ${esc(company.name)}</p>
          <p><strong>Fra:</strong> ${esc(cleanName)} (${esc(email)})</p>
          <p><strong>Emne:</strong> ${esc(subject)}</p>
          <p><strong>Profil:</strong> <a href="${esc(companyProfileUrl)}">${esc(companyProfileUrl)}</a></p>
          <hr />
          <p style="white-space: pre-wrap">${esc(message)}</p>
        </div>
      `,
      text:
        `Ny kontaktmelding via KiReklame\n\n` +
        `Til: ${company.name}\n` +
        `Fra: ${cleanName} (${email})\n` +
        `Emne: ${subject}\n` +
        `Profil: ${companyProfileUrl}\n\n` +
        `${message}`,
    });
  } catch {
    return redirectWithState(req, returnPath, { error: "send" });
  }

  try {
    await db.from("company_events").insert({
      company_id: company.id,
      event_type: "contact_email",
      target_url: `${site.replace(/\/$/, "")}${returnPath}`,
      referrer: req.headers.get("referer") || "",
      user_agent: req.headers.get("user-agent") || "",
    });
  } catch {
    // Event logging should never block success redirect.
  }

  return redirectWithState(req, returnPath, { sent: "1" });
}
