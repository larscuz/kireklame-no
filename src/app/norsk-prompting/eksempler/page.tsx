import Link from "next/link";
import ExamplesShowcaseBoard from "../_components/ExamplesShowcaseBoard";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import { operativeExamples } from "@/data/norskPrompting/operativeExamples";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";
import { loadExampleShowcaseItems } from "@/lib/norsk-prompting/exampleShowcaseCms";

export const metadata = siteMeta({
  title: "Eksempler for KI-skole og prompting | Norsk Prompting",
  description:
    "Se eksempler på prompting i praksis for KI-skole, mediefag og generativ produksjon i Norsk Prompting. Siden viser bilde- og videoeksempler med konkrete prompts, analyse og arbeidsflyt.",
  path: "/norsk-prompting/eksempler",
});

export default async function NorskPromptingEksemplerPage() {
  const description =
    "Eksempler for vanskelige KI-caser: prompt-oppskrift, mini-tutorial og media-preview. Fokus er kontroll, konsistens og teknisk presisjon.";
  const showcase = await loadExampleShowcaseItems();

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/eksempler"
      title="Eksempler"
      description={description}
      jsonLd={[
        buildArticleJsonLd({
          headline: "Avanserte eksempler for Norsk Prompting",
          description,
          path: "/norsk-prompting/eksempler",
          dateModified: "2026-02-26",
        }),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "Eksempler", item: absoluteUrl("/norsk-prompting/eksempler") },
        ]),
      ]}
    >
      <section className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/88 p-5 md:p-6">
        <p className="text-sm leading-relaxed text-[rgb(var(--muted))]">
          Eksempler-siden viser prompting i praksis for KI undervisning, mediefag
          og generativ produksjon. Her kan elever og lærere se hvordan korte ideer
          blir til konkrete leveranser for bilde og video.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">
          Hver case er laget for å forklare valg av språk, struktur og kontroll,
          slik at KI-skole blir koblet direkte til praktisk arbeid og analyse.
        </p>
      </section>

      {showcase.source === "static" ? (
        <section className="np-node-surface rounded-2xl border border-amber-300/35 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-100">
            Eksempler vises fra statisk fallback. {showcase.tableMissing ? "Kjør SQL for `ki_skole_examples` i Supabase." : "CMS-data kunne ikke hentes akkurat nå."}
          </p>
          {showcase.errorMessage ? (
            <p className="mt-1 text-xs text-amber-200/90">Detalj: {showcase.errorMessage}</p>
          ) : null}
        </section>
      ) : null}

      <ExamplesShowcaseBoard items={showcase.items} />

      <section className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
        <h2 className="text-lg font-semibold tracking-tight">Detaljsider med analyse</h2>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">
          Disse detaljsidene kan brukes for mer inngående faganalyse per case.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {operativeExamples.map((example) => (
            <Link
              key={example.slug}
              href={`/norsk-prompting/eksempler/${example.slug}`}
              className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/68 px-3 py-2 text-sm transition hover:border-zinc-300/40 hover:bg-zinc-300/08"
            >
              <p className="font-semibold">{example.title}</p>
              <p className="mt-1 text-xs text-[rgb(var(--muted))]">{example.shortBrief}</p>
            </Link>
          ))}
        </div>
      </section>
    </NorskPromptingShell>
  );
}
