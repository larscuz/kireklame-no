// src/app/page.tsx
import HeroSearch from "./_components/HeroSearch";
import FilterChips from "./_components/FilterChips";
import ListingGrid from "./_components/ListingGrid";
import { getCompanies, getCompanyBySlug } from "@/lib/supabase/server";
import { parseSearchParamsAsync } from "@/lib/utils";
import { supabaseAdmin } from "@/lib/supabase/admin";

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

  return (
    <div className="bg-[rgb(var(--bg))]">
      <HeroSearch
        initialQuery={params.q ?? ""}
        heroVideoUrl={heroVideoUrl}
        featuredCompany={featured}
      />

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <FilterChips facets={facets} params={params} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <ListingGrid companies={companies} />
      </section>
    </div>
  );
}
