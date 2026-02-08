import type { Metadata } from "next";
import Link from "next/link";
import { siteMeta } from "@/lib/seo";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";

export const metadata: Metadata = siteMeta({
  title: "KI reklamebyrå – finn AI‑byråer i Norge | KiReklame",
  description:
    "Finn norske KI‑reklamebyråer og AI‑first studioer for annonser, kampanjer og kreativ produksjon. Sammenlign tjenester, pris og AI‑nivå.",
  path: "/ki-reklamebyra",
});

export default async function KiReklamebyraPage() {
  const locale = await getLocale();
  const copy =
    locale === "en"
      ? {
          title: "AI advertising agencies in Norway",
          intro:
            "Looking for an AI advertising agency that can deliver ads, campaigns, or creative content faster and more efficiently? KiReklame brings together Norwegian AI-first agencies and studios using AI throughout the production process. Filter by services, price, and AI level to find the right partner.",
          p1:
            "An AI advertising agency combines traditional advertising expertise with modern AI tools. That means faster ideation, more creative variants, and more efficient production of ads, social formats, and video.",
          p2:
            "If you need high testing frequency in performance channels, or want to produce large volumes of content without blowing the budget, an AI-first agency can be the right choice. Many also offer strategy, content planning, and creative concept development.",
          p3:
            "Start by defining goals: brand, sales, or leads? Then choose agencies with experience in your industry and the formats you need. Look for clarity around process, rights, and deliverables.",
          howTitle: "How it works",
          steps: [
            "1. Define needs: format, message, channels, and budget.",
            "2. Find relevant agencies in the directory and compare AI level.",
            "3. Reach out and request proposals or quotes.",
          ],
          ctaPrimary: "Find AI agencies",
          ctaSecondary: "Ask for help",
          faqTitle: "Frequently asked questions",
          faq: [
            {
              q: "What does an AI advertising agency do?",
              a: "They use AI tools in ideation, production, and optimization to deliver ads and campaigns faster and at scale.",
            },
            {
              q: "When is an AI-first agency the right choice?",
              a: "When you need many variants, fast production, or continuous testing in performance channels.",
            },
            {
              q: "Do agencies offer both strategy and production?",
              a: "Many do, but not all. Use the directory filters to find the right mix.",
            },
            {
              q: "How do I compare agencies?",
              a: "Look at AI level, specialization, and past work. Contact those that best match your needs.",
            },
          ],
        }
      : {
          title: "KI reklamebyrå i Norge",
          intro:
            "Leter du etter et KI‑reklamebyrå som kan levere annonser, kampanjer eller kreativt innhold raskere og mer effektivt? KiReklame samler norske AI‑first byråer og studioer som bruker kunstig intelligens i hele produksjonsløpet. Du kan filtrere på tjenester, pris og AI‑nivå for å finne riktig partner.",
          p1:
            "Et KI‑reklamebyrå kombinerer tradisjonell reklamekompetanse med moderne AI‑verktøy. Det gir raskere idéutvikling, flere kreative varianter og mer effektiv produksjon av annonser, sosiale formater og video.",
          p2:
            "Hvis du trenger høy testfrekvens i performance‑kanaler, eller vil produsere store mengder innhold uten å sprenge budsjettet, kan et AI‑first byrå være riktig valg. Mange tilbyr også strategi, innholdsplan og kreativ konseptutvikling.",
          p3:
            "Start med å definere mål: skal du bygge merkevare, øke salg, eller få flere leads? Velg deretter byråer som har erfaring innen din bransje og formatene du trenger. Se også etter tydelighet rundt prosess, rettigheter og leveranser.",
          howTitle: "Slik fungerer det",
          steps: [
            "1. Definer behov: format, budskap, kanaler og budsjett.",
            "2. Finn relevante byråer i katalogen og sammenlign AI‑nivå.",
            "3. Ta kontakt og be om forslag eller tilbud.",
          ],
          ctaPrimary: "Finn KI‑byråer",
          ctaSecondary: "Be om hjelp",
          faqTitle: "Ofte stilte spørsmål",
          faq: [
            {
              q: "Hva gjør et KI‑reklamebyrå?",
              a: "De bruker AI‑verktøy i idé, produksjon og optimalisering for å levere annonser og kampanjer raskere og mer skalerbart.",
            },
            {
              q: "Når lønner det seg å velge et AI‑first byrå?",
              a: "Når du trenger mange varianter, rask produksjonstakt eller løpende testing i performance‑kanaler.",
            },
            {
              q: "Tilbyr byråene både strategi og produksjon?",
              a: "Mange gjør det, men ikke alle. Bruk filtrene i katalogen for å finne riktig kombinasjon.",
            },
            {
              q: "Hvordan sammenligner jeg ulike byråer?",
              a: "Se på AI‑nivå, spesialisering og tidligere arbeid. Kontakt de som matcher behovet ditt best.",
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
