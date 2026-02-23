import PromptExpanderClient from "../_components/PromptExpanderClient";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Prompt-utvider | Norsk Prompting",
  description:
    "Kort norsk beskrivelse blir til lang pro-prompt med fast struktur, regellås og terminologi fra Norsk Prompting.",
  path: "/norsk-prompting/prompt-utvider",
});

export default function PromptUtviderPage() {
  const description =
    "Skriv en kort norsk hensikt. Velg output-type, domene og stil. Norsk Prompting bygger en forutsigbar prompt med samme seksjonsstruktur hver gang.";

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/prompt-utvider"
      title="Prompt-utvider"
      description={description}
      jsonLd={[
        buildWebPageJsonLd("Prompt-utvider", "/norsk-prompting/prompt-utvider", description),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "Prompt-utvider", item: absoluteUrl("/norsk-prompting/prompt-utvider") },
        ]),
      ]}
    >
      <PromptExpanderClient />
    </NorskPromptingShell>
  );
}
