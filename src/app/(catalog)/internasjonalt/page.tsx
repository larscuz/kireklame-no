import type { Metadata } from "next";

import ListingGrid from "@/app/_components/ListingGrid";
import HeroInternational from "@/app/_components/HeroInternational";
import { getCompanies } from "@/lib/supabase/server";
import { parseSearchParams } from "@/lib/utils";
import { siteMeta } from "@/lib/seo";

export const metadata: Metadata = siteMeta({
  title: "Internasjonal – KiReklame.no",
  description: "Internasjonale AI-first aktører og aigencies innen reklame og kreativ produksjon.",
  path: "/internasjonal",
});

export default async function InternasjonalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = parseSearchParams(sp);

  const { companies } = await getCompanies(params, { market: "intl" });
  const intl = companies ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      {/* HERO */}
      <HeroInternational
  heroVideoUrl="https://video.wixstatic.com/video/f82397_e685f1fa8a0d44dcbe08337acf33fff1/1080p/mp4/file.mp4"
  poster="/covers/cover-1.jpg"
/>


      {/* Content under hero */}
      <div className="mt-8">
        <div className="flex items-end justify-between gap-6">
          <div className="text-sm text-[rgb(var(--muted))]">
            {intl.length} treff
          </div>
        </div>

        <div className="mt-6">
          <ListingGrid companies={intl} />
        </div>
      </div>
    </div>
  );
}
