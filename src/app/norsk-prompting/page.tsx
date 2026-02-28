import Link from "next/link";
import { glossaryTerms, runtimeCounts } from "@/data/norskPrompting/runtime";
import { modelTemplateCategories } from "@/data/norskPrompting/modelPlaybooks";
import { operativeExamples } from "@/data/norskPrompting/operativeExamples";
import SearchPanel from "./_components/SearchPanel";
import NorskPromptingShell from "./_components/NorskPromptingShell";
import PromptExpanderClient from "./_components/PromptExpanderClient";
import { siteMeta } from "@/lib/seo";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "KI-skole i Norge | Lær KI, prompting og kunstig intelligens i mediefag",
  description:
    "KI-skole for elever og lærere. Lær hvordan kunstig intelligens og prompting brukes i praksis i mediefag og kreativ produksjon.",
  path: "/norsk-prompting",
});

const intro =
  "Erfarne folk i mediebransjen får ofte bedre resultater fra KI-modeller fordi de kan beskrive ønsket uttrykk presist med riktige fagbegreper. Prompt Hjelper gjør den samme presisjonen tilgjengelig for deg som ikke har den erfaringen ennå.";

export default function NorskPromptingHubPage() {
  const searchItems = [
    ...glossaryTerms.map((term) => ({
      type: "ordforråd" as const,
      title: term.term_no,
      description: term.definition_no,
      href: `/norsk-prompting/ordforrad/${term.slug}`,
    })),
    ...modelTemplateCategories.flatMap((category) =>
      category.models
        .filter((model) => model.status === "documented")
        .map((model) => ({
          type: "mal" as const,
          title: model.modelName,
          description: `${category.title}: ${model.summary}`,
          href: "/norsk-prompting/maler",
        }))
    ),
    ...operativeExamples.map((example) => ({
      type: "eksempel" as const,
      title: example.title,
      description: example.shortBrief,
      href: `/norsk-prompting/eksempler/${example.slug}`,
    })),
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Hva er KI-skole?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "KI-skole er undervisning i kunstig intelligens, prompting og digital produksjon. Elevene lærer å bruke KI-verktøy til bilde, video, tekst og lyd – med fokus på språkpresisjon, produksjonskontroll og etisk bruk. Målet er å gjøre KI til et praktisk arbeidsverktøy, ikke bare teori.",
        },
      },
      {
        "@type": "Question",
        name: "Hvordan lære KI og prompting i praksis?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Man lærer KI best gjennom produksjon. Elevene skriver korte beskrivelser, utvikler dem til presise instruksjoner og tester resultatet i ulike KI-verktøy. Gjennom iterasjon, justering av begreper og analyse av output får de forståelse for hvordan språk påvirker kvalitet og kontroll.",
        },
      },
      {
        "@type": "Question",
        name: "Hvorfor mediefag gir deg et fortrinn i KI?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Mediefag gir kompetanse i bildekomposisjon, lys, dramaturgi, historiefortelling og målgruppeforståelse. Når disse faglige begrepene brukes i prompting, blir resultatene mer presise og profesjonelle. KI forsterker eksisterende mediefaglig kompetanse – den erstatter den ikke.",
        },
      },
      {
        "@type": "Question",
        name: "KI-undervisning for lærere",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "KI-undervisning for lærere handler om å integrere kunstig intelligens i eksisterende fag, ikke lage et nytt isolert fag. Lærere kan bruke KI til idéutvikling, produksjon, analyse og vurdering. Strukturert prompting gir forutsigbarhet, kvalitet og bedre læringsutbytte.",
        },
      },
      {
        "@type": "Question",
        name: "Fra kort prompt til produksjonsklar leveranse",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "En kort idé kan utvikles til en produksjonsklar leveranse ved å strukturere mål, motiv, miljø, lys, komposisjon og tekniske begrensninger. Ved å bruke presis terminologi og klare rammer går man fra enkel setning til profesjonell output tilpasset bilde-, video- eller tekstproduksjon.",
        },
      },
    ],
  };

  const jsonLd = [
    buildWebPageJsonLd("KI-skole i Norge", "/norsk-prompting", intro),
    buildBreadcrumbJsonLd([
      { name: "Forside", item: absoluteUrl("/") },
      { name: "KI-skole", item: absoluteUrl("/norsk-prompting") },
    ]),
    faqJsonLd,
  ];

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/prompt-utvider"
      title="KI-skole – Norsk Prompting"
      description={intro}
      jsonLd={jsonLd}
    >
      {/* SEO-tekst (indekserbar) */}
      <section className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/86 p-5 md:p-6 mb-4">
        <h2 className="text-xl font-semibold">Hva er KI-skole?</h2>
        <p className="mt-2 text-sm text-[rgb(var(--muted))] leading-relaxed">
          KI-skole er undervisning i kunstig intelligens, prompting og digital
          produksjon. Elevene lærer å bruke KI-verktøy til bilde, video, tekst og
          lyd – med fokus på språkpresisjon, produksjonskontroll og etisk bruk.
          Målet er å gjøre KI til et praktisk arbeidsverktøy, ikke bare teori.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          Hvordan lære KI og prompting i praksis
        </h2>
        <p className="mt-2 text-sm text-[rgb(var(--muted))] leading-relaxed">
          Man lærer KI best gjennom produksjon. Elevene skriver korte beskrivelser,
          utvikler dem til presise instruksjoner og tester resultatet i ulike
          KI-verktøy. Gjennom iterasjon, justering av begreper og analyse av output
          får de forståelse for hvordan språk påvirker kvalitet og kontroll.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          Hvorfor mediefag gir deg et fortrinn i KI
        </h2>
        <p className="mt-2 text-sm text-[rgb(var(--muted))] leading-relaxed">
          Mediefag gir kompetanse i bildekomposisjon, lys, dramaturgi,
          historiefortelling og målgruppeforståelse. Når disse faglige begrepene
          brukes i prompting, blir resultatene mer presise og profesjonelle.
          KI forsterker eksisterende mediefaglig kompetanse – den erstatter den ikke.
        </p>

        <h2 className="mt-6 text-xl font-semibold">KI-undervisning for lærere</h2>
        <p className="mt-2 text-sm text-[rgb(var(--muted))] leading-relaxed">
          KI-undervisning for lærere handler om å integrere kunstig intelligens i
          eksisterende fag, ikke lage et nytt isolert fag. Lærere kan bruke KI til
          idéutvikling, produksjon, analyse og vurdering. Strukturert prompting gir
          forutsigbarhet, kvalitet og bedre læringsutbytte.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          Fra kort prompt til produksjonsklar leveranse
        </h2>
        <p className="mt-2 text-sm text-[rgb(var(--muted))] leading-relaxed">
          En kort idé kan utvikles til en produksjonsklar leveranse ved å strukturere
          mål, motiv, miljø, lys, komposisjon og tekniske begrensninger. Ved å bruke
          presis terminologi og klare rammer går man fra enkel setning til profesjonell
          output tilpasset bilde-, video- eller tekstproduksjon.
        </p>
      </section>

      {/* Interaktiv del */}
      <PromptExpanderClient />

      <section className="grid gap-3 lg:grid-cols-12">
        <article className="np-node-surface np-template-card lg:col-span-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/88 p-5 pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
            Bibliotek
          </p>
          <p className="mt-2 text-3xl font-semibold leading-tight">
            {runtimeCounts.glossaryRegistered} termer
          </p>
          {runtimeCounts.glossaryDisplayed !== runtimeCounts.glossaryRegistered ? (
            <p className="mt-1 text-xs text-[rgb(var(--muted))]">
              Viser {runtimeCounts.glossaryDisplayed} unike termer i listen.
            </p>
          ) : null}
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Film, VFX, arkitektur, lys/foto, AI-begreper og designspråk.
          </p>
        </article>

        <Link
          href="/norsk-prompting/maler"
          className="np-node-surface lg:col-span-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/86 p-4 pt-7 shadow-[0_8px_18px_rgba(2,6,23,0.14)] hover:border-zinc-300/30"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
            Modellbibliotek
          </p>
          <h2 className="mt-2 text-xl font-semibold">Maler</h2>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Interne faner for bilde, video og lyd med modellspesifikke oppskrifter.
          </p>
        </Link>

        <Link
          href="/norsk-prompting/eksempler"
          className="np-node-surface lg:col-span-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/86 p-4 pt-7 shadow-[0_8px_18px_rgba(2,6,23,0.14)] hover:border-zinc-300/30"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
            Casebibliotek
          </p>
          <h2 className="mt-2 text-xl font-semibold">Eksempler</h2>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Kort input → langt resultat med forklaring, analyse og termer brukt.
          </p>
        </Link>
      </section>

      <SearchPanel items={searchItems} />
    </NorskPromptingShell>
  );
}
