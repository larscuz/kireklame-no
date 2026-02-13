import { supabaseAdmin } from "@/lib/supabase/admin";
import type { NewsArticle, NewsArticleUpsert } from "@/lib/news/types";
import { isLikelyNonArticleNewsPage } from "@/lib/news/nonArticle";
import {
  canonicalizeNewsUrl,
  coerceNewsPerspective,
  coerceNewsStatus,
  domainFromUrl,
  stableNewsSlug,
} from "@/lib/news/utils";

type NewsSelect = {
  id: string;
  slug: string;
  title: string;
  source_name: string;
  source_url: string;
  source_domain: string | null;
  language: string;
  published_at: string | null;
  discovered_at: string;
  status: string;
  perspective: string;
  topic_tags: string[] | null;
  is_paywalled: boolean;
  paywall_note: string | null;
  excerpt: string | null;
  summary: string | null;
  body: string | null;
  hero_image_url: string | null;
  crawl_run_id: string | null;
  crawl_query: string | null;
  cloudflare_worker_hint: string | null;
  evidence: Record<string, unknown> | null;
  editor_note: string | null;
  created_at: string;
  updated_at: string;
};

export const FRONT_LEAD_OVERRIDE_TAG = "front_lead_override";
export const FRONT_NOW_OVERRIDE_TAGS = [
  "front_forside_now_1",
  "front_forside_now_2",
  "front_forside_now_3",
] as const;

function toTimestamp(value: string | null | undefined): number {
  const ts = Date.parse(String(value ?? ""));
  return Number.isFinite(ts) ? ts : 0;
}

function adminSourceDedupeKey(raw: string): string {
  const canonical = canonicalizeNewsUrl(raw);
  if (!canonical) return "";
  try {
    const url = new URL(canonical);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    const path = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
    return `${host}${path}`;
  } catch {
    return canonical.toLowerCase();
  }
}

function adminStatusRank(status: NewsArticle["status"]): number {
  if (status === "published") return 3;
  if (status === "draft") return 2;
  if (status === "archived") return 1;
  return 0;
}

function pickPreferredAdminRow(a: NewsArticle, b: NewsArticle): NewsArticle {
  const rankA = adminStatusRank(a.status);
  const rankB = adminStatusRank(b.status);
  if (rankA !== rankB) return rankA > rankB ? a : b;

  const updatedA = toTimestamp(a.updated_at);
  const updatedB = toTimestamp(b.updated_at);
  if (updatedA !== updatedB) return updatedA > updatedB ? a : b;

  const createdA = toTimestamp(a.created_at);
  const createdB = toTimestamp(b.created_at);
  if (createdA !== createdB) return createdA > createdB ? a : b;

  return String(a.id) >= String(b.id) ? a : b;
}

async function getLatestPublishedByTag(tag: string): Promise<NewsArticle | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("news_articles")
    .select("*")
    .eq("status", "published")
    .contains("topic_tags", [tag])
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  const article = mapNewsArticle(data as NewsSelect);
  if (
    isLikelyNonArticleNewsPage({
      sourceUrl: article.source_url,
      title: article.title,
      snippet: article.excerpt ?? article.summary,
      plainText: article.body,
    })
  ) {
    return null;
  }
  return article;
}

function mapNewsArticle(row: NewsSelect): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    source_name: row.source_name,
    source_url: row.source_url,
    source_domain: row.source_domain,
    language: row.language,
    published_at: row.published_at,
    discovered_at: row.discovered_at,
    status: coerceNewsStatus(row.status, "draft"),
    perspective: coerceNewsPerspective(row.perspective, "neutral"),
    topic_tags: row.topic_tags ?? [],
    is_paywalled: row.is_paywalled,
    paywall_note: row.paywall_note,
    excerpt: row.excerpt,
    summary: row.summary,
    body: row.body,
    hero_image_url: row.hero_image_url,
    crawl_run_id: row.crawl_run_id,
    crawl_query: row.crawl_query,
    cloudflare_worker_hint: row.cloudflare_worker_hint,
    evidence: row.evidence,
    editor_note: row.editor_note,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listPublishedNews(limit = 48): Promise<NewsArticle[]> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("news_articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[listPublishedNews]", error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => mapNewsArticle(row as NewsSelect))
    .filter(
      (article) =>
        !isLikelyNonArticleNewsPage({
          sourceUrl: article.source_url,
          title: article.title,
          snippet: article.excerpt ?? article.summary,
          plainText: article.body,
        })
    );
}

export async function getPublishedFrontLeadOverride(): Promise<NewsArticle | null> {
  return getLatestPublishedByTag(FRONT_LEAD_OVERRIDE_TAG);
}

export async function getPublishedFrontNowOverrides(): Promise<NewsArticle[]> {
  const slots = await Promise.all(
    FRONT_NOW_OVERRIDE_TAGS.map((tag) => getLatestPublishedByTag(tag))
  );
  return slots.filter((item): item is NewsArticle => Boolean(item));
}

export async function listNewsForAdmin(limit = 250): Promise<NewsArticle[]> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("news_articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[listNewsForAdmin]", error.message);
    return [];
  }
  const mapped = (data ?? []).map((row) => mapNewsArticle(row as NewsSelect));
  const deduped = new Map<string, NewsArticle>();

  for (const article of mapped) {
    const key = adminSourceDedupeKey(article.source_url) || `id:${article.id}`;
    const existing = deduped.get(key);
    deduped.set(key, existing ? pickPreferredAdminRow(article, existing) : article);
  }

  return Array.from(deduped.values()).sort((a, b) => {
    const createdDiff = toTimestamp(b.created_at) - toTimestamp(a.created_at);
    if (createdDiff !== 0) return createdDiff;
    return toTimestamp(b.updated_at) - toTimestamp(a.updated_at);
  });
}

export async function getPublishedNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("news_articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  const article = mapNewsArticle(data as NewsSelect);
  if (
    isLikelyNonArticleNewsPage({
      sourceUrl: article.source_url,
      title: article.title,
      snippet: article.excerpt ?? article.summary,
      plainText: article.body,
    })
  ) {
    return null;
  }
  return article;
}

export function normalizeNewsUpsert(input: NewsArticleUpsert): NewsArticleUpsert {
  const sourceUrl = canonicalizeNewsUrl(input.source_url);
  const title = String(input.title ?? "").trim();
  const sourceName = String(input.source_name ?? "").trim() || domainFromUrl(sourceUrl) || "Ukjent kilde";
  const slug = String(input.slug ?? "").trim() || stableNewsSlug(title, sourceUrl);

  const status = coerceNewsStatus(input.status ?? "draft", "draft");
  const perspective = coerceNewsPerspective(input.perspective ?? "neutral", "neutral");

  const normalized: NewsArticleUpsert = {
    slug,
    title,
    source_name: sourceName,
    source_url: sourceUrl,
    source_domain: domainFromUrl(sourceUrl),
    status,
    perspective,
    language: String(input.language ?? "no").trim() || "no",
    topic_tags: Array.isArray(input.topic_tags) ? input.topic_tags.slice(0, 16) : [],
    is_paywalled: Boolean(input.is_paywalled),
    paywall_note: input.paywall_note ?? null,
    excerpt: input.excerpt ?? null,
    summary: input.summary ?? null,
    body: input.body ?? null,
    hero_image_url: input.hero_image_url ?? null,
    crawl_run_id: input.crawl_run_id ?? null,
    crawl_query: input.crawl_query ?? null,
    cloudflare_worker_hint: input.cloudflare_worker_hint ?? null,
    evidence: input.evidence ?? null,
    editor_note: input.editor_note ?? null,
    published_at: input.published_at ?? null,
  };

  if (input.id) {
    normalized.id = input.id;
  }

  return normalized;
}
