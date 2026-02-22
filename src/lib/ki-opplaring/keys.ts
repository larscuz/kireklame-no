export type KiEntryType = "guide" | "tema" | "tool" | "glossary";

export type KiEntryTypeInput =
  | KiEntryType
  | "guider"
  | "verktoy"
  | "ordliste"
  | "guide"
  | "tema"
  | "tool"
  | "glossary";

function normalizeSlug(raw: string): string {
  return String(raw ?? "").trim();
}

export function normalizeEntryType(rawType: KiEntryTypeInput | string): KiEntryType {
  const value = String(rawType ?? "").trim().toLowerCase();

  if (value === "guide" || value === "guider") return "guide";
  if (value === "tema") return "tema";
  if (value === "tool" || value === "verktoy") return "tool";
  if (value === "glossary" || value === "ordliste") return "glossary";

  return "guide";
}

export function toEntryKey(type: KiEntryTypeInput | string, slug: string): string {
  return `${normalizeEntryType(type)}:${normalizeSlug(slug)}`;
}

export function parseEntryKey(key: string): { type: KiEntryType; slug: string } | null {
  const [rawType, ...rest] = String(key ?? "").split(":");
  const slug = rest.join(":").trim();
  if (!rawType || !slug) return null;
  return {
    type: normalizeEntryType(rawType),
    slug,
  };
}

export function toEntryPath(type: KiEntryTypeInput | string, slug: string): string {
  const normalizedType = normalizeEntryType(type);
  const normalizedSlug = normalizeSlug(slug);

  if (normalizedType === "guide") return `/ki-opplaring/guider/${normalizedSlug}`;
  if (normalizedType === "tema") return `/ki-opplaring/tema/${normalizedSlug}`;
  if (normalizedType === "tool") return `/ki-opplaring/verktoy/${normalizedSlug}`;
  return `/ki-opplaring/ordliste/${normalizedSlug}`;
}

export function entryTypeLabel(type: KiEntryTypeInput | string): string {
  const normalizedType = normalizeEntryType(type);
  if (normalizedType === "guide") return "Guide";
  if (normalizedType === "tool") return "Verktøy";
  if (normalizedType === "glossary") return "Ordliste";
  return "Tema";
}
