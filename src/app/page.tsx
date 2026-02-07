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
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/60 p-6 shadow-soft">
          <div className="text-xs uppercase tracking-wide text-[rgb(var(--muted))]">
            Om katalogen
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            KI reklame, AI‑video og markedsføring i Norge
          </h2>
          <p className="mt-3 text-sm text-[rgb(var(--muted))] leading-relaxed">
            KiReklame er en kuratert oversikt over norske aktører som jobber med KI i reklame,
            annonser, video og kreativ produksjon. Enten du trenger et KI‑byrå, AI‑drevet
            reklamefilm eller produksjon av innhold for performance marketing, finner du
            relevante leverandører her.
          </p>
          <p className="mt-3 text-sm text-[rgb(var(--muted))] leading-relaxed">
            Bruk filtrene for å finne byråer med riktig tjenesteområde, prispunkt og AI‑nivå.
            Du kan også utforske steder og tags for mer nisjet søk innen markedsføring og
            reklame.
          </p>
          <ul className="mt-4 text-sm text-[rgb(var(--muted))] grid gap-1">
            <li>KI reklamebyråer og AI‑first studioer</li>
            <li>AI‑video, reklamefilm og kreativ produksjon</li>
            <li>Markedsføring, performance og innholdsproduksjon</li>
            <li>Generativ design, post‑produksjon og automatisering</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
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
      </section>
    </div>
  );
}
