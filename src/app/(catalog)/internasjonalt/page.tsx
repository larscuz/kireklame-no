import type { Metadata } from "next";

import ListingGrid from "@/app/_components/ListingGrid";
import HeroInternational from "@/app/_components/HeroInternational";
import { getCompanies } from "@/lib/supabase/server";
import { parseSearchParams } from "@/lib/utils";
import { siteMeta } from "@/lib/seo";
import { getLocale } from "@/lib/i18n.server";
import { getAdForPlacement } from "@/lib/ads";
import AdSlot from "@/app/_components/AdSlot";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCompanyBySlug } from "@/lib/supabase/server";

export const metadata: Metadata = siteMeta({
  title: "Internasjonale AI‑byråer og reklameaktører | KiReklame",
  description: "Utvalgte internasjonale AI‑first byråer og studioer for reklame, AI‑video og markedsføring.",
  path: "/internasjonalt",
});

export default async function InternasjonaltPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const sp = await searchParams;
  const params = parseSearchParams(sp);

  const [{ companies }, heroAd, bannerAd, gridBannerAd, gridBannerAd2, gridBannerAd3, settings] = await Promise.all([
    getCompanies(params, { market: "intl" }),
    getAdForPlacement("international_hero_sidebar"),
    getAdForPlacement("catalog_top_banner"),
    getAdForPlacement("catalog_grid_banner"),
    getAdForPlacement("catalog_grid_banner_2"),
    getAdForPlacement("catalog_grid_banner_3"),
    supabaseAdmin()
      .from("site_settings")
      .select("international_featured_company_slug, international_hero_video_url")
      .eq("id", 1)
      .maybeSingle()
      .then((res) => res.data ?? null),
  ]);
  const intl = companies ?? [];
  const internationalHeroVideoUrl = settings?.international_hero_video_url ?? null;
  const internationalFeaturedSlug =
    settings?.international_featured_company_slug ?? null;
  const internationalFeatured =
    internationalFeaturedSlug ? await getCompanyBySlug(internationalFeaturedSlug) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      {bannerAd ? (
        <div className="pt-3 mb-2">
          <AdSlot
            ad={bannerAd}
            sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
            openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
            variant="banner"
            locale={locale}
          />
        </div>
      ) : null}

      {/* HERO */}
      <HeroInternational
        heroVideoUrl={internationalHeroVideoUrl}
        poster="/covers/cover-1.jpg"
        locale={locale}
        copy={{
          title: locale === "en" ? "International" : "Internasjonalt",
          titleMuted: locale === "en" ? "– directory" : "– katalog",
          subtitle:
            locale === "en"
              ? "A curated directory of international players using AI in advertising and creative production."
              : "En kuratert katalog over internasjonale aktører som bruker AI i reklame og kreativ produksjon.",
          cta: locale === "en" ? "See Norwegian creators" : "Se norske aktører",
          featuredLabel: locale === "en" ? "Featured" : "Utvalgt",
          featuredMeta: locale === "en" ? "Studio · International" : "Studio · Internasjonalt",
          sponsorLabel: locale === "en" ? "Sponsored" : "Sponset",
          openLinkFallback: locale === "en" ? "Open link" : "Åpne lenke",
        }}
        sponsorAd={heroAd}
        featuredCompany={
          internationalFeatured?.slug
            ? {
                name: internationalFeatured.name,
                slug: internationalFeatured.slug,
                meta: `${internationalFeatured.company_type ?? ""}${
                  internationalFeatured.company_type ? " · " : ""
                }${locale === "en" ? "International" : "Internasjonalt"}`,
              }
            : null
        }
      />


      {/* Content under hero */}
      <div className="mt-6">
        <div className="mt-4">
          <ListingGrid
            companies={intl}
            gridBannerAd={gridBannerAd}
            gridBannerAd2={gridBannerAd2}
            gridBannerAd3={gridBannerAd3}
          />
        </div>
      </div>
    </div>
  );
}
