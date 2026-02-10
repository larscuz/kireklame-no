import Link from "next/link";
import { Bodoni_Moda, Manrope, Source_Serif_4 } from "next/font/google";
import NewsImage from "@/app/_components/NewsImage";
import { listPublishedNews } from "@/lib/news/articles";
import { isLikelyInternationalDeskArticle } from "@/lib/news/international";
import { ENGLISH_AI_GLOSSARY_TERMS } from "@/lib/news/translate";
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
  title: "Internasjonalt | KiR Nyheter",
  description:
    "Alle internasjonale saker om AI-first og AI-only reklame- og creative-byråer.",
  path: "/ki-avis/internasjonalt",
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

function hasTag(article: NewsArticle, tag: string) {
  return (article.topic_tags ?? []).some((item) => String(item ?? "").toLowerCase() === tag);
}

function internationalLabel(article: NewsArticle): string {
  if (article.perspective === "critical") return "Kritikk";
  if (hasTag(article, "ai_only")) return "AI-only";
  if (hasTag(article, "ai_first")) return "AI-first";
  return "Internasjonalt";
}

function isImageUrl(url: string | null | undefined): boolean {
  return /^https?:\/\//i.test(String(url ?? "").trim());
}

export default async function KIRInternationalPage() {
  const all = await listPublishedNews(400);
  const desk = all.filter((article) => isLikelyInternationalDeskArticle(article));
  const deskWithImage = desk.filter((item) => isImageUrl(item.hero_image_url));
  const lead = deskWithImage[0] ?? null;
  const rest = lead ? deskWithImage.filter((item) => item.id !== lead.id) : deskWithImage;
  const glossaryColumns = Math.ceil(ENGLISH_AI_GLOSSARY_TERMS.length / 2);
  const glossaryLeft = ENGLISH_AI_GLOSSARY_TERMS.slice(0, glossaryColumns);
  const glossaryRight = ENGLISH_AI_GLOSSARY_TERMS.slice(glossaryColumns);

  return (
    <main className={`${uiSans.className} overflow-x-clip bg-[#f1ede4] text-[#191919]`}>
      <header className="border-y border-black/20 bg-[#f6f2e9]">
        <div className="mx-auto max-w-[1260px] border-b border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.21em] text-black/65 md:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>Internasjonal desk</span>
            <span>KiR Nyheter</span>
            <span>AIVISA DRIVES AV CUZ MEDIA AS</span>
          </div>
        </div>

        <div className="mx-auto max-w-[1260px] px-3 py-4 md:px-4">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-black/20 pb-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/58">Global dekning</p>
              <h1 className={`${masthead.className} text-[clamp(2.15rem,11vw,3.3rem)] leading-[0.95] [overflow-wrap:anywhere] hyphens-auto md:text-[56px]`}>
                Internasjonalt
              </h1>
              <p className="mt-1 text-[11px] uppercase tracking-[0.17em] text-black/60">
                AI-first / AI-only byråer
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/ki-avis/om"
                className="text-[12px] font-semibold uppercase tracking-[0.14em] underline underline-offset-4"
              >
                Om Aivisen
              </Link>
              <Link
                href="/ki-avis"
                className="text-[12px] font-semibold uppercase tracking-[0.14em] underline underline-offset-4"
              >
                Tilbake til forsiden
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1260px] overflow-x-clip px-3 py-5 md:px-4">
        {lead ? (
          <section className="grid gap-4 border-y border-black/20 py-4 lg:grid-cols-[1.28fr_0.92fr]">
            <article className="min-w-0 border-b border-black/15 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
              <NewsImage
                src={lead.hero_image_url}
                alt={lead.title}
                className="aspect-[16/8.7] w-full border border-black/20 object-cover"
              />
              <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-black/60">
                {internationalLabel(lead)} ·{" "}
                {lead.language ? lead.language.toUpperCase() : "EN"}
              </p>
              <h2 className={`${headline.className} mt-1 text-[clamp(2rem,9.5vw,3.1rem)] leading-[1] [overflow-wrap:anywhere] hyphens-auto md:text-[52px]`}>
                <Link href={`/ki-avis/${lead.slug}`} className="hover:opacity-75">
                  {lead.title}
                </Link>
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-black/72">
                {lead.summary ?? lead.excerpt ?? "Oppsummering kommer."}
              </p>
              <p className="mt-2 text-[11px] text-black/55">
                {lead.source_name} · {fmtDate(lead.published_at ?? lead.created_at)}
              </p>
            </article>

            <aside className="min-w-0 space-y-2">
              {rest.map((article) => (
                <article
                  key={article.id}
                  className="grid grid-cols-[72px_1fr] gap-2 border-b border-black/10 pb-2 last:border-b-0 sm:grid-cols-[84px_1fr]"
                >
                  <NewsImage
                    src={article.hero_image_url}
                    alt={article.title}
                    className="aspect-square w-full border border-black/20 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-black/58">
                      {internationalLabel(article)} ·{" "}
                      {article.language ? article.language.toUpperCase() : "EN"}
                    </p>
                    <h3 className={`${headline.className} mt-1 text-[21px] leading-[1.01] [overflow-wrap:anywhere] hyphens-auto sm:text-[28px]`}>
                      <Link href={`/ki-avis/${article.slug}`} className="hover:opacity-75">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-[11px] text-black/55">
                      {article.source_name} · {fmtDate(article.published_at ?? article.created_at)}
                    </p>
                  </div>
                </article>
              ))}
            </aside>
          </section>
        ) : (
          <section className="border border-black/20 bg-[#f8f4eb] p-6">
            <p className="text-sm text-black/65">
              Ingen internasjonale saker ennå. Kjør{" "}
              <code className="bg-black/5 px-1">POST /api/news/crawl/international</code> for å
              fylle siden.
            </p>
          </section>
        )}

        <section className="mt-4 border-t border-black/20 pt-4">
          <h2 className={`${masthead.className} text-[29px] leading-none sm:text-[34px]`}>Fagbegreper som beholdes på engelsk</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-black/68">
            Disse begrepene låses i maskinoversettelsen fordi norske varianter ofte blir misvisende i
            bransjekontekst.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ul className="space-y-1 border border-black/15 bg-[#f8f4eb] p-3 text-[13px] leading-relaxed text-black/80">
              {glossaryLeft.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
            <ul className="space-y-1 border border-black/15 bg-[#f8f4eb] p-3 text-[13px] leading-relaxed text-black/80">
              {glossaryRight.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
