import Link from "next/link";
import { glossaryTerms, runtimeCounts } from "@/data/norskPrompting/runtime";
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

type Props = {
  searchParams?: Promise<{ visning?: string }>;
};

function buttonClass(active: boolean) {
  return [
    "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition",
    active
      ? "border-cyan-300/45 bg-cyan-300/15 text-cyan-100"
      : "border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:border-cyan-300/35",
  ].join(" ");
}

export default async function NorskPromptingOrdforradPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const visning = params.visning === "alfabetisk" ? "alfabetisk" : "domene";

  const grouped = glossaryTerms.reduce<Record<string, typeof glossaryTerms>>((acc, term) => {
    const key = term.domain;
    if (!acc[key]) acc[key] = [];
    acc[key].push(term);
    return acc;
  }, {});

  const groupedByLetter = glossaryTerms
    .slice()
    .sort((a, b) => a.term_no.localeCompare(b.term_no, "nb-NO"))
    .reduce<Record<string, typeof glossaryTerms>>((acc, term) => {
      const letter = term.term_no.slice(0, 1).toUpperCase();
      const key = /^[A-ZÆØÅ]$/.test(letter) ? letter : "#";
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
    "Ordforrådet inneholder fagtermer som gjør resultatet mer kontrollerbart. Hver term kan sendes direkte til prompt-utvideren.";

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
      <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Visning</p>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Registrert: {runtimeCounts.glossaryRegistered} termer
          {runtimeCounts.glossaryDisplayed !== runtimeCounts.glossaryRegistered
            ? ` · Viser ${runtimeCounts.glossaryDisplayed} unike`
            : ""}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link href="/norsk-prompting/ordforrad" className={buttonClass(visning === "domene")}>
            Etter domene
          </Link>
          <Link
            href="/norsk-prompting/ordforrad?visning=alfabetisk"
            className={buttonClass(visning === "alfabetisk")}
          >
            Alfabetisk (A-Å)
          </Link>
        </div>
      </section>

      <SearchPanel items={searchItems} showResultsOnEmptyQuery={false} />

      <div className="space-y-4">
        {visning === "domene"
          ? Object.entries(grouped)
              .sort(([a], [b]) =>
                domainLabel[a as keyof typeof domainLabel].localeCompare(
                  domainLabel[b as keyof typeof domainLabel],
                  "nb-NO"
                )
              )
              .map(([domain, terms]) => (
                <section
                  key={domain}
                  className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4"
                >
                  <h2 className="text-xl font-semibold tracking-tight">
                    {domainLabel[domain as keyof typeof domainLabel]}
                  </h2>
                  <p className="mt-1 text-sm text-[rgb(var(--muted))]">{terms.length} termer</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {terms
                      .slice()
                      .sort((a, b) => a.term_no.localeCompare(b.term_no, "nb-NO"))
                      .map((term) => (
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
              ))
          : Object.entries(groupedByLetter)
              .sort(([a], [b]) => a.localeCompare(b, "nb-NO"))
              .map(([letter, terms]) => (
                <section
                  key={letter}
                  className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4"
                >
                  <h2 className="text-xl font-semibold tracking-tight">{letter}</h2>
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
