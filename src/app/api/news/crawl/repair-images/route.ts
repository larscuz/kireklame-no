import { NextResponse } from "next/server";
import { fetchText, fetchTextBestEffort } from "@/lib/crawl/fetcher";
import { extractArticleSignals } from "@/lib/news/extract";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { canonicalizeNewsUrl } from "@/lib/news/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RepairPayload = {
  dryRun?: boolean;
  limit?: number;
  sourceUrls?: string[];
};

type CandidateRow = {
  id: string;
  source_url: string;
  title: string;
  excerpt: string | null;
  hero_image_url: string | null;
  topic_tags: string[] | null;
};

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function hasValidImageUrl(url: string | null | undefined): boolean {
  return /^https?:\/\//i.test(String(url ?? "").trim());
}

function dedupeTags(tags: string[] | null | undefined): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of tags ?? []) {
    const tag = String(raw ?? "").trim().toLowerCase();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  return out;
}

function nextTopicTagsForImage(tags: string[] | null | undefined): string[] {
  const base = dedupeTags(tags).filter((tag) => tag !== "mangler_bilde");
  if (!base.includes("har_bilde")) base.push("har_bilde");
  return base;
}

function errorMessage(err: unknown, fallback: string) {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

async function bestImageFromSource(row: CandidateRow): Promise<string | null> {
  const sourceUrl = row.source_url;
  const fallbackTitle = row.title;
  const fallbackSnippet = row.excerpt ?? "";

  try {
    const direct = await fetchText(sourceUrl, { timeoutMs: 10_000 });
    if (direct.ok && direct.text) {
      const extracted = extractArticleSignals({
        html: direct.text,
        sourceUrl,
        fallbackTitle,
        fallbackSnippet,
      });
      if (hasValidImageUrl(extracted.heroImageUrl)) return extracted.heroImageUrl;
    }
  } catch {
    // continue with fallback attempt
  }

  try {
    const fallback = await fetchTextBestEffort(sourceUrl, {
      timeoutMs: 12_000,
      minPlainLength: 900,
      alwaysTryReadableFallback: true,
    });
    if (fallback.ok && fallback.text) {
      const extracted = extractArticleSignals({
        html: fallback.text,
        sourceUrl,
        fallbackTitle,
        fallbackSnippet,
      });
      if (hasValidImageUrl(extracted.heroImageUrl)) return extracted.heroImageUrl;
    }
  } catch {
    // no image found
  }

  return null;
}

export async function POST(req: Request) {
  const key = req.headers.get("x-ingest-key") || "";
  if (!process.env.INGEST_API_KEY || key !== process.env.INGEST_API_KEY) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await req.json().catch(() => ({}))) as RepairPayload;
  const dryRun = payload.dryRun !== false;
  const limit = clampInt(payload.limit, 1, 300, 50);
  const sourceUrls = (Array.isArray(payload.sourceUrls) ? payload.sourceUrls : [])
    .map((url) => canonicalizeNewsUrl(String(url ?? "").trim()))
    .filter((url) => url.startsWith("http://") || url.startsWith("https://"));

  const db = supabaseAdmin();
  let rows: CandidateRow[] = [];

  if (sourceUrls.length > 0) {
    const { data, error } = await db
      .from("news_articles")
      .select("id, source_url, title, excerpt, hero_image_url, topic_tags")
      .in("source_url", sourceUrls)
      .limit(Math.max(limit, sourceUrls.length));
    if (error) {
      return NextResponse.json(
        { ok: false, error: "db_select_failed", message: error.message },
        { status: 500 }
      );
    }
    rows = (data ?? []) as CandidateRow[];
  } else {
    const { data, error } = await db
      .from("news_articles")
      .select("id, source_url, title, excerpt, hero_image_url, topic_tags")
      .is("hero_image_url", null)
      .order("updated_at", { ascending: false })
      .limit(limit);
    if (error) {
      return NextResponse.json(
        { ok: false, error: "db_select_failed", message: error.message },
        { status: 500 }
      );
    }
    rows = (data ?? []) as CandidateRow[];
  }

  let scanned = 0;
  let alreadyHasImage = 0;
  let updated = 0;
  let skippedNoImage = 0;
  const errors: Array<{ where: string; message: string }> = [];
  const preview: Array<{ id: string; source_url: string; hero_image_url: string | null }> = [];

  for (const row of rows) {
    scanned += 1;
    if (hasValidImageUrl(row.hero_image_url)) {
      alreadyHasImage += 1;
      continue;
    }

    try {
      const heroImage = await bestImageFromSource(row);
      if (!hasValidImageUrl(heroImage)) {
        skippedNoImage += 1;
        continue;
      }

      preview.push({ id: row.id, source_url: row.source_url, hero_image_url: heroImage });
      if (!dryRun) {
        const { error } = await db
          .from("news_articles")
          .update({
            hero_image_url: heroImage,
            topic_tags: nextTopicTagsForImage(row.topic_tags),
          })
          .eq("id", row.id);
        if (error) {
          errors.push({ where: `update:${row.id}`, message: error.message });
          continue;
        }
        updated += 1;
      }
    } catch (err: unknown) {
      errors.push({
        where: `image_extract:${row.source_url}`,
        message: errorMessage(err, "image extraction failed"),
      });
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    stats: {
      scanned,
      alreadyHasImage,
      updated,
      skippedNoImage,
    },
    preview: preview.slice(0, 60),
    errors,
  });
}

