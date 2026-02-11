import { cleanText, stripHtml } from "@/lib/news/utils";
import type { NewsPerspective } from "@/lib/news/types";

const PAYWALL_SIGNALS = [
  "kun for abonnenter",
  "betalingsmur",
  "for abonnenter",
  "subscriber-only",
  "logg inn for å lese",
  "du har nådd",
  "du har lest",
  "for å lese videre",
  "for å lese mer",
  "premium",
  "piano-id",
  "metered",
];

const NORWEGIAN_HINTS = [
  "ikke",
  "med",
  "som",
  "dette",
  "markedsføring",
  "reklame",
  "annonse",
  "norge",
  "bedrift",
  "satsing",
];

const CRITICAL_HINTS = [
  "kritikk",
  "problem",
  "feil",
  "risiko",
  "varsler",
  "misvisende",
  "bekymring",
  "reaksjon",
  "motstand",
  "kritiserer",
  "villedende",
];

const ADOPTION_HINTS = [
  "satser",
  "investerer",
  "lanserer",
  "innfører",
  "skalerer",
  "effektiviserer",
  "kutter kostnader",
  "automatiserer",
  "vekst",
];

const INDUSTRY_BRAND_HINTS = [
  "dentsu",
  "wpp",
  "groupm",
  "publicis",
  "omnicom",
  "ipg",
  "apriil",
  "try",
  "schibsted",
  "aller",
  "egmont",
];

const AI_PHRASE_HINTS = [
  "kunstig intelligens",
  "artificial intelligence",
  "generativ",
  "genai",
  "chatgpt",
  "openai",
  "llm",
  "maskinlæring",
  "copilot",
  "claude",
  "gemini",
  "midjourney",
  "runway",
];

const MARKETING_CONTEXT_HINTS = [
  "reklame",
  "markedsføring",
  "annonse",
  "byrå",
  "mediebyrå",
  "reklamebyrå",
  "medie",
  "kommunikasjon",
  "kampanje",
  "merkevare",
  "annonsering",
];

function htmlDecode(input: string): string {
  const namedDecoded = input
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  // Decode numeric entities like &#248; and &#xF8; so Norwegian letters render correctly.
  return namedDecoded
    .replace(/&#(\d+);/g, (_m, dec: string) => {
      const code = Number.parseInt(dec, 10);
      if (!Number.isFinite(code) || code <= 0) return _m;
      try {
        return String.fromCodePoint(code);
      } catch {
        return _m;
      }
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, hex: string) => {
      const code = Number.parseInt(hex, 16);
      if (!Number.isFinite(code) || code <= 0) return _m;
      try {
        return String.fromCodePoint(code);
      } catch {
        return _m;
      }
    });
}

type MetaLookup = Map<string, string[]>;

function extractAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRe = /([a-zA-Z:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match: RegExpExecArray | null;
  while ((match = attrRe.exec(tag))) {
    const key = String(match[1] ?? "").toLowerCase();
    const value = String(match[2] ?? match[3] ?? match[4] ?? "").trim();
    if (!key || !value) continue;
    attrs[key] = htmlDecode(value);
  }
  return attrs;
}

function buildMetaLookup(html: string): MetaLookup {
  const lookup: MetaLookup = new Map();
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of tags.slice(0, 5000)) {
    const attrs = extractAttributes(tag);
    const key = attrs.property ?? attrs.name ?? attrs.itemprop ?? attrs["http-equiv"] ?? "";
    const content = attrs.content ?? "";
    if (!key || !content) continue;

    const normalizedKey = key.toLowerCase().trim();
    const normalizedContent = cleanText(content, 2000);
    if (!normalizedContent) continue;

    const list = lookup.get(normalizedKey) ?? [];
    if (!list.includes(normalizedContent)) {
      list.push(normalizedContent);
      lookup.set(normalizedKey, list);
    }
  }

  return lookup;
}

function firstMetaContent(lookup: MetaLookup, keys: string[], limit = 500): string | null {
  for (const rawKey of keys) {
    const key = rawKey.toLowerCase();
    const values = lookup.get(key);
    if (!values?.length) continue;
    const value = cleanText(values[0], limit);
    if (value) return value;
  }
  return null;
}

function toAbsoluteUrl(input: string | null | undefined, sourceUrl?: string | null): string | null {
  const raw = String(input ?? "").trim();
  if (!raw) return null;
  if (raw.startsWith("data:")) return null;

  try {
    if (raw.startsWith("//")) {
      const proto = sourceUrl?.startsWith("http://") ? "http:" : "https:";
      return new URL(`${proto}${raw}`).toString();
    }
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      return new URL(raw).toString();
    }
    if (sourceUrl) {
      return new URL(raw, sourceUrl).toString();
    }
  } catch {
    return null;
  }

  return null;
}

function isLikelyDecorativeImage(url: string): boolean {
  const lc = url.toLowerCase();
  if (lc.endsWith(".svg") || lc.endsWith(".ico")) return true;
  return (
    lc.includes("logo") ||
    lc.includes("icon") ||
    lc.includes("avatar") ||
    lc.includes("sprite") ||
    lc.includes("pixel") ||
    lc.includes("placeholder")
  );
}

function candidateImageFromJsonLd(node: unknown, sourceUrl?: string | null): string | null {
  if (!node || typeof node !== "object") return null;

  const n = node as Record<string, unknown>;
  const image = n.image;

  if (typeof image === "string") {
    return toAbsoluteUrl(image, sourceUrl);
  }

  if (Array.isArray(image)) {
    for (const part of image) {
      if (typeof part === "string") {
        const resolved = toAbsoluteUrl(part, sourceUrl);
        if (resolved) return resolved;
      } else if (part && typeof part === "object") {
        const fromObject = toAbsoluteUrl(
          String((part as Record<string, unknown>).url ?? ""),
          sourceUrl
        );
        if (fromObject) return fromObject;
      }
    }
  }

  if (image && typeof image === "object") {
    const fromObject = toAbsoluteUrl(
      String((image as Record<string, unknown>).url ?? ""),
      sourceUrl
    );
    if (fromObject) return fromObject;
  }

  for (const value of Object.values(n)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const nested = candidateImageFromJsonLd(item, sourceUrl);
        if (nested) return nested;
      }
      continue;
    }
    const nested = candidateImageFromJsonLd(value, sourceUrl);
    if (nested) return nested;
  }

  return null;
}

function imageFromJsonLd(html: string, sourceUrl?: string | null): string | null {
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = re.exec(html))) {
    const rawJson = String(match[1] ?? "").trim();
    if (!rawJson) continue;
    try {
      const parsed = JSON.parse(rawJson);
      const image = candidateImageFromJsonLd(parsed, sourceUrl);
      if (image) return image;
    } catch {
      // skip invalid json-ld blocks
    }
  }

  return null;
}

function imageFromHtmlTag(html: string, sourceUrl?: string | null): string | null {
  const imgRe = /<img\b[^>]*>/gi;
  let match: RegExpExecArray | null;
  let seen = 0;

  while ((match = imgRe.exec(html))) {
    seen += 1;
    if (seen > 80) break;

    const attrs = extractAttributes(match[0]);
    const candidate =
      attrs.src ??
      attrs["data-src"] ??
      attrs["data-original"] ??
      (attrs.srcset ? attrs.srcset.split(",")[0]?.trim().split(" ")[0] : "");

    const resolved = toAbsoluteUrl(candidate, sourceUrl);
    if (!resolved) continue;
    if (isLikelyDecorativeImage(resolved)) continue;
    return resolved;
  }

  return null;
}

function heroImageFromHtml(
  html: string,
  lookup: MetaLookup,
  sourceUrl?: string | null
): string | null {
  const metaCandidates = [
    "og:image",
    "og:image:url",
    "og:image:secure_url",
    "twitter:image",
    "twitter:image:src",
    "parsely-image-url",
    "thumbnail",
    "image",
  ];

  for (const key of metaCandidates) {
    const fromMeta = firstMetaContent(lookup, [key], 1800);
    const resolved = toAbsoluteUrl(fromMeta, sourceUrl);
    if (resolved && !isLikelyDecorativeImage(resolved)) return resolved;
  }

  const fromJsonLd = imageFromJsonLd(html, sourceUrl);
  if (fromJsonLd && !isLikelyDecorativeImage(fromJsonLd)) return fromJsonLd;

  const fromImg = imageFromHtmlTag(html, sourceUrl);
  if (fromImg) return fromImg;

  return null;
}

function titleFromHtml(html: string, lookup: MetaLookup): string | null {
  const og = firstMetaContent(lookup, ["og:title", "twitter:title", "parsely-title"]);
  if (og) return og;

  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match?.[1]) return null;
  return cleanText(htmlDecode(match[1]), 220);
}

function isoFromRawDate(raw: string | null): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function publishedAtFromHtml(html: string, lookup: MetaLookup): string | null {
  const meta = firstMetaContent(lookup, [
    "article:published_time",
    "article:modified_time",
    "og:updated_time",
    "publish-date",
    "date",
    "parsely-pub-date",
  ]);
  const parsedMeta = isoFromRawDate(meta);
  if (parsedMeta) return parsedMeta;

  const timeTag = html.match(/<time[^>]+datetime=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;
  return isoFromRawDate(timeTag);
}

function isLikelyPaywalled(html: string): boolean {
  const lc = html.toLowerCase();
  let hits = 0;
  for (const signal of PAYWALL_SIGNALS) {
    if (lc.includes(signal)) hits += 1;
  }
  if (hits >= 2) return true;
  return (
    lc.includes("kun for abonnenter") ||
    lc.includes("for abonnenter") ||
    lc.includes("subscriber-only") ||
    lc.includes("logg inn for å lese")
  );
}

export function detectLikelyNorwegian(text: string): boolean {
  const lc = text.toLowerCase();
  let hits = 0;
  for (const marker of NORWEGIAN_HINTS) {
    if (lc.includes(marker)) hits += 1;
  }
  const norwegianChars = (lc.match(/[æøå]/g) ?? []).length;
  return hits >= 2 || norwegianChars >= 2;
}

export function classifyPerspective(text: string): NewsPerspective {
  const lc = text.toLowerCase();
  const criticalHits = CRITICAL_HINTS.reduce((acc, word) => (lc.includes(word) ? acc + 1 : acc), 0);
  const adoptionHits = ADOPTION_HINTS.reduce((acc, word) => (lc.includes(word) ? acc + 1 : acc), 0);

  if (criticalHits >= adoptionHits + 1 && criticalHits > 0) return "critical";
  if (adoptionHits >= criticalHits + 1 && adoptionHits > 0) return "adoption";
  return "neutral";
}

export function looksRelevantToAIMarketing(text: string): boolean {
  const lc = text.toLowerCase();
  const aiHits =
    (/\bki\b/.test(lc) ? 1 : 0) +
    (/\bai\b/.test(lc) ? 1 : 0) +
    (lc.includes("kunstig intelligens") ? 1 : 0);
  const marketingHits = MARKETING_CONTEXT_HINTS.reduce(
    (acc, word) => (lc.includes(word) ? acc + 1 : acc),
    0
  );
  const industryHits = INDUSTRY_BRAND_HINTS.reduce(
    (acc, brand) => (lc.includes(brand) ? acc + 1 : acc),
    0
  );
  return aiHits >= 1 && (marketingHits >= 1 || industryHits >= 1);
}

export function looksRelevantToAIMarketingArticle(args: {
  title?: string | null;
  excerpt?: string | null;
  plainText?: string | null;
}): boolean {
  const title = cleanText(args.title ?? "", 260) ?? "";
  const excerpt = cleanText(args.excerpt ?? "", 420) ?? "";
  const leadText = `${title} ${excerpt}`.trim();
  if (!leadText) return false;

  // Require explicit AI/KI signal in the visible lead text to avoid
  // false positives where navigation/body noise contains random AI terms.
  if (!hasAISignal(leadText)) return false;

  const bodySample = cleanText(args.plainText ?? "", 6_000) ?? "";
  const relevanceText = `${leadText} ${bodySample}`.trim();
  return looksRelevantToAIMarketing(relevanceText);
}

export function hasAISignal(text: string): boolean {
  const lc = String(text ?? "").toLowerCase();
  if (!lc.trim()) return false;
  if (/\bki\b/u.test(lc) || /\bai\b/u.test(lc)) return true;
  return AI_PHRASE_HINTS.some((phrase) => lc.includes(phrase));
}

export function hasStrongAISignal(text: string): boolean {
  const lc = String(text ?? "").toLowerCase();
  if (!lc.trim()) return false;
  if (AI_PHRASE_HINTS.some((phrase) => lc.includes(phrase))) return true;
  return /\b(ai|ki)[- ]?(modell|verkt(ø|o)y|teknologi|l(ø|o)sning|agent|drevet|generert|satsing|bruk)\b/u.test(
    lc
  );
}

export type ExtractedArticle = {
  title: string | null;
  excerpt: string | null;
  heroImageUrl: string | null;
  publishedAt: string | null;
  isPaywalled: boolean;
  paywallNote: string | null;
  language: "no" | "unknown";
  perspective: NewsPerspective;
  plainText: string;
};

export function extractArticleSignals(args: {
  html: string;
  sourceUrl?: string | null;
  fallbackTitle?: string | null;
  fallbackSnippet?: string | null;
}): ExtractedArticle {
  const html = args.html ?? "";
  const lookup = buildMetaLookup(html);
  const plainText = stripHtml(html).slice(0, 30_000);
  const combinedText = `${args.fallbackTitle ?? ""} ${args.fallbackSnippet ?? ""} ${plainText}`.trim();

  const title = titleFromHtml(html, lookup) ?? cleanText(args.fallbackTitle ?? "", 220);
  const excerpt =
    firstMetaContent(lookup, ["description", "og:description", "twitter:description"]) ??
    cleanText(args.fallbackSnippet ?? "", 420);
  const heroImageUrl = heroImageFromHtml(html, lookup, args.sourceUrl);
  const publishedAt = publishedAtFromHtml(html, lookup);
  const isPaywalled = isLikelyPaywalled(html);
  const paywallNote = isPaywalled ? "Artikkelen ser ut til å ligge bak betalingsmur." : null;
  const language: "no" | "unknown" = detectLikelyNorwegian(combinedText) ? "no" : "unknown";
  const perspective = classifyPerspective(combinedText);

  return {
    title,
    excerpt,
    heroImageUrl,
    publishedAt,
    isPaywalled,
    paywallNote,
    language,
    perspective,
    plainText,
  };
}
