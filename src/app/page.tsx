import HeroSearch from "./_components/HeroSearch";
import FilterChips from "./_components/FilterChips";
import ListingGrid from "./_components/ListingGrid";
import { getCompanies } from "@/lib/supabase/server";
import { parseSearchParamsAsync } from "@/lib/utils";

export default async function Home(props: any) {
  const params = await parseSearchParamsAsync(props?.searchParams);
  const { companies, facets } = await getCompanies(params);

  return (
    <div className="bg-[rgb(var(--bg))]">
      <HeroSearch initialQuery={params.q ?? ""} />

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <FilterChips facets={facets} params={params} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <ListingGrid companies={companies} />
      </section>
    </div>
  );
}
