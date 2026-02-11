type NonArticleInput = {
  sourceUrl?: string | null;
  title?: string | null;
  snippet?: string | null;
  plainText?: string | null;
};

const NON_ARTICLE_URL_PATTERNS = [
  /\/emne(?:\/|$|\?)/i,
  /\/tags?(?:\/|$|\?)/i,
  /\/topics?(?:\/|$|\?)/i,
  /\/tema(?:\/|$|\?)/i,
  /\/studier-og-kurs(?:\/|$|\?)/i,
  /\/hoyskolekurs(?:\/|$|\?)/i,
  /\/utdanning(?:\/|$|\?)/i,
  /\/kurs(?:\/|$|\?)/i,
  /\/events?(?:\/|$|\?)/i,
  /\/webinar(?:\/|$|\?)/i,
  /\/search(?:\/|$|\?)/i,
  /[?&](q|query|search|s|tag|topic)=/i,
];

const NON_ARTICLE_TITLE_PATTERNS = [
  /^[^\n]{1,140}\s[-–|]\s*emne\s*$/i,
  /^[^\n]{1,140}\s[-–|]\s*tag(?:\s*\(emne\))?\s*$/i,
  /^emne\s*[:\-–|]/i,
  /^tag\s*[:\-–|]/i,
  /^tag$/i,
  /\barkiver\b$/i,
  /\barchives?\b$/i,
];

const NON_ARTICLE_TEXT_HINTS = [
  /\bvis flere resultater\b/i,
  /\bsøk i (vårt|arkiv)\b/i,
  /\bstudiepoeng\b/i,
  /\bhøyskolekurs\b/i,
  /\bmeld deg på\b/i,
  /\bsøknadsfrist\b/i,
  /\bopptakskrav\b/i,
];

function normalizeSpace(input: string | null | undefined): string {
  return String(input ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeArticleUrl(sourceUrl: string): boolean {
  if (!sourceUrl) return false;
  try {
    const { pathname } = new URL(sourceUrl);
    const segments = pathname.split("/").filter(Boolean);
    if (!segments.length) return false;
    const tail = segments[segments.length - 1] ?? "";

    if (/^\d{5,}$/.test(tail)) return true;
    if (segments.some((segment) => /\d{4}[-_/]\d{2}[-_/]\d{2}/.test(segment))) return true;
    if (tail.split("-").filter(Boolean).length >= 6) return true;
    if (tail.length >= 36 && tail.includes("-")) return true;
  } catch {
    return false;
  }
  return false;
}

export function isLikelyNonArticleNewsPage(input: NonArticleInput): boolean {
  const sourceUrl = String(input.sourceUrl ?? "").trim();
  const title = normalizeSpace(input.title);
  const snippet = normalizeSpace(input.snippet);
  const plainText = normalizeSpace(input.plainText).slice(0, 2000);
  const combined = `${title} ${snippet} ${plainText}`.trim();

  const byUrl = sourceUrl
    ? NON_ARTICLE_URL_PATTERNS.some((pattern) => pattern.test(sourceUrl))
    : false;
  const byTitle = NON_ARTICLE_TITLE_PATTERNS.some((pattern) => pattern.test(title));
  const byText = NON_ARTICLE_TEXT_HINTS.some((pattern) => pattern.test(combined));

  if (byUrl) return true;
  if (byTitle) return true;
  if (byText && !looksLikeArticleUrl(sourceUrl)) return true;
  return false;
}
