import { NextResponse } from "next/server";
import targets from "@/lib/crawl/targets.json";
import type { CrawlStats } from "@/lib/crawl/types";
import { writeSubmissions, type SubmissionInsert } from "@/lib/crawl/writeSubmissions";
import { googleSearchTopLink } from "@/lib/crawl/searchSerper";

export const runtime = "nodejs";

function canonicalHost(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function makeRunId() {
  return `crawl_${new Date().toISOString().replace(/[:.]/g, "-")}_${Math.random().toString(16).slice(2)}`;
}

export async function POST(req: Request) {
  const key = req.headers.get("x-ingest-key") || "";
  if (!process.env.INGEST_API_KEY || key !== process.env.INGEST_API_KEY) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const crawlRunId = makeRunId();

  const stats: CrawlStats = {
    seeds: Array.isArray(targets) ? targets.length : 0,
    fetched: 0,
    candidatesFound: 0,
    submissionsInserted: 0,
    skippedExisting: 0,
    errors: [],
  };

  const items: SubmissionInsert[] = [];

  // targets.json må være ["AIAIAI", "Reimagine", ...]
  const names = (Array.isArray(targets) ? targets : [])
    .map((x) => String(x || "").trim())
    .filter(Boolean);

  for (const name of names) {
    try {
      // 1) Google-søk: “<navn> Norge offisiell nettside”
      const q = `${name} Norge offisiell nettside`;
      const top = await googleSearchTopLink(q);
      stats.fetched += 1;

      if (!top) {
        stats.errors.push({ where: name, message: "No search results" });
        continue;
      }

      const website = top;
      const domain = canonicalHost(website);

      // ✅ DEBUG
      console.log("[targets] hit", { name, q, website, domain });

      stats.candidatesFound += 1;

      items.push({
        company_name: name,      // NOT NULL i din Supabase
        website,
        location: null,
        source_url: `google:${q}`, // så vi ser queryen i moderering
        crawl_run_id: crawlRunId,
        evidence: { from: "google_serper", query: q, top },
      });
    } catch (e: any) {
      stats.errors.push({ where: name, message: e?.message || "search error" });
    }
  }

  try {
    const w = await writeSubmissions(items, { crawlRunId });
    stats.submissionsInserted += w.inserted;
    stats.skippedExisting += w.skippedExisting;
    stats.errors.push(...w.errors);
  } catch (e: any) {
    stats.errors.push({ where: "writeSubmissions", message: e?.message || "write error" });
  }

  return NextResponse.json({ ok: true, stats });
}
