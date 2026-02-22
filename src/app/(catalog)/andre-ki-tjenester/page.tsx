import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/app/_components/AdSlot";
import { getAdForPlacement } from "@/lib/ads";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";
import {
  DEFAULT_OTHER_AI_SERVICE_CATEGORY,
  otherAiServiceCategoryLabel,
  parseOtherAiServiceCategoryFilter,
  resolveOtherAiServiceCategory,
  type OtherAiServiceCategory,
  type OtherAiServiceCategoryFilter,
} from "@/lib/otherAiServices";
import { siteMeta } from "@/lib/seo";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = siteMeta({
  title: "Andre KI-tjenester - Norge | KiReklame",
  description:
    "En kuratert oversikt over AI-first bedrifter, AI-konferanser og AI-utdanning i Norge.",
  path: "/andre-ki-tjenester",
});

type SearchParamsInput = Record<string, string | string[] | undefined>;

type AdLeadRow = {
  id: string;
  name: string;
  website: string | null;
  description: string | null;
  category?: string | null;
};

type AdLead = {
  id: string;
  name: string;
  website: string | null;
  description: string | null;
  category: OtherAiServiceCategory;
};

function readFirstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isCategoryColumnMissing(message: string | undefined): boolean {
  const normalized = String(message ?? "").toLowerCase();
  return normalized.includes("column") && normalized.includes("category");
}

function heroDescription(
  category: OtherAiServiceCategoryFilter,
  locale: "no" | "en"
): string {
  if (category === "ai_conference") {
    return locale === "en"
      ? "A curated overview of AI conferences in Norway. This category is Norway-only for now."
      : "En kuratert oversikt over AI-konferanser i Norge. Denne kategorien er kun Norge foreløpig.";
  }

  if (category === "ai_education") {
    return locale === "en"
      ? "A curated overview of AI educations in Norway, including courses and study programs. This category is Norway-only for now."
      : "En kuratert oversikt over AI-utdanning i Norge, inkludert kurs og studieløp. Denne kategorien er kun Norge foreløpig.";
  }

  if (category === "all") {
    return locale === "en"
      ? "A curated overview of AI-first businesses, AI conferences, and AI educations in Norway outside the advertising and media industry."
      : "En kuratert oversikt over AI-first bedrifter, AI-konferanser og AI-utdanning i Norge utenfor reklame- og mediebransjen.";
  }

  return locale === "en"
    ? "A curated overview of AI-first businesses in Norway outside the advertising and media industry."
    : "En kuratert oversikt over AI-first bedrifter i Norge utenfor reklame- og mediebransjen.";
}

function categoryEmptyState(
  category: OtherAiServiceCategoryFilter,
  locale: "no" | "en"
): string {
  if (category === "ai_conference") {
    return locale === "en" ? "No AI conferences yet." : "Ingen AI-konferanser ennå.";
  }
  if (category === "ai_education") {
    return locale === "en" ? "No AI educations yet." : "Ingen AI-utdanninger ennå.";
  }
  if (category === "all") {
    return locale === "en" ? "No listings yet." : "Ingen oppføringer ennå.";
  }
  return locale === "en" ? "No AI-first businesses yet." : "Ingen AI-first bedrifter ennå.";
}

function fallbackLeadDescription(
  category: OtherAiServiceCategory,
  locale: "no" | "en"
): string {
  if (category === "ai_conference") {
    return locale === "en"
      ? "AI conference listing in Norway"
      : "AI-konferanseoppføring i Norge";
  }
  if (category === "ai_education") {
    return locale === "en"
      ? "AI education listing in Norway"
      : "AI-utdanningsoppføring i Norge";
  }
  return locale === "en"
    ? "Independent AI service in Norway"
    : "Uavhengig KI-tjeneste i Norge";
}

export default async function OtherAiServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const locale = await getLocale();
  const sp = await searchParams;
  const selectedCategory =
    parseOtherAiServiceCategoryFilter(readFirstParam(sp.category)) ??
    DEFAULT_OTHER_AI_SERVICE_CATEGORY;

  const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? supabaseAdmin()
    : await supabaseServerClient();

  const leadsPromise = (async () => {
    let rows: AdLeadRow[] = [];
    let leadError: { message: string } | null = null;

    let categoryQuery = supabase
      .from("ad_leads")
      .select("id,name,website,description,category")
      .or("market.eq.no,market.is.null")
      .order("name", { ascending: true });

    if (selectedCategory !== "all") {
      categoryQuery = categoryQuery.eq("category", selectedCategory);
    }

    const categoryResult = await categoryQuery;

    if (categoryResult.error && isCategoryColumnMissing(categoryResult.error.message)) {
      const fallbackResult = await supabase
        .from("ad_leads")
        .select("id,name,website,description")
        .or("market.eq.no,market.is.null")
        .order("name", { ascending: true });

      rows = (fallbackResult.data ?? []) as AdLeadRow[];
      leadError = fallbackResult.error
        ? { message: fallbackResult.error.message }
        : null;
    } else {
      rows = (categoryResult.data ?? []) as AdLeadRow[];
      leadError = categoryResult.error ? { message: categoryResult.error.message } : null;
    }

    const normalizedLeads: AdLead[] = rows
      .map((row) => ({
        id: row.id,
        name: row.name,
        website: row.website,
        description: row.description,
        category: resolveOtherAiServiceCategory(
          row.category,
          row.name,
          row.description
        ),
      }))
      .filter((row) => {
        if (selectedCategory === "all") return true;
        return row.category === selectedCategory;
      });

    return { leads: normalizedLeads, error: leadError };
  })();

  const [
    { leads, error },
    topBannerAd,
    heroAd,
    gridBannerAd,
    gridBannerAd2,
    gridBannerAd3,
  ] = await Promise.all([
    leadsPromise,
    getAdForPlacement("catalog_top_banner"),
    getAdForPlacement("other_hero_sidebar"),
    getAdForPlacement("catalog_grid_banner"),
    getAdForPlacement("catalog_grid_banner_2"),
    getAdForPlacement("catalog_grid_banner_3"),
  ]);

  const basePath = localizePath(locale, "/andre-ki-tjenester");
  const categoryOptions: Array<{
    value: OtherAiServiceCategoryFilter;
    label: string;
    href: string;
  }> = [
    {
      value: DEFAULT_OTHER_AI_SERVICE_CATEGORY,
      label: otherAiServiceCategoryLabel(DEFAULT_OTHER_AI_SERVICE_CATEGORY, locale),
      href: basePath,
    },
    {
      value: "ai_conference",
      label: otherAiServiceCategoryLabel("ai_conference", locale),
      href: `${basePath}?category=ai_conference`,
    },
    {
      value: "ai_education",
      label: otherAiServiceCategoryLabel("ai_education", locale),
      href: `${basePath}?category=ai_education`,
    },
    {
      value: "all",
      label: locale === "en" ? "All categories" : "Alle kategorier",
      href: `${basePath}?category=all`,
    },
  ];

  const heroCategoryLabel =
    selectedCategory === "all"
      ? locale === "en"
        ? "All categories"
        : "Alle kategorier"
      : otherAiServiceCategoryLabel(selectedCategory, locale);

  const bannerInsertAfterLeadIndex = 5;
  const shouldInsertGridBanner =
    Boolean(gridBannerAd) && leads.length > bannerInsertAfterLeadIndex;

  const banner2InsertAfterLeadIndex = 11;
  const shouldInsertGridBanner2 =
    Boolean(gridBannerAd2) && leads.length >= banner2InsertAfterLeadIndex + 2;

  const banner3InsertAfterLeadIndex = 17;
  const shouldInsertGridBanner3 =
    Boolean(gridBannerAd3) && leads.length >= banner3InsertAfterLeadIndex + 2;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {topBannerAd ? (
        <div className="mb-6">
          <AdSlot
            ad={topBannerAd}
            sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
            openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
            variant="banner"
            locale={locale}
          />
        </div>
      ) : null}

      <div
        className={
          heroAd
            ? "grid gap-6 lg:grid-cols-[1fr_360px] items-stretch"
            : "grid gap-6"
        }
      >
        <section className="relative overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.16),transparent_50%)]" />
          <div className="relative px-6 py-10 sm:px-10">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
              <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1">
                {locale === "en" ? "Norway" : "Norge"}
              </span>
              <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1">
                {heroCategoryLabel}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {locale === "en" ? "Other AI services" : "Andre KI-tjenester"}
            </h1>
            <p className="mt-3 max-w-2xl text-[rgb(var(--muted))]">
              {heroDescription(selectedCategory, locale)}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {categoryOptions.map((option) => {
                const isActive = option.value === selectedCategory;
                return (
                  <Link
                    key={option.value}
                    href={option.href}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      isActive
                        ? "border-transparent bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
                        : "border-[rgb(var(--border))] bg-[rgb(var(--bg))] text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                    }`}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm shadow-soft">
              <span className="text-[rgb(var(--muted))]">
                {locale === "en" ? "Number of listings" : "Antall oppføringer"}
              </span>
              <span className="rounded-full bg-[rgb(var(--fg))] px-2.5 py-0.5 text-xs font-semibold text-[rgb(var(--bg))]">
                {leads.length}
              </span>
            </div>
          </div>
        </section>

        {heroAd ? (
          <>
            <div className="lg:hidden">
              <AdSlot
                ad={heroAd}
                sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
                openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
                variant="banner"
                compact
                locale={locale}
              />
            </div>
            <div className="hidden lg:block">
              <AdSlot
                ad={heroAd}
                sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
                openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
                variant="sidebar"
                locale={locale}
              />
            </div>
          </>
        ) : null}
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-300/40 bg-rose-50/60 p-5 text-sm text-rose-700">
          {locale === "en"
            ? `Could not fetch listings: ${error.message}`
            : `Kunne ikke hente oppføringer: ${error.message}`}
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {leads.map((lead, index) => (
          <div key={lead.id} className="contents">
            <div className="group relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="absolute right-4 top-4 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                {otherAiServiceCategoryLabel(lead.category, locale)}
              </div>
              <div className="text-lg font-semibold tracking-tight">{lead.name}</div>
              {lead.description ? (
                <div className="mt-2 text-sm text-[rgb(var(--muted))] line-clamp-3">
                  {lead.description}
                </div>
              ) : (
                <div className="mt-2 text-sm text-[rgb(var(--muted))]">
                  {fallbackLeadDescription(lead.category, locale)}
                </div>
              )}
              {lead.website ? (
                <a
                  href={lead.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm font-medium text-indigo-500 transition hover:text-indigo-600"
                >
                  {locale === "en" ? "Visit website →" : "Besøk nettside →"}
                </a>
              ) : (
                <div className="mt-4 text-sm text-[rgb(var(--muted))]">
                  {locale === "en" ? "Website missing" : "Nettside mangler"}
                </div>
              )}
            </div>
            {shouldInsertGridBanner && index === bannerInsertAfterLeadIndex ? (
              <div className="sm:col-span-2 lg:col-span-3">
                <AdSlot
                  ad={gridBannerAd ?? null}
                  sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
                  openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
                  variant="banner"
                  locale={locale}
                />
              </div>
            ) : null}
            {shouldInsertGridBanner2 && index === banner2InsertAfterLeadIndex ? (
              <div className="sm:col-span-2 lg:col-span-3">
                <AdSlot
                  ad={gridBannerAd2 ?? null}
                  sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
                  openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
                  variant="banner"
                  locale={locale}
                />
              </div>
            ) : null}
            {shouldInsertGridBanner3 && index === banner3InsertAfterLeadIndex ? (
              <div className="sm:col-span-2 lg:col-span-3">
                <AdSlot
                  ad={gridBannerAd3 ?? null}
                  sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
                  openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
                  variant="banner"
                  locale={locale}
                />
              </div>
            ) : null}
          </div>
        ))}
        {!leads.length && !error ? (
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 text-[rgb(var(--muted))] shadow-soft">
            {categoryEmptyState(selectedCategory, locale)}
          </div>
        ) : null}
      </div>
    </div>
  );
}
