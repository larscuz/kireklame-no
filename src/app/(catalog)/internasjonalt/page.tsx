import type { Metadata } from "next";

import ListingGrid from "@/app/_components/ListingGrid";
import FilterChips from "@/app/_components/FilterChips";
import { getCompanies } from "@/lib/supabase/server";
import { parseSearchParams } from "@/lib/utils";
import { siteMeta } from "@/lib/seo";

export const metadata: Metadata = siteMeta({
  title: "Internasjonalt – KiReklame.no",
  description: "Internasjonale AI/KI-aktører innen reklame og kreativ produksjon.",
  path: "/internasjonalt",
});

export default async function InternasjonaltPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = parseSearchParams(sp);

  const { companies, facets } = await getCompanies(params, { market: "intl" });


  const intl = companies ?? [];



  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Internasjonalt</h1>
          <p className="mt-2 text-[rgb(var(--muted))]">Filtrer på AI-nivå og pris.</p>
        </div>
        <div className="hidden md:block text-sm text-[rgb(var(--muted))]">
          {intl.length} treff
        </div>
      </div>

      {/*
<div className="mt-6">
  <FilterChips facets={facets} params={params} basePath="/internasjonalt" />
</div>
*/}


      <div className="mt-8">
        <ListingGrid companies={intl} />
      </div>
    </div>
  );
}
