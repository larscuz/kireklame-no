import type { Metadata } from "next";

import ListingGrid from "@/app/_components/ListingGrid";
import HeroInternational from "@/app/_components/HeroInternational";
import { getCompanies } from "@/lib/supabase/server";
import { parseSearchParams } from "@/lib/utils";
import { siteMeta } from "@/lib/seo";
import { getLocale } from "@/lib/i18n.server";

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
  const locale = getLocale();
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
        }}
      />


      {/* Content under hero */}
      <div className="mt-8">
        <div className="flex items-end justify-between gap-6">
          <div className="text-sm text-[rgb(var(--muted))]">
            {locale === "en" ? `${intl.length} results` : `${intl.length} treff`}
          </div>
        </div>

        <div className="mt-6">
          <ListingGrid companies={intl} />
        </div>
      </div>
    </div>
  );
}
