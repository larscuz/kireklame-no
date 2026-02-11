import { createHash } from "node:crypto";
import { slugify } from "@/lib/slug";
import {
  NEWS_PERSPECTIVES,
  NEWS_STATUSES,
  type NewsPerspective,
  type NewsStatus,
} from "@/lib/news/types";

export function canonicalizeNewsUrl(raw: string): string {
  const input = String(raw ?? "").trim();
  if (!input) return "";

  const withScheme =
    input.startsWith("http://") || input.startsWith("https://")
      ? input
      : `https://${input}`;

  try {
    const url = new URL(withScheme);
    url.hash = "";
    url.hostname = url.hostname.replace(/^www\./, "").toLowerCase();

    const dropParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
      "mc_cid",
      "mc_eid",
    ];
    for (const param of dropParams) {
      url.searchParams.delete(param);
    }

    if (
      (url.protocol === "https:" && url.port === "443") ||
      (url.protocol === "http:" && url.port === "80")
    ) {
      url.port = "";
    }

    if (url.pathname !== "/") {
      url.pathname = url.pathname.replace(/\/+$/, "");
    }

    return url.toString();
  } catch {
    return input;
  }
}

export function domainFromUrl(raw: string): string | null {
  const input = canonicalizeNewsUrl(raw);
  if (!input) return null;
  try {
    return new URL(input).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

type FallbackTitleLocale = "no" | "generic";

const TITLE_ACRONYM_MAP = new Map<string, string>([
  ["ai", "AI"],
  ["ki", "KI"],
  ["nrk", "NRK"],
  ["tv", "TV"],
  ["tv2", "TV 2"],
  ["pr", "PR"],
  ["eu", "EU"],
  ["usa", "USA"],
  ["uk", "UK"],
  ["wpp", "WPP"],
  ["ipg", "IPG"],
  ["gk", "GK"],
  ["llm", "LLM"],
  ["api", "API"],
]);

const TITLE_LOWERCASE_WORDS = new Set<string>([
  "og",
  "i",
  "på",
  "til",
  "for",
  "av",
  "med",
  "om",
  "fra",
  "the",
  "of",
  "and",
  "in",
  "to",
  "on",
  "a",
  "an",
]);

function extractTitleSegmentFromUrl(sourceUrl: string): string | null {
  try {
    const url = new URL(sourceUrl);
    const segments = url.pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => decodeURIComponent(segment));
    if (!segments.length) return null;

    let candidate = segments[segments.length - 1] ?? "";
    candidate = candidate.replace(/\.[a-z0-9]{2,5}$/i, "");
    if (/^\d{4,}$/.test(candidate) && segments.length >= 2) {
      candidate = segments[segments.length - 2] ?? candidate;
    }
    return candidate || null;
  } catch {
    return null;
  }
}

function titleCaseWords(words: string[], locale: FallbackTitleLocale): string[] {
  const out: string[] = [];
  for (let i = 0; i < words.length; i += 1) {
    const raw = words[i] ?? "";
    const cleaned = raw.replace(/^[^a-z0-9æøå]+|[^a-z0-9æøå%]+$/gi, "");
    if (!cleaned) continue;

    const lc = cleaned.toLowerCase();
    const prev = out[out.length - 1]?.toLowerCase() ?? "";

    if (locale === "no" && lc === "a" && ["til", "for", "om", "fra", "ved", "uten"].includes(prev)) {
      out.push("å");
      continue;
    }
    if (locale === "no" && lc === "na") {
      out.push("nå");
      continue;
    }
    if (locale === "no" && lc === "pa") {
      out.push("på");
      continue;
    }

    const acronym = TITLE_ACRONYM_MAP.get(lc);
    if (acronym) {
      out.push(acronym);
      continue;
    }

    if (/^\d+%$/.test(lc) || /^\d+$/.test(lc)) {
      out.push(lc);
      continue;
    }

    const shouldLowercase = TITLE_LOWERCASE_WORDS.has(lc) && i > 0 && i < words.length - 1;
    if (shouldLowercase) {
      out.push(lc);
      continue;
    }

    out.push(`${lc.slice(0, 1).toUpperCase()}${lc.slice(1)}`);
  }
  return out;
}

export function fallbackNewsTitleFromUrl(
  sourceUrl: string,
  locale: FallbackTitleLocale = "generic",
  fallback = "Kuratert kilde"
): string {
  const segment = extractTitleSegmentFromUrl(sourceUrl);
  if (!segment) return fallback;

  const normalized = segment
    .replace(/[+_]+/g, " ")
    .replace(/[-–—]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  if (!normalized) return fallback;

  const words = normalized.split(" ").filter(Boolean);
  const titled = titleCaseWords(words, locale).join(" ").trim();
  return cleanText(titled, 220) ?? fallback;
}

export function stableNewsSlug(title: string, sourceUrl: string): string {
  const base = slugify(title || "sak").slice(0, 72) || "sak";
  const hash = createHash("sha1").update(sourceUrl).digest("hex").slice(0, 8);
  return `${base}-${hash}`;
}

export function parseTopicTagsCsv(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(",")) {
    const tag = slugify(part).replace(/-/g, "_");
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
    if (out.length >= 16) break;
  }
  return out;
}

export function topicTagsToCsv(tags: string[] | null | undefined): string {
  return (tags ?? []).join(", ");
}

export function coerceNewsStatus(value: string | null | undefined, fallback: NewsStatus): NewsStatus {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (NEWS_STATUSES.includes(normalized as NewsStatus)) {
    return normalized as NewsStatus;
  }
  return fallback;
}

export function coerceNewsPerspective(
  value: string | null | undefined,
  fallback: NewsPerspective
): NewsPerspective {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (NEWS_PERSPECTIVES.includes(normalized as NewsPerspective)) {
    return normalized as NewsPerspective;
  }
  return fallback;
}

export function cleanText(input: string | null | undefined, limit = 240): string | null {
  const trimmed = String(input ?? "").replace(/\s+/g, " ").trim();
  if (!trimmed) return null;
  return trimmed.length > limit ? `${trimmed.slice(0, limit - 1)}…` : trimmed;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
