import { stripHtml } from "@/lib/news/utils";

const BLOCKED_CONTENT_PATTERNS = [
  /attention required/i,
  /just a moment/i,
  /checking (if|your) .* secure/i,
  /verify you are human/i,
  /enable javascript/i,
  /please turn javascript on/i,
  /cloudflare/i,
  /access denied/i,
];

const NAV_NOISE_PATTERNS = [
  /jump to main content/i,
  /vis flere resultater/i,
  /søk i (vårt|arkiv)/i,
  /jobb\s+kontakt\s+annonsere/i,
  /logg inn/i,
];

type FetchOptions = {
  timeoutMs?: number;
};

type FetchResult = {
  ok: boolean;
  status: number;
  text: string;
  source?: "direct" | "readable_fallback";
};

async function fetchWithTimeout(url: string, timeoutMs: number, accept: string): Promise<FetchResult> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "user-agent":
          "KiReklameBot/0.1 (respectful; contact: kireklame.no) Node/Next",
        accept,
      },
      signal: controller.signal
    });

    const text = await res.text();
    return { ok: res.ok, status: res.status, text, source: "direct" };
  } finally {
    clearTimeout(t);
  }
}

export async function fetchText(url: string, opts?: FetchOptions): Promise<FetchResult> {
  const timeoutMs = opts?.timeoutMs ?? 12_000;
  return fetchWithTimeout(
    url,
    timeoutMs,
    "text/html,application/xml,text/xml,application/rss+xml,application/json;q=0.9,*/*;q=0.8"
  );
}

function looksBlockedOrThin(text: string, minPlainLength: number): boolean {
  const sample = String(text ?? "").slice(0, 8000);
  if (BLOCKED_CONTENT_PATTERNS.some((pattern) => pattern.test(sample))) return true;
  const plain = stripHtml(sample);
  return plain.length < minPlainLength;
}

function readableQualityScore(text: string): number {
  const plain = stripHtml(String(text ?? ""));
  if (!plain) return 0;
  const words = plain.split(/\s+/g).filter(Boolean).length;
  const sentenceCount = plain.split(/[.!?]+\s+/g).filter(Boolean).length;
  const avgSentenceWords = words / Math.max(1, sentenceCount);

  let score = 0;
  score += Math.min(plain.length, 6000) / 120;
  score += Math.min(sentenceCount, 36) * 1.1;
  if (avgSentenceWords > 56) score -= 12;
  if (BLOCKED_CONTENT_PATTERNS.some((pattern) => pattern.test(plain))) score -= 35;
  if (NAV_NOISE_PATTERNS.some((pattern) => pattern.test(plain))) score -= 10;
  return score;
}

function jinaReadableUrl(sourceUrl: string): string {
  const normalized = String(sourceUrl ?? "").trim().replace(/^https?:\/\//i, "");
  return `https://r.jina.ai/http://${normalized}`;
}

async function fetchReadableFallback(sourceUrl: string, timeoutMs: number): Promise<FetchResult> {
  const fallbackUrl = jinaReadableUrl(sourceUrl);
  const res = await fetchWithTimeout(
    fallbackUrl,
    timeoutMs,
    "text/plain,text/markdown;q=0.9,text/html;q=0.8,*/*;q=0.7"
  );
  return { ...res, source: "readable_fallback" };
}

export async function fetchTextBestEffort(
  sourceUrl: string,
  opts?: FetchOptions & {
    minPlainLength?: number;
    readableFallback?: boolean;
    alwaysTryReadableFallback?: boolean;
  }
): Promise<FetchResult> {
  const timeoutMs = opts?.timeoutMs ?? 12_000;
  const minPlainLength = Math.max(300, Number(opts?.minPlainLength ?? 1200));
  const useFallback = opts?.readableFallback !== false;
  const alwaysTryFallback = opts?.alwaysTryReadableFallback === true;

  let direct: FetchResult;
  try {
    direct = await fetchText(sourceUrl, { timeoutMs });
  } catch {
    direct = { ok: false, status: 0, text: "", source: "direct" };
  }

  if (!useFallback) return direct;

  const shouldFallback =
    alwaysTryFallback || !direct.ok || looksBlockedOrThin(direct.text, minPlainLength);
  if (!shouldFallback) return direct;

  try {
    const fallback = await fetchReadableFallback(sourceUrl, timeoutMs);
    if (!fallback.ok) return direct;
    const directScore = readableQualityScore(direct.text);
    const fallbackScore = readableQualityScore(fallback.text);
    if (!direct.ok || fallbackScore >= directScore + 4) return fallback;
  } catch {
    // keep direct
  }

  return direct;
}
