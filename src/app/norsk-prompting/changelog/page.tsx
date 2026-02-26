import NorskPromptingShell from "../_components/NorskPromptingShell";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

type ModelLink = {
  name: string;
  href: string;
  note: string;
};

const textModels: ModelLink[] = [
  { name: "ChatGPT", href: "https://chatgpt.com/", note: "Gratisnivå tilgjengelig." },
  { name: "Gemini", href: "https://gemini.google.com/", note: "Gratisnivå tilgjengelig." },
  { name: "Claude", href: "https://claude.ai/", note: "Gratisnivå tilgjengelig." },
  { name: "Microsoft Copilot", href: "https://copilot.microsoft.com/", note: "Gratisnivå tilgjengelig." },
  { name: "Meta AI", href: "https://www.meta.ai/", note: "Gratisnivå tilgjengelig i støttede regioner." },
  { name: "Grok", href: "https://grok.com/", note: "Tilgjengelighet varierer etter plan/region." },
  { name: "Perplexity", href: "https://www.perplexity.ai/", note: "Gratisnivå tilgjengelig." },
  { name: "DeepSeek Chat", href: "https://chat.deepseek.com/", note: "Gratisnivå tilgjengelig." },
  { name: "Cohere Coral", href: "https://coral.cohere.com/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "OpenRouter Chat", href: "https://openrouter.ai/chat", note: "Gratismodeller kan være tilgjengelige." },
  { name: "Phind", href: "https://www.phind.com/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Character.AI", href: "https://character.ai/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Duck.ai", href: "https://duck.ai/", note: "Gratis privat AI-chat tilgjengelig." },
  { name: "Le Chat (Mistral)", href: "https://chat.mistral.ai/", note: "Gratisnivå tilgjengelig." },
  { name: "Poe", href: "https://poe.com/", note: "Gratisnivå tilgjengelig." },
  { name: "You.com Chat", href: "https://you.com/home", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Pi", href: "https://pi.ai/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "HuggingChat", href: "https://huggingface.co/chat/", note: "Gratis tilgang til open-source modeller." },
  { name: "Kimi", href: "https://www.kimi.com/", note: "Gratisnivå tilgjengelig." },
  { name: "Z.AI Chat", href: "https://chat.z.ai/", note: "Gratisnivå tilgjengelig." },
  { name: "Qwen Chat", href: "https://chat.qwen.ai/", note: "Gratisnivå tilgjengelig." },
];

const imageModels: ModelLink[] = [
  { name: "ChatGPT Images", href: "https://chatgpt.com/", note: "Bildemodell i ChatGPT med gratisbegrensning." },
  { name: "Gemini / Imagen", href: "https://aistudio.google.com/", note: "Gratis brukskvoter kan være tilgjengelig." },
  { name: "Adobe Firefly", href: "https://firefly.adobe.com/", note: "Gratis kreditter kan være tilgjengelig." },
  { name: "Leonardo", href: "https://app.leonardo.ai/", note: "Gratis kreditter tilgjengelig." },
  { name: "Ideogram", href: "https://ideogram.ai/", note: "Gratisnivå tilgjengelig." },
  { name: "Recraft", href: "https://www.recraft.ai/", note: "Gratisnivå tilgjengelig." },
  { name: "Tensor.Art", href: "https://tensor.art/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "SeaArt AI", href: "https://www.seaart.ai/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "NightCafe Creator", href: "https://creator.nightcafe.studio/", note: "Gratis kreditter kan være tilgjengelig." },
  { name: "WOMBO Dream", href: "https://dream.ai/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Fotor AI Image Generator", href: "https://www.fotor.com/ai-image-generator/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Picsart AI Image Generator", href: "https://picsart.com/ai-image-generator/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Copilot Designer", href: "https://copilot.microsoft.com/images/create", note: "Gratis tilgang med konto." },
  { name: "Canva AI Image Generator", href: "https://www.canva.com/ai-image-generator/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Mage", href: "https://www.mage.space/", note: "Gratisnivå tilgjengelig." },
  { name: "getimg.ai", href: "https://getimg.ai/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Clipdrop", href: "https://clipdrop.co/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Playground", href: "https://playground.com/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Freepik AI", href: "https://www.freepik.com/ai", note: "Gratis bruk med begrensninger." },
];

const videoModels: ModelLink[] = [
  { name: "Google Flow", href: "https://labs.google/fx/tools/flow", note: "Google Labs-verktøy; gratisnivå/krav varierer." },
  { name: "Kling AI", href: "https://klingai.com/", note: "Gratis kreditter kan være tilgjengelig." },
  { name: "Runway", href: "https://app.runwayml.com/", note: "Gratisnivå kan være tilgjengelig med begrensninger." },
  { name: "Pika", href: "https://pika.art/", note: "Gratisnivå tilgjengelig." },
  { name: "Luma Dream Machine", href: "https://dream-machine.lumalabs.ai/", note: "Gratisnivå tilgjengelig." },
  { name: "Sora", href: "https://openai.com/sora", note: "Tilgjengelighet varierer etter plan/region." },
  { name: "Pollo AI", href: "https://pollo.ai/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Hedra", href: "https://www.hedra.com/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "InVideo AI", href: "https://ai.invideo.io/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "VEED AI Video", href: "https://www.veed.io/tools/ai-video/ai-video-maker", note: "Gratisnivå kan være tilgjengelig." },
  { name: "CapCut AI Video", href: "https://www.capcut.com/tools/ai-video-maker/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "HeyGen", href: "https://www.heygen.com/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Hailuo AI", href: "https://hailuoai.video/", note: "Gratis kreditter kan være tilgjengelig." },
  { name: "PixVerse", href: "https://app.pixverse.ai/", note: "Gratisnivå tilgjengelig." },
  { name: "Haiper", href: "https://haiper.ai/", note: "Gratisnivå tilgjengelig." },
  { name: "Vidu", href: "https://www.vidu.com/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Krea Video", href: "https://www.krea.ai/video", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Kaiber", href: "https://kaiber.ai/", note: "Gratisnivå kan være tilgjengelig." },
];

const audioModels: ModelLink[] = [
  { name: "Sonauto", href: "https://sonauto.ai/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Google MusicFX", href: "https://labs.google/fx/tools/music-fx", note: "Tilgjengelighet varierer etter region." },
  { name: "Suno", href: "https://suno.com/", note: "Gratisnivå tilgjengelig." },
  { name: "Udio", href: "https://www.udio.com/", note: "Gratisnivå tilgjengelig." },
  { name: "ElevenLabs", href: "https://elevenlabs.io/", note: "Gratisnivå tilgjengelig." },
  { name: "Stable Audio", href: "https://stableaudio.com/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Beatoven.ai", href: "https://www.beatoven.ai/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Kits AI", href: "https://www.kits.ai/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Loudly", href: "https://www.loudly.com/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Soundful", href: "https://soundful.com/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Uberduck", href: "https://www.uberduck.ai/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "AIVA", href: "https://www.aiva.ai/", note: "Gratis plan tilgjengelig." },
  { name: "Mubert", href: "https://mubert.com/render", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Boomy", href: "https://boomy.com/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Riffusion", href: "https://www.riffusion.com/", note: "Gratisnivå kan være tilgjengelig." },
];

export const metadata = siteMeta({
  title: "Gratis modeller | Norsk Prompting",
  description: "Lenker til store tekst-, bilde-, video- og lydmodeller med gratisnivå eller gratis kreditter.",
  path: "/norsk-prompting/changelog",
});

function ModelSection({ title, items }: { title: string; items: ModelLink[] }) {
  return (
    <article className="np-node-surface min-w-0 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7 shadow-[0_10px_30px_rgba(2,6,23,0.18)]">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="block w-full overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 px-3 py-2 transition hover:border-zinc-300/40 hover:bg-zinc-300/08"
          >
            <p className="text-sm font-semibold text-[rgb(var(--fg))]">{item.name}</p>
            <p className="mt-1 break-all text-xs text-[rgb(var(--muted))]">{item.href}</p>
            <p className="mt-1 text-xs text-[rgb(var(--muted))]">{item.note}</p>
          </a>
        ))}
      </div>
    </article>
  );
}

export default function NorskPromptingChangelogPage() {
  const description =
    "Direktelenker til tekst-, bilde-, video- og lydmodeller du kan teste med gratisnivå eller gratis kreditter. Tilgjengelighet og vilkår kan endres.";

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/changelog"
      title="Gratis modeller"
      description={description}
      jsonLd={[
        buildArticleJsonLd({
          headline: "Gratis modeller for Norsk Prompting",
          description,
          path: "/norsk-prompting/changelog",
          dateModified: "2026-02-26",
        }),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "Gratis modeller", item: absoluteUrl("/norsk-prompting/changelog") },
        ]),
      ]}
    >
      <article className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
        <p className="text-sm text-[rgb(var(--fg))]/90">
          Merk: gratisnivå, kreditter og regiontilgang kan endres av leverandørene over tid.
        </p>
      </article>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ModelSection title="TEKT" items={textModels} />
        <ModelSection title="BILDE" items={imageModels} />
        <ModelSection title="VIDEO" items={videoModels} />
        <ModelSection title="LYD" items={audioModels} />
      </div>
    </NorskPromptingShell>
  );
}
