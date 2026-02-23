import { norskPromptingGovernanceRules } from "@/data/norskPrompting/governanceRules";
import { norskPromptingRules } from "@/data/norskPrompting/runtime";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import RulesWorkbench from "../_components/RulesWorkbench";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Regler | Norsk Prompting",
  description:
    "Maskinlesbare regler for konsistens, kamera, komposisjon, fysikk og produksjonslogikk i Norsk Prompting.",
  path: "/norsk-prompting/regler",
});

export default function NorskPromptingReglerPage() {
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
      <RulesWorkbench rules={norskPromptingRules} governanceRules={norskPromptingGovernanceRules} />
    </NorskPromptingShell>
  );
}
