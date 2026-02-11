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
  /\bjump to main content\b/i,
  /\bgå til forside\b/i,
  /\bstudiepoeng\b/i,
  /\bhøyskolekurs\b/i,
  /\bmeld deg på\b/i,
  /\bsøknadsfrist\b/i,
  /\bopptakskrav\b/i,
  /\bjobb\b.*\bkontakt\b.*\bannonsere\b/i,
];

function normalizeSpace(input: string | null | undefined): string {
  return String(input ?? "")
    .replace(/\s+/g, " ")
    .trim();
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
  if (byText || /\b(emne|tag|topic|søk|search|arkiv|archive)\b/i.test(combined)) return true;
  return false;
}
