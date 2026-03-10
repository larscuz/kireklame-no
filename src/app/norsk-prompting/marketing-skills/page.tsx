import Link from "next/link";
import { marketingSkills, runtimeCounts } from "@/data/norskPrompting/runtime";
import type { MarketingSkillCategory } from "@/data/norskPrompting/types";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import SearchPanel from "../_components/SearchPanel";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Marketing Skills | Norsk Prompting",
  description:
    "Utforsk 32 markedsføringsferdigheter for digital markedsføring, CRO, SEO, innhold, betalte annonser og mer. Komplett kunnskapsbase for markedsførere.",
  path: "/norsk-prompting/marketing-skills",
});

const categoryLabel: Record<MarketingSkillCategory, string> = {
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
};

const categoryOrder: MarketingSkillCategory[] = [
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
];

export default function MarketingSkillsPage() {
  const grouped = marketingSkills.reduce<Record<string, typeof marketingSkills>>((acc, skill) => {
    const key = skill.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  const searchItems = marketingSkills.map((skill) => ({
    type: "marketing" as const,
    title: skill.title_no,
    description: skill.description_no,
    href: `/norsk-prompting/marketing-skills/${skill.slug}`,
  }));

  const description =
    "Komplett kunnskapsbase med 32 markedsføringsferdigheter — fra CRO og SEO til innholdsstrategi og betalt annonsering.";

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/marketing-skills"
      title="Marketing Skills"
      description={description}
      jsonLd={[
        buildArticleJsonLd({
          headline: "Marketing Skills — Markedsføringskunnskaper",
          description,
          path: "/norsk-prompting/marketing-skills",
          dateModified: "2026-03-08",
        }),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "Marketing Skills", item: absoluteUrl("/norsk-prompting/marketing-skills") },
        ]),
      ]}
    >
      <section className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/88 p-5 md:p-6">
        <p className="text-sm leading-relaxed text-[rgb(var(--muted))]">
          Denne kunnskapsbasen inneholder 32 markedsføringsferdigheter hentet fra
          open-source-prosjektet MarketingSkills. Hver ferdighet dekker et spesifikt
          område innen digital markedsføring med rammeverk, beste praksis og konkrete
          retningslinjer.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">
          Registrert: {runtimeCounts.marketingSkillsRegistered} ferdigheter
          {runtimeCounts.marketingSkillsDisplayed !== runtimeCounts.marketingSkillsRegistered
            ? ` · Viser ${runtimeCounts.marketingSkillsDisplayed} unike`
            : ""}
        </p>
      </section>

      <SearchPanel items={searchItems} showResultsOnEmptyQuery={false} />

      <div className="space-y-4">
        {categoryOrder
          .filter((cat) => grouped[cat]?.length)
          .map((category) => {
            const skills = grouped[category]!;
            return (
              <section
                key={category}
                className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7"
              >
                <h2 className="text-xl font-semibold tracking-tight">
                  {categoryLabel[category]}
                </h2>
                <p className="mt-1 text-sm text-[rgb(var(--muted))]">{skills.length} ferdigheter</p>
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
