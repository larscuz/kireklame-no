import Link from "next/link";
import { promptExamples } from "@/data/norskPrompting/runtime";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import SearchPanel from "../_components/SearchPanel";
import { siteMeta } from "@/lib/seo";
import { domainLabel, outputTypeOptions } from "@/lib/norsk-prompting/constants";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Eksempler | Norsk Prompting",
  description:
    "Eksempelbibliotek med kort norsk input, langt resultat, regelsett og term-injeksjon for profesjonell prompting.",
  path: "/norsk-prompting/eksempler",
});

export default function NorskPromptingEksemplerPage() {
  const outputTypeLabel = Object.fromEntries(
    outputTypeOptions.map((option) => [option.value, option.label])
  );

  const description = "Casebibliotek: kort input → langt resultat med forklaring på hvorfor prompten fungerer.";

  const searchItems = promptExamples.map((example) => ({
    type: "eksempel" as const,
    title: example.title,
    description: example.shortInput,
    href: `/norsk-prompting/eksempler/${example.slug}`,
  }));

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/eksempler"
      title="Eksempelbibliotek"
      description={description}
      jsonLd={[
        buildArticleJsonLd({
          headline: "Eksempelbibliotek for Norsk Prompting",
          description,
          path: "/norsk-prompting/eksempler",
          dateModified: "2026-02-23",
        }),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "Eksempler", item: absoluteUrl("/norsk-prompting/eksempler") },
        ]),
      ]}
    >
      <SearchPanel items={searchItems} />

      <div className="grid gap-3 md:grid-cols-2">
        {promptExamples.map((example) => (
          <Link
            key={example.slug}
            href={`/norsk-prompting/eksempler/${example.slug}`}
            className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 shadow-[0_10px_30px_rgba(2,6,23,0.18)] transition hover:-translate-y-px hover:border-cyan-300/35"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
              {outputTypeLabel[example.outputType]} · {domainLabel[example.domain]}
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">{example.title}</h2>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">{example.shortInput}</p>
          </Link>
        ))}
      </div>
    </NorskPromptingShell>
  );
}
