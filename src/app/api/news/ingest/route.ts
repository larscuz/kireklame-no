import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { FRONT_LEAD_OVERRIDE_TAG, normalizeNewsUpsert } from "@/lib/news/articles";
import { applyFrontLayoutAssignments } from "@/lib/news/frontLayout";
import { isLikelyNonArticleNewsPage } from "@/lib/news/nonArticle";
import {
  coerceNewsPerspective,
  coerceNewsStatus,
  parseTopicTagsCsv,
} from "@/lib/news/utils";

export const runtime = "nodejs";

type WorkerArticle = {
  id?: string;
  slug?: string;
  title?: string;
  source_name?: string;
  source_url?: string;
  language?: string;
  published_at?: string | null;
  status?: string;
  perspective?: string;
  topic_tags?: string[] | string;
  is_paywalled?: boolean;
  paywall_note?: string | null;
  excerpt?: string | null;
  summary?: string | null;
  body?: string | null;
  hero_image_url?: string | null;
  crawl_run_id?: string | null;
  crawl_query?: string | null;
  cloudflare_worker_hint?: string | null;
  evidence?: Record<string, unknown> | null;
  editor_note?: string | null;
};

type IngestPayload = {
  autoPublish?: boolean;
  articles?: WorkerArticle[];
};

type IngestUpsertRow = {
  id: string;
  slug: string;
  title: string;
  source_url: string;
  status: string;
};

function hasValidImageUrl(url: string | null | undefined): boolean {
  return /^https?:\/\//i.test(String(url ?? "").trim());
}

function hasTag(tags: string[] | null | undefined, tag: string): boolean {
  const needle = String(tag ?? "").trim().toLowerCase();
  if (!needle) return false;
  return (tags ?? []).some((item) => String(item ?? "").trim().toLowerCase() === needle);
}

function toTimestamp(value: string | null | undefined): number {
  if (!value) return 0;
  const ts = new Date(value).getTime();
  return Number.isFinite(ts) ? ts : 0;
}

function isKIRedaksjonenCandidate(
  row: ReturnType<typeof normalizeNewsUpsert>
): boolean {
  const tags = row.topic_tags ?? [];
  const sourceName = String(row.source_name ?? "");
  const title = String(row.title ?? "");
  const editorNote = String(row.editor_note ?? "");
  const language = String(row.language ?? "").toLowerCase().trim();
  const hasInternalTag =
    hasTag(tags, "op_ed") ||
    hasTag(tags, "leder") ||
    hasTag(tags, "redaksjonen") ||
    hasTag(tags, "kir_aivisa") ||
    hasTag(tags, "lars_cuzner");
  const hasInternalSignature =
    /redaksjonen|ki?r?\s*aivisa|lars\s*cuzner/i.test(sourceName) ||
    /op-?ed|leder/i.test(title) ||
    /editor in chief bot redaksjonen|skrevet av ki?r?\s*aivisa/i.test(editorNote);
  const looksInternal = hasInternalTag || hasInternalSignature;
  if (!looksInternal) return false;
  if (hasTag(tags, "internasjonalt") || hasTag(tags, "international_ai_agency")) return false;
  if (language && !["no", "nb", "nn", "unknown"].includes(language)) return false;
  return true;
}

function pickAutoFrontLeadId(
  savedRows: IngestUpsertRow[],
  normalizedRows: Array<ReturnType<typeof normalizeNewsUpsert>>
): IngestUpsertRow | null {
  const bySourceUrl = new Map<
    string,
    { input: ReturnType<typeof normalizeNewsUpsert>; inputIndex: number }
  >();
  normalizedRows.forEach((row, index) => {
    bySourceUrl.set(row.source_url, { input: row, inputIndex: index });
  });

  const candidates = savedRows
    .map((saved) => {
      const match = bySourceUrl.get(saved.source_url);
      if (!match) return null;
      if (saved.status !== "published") return null;
      if (!hasValidImageUrl(match.input.hero_image_url)) return null;
      if (!isKIRedaksjonenCandidate(match.input)) return null;
      return { saved, inputIndex: match.inputIndex, publishedAt: toTimestamp(match.input.published_at) };
    })
    .filter((item): item is { saved: IngestUpsertRow; inputIndex: number; publishedAt: number } => Boolean(item))
    .sort((a, b) => b.publishedAt - a.publishedAt || b.inputIndex - a.inputIndex);

  return candidates[0]?.saved ?? null;
}

export async function POST(req: Request) {
  const key = req.headers.get("x-ingest-key") || "";
  if (!process.env.INGEST_API_KEY || key !== process.env.INGEST_API_KEY) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as IngestPayload;
  const rows = Array.isArray(body.articles) ? body.articles : [];
  if (!rows.length) {
    return NextResponse.json({ ok: false, error: "Missing articles[]" }, { status: 400 });
  }

  const autoPublish = body.autoPublish !== false;
  const normalized: ReturnType<typeof normalizeNewsUpsert>[] = [];
  const skipped: Array<{ reason: string; source_url: string | null; title: string | null }> = [];

  for (const item of rows) {
    const title = String(item.title ?? "").trim();
    const sourceUrl = String(item.source_url ?? "").trim();
    if (!title || !sourceUrl) {
      skipped.push({
        reason: "missing_title_or_source_url",
        source_url: sourceUrl || null,
        title: title || null,
      });
      continue;
    }
    if (
      isLikelyNonArticleNewsPage({
        sourceUrl,
        title,
        snippet: item.excerpt ?? item.summary ?? null,
        plainText: item.body ?? null,
      })
    ) {
      skipped.push({
        reason: "non_article_page",
        source_url: sourceUrl || null,
        title: title || null,
      });
      continue;
    }
    if (!hasValidImageUrl(item.hero_image_url ?? null)) {
      skipped.push({
        reason: "missing_or_invalid_hero_image_url",
        source_url: sourceUrl || null,
        title: title || null,
      });
      continue;
    }

    const topicTags =
      typeof item.topic_tags === "string"
        ? parseTopicTagsCsv(item.topic_tags)
        : Array.isArray(item.topic_tags)
          ? item.topic_tags.map((x) => String(x)).filter(Boolean).slice(0, 16)
          : [];

    normalized.push(
      normalizeNewsUpsert({
        id: item.id ?? null,
        slug: item.slug ?? null,
        title,
        source_name: String(item.source_name ?? "").trim() || "Ukjent kilde",
        source_url: sourceUrl,
        language: item.language ?? "no",
        published_at: item.published_at ?? null,
        status: coerceNewsStatus(
          item.status ?? (autoPublish ? "published" : "draft"),
          autoPublish ? "published" : "draft"
        ),
        perspective: coerceNewsPerspective(item.perspective ?? "neutral", "neutral"),
        topic_tags: topicTags,
        is_paywalled: Boolean(item.is_paywalled),
        paywall_note: item.paywall_note ?? null,
        excerpt: item.excerpt ?? null,
        summary: item.summary ?? null,
        body: item.body ?? null,
        hero_image_url: item.hero_image_url ?? null,
        crawl_run_id: item.crawl_run_id ?? null,
        crawl_query: item.crawl_query ?? null,
        cloudflare_worker_hint: item.cloudflare_worker_hint ?? "cloudflare_worker",
        evidence: item.evidence ?? null,
        editor_note: item.editor_note ?? null,
      })
    );
  }

  if (!normalized.length) {
    return NextResponse.json({ ok: false, error: "No valid articles", skipped }, { status: 400 });
  }

  const upsertPayload = normalized.map((row) => {
    const payload = { ...row };
    delete (payload as { id?: string | null }).id;
    return payload;
  });

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("news_articles")
    .upsert(upsertPayload, { onConflict: "source_url", ignoreDuplicates: false })
    .select("id,slug,title,source_url,status");

  if (error) {
    return NextResponse.json(
      { ok: false, error: "upsert_failed", message: error.message, skipped },
      { status: 500 }
    );
  }

  const savedRows = (data ?? []) as IngestUpsertRow[];
  const autoLead = pickAutoFrontLeadId(savedRows, normalized);
  let autoLeadApplied = false;
  let autoLeadError: string | null = null;
  if (autoLead) {
    try {
      await applyFrontLayoutAssignments({
        [FRONT_LEAD_OVERRIDE_TAG]: autoLead.id,
      });
      autoLeadApplied = true;
    } catch (err) {
      autoLeadError = err instanceof Error ? err.message : "unknown_error";
    }
  }

  return NextResponse.json({
    ok: true,
    insertedOrUpdated: savedRows.length,
    rows: savedRows,
    frontLeadOverride: autoLead
      ? {
          id: autoLead.id,
          slug: autoLead.slug,
          title: autoLead.title,
          applied: autoLeadApplied,
          error: autoLeadError,
        }
      : null,
    skipped,
  });
}
