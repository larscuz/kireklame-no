import { NextResponse } from "next/server";

import {
  googleSearchOrganicResults,
  type SerperOrganic,
} from "@/lib/crawl/searchSerper";
import {
  parseOtherAiServiceCategoryFilter,
  resolveOtherAiServiceCategory,
  type OtherAiServiceCategory,
} from "@/lib/otherAiServices";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CrawlCategory = Extract<
  OtherAiServiceCategory,
  "ai_conference" | "ai_education"
>;

type CrawlPayload = {
  dryRun?: boolean;
  category?: unknown;
  maxQueriesPerCategory?: unknown;
  resultsPerQuery?: unknown;
  maxLeadsPerCategory?: unknown;
};

type Candidate = {
  name: string;
  website: string;
  source_url: string;
  market: "no";
  status: "new";
  description: string | null;
  category: CrawlCategory;
};

type ExistingLeadRow = {
  id: string;
  name: string | null;
  website: string | null;
  description: string | null;
  category: string | null;
};

const QUERY_SEEDS: Record<CrawlCategory, string[]> = {
  ai_conference: [
    "AI konferanse Norge",
    "kunstig intelligens konferanse Norge",
    "AI conference Norway",
    "Norge AI event",
    "maskinlaering konferanse Norge",
  ],
  ai_education: [
    "AI utdanning Norge",
    "kunstig intelligens kurs Norge",
    "AI course Norway",
    "maskinlaering studie Norge",
    "AI university Norway",
  ],
};

const BLOCKED_HOST_SUFFIXES = [
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "youtube.com",
  "youtu.be",
  "x.com",
  "twitter.com",
  "reddit.com",
  "kireklame.no",
];

function makeRunId(): string {
  return `other_ai_${new Date().toISOString().replace(/[:.]/g, "-")}_${Math.random()
    .toString(16)
    .slice(2)}`;
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function canonicalUrl(url: string): string | null {
  const trimmed = String(url ?? "").trim();
  if (!trimmed) return null;

  const withScheme =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;

  try {
    const parsed = new URL(withScheme);
    parsed.hash = "";
    parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
      "mc_cid",
      "mc_eid",
    ].forEach((key) => parsed.searchParams.delete(key));
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function isBlockedHost(host: string): boolean {
  if (!host) return true;
  return BLOCKED_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`)
  );
}

function compactText(input: string, max = 220): string {
  return input.replace(/\s+/g, " ").trim().slice(0, max);
}

function fallbackNameFromHost(host: string): string {
  const base = host.replace(/\.[a-z]{2,}(\.[a-z]{2,})?$/i, "").replace(/[-_]+/g, " ");
  const words = base.split(" ").filter(Boolean);
  if (!words.length) return host;
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .slice(0, 120);
}

function leadNameFromResult(result: SerperOrganic, host: string): string {
  const raw = compactText(String(result.title ?? ""));
  if (!raw) return fallbackNameFromHost(host);

  const main = raw
    .split("|")[0]
    ?.split(" - ")[0]
    ?.split(" – ")[0]
    ?.trim();

  return (main || fallbackNameFromHost(host)).slice(0, 120);
}

function includesAnyKeyword(text: string, words: string[]): boolean {
  const lc = text.toLowerCase();
  return words.some((word) => lc.includes(word));
}

function isRelevant(category: CrawlCategory, result: SerperOrganic, query: string): boolean {
  const haystack = `${result.title ?? ""} ${result.snippet ?? ""} ${query}`.toLowerCase();
  const hasAi =
    /\bai\b/i.test(haystack) ||
    haystack.includes("kunstig intelligens") ||
    haystack.includes("maskinl");

  if (!hasAi) return false;

  if (category === "ai_conference") {
    return includesAnyKeyword(haystack, [
      "konferanse",
      "conference",
      "event",
      "summit",
      "forum",
      "seminar",
    ]);
  }

  return includesAnyKeyword(haystack, [
    "utdanning",
    "kurs",
    "course",
    "studie",
    "study",
    "university",
    "universitet",
    "academy",
    "bootcamp",
    "program",
  ]);
}

function normalizeNameKey(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

function isMissingCategoryColumn(message: string | undefined): boolean {
  const normalized = String(message ?? "").toLowerCase();
  return normalized.includes("column") && normalized.includes("category");
}

function selectedCategories(input: unknown): CrawlCategory[] {
  if (Array.isArray(input)) {
    const parsed = input
      .map((value) => parseOtherAiServiceCategoryFilter(value))
      .filter((value): value is CrawlCategory => value === "ai_conference" || value === "ai_education");
    return parsed.length ? Array.from(new Set(parsed)) : ["ai_conference", "ai_education"];
  }

  const parsed = parseOtherAiServiceCategoryFilter(input);
  if (parsed === "ai_conference" || parsed === "ai_education") {
    return [parsed];
  }

  return ["ai_conference", "ai_education"];
}

export async function POST(req: Request) {
  const key = req.headers.get("x-ingest-key") || "";
  if (!process.env.INGEST_API_KEY || key !== process.env.INGEST_API_KEY) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await req.json().catch(() => ({}))) as CrawlPayload;
  const dryRun = payload.dryRun !== false;
  const categories = selectedCategories(payload.category);
  const maxQueriesPerCategory = clampInt(payload.maxQueriesPerCategory, 1, 5, 4);
  const resultsPerQuery = clampInt(payload.resultsPerQuery, 3, 10, 6);
  const maxLeadsPerCategory = clampInt(payload.maxLeadsPerCategory, 1, 80, 25);
  const crawlRunId = makeRunId();

  const candidatesByUrl = new Map<string, Candidate>();
  const errors: Array<{ where: string; message: string }> = [];
  let queriesRun = 0;

  for (const category of categories) {
    const queries = QUERY_SEEDS[category].slice(0, maxQueriesPerCategory);
    for (const query of queries) {
      queriesRun += 1;
      try {
        const results = await googleSearchOrganicResults(query, {
          gl: "no",
          hl: "no",
          num: resultsPerQuery,
        });

        for (const result of results) {
          const website = canonicalUrl(String(result.link ?? ""));
          if (!website) continue;

          const host = hostFromUrl(website);
          if (isBlockedHost(host)) continue;
          if (!isRelevant(category, result, query)) continue;

          const name = leadNameFromResult(result, host);
          const snippet = compactText(String(result.snippet ?? ""));

          const dedupeKey = `${category}:${website.toLowerCase()}`;
          if (candidatesByUrl.has(dedupeKey)) continue;

          candidatesByUrl.set(dedupeKey, {
            name,
            website,
            source_url: `google:${query}`,
            market: "no",
            status: "new",
            description: snippet || null,
            category,
          });
        }
      } catch (error) {
        errors.push({
          where: `search:${category}:${query}`,
          message: error instanceof Error ? error.message : "search error",
        });
      }
    }
  }

  const perCategoryCount: Record<CrawlCategory, number> = {
    ai_conference: 0,
    ai_education: 0,
  };

  const candidates = Array.from(candidatesByUrl.values())
    .sort((a, b) => a.name.localeCompare(b.name, "no"))
    .filter((candidate) => {
      if (perCategoryCount[candidate.category] >= maxLeadsPerCategory) return false;
      perCategoryCount[candidate.category] += 1;
      return true;
    });

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      crawlRunId,
      stats: {
        categories,
        queriesRun,
        candidates: candidates.length,
        perCategoryCount,
        errors,
      },
      preview: candidates.slice(0, 40),
    });
  }

  const db = supabaseAdmin();

  const { data: existingRows, error: existingError } = await db
    .from("ad_leads")
    .select("id,name,website,description,category")
    .or("market.eq.no,market.is.null");

  if (existingError) {
    if (isMissingCategoryColumn(existingError.message)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Missing ad_leads.category column. Run supabase/ad-leads-categories-2026-02-22.sql first.",
          details: existingError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: false, error: existingError.message },
      { status: 500 }
    );
  }

  const existingByCategoryAndWebsite = new Map<string, ExistingLeadRow>();
  const existingByCategoryAndName = new Map<string, ExistingLeadRow>();

  for (const row of (existingRows ?? []) as ExistingLeadRow[]) {
    const resolvedCategory = resolveOtherAiServiceCategory(
      row.category,
      row.name,
      row.description
    );
    if (resolvedCategory !== "ai_conference" && resolvedCategory !== "ai_education") {
      continue;
    }

    const normalizedWebsite = canonicalUrl(String(row.website ?? ""));
    if (normalizedWebsite) {
      existingByCategoryAndWebsite.set(
        `${resolvedCategory}:${normalizedWebsite.toLowerCase()}`,
        row
      );
    }

    const nameKey = normalizeNameKey(row.name);
    if (nameKey) {
      existingByCategoryAndName.set(`${resolvedCategory}:${nameKey}`, row);
    }
  }

  const toInsert: Candidate[] = [];
  const toUpdate: Array<{ id: string; payload: Candidate }> = [];

  for (const candidate of candidates) {
    const keyByWebsite = `${candidate.category}:${candidate.website.toLowerCase()}`;
    const keyByName = `${candidate.category}:${normalizeNameKey(candidate.name)}`;

    const existing =
      existingByCategoryAndWebsite.get(keyByWebsite) ??
      existingByCategoryAndName.get(keyByName);

    if (existing) {
      toUpdate.push({
        id: existing.id,
        payload: candidate,
      });
      continue;
    }

    toInsert.push(candidate);
  }

  let updated = 0;
  let inserted = 0;

  for (const update of toUpdate) {
    const { error } = await db
      .from("ad_leads")
      .update(update.payload)
      .eq("id", update.id);

    if (error) {
      errors.push({
        where: `update:${update.id}`,
        message: error.message,
      });
      continue;
    }

    updated += 1;
  }

  if (toInsert.length > 0) {
    const { error } = await db.from("ad_leads").insert(toInsert);
    if (error) {
      if (isMissingCategoryColumn(error.message)) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Missing ad_leads.category column. Run supabase/ad-leads-categories-2026-02-22.sql first.",
            details: error.message,
          },
          { status: 500 }
        );
      }

      errors.push({ where: "insert", message: error.message });
    } else {
      inserted = toInsert.length;
    }
  }

  return NextResponse.json({
    ok: errors.length === 0,
    dryRun: false,
    crawlRunId,
    stats: {
      categories,
      queriesRun,
      candidates: candidates.length,
      updated,
      inserted,
      skipped: candidates.length - updated - inserted,
      errors,
    },
  });
}
