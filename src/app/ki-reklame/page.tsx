import type { Metadata } from "next";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";
import { siteMeta } from "@/lib/seo";
import {
  dedupeShowreelItems,
  getDirectMp4Url,
  mapShowreelCmsRows,
  parseCloudflareShowreels,
  type ShowreelCmsRow,
  type ShowreelItem,
} from "@/lib/showreel";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCompanies } from "@/lib/supabase/server";
import StereoscopicViewerWheel from "./StereoscopicViewerWheel";

async function loadCmsShowreelItems(): Promise<ShowreelItem[] | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("showreel_entries")
    .select(
      "id,name,href,video_url,description,thumbnail_url,eyebrow,cta_label,sort_order,is_active,created_at,updated_at"
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (error.code === "42P01") {
      return null;
    }
    console.error("[ki-reklame] could not load showreel_entries:", error.message);
    return [];
  }

  return mapShowreelCmsRows((data ?? []) as ShowreelCmsRow[]);
}

export const metadata: Metadata = siteMeta({
  title: "KI-reklame i Norge – showreels, byråer og eksempler | KiReklame",
  description:
    "Utforsk KI-reklame i Norge med autoplay showreel, AI-first byråer og konkrete eksempler på video, kampanjer og kreativ produksjon.",
  path: "/ki-reklame",
});

export default async function KiReklamePage() {
  const locale = await getLocale();
  const cmsItems = await loadCmsShowreelItems();
  const cmsMode = cmsItems !== null;

  let reelItems: ShowreelItem[] = [];
  if (cmsMode) {
    reelItems = dedupeShowreelItems(cmsItems);
  } else {
    const [{ companies: noCompanies }, { companies: intlCompanies }] = await Promise.all([
      getCompanies({}, { market: "no" }),
      getCompanies({}, { market: "intl" }),
    ]);
    const companies = [...noCompanies, ...intlCompanies];
    const intlIds = new Set(intlCompanies.map((company) => company.id));
    const fallbackItems: ShowreelItem[] = [...parseCloudflareShowreels({ locale })];

    for (const company of companies) {
      const videoUrl = getDirectMp4Url(company.video_url ?? null);
      if (!videoUrl) continue;

      const isIntl = intlIds.has(company.id);
      fallbackItems.push({
        id: company.id,
        name: company.name,
        href: localizePath(locale, `/selskap/${company.slug}`),
        videoUrl,
        description: company.short_description ?? null,
        thumbnailUrl: company.cover_image ?? null,
        eyebrow: isIntl
          ? locale === "en"
            ? "International"
            : "Internasjonalt"
          : company.location?.name ?? (locale === "en" ? "Norway" : "Norge"),
        ctaLabel: locale === "en" ? "View case" : "Åpne case",
        source: "company",
      });
    }
    reelItems = dedupeShowreelItems(fallbackItems);
  }

  return (
    <main>
      <h1 className="sr-only">
        {locale === "en"
          ? "AI advertising showreel and agencies"
          : "KI-reklame showreel og byråer"}
      </h1>
      <section>
        {reelItems.length > 0 ? (
          <StereoscopicViewerWheel items={reelItems} />
        ) : (
          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
            <h2 className="text-xl font-semibold">
              {locale === "en" ? "No showheel videos yet" : "Ingen showheel-videoer ennå"}
            </h2>
            <p className="mt-2 text-[rgb(var(--muted))]">
              {cmsMode
                ? locale === "en"
                  ? "This page is controlled by Showheel CMS. Add videos in /admin/showheel."
                  : "Denne siden styres av Showheel CMS. Legg til videoer i /admin/showheel."
                : locale === "en"
                  ? "Add the showreel_entries table to switch to manual Showheel CMS control."
                  : "Legg til showreel_entries-tabellen for å bytte til manuell Showheel CMS-styring."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
