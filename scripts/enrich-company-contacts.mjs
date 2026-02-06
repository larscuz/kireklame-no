import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf8");
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function loadEnv() {
  const env = {
    ...loadEnvFile(path.join(ROOT, ".env")),
    ...loadEnvFile(path.join(ROOT, ".env.local")),
    ...process.env,
  };
  return env;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUrl(input) {
  if (!input) return null;
  const trimmed = String(input).trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

function extractEmails(text) {
  if (!text) return [];
  const re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
  const matches = text.match(re) || [];
  const blockedDomains = [
    "sentry.io",
    "ingest.sentry.io",
    "sentry.dev",
    "datadoghq.com",
    "googletagmanager.com",
  ];
  const imageExtRe = /\.(png|jpe?g|webp|svg|gif|ico)$/i;
  const cleaned = matches
    .map((m) => m.trim())
    .filter((m) => !/example\.|domain\.|test\./i.test(m))
    .filter((m) => {
      const lower = m.toLowerCase();
      const parts = lower.split("@");
      if (parts.length !== 2) return false;
      const host = parts[1];
      if (blockedDomains.some((d) => host === d || host.endsWith(`.${d}`))) return false;
      if (imageExtRe.test(host)) return false;
      return true;
    });
  return Array.from(new Set(cleaned));
}

function extractHrefCandidates(html) {
  if (!html) return [];
  const re = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  const out = [];
  let match;
  while ((match = re.exec(html))) {
    out.push(match[1]);
  }
  return out;
}

function pickContactLink(hrefs) {
  const keys = ["kontakt", "contact", "kontakt-oss", "about", "om-oss", "team", "connect", "support"];
  for (const href of hrefs) {
    const lower = href.toLowerCase();
    if (lower.startsWith("mailto:")) return href;
    if (keys.some((k) => lower.includes(k))) return href;
  }
  return null;
}

function resolveUrl(baseUrl, href) {
  try {
    if (href.startsWith("mailto:")) return href;
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
}

async function fetchText(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "user-agent": "KiReklameBot/0.1 (respectful; contact: kireklame.no)",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  } catch (err) {
    return { ok: false, status: 0, text: "", error: String(err) };
  } finally {
    clearTimeout(t);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { dryRun: false, limit: null };
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === "--dry-run") out.dryRun = true;
    if (a === "--limit") {
      const v = Number(args[i + 1]);
      out.limit = Number.isFinite(v) ? v : null;
      i += 1;
    }
  }
  return out;
}

async function main() {
  const { dryRun, limit } = parseArgs();
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
    process.exit(1);
  }

  const db = createClient(url, key, { auth: { persistSession: false } });

  const { data, error } = await db
    .from("companies")
    .select("id,slug,name,website,email")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
    process.exit(1);
  }

  const rows = (data || []).filter((r) => r.website && !r.email);
  const work = limit ? rows.slice(0, limit) : rows;

  let updated = 0;
  let skipped = 0;

  for (const row of work) {
    const baseUrl = normalizeUrl(row.website);
    if (!baseUrl) {
      skipped += 1;
      continue;
    }

    const home = await fetchText(baseUrl);
    let email = extractEmails(home.text)[0] || null;

    if (!email) {
      const hrefs = extractHrefCandidates(home.text);
      const contactHref = pickContactLink(hrefs);
      const contactUrl = contactHref ? resolveUrl(baseUrl, contactHref) : null;

      if (contactUrl && contactUrl.startsWith("mailto:")) {
        email = contactUrl.replace(/^mailto:/i, "").split("?")[0] || null;
      } else if (contactUrl) {
        const contact = await fetchText(contactUrl);
        email = extractEmails(contact.text)[0] || null;
      }
    }

    if (!email) {
      skipped += 1;
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] ${row.slug}: ${email}`);
    } else {
      const { error: updErr } = await db.from("companies").update({ email }).eq("id", row.id);
      if (updErr) {
        console.error(`Update failed for ${row.slug}:`, updErr.message);
      } else {
        updated += 1;
        console.log(`${row.slug}: ${email}`);
      }
    }

    await sleep(500);
  }

  console.log(`Done. updated=${updated} skipped=${skipped} total=${work.length}`);
}

main();
