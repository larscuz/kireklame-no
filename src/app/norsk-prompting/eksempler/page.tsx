import Link from "next/link";
import { operativeExamples } from "@/data/norskPrompting/operativeExamples";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import SearchPanel from "../_components/SearchPanel";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

const outputTypeLabel = {
  image: "Bilde",
  video: "Video",
  text: "Tekst",
} as const;

export const metadata = siteMeta({
  title: "Eksempler | Norsk Prompting",
  description:
    "Operative caser med prompt laget i prompt-utvider, fagbegreper fra ordforråd, resultatbilde og teknisk analyse.",
  path: "/norsk-prompting/eksempler",
});

export default function NorskPromptingEksemplerPage() {
  const description =
    "Eksempler viser ferdig prompt, brukte fagbegreper, resultat og hvorfor resultatet ble kontrollert. Her valideres metodikken operativt.";

  const searchItems = operativeExamples.map((example) => ({
    type: "eksempel" as const,
    title: example.title,
    description: example.shortBrief,
    href: `/norsk-prompting/eksempler/${example.slug}`,
  }));

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/eksempler"
      title="Eksempler"
      description={description}
      jsonLd={[
        buildArticleJsonLd({
          headline: "Operative eksempler for Norsk Prompting",
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
      <SearchPanel items={searchItems} showResultsOnEmptyQuery={false} />

      <section className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
        <h2 className="text-xl font-semibold tracking-tight">Struktur for hvert eksempel</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/90">
          <li>Kort briefing (mediefaglig).</li>
          <li>Brukte fagbegreper fra ordforråd.</li>
          <li>Ferdig prompt fra prompt-utvider.</li>
          <li>Resultatbilde.</li>
          <li>Teknisk analyse av hvorfor det fungerte.</li>
        </ol>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        {operativeExamples.map((example) => (
          <Link
            key={example.slug}
            href={`/norsk-prompting/eksempler/${example.slug}`}
            className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7 shadow-[0_10px_30px_rgba(2,6,23,0.18)] transition hover:-translate-y-px hover:border-zinc-300/35"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
              {outputTypeLabel[example.outputType]} · {example.modelName}
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">{example.title}</h2>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">{example.shortBrief}</p>
            <p className="mt-3 text-xs text-[rgb(var(--muted))]">Resultat og analyse tilgjengelig</p>
          </Link>
        ))}
      </div>
    </NorskPromptingShell>
  );
}
