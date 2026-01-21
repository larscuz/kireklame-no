// src/lib/email/notifySubmitter.ts
import { Resend } from "resend";

export async function notifySubmitter(args: {
  to: string;
  subject: string;
  title: string;
  lines: string[];
  actionText?: string;
  actionUrl?: string; // FULL URL
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY");

  const from = process.env.MAIL_FROM || "KiReklame <noreply@kireklame.no>";

  const { to, subject, title, lines, actionText, actionUrl } = args;

  const resend = new Resend(apiKey);

  const hasAction = Boolean(actionText && actionUrl);

  const html = `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.4;">
    <h2 style="margin:0 0 10px 0;">${escapeHtml(title)}</h2>

    <div style="margin: 0 0 14px 0; color:#444;">
      ${lines.map((l) => `<div style="margin: 4px 0;">${escapeHtml(l)}</div>`).join("")}
    </div>

    ${
      hasAction
        ? `
    <div style="margin-top: 18px;">
      <a href="${escapeAttr(actionUrl!)}"
         style="display:inline-block; padding: 10px 14px; border-radius: 10px; background:#111; color:#fff; text-decoration:none; font-weight: 700;">
        ${escapeHtml(actionText!)}
      </a>
    </div>
    <div style="margin-top:14px; font-size: 12px; color:#666;">
      Hvis knappen ikke fungerer, åpne denne lenken: ${escapeHtml(actionUrl!)}
    </div>
    `
        : ""
    }
  </div>`;

  const res = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if ((res as any)?.error) {
    console.error("RESEND ERROR:", (res as any).error);
    throw new Error(String((res as any).error?.message ?? "Resend error"));
  }

  return res;
}

function escapeHtml(s: string) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(s: string) {
  return escapeHtml(s);
}
