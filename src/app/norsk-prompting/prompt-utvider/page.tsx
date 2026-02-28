import PromptExpanderClient from "../_components/PromptExpanderClient";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Prompt-utvider for KI-skole | Norsk Prompting",
  description:
    "Bruk Prompt-utvider i KI-skole og Norsk Prompting for å trene prompting i praksis. Skriv en idé og få et sterkere utgangspunkt for KI undervisning, mediefag og generativ produksjon.",
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
      <section className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/88 p-5 md:p-6">
        <p className="text-sm leading-relaxed text-[rgb(var(--muted))]">
          Prompt-utvider er laget for KI undervisning og prompting i praksis, der
          elever kan gå fra enkel idé til mer presis prompt-teknikk. Verktøyet er
          nyttig i KI-skole, generativ KI-arbeid og mediefag når du vil forbedre
          beskrivelser for bilde, video og tekst.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">
          Bruk det som et konkret undervisningsopplegg for å vise hvordan språk,
          begrepsbruk og iterasjon påvirker kvaliteten i output fra KI-verktøy.
        </p>
      </section>

      <PromptExpanderClient />
    </NorskPromptingShell>
  );
}
