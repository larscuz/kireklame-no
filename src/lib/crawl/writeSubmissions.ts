// src/lib/crawl/writeSubmissions.ts
import { supabaseAdmin } from "@/lib/supabase/admin";

export type SubmissionInsert = {
  company_name: string | null;
  website: string | null;
  location: string | null;
  company_type?: string | null;
  org_form?: string | null;
  ai_level?: number | null;
  price_level?: number | null;
  tags?: string | null;
  notes?: string | null;
  contact_email?: string | null;

  // ✅ host-only key used for dedupe + unique index in Supabase
  website_host?: string | null;

  // ✅ columns in Supabase
  source_url?: string | null;
  crawl_run_id?: string | null;

  // ✅ jsonb
  evidence?: any;
};

/**
 * Blocklist for seed domains (we never want these as "companies").
 * Add more here as you add seeds.
 */
const SEED_BLOCK_HOSTS = new Set([
  "kampanje.com",
  "event.kampanje.com",
  "byraguiden.kampanje.com",
  "kode24.no",
]);

function hostOf(input: string) {
  try {
    const u = new URL(input.startsWith("http") ? input : `https://${input}`);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function canonicalUrl(url: string) {
  const raw = url.trim();
  if (!raw) return raw;

  const withScheme =
    raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;

  try {
    const u = new URL(withScheme);

    // normalize host
    u.hostname = u.hostname.replace(/^www\./, "");

    // strip common tracking
    const drop = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "gbraid",
      "wbraid",
    ];
    drop.forEach((k) => u.searchParams.delete(k));

    // drop trailing slash for homepage-ish URLs
    const cleaned = u.toString().replace(/\/$/, "");
    return cleaned;
  } catch {
    return raw;
  }
}

function keyFromWebsite(website: string | null) {
  if (!website) return null;
  const w = canonicalUrl(website);
  try {
    const u = new URL(w.startsWith("http") ? w : `https://${w}`);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return w.toLowerCase().replace(/^www\./, "");
  }
}

// ✅ hostKey used everywhere for dedupe / DB
function hostKey(website: string | null) {
  return keyFromWebsite(website);
}

function isSeedBlocked(website: string | null) {
  if (!website) return false;
  const h = hostOf(website);
  return Boolean(h && SEED_BLOCK_HOSTS.has(h));
}

export async function writeSubmissions(
  items: SubmissionInsert[],
  opts: { crawlRunId: string }
): Promise<{ inserted: number; skippedExisting: number; errors: { where: string; message: string }[] }> {
  const db = supabaseAdmin();
  const errors: { where: string; message: string }[] = [];

  // 1) Normalize + basic validation + attach crawl_run_id + compute website_host
  const normalized = items
    .map((x) => {
      const website = x.website ? canonicalUrl(x.website) : null;
      const computedHost = hostKey(website);
      return {
        ...x,
        website,
        website_host: (x.website_host ?? computedHost ?? null)?.toLowerCase() ?? null,
        crawl_run_id: x.crawl_run_id ?? opts.crawlRunId,
      };
    })
    .filter((x) => {
      // need at least name OR website to be useful
      return Boolean((x.company_name && x.company_name.trim()) || (x.website && x.website.trim()));
    })
    .filter((x) => {
      // hard block seeds
      return !isSeedBlocked(x.website ?? null);
    });

  if (normalized.length === 0) return { inserted: 0, skippedExisting: 0, errors: [] };

  // 2) Dedupe inside this batch (prefer website_host/host, fallback name)
  const seen = new Set<string>();
  const batch = normalized.filter((x) => {
    const domainKey = (x.website_host ?? hostKey(x.website ?? null) ?? null)?.toLowerCase() ?? null;
    const nameKey = `name:${(x.company_name ?? "").toLowerCase().trim()}`;
    const k = domainKey ?? nameKey;
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  if (batch.length === 0) return { inserted: 0, skippedExisting: 0, errors: [] };

  // 3) Fetch existing submissions by website_host (stable dedupe key)
  const hosts = batch
    .map((x) => (x.website_host ?? hostKey(x.website ?? null) ?? null)?.toLowerCase() ?? null)
    .filter(Boolean) as string[];

  let existingHosts = new Set<string>();
  if (hosts.length) {
    const { data: existing, error } = await db
      .from("submissions")
      .select("website_host")
      .in("website_host", hosts);

    if (error) {
      errors.push({ where: "submissions.select", message: error.message });
    } else {
      existingHosts = new Set(
        (existing ?? [])
          .map((r: any) => (r.website_host ?? "").toLowerCase())
          .filter(Boolean)
      );
    }
  }

  // ✅ Upsert ALL rows (do not skip); count how many are NEW vs already existed
  const toUpsert = batch;

  const newCount = toUpsert.filter((x) => {
    const h = (x.website_host ?? hostKey(x.website ?? null) ?? null)?.toLowerCase() ?? null;
    if (!h) return true; // name-only rows treated as "new" for stats purposes
    return !existingHosts.has(h);
  }).length;

  // 4) Upsert as pending submissions (conflict on website_host)
  const payload = toUpsert.map((x) => ({
    status: "pending",

    company_name: x.company_name ?? null,
    website: x.website ?? null,

    website_host: (x.website_host ?? hostKey(x.website ?? null) ?? null)?.toLowerCase() ?? null,

    location: x.location ?? null,
    company_type: x.company_type ?? null,
    org_form: x.org_form ?? null,
    ai_level: x.ai_level ?? null,
    price_level: x.price_level ?? null,
    tags: x.tags ?? null,
    notes: x.notes ?? null,
    contact_email: x.contact_email ?? null,

    source_url: x.source_url ?? null,
    crawl_run_id: x.crawl_run_id ?? opts.crawlRunId,

    evidence: x.evidence ?? null,
  }));

  const { error: upErr } = await db
    .from("submissions")
    .upsert(payload, { onConflict: "website_host", ignoreDuplicates: false });

  if (upErr) {
    errors.push({ where: "submissions.upsert", message: upErr.message });
    return { inserted: 0, skippedExisting: 0, errors };
  }

  // ✅ inserted = new rows (estimated), skippedExisting = 0 because we always upsert
  return { inserted: newCount, skippedExisting: 0, errors };
}

/**
 * ✅ Compatibility adapter:
 * Some parts of the crawler call `upsertPendingSubmission(item, opts)`.
 * We implement it by delegating to the batch writer above.
 */
export async function upsertPendingSubmission(
  item: SubmissionInsert,
  opts?: { crawlRunId: string }
): Promise<{ inserted: number; skippedExisting: number; errors: { where: string; message: string }[] }> {
  const crawlRunId = opts?.crawlRunId ?? `manual-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  return writeSubmissions([item], { crawlRunId });
}
