import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";

export type ShowreelItem = {
  id: string;
  name: string;
  href: string;
  videoUrl: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  eyebrow?: string | null;
  ctaLabel?: string | null;
  source?: "cms" | "cloudflare" | "company";
};

export type ShowreelCmsRow = {
  id: string;
  name: string;
  href: string;
  video_url: string;
  description: string | null;
  thumbnail_url: string | null;
  eyebrow: string | null;
  cta_label: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ShowreelDuplicateGroup<T> = {
  normalizedVideoUrl: string;
  items: T[];
};

function isAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function normalizeUrlForDedup(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.searchParams.sort();
    const pathname = parsed.pathname.replace(/\/+$/, "");
    const search = parsed.searchParams.toString();
    return `${parsed.protocol.toLowerCase()}//${parsed.host.toLowerCase()}${pathname}${search ? `?${search}` : ""}`;
  } catch {
    return url.trim();
  }
}

export function getDirectMp4Url(raw: string | null | undefined): string | null {
  const url = String(raw ?? "").trim();
  if (!isAbsoluteHttpUrl(url)) return null;

  const lower = url.toLowerCase();
  const marker = lower.indexOf(".mp4");
  if (marker === -1) return null;
  const tail = lower.slice(marker + 4);
  if (tail && !tail.startsWith("?") && !tail.startsWith("&")) return null;
  return url;
}

export function normalizeShowreelVideoUrl(raw: string | null | undefined): string {
  const mp4 = getDirectMp4Url(raw);
  if (!mp4) return "";
  return normalizeUrlForDedup(mp4);
}

export function titleFromFileName(value: string): string {
  const tail = String(value ?? "").split("/").filter(Boolean).pop() ?? value;
  const base = tail.replace(/\.[a-z0-9]+$/i, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function parseCloudflareShowreels(args: {
  locale: Locale;
  rawEntries?: string | null;
  baseDir?: string | null;
  fallbackHref?: string | null;
}): ShowreelItem[] {
  const rawEntries = String(
    args.rawEntries ?? process.env.SHOWREEL_CLOUDFLARE_VIDEOS ?? ""
  ).trim();
  if (!rawEntries) return [];

  const baseDir = String(
    args.baseDir ?? process.env.SHOWREEL_CLOUDFLARE_DIR_URL ?? ""
  )
    .trim()
    .replace(/\/+$/, "");

  const fallbackHref = String(
    args.fallbackHref ??
      process.env.SHOWREEL_CLOUDFLARE_DEFAULT_HREF ??
      localizePath(args.locale, "/kontakt")
  ).trim();

  const defaultDescription =
    args.locale === "en" ? "Cloudflare showreel" : "Cloudflare-showreel";

  const out: ShowreelItem[] = [];
  for (const [idx, chunk] of rawEntries.split(",").entries()) {
    const entry = chunk.trim();
    if (!entry) continue;

    const parts = entry.split("|").map((item) => item.trim());
    const ref = parts[0] ?? "";
    const explicitName = parts[1] ?? "";
    const explicitHref = parts[2] ?? "";
    const explicitThumb = parts[3] ?? "";
    const explicitEyebrow = parts[4] ?? "";
    const explicitCta = parts[5] ?? "";
    if (!ref) continue;

    const resolvedUrl = isAbsoluteHttpUrl(ref)
      ? ref
      : baseDir
        ? `${baseDir}/${ref.replace(/^\/+/, "")}`
        : "";
    const videoUrl = getDirectMp4Url(resolvedUrl);
    if (!videoUrl) continue;

    const thumbCandidate = isAbsoluteHttpUrl(explicitThumb)
      ? explicitThumb
      : explicitThumb && baseDir
        ? `${baseDir}/${explicitThumb.replace(/^\/+/, "")}`
        : null;

    out.push({
      id: `cf-${idx}`,
      name: explicitName || titleFromFileName(ref) || `Showreel ${idx + 1}`,
      href: explicitHref || fallbackHref || localizePath(args.locale, "/kontakt"),
      videoUrl,
      description: defaultDescription,
      thumbnailUrl: thumbCandidate,
      eyebrow: explicitEyebrow || "Cloudflare",
      ctaLabel: explicitCta || null,
      source: "cloudflare",
    });
  }

  return out;
}

export function mapShowreelCmsRows(rows: ShowreelCmsRow[]): ShowreelItem[] {
  const out: ShowreelItem[] = [];
  for (const row of rows) {
    if (!row.is_active) continue;
    const videoUrl = getDirectMp4Url(row.video_url);
    if (!videoUrl) continue;
    out.push({
      id: row.id,
      name: row.name,
      href: row.href,
      videoUrl,
      description: row.description,
      thumbnailUrl: row.thumbnail_url,
      eyebrow: row.eyebrow,
      ctaLabel: row.cta_label,
      source: "cms",
    });
  }
  return out;
}

export function dedupeShowreelItems(items: ShowreelItem[]): ShowreelItem[] {
  const seen = new Set<string>();
  const out: ShowreelItem[] = [];
  for (const item of items) {
    const key = normalizeShowreelVideoUrl(item.videoUrl) || item.videoUrl.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export function findShowreelDuplicates<T>(
  items: T[],
  getUrl: (item: T) => string | null | undefined
): ShowreelDuplicateGroup<T>[] {
  const buckets = new Map<string, T[]>();
  for (const item of items) {
    const key = normalizeShowreelVideoUrl(getUrl(item));
    if (!key) continue;
    const current = buckets.get(key) ?? [];
    current.push(item);
    buckets.set(key, current);
  }

  return [...buckets.entries()]
    .filter(([, grouped]) => grouped.length > 1)
    .map(([normalizedVideoUrl, grouped]) => ({
      normalizedVideoUrl,
      items: grouped,
    }));
}
