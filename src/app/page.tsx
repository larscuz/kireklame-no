import HeroSearch from "./_components/HeroSearch";
import FilterChips from "./_components/FilterChips";
import ListingGrid from "./_components/ListingGrid";
import { getCompanies } from "@/lib/supabase/server";
import { parseSearchParamsAsync } from "@/lib/utils";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function Home(props: any) {
  const params = await parseSearchParamsAsync(props?.searchParams);
  const { companies, facets } = await getCompanies(params);

  // Featured hero video (Supabase first, env fallback)
  const { data: settings } = await supabaseAdmin()
    .from("site_settings")
    .select("featured_hero_video_url")
    .eq("id", 1)
    .maybeSingle();

  const heroVideoUrl =
    settings?.featured_hero_video_url ||
    process.env.NEXT_PUBLIC_HERO_VIDEO_URL ||
    null;

  return (
    <div className="bg-[rgb(var(--bg))]">
      <HeroSearch initialQuery={params.q ?? ""} heroVideoUrl={heroVideoUrl} />

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <FilterChips facets={facets} params={params} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <ListingGrid companies={companies} />
      </section>
    </div>
  );
}
