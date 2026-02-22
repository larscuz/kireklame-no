import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Manrope, Space_Grotesk } from "next/font/google";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";
import { siteMeta } from "@/lib/seo";
import { AD_PLACEMENTS } from "@/lib/adPlacements";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pagePalette = {
  "--ads-bg": "#060709",
  "--ads-panel": "#0b0e12",
  "--ads-panel-strong": "#10151c",
  "--ads-border": "#232d3b",
  "--ads-text": "#f3f6fa",
  "--ads-muted": "#9ca8b8",
  "--ads-accent": "#84c9ff",
  "--ads-accent-soft": "rgba(132, 201, 255, 0.14)",
  "--ads-highlight": "rgba(209, 241, 255, 0.08)",
} as CSSProperties;

type PackagePlan = {
  name: string;
  description: string;
  subtitle?: string;
  label?: string;
  placementKeys: string[];
  features: string[];
  highlighted?: boolean;
};

const packagePlans: PackagePlan[] = [
  {
    name: "Annonsepakke Start",
    description: "Kortformat i katalogstrømmer for stabil, løpende synlighet.",
    subtitle: "Matcher inline-kortene som er markert i visualiseringskartet under.",
    placementKeys: ["catalog_inline_card", "other_inline_card", "other_inline_card_2"],
    features: [
      "Card-format med sponsormerking",
      "Klikkbar lenke til egen nettside",
      "Egnet for budskap med mer visuelt innhold",
      "Kan oppdateres i avtaleperioden",
    ],
  },
  {
    name: "Annonsepakke Banner",
    description: "Horisontale bannerflater på tvers av katalog og relaterte sider.",
    subtitle: "Matcher banner-placeringene i visualiseringskartet under.",
    placementKeys: [
      "home_hero_mini_banner",
      "catalog_grid_banner",
      "catalog_grid_banner_2",
      "catalog_grid_banner_3",
      "other_mid_banner",
    ],
    features: [
      "Desktop + mobil leveranse per bannerplassering",
      "Klikkbar trafikk til egen nettside",
      "Passer kampanjer med tydelig CTA",
      "Kan kjøres i rotasjon eller faste perioder",
    ],
    highlighted: true,
  },
  {
    name: "Annonsepakke Premium",
    description: "Mest synlige hero- og toppflater med høy eksponering.",
    subtitle: "Matcher premium hero- og toppflater i visualiseringskartet under.",
    label: "5 premium-plasseringer",
    placementKeys: [
      "home_hero_sidebar",
      "international_hero_sidebar",
      "catalog_top_banner",
      "other_hero_sidebar",
      "other_top_banner",
    ],
    features: [
      "Hero-side + toppbanner i sentrale flater",
      "Klikkbar trafikk til egen nettside",
      "Egnet for lanseringer og brand awareness",
      "Tilgjengelighet styres av kapasitet og kalender",
    ],
  },
];

type PlacementAssetSpec = {
  key: string;
  desktop: string;
  mobile: string;
  note: string;
};

type SurfaceMapHotspot = {
  key: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

type SurfaceMap = {
  title: string;
  description: string;
  variant: "home" | "international" | "catalog" | "company" | "other";
  hotspots: SurfaceMapHotspot[];
};

const placementAssetSpecs: PlacementAssetSpec[] = [
  {
    key: "home_hero_sidebar",
    desktop: "1120x1000",
    mobile: "1600x200",
    note: "Desktop sidebar + mobile compact banner.",
  },
  {
    key: "home_hero_mini_banner",
    desktop: "1440x200",
    mobile: "1280x160",
    note: "Desktop mini banner under home hero ad.",
  },
  {
    key: "companies_hero_sidebar",
    desktop: "1120x1000",
    mobile: "1600x200",
    note: "Companies hero right slot.",
  },
  {
    key: "company_cover_mini_banner",
    desktop: "1440x200",
    mobile: "1280x160",
    note: "Mini banner on company detail page.",
  },
  {
    key: "international_hero_sidebar",
    desktop: "1120x1000",
    mobile: "1600x200",
    note: "International hero right slot.",
  },
  {
    key: "catalog_top_banner",
    desktop: "1920x240",
    mobile: "1366x200",
    note: "Shared top banner (home + catalog pages).",
  },
  {
    key: "catalog_inline_card",
    desktop: "1760x1210",
    mobile: "1600x1000",
    note: "Card slot (still used in KI Avis flows).",
  },
  {
    key: "catalog_grid_banner",
    desktop: "1920x240",
    mobile: "1600x200",
    note: "Banner between company rows.",
  },
  {
    key: "catalog_grid_banner_2",
    desktop: "1920x240",
    mobile: "1600x200",
    note: "Banner between company rows.",
  },
  {
    key: "catalog_grid_banner_3",
    desktop: "1920x240",
    mobile: "1600x200",
    note: "Banner between company rows.",
  },
  {
    key: "other_top_banner",
    desktop: "1920x240",
    mobile: "1200x250",
    note: "Top banner on other/news-style pages.",
  },
  {
    key: "other_mid_banner",
    desktop: "1920x240",
    mobile: "1200x250",
    note: "Mid-page banner on other/news-style pages.",
  },
  {
    key: "other_hero_sidebar",
    desktop: "1120x1000",
    mobile: "1600x200",
    note: "Other services hero right slot.",
  },
  {
    key: "other_inline_card",
    desktop: "1760x1210",
    mobile: "1600x1000",
    note: "Card slot.",
  },
  {
    key: "other_inline_card_2",
    desktop: "1760x1210",
    mobile: "1600x1000",
    note: "Card slot.",
  },
];

const surfaceMaps: SurfaceMap[] = [
  {
    title: "Forside",
    description: "Norsk katalog på forsiden: toppbanner + hero-side + mini-banner + katalogflater i feed.",
    variant: "home",
    hotspots: [
      { key: "catalog_top_banner", left: 8, top: 4, width: 84, height: 9 },
      { key: "home_hero_sidebar", left: 66, top: 24, width: 26, height: 31 },
      { key: "home_hero_mini_banner", left: 66, top: 55.5, width: 26, height: 6.5 },
      { key: "catalog_inline_card", left: 37, top: 65, width: 26, height: 13 },
      { key: "catalog_grid_banner", left: 8, top: 83, width: 84, height: 3.5 },
      { key: "catalog_grid_banner_2", left: 8, top: 88, width: 84, height: 3.5 },
      { key: "catalog_grid_banner_3", left: 8, top: 93, width: 84, height: 3.5 },
    ],
  },
  {
    title: "Internasjonalt",
    description: "Internasjonal forside: toppbanner + hero-side + katalogflater i feed.",
    variant: "international",
    hotspots: [
      { key: "catalog_top_banner", left: 8, top: 4, width: 84, height: 9 },
      { key: "international_hero_sidebar", left: 66, top: 24, width: 26, height: 31 },
      { key: "catalog_inline_card", left: 37, top: 65, width: 26, height: 13 },
      { key: "catalog_grid_banner", left: 8, top: 83, width: 84, height: 3.5 },
      { key: "catalog_grid_banner_2", left: 8, top: 88, width: 84, height: 3.5 },
      { key: "catalog_grid_banner_3", left: 8, top: 93, width: 84, height: 3.5 },
    ],
  },
  {
    title: "Selskapsside",
    description: "Detaljside: toppbanner + mini-banner i høyre kolonne.",
    variant: "company",
    hotspots: [
      { key: "catalog_top_banner", left: 8, top: 4, width: 84, height: 10 },
      { key: "home_hero_mini_banner", left: 64, top: 50, width: 28, height: 7 },
    ],
  },
  {
    title: "Andre KI-tjenester",
    description: "Kategori med toppbanner, hero-side, kort-grid og midtbanner lenger ned i feed.",
    variant: "other",
    hotspots: [
      { key: "other_top_banner", left: 8, top: 4, width: 84, height: 10 },
      { key: "other_hero_sidebar", left: 64, top: 24, width: 28, height: 31 },
      { key: "other_inline_card", left: 8, top: 63, width: 26, height: 15 },
      { key: "other_inline_card_2", left: 37, top: 63, width: 26, height: 15 },
      { key: "other_mid_banner", left: 8, top: 94, width: 84, height: 4 },
    ],
  },
];

export const metadata: Metadata = siteMeta({
  title: "Annonsér på KiReklame – Annonseplass 2026",
  description:
    "Betalt synlighet på definerte annonseflater i 2026 på KiReklame. Se annonsepakker og kontakt oss for konkret tilbud.",
  path: "/annonsere",
});

type PlacementDefinition = (typeof AD_PLACEMENTS)[number];

function PricingCard({
  plan,
  ctaHref,
  locale,
  placementByKey,
  specByKey,
  surfaceLabelsByKey,
}: {
  plan: PackagePlan;
  ctaHref: string;
  locale: "no" | "en";
  placementByKey: Map<string, PlacementDefinition>;
  specByKey: Map<string, PlacementAssetSpec>;
  surfaceLabelsByKey: Map<string, string[]>;
}) {
  return (
    <article
      className={`rounded-3xl border p-6 sm:p-7 ${
        plan.highlighted
          ? "border-[var(--ads-accent)]/60 bg-[var(--ads-panel-strong)] shadow-[0_0_0_1px_rgba(132,201,255,0.18)]"
          : "border-[var(--ads-border)] bg-[var(--ads-panel)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className={`${headingFont.className} text-xl font-semibold tracking-tight`}>{plan.name}</h3>
          <p className="mt-2 text-sm text-[var(--ads-muted)]">{plan.description}</p>
        </div>
        {plan.label ? (
          <span className="rounded-full border border-[var(--ads-accent)]/55 bg-[var(--ads-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--ads-text)]">
            {plan.label}
          </span>
        ) : null}
      </div>

      {plan.subtitle ? <p className="mt-3 text-xs text-[var(--ads-muted)]">{plan.subtitle}</p> : null}

      <div className="mt-6 rounded-2xl border border-[var(--ads-border)] bg-black/20 p-4">
        <div className="text-xs uppercase tracking-[0.14em] text-[var(--ads-muted)]">
          Pris og tilgjengelighet
        </div>
        <p className="mt-2 text-sm text-[var(--ads-muted)]">
          Kontakt oss for konkret tilbud basert på plassering, varighet og kapasitet.
        </p>
        <Link
          href={ctaHref}
          className="mt-4 inline-flex items-center rounded-xl border border-[var(--ads-accent)]/60 bg-[var(--ads-accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--ads-text)] transition hover:bg-[var(--ads-highlight)]"
        >
          Kontakt for tilbud
        </Link>
      </div>

      <ul className="mt-6 space-y-2 text-sm text-[var(--ads-text)]/92">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--ads-accent)]" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl border border-[var(--ads-border)] bg-black/20 p-4">
        <div className="text-xs uppercase tracking-[0.14em] text-[var(--ads-muted)]">
          Inkluderte annonseflater
        </div>
        <ul className="mt-3 space-y-3">
          {plan.placementKeys.map((placementKey) => {
            const placement = placementByKey.get(placementKey);
            const spec = specByKey.get(placementKey);
            const placementName = placement ? placement.name[locale] : placementKey;
            const desktop = spec?.desktop ?? "N/A";
            const mobile = spec?.mobile ?? "N/A";
            const surfaces = surfaceLabelsByKey.get(placementKey) ?? [];

            return (
              <li key={`${plan.name}-${placementKey}`} className="rounded-xl border border-[var(--ads-border)] p-3">
                <div className="text-sm font-semibold text-[var(--ads-text)]">{placementName}</div>
                <div className="mt-1 font-mono text-[11px] text-[var(--ads-muted)]">{placementKey}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-[var(--ads-muted)]">
                  <span className="rounded-full border border-[var(--ads-border)] px-2 py-0.5">
                    Desktop: {desktop}
                  </span>
                  <span className="rounded-full border border-[var(--ads-border)] px-2 py-0.5">
                    Mobil: {mobile}
                  </span>
                </div>
                {surfaces.length ? (
                  <div className="mt-2">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--ads-muted)]">Vises i kart</div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {surfaces.map((surface) => (
                        <span
                          key={`${placementKey}-${surface}`}
                          className="rounded-full border border-[var(--ads-border)] bg-black/25 px-2 py-0.5 text-[10px] text-[var(--ads-muted)]"
                        >
                          {surface}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      <Link
        href={ctaHref}
        className="mt-7 inline-flex w-full items-center justify-center rounded-2xl border border-[var(--ads-border)] bg-[var(--ads-panel-strong)] px-4 py-3 text-sm font-semibold transition hover:border-[var(--ads-accent)]/50 hover:bg-[var(--ads-highlight)]"
      >
        Be om annonseforslag
      </Link>
    </article>
  );
}

function PageBackdrop({ variant }: { variant: SurfaceMap["variant"] }) {
  return (
    <>
      <div className="absolute inset-0 bg-[#0f151d]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(156,168,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(156,168,184,0.12)_1px,transparent_1px)] [background-size:18px_18px]"
        aria-hidden="true"
      />
      {variant === "home" || variant === "international" || variant === "company" || variant === "other" ? null : (
        <div className="absolute left-[6%] top-[5%] h-[6%] w-[88%] rounded-md bg-white/10" />
      )}

      {variant === "home" ? (
        <>
          <div className="absolute left-[8%] top-[15%] h-[4.6%] w-[40%] rounded-md bg-[rgba(148,163,184,0.3)]" />
          <div className="absolute left-[8%] top-[21%] h-[2.8%] w-[29%] rounded-md bg-[rgba(148,163,184,0.22)]" />

          <div className="absolute left-[8%] top-[24%] h-[31%] w-[55%] rounded-xl bg-[rgba(148,163,184,0.24)]" />
          <div className="absolute left-[9.2%] top-[50%] h-[2.8%] w-[20%] rounded-full bg-[rgba(148,163,184,0.2)]" />

          <div className="absolute left-[8%] top-[65%] h-[13%] w-[26%] rounded-xl bg-[rgba(148,163,184,0.22)]" />
          <div className="absolute left-[37%] top-[65%] h-[13%] w-[26%] rounded-xl bg-[rgba(148,163,184,0.22)]" />
          <div className="absolute left-[66%] top-[65%] h-[13%] w-[26%] rounded-xl bg-[rgba(148,163,184,0.22)]" />
        </>
      ) : null}

      {variant === "international" ? (
        <>
          <div className="absolute left-[8%] top-[24%] h-[31%] w-[55%] rounded-xl bg-[rgba(148,163,184,0.24)]" />
          <div className="absolute left-[9.2%] top-[29%] h-[5.2%] w-[22%] rounded-md bg-[rgba(148,163,184,0.3)]" />
          <div className="absolute left-[9.2%] top-[35.2%] h-[4.2%] w-[12%] rounded-md bg-[rgba(148,163,184,0.24)]" />
          <div className="absolute left-[9.2%] top-[41.2%] h-[2.8%] w-[40%] rounded-md bg-[rgba(148,163,184,0.2)]" />
          <div className="absolute left-[41.5%] top-[28.3%] h-[6.5%] w-[14.5%] rounded-xl bg-[rgba(248,250,252,0.55)]" />
          <div className="absolute left-[9.2%] top-[50%] h-[2.8%] w-[22%] rounded-full bg-[rgba(148,163,184,0.2)]" />

          <div className="absolute left-[8%] top-[65%] h-[13%] w-[26%] rounded-xl bg-[rgba(148,163,184,0.22)]" />
          <div className="absolute left-[37%] top-[65%] h-[13%] w-[26%] rounded-xl bg-[rgba(148,163,184,0.22)]" />
          <div className="absolute left-[66%] top-[65%] h-[13%] w-[26%] rounded-xl bg-[rgba(148,163,184,0.22)]" />
        </>
      ) : null}

      {variant === "catalog" ? (
        <>
          <div className="absolute left-[8%] top-[28%] h-[31%] w-[55%] rounded-md bg-white/10" />
          <div className="absolute left-[8%] top-[63%] h-[16%] w-[26%] rounded-md bg-white/10" />
          <div className="absolute left-[37%] top-[63%] h-[16%] w-[26%] rounded-md bg-white/10" />
          <div className="absolute left-[66%] top-[63%] h-[16%] w-[26%] rounded-md bg-white/10" />
        </>
      ) : null}

      {variant === "company" ? (
        <>
          <div className="absolute left-[8%] top-[24%] h-[34%] w-[55%] rounded-xl bg-[rgba(148,163,184,0.24)]" />
          <div className="absolute left-[64%] top-[24%] h-[24%] w-[28%] rounded-xl bg-[rgba(148,163,184,0.24)]" />
          <div className="absolute left-[64%] top-[59%] h-[14%] w-[28%] rounded-xl bg-[rgba(148,163,184,0.22)]" />
          <div className="absolute left-[64%] top-[75.5%] h-[10%] w-[28%] rounded-xl bg-[rgba(148,163,184,0.2)]" />

          <div className="absolute left-[8%] top-[60%] h-[4.8%] w-[28%] rounded-md bg-[rgba(148,163,184,0.3)]" />
          <div className="absolute left-[8%] top-[66%] h-[2.6%] w-[33%] rounded-md bg-[rgba(148,163,184,0.22)]" />
          <div className="absolute left-[8%] top-[70%] h-[12%] w-[52%] rounded-xl bg-[rgba(148,163,184,0.21)]" />

          <div className="absolute left-[8%] top-[87%] h-[10%] w-[84%] rounded-xl bg-[rgba(148,163,184,0.2)]" />
          <div className="absolute left-[10%] top-[89.6%] h-[4%] w-[11%] rounded-full bg-[rgba(248,250,252,0.3)]" />
          <div className="absolute left-[72%] top-[89.6%] h-[4%] w-[8%] rounded-full bg-[rgba(248,250,252,0.34)]" />
          <div className="absolute left-[81%] top-[89.6%] h-[4%] w-[8%] rounded-full bg-[rgba(248,250,252,0.34)]" />
        </>
      ) : null}

      {variant === "other" ? (
        <>
          <div className="absolute left-[8%] top-[24%] h-[31%] w-[55%] rounded-xl bg-[rgba(148,163,184,0.24)]" />
          <div className="absolute left-[9.2%] top-[28.4%] h-[2.9%] w-[14%] rounded-full bg-[rgba(248,250,252,0.24)]" />
          <div className="absolute left-[24.5%] top-[28.4%] h-[2.9%] w-[12%] rounded-full bg-[rgba(248,250,252,0.24)]" />
          <div className="absolute left-[9.2%] top-[34.1%] h-[5%] w-[26%] rounded-md bg-[rgba(248,250,252,0.38)]" />
          <div className="absolute left-[9.2%] top-[41.2%] h-[3%] w-[40%] rounded-md bg-[rgba(148,163,184,0.22)]" />
          <div className="absolute left-[9.2%] top-[45.2%] h-[3%] w-[33%] rounded-md bg-[rgba(148,163,184,0.18)]" />
          <div className="absolute left-[9.2%] top-[51.1%] h-[4%] w-[16%] rounded-full bg-[rgba(248,250,252,0.24)]" />

          <div className="absolute left-[8%] top-[63%] h-[15%] w-[26%] rounded-xl bg-[rgba(148,163,184,0.22)]" />
          <div className="absolute left-[37%] top-[63%] h-[15%] w-[26%] rounded-xl bg-[rgba(148,163,184,0.22)]" />
          <div className="absolute left-[66%] top-[63%] h-[15%] w-[26%] rounded-xl bg-[rgba(148,163,184,0.22)]" />
          <div className="absolute left-[8%] top-[79%] h-[13%] w-[26%] rounded-xl bg-[rgba(148,163,184,0.18)]" />
          <div className="absolute left-[37%] top-[79%] h-[13%] w-[26%] rounded-xl bg-[rgba(148,163,184,0.18)]" />
          <div className="absolute left-[66%] top-[79%] h-[13%] w-[26%] rounded-xl bg-[rgba(148,163,184,0.18)]" />
        </>
      ) : null}
    </>
  );
}

function SurfaceMapCard({
  map,
  locale,
  placementByKey,
  specByKey,
}: {
  map: SurfaceMap;
  locale: "no" | "en";
  placementByKey: Map<string, PlacementDefinition>;
  specByKey: Map<string, PlacementAssetSpec>;
}) {
  const mapHeightClass =
    map.variant === "home" || map.variant === "international" || map.variant === "other"
      ? "sm:h-[860px]"
      : "sm:h-[680px]";

  return (
    <article className="rounded-3xl border border-[var(--ads-border)] bg-[var(--ads-panel)] p-5">
      <h3 className={`${headingFont.className} text-xl font-semibold tracking-tight`}>{map.title}</h3>
      <p className="mt-2 text-sm text-[var(--ads-muted)]">{map.description}</p>

      <div
        className={`relative mt-4 h-[560px] overflow-hidden rounded-2xl border border-[var(--ads-border)] bg-black/20 ${mapHeightClass}`}
      >
        <PageBackdrop variant={map.variant} />
        {map.hotspots.map((hotspot, index) => {
          const placement = placementByKey.get(hotspot.key);
          const spec = specByKey.get(hotspot.key);
          const placementName = placement ? placement.name[locale] : hotspot.key;
          const desktop = spec?.desktop ?? "N/A";
          const mobile = spec?.mobile ?? "N/A";
          const compactDimensions = `${desktop} / ${mobile}`;
          const isCompact = hotspot.height <= 10 || hotspot.width <= 26;
          const isMicro = hotspot.height <= 7;

          return (
            <div
              key={`${map.title}-${hotspot.key}`}
              style={{
                left: `${hotspot.left}%`,
                top: `${hotspot.top}%`,
                width: `${hotspot.width}%`,
                height: `${hotspot.height}%`,
              }}
              className="absolute overflow-hidden rounded-lg border border-[var(--ads-accent)]/90 bg-[#101a2a]/84 shadow-[0_0_0_1px_rgba(132,201,255,0.25)]"
            >
              <span
                className={`absolute right-1 top-1 inline-flex items-center justify-center rounded-full border border-[var(--ads-accent)]/80 bg-[var(--ads-panel-strong)] px-1 text-[10px] font-semibold text-[var(--ads-text)] ${
                  isMicro ? "h-4 min-w-4 text-[9px]" : "h-5 min-w-5"
                }`}
              >
                {index + 1}
              </span>
              <div className={`absolute inset-0 ${isMicro ? "px-2 py-1" : isCompact ? "p-2" : "p-2.5"}`}>
                {isMicro ? (
                  <div className="flex h-full items-center gap-2 pr-6">
                    <div className="min-w-0 truncate text-[9px] font-semibold leading-tight text-[var(--ads-text)]">
                      {placementName}
                    </div>
                    <span
                      className="ml-auto inline-flex shrink-0 rounded-full border border-[var(--ads-border)] bg-[var(--ads-panel-strong)]/95 px-2 py-0.5 font-medium text-[7px] text-[var(--ads-muted)]"
                    >
                      {compactDimensions}
                    </span>
                  </div>
                ) : (
                  <div>
                    <div
                      className={`truncate font-semibold leading-tight text-[var(--ads-text)] ${
                        isCompact ? "text-[11px]" : "text-sm"
                      }`}
                    >
                      {placementName}
                    </div>
                    {isCompact ? (
                      <div className="mt-0.5 pr-6">
                        <span className="inline-flex max-w-full truncate rounded-full border border-[var(--ads-border)] bg-[var(--ads-panel-strong)]/95 px-2 py-0.5 text-[8px] font-medium text-[var(--ads-muted)]">
                          {compactDimensions}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="mt-0.5 truncate font-mono text-[11px] leading-tight text-[var(--ads-muted)]">
                          {hotspot.key}
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px]">
                          <span className="rounded-full border border-[var(--ads-border)] bg-[var(--ads-panel-strong)]/95 px-2 py-0.5 font-medium text-[var(--ads-muted)]">
                            Desktop: {desktop}
                          </span>
                          <span className="rounded-full border border-[var(--ads-border)] bg-[var(--ads-panel-strong)]/95 px-2 py-0.5 font-medium text-[var(--ads-muted)]">
                            Mobil: {mobile}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
export default async function AdvertisingPage() {
  const locale = await getLocale();
  const contactPath = localizePath(locale, "/kontakt");
  const ctaHref = `${contactPath}?topic=${encodeURIComponent("annonsering")}`;
  const placementByKey = new Map<string, PlacementDefinition>(
    AD_PLACEMENTS.map((placement) => [placement.key, placement])
  );
  const specByKey = new Map(placementAssetSpecs.map((spec) => [spec.key, spec]));
  const surfaceLabelsByKey = new Map<string, string[]>();

  for (const mapDef of surfaceMaps) {
    for (const hotspot of mapDef.hotspots) {
      const existing = surfaceLabelsByKey.get(hotspot.key) ?? [];
      if (!existing.includes(mapDef.title)) {
        existing.push(mapDef.title);
        surfaceLabelsByKey.set(hotspot.key, existing);
      }
    }
  }

  return (
    <div style={pagePalette} className={`${bodyFont.className} bg-[var(--ads-bg)] text-[var(--ads-text)]`}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:py-14">
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--ads-border)] bg-[var(--ads-panel)] px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(156,168,184,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(156,168,184,0.15)_1px,transparent_1px)] [background-size:46px_46px] animate-[pulse_12s_ease-in-out_infinite]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-10 top-3 h-24 w-24 rounded-full border border-[var(--ads-border)]"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--ads-muted)]">
                KiReklame 2026
              </p>
              <h1 className={`${headingFont.className} mt-1 text-2xl font-semibold tracking-tight sm:text-3xl`}>
                Annonsér på KiReklame
              </h1>
              <p className="mt-1.5 max-w-lg text-sm text-[var(--ads-muted)] sm:text-[15px]">
                Betalt synlighet på definerte flater i 2026. Begrenset kapasitet.
              </p>
            </div>
            <Link
              href={ctaHref}
              className="inline-flex w-fit items-center rounded-xl border border-[var(--ads-accent)]/60 bg-[var(--ads-accent-soft)] px-4 py-1.5 text-xs font-semibold text-[var(--ads-text)] transition hover:bg-[var(--ads-highlight)] sm:text-sm md:shrink-0"
            >
              Be om annonseforslag
            </Link>
          </div>
        </section>

        <section className="mt-16">
          <h2 className={`${headingFont.className} text-3xl font-semibold tracking-tight sm:text-4xl`}>
            Annonsepakker 2026 (knyttet til annonseflater)
          </h2>
          <p className="mt-4 max-w-4xl text-sm text-[var(--ads-muted)] sm:text-base">
            Hver pakke under er synket mot visualiseringskartet lenger ned. Samme navn, samme key og tydelig
            markering av hvilke sidekart hver annonseflate faktisk vises i.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {packagePlans.map((plan) => (
              <PricingCard
                key={plan.name}
                plan={plan}
                ctaHref={ctaHref}
                locale={locale}
                placementByKey={placementByKey}
                specByKey={specByKey}
                surfaceLabelsByKey={surfaceLabelsByKey}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className={`${headingFont.className} text-3xl font-semibold tracking-tight sm:text-4xl`}>
            Annonseflater og leveranseformat
          </h2>
          <p className="mt-4 max-w-4xl text-sm text-[var(--ads-muted)] sm:text-base">
            Illustrasjonene under viser grået sideinnhold med markerte annonseflater.
            Hver markering viser navn og leveranseformat direkte i kartet:
            <span className="font-mono"> image_url</span> (desktop) og
            <span className="font-mono"> mobile_image_url</span> (mobil).
          </p>

          <div className="mt-8 grid gap-5 2xl:grid-cols-2">
            {surfaceMaps.map((map) => (
              <SurfaceMapCard
                key={map.title}
                map={map}
                locale={locale}
                placementByKey={placementByKey}
                specByKey={specByKey}
              />
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--ads-border)] bg-black/20 px-4 py-3 text-sm text-[var(--ads-muted)]">
              Hold kritisk tekst og logo unna øvre høyre hjørne. Sponsor-pill vises der i dagens layout.
            </div>
            <div className="rounded-2xl border border-[var(--ads-border)] bg-black/20 px-4 py-3 text-sm text-[var(--ads-muted)]">
              <span className="font-mono">catalog_top_banner</span> brukes i to ulike frame-stiler.
              Del i separate placements hvis dere vil ha pixel-perfect fit per side.
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[var(--ads-border)] bg-[var(--ads-panel)] px-6 py-8 sm:px-8">
          <h2 className={`${headingFont.className} text-2xl font-semibold tracking-tight`}>
            Hva innebærer annonsering på KiReklame?
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-[var(--ads-muted)]">
            Annonsering gir betalt synlighet på definerte flater på kireklame.no.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-[var(--ads-text)]/92">
            {[
              "Visning på avtalt plassering (forside, kategori eller KI Nyheter)",
              "Klikkbar henvisning til egen nettside",
              "Synlighet i hele avtaleperioden",
              "Mulighet for oppdatert annonsemateriell ved behov",
              "Rotasjon eller plassbegrensning avtales per annonseflate",
              "Tilbud og kapasitet for 2026 avtales ved kontakt",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--ads-accent)]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl border border-[var(--ads-border)] bg-black/20 px-4 py-3 text-sm text-[var(--ads-muted)]">
            KiReklame tilbyr eksponering og bransjesynlighet. Vi garanterer ikke antall visninger, klikk eller leads.
            Endelig tilbud og vilkår fastsettes ved bestilling.
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-[var(--ads-border)] bg-[var(--ads-panel)] px-6 py-8 sm:px-8">
          <h2 className={`${headingFont.className} text-2xl font-semibold tracking-tight`}>
            Avgrensning mellom katalog og annonse
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-[var(--ads-muted)]">
            Denne siden gjelder kun betalt annonseplass. Katalogoppføring og eventuelle redaksjonelle vurderinger
            håndteres separat og inngår ikke automatisk i annonsepakker.
          </p>
        </section>

        <section className="mt-16 rounded-[2rem] border border-[var(--ads-border)] bg-[var(--ads-panel)] px-6 py-12 text-center sm:px-10">
          <h2 className={`${headingFont.className} text-3xl font-semibold tracking-tight sm:text-4xl`}>
            Vil dere være blant de første?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--ads-muted)]">
            Kapasiteten er begrenset i 2026.
          </p>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center rounded-2xl border border-[var(--ads-accent)]/60 bg-[var(--ads-accent-soft)] px-7 py-3.5 text-sm font-semibold text-[var(--ads-text)] transition hover:bg-[var(--ads-highlight)]"
          >
            Be om konkret annonseforslag
          </Link>
        </section>
      </div>
    </div>
  );
}
