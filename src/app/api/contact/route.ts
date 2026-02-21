// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

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

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[c] as string));
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // Honeypot (anti-spam)
    const hp = String(form.get("company") ?? "");
    if (hp.trim()) {
      return NextResponse.redirect(
        new URL("/kontakt?sendt=1", req.url),
        { status: 303 }
      );
    }

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const subject = String(form.get("subject") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { ok: false, error: "Mangler felter." },
        { status: 400 }
      );
    }

    const configuredTo =
      process.env.CONTACT_TO_EMAIL ||
      process.env.ADMIN_NOTIFY_EMAILS ||
      "lars@larscuzner.com";
    const toList = parseEmailList(configuredTo);
    const to = toList.length ? toList : ["lars@larscuzner.com"];
    const from =
      process.env.CONTACT_FROM_EMAIL ||
      process.env.MAIL_FROM ||
      "kontakt@kireklame.no";

    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[KiReklame] ${subject}`,
      html: `
        <div style="font-family: system-ui; line-height: 1.6">
          <h2>Ny kontaktmelding</h2>
          <p><strong>Navn:</strong> ${esc(name)}</p>
          <p><strong>E-post:</strong> ${esc(email)}</p>
          <p><strong>Emne:</strong> ${esc(subject)}</p>
          <hr />
          <p style="white-space: pre-wrap">${esc(message)}</p>
        </div>
      `,
    });

    return NextResponse.redirect(
      new URL("/kontakt?sendt=1", req.url),
      { status: 303 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Ukjent feil" },
      { status: 500 }
    );
  }
}
