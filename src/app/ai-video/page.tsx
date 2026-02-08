import type { Metadata } from "next";
import Link from "next/link";
import { siteMeta } from "@/lib/seo";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";

export const metadata: Metadata = siteMeta({
  title: "AI‑video produksjon – reklamefilm med KI | KiReklame",
  description:
    "Finn norske studioer og byråer som lager AI‑video, reklamefilm og animasjon med KI. Sammenlign tjenester, pris og AI‑nivå.",
  path: "/ai-video",
});

export default function AiVideoPage() {
  const locale = getLocale();
  const copy =
    locale === "en"
      ? {
          title: "AI video production for advertising",
          intro:
            "AI video makes it possible to produce commercials, animation, and content faster than ever. KiReklame highlights Norwegian studios and agencies working with AI-driven video, from idea and storyboard to final cut.",
          p1:
            "With AI video you can create multiple variants of the same campaign, test different messages, and optimize for performance. This is especially useful in performance channels where format, pace, and messaging must be adjusted quickly.",
          p2:
            "Many agencies combine AI with traditional production to achieve high quality and control. Ask how they handle style, brand guidelines, and rights to the output.",
          p3:
            "Common deliverables include short social clips, 15–30 second commercials, hero films for websites, and dynamic ads.",
          howItWorksTitle: "How AI video works",
          steps: [
            "1. Brief and style: format, tone, and desired look.",
            "2. Production: generative video, editing, audio, and graphics.",
            "3. Variants and testing: optimize in channels.",
          ],
          ctaPrimary: "Find AI video studios",
          ctaSecondary: "Ask for advice",
          faqTitle: "Frequently asked questions",
          faq: [
            {
              q: "What is AI video in advertising?",
              a: "It’s the use of generative tools to create or enhance commercials, animation, and motion.",
            },
            {
              q: "How much does AI video production cost?",
              a: "It varies by length, style, and number of variants. Many offer packages or per-deliverable pricing.",
            },
            {
              q: "Which formats work best?",
              a: "Short social variants and hero films for campaigns are most common.",
            },
            {
              q: "How do I choose the right provider?",
              a: "Check portfolio, style, and pipeline. Ask about rights and quality control.",
            },
          ],
        }
      : {
          title: "AI‑video produksjon for reklame",
          intro:
            "AI‑video gjør det mulig å produsere reklamefilm, animasjon og content raskere enn før. KiReklame viser norske studioer og byråer som jobber med KI‑drevet video, fra idé og storyboard til ferdig klipp.",
          p1:
            "Med AI‑video kan du lage flere varianter av samme kampanje, teste ulike budskap og optimalisere mot ytelse. Dette er spesielt nyttig i performance‑kanaler der format, tempo og budskap må justeres raskt.",
          p2:
            "Mange byråer kombinerer AI med tradisjonell produksjon for å oppnå høy kvalitet og kontroll. Spør etter hvordan de jobber med stil, brand‑guidelines og rettigheter til output.",
          p3:
            "Vanlige leveranser inkluderer korte SoMe‑klipp, 15–30 sekunders reklamefilm, hero‑filmer for nettsteder og dynamiske annonser.",
          howItWorksTitle: "Slik fungerer AI‑video",
          steps: [
            "1. Brief og stil: format, tone og ønsket uttrykk.",
            "2. Produksjon: generativ video, klipp, lyd og grafikk.",
            "3. Varianter og testing: optimalisering i kanalene.",
          ],
          ctaPrimary: "Finn AI‑video‑studioer",
          ctaSecondary: "Be om råd",
          faqTitle: "Ofte stilte spørsmål",
          faq: [
            {
              q: "Hva er AI‑video i reklame?",
              a: "Det er bruk av generative verktøy for å lage eller forbedre reklamefilm, animasjon og motion.",
            },
            {
              q: "Hva koster AI‑video produksjon?",
              a: "Det varierer etter lengde, stil og antall varianter. Mange tilbyr pakkepriser eller pris per leveranse.",
            },
            {
              q: "Hvilke formater fungerer best?",
              a: "Korte SoMe‑varianter og hero‑filmer for kampanjer er mest brukt.",
            },
            {
              q: "Hvordan velger jeg riktig leverandør?",
              a: "Sjekk portfolio, stil og pipeline. Spør om rettigheter og kvalitetssikring.",
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
        <h2 className="text-xl font-semibold">{copy.howItWorksTitle}</h2>
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
