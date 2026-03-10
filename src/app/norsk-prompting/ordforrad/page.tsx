import Link from "next/link";
import { glossaryTerms, marketingSkills, runtimeCounts } from "@/data/norskPrompting/runtime";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import SearchPanel from "../_components/SearchPanel";
import InfoHint from "../_components/InfoHint";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Ordforråd for KI-skole og prompting | Norsk Prompting",
  description:
    "Utforsk ordforråd for KI-skole, prompting og mediefag i Norsk Prompting. Finn begreper for lys, komposisjon, film, VFX og generativ KI som gjør undervisning og produksjon mer presis.",
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

const marketingCategoryLabel = {
  cro: "Konverteringsoptimalisering (CRO)",
  content: "Innhold og tekst",
  seo: "Søkemotoroptimalisering (SEO)",
  paid: "Betalt distribusjon",
  analytics: "Analyse og måling",
  retention: "Kundelojalitet",
  growth: "Vekst",
  strategy: "Strategi",
  sales: "Salg",
  foundation: "Grunnleggende",
} as const;

const marketingCategoryOrder = [
  "foundation",
  "strategy",
  "content",
  "seo",
  "cro",
  "paid",
  "analytics",
  "growth",
  "retention",
  "sales",
] as const;

type Props = {
  searchParams?: Promise<{ visning?: string }>;
};

function buttonClass(active: boolean) {
  return [
    "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition",
    active
      ? "border-zinc-300/35 bg-zinc-300/10 text-zinc-100"
      : "border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:border-zinc-300/35",
  ].join(" ");
}

function categoryColumnClass(active: boolean) {
  return [
    "rounded-xl border px-3 py-3 text-left transition",
    active
      ? "border-zinc-300/35 bg-zinc-300/10"
      : "border-[rgb(var(--border))] bg-[rgb(var(--bg))]/45 hover:border-zinc-300/35 hover:bg-zinc-300/8",
  ].join(" ");
}

export default async function NorskPromptingOrdforradPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const visning =
    params.visning === "alfabetisk"
      ? "alfabetisk"
      : params.visning === "marketing"
        ? "marketing"
        : "domene";

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

  const groupedMarketing = marketingSkills.reduce<Record<string, typeof marketingSkills>>((acc, skill) => {
    const key = skill.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  const searchItems = glossaryTerms.map((term) => ({
    type: "ordforråd" as const,
    title: term.term_no,
    description: term.promptImpact,
    href: `/norsk-prompting/ordforrad/${term.slug}`,
  }));
  const marketingSearchItems = marketingSkills.map((skill) => ({
    type: "marketing" as const,
    title: skill.title_no,
    description: skill.description_no,
    href: `/norsk-prompting/marketing-skills/${skill.slug}`,
  }));
  const searchItemsForView = visning === "marketing" ? marketingSearchItems : searchItems;

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
      <section className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/88 p-5 md:p-6">
        <p className="text-sm leading-relaxed text-[rgb(var(--muted))]">
          Ordforråd-siden samler begreper for KI undervisning, prompting og
          profesjonell produksjon i mediefag. Her finner du språk for lys,
          komposisjon, film, VFX og generativ KI som gjør instrukser tydeligere.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">
          Dette gjør siden nyttig både for elever som vil lære KI og for lærere som
          bygger undervisningsopplegg med presis fagterminologi.
        </p>
      </section>

      <section className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7 shadow-[0_10px_30px_rgba(2,6,23,0.18)]">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Kategori</p>
          <InfoHint text="Velg om du vil utforske klassisk ordforråd eller Marketing som egen kolonne/fane." />
        </div>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <Link href="/norsk-prompting/ordforrad" className={categoryColumnClass(visning !== "marketing")}>
            <p className="text-sm font-semibold text-zinc-100">Ordforråd</p>
            <p className="mt-1 text-xs text-[rgb(var(--muted))]">
              Film, VFX, lys, komposisjon og AI-begreper.
            </p>
          </Link>
          <Link
            href="/norsk-prompting/ordforrad?visning=marketing"
            className={categoryColumnClass(visning === "marketing")}
          >
            <p className="text-sm font-semibold text-zinc-100">Marketing</p>
            <p className="mt-1 text-xs text-[rgb(var(--muted))]">
              Egen kolonne med marketing-skills og kampanje-assistent.
            </p>
          </Link>
        </div>
      </section>

      <section className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7 shadow-[0_10px_30px_rgba(2,6,23,0.18)]">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Visning</p>
          <InfoHint text="Bytt mellom Ordforråd per domene, alfabetisk liste eller Marketing-fanen." />
        </div>
        {visning === "marketing" ? (
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Registrert: {runtimeCounts.marketingSkillsRegistered} marketing skills
            {runtimeCounts.marketingSkillsDisplayed !== runtimeCounts.marketingSkillsRegistered
              ? ` · Viser ${runtimeCounts.marketingSkillsDisplayed} unike`
              : ""}
          </p>
        ) : (
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Registrert: {runtimeCounts.glossaryRegistered} termer
            {runtimeCounts.glossaryDisplayed !== runtimeCounts.glossaryRegistered
              ? ` · Viser ${runtimeCounts.glossaryDisplayed} unike`
              : ""}
          </p>
        )}
        {visning !== "marketing" ? (
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
        ) : null}
        {visning === "marketing" ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/norsk-prompting/marketing-skills/kampanje-assistent"
              className="rounded-full border border-zinc-300/35 bg-zinc-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-100 hover:border-zinc-200/50"
            >
              Åpne kampanje-assistent
            </Link>
            <Link
              href="/norsk-prompting/marketing-skills"
              className="rounded-full border border-[rgb(var(--border))] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))] hover:border-zinc-300/35 hover:text-zinc-100"
            >
              Se alle skills
            </Link>
          </div>
        ) : null}
      </section>

      <SearchPanel items={searchItemsForView} showResultsOnEmptyQuery={false} />

      <div className="space-y-4">
        {visning === "domene" &&
          Object.entries(grouped)
            .sort(([a], [b]) =>
              domainLabel[a as keyof typeof domainLabel].localeCompare(
                domainLabel[b as keyof typeof domainLabel],
                "nb-NO"
              )
            )
            .map(([domain, terms]) => (
              <section
                key={domain}
                className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7"
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
                        className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 px-3 py-2 hover:border-zinc-300/35 hover:bg-zinc-300/10"
                      >
                        <p className="text-sm font-semibold">{term.term_no}</p>
                        <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                          {term.promptImpact || term.definition_no || term.term_en}
                        </p>
                        <p className="mt-1 text-[11px] text-[rgb(var(--muted))]/80">{term.term_en}</p>
                      </Link>
                    ))}
                </div>
              </section>
            ))}

        {visning === "alfabetisk" &&
          Object.entries(groupedByLetter)
            .sort(([a], [b]) => a.localeCompare(b, "nb-NO"))
            .map(([letter, terms]) => (
              <section
                key={letter}
                className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7"
              >
                <h2 className="text-xl font-semibold tracking-tight">{letter}</h2>
                <p className="mt-1 text-sm text-[rgb(var(--muted))]">{terms.length} termer</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {terms.map((term) => (
                    <Link
                      key={term.slug}
                      href={`/norsk-prompting/ordforrad/${term.slug}`}
                      className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 px-3 py-2 hover:border-zinc-300/35 hover:bg-zinc-300/10"
                    >
                      <p className="text-sm font-semibold">{term.term_no}</p>
                      <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                        {term.promptImpact || term.definition_no || term.term_en}
                      </p>
                      <p className="mt-1 text-[11px] text-[rgb(var(--muted))]/80">{term.term_en}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}

        {visning === "marketing" &&
          marketingCategoryOrder
            .filter((category) => groupedMarketing[category]?.length)
            .map((category) => {
              const skills = groupedMarketing[category]!;
              return (
                <section
                  key={category}
                  className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7"
                >
                  <h2 className="text-xl font-semibold tracking-tight">
                    {marketingCategoryLabel[category]}
                  </h2>
                  <p className="mt-1 text-sm text-[rgb(var(--muted))]">{skills.length} skills</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {skills
                      .slice()
                      .sort((a, b) => a.title_no.localeCompare(b.title_no, "nb-NO"))
                      .map((skill) => (
                        <Link
                          key={skill.slug}
                          href={`/norsk-prompting/marketing-skills/${skill.slug}`}
                          className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 px-3 py-2 hover:border-zinc-300/35 hover:bg-zinc-300/10"
                        >
                          <p className="text-sm font-semibold">{skill.title_no}</p>
                          <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                            {skill.description_no}
                          </p>
                          <p className="mt-1 text-[11px] text-[rgb(var(--muted))]/80">{skill.name}</p>
                        </Link>
                      ))}
                  </div>
                </section>
              );
            })}
      </div>
    </NorskPromptingShell>
  );
}
