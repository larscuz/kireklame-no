import Link from "next/link";
import { glossaryTerms } from "@/data/norskPrompting/glossary";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import SearchPanel from "../_components/SearchPanel";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Ordforråd | Norsk Prompting",
  description:
    "Terminologibase for film, VFX, arkitektur, lys/foto, AI-begreper og designspråk i Norsk Prompting.",
  path: "/norsk-prompting/ordforrad",
});

const domainLabel = {
  arch: "Arkitektur / rom",
  film: "Film / kamera",
  vfx: "VFX / post",
  ai: "AI-begreper",
  photo: "Lys / foto",
  design: "Design / UX",
} as const;

export default function NorskPromptingOrdforradPage() {
  const grouped = glossaryTerms.reduce<Record<string, typeof glossaryTerms>>((acc, term) => {
    const key = term.domain;
    if (!acc[key]) acc[key] = [];
    acc[key].push(term);
    return acc;
  }, {});

  const searchItems = glossaryTerms.map((term) => ({
    type: "ordforråd" as const,
    title: term.term_no,
    description: term.promptImpact,
    href: `/norsk-prompting/ordforrad/${term.slug}`,
  }));

  const description =
    "Ordforrådet inneholder fagtermer som gjør output mer kontrollerbar. Hver term kan sendes direkte til prompt-utvideren.";

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/ordforrad"
      title="Ordforråd"
      description={description}
      jsonLd={[
        buildArticleJsonLd({
          headline: "Norsk Prompting-ordforråd",
          description,
          path: "/norsk-prompting/ordforrad",
          dateModified: "2026-02-23",
        }),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "Ordforråd", item: absoluteUrl("/norsk-prompting/ordforrad") },
        ]),
      ]}
    >
      <SearchPanel items={searchItems} />

      <div className="space-y-4">
        {Object.entries(grouped).map(([domain, terms]) => (
          <section key={domain} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <h2 className="text-xl font-semibold tracking-tight">{domainLabel[domain as keyof typeof domainLabel]}</h2>
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">{terms.length} termer</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {terms.map((term) => (
                <Link
                  key={term.slug}
                  href={`/norsk-prompting/ordforrad/${term.slug}`}
                  className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 hover:border-cyan-300/35 hover:bg-cyan-300/10"
                >
                  <p className="text-sm font-semibold">{term.term_no}</p>
                  <p className="mt-1 text-xs text-[rgb(var(--muted))]">{term.term_en}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </NorskPromptingShell>
  );
}
