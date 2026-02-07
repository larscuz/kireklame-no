import type { Metadata } from "next";
import Link from "next/link";
import { siteMeta } from "@/lib/seo";

export const metadata: Metadata = siteMeta({
  title: "KI reklamebyrå – finn AI‑byråer i Norge | KiReklame",
  description:
    "Finn norske KI‑reklamebyråer og AI‑first studioer for annonser, kampanjer og kreativ produksjon. Sammenlign tjenester, pris og AI‑nivå.",
  path: "/ki-reklamebyra",
});

export default function KiReklamebyraPage() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Hva gjør et KI‑reklamebyrå?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Et KI‑reklamebyrå bruker AI‑verktøy i idéutvikling, produksjon, testing og optimalisering av reklame. Det kan være alt fra generering av konsepter til raskere video- og annonseproduksjon.",
        },
      },
      {
        "@type": "Question",
        name: "Når lønner det seg å velge et AI‑first byrå?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Når du trenger høy produksjonstakt, mange varianter, eller rask testing i performance‑kanaler. AI‑first byråer er ofte best på skala og tempo.",
        },
      },
      {
        "@type": "Question",
        name: "Tilbyr byråene både strategi og produksjon?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Mange gjør begge deler, men det varierer. Bruk filtrene i katalogen for å finne byråer som leverer strategi, kreativ utvikling og produksjon.",
        },
      },
      {
        "@type": "Question",
        name: "Hvordan sammenligner jeg ulike byråer?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Se på AI‑nivå, pris, spesialisering (f.eks. video eller annonser) og tidligere arbeid. Kontakt de mest relevante og be om forslag.",
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
        KI reklamebyrå i Norge
      </h1>
      <p className="mt-3 text-[rgb(var(--muted))] leading-relaxed">
        Leter du etter et KI‑reklamebyrå som kan levere annonser, kampanjer eller
        kreativt innhold raskere og mer effektivt? KiReklame samler norske AI‑first
        byråer og studioer som bruker kunstig intelligens i hele produksjonsløpet.
        Du kan filtrere på tjenester, pris og AI‑nivå for å finne riktig partner.
      </p>

      <div className="mt-6 space-y-4 text-[rgb(var(--muted))] leading-relaxed">
        <p>
          Et KI‑reklamebyrå kombinerer tradisjonell reklamekompetanse med moderne
          AI‑verktøy. Det gir raskere idéutvikling, flere kreative varianter og
          mer effektiv produksjon av annonser, sosiale formater og video.
        </p>
        <p>
          Hvis du trenger høy testfrekvens i performance‑kanaler, eller vil
          produsere store mengder innhold uten å sprenge budsjettet, kan et
          AI‑first byrå være riktig valg. Mange tilbyr også strategi, innholdsplan
          og kreativ konseptutvikling.
        </p>
        <p>
          Start med å definere mål: skal du bygge merkevare, øke salg, eller få
          flere leads? Velg deretter byråer som har erfaring innen din bransje og
          formatene du trenger. Se også etter tydelighet rundt prosess, rettigheter
          og leveranser.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <h2 className="text-xl font-semibold">Slik fungerer det</h2>
        <ol className="mt-4 grid gap-3 text-[rgb(var(--muted))]">
          <li>1. Definer behov: format, budskap, kanaler og budsjett.</li>
          <li>2. Finn relevante byråer i katalogen og sammenlign AI‑nivå.</li>
          <li>3. Ta kontakt og be om forslag eller tilbud.</li>
        </ol>
      </section>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/selskaper"
          className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-5 py-3 font-semibold shadow-soft hover:opacity-90 transition"
        >
          Finn KI‑byråer
        </Link>
        <Link
          href="/kontakt"
          className="inline-flex items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-5 py-3 font-semibold shadow-soft hover:shadow-lift transition"
        >
          Be om hjelp
        </Link>
      </div>

      <section className="mt-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <h2 className="text-xl font-semibold">Ofte stilte spørsmål</h2>
        <div className="mt-4 space-y-4 text-[rgb(var(--muted))] leading-relaxed">
          <div>
            <div className="font-semibold text-[rgb(var(--fg))]">
              Hva gjør et KI‑reklamebyrå?
            </div>
            <p>
              De bruker AI‑verktøy i idé, produksjon og optimalisering for å
              levere annonser og kampanjer raskere og mer skalerbart.
            </p>
          </div>
          <div>
            <div className="font-semibold text-[rgb(var(--fg))]">
              Når lønner det seg å velge et AI‑first byrå?
            </div>
            <p>
              Når du trenger mange varianter, rask produksjonstakt eller løpende
              testing i performance‑kanaler.
            </p>
          </div>
          <div>
            <div className="font-semibold text-[rgb(var(--fg))]">
              Tilbyr byråene både strategi og produksjon?
            </div>
            <p>
              Mange gjør det, men ikke alle. Bruk filtrene i katalogen for å
              finne riktig kombinasjon.
            </p>
          </div>
          <div>
            <div className="font-semibold text-[rgb(var(--fg))]">
              Hvordan sammenligner jeg ulike byråer?
            </div>
            <p>
              Se på AI‑nivå, spesialisering og tidligere arbeid. Kontakt de som
              matcher behovet ditt best.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
