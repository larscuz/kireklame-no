import type { Locale } from "@/lib/i18n";

export const OTHER_AI_SERVICE_CATEGORIES = [
  "ai_first_business",
  "ai_conference",
  "ai_education",
] as const;

export type OtherAiServiceCategory = (typeof OTHER_AI_SERVICE_CATEGORIES)[number];
export type OtherAiServiceCategoryFilter = OtherAiServiceCategory | "all";

export const DEFAULT_OTHER_AI_SERVICE_CATEGORY: OtherAiServiceCategory =
  "ai_first_business";

const CATEGORY_LABELS: Record<
  OtherAiServiceCategory,
  { no: string; en: string }
> = {
  ai_first_business: {
    no: "AI-first bedrifter",
    en: "AI-first businesses",
  },
  ai_conference: {
    no: "AI-konferanser",
    en: "AI conferences",
  },
  ai_education: {
    no: "AI-utdanninger",
    en: "AI educations",
  },
};

const CONFERENCE_HINTS = [
  /\bkonferanse\b/i,
  /\bconference\b/i,
  /\bsummit\b/i,
  /\bevent\b/i,
  /\bmeetup\b/i,
  /\bseminar\b/i,
  /\bforum\b/i,
  /\bexpo\b/i,
  /\bhackathon\b/i,
];

const EDUCATION_HINTS = [
  /\butdanning\b/i,
  /\bkurs\b/i,
  /\bstudie\b/i,
  /\bstudier\b/i,
  /\beducation\b/i,
  /\bcourse\b/i,
  /\bbootcamp\b/i,
  /\bacademy\b/i,
  /\bprogram\b/i,
  /\buniversity\b/i,
  /\buniversitet\b/i,
  /\bhøyskole\b/i,
  /\bhogskole\b/i,
  /\bmaster\b/i,
  /\bbachelor\b/i,
];

function normalized(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function hasAnyHint(input: string, hints: RegExp[]): boolean {
  return hints.some((hint) => hint.test(input));
}

export function normalizeOtherAiServiceCategory(
  value: unknown
): OtherAiServiceCategory | null {
  const key = normalized(value);
  if (!key) return null;

  if ((OTHER_AI_SERVICE_CATEGORIES as readonly string[]).includes(key)) {
    return key as OtherAiServiceCategory;
  }

  if (
    key === "ai-first" ||
    key === "ai_first" ||
    key === "ai-first-business" ||
    key === "ai_first_businesses"
  ) {
    return "ai_first_business";
  }

  if (
    key === "conference" ||
    key === "conferences" ||
    key === "event" ||
    key === "events" ||
    key === "ai_conferences"
  ) {
    return "ai_conference";
  }

  if (
    key === "education" ||
    key === "educations" ||
    key === "course" ||
    key === "courses" ||
    key === "utdanning" ||
    key === "utdanninger"
  ) {
    return "ai_education";
  }

  return null;
}

export function parseOtherAiServiceCategoryFilter(
  value: unknown
): OtherAiServiceCategoryFilter | null {
  const key = normalized(value);
  if (!key) return null;
  if (key === "all") return "all";
  return normalizeOtherAiServiceCategory(key);
}

export function inferOtherAiServiceCategory(
  name: string | null | undefined,
  description: string | null | undefined
): OtherAiServiceCategory {
  const text = `${name ?? ""} ${description ?? ""}`.trim().toLowerCase();
  if (!text) return DEFAULT_OTHER_AI_SERVICE_CATEGORY;

  // Prioritize education hints first so educational events keep education tag.
  if (hasAnyHint(text, EDUCATION_HINTS)) return "ai_education";
  if (hasAnyHint(text, CONFERENCE_HINTS)) return "ai_conference";
  return DEFAULT_OTHER_AI_SERVICE_CATEGORY;
}

export function resolveOtherAiServiceCategory(
  category: unknown,
  name: string | null | undefined,
  description: string | null | undefined
): OtherAiServiceCategory {
  return (
    normalizeOtherAiServiceCategory(category) ??
    inferOtherAiServiceCategory(name, description)
  );
}

export function otherAiServiceCategoryLabel(
  category: OtherAiServiceCategory,
  locale: Locale
): string {
  return CATEGORY_LABELS[category][locale];
}
