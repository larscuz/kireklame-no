import { cinematicGenres } from "@/data/norskPrompting/cinematicGenres";
import { promptTemplates } from "@/data/norskPrompting/runtime";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import CopyTextButton from "../_components/CopyTextButton";
import TemplatesWorkbench from "../_components/TemplatesWorkbench";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Maler | Norsk Prompting",
  description:
    "Prompt-maler for reklamefilm, produktdemo, arkitektur, historisk scene og redaksjonell produksjon.",
  path: "/norsk-prompting/maler",
});

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
      <TemplatesWorkbench templates={promptTemplates} />

      <section className="mt-6">
        <h2 className="text-2xl font-semibold tracking-tight">Kinematiske sjangre og representasjonsskift</h2>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Disse rammene kan brukes direkte i prompt-utvideren for mer kontrollert produksjonsestetikk.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {cinematicGenres.map((genre) => (
            <details
              key={genre.id}
              className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7 shadow-[0_10px_30px_rgba(2,6,23,0.18)]"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3">
                <span className="text-lg font-semibold tracking-tight">{genre.navn}</span>
                {genre.representasjonsskift ? (
                  <span className="rounded-full border border-zinc-300/35 px-2 py-1 text-xs text-zinc-100">
                    {genre.representasjonsskift}
                  </span>
                ) : null}
              </summary>

              <div className="mt-3">
                <p className="text-sm text-[rgb(var(--muted))]">{genre.effekt}</p>

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

                <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 p-3 text-xs text-[rgb(var(--fg))]/90">
                  {genre.promptStruktur.mal}
                </pre>

                <div className="mt-3">
                  <CopyTextButton value={genre.promptStruktur.mal} label="Kopier sjanger-mal" />
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
    </NorskPromptingShell>
  );
}
