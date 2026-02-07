import type { Metadata } from "next";
import Link from "next/link";
import { siteMeta } from "@/lib/seo";

export const metadata: Metadata = siteMeta({
  title: "AI‑video produksjon – reklamefilm med KI | KiReklame",
  description:
    "Finn norske studioer og byråer som lager AI‑video, reklamefilm og animasjon med KI. Sammenlign tjenester, pris og AI‑nivå.",
  path: "/ai-video",
});

export default function AiVideoPage() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Hva er AI‑video i reklame?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "AI‑video bruker generative verktøy for å lage eller forbedre reklamefilm, animasjon og motion. Det gir raskere iterasjon og flere varianter.",
        },
      },
      {
        "@type": "Question",
        name: "Hva koster AI‑video produksjon?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Pris varierer etter lengde, stil, antall varianter og etterarbeid. Mange byråer tilbyr faste pakker eller pris per leveranse.",
        },
      },
      {
        "@type": "Question",
        name: "Hvilke formater fungerer best?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Korte 6–15 sekunders varianter for SoMe og performance, samt lengre hero‑filmer for kampanjer og nettsted.",
        },
      },
      {
        "@type": "Question",
        name: "Hvordan velger jeg riktig leverandør?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Se etter portfolio, stil, pipeline og erfaring i din bransje. Sjekk også hvilke AI‑verktøy de bruker og hvilke rettigheter du får.",
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
        AI‑video produksjon for reklame
      </h1>
      <p className="mt-3 text-[rgb(var(--muted))] leading-relaxed">
        AI‑video gjør det mulig å produsere reklamefilm, animasjon og content
        raskere enn før. KiReklame viser norske studioer og byråer som jobber
        med KI‑drevet video, fra idé og storyboard til ferdig klipp.
      </p>

      <div className="mt-6 space-y-4 text-[rgb(var(--muted))] leading-relaxed">
        <p>
          Med AI‑video kan du lage flere varianter av samme kampanje, teste
          ulike budskap og optimalisere mot ytelse. Dette er spesielt nyttig i
          performance‑kanaler der format, tempo og budskap må justeres raskt.
        </p>
        <p>
          Mange byråer kombinerer AI med tradisjonell produksjon for å oppnå
          høy kvalitet og kontroll. Spør etter hvordan de jobber med stil,
          brand‑guidelines og rettigheter til output.
        </p>
        <p>
          Vanlige leveranser inkluderer korte SoMe‑klipp, 15–30 sekunders
          reklamefilm, hero‑filmer for nettsteder og dynamiske annonser.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <h2 className="text-xl font-semibold">Slik fungerer AI‑video</h2>
        <ol className="mt-4 grid gap-3 text-[rgb(var(--muted))]">
          <li>1. Brief og stil: format, tone og ønsket uttrykk.</li>
          <li>2. Produksjon: generativ video, klipp, lyd og grafikk.</li>
          <li>3. Varianter og testing: optimalisering i kanalene.</li>
        </ol>
      </section>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/selskaper"
          className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-5 py-3 font-semibold shadow-soft hover:opacity-90 transition"
        >
          Finn AI‑video‑studioer
        </Link>
        <Link
          href="/kontakt"
          className="inline-flex items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-5 py-3 font-semibold shadow-soft hover:shadow-lift transition"
        >
          Be om råd
        </Link>
      </div>

      <section className="mt-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <h2 className="text-xl font-semibold">Ofte stilte spørsmål</h2>
        <div className="mt-4 space-y-4 text-[rgb(var(--muted))] leading-relaxed">
          <div>
            <div className="font-semibold text-[rgb(var(--fg))]">
              Hva er AI‑video i reklame?
            </div>
            <p>
              Det er bruk av generative verktøy for å lage eller forbedre
              reklamefilm, animasjon og motion.
            </p>
          </div>
          <div>
            <div className="font-semibold text-[rgb(var(--fg))]">
              Hva koster AI‑video produksjon?
            </div>
            <p>
              Det varierer etter lengde, stil og antall varianter. Mange tilbyr
              pakkepriser eller pris per leveranse.
            </p>
          </div>
          <div>
            <div className="font-semibold text-[rgb(var(--fg))]">
              Hvilke formater fungerer best?
            </div>
            <p>
              Korte SoMe‑varianter og hero‑filmer for kampanjer er mest brukt.
            </p>
          </div>
          <div>
            <div className="font-semibold text-[rgb(var(--fg))]">
              Hvordan velger jeg riktig leverandør?
            </div>
            <p>
              Sjekk portfolio, stil og pipeline. Spør om rettigheter og
              kvalitetssikring.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
