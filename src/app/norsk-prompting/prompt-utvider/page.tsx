import PromptExpanderClient from "../_components/PromptExpanderClient";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Prompt Hjelper | Norsk Prompting",
  description:
    "Skriv ideen din med vanlige ord og berik teksten med mediefaglige begreper som hjelper tekstmodeller å lage bedre prompter.",
  path: "/norsk-prompting/prompt-utvider",
});

export default function PromptUtviderPage() {
  const description =
    "Erfarne folk i mediebransjen får ofte bedre resultater fra KI modeller fordi de kan beskrive ønsket uttrykk presist med riktige fagbegreper. Prompt Hjelper gjør den samme presisjonen tilgjengelig for deg som ikke har den erfaringen ennå, slik at du får mer kontroll, bedre detaljer og en mer produksjonsklar prompt. Verktøyet lager ikke en ferdig pro-prompt, men beriker forklaringen din med mediefaglige begreper som gjør at tekstmodeller kan bygge bedre prompter.";

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
