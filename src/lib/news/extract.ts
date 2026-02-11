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

const EXCERPT_NOISE_PATTERNS = [
  /\babonner(er|er du allerede)?\b/i,
  /\blogg inn\b/i,
  /\bfor å lese denne saken\b/i,
  /\bbli abonnent\b/i,
  /\bcookie\b/i,
  /\bpersonvern\b/i,
  /\bvilkår\b/i,
];

function htmlDecode(input: string): string {
  const namedDecoded = input
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/gi, " ")
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

function cleanFragmentText(fragment: string | null | undefined, limit = 520): string | null {
  const raw = String(fragment ?? "").trim();
  if (!raw) return null;
  return cleanText(stripHtml(htmlDecode(raw)), limit);
}

type ExcerptSource = "meta" | "lead" | "h2" | "p" | "fallback";
type ExcerptCandidate = {
  text: string;
  source: ExcerptSource;
  order: number;
};

function excerptScore(candidate: ExcerptCandidate): number {
  const text = candidate.text;
  const lc = text.toLowerCase();
  let score = 0;

  if (text.length >= 80 && text.length <= 320) score += 3;
  else if (text.length >= 50 && text.length <= 420) score += 1.5;
  else score -= 1;

  if (candidate.source === "lead") score += 4.0;
  else if (candidate.source === "h2") score += 3.2;
  else if (candidate.source === "p") score += 1.8;
  else if (candidate.source === "meta") score += 1.0;
  else score += 0.4;

  // Slight preference for earlier visible candidates in the document.
  score += Math.max(0, 1.6 - candidate.order * 0.08);

  if (hasAISignal(text)) score += 2.2;

  const marketingHits = MARKETING_CONTEXT_HINTS.reduce(
    (acc, word) => (lc.includes(word) ? acc + 1 : acc),
    0
  );
  score += Math.min(marketingHits, 3) * 0.9;

  if (EXCERPT_NOISE_PATTERNS.some((pattern) => pattern.test(text))) score -= 8;
  if (/^publisert\b/i.test(text)) score -= 2;
  if (/^foto:/i.test(text)) score -= 2;
  if (/^([A-ZÆØÅ][\w.-]+,\s*){2,}/.test(text) && /\bbeskriver\b/i.test(text)) score -= 1.5;
  if (/\bmens\b/i.test(text)) score += 2.4;
  if (/\bmen\b/i.test(text)) score += 0.9;
  if (/\btry\b/i.test(text)) score += 0.8;
  if (/\bkonkurrent/i.test(text)) score += 0.8;
  if (/\bmuligheter\b/i.test(text)) score += 0.6;

  return score;
}

function excerptFromPlainText(raw: string, fallbackSnippet?: string | null): string | null {
  const lines = String(raw ?? "")
    .split(/\n+/g)
    .map((line) => cleanText(htmlDecode(line), 520))
    .filter((line): line is string => Boolean(line))
    .filter((line) => line.length >= 45 && line.length <= 420);

  const bylineNoise = /^(foto:|publisert|oppdatert|abonnerer du allerede|logg inn|redaktør)\b/i;
  const candidates: ExcerptCandidate[] = lines
    .filter((line) => !bylineNoise.test(line))
    .filter((line) => !EXCERPT_NOISE_PATTERNS.some((pattern) => pattern.test(line)))
    .slice(0, 30)
    .map((text, idx) => ({ text, source: "p" as const, order: idx }));

  const fallback = cleanText(htmlDecode(fallbackSnippet ?? ""), 420);
  if (fallback) {
    candidates.push({ text: fallback, source: "fallback", order: candidates.length + 1 });
  }
  if (!candidates.length) return fallback;

  const scored = candidates
    .map((candidate) => ({ candidate, score: excerptScore(candidate) }))
    .sort((a, b) => b.score - a.score);
  return cleanText(scored[0]?.candidate.text ?? "", 420);
}

function excerptFromHtml(
  html: string,
  lookup: MetaLookup,
  fallbackSnippet?: string | null
): string | null {
  const hasHtmlTags = /<[^>]+>/.test(html);
  if (!hasHtmlTags) {
    return excerptFromPlainText(html, fallbackSnippet);
  }

  const candidates: ExcerptCandidate[] = [];
  const seen = new Set<string>();
  let order = 0;

  const push = (raw: string | null | undefined, source: ExcerptSource) => {
    const cleaned = cleanFragmentText(raw, 520);
    if (!cleaned || cleaned.length < 45) return;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push({ text: cleaned, source, order });
    order += 1;
  };

  const descKeys = ["description", "og:description", "twitter:description"];
  for (const rawKey of descKeys) {
    const values = lookup.get(rawKey) ?? [];
    for (const value of values) push(value, "meta");
  }

  const leadRe =
    /<p[^>]+class=["'][^"']*(?:ingress|lead|dek|intro|standfirst|excerpt|summary)[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi;
  let leadMatch: RegExpExecArray | null;
  let leadCount = 0;
  while ((leadMatch = leadRe.exec(html)) && leadCount < 8) {
    push(leadMatch[1], "lead");
    leadCount += 1;
  }

  const h2Re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let h2Match: RegExpExecArray | null;
  let h2Count = 0;
  while ((h2Match = h2Re.exec(html)) && h2Count < 8) {
    push(h2Match[1], "h2");
    h2Count += 1;
  }

  const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch: RegExpExecArray | null;
  let pCount = 0;
  while ((pMatch = pRe.exec(html)) && pCount < 24) {
    push(pMatch[1], "p");
    pCount += 1;
  }

  push(fallbackSnippet, "fallback");

  if (!candidates.length) return cleanText(fallbackSnippet ?? "", 420);

  const scored = candidates
    .map((candidate) => ({ candidate, score: excerptScore(candidate) }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const bestNonMeta = scored.find((item) => item.candidate.source !== "meta");
  const chosen =
    bestNonMeta && best && bestNonMeta.score >= best.score - 1.2
      ? bestNonMeta.candidate
      : best?.candidate;
  return cleanText(chosen?.text ?? "", 420);
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
  if (lc.includes("abonnerer du allerede")) hits += 1;
  if (lc.includes("for å lese denne saken må du være")) hits += 1;
  if (lc.includes("for a lese denne saken ma du vaere")) hits += 1;

  if (hits >= 2) return true;
  return (
    lc.includes("kun for abonnenter") ||
    lc.includes("for abonnenter") ||
    lc.includes("subscriber-only") ||
    lc.includes("abonnerer du allerede") ||
    lc.includes("for å lese denne saken må du være") ||
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
  const excerpt = excerptFromHtml(html, lookup, args.fallbackSnippet);
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
