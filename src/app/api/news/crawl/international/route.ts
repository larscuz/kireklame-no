import { NextResponse } from "next/server";
import { fetchTextBestEffort } from "@/lib/crawl/fetcher";
import {
  googleSearchOrganicResults,
  type SerperOrganic,
} from "@/lib/crawl/searchSerper";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { NEWS_BLOCKED_DOMAINS } from "@/lib/news/queries";
import {
  classifyPerspective,
  extractArticleSignals,
} from "@/lib/news/extract";
import {
  classifyInternationalAIAgency,
  guessDocumentLanguage,
  INTERNATIONAL_NEWS_QUERIES,
  INTERNATIONAL_NEWS_SEED_URLS,
  INTERNATIONAL_NEWS_TOPIC,
  looksRelevantToInternationalAIAgency,
  type InternationalClassification,
} from "@/lib/news/international";
import {
  cleanText,
  domainFromUrl,
  fallbackNewsTitleFromUrl,
  stableNewsSlug,
} from "@/lib/news/utils";
import { normalizeNewsUpsert } from "@/lib/news/articles";
import {
  machineTranslationNote,
  shouldTranslateToNorwegian,
  translateToNorwegianBokmal,
} from "@/lib/news/translate";
import { isLikelyNonArticleNewsPage } from "@/lib/news/nonArticle";

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
  seed: boolean;
  imageUrl: string | null;
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
  return `news_international_${new Date().toISOString().replace(/[:.]/g, "-")}_${Math.random()
    .toString(16)
    .slice(2)}`;
}

function normalizeQueryList(payload: CrawlPayload, maxQueries: number): string[] {
  const list =
    Array.isArray(payload.queries) && payload.queries.length > 0
      ? payload.queries
      : INTERNATIONAL_NEWS_QUERIES;
  return list
    .map((q) => String(q ?? "").trim())
    .filter(Boolean)
    .slice(0, maxQueries);
}

function normalizeSeedUrlList(payload: CrawlPayload, maxSeeds: number): string[] {
  const list =
    Array.isArray(payload.seedUrls) && payload.seedUrls.length > 0
      ? payload.seedUrls
      : INTERNATIONAL_NEWS_SEED_URLS;
  return list
    .map((url) => String(url ?? "").trim())
    .filter((url) => url.startsWith("http://") || url.startsWith("https://"))
    .slice(0, maxSeeds);
}

function candidateFromSerper(query: string, hit: SerperOrganic): Candidate | null {
  const sourceUrl = String(hit.link ?? "").trim();
  if (!sourceUrl.startsWith("http")) return null;

  const domain = domainFromUrl(sourceUrl);
  if (!domain) return null;
  if (NEWS_BLOCKED_DOMAINS.has(domain)) return null;

  const title = cleanText(hit.title ?? "", 220) ?? "Untitled";
  const snippet = cleanText(hit.snippet ?? "", 420) ?? "";
  if (isLikelyNonArticleNewsPage({ sourceUrl, title, snippet })) return null;
  const relevanceText = `${title} ${snippet}`;
  if (!looksRelevantToInternationalAIAgency(relevanceText)) return null;

  return {
    query,
    sourceUrl,
    title,
    snippet,
    domain,
    seed: false,
    imageUrl: cleanText(hit.imageUrl ?? "", 1800),
  };
}

function autoSummary(args: {
  isPaywalled: boolean;
  excerpt: string | null;
  plainText: string;
  snippet: string;
}): string | null {
  if (args.isPaywalled) return null;
  const summarySeed = args.excerpt || cleanText(args.snippet, 320) || cleanText(args.plainText, 320);
  return summarySeed ? summarySeed.slice(0, 420) : null;
}

function normalizePerspectiveForAIFirst(
  classification: InternationalClassification,
  basePerspective: "critical" | "adoption" | "neutral"
) {
  if (basePerspective === "critical") return "critical";
  if (classification.label === "ai_only" || classification.label === "ai_first") {
    return "adoption";
  }
  return basePerspective;
}

function hasValidImageUrl(url: string | null | undefined): boolean {
  return /^https?:\/\//i.test(String(url ?? "").trim());
}

export async function POST(req: Request) {
  const key = req.headers.get("x-ingest-key") || "";
  if (!process.env.INGEST_API_KEY || key !== process.env.INGEST_API_KEY) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await req.json().catch(() => ({}))) as CrawlPayload;
  const dryRun = payload.dryRun !== false;
  const autoPublish = payload.autoPublish !== false;
  const maxQueries = clampInt(payload.maxQueries, 1, 100, 36);
  const maxArticles = clampInt(payload.maxArticles, 1, 320, 180);
  const resultsPerQuery = clampInt(payload.resultsPerQuery, 1, 10, 10);
  const queries = normalizeQueryList(payload, maxQueries);
  const seedUrls = normalizeSeedUrlList(payload, 120);
  const crawlRunId = makeRunId();

  const seenByUrl = new Set<string>();
  const candidates: Candidate[] = [];
  const errors: Array<{ where: string; message: string }> = [];

  for (const [index, sourceUrl] of seedUrls.entries()) {
    const domain = domainFromUrl(sourceUrl);
    if (!domain) continue;
    if (NEWS_BLOCKED_DOMAINS.has(domain)) continue;
    if (seenByUrl.has(sourceUrl)) continue;

    seenByUrl.add(sourceUrl);
    candidates.push({
      query: `seed:${index + 1}`,
      sourceUrl,
      title: fallbackNewsTitleFromUrl(sourceUrl, "generic", "International AI agency article"),
      snippet: "Curated international AI-first agency source.",
      domain,
      seed: true,
      imageUrl: null,
    });
    if (candidates.length >= maxArticles) break;
  }

  for (const query of queries) {
    try {
      const hits = await googleSearchOrganicResults(query, {
        gl: "us",
        hl: "en",
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
      errors.push({
        where: `search:${query}`,
        message: errorMessage(e, "search failed"),
      });
    }

    if (candidates.length >= maxArticles) break;
  }

  const upsertRows: ReturnType<typeof normalizeNewsUpsert>[] = [];
  let skippedNoImage = 0;
  let skippedNonArticle = 0;
  const preview: Array<{
    title: string;
    source_url: string;
    source_name: string;
    hero_image_url: string | null;
    language: string;
    classification_label: string;
    ai_intensity_score: number;
    is_paywalled: boolean;
    status: string;
    published_at: string | null;
  }> = [];

  for (const item of candidates) {
    try {
      let html = "";
      try {
        const fetched = await fetchTextBestEffort(item.sourceUrl, {
          timeoutMs: 12_000,
          minPlainLength: 900,
        });
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
            language: "unknown" as const,
            perspective: classifyPerspective(`${item.title} ${item.snippet}`),
            plainText: `${item.title} ${item.snippet}`,
          };

      if (
        isLikelyNonArticleNewsPage({
          sourceUrl: item.sourceUrl,
          title: extracted.title ?? item.title,
          snippet: extracted.excerpt ?? item.snippet,
          plainText: extracted.plainText,
        })
      ) {
        skippedNonArticle += 1;
        continue;
      }

      const combinedText =
        `${extracted.title ?? ""} ${extracted.excerpt ?? ""} ${extracted.plainText ?? ""}`.trim();
      if (!looksRelevantToInternationalAIAgency(combinedText)) continue;

      const classification = classifyInternationalAIAgency({
        title: extracted.title ?? item.title,
        snippet: extracted.excerpt ?? item.snippet,
        text: extracted.plainText,
      });
      const basePerspective = classifyPerspective(combinedText);
      const keepAsInternational =
        ["ai_only", "ai_first"].includes(classification.label) || basePerspective === "critical";
      if (!keepAsInternational) continue;

      const language = guessDocumentLanguage({
        html,
        text: combinedText,
      });
      const title = extracted.title ?? item.title;
      const sourceName = item.domain;
      const slug = stableNewsSlug(title, item.sourceUrl);
      const heroImageUrl = hasValidImageUrl(extracted.heroImageUrl)
        ? extracted.heroImageUrl
        : hasValidImageUrl(item.imageUrl)
          ? item.imageUrl
          : null;
      if (!heroImageUrl) {
        skippedNoImage += 1;
        continue;
      }

      let translatedTitle = title;
      let translatedExcerpt = extracted.excerpt;
      let translatedSummary = autoSummary({
        isPaywalled: extracted.isPaywalled,
        excerpt: extracted.excerpt,
        plainText: extracted.plainText,
        snippet: item.snippet,
      });
      const needsTranslation = shouldTranslateToNorwegian(language);

      if (needsTranslation) {
        const tTitle = await translateToNorwegianBokmal(translatedTitle);
        const tExcerpt = translatedExcerpt
          ? await translateToNorwegianBokmal(translatedExcerpt)
          : null;
        const tSummary = translatedSummary
          ? await translateToNorwegianBokmal(translatedSummary)
          : null;

        translatedTitle = tTitle ?? translatedTitle;
        translatedExcerpt = tExcerpt ?? translatedExcerpt;
        translatedSummary = tSummary ?? translatedSummary;
      }

      const row = normalizeNewsUpsert({
        slug,
        title: translatedTitle,
        source_name: sourceName,
        source_url: item.sourceUrl,
        source_domain: item.domain,
        language: needsTranslation ? "no" : language === "unknown" ? "en" : language,
        published_at: extracted.publishedAt,
        status: autoPublish ? "published" : "draft",
        perspective: normalizePerspectiveForAIFirst(classification, basePerspective),
        topic_tags: [
          "internasjonalt",
          INTERNATIONAL_NEWS_TOPIC,
          "ai_agency",
          classification.label === "ai_only"
            ? "ai_only"
            : classification.label === "ai_first"
              ? "ai_first"
              : "ai_discourse",
          basePerspective === "critical" ? "kritikk" : "satsing",
          needsTranslation ? "maskinoversatt" : "originalsprak",
          extracted.isPaywalled ? "betalingsmur" : "apen",
        ],
        is_paywalled: extracted.isPaywalled,
        paywall_note: extracted.paywallNote,
        excerpt: translatedExcerpt,
        summary: translatedSummary,
        body: null,
        hero_image_url: heroImageUrl,
        crawl_run_id: crawlRunId,
        crawl_query: item.query,
        cloudflare_worker_hint: "ready_for_worker_enrichment_international",
        editor_note: needsTranslation ? machineTranslationNote(language) : null,
        evidence: {
          crawler: "serper_news_international_v1",
          query: item.query,
          domain: item.domain,
          seed: item.seed,
          classification,
          translation: needsTranslation
            ? {
                provider: "google_translate_web",
                source_language: language,
                target_language: "no",
                translated_at: new Date().toISOString(),
              }
            : null,
          original_title: title,
          original_excerpt: extracted.excerpt,
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
        language: row.language ?? "unknown",
        classification_label: classification.label,
        ai_intensity_score: classification.ai_intensity_score,
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
      seedCount: seedUrls.length,
      candidates: candidates.length,
      prepared: upsertRows.length,
      upserted: upsertedCount,
      skippedNoImage,
      skippedNonArticle,
    },
    preview: preview.slice(0, 60),
    errors,
  });
}
