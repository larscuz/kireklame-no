import HeroSearch from "./_components/HeroSearch";
import FilterChips from "./_components/FilterChips";
import ListingGrid from "./_components/ListingGrid";
import { getCompanies, getCompanyBySlug } from "@/lib/supabase/server";
import { parseSearchParamsAsync, typeLabel } from "@/lib/utils";

export default async function Home(props: any) {
  const params = await parseSearchParamsAsync(props?.searchParams);
  const { companies, facets } = await getCompanies(params);

  // ✅ Hardkodet hero video (midlertidig)
  const heroVideoUrl =
    "https://framerusercontent.com/assets/pjTRlzCsWDVfS2cyYwWWpCykLeg.mp4";

  // ✅ Hardkodet featured company (midlertidig)
  const featuredSlug = "reimagine-studios";
  const featured = await getCompanyBySlug(featuredSlug);

  const featuredCompany = featured
    ? {
        name: featured.name,
        slug: featured.slug,
        company_type: featured.company_type ? typeLabel(featured.company_type) : null,
        locationName: (featured as any)?.location?.name ?? null,
      }
    : null;

  return (
    <div className="bg-[rgb(var(--bg))]">
      <HeroSearch
        initialQuery={params.q ?? ""}
        heroVideoUrl={heroVideoUrl}
        featuredCompany={featuredCompany}
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
