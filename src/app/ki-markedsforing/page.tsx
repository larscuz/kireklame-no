import type { Metadata } from "next";
import Link from "next/link";
import { siteMeta } from "@/lib/seo";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";

export const metadata: Metadata = siteMeta({
  title: "KI markedsføring – AI‑drevet annonsering | KiReklame",
  description:
    "Finn norske byråer som bruker KI i markedsføring, annonser og innholdsproduksjon. Sammenlign tjenester, pris og AI‑nivå.",
  path: "/ki-markedsforing",
});

export default function KiMarkedsforingPage() {
  const locale = getLocale();
  const copy =
    locale === "en"
      ? {
          title: "AI marketing in Norway",
          intro:
            "AI-driven marketing means using data and AI tools to create better ads, more relevant content, and faster learning. On KiReklame you’ll find Norwegian agencies and studios working with AI-based strategy, production, and optimization.",
          p1:
            "When you combine creative direction with AI-supported production, you can test more variants and quickly see what performs. This yields better returns in channels like Google, Meta, and TikTok.",
          p2:
            "Many AI agencies also offer automation of ad variants, scaled campaigns, and continuous content production. Ask about process, quality control, and reporting to ensure control.",
          p3:
            "Also consider industry experience. An agency that knows your audience can create stronger concepts and use AI to build brand and sales.",
          howTitle: "How to get started",
          steps: [
            "1. Set goals: leads, sales, or brand.",
            "2. Choose an agency based on channel and AI level.",
            "3. Start with a test campaign and scale.",
          ],
          ctaPrimary: "Find AI marketers",
          ctaSecondary: "Talk to us",
          faqTitle: "Frequently asked questions",
          faq: [
            {
              q: "What is AI-driven marketing?",
              a: "It’s using AI to plan, produce, and optimize ads and content based on data.",
            },
            {
              q: "Which channels work best?",
              a: "Performance channels where you can test many variants quickly.",
            },
            {
              q: "Can AI replace creative strategy?",
              a: "No, it works best when AI supports a clear strategy.",
            },
            {
              q: "How do I get started?",
              a: "Start small, test, and scale when you see results.",
            },
          ],
        }
      : {
          title: "KI markedsføring i Norge",
          intro:
            "KI‑drevet markedsføring handler om å bruke data og AI‑verktøy til å lage bedre annonser, mer relevant innhold og raskere læring. På KiReklame finner du norske byråer og studioer som jobber med AI‑basert strategi, produksjon og optimalisering.",
          p1:
            "Når du kombinerer kreativ retning med KI‑støttet produksjon, kan du teste flere varianter og raskt se hva som fungerer. Dette gir bedre avkastning i kanaler som Google, Meta og TikTok.",
          p2:
            "Mange AI‑byråer tilbyr også automatisering av annonsevarianter, skalerte kampanjer og kontinuerlig innholdsproduksjon. Spør etter prosess, kvalitetssikring og rapportering for å sikre kontroll.",
          p3:
            "Vurder også bransjeerfaring. Et byrå som kjenner målgruppen din kan lage bedre konsepter og utnytte AI til å bygge merkevare og salg.",
          howTitle: "Slik kommer du i gang",
          steps: [
            "1. Sett mål: leads, salg eller merkevare.",
            "2. Velg byrå etter kanal og AI‑nivå.",
            "3. Start med en testkampanje og skaler.",
          ],
          ctaPrimary: "Finn KI‑markedsførere",
          ctaSecondary: "Snakk med oss",
          faqTitle: "Ofte stilte spørsmål",
          faq: [
            {
              q: "Hva er KI‑drevet markedsføring?",
              a: "Det er bruk av AI til å planlegge, produsere og optimalisere annonser og innhold basert på data.",
            },
            {
              q: "Hvilke kanaler passer best?",
              a: "Performance‑kanaler der du kan teste mange varianter raskt.",
            },
            {
              q: "Kan KI erstatte kreativ strategi?",
              a: "Nei, det fungerer best når KI støtter en tydelig strategi.",
            },
            {
              q: "Hvordan kommer jeg i gang?",
              a: "Start smått, test, og skaler når du ser effekt.",
            },
          ],
        };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />

      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
        {copy.title}
      </h1>
      <p className="mt-3 text-[rgb(var(--muted))] leading-relaxed">
        {copy.intro}
      </p>

      <div className="mt-6 space-y-4 text-[rgb(var(--muted))] leading-relaxed">
        <p>{copy.p1}</p>
        <p>{copy.p2}</p>
        <p>{copy.p3}</p>
      </div>

      <section className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <h2 className="text-xl font-semibold">{copy.howTitle}</h2>
        <ol className="mt-4 grid gap-3 text-[rgb(var(--muted))]">
          {copy.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href={localizePath(locale, "/selskaper")}
          className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-5 py-3 font-semibold shadow-soft hover:opacity-90 transition"
        >
          {copy.ctaPrimary}
        </Link>
        <Link
          href={localizePath(locale, "/kontakt")}
          className="inline-flex items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-5 py-3 font-semibold shadow-soft hover:shadow-lift transition"
        >
          {copy.ctaSecondary}
        </Link>
      </div>

      <section className="mt-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <h2 className="text-xl font-semibold">{copy.faqTitle}</h2>
        <div className="mt-4 space-y-4 text-[rgb(var(--muted))] leading-relaxed">
          {copy.faq.map((item) => (
            <div key={item.q}>
              <div className="font-semibold text-[rgb(var(--fg))]">{item.q}</div>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
