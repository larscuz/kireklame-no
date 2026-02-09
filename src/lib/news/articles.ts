import { supabaseAdmin } from "@/lib/supabase/admin";
import type { NewsArticle, NewsArticleUpsert } from "@/lib/news/types";
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

  return (data ?? []).map((row) => mapNewsArticle(row as NewsSelect));
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
  return (data ?? []).map((row) => mapNewsArticle(row as NewsSelect));
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
  return mapNewsArticle(data as NewsSelect);
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
