import PromptExpanderClient from "../_components/PromptExpanderClient";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Prompt Hjelper | Norsk Prompting",
  description:
    "Skriv ideen din med vanlige ord og få en ferdig pro-prompt med mediefaglige begreper for bilde, video eller tekst.",
  path: "/norsk-prompting/prompt-utvider",
});

export default function PromptUtviderPage() {
  const description =
    "Skriv ideen din med vanlige ord. Prompt Hjelper oversetter den til en ferdig pro-prompt med riktige fagbegreper innen kamera, lys, komposisjon, lyd og stil. Klar til å kopieres rett inn i KI-verktøyet ditt.";

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/prompt-utvider"
      title="Prompt Hjelper – for medieelever"
      description={description}
      jsonLd={[
        buildWebPageJsonLd("Prompt Hjelper", "/norsk-prompting/prompt-utvider", description),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "Prompt Hjelper", item: absoluteUrl("/norsk-prompting/prompt-utvider") },
        ]),
      ]}
    >
      <PromptExpanderClient />
    </NorskPromptingShell>
  );
}
