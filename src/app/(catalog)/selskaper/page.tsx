import type { Metadata } from "next";
import Link from "next/link";

import ListingGrid from "@/app/_components/ListingGrid";
import FilterChips from "@/app/_components/FilterChips";
import HeroBackgroundVideo from "@/app/_components/HeroBackgroundVideo";
import { getCompanies } from "@/lib/supabase/server";
import { parseSearchParams } from "@/lib/utils";
import { siteMeta } from "@/lib/seo";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";
import { getAdForPlacement } from "@/lib/ads";
import AdSlot from "@/app/_components/AdSlot";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCompanyBySlug } from "@/lib/supabase/server";

export const metadata: Metadata = siteMeta({
  title: "KI‑byråer og reklamebyråer – Norge | KiReklame",
  description:
    "Katalog over norske KI‑byråer, reklamebyråer og studioer for AI‑video, annonser og markedsføring.",
  path: "/selskaper",
});

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const sp = await searchParams;
  const params = parseSearchParams(sp);
  const [
    { companies, facets },
    heroAd,
    bannerAd,
    inlineAd,
    gridBannerAd,
    gridBannerAd2,
    gridBannerAd3,
    settings,
  ] = await Promise.all([
    getCompanies(params),
    getAdForPlacement("companies_hero_sidebar"),
    getAdForPlacement("catalog_top_banner"),
    getAdForPlacement("catalog_inline_card"),
    getAdForPlacement("catalog_grid_banner"),
    getAdForPlacement("catalog_grid_banner_2"),
    getAdForPlacement("catalog_grid_banner_3"),
    supabaseAdmin()
      .from("site_settings")
      .select("companies_featured_company_slug, companies_hero_video_url")
      .eq("id", 1)
      .maybeSingle()
      .then((res) => res.data ?? null),
  ]);

  const companiesHeroVideoUrl = settings?.companies_hero_video_url ?? null;
  const companiesFeaturedSlug = settings?.companies_featured_company_slug ?? null;
  const companiesFeatured =
    companiesFeaturedSlug
      ? await getCompanyBySlug(companiesFeaturedSlug)
      : null;


  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {bannerAd ? (
        <div className="pt-3 mb-4">
          <AdSlot
            ad={bannerAd}
            sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
            openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
            variant="banner"
            locale={locale}
          />
        </div>
      ) : null}

      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {locale === "en" ? "Companies" : "Selskaper"}
          </h1>
        </div>
      </div>

      {/* ✅ CTA: Registrer bedrift */}
      <div
        className={
          heroAd
            ? "mt-4 grid gap-6 lg:grid-cols-[1fr_360px] items-stretch"
            : "mt-4"
        }
      >
        <div className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-soft">
          {companiesHeroVideoUrl ? (
            <>
              <HeroBackgroundVideo
                src={companiesHeroVideoUrl}
                poster="/covers/cover-1.jpg"
              />
              <div className="absolute inset-0 bg-black/25" />
            </>
          ) : null}

          <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold">
                {locale === "en" ? "Are we missing you?" : "Mangler vi deg?"}
              </div>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                {locale === "en"
                  ? "Register your company — we review all submissions before publishing."
                  : "Registrer bedriften din — vi modererer alle innsendinger før publisering."}
              </div>
              {companiesFeatured?.slug ? (
                <div className="mt-3 text-sm text-[rgb(var(--muted))]">
                  <span className="mr-2 inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                    {locale === "en" ? "Featured" : "Utvalgt"}
                  </span>
                  <Link
                    href={localizePath(locale, `/selskap/${companiesFeatured.slug}`)}
                    className="font-semibold underline-offset-2 hover:underline text-[rgb(var(--fg))]"
                  >
                    {companiesFeatured.name}
                  </Link>
                </div>
              ) : null}
            </div>

            <Link
              href={localizePath(locale, "/register/company")}
              className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-3 text-sm font-semibold shadow-soft hover:opacity-90 transition"
            >
              {locale === "en" ? "Register company" : "Registrer bedrift"}
            </Link>
          </div>
        </div>

        {heroAd ? (
          <>
            <div className="lg:hidden">
              <AdSlot
                ad={heroAd}
                sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
                openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
                variant="hero"
                locale={locale}
              />
            </div>
            <div className="hidden lg:block">
              <AdSlot
                ad={heroAd}
                sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
                openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
                variant="sidebar"
                className="h-full"
                locale={locale}
              />
            </div>
          </>
        ) : null}
      </div>

      <div className="mt-4">
        <FilterChips facets={facets} params={params} locale={locale} />
      </div>

      <section className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-soft">
        <div className="text-sm font-semibold">
          {locale === "en" ? "Related topics" : "Relaterte temaer"}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <Link
            href={localizePath(locale, "/ki-reklamebyra")}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            {locale === "en" ? "AI advertising agencies" : "KI reklamebyrå"}
          </Link>
          <Link
            href={localizePath(locale, "/ai-video")}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            {locale === "en" ? "AI video production" : "AI‑video produksjon"}
          </Link>
          <Link
            href={localizePath(locale, "/ki-markedsforing")}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            {locale === "en" ? "AI marketing" : "KI markedsføring"}
          </Link>
        </div>
      </section>

      <div className="mt-8">
        <ListingGrid
          companies={companies}
          inlineAd={inlineAd}
          gridBannerAd={gridBannerAd}
          gridBannerAd2={gridBannerAd2}
          gridBannerAd3={gridBannerAd3}
        />
      </div>
    </div>
  );
}
