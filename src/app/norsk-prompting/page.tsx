import Link from "next/link";
import {
  glossaryTerms,
  norskPromptingRules,
  promptExamples,
  promptTemplates,
  runtimeCounts,
} from "@/data/norskPrompting/runtime";
import SearchPanel from "./_components/SearchPanel";
import NorskPromptingShell from "./_components/NorskPromptingShell";
import PromptExpanderClient from "./_components/PromptExpanderClient";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Norsk Prompting | Prompt-utvider og profesjonell prompting",
  description:
    "Start direkte i Prompt-utvider. Berik enkel tekst med mediefaglige begreper som hjelper tekstmodeller å lage mer presise prompter.",
  path: "/norsk-prompting",
});

const intro =
  "Erfarne folk i mediebransjen får ofte bedre resultater fra KI modeller fordi de kan beskrive ønsket uttrykk presist med riktige fagbegreper. Prompt Hjelper gjør den samme presisjonen tilgjengelig for deg som ikke har den erfaringen ennå, slik at du får mer kontroll, bedre detaljer og en mer produksjonsklar prompt. Verktøyet lager ikke en ferdig pro-prompt, men beriker forklaringen din med fagbegreper som hjelper chatmodellen å lage bedre prompter.";

export default function NorskPromptingHubPage() {
  const searchItems = [
    ...glossaryTerms.map((term) => ({
      type: "ordforråd" as const,
      title: term.term_no,
      description: term.definition_no,
      href: `/norsk-prompting/ordforrad/${term.slug}`,
    })),
    ...promptTemplates.map((template) => ({
      type: "mal" as const,
      title: template.title,
      description: template.useCase,
      href: `/norsk-prompting/maler#${template.id}`,
    })),
    ...promptExamples.map((example) => ({
      type: "eksempel" as const,
      title: example.title,
      description: example.shortInput,
      href: `/norsk-prompting/eksempler/${example.slug}`,
    })),
  ];

  const jsonLd = [
    buildWebPageJsonLd("Norsk Prompting", "/norsk-prompting", intro),
    buildBreadcrumbJsonLd([
      { name: "Forside", item: absoluteUrl("/") },
      { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
    ]),
  ];

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/prompt-utvider"
      title="Prompt-utvider"
      description={intro}
      jsonLd={jsonLd}
    >
      <PromptExpanderClient />

      <section className="grid gap-3 lg:grid-cols-12">
        <article className="np-node-surface np-template-card lg:col-span-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/88 p-5 pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Bibliotek</p>
          <p className="mt-2 text-3xl font-semibold leading-tight">{runtimeCounts.glossaryRegistered} termer</p>
          {runtimeCounts.glossaryDisplayed !== runtimeCounts.glossaryRegistered ? (
            <p className="mt-1 text-xs text-[rgb(var(--muted))]">
              Viser {runtimeCounts.glossaryDisplayed} unike termer i listen.
            </p>
          ) : null}
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">Film, VFX, arkitektur, lys/foto, AI-begreper og designspråk.</p>
        </article>

        <article className="np-node-surface np-template-card lg:col-span-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/86 p-5 pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Regeldatabase</p>
          <p className="mt-2 text-3xl font-semibold leading-tight">{norskPromptingRules.length}</p>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">Maskinlesbare regler for konsistens, fysikk, kamera og produksjonslogikk.</p>
        </article>

        <Link href="/norsk-prompting/eksempler" className="np-node-surface lg:col-span-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/86 p-4 pt-7 shadow-[0_8px_18px_rgba(2,6,23,0.14)] hover:border-zinc-300/30">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Casebibliotek</p>
          <h2 className="mt-2 text-xl font-semibold">Eksempler</h2>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">Kort input → langt resultat med forklaring, regler og termer brukt.</p>
        </Link>
      </section>

      <SearchPanel items={searchItems} />
    </NorskPromptingShell>
  );
}
