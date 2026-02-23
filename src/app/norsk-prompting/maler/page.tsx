import Link from "next/link";
import { cinematicGenres } from "@/data/norskPrompting/cinematicGenres";
import { promptTemplates } from "@/data/norskPrompting/runtime";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import CopyTextButton from "../_components/CopyTextButton";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";
import { domainLabel, outputTypeOptions } from "@/lib/norsk-prompting/constants";

export const metadata = siteMeta({
  title: "Maler | Norsk Prompting",
  description:
    "Prompt-maler for reklamefilm, produktdemo, arkitektur, historisk scene og redaksjonell produksjon.",
  path: "/norsk-prompting/maler",
});

function templateSnippet(templateId: string) {
  return `/norsk-prompting/prompt-utvider?template=${encodeURIComponent(templateId)}`;
}

const outputTypeLabel = Object.fromEntries(
  outputTypeOptions.map((option) => [option.value, option.label])
);

export default function NorskPromptingMalerPage() {
  const description = "Maler brukes som startpunkt i prompt-utvideren. Hver mal knyttes til anbefalte regler.";

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/maler"
      title="Prompt-maler"
      description={description}
      jsonLd={[
        buildArticleJsonLd({
          headline: "Norsk Prompting-maler",
          description,
          path: "/norsk-prompting/maler",
          dateModified: "2026-02-23",
        }),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "Maler", item: absoluteUrl("/norsk-prompting/maler") },
        ]),
      ]}
    >
      <div className="space-y-4">
        {promptTemplates.map((template) => (
          <article id={template.id} key={template.id} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                  {outputTypeLabel[template.outputType]} · {domainLabel[template.domain]}
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">{template.title}</h2>
              </div>
              <div className="flex gap-2">
                <CopyTextButton value={template.useCase} label="Kopier bruksområde" />
                <Link
                  href={templateSnippet(template.id)}
                  className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100"
                >
                  Bruk i utvider
                </Link>
              </div>
            </div>

            <p className="mt-2 text-sm text-[rgb(var(--muted))]">{template.useCase}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {template.blocks.map((block) => (
                <li key={block.id}>
                  <strong>{block.title}:</strong> {block.instruction}
                </li>
              ))}
            </ul>

            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Anbefalte regler</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {template.recommendedRules.map((ruleId) => (
                <a
                  key={ruleId}
                  href={`/norsk-prompting/regler#${ruleId}`}
                  className="rounded-full border border-[rgb(var(--border))] px-2 py-1 text-xs text-[rgb(var(--muted))]"
                >
                  {ruleId}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold tracking-tight">Kinematiske sjangre og representasjonsskift</h2>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Disse rammene kan brukes direkte i prompt-utvideren for mer kontrollert produksjonsestetikk.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {cinematicGenres.map((genre) => (
            <article
              key={genre.id}
              className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4"
            >
              <h3 className="text-lg font-semibold tracking-tight">{genre.navn}</h3>
              <p className="mt-2 text-sm text-[rgb(var(--muted))]">{genre.effekt}</p>
              {genre.representasjonsskift ? (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
                  Representasjonsskift: {genre.representasjonsskift}
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-2">
                {genre.sterkeBegreper.map((term) => (
                  <span
                    key={`${genre.id}-${term}`}
                    className="rounded-full border border-[rgb(var(--border))] px-2 py-1 text-xs text-[rgb(var(--muted))]"
                  >
                    {term}
                  </span>
                ))}
              </div>

              <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3 text-xs text-[rgb(var(--fg))]/90">
                {genre.promptStruktur.mal}
              </pre>

              <div className="mt-3">
                <CopyTextButton value={genre.promptStruktur.mal} label="Kopier sjanger-mal" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </NorskPromptingShell>
  );
}
