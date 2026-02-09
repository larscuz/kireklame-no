import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bodoni_Moda, Manrope, Source_Serif_4 } from "next/font/google";
import AdSlot from "@/app/_components/AdSlot";
import { getAdForPlacement, type SponsorAd } from "@/lib/ads";
import { getLocale } from "@/lib/i18n.server";
import { getPublishedNewsBySlug } from "@/lib/news/articles";
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

function adSignature(ad: SponsorAd | null): string {
  if (!ad) return "";
  return `${ad.id}:${ad.href}:${ad.image_url}:${ad.mobile_image_url ?? ""}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedNewsBySlug(slug);
  if (!article) {
    return siteMeta({
      title: "Sak ikke funnet | KiR Nyheter",
      description: "Saken finnes ikke eller er ikke publisert.",
      path: `/ki-avis/${slug}`,
    });
  }

  return siteMeta({
    title: `${article.title} | KiR Nyheter`,
    description:
      article.summary ??
      article.excerpt ??
      "Redaksjonell dekning av KI/AI i reklame og markedsføring.",
    path: `/ki-avis/${article.slug}`,
  });
}

export default async function KIRNyheterArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const sponsorLabel = locale === "en" ? "Sponsored" : "Sponset";
  const openLinkFallback = locale === "en" ? "Open link" : "Åpne lenke";

  const [
    article,
    catalogTopBanner,
    otherTopBanner,
    otherHeroSidebar,
    homeHeroSidebar,
    catalogInlineCard,
    otherInlineCard,
    otherMidBanner,
    gridBanner,
  ] = await Promise.all([
    getPublishedNewsBySlug(slug),
    getAdForPlacement("catalog_top_banner"),
    getAdForPlacement("other_top_banner"),
    getAdForPlacement("other_hero_sidebar"),
    getAdForPlacement("home_hero_sidebar"),
    getAdForPlacement("catalog_inline_card"),
    getAdForPlacement("other_inline_card"),
    getAdForPlacement("other_mid_banner"),
    getAdForPlacement("catalog_grid_banner"),
  ]);

  if (!article) notFound();

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
  const sidebarAd = pickUnique([otherHeroSidebar, homeHeroSidebar]);
  const inlineAd = pickUnique([catalogInlineCard, otherInlineCard]);
  const midBannerAd = pickUnique([otherMidBanner, gridBanner]);

  const bodyChunks = String(article.body ?? "")
    .split(/\n{2,}/g)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <main className={`${uiSans.className} bg-[#f1ede4] text-[#191919] pb-12`}>
      <header className="border-y border-black/20 bg-[#f6f2e9]">
        <div className="mx-auto max-w-[1260px] border-b border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.21em] text-black/65 md:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>KiR Nyheter · Nettutgave</span>
            <span>Oppdatert {fmtDate(new Date().toISOString())}</span>
            <span>Avisa drives av Cuz Media AS</span>
          </div>
        </div>

        <div className="mx-auto max-w-[1260px] px-3 py-4 md:px-4">
          <Link href="/ki-avis" className="inline-flex items-end gap-3 hover:opacity-80">
            <img src="/KIREKLAMElogo.gif" alt="KiR Nyheter logo" className="h-12 w-12" />
            <div>
              <p className={`${masthead.className} text-4xl leading-none md:text-5xl`}>KiR Nyheter</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-black/60">
                Nasjonal dekning av KI i reklame og media
              </p>
            </div>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1260px] px-3 py-5 md:px-4">
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

        <div className="grid gap-5 border-y border-black/20 py-4 lg:grid-cols-[minmax(0,1fr)_318px]">
          <article className="min-w-0 lg:pr-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/55">
              Hovedsak · KiR Nyheter
            </p>
            <h1 className={`${headline.className} mt-2 text-[42px] leading-[0.96] md:text-[67px]`}>
              {article.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.13em] text-black/55">
              <span>{article.source_name}</span>
              <span>•</span>
              <span>{fmtDate(article.published_at ?? article.created_at)}</span>
              {article.is_paywalled ? <span className="text-amber-800">Betalingsmur</span> : null}
            </div>

            <a
              href={article.source_url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-[13px] font-semibold uppercase tracking-[0.13em] underline underline-offset-4 hover:opacity-80"
            >
              Les originalkilden
            </a>

            <section className="mt-4 border border-black/20 bg-[#f8f4eb]">
              {hasImage(article.hero_image_url) ? (
                <img
                  src={article.hero_image_url ?? ""}
                  alt={article.title}
                  className="aspect-[16/8.6] w-full object-cover"
                />
              ) : (
                <div className="aspect-[16/8.6] w-full bg-gradient-to-br from-slate-500 to-slate-800 p-3">
                  <div className="flex h-full items-end justify-between">
                    <span className="bg-black/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                      {article.source_name}
                    </span>
                    <span className="bg-black/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                      KiR Nyheter
                    </span>
                  </div>
                </div>
              )}
            </section>

            <section className="mt-4 border-t border-black/20 pt-4">
              <h2 className={`${masthead.className} text-[34px]`}>Ingress</h2>
              <p className={`${headline.className} mt-2 text-[29px] leading-[1.16] text-black/82`}>
                {article.summary ??
                  article.excerpt ??
                  (article.is_paywalled
                    ? "Denne saken ligger bak betalingsmur. Legg inn manuell oppsummering i CMS."
                    : "Oppsummering mangler foreløpig.")}
              </p>
            </section>

            {inlineAd ? (
              <section className="mt-5 border border-black/20 bg-[#f8f4eb] md:max-w-xl">
                <AdSlot
                  ad={inlineAd}
                  sponsorLabel={sponsorLabel}
                  openLinkFallback={openLinkFallback}
                  variant="card"
                  locale={locale}
                />
              </section>
            ) : null}

            {bodyChunks.length > 0 ? (
              <section className="mt-5 border-t border-black/20 pt-4">
                <h2 className={`${masthead.className} text-[34px]`}>Redaksjonell tekst</h2>
                <div className="mt-3 md:columns-2 md:gap-8">
                  {bodyChunks.map((chunk, idx) => (
                    <p
                      key={`${idx}-${chunk.slice(0, 24)}`}
                      className={`${headline.className} mb-4 break-inside-avoid text-[22px] leading-[1.34] text-black/85`}
                    >
                      {chunk}
                    </p>
                  ))}
                </div>
              </section>
            ) : null}

            {article.editor_note ? (
              <section className="mt-5 border border-black/20 bg-[#f8f4eb] p-4">
                <h2 className={`${masthead.className} text-[30px]`}>Redaksjonell note</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-black/72">{article.editor_note}</p>
              </section>
            ) : null}

            <div className="mt-7 border-t border-black/20 pt-3">
              <Link href="/ki-avis" className="text-[13px] font-semibold uppercase tracking-[0.14em] underline underline-offset-4">
                Tilbake til forsiden
              </Link>
            </div>
          </article>

          <aside className="space-y-4 border-t border-black/15 pt-4 lg:border-t-0 lg:border-l lg:pl-4">
            {sidebarAd ? (
              <section className="border border-black/20 bg-[#f8f4eb]">
                <AdSlot
                  ad={sidebarAd}
                  sponsorLabel={sponsorLabel}
                  openLinkFallback={openLinkFallback}
                  variant="sidebar"
                  locale={locale}
                />
              </section>
            ) : null}

            <section className="border border-black/20 bg-[#f8f4eb] p-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/55">Saksfakta</h2>
              <dl className="mt-3 space-y-2 text-[13px]">
                <div className="border-b border-black/10 pb-2">
                  <dt className="text-black/52">Kilde</dt>
                  <dd className="mt-1 font-semibold">{article.source_name}</dd>
                </div>
                <div className="border-b border-black/10 pb-2">
                  <dt className="text-black/52">Publisert</dt>
                  <dd className="mt-1 font-semibold">{fmtDate(article.published_at ?? article.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-black/52">Vinkel</dt>
                  <dd className="mt-1 font-semibold">
                    {article.perspective === "critical"
                      ? "Kritikk"
                      : article.perspective === "adoption"
                        ? "Satsing"
                        : "Analyse"}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="border border-black/20 bg-[#f8f4eb] p-4">
              <h2 className={`${masthead.className} text-[29px]`}>KiR Nyheter</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-black/70">
                Uavhengig dekning av hvordan KI endrer reklame, byråmarked og medieinvesteringer.
              </p>
            </section>
          </aside>
        </div>

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

        <section className="mt-5 border-t border-black/20 pt-3 text-[11px] uppercase tracking-[0.17em] text-black/55">
          Avisa drives av Cuz Media AS
        </section>
      </div>
    </main>
  );
}
