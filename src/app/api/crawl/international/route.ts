import { NextResponse } from "next/server";
import {
  canonicalWebsiteFromDomain,
  extractCandidateDomains,
} from "@/lib/crawl/candidates";
import { fetchText } from "@/lib/crawl/fetcher";
import {
  googleSearchOrganicLinks,
} from "@/lib/crawl/searchSerper";
import {
  writeSubmissions,
  type SubmissionInsert,
} from "@/lib/crawl/writeSubmissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QuerySeed = {
  q: string;
  gl: string;
  hl: string;
};

type CandidateFit = {
  domain: string;
  website: string;
  companyName: string;
  score: number;
  aiHits: number;
  commercialHits: number;
  hasImage: boolean;
  hasVideo: boolean;
  fit: boolean;
  queries: string[];
  checkedPaths: string[];
};

const AI_KEYWORDS = [
  "ai-first",
  "artificial intelligence",
  "generative ai",
  "genai",
  "ai video",
  "stable diffusion",
  "midjourney",
  "runway",
  "prompt",
  "synthetic media",
];

const COMMERCIAL_KEYWORDS = [
  "advertising",
  "ad campaign",
  "campaign",
  "brand",
  "creative agency",
  "production company",
  "studio",
  "client",
  "case study",
  "commercial",
];

const PATHS_TO_CHECK = [
  "/",
  "/work",
  "/projects",
  "/cases",
  "/case-studies",
  "/showreel",
  "/reel",
  "/services",
  "/about",
];

const DEFAULT_QUERY_SEEDS: QuerySeed[] = [
  { q: "AI-first creative agency", gl: "us", hl: "en" },
  { q: "generative video studio for brands", gl: "gb", hl: "en" },
  { q: "AI advertising production studio", gl: "de", hl: "en" },
  { q: "commercial generative AI agency", gl: "fr", hl: "en" },
  { q: "AI ad creative studio", gl: "nl", hl: "en" },
  { q: "creative agency AI showreel", gl: "se", hl: "en" },
  { q: "brand campaign studio using AI", gl: "dk", hl: "en" },
  { q: "generative ad studio client work", gl: "ca", hl: "en" },
];

function makeRunId() {
  return `intl_${new Date().toISOString().replace(/[:.]/g, "-")}_${Math.random()
    .toString(16)
    .slice(2)}`;
}

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function countHits(text: string, keywords: string[]) {
  const lc = text.toLowerCase();
  return keywords.reduce((acc, kw) => (lc.includes(kw) ? acc + 1 : acc), 0);
}

function extractNameFromHtml(html: string, fallbackDomain: string) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const raw = (m?.[1] ?? "").replace(/\s+/g, " ").trim();
  if (!raw) return fallbackDomain;
  const main = raw.split("|")[0]?.split(" - ")[0]?.trim() ?? raw;
  return main.slice(0, 120);
}

function makeScore(args: {
  aiHits: number;
  commercialHits: number;
  hasImage: boolean;
  hasVideo: boolean;
  hasShowreelWord: boolean;
}) {
  let score = 0;
  score += Math.min(args.aiHits, 3) * 18;
  score += Math.min(args.commercialHits, 3) * 15;
  if (args.hasImage) score += 15;
  if (args.hasVideo) score += 20;
  if (args.hasShowreelWord) score += 8;
  return Math.min(score, 100);
}

function pathUrl(base: string, path: string) {
  if (path === "/") return base;
  try {
    return new URL(path, `${base}/`).toString();
  } catch {
    return `${base}${path}`;
  }
}

async function evaluateDomain(domain: string, queries: string[]): Promise<CandidateFit | null> {
  const website = canonicalWebsiteFromDomain(domain);
  const checkedPaths: string[] = [];
  const docs: string[] = [];
  let homeHtml = "";

  for (const path of PATHS_TO_CHECK) {
    const url = pathUrl(website, path);
    try {
      const res = await fetchText(url, { timeoutMs: 8000 });
      if (!res.ok || !res.text) continue;
      checkedPaths.push(path);
      docs.push(res.text.slice(0, 120_000));
      if (path === "/") homeHtml = res.text;
      if (checkedPaths.length >= 4) break;
    } catch {
      // best effort
    }
  }

  if (docs.length === 0) return null;

  const corpus = docs.join("\n").toLowerCase();
  const aiHits = countHits(corpus, AI_KEYWORDS);
  const commercialHits = countHits(corpus, COMMERCIAL_KEYWORDS);

  const hasImage =
    /<img[\s>]|og:image|twitter:image|srcset=/i.test(corpus);
  const hasVideo =
    /<video[\s>]|youtube\.com|youtu\.be|vimeo\.com|\.mp4|showreel|demo reel|reel/i.test(
      corpus
    );
  const hasShowreelWord = /showreel|demo reel/.test(corpus);

  const score = makeScore({
    aiHits,
    commercialHits,
    hasImage,
    hasVideo,
    hasShowreelWord,
  });

  const fit =
    score >= 65 &&
    aiHits >= 1 &&
    commercialHits >= 1 &&
    hasImage &&
    hasVideo;

  return {
    domain,
    website,
    companyName: extractNameFromHtml(homeHtml, domain),
    score,
    aiHits,
    commercialHits,
    hasImage,
    hasVideo,
    fit,
    queries,
    checkedPaths,
  };
}

function toSubmission(item: CandidateFit, crawlRunId: string): SubmissionInsert {
  const notes = [
    `[AUTO][INTL] Fit score: ${item.score}/100`,
    `Signals -> AI:${item.aiHits}, Commercial:${item.commercialHits}, Image:${
      item.hasImage ? "yes" : "no"
    }, Video:${item.hasVideo ? "yes" : "no"}`,
    `Checked pages: ${item.checkedPaths.join(", ") || "homepage"}`,
    `Queries: ${item.queries.slice(0, 4).join(" | ")}`,
  ].join("\n");

  return {
    company_name: item.companyName,
    website: item.website,
    location: "International",
    company_type: "byrå",
    tags: "international,ai-first,commercial,showreel,image,video",
    notes,
    source_url: `google:${item.queries[0] ?? "unknown"}`,
    crawl_run_id: crawlRunId,
    evidence: {
      source: "international_discovery_v1",
      score: item.score,
      ai_hits: item.aiHits,
      commercial_hits: item.commercialHits,
      has_image: item.hasImage,
      has_video: item.hasVideo,
      checked_paths: item.checkedPaths,
      queries: item.queries,
    },
  };
}

export async function POST(req: Request) {
  const key = req.headers.get("x-ingest-key") || "";
  if (!process.env.INGEST_API_KEY || key !== process.env.INGEST_API_KEY) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const dryRun = body?.dryRun !== false;
  const maxQueries = clampInt(body?.maxQueries, 1, DEFAULT_QUERY_SEEDS.length, 6);
  const maxCandidates = clampInt(body?.maxCandidates, 1, 100, 25);
  const maxSearchResultsPerQuery = clampInt(body?.resultsPerQuery, 3, 10, 6);

  const crawlRunId = makeRunId();
  const seeds = DEFAULT_QUERY_SEEDS.slice(0, maxQueries);

  const allLinks: string[] = [];
  const queryByDomain = new Map<string, Set<string>>();
  const errors: Array<{ where: string; message: string }> = [];

  for (const seed of seeds) {
    try {
      const links = await googleSearchOrganicLinks(seed.q, {
        gl: seed.gl,
        hl: seed.hl,
        num: maxSearchResultsPerQuery,
      });
      allLinks.push(...links);

      const domains = extractCandidateDomains(links);
      for (const d of domains) {
        if (!queryByDomain.has(d)) queryByDomain.set(d, new Set());
        queryByDomain.get(d)!.add(seed.q);
      }
    } catch (e: any) {
      errors.push({ where: `search:${seed.q}`, message: e?.message ?? "search failed" });
    }
  }

  const domains = Array.from(queryByDomain.keys()).slice(0, maxCandidates);
  const evaluations: CandidateFit[] = [];

  for (const d of domains) {
    try {
      const evalResult = await evaluateDomain(
        d,
        Array.from(queryByDomain.get(d) ?? [])
      );
      if (evalResult) evaluations.push(evalResult);
    } catch (e: any) {
      errors.push({ where: `evaluate:${d}`, message: e?.message ?? "evaluate failed" });
    }
  }

  const sorted = evaluations.sort((a, b) => b.score - a.score);
  const accepted = sorted.filter((x) => x.fit);

  let writeResult: {
    inserted: number;
    skippedExisting: number;
    errors: { where: string; message: string }[];
  } | null = null;

  if (!dryRun && accepted.length > 0) {
    const payload = accepted.map((x) => toSubmission(x, crawlRunId));
    writeResult = await writeSubmissions(payload, { crawlRunId });
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    crawlRunId,
    stats: {
      queryCount: seeds.length,
      rawLinkCount: allLinks.length,
      uniqueDomainCount: queryByDomain.size,
      evaluatedCount: evaluations.length,
      acceptedCount: accepted.length,
      submissionsInserted: writeResult?.inserted ?? 0,
    },
    preview: sorted.slice(0, 20).map((x) => ({
      company_name: x.companyName,
      website: x.website,
      score: x.score,
      fit: x.fit,
      aiHits: x.aiHits,
      commercialHits: x.commercialHits,
      hasImage: x.hasImage,
      hasVideo: x.hasVideo,
      queries: x.queries.slice(0, 2),
    })),
    writeResult,
    errors: [...errors, ...(writeResult?.errors ?? [])],
  });
}

