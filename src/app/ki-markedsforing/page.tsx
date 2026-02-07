import type { Metadata } from "next";
import Link from "next/link";
import { siteMeta } from "@/lib/seo";

export const metadata: Metadata = siteMeta({
  title: "KI markedsføring – AI‑drevet annonsering | KiReklame",
  description:
    "Finn norske byråer som bruker KI i markedsføring, annonser og innholdsproduksjon. Sammenlign tjenester, pris og AI‑nivå.",
  path: "/ki-markedsforing",
});

export default function KiMarkedsforingPage() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Hva er KI‑drevet markedsføring?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "KI‑drevet markedsføring bruker AI til å planlegge, produsere, teste og optimalisere innhold og annonser basert på data.",
        },
      },
      {
        "@type": "Question",
        name: "Hvilke kanaler passer best for KI‑markedsføring?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Performance‑kanaler som Meta, Google og TikTok er ofte best, fordi AI kan teste mange varianter og lære raskt.",
        },
      },
      {
        "@type": "Question",
        name: "Kan KI erstatte kreativ strategi?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Nei. KI fungerer best når den støtter en tydelig strategi og kreativ retning, ikke når den må finne alt alene.",
        },
      },
      {
        "@type": "Question",
        name: "Hvordan kommer jeg i gang?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Start med et konkret mål, velg riktig byrå, og test små kampanjer før du skalerer opp.",
        },
      },
    ],
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />

      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
        KI markedsføring i Norge
      </h1>
      <p className="mt-3 text-[rgb(var(--muted))] leading-relaxed">
        KI‑drevet markedsføring handler om å bruke data og AI‑verktøy til å lage
        bedre annonser, mer relevant innhold og raskere læring. På KiReklame
        finner du norske byråer og studioer som jobber med AI‑basert strategi,
        produksjon og optimalisering.
      </p>

      <div className="mt-6 space-y-4 text-[rgb(var(--muted))] leading-relaxed">
        <p>
          Når du kombinerer kreativ retning med KI‑støttet produksjon, kan du
          teste flere varianter og raskt se hva som fungerer. Dette gir bedre
          avkastning i kanaler som Google, Meta og TikTok.
        </p>
        <p>
          Mange AI‑byråer tilbyr også automatisering av annonsevarianter, skalerte
          kampanjer og kontinuerlig innholdsproduksjon. Spør etter prosess,
          kvalitetssikring og rapportering for å sikre kontroll.
        </p>
        <p>
          Vurder også bransjeerfaring. Et byrå som kjenner målgruppen din kan
          lage bedre konsepter og utnytte AI til å bygge merkevare og salg.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <h2 className="text-xl font-semibold">Slik kommer du i gang</h2>
        <ol className="mt-4 grid gap-3 text-[rgb(var(--muted))]">
          <li>1. Sett mål: leads, salg eller merkevare.</li>
          <li>2. Velg byrå etter kanal og AI‑nivå.</li>
          <li>3. Start med en testkampanje og skaler.</li>
        </ol>
      </section>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/selskaper"
          className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-5 py-3 font-semibold shadow-soft hover:opacity-90 transition"
        >
          Finn KI‑markedsførere
        </Link>
        <Link
          href="/kontakt"
          className="inline-flex items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-5 py-3 font-semibold shadow-soft hover:shadow-lift transition"
        >
          Snakk med oss
        </Link>
      </div>

      <section className="mt-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <h2 className="text-xl font-semibold">Ofte stilte spørsmål</h2>
        <div className="mt-4 space-y-4 text-[rgb(var(--muted))] leading-relaxed">
          <div>
            <div className="font-semibold text-[rgb(var(--fg))]">
              Hva er KI‑drevet markedsføring?
            </div>
            <p>
              Det er bruk av AI til å planlegge, produsere og optimalisere
              annonser og innhold basert på data.
            </p>
          </div>
          <div>
            <div className="font-semibold text-[rgb(var(--fg))]">
              Hvilke kanaler passer best?
            </div>
            <p>
              Performance‑kanaler der du kan teste mange varianter raskt.
            </p>
          </div>
          <div>
            <div className="font-semibold text-[rgb(var(--fg))]">
              Kan KI erstatte kreativ strategi?
            </div>
            <p>
              Nei, det fungerer best når KI støtter en tydelig strategi.
            </p>
          </div>
          <div>
            <div className="font-semibold text-[rgb(var(--fg))]">
              Hvordan kommer jeg i gang?
            </div>
            <p>
              Start smått, test, og skaler når du ser effekt.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
