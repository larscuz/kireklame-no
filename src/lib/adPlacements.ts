export type PlacementTier = "starter" | "standard" | "premium";
export type PlacementFormat = "banner" | "sidebar" | "card";

type LocalizedText = {
  no: string;
  en: string;
};

type LocalizedList = {
  no: string[];
  en: string[];
};

export type PlacementDefinition = {
  key: string;
  name: LocalizedText;
  description: LocalizedText;
  surfaces: LocalizedList;
  format: PlacementFormat;
  tier: PlacementTier;
  durationsDays: number[];
};

export const AD_PLACEMENTS: PlacementDefinition[] = [
  {
    key: "home_hero_sidebar",
    name: { no: "Forside hero-side", en: "Home hero sidebar" },
    description: {
      no: "Sideformat ved siden av hero-seksjonen på forsiden.",
      en: "Sidebar slot next to the homepage hero section.",
    },
    surfaces: { no: ["Forside"], en: ["Home"] },
    format: "sidebar",
    tier: "premium",
    durationsDays: [7, 14, 30],
  },
  {
    key: "companies_hero_sidebar",
    name: { no: "Selskaper hero-side", en: "Companies hero sidebar" },
    description: {
      no: "Hero-sideplass i selskapskatalogen.",
      en: "Hero sidebar slot in the companies directory.",
    },
    surfaces: { no: ["Selskaper"], en: ["Companies"] },
    format: "sidebar",
    tier: "premium",
    durationsDays: [7, 14, 30],
  },
  {
    key: "international_hero_sidebar",
    name: { no: "Internasjonalt hero-side", en: "International hero sidebar" },
    description: {
      no: "Hero-sideplass i internasjonal katalog.",
      en: "Hero sidebar slot in the international directory.",
    },
    surfaces: { no: ["Internasjonalt"], en: ["International"] },
    format: "sidebar",
    tier: "premium",
    durationsDays: [7, 14, 30],
  },
  {
    key: "catalog_top_banner",
    name: { no: "Katalog toppbanner", en: "Catalog top banner" },
    description: {
      no: "Fullbredde banner over kataloginnhold.",
      en: "Full-width banner above directory content.",
    },
    surfaces: {
      no: ["Forside", "Selskaper", "Internasjonalt", "Andre KI-tjenester"],
      en: ["Home", "Companies", "International", "Other AI services"],
    },
    format: "banner",
    tier: "premium",
    durationsDays: [7, 14, 30],
  },
  {
    key: "catalog_inline_card",
    name: { no: "Katalog inline-kort", en: "Catalog inline card" },
    description: {
      no: "Kortformat i samme grid som selskapskort.",
      en: "Card-format slot inside the same grid as company cards.",
    },
    surfaces: {
      no: ["Forside", "Selskaper", "Internasjonalt", "Andre KI-tjenester"],
      en: ["Home", "Companies", "International", "Other AI services"],
    },
    format: "card",
    tier: "starter",
    durationsDays: [14, 30, 60],
  },
  {
    key: "catalog_grid_banner",
    name: { no: "Katalog grid-banner 1", en: "Catalog grid banner 1" },
    description: {
      no: "Banner mellom rad 2 og 3 i katalog-grid.",
      en: "Banner between row 2 and 3 in the directory grid.",
    },
    surfaces: {
      no: ["Forside", "Selskaper", "Internasjonalt", "Andre KI-tjenester"],
      en: ["Home", "Companies", "International", "Other AI services"],
    },
    format: "banner",
    tier: "standard",
    durationsDays: [7, 14, 30],
  },
  {
    key: "catalog_grid_banner_2",
    name: { no: "Katalog grid-banner 2", en: "Catalog grid banner 2" },
    description: {
      no: "Banner mellom rad 4 og 5 i katalog-grid.",
      en: "Banner between row 4 and 5 in the directory grid.",
    },
    surfaces: {
      no: ["Forside", "Selskaper", "Internasjonalt", "Andre KI-tjenester"],
      en: ["Home", "Companies", "International", "Other AI services"],
    },
    format: "banner",
    tier: "standard",
    durationsDays: [7, 14, 30],
  },
  {
    key: "catalog_grid_banner_3",
    name: { no: "Katalog grid-banner 3", en: "Catalog grid banner 3" },
    description: {
      no: "Banner mellom rad 6 og 7 i katalog-grid.",
      en: "Banner between row 6 and 7 in the directory grid.",
    },
    surfaces: {
      no: ["Forside", "Selskaper", "Internasjonalt", "Andre KI-tjenester"],
      en: ["Home", "Companies", "International", "Other AI services"],
    },
    format: "banner",
    tier: "standard",
    durationsDays: [7, 14, 30],
  },
  {
    key: "other_top_banner",
    name: { no: "Andre toppbanner", en: "Other top banner" },
    description: {
      no: "Ekstra toppbanner for utvidede sider.",
      en: "Extra top banner slot for extended pages.",
    },
    surfaces: { no: ["Andre KI-tjenester"], en: ["Other AI services"] },
    format: "banner",
    tier: "standard",
    durationsDays: [7, 14, 30],
  },
  {
    key: "other_mid_banner",
    name: { no: "Andre midtbanner", en: "Other mid banner" },
    description: {
      no: "Ekstra midtbanner for kampanjer på egne sider.",
      en: "Additional mid-page banner for campaign pages.",
    },
    surfaces: { no: ["Andre KI-tjenester"], en: ["Other AI services"] },
    format: "banner",
    tier: "standard",
    durationsDays: [7, 14, 30],
  },
  {
    key: "other_hero_sidebar",
    name: { no: "Andre hero-side", en: "Other hero sidebar" },
    description: {
      no: "Hero-sideplass for egne temasider.",
      en: "Hero sidebar slot for dedicated topic pages.",
    },
    surfaces: { no: ["Andre KI-tjenester"], en: ["Other AI services"] },
    format: "sidebar",
    tier: "premium",
    durationsDays: [7, 14, 30],
  },
  {
    key: "other_inline_card",
    name: { no: "Andre inline-kort", en: "Other inline card" },
    description: {
      no: "Ekstra inline-kort i grid.",
      en: "Additional inline card slot in grid layouts.",
    },
    surfaces: { no: ["Andre KI-tjenester"], en: ["Other AI services"] },
    format: "card",
    tier: "starter",
    durationsDays: [14, 30, 60],
  },
  {
    key: "other_inline_card_2",
    name: { no: "Andre inline-kort 2", en: "Other inline card 2" },
    description: {
      no: "Andre ekstra inline-kort i grid.",
      en: "Second additional inline card slot in grid layouts.",
    },
    surfaces: { no: ["Andre KI-tjenester"], en: ["Other AI services"] },
    format: "card",
    tier: "starter",
    durationsDays: [14, 30, 60],
  },
];

export const AD_PLACEMENT_KEYS = AD_PLACEMENTS.map((placement) => placement.key);

export function placementTierLabel(tier: PlacementTier, locale: "no" | "en") {
  if (locale === "en") {
    if (tier === "premium") return "Premium visibility";
    if (tier === "standard") return "Standard visibility";
    return "Starter visibility";
  }
  if (tier === "premium") return "Premium synlighet";
  if (tier === "standard") return "Standard synlighet";
  return "Start synlighet";
}

export function placementFormatLabel(format: PlacementFormat, locale: "no" | "en") {
  if (locale === "en") {
    if (format === "banner") return "Full-width banner";
    if (format === "sidebar") return "Sidebar slot";
    return "Inline card";
  }
  if (format === "banner") return "Fullbredde banner";
  if (format === "sidebar") return "Sidepanel";
  return "Inline-kort";
}
