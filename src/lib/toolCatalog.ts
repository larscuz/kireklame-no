import type { Locale } from "@/lib/i18n";

export const TOOL_CATALOG_CATEGORIES = ["adcreative", "image_video_tools"] as const;

export type ToolCatalogCategory = (typeof TOOL_CATALOG_CATEGORIES)[number];
export type ToolCatalogCategoryFilter = ToolCatalogCategory | "all";

export const DEFAULT_TOOL_CATALOG_CATEGORY: ToolCatalogCategoryFilter = "all";

const CATEGORY_LABELS: Record<ToolCatalogCategory, { no: string; en: string }> = {
  adcreative: {
    no: "AdCreative-verktøy",
    en: "AdCreative-verktøy",
  },
  image_video_tools: {
    no: "Bilde- og videoverktøy",
    en: "Bilde- og videoverktøy",
  },
};

function normalized(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function parseToolCatalogCategoryFilter(value: unknown): ToolCatalogCategoryFilter | null {
  const key = normalized(value);
  if (!key) return null;
  if (key === "all") return "all";
  if (key === "adcreative") return "adcreative";
  if (key === "image_video_tools" || key === "image-video-tools" || key === "image_video") {
    return "image_video_tools";
  }
  return null;
}

export function toolCatalogCategoryLabel(category: ToolCatalogCategory, locale: Locale): string {
  return CATEGORY_LABELS[category][locale];
}

export function toolCatalogFilterLabel(category: ToolCatalogCategoryFilter, locale: Locale): string {
  if (category === "all") return "Alle kategorier";
  return toolCatalogCategoryLabel(category, locale);
}
