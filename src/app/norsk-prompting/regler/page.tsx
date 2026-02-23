import { norskPromptingGovernanceRules } from "@/data/norskPrompting/governanceRules";
import { norskPromptingRules } from "@/data/norskPrompting/runtime";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Regler | Norsk Prompting",
  description:
    "Maskinlesbare regler for konsistens, kamera, komposisjon, fysikk og produksjonslogikk i Norsk Prompting.",
  path: "/norsk-prompting/regler",
});

export default function NorskPromptingReglerPage() {
  const gjelderLabel = {
    all: "alle",
    image: "bilde",
    video: "video",
    text: "tekst",
  } as const;

  const grouped = norskPromptingRules.reduce<Record<string, typeof norskPromptingRules>>((acc, rule) => {
    const key = rule.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(rule);
    return acc;
  }, {});

  const categories = Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0], "nb-NO"));
  const description = "Regelsettet brukes direkte i prompt-utvideren og kan utvides fortløpende.";

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/regler"
      title="Norsk Prompting-regler"
      description={description}
      jsonLd={[
        buildArticleJsonLd({
          headline: "Norsk Prompting-regler",
          description,
          path: "/norsk-prompting/regler",
          dateModified: "2026-02-23",
        }),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "Regler", item: absoluteUrl("/norsk-prompting/regler") },
        ]),
      ]}
    >
      <div className="space-y-4">
        {categories.map(([category, rules]) => (
          <section key={category} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <h2 className="text-xl font-semibold tracking-tight">{category}</h2>
            <ul className="mt-3 space-y-3">
              {rules
                .sort((a, b) => b.severity - a.severity)
                .map((rule) => (
                  <li id={rule.id} key={rule.id} className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3 scroll-mt-24">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{rule.name}</p>
                      <span className="rounded-full border border-cyan-300/35 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cyan-100">
                        alvorlighet {rule.severity}
                      </span>
                      <span className="rounded-full border border-[rgb(var(--border))] px-2 py-0.5 text-[11px] uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                        gjelder {gjelderLabel[rule.appliesTo]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[rgb(var(--muted))]">{rule.description}</p>
                    <p className="mt-2 text-sm"><strong>Legges til prompt:</strong> {rule.addToPrompt}</p>
                    <p className="mt-1 text-sm"><strong>Negativt tillegg:</strong> {rule.negativeAdd}</p>
                  </li>
                ))}
            </ul>
          </section>
        ))}

        <section className="rounded-2xl border border-amber-300/35 bg-amber-500/10 p-4">
          <h2 className="text-xl font-semibold tracking-tight">Systemregler for dataintegritet</h2>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Disse reglene styrer innlegging av nye data og hindrer semantisk duplisering i databasen.
          </p>

          <ul className="mt-3 space-y-3">
            {norskPromptingGovernanceRules.map((rule) => (
              <li
                id={rule.id}
                key={rule.id}
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3 scroll-mt-24"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{rule.name}</p>
                  <span className="rounded-full border border-amber-300/40 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-amber-100">
                    {rule.severity}
                  </span>
                  <span className="rounded-full border border-[rgb(var(--border))] px-2 py-0.5 text-[11px] uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                    {rule.category}
                  </span>
                </div>

                <p className="mt-2 text-sm text-[rgb(var(--muted))]">{rule.description}</p>
                <p className="mt-2 text-sm">
                  <strong>Gjelder:</strong> {rule.appliesTo.join(", ")}
                </p>
                <p className="mt-1 text-sm">
                  <strong>Håndheving:</strong> {rule.enforcementLogic}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </NorskPromptingShell>
  );
}
