import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DailyCrawlPayload = {
  dryRun: boolean;
  autoPublish: boolean;
  maxQueries: number;
  maxArticles: number;
  resultsPerQuery: number;
  minPublishedAt: string | null;
  requirePublishedAtAfterMin: boolean;
};

function clampInt(value: string | null, min: number, max: number, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function parseBooleanParam(value: string | null, fallback: boolean) {
  if (value == null || value.trim() === "") return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

function errorMessage(err: unknown, fallback: string) {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

function readBearerToken(headerValue: string | null): string {
  const raw = String(headerValue ?? "").trim();
  if (!raw.toLowerCase().startsWith("bearer ")) return "";
  return raw.slice(7).trim();
}

function isAuthorized(req: Request) {
  const ingestKey = String(req.headers.get("x-ingest-key") ?? "").trim();
  const expectedIngestKey = String(process.env.INGEST_API_KEY ?? "").trim();
  if (expectedIngestKey && ingestKey === expectedIngestKey) return true;

  const bearer = readBearerToken(req.headers.get("authorization"));
  const cronSecret = String(process.env.CRON_SECRET ?? "").trim();
  if (cronSecret && bearer === cronSecret) return true;

  return false;
}

function resolveSiteOrigin(req: Request): string {
  const explicit = String(process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  if (/^https?:\/\//i.test(explicit)) {
    return explicit.replace(/\/+$/g, "");
  }

  const incoming = new URL(req.url);
  return `${incoming.protocol}//${incoming.host}`;
}

function crawlRunTimestampFromId(runId: string, prefix: string): number {
  const value = String(runId ?? "").trim();
  if (!value.startsWith(prefix)) return 0;
  const stamp = value.slice(prefix.length).split("_")[0] ?? "";
  if (!stamp) return 0;
  const iso = stamp.replace(
    /^(\d{4}-\d{2}-\d{2}T\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/,
    "$1:$2:$3.$4Z"
  );
  const ts = Date.parse(iso);
  return Number.isFinite(ts) ? ts : 0;
}

async function resolveSinceLastInternationalCrawl(): Promise<string | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("news_articles")
    .select("crawl_run_id")
    .like("crawl_run_id", "news_international_%")
    .limit(1200);

  if (error) {
    console.error("[daily-crawl-international] failed to resolve last crawl", error.message);
    return null;
  }

  let latest = 0;
  for (const row of data ?? []) {
    const runId = String(row.crawl_run_id ?? "");
    const ts = crawlRunTimestampFromId(runId, "news_international_");
    if (ts > latest) latest = ts;
  }
  return latest > 0 ? new Date(latest).toISOString() : null;
}

async function payloadFromRequest(req: Request): Promise<DailyCrawlPayload> {
  const params = new URL(req.url).searchParams;
  const freshOnly = parseBooleanParam(params.get("freshOnly"), true);
  const strictFresh = parseBooleanParam(params.get("strictFresh"), false);
  const explicitMinPublishedAt = String(params.get("minPublishedAt") ?? "").trim();

  let minPublishedAt: string | null = null;
  if (explicitMinPublishedAt) {
    const ts = Date.parse(explicitMinPublishedAt);
    if (Number.isFinite(ts)) minPublishedAt = new Date(ts).toISOString();
  } else if (freshOnly) {
    minPublishedAt = await resolveSinceLastInternationalCrawl();
  }

  return {
    // Daily endpoint defaults to "ready for review" (not auto-published).
    dryRun: parseBooleanParam(params.get("dryRun"), false),
    autoPublish: parseBooleanParam(params.get("autoPublish"), false),
    maxQueries: clampInt(params.get("maxQueries"), 1, 100, 16),
    maxArticles: clampInt(params.get("maxArticles"), 1, 320, 80),
    resultsPerQuery: clampInt(params.get("resultsPerQuery"), 1, 10, 8),
    minPublishedAt,
    requirePublishedAtAfterMin: minPublishedAt ? strictFresh : false,
  };
}

async function triggerDailyCrawl(req: Request, payload: DailyCrawlPayload) {
  const ingestKey = String(process.env.INGEST_API_KEY ?? "").trim();
  if (!ingestKey) {
    return NextResponse.json(
      { ok: false, error: "Missing INGEST_API_KEY environment variable" },
      { status: 500 }
    );
  }

  const target = new URL("/api/news/crawl/international", resolveSiteOrigin(req));

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-ingest-key": ingestKey,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "crawler_request_failed",
          status: response.status,
          crawlerResponse: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      mode: "daily_international_review_queue",
      payload,
      crawlerResponse: data,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: "crawler_request_exception",
        message: errorMessage(err, "Unknown error while triggering crawler"),
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = await payloadFromRequest(req);
  return triggerDailyCrawl(req, payload);
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = await payloadFromRequest(req);
  return triggerDailyCrawl(req, payload);
}
