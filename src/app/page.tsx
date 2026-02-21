// src/app/page.tsx
import Link from "next/link";
import HeroSearch from "./_components/HeroSearch";
import ListingGrid from "./_components/ListingGrid";
import { getCompanies, getCompanyBySlug } from "@/lib/supabase/server";
import { parseSearchParamsAsync } from "@/lib/utils";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { siteMeta } from "@/lib/seo";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";
import { getAdForPlacement } from "@/lib/ads";
import AdSlot from "./_components/AdSlot";

export const metadata = siteMeta({
  title: "KI reklame i Norge – AI videoproduksjon, byråer og reklamefilm | KiReklame",
  description:
    "Finn norske leverandører for kommersiell AI videoproduksjon, reklamefilm og KI reklame. Dekk behov for AI reklame, KI i reklame og AI i reklame i ett samlet markedsoverblikk.",
  path: "/",
});

export default async function Home(props: any) {
  const locale = await getLocale();
  const params = await parseSearchParamsAsync(props?.searchParams);
  const apprenticeQuery = locale === "en" ? "apprentice" : "lærling";
  const faqItems =
    locale === "en"
      ? [
          {
            q: "What does AI video production for commercial campaigns cost?",
            a: "Price depends on scope, formats, and delivery speed. Compare agencies and studios to get quotes for your campaign needs.",
          },
          {
            q: "What is the difference between AI advertising and general marketing automation?",
            a: "AI advertising here means customer-facing campaign creative and commercial video production, not only backend automation.",
          },
          {
            q: "Can I order campaign video directly from listed companies?",
            a: "Yes. KiReklame is built to help buyers find relevant suppliers for commercial AI creative production in Norway.",
          },
          {
            q: "How do I choose an AI agency for commercial video?",
            a: "Review relevant cases, service fit, delivery model, and budget alignment before contacting shortlisted providers.",
          },
        ]
      : [
          {
            q: "Hva koster AI videoproduksjon for reklamekampanjer?",
            a: "Pris avhenger av omfang, format og leveringstakt. Sammenlign byråer og studioer for å få konkrete tilbud til kampanjen din.",
          },
          {
            q: "Hva er forskjellen på KI-reklame og generell markedsføringsautomatisering?",
            a: "Her betyr KI-reklame kundevendt kampanjekreativitet og kommersiell videoproduksjon, ikke bare intern automatisering.",
          },
          {
            q: "Kan jeg bestille kampanjevideo direkte fra selskapene i katalogen?",
            a: "Ja. KiReklame er laget for å hjelpe kjøpere med å finne relevante leverandører for kommersiell AI-kreativ produksjon i Norge.",
          },
          {
            q: "Hvordan velger jeg riktig KI-byrå for reklamefilm?",
            a: "Se på relevante caser, tjenestematch, leveransemodell og budsjett før du kontakter aktuelle leverandører.",
          },
          {
            q: "Er det forskjell på «KI i reklame» og «AI i reklame»?",
            a: "Begrepene brukes ofte om samme område: bruk av kunstig intelligens i kommersiell reklameproduksjon og kampanjekreativitet.",
          },
        ];

  const highIntentLinks =
    locale === "en"
      ? [
          { label: "AI advertising", href: localizePath(locale, "/ki-reklame") },
          { label: "AI commercial production price", href: localizePath(locale, "/ai-video") },
          { label: "Commercial production", href: localizePath(locale, "/ai-video") },
          { label: "AI agency", href: localizePath(locale, "/ki-reklamebyra") },
          { label: "AI media agency", href: localizePath(locale, "/ki-reklamebyra") },
          { label: "AI campaign", href: localizePath(locale, "/ki-markedsforing") },
          { label: "Apprentices", href: `${localizePath(locale, "/selskaper")}?q=${encodeURIComponent(apprenticeQuery)}` },
          { label: "AI video production", href: localizePath(locale, "/ai-video") },
        ]
      : [
          { label: "ki reklame", href: localizePath(locale, "/ki-reklame") },
          { label: "ai reklame", href: localizePath(locale, "/ki-reklame") },
          { label: "ki i reklame", href: localizePath(locale, "/ki-reklame") },
          { label: "ai i reklame", href: localizePath(locale, "/ki-reklame") },
          { label: "reklamefilm bedrift pris", href: localizePath(locale, "/ai-video") },
          { label: "reklamefilm produksjon", href: localizePath(locale, "/ai-video") },
          { label: "reklamefilmproduksjon", href: localizePath(locale, "/ai-video") },
          { label: "ai digitalbyrå", href: localizePath(locale, "/ki-reklamebyra") },
          { label: "ai mediebyrå", href: localizePath(locale, "/ki-reklamebyra") },
          { label: "ki kampanje", href: localizePath(locale, "/ki-markedsforing") },
          { label: "lærlinger", href: `${localizePath(locale, "/selskaper")}?q=${encodeURIComponent(apprenticeQuery)}` },
          { label: "ai videoproduksjon", href: localizePath(locale, "/ai-video") },
        ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  // 1) Hent katalog-data som før
  const { companies } = await getCompanies(params);

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

  // 3) Annonser
  const [ad, bannerAd, inlineAd, gridBannerAd, gridBannerAd2, gridBannerAd3] = await Promise.all([
    getAdForPlacement("home_hero_sidebar"),
    getAdForPlacement("catalog_top_banner"),
    getAdForPlacement("catalog_inline_card"),
    getAdForPlacement("catalog_grid_banner"),
    getAdForPlacement("catalog_grid_banner_2"),
    getAdForPlacement("catalog_grid_banner_3"),
  ]);

  return (
    <div className="bg-[rgb(var(--bg))]">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {bannerAd ? (
        <section className="mx-auto max-w-6xl px-4 pt-3 mb-2">
          <AdSlot
            ad={bannerAd}
            sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
            openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
            variant="banner"
            compact
            locale={locale}
          />
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 pt-3 pb-1">
        <h2 className="text-[1.6rem] font-semibold leading-[1.15] tracking-tight text-[rgb(var(--fg))] md:text-[2rem] lg:text-[2.2rem]">
          <span className="text-[rgb(var(--fg))]">KiReklame - </span>
          <span className="text-[rgb(var(--muted))]">
            {locale === "en" ? "Norwegian AI agencies" : "Norske KI‑byråer"}
          </span>
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[rgb(var(--muted))] md:text-base">
          {locale === "en"
            ? "Find Norway's leading AI video creators in one place"
            : "Finn Norges fremste AI-videokreatører på ett sted"}
        </p>
      </section>

      <HeroSearch
        initialQuery={params.q ?? ""}
        heroVideoUrl={heroVideoUrl}
        featuredCompany={featured}
        sponsorAd={ad ?? null}
        locale={locale}
        copy={{
          featuredLabel: locale === "en" ? "Featured" : "Utvalgt",
          sponsorLabel: locale === "en" ? "Sponsored" : "Sponset",
          openLinkFallback: locale === "en" ? "Open link" : "Åpne lenke",
        }}
      />

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <ListingGrid
          companies={companies}
          inlineAd={inlineAd}
          gridBannerAd={gridBannerAd}
          gridBannerAd2={gridBannerAd2}
          gridBannerAd3={gridBannerAd3}
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
            {locale === "en" ? "High-intent searches" : "Høy-intensjon søk"}
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            {locale === "en"
              ? "Commercial AI video production in Norway"
              : "Kommersiell AI videoproduksjon i Norge"}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[rgb(var(--muted))]">
            {locale === "en"
              ? "We prioritize buying intent for customer-ordered commercial production: AI advertising, campaign video, and commercial delivery."
              : "Vi prioriterer kjøpsintensjon for bestillt kommersiell produksjon: KI-reklame, kampanjevideo og reklamefilm-leveranser."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {highIntentLinks.map((item) => (
              <Link
                key={`intent-${item.label}`}
                href={item.href}
                className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
          <h2 className="text-2xl font-semibold tracking-tight">
            {locale === "en"
              ? "FAQ: commercial AI video production"
              : "FAQ: kommersiell AI videoproduksjon"}
          </h2>
          <div className="mt-4 grid gap-4">
            {faqItems.map((item) => (
              <article
                key={item.q}
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/50 p-4"
              >
                <h3 className="text-base font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SEO: hold this at the bottom */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-gradient-to-b from-[rgb(var(--card))]/80 to-[rgb(var(--card))]/40 p-6 shadow-soft ring-1 ring-[rgb(var(--border))]/60">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
            {locale === "en" ? "About the directory" : "Om katalogen"}
          </div>
          <div className="mt-3 grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                {locale === "en"
                  ? "AI advertising, AI video, and marketing in Norway"
                  : "KI reklame, AI‑video og markedsføring i Norge"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[rgb(var(--muted))]">
                {locale === "en"
                  ? "KiReklame is a curated overview of Norwegian players working with AI in advertising, video, and creative production. Whether you need an AI agency, AI-driven commercial production, or performance marketing content, you’ll find relevant providers here."
                  : "KiReklame er en kuratert oversikt over norske aktører som jobber med KI i reklame, annonser, video og kreativ produksjon. Enten du søker KI reklame, AI reklame, KI i reklame eller AI i reklame, finner du relevante leverandører her."}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[rgb(var(--muted))]">
                {locale === "en"
                  ? "Use the filters to find agencies with the right services, price level, and AI maturity. You can also explore locations and tags for more niche searches in marketing and advertising."
                  : "Bruk filtrene for å finne byråer med riktig tjenesteområde, prispunkt og AI‑nivå. Du kan også utforske steder og tags for mer nisjet søk innen markedsføring og reklame."}
              </p>
            </div>
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/40 p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                {locale === "en" ? "Focus areas" : "Fokusområder"}
              </div>
              <ul className="mt-3 grid gap-2 text-[11px] text-[rgb(var(--muted))] sm:grid-cols-2">
                <li className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5">
                  {locale === "en"
                    ? "AI advertising agencies and AI-first studios"
                    : "KI reklamebyråer og AI‑first studioer"}
                </li>
                <li className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5">
                  {locale === "en"
                    ? "AI video, commercials, and creative production"
                    : "AI‑video, reklamefilm og kreativ produksjon"}
                </li>
                <li className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5">
                  {locale === "en"
                    ? "Marketing, performance, and content production"
                    : "Markedsføring, performance og innholdsproduksjon"}
                </li>
                <li className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5">
                  {locale === "en"
                    ? "Generative design, post-production, and automation"
                    : "Generativ design, post‑produksjon og automatisering"}
                </li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <Link
                  href={localizePath(locale, "/ki-reklame")}
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
                >
                  {locale === "en" ? "AI advertising showreel" : "KI-reklame showreel"}
                </Link>
                <Link
                  href={localizePath(locale, "/ki-reklamebyra")}
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
                >
                  {locale === "en" ? "AI advertising agencies" : "KI reklamebyrå"}
                </Link>
                <Link
                  href={localizePath(locale, "/ai-video")}
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
                >
                  {locale === "en" ? "AI video production" : "AI‑video produksjon"}
                </Link>
                <Link
                  href={localizePath(locale, "/ki-markedsforing")}
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
                >
                  {locale === "en" ? "AI marketing" : "KI markedsføring"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
