import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { normalizeNewsUpsert } from "@/lib/news/articles";
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

function hasValidImageUrl(url: string | null | undefined): boolean {
  return /^https?:\/\//i.test(String(url ?? "").trim());
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

  return NextResponse.json({
    ok: true,
    insertedOrUpdated: (data ?? []).length,
    rows: data ?? [],
    skipped,
  });
}
