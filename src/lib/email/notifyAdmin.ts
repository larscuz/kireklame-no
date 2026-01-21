import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function adminRecipients(): string[] {
  const raw = process.env.ADMIN_NOTIFY_EMAILS ?? process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function esc(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function notifyAdmin(opts: {
  subject: string;
  title: string;
  lines: string[];
  actionText: string;
  actionPath: string;
}) {
  const to = adminRecipients();
  if (to.length === 0) return;

  const from = process.env.MAIL_FROM;
  if (!from) throw new Error("MAIL_FROM missing");
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");

  const url = `${siteUrl()}${opts.actionPath}`;

  const html = `
  <div style="font-family: ui-sans-serif, system-ui; line-height:1.45">
    <h2 style="margin:0 0 10px">${esc(opts.title)}</h2>
    <ul style="padding-left:18px;margin:0 0 14px">
      ${opts.lines.map((l) => `<li>${esc(l)}</li>`).join("")}
    </ul>
    <p style="margin:0 0 16px">
      <a href="${url}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#111;color:#fff;text-decoration:none;font-weight:700">
        ${esc(opts.actionText)}
      </a>
    </p>
    <div style="font-size:12px;color:#666">${url}</div>
  </div>
  `;

  const res = await resend.emails.send({ from, to, subject: opts.subject, html });

if ((res as any)?.error) {
  console.error("RESEND ERROR:", (res as any).error);
  throw new Error(String((res as any).error?.message ?? "Resend error"));
}

console.log("RESEND OK:", (res as any)?.data ?? res);

}
