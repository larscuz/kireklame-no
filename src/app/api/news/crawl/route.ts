import { NextResponse } from "next/server";
import { fetchText } from "@/lib/crawl/fetcher";
import {
  googleSearchOrganicResults,
  type SerperOrganic,
} from "@/lib/crawl/searchSerper";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  DEFAULT_NEWS_QUERIES,
  DEFAULT_NEWS_SOURCE_URLS,
  NEWS_BLOCKED_DOMAINS,
  isNorwegianDomain,
} from "@/lib/news/queries";
import {
  classifyPerspective,
  detectLikelyNorwegian,
  extractArticleSignals,
  looksRelevantToAIMarketing,
} from "@/lib/news/extract";
import { cleanText, domainFromUrl, stableNewsSlug } from "@/lib/news/utils";
import { normalizeNewsUpsert } from "@/lib/news/articles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CrawlPayload = {
  dryRun?: boolean;
  autoPublish?: boolean;
  maxQueries?: number;
  maxArticles?: number;
  resultsPerQuery?: number;
  queries?: string[];
  seedUrls?: string[];
};

type Candidate = {
  query: string;
  sourceUrl: string;
  title: string;
  snippet: string;
  domain: string;
};

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function errorMessage(err: unknown, fallback: string) {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

function makeRunId() {
  return `news_${new Date().toISOString().replace(/[:.]/g, "-")}_${Math.random()
    .toString(16)
    .slice(2)}`;
}

function normalizeQueryList(payload: CrawlPayload, maxQueries: number): string[] {
  const list =
    Array.isArray(payload.queries) && payload.queries.length > 0
      ? payload.queries
      : DEFAULT_NEWS_QUERIES;
  return list
    .map((q) => String(q ?? "").trim())
    .filter(Boolean)
    .slice(0, maxQueries);
}

function normalizeSeedUrlList(payload: CrawlPayload, maxSeeds: number): string[] {
  const list =
    Array.isArray(payload.seedUrls) && payload.seedUrls.length > 0
      ? payload.seedUrls
      : DEFAULT_NEWS_SOURCE_URLS;
  return list
    .map((url) => String(url ?? "").trim())
    .filter((url) => url.startsWith("http://") || url.startsWith("https://"))
    .slice(0, maxSeeds);
}

function titleFromUrlFallback(sourceUrl: string): string {
  try {
    const url = new URL(sourceUrl);
    const tail = url.pathname.split("/").filter(Boolean).pop() ?? url.hostname;
    const normalized = decodeURIComponent(tail)
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return cleanText(normalized, 220) ?? "Kuratert kilde";
  } catch {
    return "Kuratert kilde";
  }
}

function candidateFromSerper(query: string, hit: SerperOrganic): Candidate | null {
  const sourceUrl = String(hit.link ?? "").trim();
  if (!sourceUrl.startsWith("http")) return null;

  const domain = domainFromUrl(sourceUrl);
  if (!domain) return null;
  if (!isNorwegianDomain(domain)) return null;
  if (NEWS_BLOCKED_DOMAINS.has(domain)) return null;

  const title = cleanText(hit.title ?? "", 220) ?? "Uten tittel";
  const snippet = cleanText(hit.snippet ?? "", 420) ?? "";

  const relevanceText = `${title} ${snippet}`;
  if (!looksRelevantToAIMarketing(relevanceText)) return null;

  return {
    query,
    sourceUrl,
    title,
    snippet,
    domain,
  };
}

function autoSummary(args: {
  isPaywalled: boolean;
  excerpt: string | null;
  plainText: string;
  snippet: string;
}): string | null {
  if (args.isPaywalled) return null;
  const summarySeed = args.excerpt || cleanText(args.snippet, 280) || cleanText(args.plainText, 280);
  return summarySeed ? summarySeed.slice(0, 400) : null;
}

export async function POST(req: Request) {
  const key = req.headers.get("x-ingest-key") || "";
  if (!process.env.INGEST_API_KEY || key !== process.env.INGEST_API_KEY) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await req.json().catch(() => ({}))) as CrawlPayload;
  const dryRun = payload.dryRun !== false;
  const autoPublish = payload.autoPublish !== false;
  const maxQueries = clampInt(payload.maxQueries, 1, 60, 24);
  const maxArticles = clampInt(payload.maxArticles, 1, 240, 120);
  const resultsPerQuery = clampInt(payload.resultsPerQuery, 1, 10, 10);
  const crawlRunId = makeRunId();
  const queries = normalizeQueryList(payload, maxQueries);
  const seedUrls = normalizeSeedUrlList(payload, 20);

  const seenByUrl = new Set<string>();
  const candidates: Candidate[] = [];
  const errors: Array<{ where: string; message: string }> = [];

  for (const [index, sourceUrl] of seedUrls.entries()) {
    const domain = domainFromUrl(sourceUrl);
    if (!domain) continue;
    if (!isNorwegianDomain(domain)) continue;
    if (NEWS_BLOCKED_DOMAINS.has(domain)) continue;
    if (seenByUrl.has(sourceUrl)) continue;

    seenByUrl.add(sourceUrl);
    candidates.push({
      query: `seed:${index + 1}`,
      sourceUrl,
      title: titleFromUrlFallback(sourceUrl),
      snippet: "Kuratert kilde fra redaksjonen.",
      domain,
    });
    if (candidates.length >= maxArticles) break;
  }

  for (const query of queries) {
    try {
      const hits = await googleSearchOrganicResults(query, {
        gl: "no",
        hl: "no",
        num: resultsPerQuery,
      });

      for (const hit of hits) {
        const candidate = candidateFromSerper(query, hit);
        if (!candidate) continue;
        if (seenByUrl.has(candidate.sourceUrl)) continue;
        seenByUrl.add(candidate.sourceUrl);
        candidates.push(candidate);
        if (candidates.length >= maxArticles) break;
      }
    } catch (e: unknown) {
      errors.push({ where: `search:${query}`, message: errorMessage(e, "search failed") });
    }

    if (candidates.length >= maxArticles) break;
  }

  const upsertRows: ReturnType<typeof normalizeNewsUpsert>[] = [];
  const preview: Array<{
    title: string;
    source_url: string;
    source_name: string;
    hero_image_url: string | null;
    perspective: string;
    is_paywalled: boolean;
    status: string;
    published_at: string | null;
  }> = [];

  for (const item of candidates) {
    try {
      let html = "";
      try {
        const fetched = await fetchText(item.sourceUrl, { timeoutMs: 10_000 });
        if (fetched.ok) html = fetched.text;
      } catch {
        // best effort
      }

      const extracted = html
        ? extractArticleSignals({
            html,
            sourceUrl: item.sourceUrl,
            fallbackTitle: item.title,
            fallbackSnippet: item.snippet,
          })
        : {
            title: item.title,
            excerpt: cleanText(item.snippet, 420),
            heroImageUrl: null,
            publishedAt: null,
            isPaywalled: false,
            paywallNote: null,
            language: detectLikelyNorwegian(`${item.title} ${item.snippet}`) ? "no" : "unknown",
            perspective: classifyPerspective(`${item.title} ${item.snippet}`),
            plainText: `${item.title} ${item.snippet}`,
          };

      const likelyNorwegian =
        extracted.language === "no" ||
        detectLikelyNorwegian(`${item.title} ${item.snippet}`) ||
        isNorwegianDomain(item.domain);
      if (!likelyNorwegian) continue;

      const title = extracted.title ?? item.title;
      const sourceName = item.domain;
      const slug = stableNewsSlug(title, item.sourceUrl);

      const row = normalizeNewsUpsert({
        slug,
        title,
        source_name: sourceName,
        source_url: item.sourceUrl,
        source_domain: item.domain,
        language: extracted.language === "unknown" ? "no" : extracted.language,
        published_at: extracted.publishedAt,
        status: autoPublish ? "published" : "draft",
        perspective: extracted.perspective,
        topic_tags: [
          "ki_reklame",
          "ai_markedsforing",
          extracted.perspective === "critical" ? "kritikk" : "satsing",
          extracted.isPaywalled ? "betalingsmur" : "apen",
        ],
        is_paywalled: extracted.isPaywalled,
        paywall_note: extracted.paywallNote,
        excerpt: extracted.excerpt,
        summary: autoSummary({
          isPaywalled: extracted.isPaywalled,
          excerpt: extracted.excerpt,
          plainText: extracted.plainText,
          snippet: item.snippet,
        }),
        body: null,
        hero_image_url: extracted.heroImageUrl,
        crawl_run_id: crawlRunId,
        crawl_query: item.query,
        cloudflare_worker_hint: "ready_for_worker_enrichment",
        evidence: {
          crawler: "serper_news_v1",
          query: item.query,
          domain: item.domain,
          serper_title: item.title,
          serper_snippet: item.snippet,
          has_html_fetch: Boolean(html),
        },
      });

      upsertRows.push(row);
      preview.push({
        title: row.title,
        source_url: row.source_url,
        source_name: row.source_name,
        hero_image_url: row.hero_image_url ?? null,
        perspective: row.perspective ?? "neutral",
        is_paywalled: Boolean(row.is_paywalled),
        status: row.status ?? "draft",
        published_at: row.published_at ?? null,
      });
    } catch (e: unknown) {
      errors.push({
        where: `extract:${item.sourceUrl}`,
        message: errorMessage(e, "extract failed"),
      });
    }
  }

  let upsertedCount = 0;
  if (!dryRun && upsertRows.length > 0) {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("news_articles")
      .upsert(upsertRows, { onConflict: "source_url", ignoreDuplicates: false })
      .select("id");

    if (error) {
      errors.push({ where: "news_articles.upsert", message: error.message });
    } else {
      upsertedCount = (data ?? []).length;
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    crawlRunId,
    stats: {
      queryCount: queries.length,
      candidates: candidates.length,
      prepared: upsertRows.length,
      upserted: upsertedCount,
    },
    preview: preview.slice(0, 40),
    errors,
  });
}
