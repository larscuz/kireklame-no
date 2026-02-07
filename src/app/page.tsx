// src/app/page.tsx
import Link from "next/link";
import HeroSearch from "./_components/HeroSearch";
import FilterChips from "./_components/FilterChips";
import ListingGrid from "./_components/ListingGrid";
import { getCompanies, getCompanyBySlug } from "@/lib/supabase/server";
import { parseSearchParamsAsync } from "@/lib/utils";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { siteMeta } from "@/lib/seo";

export const metadata = siteMeta({
  title: "KI reklame i Norge – byråer, video og markedsføring | KiReklame",
  description:
    "Finn norske KI‑byråer, reklamebyråer og studioer som lager AI‑video, annonser og markedsføring. Filtrer på tjenester, pris og AI‑nivå.",
  path: "/",
});

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

      {/* FILTER (kun desktop/tablet) */}
      <section className="hidden md:block mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft px-3 py-3">
          <FilterChips facets={facets} params={params} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <ListingGrid companies={companies} />
      </section>

      {/* SEO: hold this at the bottom */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-gradient-to-b from-[rgb(var(--card))]/80 to-[rgb(var(--card))]/40 p-6 shadow-soft ring-1 ring-[rgb(var(--border))]/60">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
            Om katalogen
          </div>
          <div className="mt-3 grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                KI reklame, AI‑video og markedsføring i Norge
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[rgb(var(--muted))]">
                KiReklame er en kuratert oversikt over norske aktører som jobber med KI i
                reklame, annonser, video og kreativ produksjon. Enten du trenger et KI‑byrå,
                AI‑drevet reklamefilm eller produksjon av innhold for performance marketing,
                finner du relevante leverandører her.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[rgb(var(--muted))]">
                Bruk filtrene for å finne byråer med riktig tjenesteområde, prispunkt og
                AI‑nivå. Du kan også utforske steder og tags for mer nisjet søk innen
                markedsføring og reklame.
              </p>
            </div>
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/40 p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                Fokusområder
              </div>
              <ul className="mt-3 grid gap-2 text-[11px] text-[rgb(var(--muted))] sm:grid-cols-2">
                <li className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5">
                  KI reklamebyråer og AI‑first studioer
                </li>
                <li className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5">
                  AI‑video, reklamefilm og kreativ produksjon
                </li>
                <li className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5">
                  Markedsføring, performance og innholdsproduksjon
                </li>
                <li className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5">
                  Generativ design, post‑produksjon og automatisering
                </li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <Link
                  href="/ki-reklamebyra"
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
                >
                  KI reklamebyrå
                </Link>
                <Link
                  href="/ai-video"
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
                >
                  AI‑video produksjon
                </Link>
                <Link
                  href="/ki-markedsforing"
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
                >
                  KI markedsføring
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
