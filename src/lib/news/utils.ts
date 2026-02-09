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
