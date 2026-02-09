import Link from "next/link";
import { Bodoni_Moda, Manrope, Source_Serif_4 } from "next/font/google";
import AdSlot from "@/app/_components/AdSlot";
import { getAdForPlacement, type SponsorAd } from "@/lib/ads";
import { getLocale } from "@/lib/i18n.server";
import { listPublishedNews } from "@/lib/news/articles";
import type { NewsArticle } from "@/lib/news/types";
import { siteMeta } from "@/lib/seo";

const masthead = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const headline = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const uiSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = siteMeta({
  title: "KiR Nyheter – ledende nettavis om KI i reklame og markedsføring",
  description:
    "KiR Nyheter er en redaksjonell nettavis om KI/AI i reklame, media, byrå og markedsføring. Kritikk, satsinger, analyse og bransjetrender.",
  path: "/ki-avis",
});

function fmtDate(iso: string | null) {
  if (!iso) return "Dato ikke oppgitt";
  try {
    return new Date(iso).toLocaleString("nb-NO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function hasImage(url: string | null): boolean {
  return /^https?:\/\//i.test(String(url ?? "").trim());
}

function perspectiveTone(perspective: NewsArticle["perspective"]) {
  if (perspective === "critical") return "text-rose-700";
  if (perspective === "adoption") return "text-emerald-700";
  return "text-slate-700";
}

function perspectiveLabel(perspective: NewsArticle["perspective"]) {
  if (perspective === "critical") return "Kritikk";
  if (perspective === "adoption") return "Satsing";
  return "Analyse";
}

function StoryVisual({ article, className }: { article: NewsArticle; className: string }) {
  if (hasImage(article.hero_image_url)) {
    return (
      <img
        src={article.hero_image_url ?? ""}
        alt={article.title}
        loading="lazy"
        className={className}
      />
    );
  }

  return (
    <div
      className={`${className} grid place-items-end border border-black/20 bg-gradient-to-br from-slate-500 to-slate-800 p-2`}
      aria-label={`Illustrasjon for ${article.title}`}
    >
      <span className="bg-black/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
        {article.source_name}
      </span>
    </div>
  );
}

function WireStory({ article }: { article: NewsArticle }) {
  return (
    <article className="border-b border-black/15 pb-3 last:border-b-0 last:pb-0">
      <StoryVisual article={article} className="mb-2 aspect-[16/10] w-full border border-black/20 object-cover" />
      <p
        className={`text-[10px] font-semibold uppercase tracking-[0.19em] ${perspectiveTone(article.perspective)}`}
      >
        {perspectiveLabel(article.perspective)}
        {article.is_paywalled ? " · betalingsmur" : ""}
      </p>
      <h3 className={`${headline.className} mt-1 text-[31px] leading-[1.04]`}>
        <Link href={`/ki-avis/${article.slug}`} className="hover:opacity-75">
          {article.title}
        </Link>
      </h3>
      <p className="mt-1 text-[13px] leading-snug text-black/70">
        {article.summary ?? article.excerpt ?? "Oppsummering mangler foreløpig."}
      </p>
      <p className="mt-1 text-[11px] text-black/55">
        {article.source_name} · {fmtDate(article.published_at ?? article.created_at)}
      </p>
    </article>
  );
}

function adSignature(ad: SponsorAd | null): string {
  if (!ad) return "";
  return `${ad.id}:${ad.href}:${ad.image_url}:${ad.mobile_image_url ?? ""}`;
}

export default async function KIRNyheterPage() {
  const locale = await getLocale();
  const sponsorLabel = locale === "en" ? "Sponsored" : "Sponset";
  const openLinkFallback = locale === "en" ? "Open link" : "Åpne lenke";

  const [
    articles,
    catalogTopBanner,
    otherTopBanner,
    otherMidBanner,
    otherHeroSidebar,
    homeHeroSidebar,
    companiesHeroSidebar,
    internationalHeroSidebar,
    catalogInlineCard,
    otherInlineCard,
    otherInlineCard2,
    gridBanner,
    gridBanner2,
    gridBanner3,
  ] = await Promise.all([
    listPublishedNews(120),
    getAdForPlacement("catalog_top_banner"),
    getAdForPlacement("other_top_banner"),
    getAdForPlacement("other_mid_banner"),
    getAdForPlacement("other_hero_sidebar"),
    getAdForPlacement("home_hero_sidebar"),
    getAdForPlacement("companies_hero_sidebar"),
    getAdForPlacement("international_hero_sidebar"),
    getAdForPlacement("catalog_inline_card"),
    getAdForPlacement("other_inline_card"),
    getAdForPlacement("other_inline_card_2"),
    getAdForPlacement("catalog_grid_banner"),
    getAdForPlacement("catalog_grid_banner_2"),
    getAdForPlacement("catalog_grid_banner_3"),
  ]);

  const lead = articles[0] ?? null;
  const rest = lead ? articles.filter((item) => item.id !== lead.id) : articles;

  const frontRow = rest.slice(0, 4);
  const latest = rest.slice(4, 11);
  const frontGrid = rest.slice(11, 15);
  const frontUsedIds = new Set<string>([
    ...frontRow.map((item) => item.id),
    ...latest.map((item) => item.id),
    ...frontGrid.map((item) => item.id),
  ]);
  const frontFill = rest.filter((item) => !frontUsedIds.has(item.id)).slice(0, 6);
  const criticism = rest.filter((item) => item.perspective === "critical").slice(0, 4);
  const adoption = rest.filter((item) => item.perspective === "adoption").slice(0, 4);
  const analysis = rest.filter((item) => item.perspective === "neutral").slice(0, 4);

  const usedAds = new Set<string>();
  function pickUnique(candidates: Array<SponsorAd | null>) {
    for (const ad of candidates) {
      if (!ad) continue;
      const key = adSignature(ad);
      if (usedAds.has(key)) continue;
      usedAds.add(key);
      return ad;
    }
    return null;
  }

  const topAd = pickUnique([catalogTopBanner, otherTopBanner]);
  const heroAd = pickUnique([
    otherHeroSidebar,
    homeHeroSidebar,
    companiesHeroSidebar,
    internationalHeroSidebar,
  ]);
  const inlineAd = pickUnique([catalogInlineCard, otherInlineCard, otherInlineCard2]);
  const midBannerAd = pickUnique([otherMidBanner, gridBanner, gridBanner2, gridBanner3]);
  const bottomBannerAd = pickUnique([gridBanner2, gridBanner3, otherMidBanner]);

  return (
    <div className={`${uiSans.className} bg-[#f1ede4] text-[#191919]`}>
      <header className="border-y border-black/20 bg-[#f6f2e9]">
        <div className="mx-auto max-w-[1260px] border-b border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.21em] text-black/65 md:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>Mandag · Oslo-redaksjonen</span>
            <span>Oppdatert {fmtDate(new Date().toISOString())}</span>
            <span>Avisa drives av Cuz Media AS</span>
          </div>
        </div>

        <div className="mx-auto max-w-[1260px] px-3 py-4 md:px-4 md:py-5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 border-b border-black/20 pb-3">
            <p className="hidden text-[10px] uppercase tracking-[0.22em] text-black/55 md:block">
              Nasjonal dekning av KI i markedet
            </p>

            <div className="text-center">
              <div className="mx-auto mb-2 flex items-center justify-center gap-3">
                <img src="/KIREKLAMElogo.gif" alt="KiR Nyheter logo" className="h-12 w-12" />
                <span className={`${masthead.className} text-5xl leading-none md:text-7xl`}>
                  KiR Nyheter
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-black/60 md:text-[11px]">
                Norges avis for KI, reklame og media
              </p>
            </div>

            <p className="hidden text-right text-[10px] uppercase tracking-[0.22em] text-black/55 md:block">
              Cuz Media AS
            </p>
          </div>

          <nav className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/72 md:gap-5">
            <a href="#forside" className="hover:text-black">
              Forside
            </a>
            <span className="text-black/35">|</span>
            <a href="#kritikk" className="hover:text-black">
              Kritikk
            </a>
            <span className="text-black/35">|</span>
            <a href="#satsing" className="hover:text-black">
              Satsing
            </a>
            <span className="text-black/35">|</span>
            <a href="#analyse" className="hover:text-black">
              Analyse
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1260px] px-3 py-4 md:px-4 md:py-5">
        {topAd ? (
          <section className="mb-4 border border-black/20 bg-[#f8f4eb]">
            <AdSlot
              ad={topAd}
              sponsorLabel={sponsorLabel}
              openLinkFallback={openLinkFallback}
              variant="banner"
              locale={locale}
            />
          </section>
        ) : null}

        {lead ? (
          <section
            id="forside"
            className="grid gap-4 border-y border-black/20 py-4 lg:grid-cols-[1.62fr_0.95fr]"
          >
            <div className="border-b border-black/15 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
              <article>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/60">
                  Førsteside · hovedsak
                </p>
                <h1 className={`${headline.className} mt-2 text-[44px] leading-[0.95] md:text-[72px]`}>
                  <Link href={`/ki-avis/${lead.slug}`} className="hover:opacity-75">
                    {lead.title}
                  </Link>
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.13em] text-black/55">
                  <span>{lead.source_name}</span>
                  <span>•</span>
                  <span>{fmtDate(lead.published_at ?? lead.created_at)}</span>
                  {lead.is_paywalled ? <span className="text-amber-800">Betalingsmur</span> : null}
                </div>

                <StoryVisual article={lead} className="mt-3 aspect-[16/8.8] w-full border border-black/20 object-cover" />

                <p className="mt-3 max-w-4xl text-[17px] leading-[1.45] text-black/78">
                  {lead.summary ?? lead.excerpt ?? "Omtale kommer."}
                </p>

                <a
                  href={lead.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-[13px] font-semibold uppercase tracking-[0.13em] underline underline-offset-4 hover:opacity-75"
                >
                  Les originalkilden
                </a>
              </article>

              {frontRow.length ? (
                <div className="mt-4 grid gap-3 border-t border-black/15 pt-3 sm:grid-cols-2">
                  {frontRow.slice(0, 2).map((article) => (
                    <article key={article.id} className="grid grid-cols-[84px_1fr] gap-2 border-b border-black/10 pb-2">
                      <StoryVisual article={article} className="aspect-square w-full border border-black/20 object-cover" />
                      <div>
                        <p
                          className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${perspectiveTone(article.perspective)}`}
                        >
                          {perspectiveLabel(article.perspective)}
                        </p>
                        <h2 className={`${headline.className} mt-1 text-[25px] leading-[1.02]`}>
                          <Link href={`/ki-avis/${article.slug}`} className="hover:opacity-75">
                            {article.title}
                          </Link>
                        </h2>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}

              {frontFill.length ? (
                <section className="mt-4 border-t border-black/15 pt-3">
                  <h2 className={`${masthead.className} text-[32px] leading-none`}>Flere saker nå</h2>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {frontFill.map((article) => (
                      <article key={article.id} className="border border-black/15 bg-[#f8f4eb] p-2">
                        <StoryVisual
                          article={article}
                          className="aspect-[16/10] w-full border border-black/20 object-cover"
                        />
                        <p
                          className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${perspectiveTone(article.perspective)}`}
                        >
                          {perspectiveLabel(article.perspective)}
                          {article.is_paywalled ? " · betalingsmur" : ""}
                        </p>
                        <h3 className={`${headline.className} mt-1 text-[26px] leading-[1.03]`}>
                          <Link href={`/ki-avis/${article.slug}`} className="hover:opacity-75">
                            {article.title}
                          </Link>
                        </h3>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="space-y-3 lg:pl-1">
              <section className="border-b border-black/15 pb-3">
                <h2 className={`${masthead.className} text-[28px] leading-none`}>Siste saker</h2>
                <div className="mt-2 space-y-3">
                  {latest.length ? (
                    latest.map((article) => (
                      <article key={article.id} className="grid grid-cols-[84px_1fr] gap-2 border-b border-black/10 pb-2 last:border-b-0 last:pb-0">
                        <StoryVisual article={article} className="aspect-square w-full border border-black/20 object-cover" />
                        <div>
                          <h3 className={`${headline.className} text-[26px] leading-[1.02]`}>
                            <Link href={`/ki-avis/${article.slug}`} className="hover:opacity-75">
                              {article.title}
                            </Link>
                          </h3>
                          <p className="mt-1 text-[11px] text-black/55">
                            {article.source_name} · {fmtDate(article.published_at ?? article.created_at)}
                          </p>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="text-sm text-black/60">Ingen flere saker akkurat nå.</p>
                  )}
                </div>
              </section>

              {heroAd ? (
                <section className="border border-black/20 bg-[#f8f4eb]">
                  <div className="xl:hidden">
                    <AdSlot
                      ad={heroAd}
                      sponsorLabel={sponsorLabel}
                      openLinkFallback={openLinkFallback}
                      variant="hero"
                      locale={locale}
                    />
                  </div>
                  <div className="hidden xl:block">
                    <AdSlot
                      ad={heroAd}
                      sponsorLabel={sponsorLabel}
                      openLinkFallback={openLinkFallback}
                      variant="sidebar"
                      locale={locale}
                    />
                  </div>
                </section>
              ) : null}

              {frontRow.length > 2 ? (
                <div className="space-y-2 border-t border-black/15 pt-2">
                  {frontRow.slice(2, 4).map((article) => (
                    <article key={article.id} className="border-b border-black/10 pb-2 last:border-b-0">
                      <h3 className={`${headline.className} text-[28px] leading-[1.02]`}>
                        <Link href={`/ki-avis/${article.slug}`} className="hover:opacity-75">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="mt-1 text-[11px] text-black/55">
                        {article.source_name} · {fmtDate(article.published_at ?? article.created_at)}
                      </p>
                    </article>
                  ))}
                </div>
              ) : null}
            </aside>
          </section>
        ) : (
          <section className="border border-black/20 bg-[#f8f4eb] p-7 text-center">
            <h2 className={`${headline.className} text-4xl`}>Ingen publiserte saker ennå</h2>
            <p className="mt-3 text-sm text-black/65">
              Kjør crawleren via <code className="bg-black/5 px-1">POST /api/news/crawl</code> og
              publiser i CMS på <code className="bg-black/5 px-1">/admin/ki-avis</code>.
            </p>
          </section>
        )}

        {inlineAd ? (
          <section className="mt-5 border border-black/20 bg-[#f8f4eb] md:mx-auto md:max-w-xl">
            <AdSlot
              ad={inlineAd}
              sponsorLabel={sponsorLabel}
              openLinkFallback={openLinkFallback}
              variant="card"
              locale={locale}
            />
          </section>
        ) : null}

        {frontGrid.length ? (
          <section className="mt-5 border-t border-black/20 pt-4">
            <h2 className={`${masthead.className} text-[34px]`}>Forside nå</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {frontGrid.map((article) => (
                <article key={article.id} className="border border-black/20 bg-[#f8f4eb] p-2">
                  <StoryVisual article={article} className="aspect-[16/10] w-full border border-black/20 object-cover" />
                  <p
                    className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${perspectiveTone(article.perspective)}`}
                  >
                    {perspectiveLabel(article.perspective)}
                  </p>
                  <h3 className={`${headline.className} mt-1 text-[31px] leading-[1.03]`}>
                    <Link href={`/ki-avis/${article.slug}`} className="hover:opacity-75">
                      {article.title}
                    </Link>
                  </h3>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {midBannerAd ? (
          <section className="mt-5 border border-black/20 bg-[#f8f4eb]">
            <AdSlot
              ad={midBannerAd}
              sponsorLabel={sponsorLabel}
              openLinkFallback={openLinkFallback}
              variant="banner"
              locale={locale}
            />
          </section>
        ) : null}

        <section className="mt-5 grid gap-4 border-t border-black/20 pt-4 lg:grid-cols-3">
          <div id="kritikk" className="border-r-0 lg:border-r lg:border-black/15 lg:pr-4">
            <h2 className={`${masthead.className} border-b border-black/20 pb-1 text-[38px]`}>Kritikk</h2>
            <div className="mt-3 space-y-3">
              {criticism.length ? (
                criticism.map((article) => <WireStory key={article.id} article={article} />)
              ) : (
                <p className="text-sm text-black/62">Ingen saker enda.</p>
              )}
            </div>
          </div>

          <div id="satsing" className="border-r-0 lg:border-r lg:border-black/15 lg:px-4">
            <h2 className={`${masthead.className} border-b border-black/20 pb-1 text-[38px]`}>Satsing</h2>
            <div className="mt-3 space-y-3">
              {adoption.length ? (
                adoption.map((article) => <WireStory key={article.id} article={article} />)
              ) : (
                <p className="text-sm text-black/62">Ingen saker enda.</p>
              )}
            </div>
          </div>

          <div id="analyse" className="lg:pl-4">
            <h2 className={`${masthead.className} border-b border-black/20 pb-1 text-[38px]`}>Analyse</h2>
            <div className="mt-3 space-y-3">
              {analysis.length ? (
                analysis.map((article) => <WireStory key={article.id} article={article} />)
              ) : (
                <p className="text-sm text-black/62">Ingen saker enda.</p>
              )}
            </div>
          </div>
        </section>

        {bottomBannerAd ? (
          <section className="mt-5 border border-black/20 bg-[#f8f4eb]">
            <AdSlot
              ad={bottomBannerAd}
              sponsorLabel={sponsorLabel}
              openLinkFallback={openLinkFallback}
              variant="banner"
              locale={locale}
            />
          </section>
        ) : null}

        <section className="mt-5 border-t border-black/20 pt-3 text-[11px] uppercase tracking-[0.17em] text-black/55">
          Avisa drives av Cuz Media AS
        </section>
      </main>
    </div>
  );
}
