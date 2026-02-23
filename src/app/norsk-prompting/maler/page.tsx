import Link from "next/link";
import { promptTemplates } from "@/data/norskPrompting/templates";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import CopyTextButton from "../_components/CopyTextButton";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Maler | Norsk Prompting",
  description:
    "Prompt-maler for reklamefilm, produktdemo, arkitektur, historisk scene og redaksjonell produksjon.",
  path: "/norsk-prompting/maler",
});

function templateSnippet(templateId: string) {
  return `/norsk-prompting/prompt-utvider?template=${encodeURIComponent(templateId)}`;
}

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
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">{template.outputType} · {template.domain}</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">{template.title}</h2>
              </div>
              <div className="flex gap-2">
                <CopyTextButton value={template.useCase} label="Kopier use-case" />
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
    </NorskPromptingShell>
  );
}
