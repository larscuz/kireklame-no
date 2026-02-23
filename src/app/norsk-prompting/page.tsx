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
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Norsk Prompting | Profesjonell prompting på norsk",
  description:
    "Norsk Prompting er en strukturert ressurs for presis prompting innen bilde, video og tekst. Regler, maler, ordforråd og eksempler.",
  path: "/norsk-prompting",
});

const intro =
  "Hvis vi vil at KI skal bli bedre på norsk, må vi bruke norsk i KI. Norsk Prompting er et rammeverk for å beskrive motiv, kamera, lys, rom, bevegelse og begrensninger presist – på norsk – slik at resultatene blir mer kontrollerbare og profesjonelle.";

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
      currentPath="/norsk-prompting"
      title="Norsk Prompting"
      description={intro}
      jsonLd={jsonLd}
    >
      <section className="grid gap-4 lg:grid-cols-6">
        <article className="lg:col-span-3 rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-500/18 via-cyan-500/7 to-amber-300/12 p-5 shadow-[0_20px_45px_rgba(8,145,178,0.24)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/90">Promptmaskin</p>
          <p className="mt-2 text-3xl font-semibold leading-tight">Prompt-utvider</p>
          <p className="mt-2 max-w-xl text-sm text-[rgb(var(--fg))]/85">
            Kort norsk input blir til strukturert pro-prompt i fast arkitektur.
          </p>
        </article>

        <article className="np-template-card lg:col-span-2 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/92 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Bibliotek</p>
          <p className="mt-2 text-3xl font-semibold leading-tight">{runtimeCounts.glossaryRegistered} termer</p>
          {runtimeCounts.glossaryDisplayed !== runtimeCounts.glossaryRegistered ? (
            <p className="mt-1 text-xs text-[rgb(var(--muted))]">
              Viser {runtimeCounts.glossaryDisplayed} unike termer i listen.
            </p>
          ) : null}
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">Film, VFX, arkitektur, lys/foto, AI-begreper og designspråk.</p>
        </article>

        <article className="np-template-card lg:col-span-1 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/92 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Regeldatabase</p>
          <p className="mt-2 text-3xl font-semibold leading-tight">{norskPromptingRules.length}</p>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">Maskinlesbare regler for konsistens, fysikk, kamera og produksjonslogikk.</p>
        </article>
      </section>

      <SearchPanel items={searchItems} />

      <section className="grid gap-4 lg:grid-cols-3">
        <Link href="/norsk-prompting/prompt-utvider" className="rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-500/20 via-cyan-400/8 to-amber-300/14 p-4 shadow-[0_16px_34px_rgba(8,145,178,0.28)] hover:from-cyan-500/24">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">Start her</p>
          <h2 className="mt-2 text-xl font-semibold">Prompt-utvider</h2>
          <p className="mt-2 text-sm text-[rgb(var(--fg))]/85">Kjør kort beskrivelse gjennom regelmotoren og kopier ferdig prompt.</p>
        </Link>

        <Link href="/norsk-prompting/regler" className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/92 p-4 shadow-[0_10px_30px_rgba(2,6,23,0.2)] hover:border-cyan-300/25">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Rammeverk</p>
          <h2 className="mt-2 text-xl font-semibold">Regler</h2>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">Se hvilke regler som injiseres i resultatet og hvorfor de finnes.</p>
        </Link>

        <Link href="/norsk-prompting/eksempler" className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/92 p-4 shadow-[0_10px_30px_rgba(2,6,23,0.2)] hover:border-cyan-300/25">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Casebibliotek</p>
          <h2 className="mt-2 text-xl font-semibold">Eksempler</h2>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">Kort input → langt resultat med forklaring, regler og termer brukt.</p>
        </Link>
      </section>
    </NorskPromptingShell>
  );
}
