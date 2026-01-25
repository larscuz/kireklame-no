// src/app/page.tsx
import type { Metadata } from "next";
import HeroSearch from "./_components/HeroSearch";
import FilterChips from "./_components/FilterChips";
import ListingGrid from "./_components/ListingGrid";
import { getCompanies, getCompanyBySlug } from "@/lib/supabase/server";
import { parseSearchParamsAsync } from "@/lib/utils";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "KiReklame.no – Norsk katalog for KI i reklame og kreativ produksjon",
  description:
    "Kuratert katalog over norske byråer, studioer og frilansmiljøer som bruker KI i reklame, film og kreativ produksjon.",
  alternates: { canonical: "/" },
};

export default async function Home(props: any) {
  const params = await parseSearchParamsAsync(props?.searchParams);

  // 1) Hent katalog-data som før
  const { companies, facets } = await getCompanies(params);

  // 2) Hent hero settings (featured + video)
  const { data: settings } = await supabaseAdmin()
    .from("site_settings")
    .select("featured_company_slug, featured_hero_video_url")
    .eq("id", 1)
    .maybeSingle();

  const heroVideoUrl = settings?.featured_hero_video_url ?? null;

  const featuredSlug = settings?.featured_company_slug ?? null;
  const featuredCompany = featuredSlug ? await getCompanyBySlug(featuredSlug) : null;

  const featured =
    featuredCompany?.slug
      ? {
          name: featuredCompany.name,
          slug: featuredCompany.slug,
          company_type: featuredCompany.company_type ?? null,
          locationName: featuredCompany.location?.name ?? null,
        }
      : null;

  // 3) Hent aktiv annonse for hero sidebar
  const { data: ad } = await supabaseAdmin()
    .from("ads")
    .select("id, title, image_url, mobile_image_url, href, alt, label, cta_text, priority")
    .eq("placement", "home_hero_sidebar")
    .eq("is_active", true)
    .order("priority", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (
    <div className="bg-[rgb(var(--bg))]">
      <HeroSearch
        initialQuery={params.q ?? ""}
        heroVideoUrl={heroVideoUrl}
        featuredCompany={featured}
        sponsorAd={ad ?? null}
      />

      {/* FILTER (kompakt) */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft px-3 py-3">
          <FilterChips facets={facets} params={params} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <ListingGrid companies={companies} />
      </section>
    </div>
  );
}
