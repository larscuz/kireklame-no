import FreeModelsRankingBoard from "../_components/FreeModelsRankingBoard";
import type {
  FreeModelRankingCategory,
  FreeModelRankingCategoryId,
  FreeModelRankingSignals,
} from "../_components/FreeModelsRankingTypes";
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
  {
    name: "Fotor AI Image Generator",
    href: "https://www.fotor.com/ai-image-generator/",
    note: "Gratisnivå kan være tilgjengelig.",
  },
  {
    name: "Picsart AI Image Generator",
    href: "https://picsart.com/ai-image-generator/",
    note: "Gratisnivå kan være tilgjengelig.",
  },
  {
    name: "Copilot Designer",
    href: "https://copilot.microsoft.com/images/create",
    note: "Gratis tilgang med konto.",
  },
  {
    name: "Canva AI Image Generator",
    href: "https://www.canva.com/ai-image-generator/",
    note: "Gratisnivå kan være tilgjengelig.",
  },
  { name: "Mage", href: "https://www.mage.space/", note: "Gratisnivå tilgjengelig." },
  { name: "getimg.ai", href: "https://getimg.ai/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Clipdrop", href: "https://clipdrop.co/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Playground", href: "https://playground.com/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Freepik AI", href: "https://www.freepik.com/ai", note: "Gratis bruk med begrensninger." },
];

const videoModels: ModelLink[] = [
  {
    name: "Google Flow",
    href: "https://labs.google/fx/tools/flow",
    note: "Google Labs-verktøy; gratisnivå/krav varierer.",
  },
  { name: "Kling AI", href: "https://klingai.com/", note: "Gratis kreditter kan være tilgjengelig." },
  {
    name: "Runway",
    href: "https://app.runwayml.com/",
    note: "Gratisnivå kan være tilgjengelig med begrensninger.",
  },
  { name: "Pika", href: "https://pika.art/", note: "Gratisnivå tilgjengelig." },
  {
    name: "Luma Dream Machine",
    href: "https://dream-machine.lumalabs.ai/",
    note: "Gratisnivå tilgjengelig.",
  },
  { name: "Sora", href: "https://openai.com/sora", note: "Tilgjengelighet varierer etter plan/region." },
  { name: "Pollo AI", href: "https://pollo.ai/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "Hedra", href: "https://www.hedra.com/", note: "Gratisnivå kan være tilgjengelig." },
  { name: "InVideo AI", href: "https://ai.invideo.io/", note: "Gratisnivå kan være tilgjengelig." },
  {
    name: "VEED AI Video",
    href: "https://www.veed.io/tools/ai-video/ai-video-maker",
    note: "Gratisnivå kan være tilgjengelig.",
  },
  {
    name: "CapCut AI Video",
    href: "https://www.capcut.com/tools/ai-video-maker/",
    note: "Gratisnivå kan være tilgjengelig.",
  },
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
  {
    name: "Google MusicFX",
    href: "https://labs.google/fx/tools/music-fx",
    note: "Tilgjengelighet varierer etter region.",
  },
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

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const baseSignalsByCategory: Record<FreeModelRankingCategoryId, FreeModelRankingSignals> = {
  text: {
    serpVisibility: 72,
    platformTrust: 72,
    freeTierStrength: 74,
    momentum: 70,
    reliability: 74,
    communityDemand: 71,
  },
  image: {
    serpVisibility: 66,
    platformTrust: 68,
    freeTierStrength: 70,
    momentum: 69,
    reliability: 70,
    communityDemand: 68,
  },
  video: {
    serpVisibility: 64,
    platformTrust: 67,
    freeTierStrength: 65,
    momentum: 74,
    reliability: 66,
    communityDemand: 72,
  },
  audio: {
    serpVisibility: 60,
    platformTrust: 64,
    freeTierStrength: 68,
    momentum: 67,
    reliability: 66,
    communityDemand: 63,
  },
};

const signalProfiles: Array<{ pattern: RegExp; delta: Partial<FreeModelRankingSignals> }> = [
  {
    pattern: /(chatgpt|openai|sora|runway|gemini|google|microsoft|copilot|meta ai|claude|anthropic)/i,
    delta: { serpVisibility: 18, platformTrust: 14, communityDemand: 12, reliability: 10 },
  },
  {
    pattern: /(kling|pika|luma|vidu|pixverse|haiper|ideogram|leonardo|firefly|elevenlabs|suno|udio)/i,
    delta: { momentum: 10, communityDemand: 8, platformTrust: 6, serpVisibility: 6 },
  },
  {
    pattern: /(openrouter|hugging|deepseek|qwen|kimi|z\.ai|duck\.ai|mistral|perplexity)/i,
    delta: { freeTierStrength: 7, communityDemand: 6, momentum: 4, serpVisibility: 3 },
  },
  {
    pattern: /(labs\.google|beta|preview)/i,
    delta: { momentum: 6, reliability: -5, freeTierStrength: -4 },
  },
  {
    pattern: /(dream-machine|stableaudio|aiva|mubert|boomy|riffusion|sonauto|musicfx)/i,
    delta: { momentum: 5, freeTierStrength: 3 },
  },
];

function applyDelta(
  base: FreeModelRankingSignals,
  delta: Partial<FreeModelRankingSignals>
): FreeModelRankingSignals {
  return {
    serpVisibility: clampScore(base.serpVisibility + (delta.serpVisibility ?? 0)),
    platformTrust: clampScore(base.platformTrust + (delta.platformTrust ?? 0)),
    freeTierStrength: clampScore(base.freeTierStrength + (delta.freeTierStrength ?? 0)),
    momentum: clampScore(base.momentum + (delta.momentum ?? 0)),
    reliability: clampScore(base.reliability + (delta.reliability ?? 0)),
    communityDemand: clampScore(base.communityDemand + (delta.communityDemand ?? 0)),
  };
}

function deriveSignals(categoryId: FreeModelRankingCategoryId, item: ModelLink): FreeModelRankingSignals {
  let signals = { ...baseSignalsByCategory[categoryId] };
  const fingerprint = `${item.name} ${item.href}`.toLowerCase();
  const note = item.note.toLowerCase();

  for (const profile of signalProfiles) {
    if (profile.pattern.test(fingerprint)) {
      signals = applyDelta(signals, profile.delta);
    }
  }

  if (note.includes("varierer")) {
    signals = applyDelta(signals, { freeTierStrength: -11, reliability: -6 });
  }
  if (note.includes("begrens")) {
    signals = applyDelta(signals, { freeTierStrength: -9 });
  }
  if (note.includes("kreditter")) {
    signals = applyDelta(signals, { freeTierStrength: -4, momentum: 3 });
  }
  if (note.includes("region")) {
    signals = applyDelta(signals, { freeTierStrength: -10, reliability: -5 });
  }
  if (note.includes("open-source")) {
    signals = applyDelta(signals, { freeTierStrength: 8, communityDemand: 7 });
  }
  if (note.includes("gratisnivå tilgjengelig") || note.includes("gratis tilgang")) {
    signals = applyDelta(signals, { freeTierStrength: 7 });
  }

  if (item.href.includes("labs.google")) {
    signals = applyDelta(signals, { momentum: 5, reliability: -3 });
  }

  return signals;
}

function buildCategory(
  id: FreeModelRankingCategoryId,
  title: string,
  items: ModelLink[]
): FreeModelRankingCategory {
  return {
    id,
    title,
    items: items.map((item, index) => {
      const slug = slugify(item.name) || `model-${index + 1}`;
      return {
        id: `${id}-${slug}`,
        name: item.name,
        href: item.href,
        note: item.note,
        signals: deriveSignals(id, item),
      };
    }),
  };
}

const rankingCategories: FreeModelRankingCategory[] = [
  buildCategory("text", "TEKT", textModels),
  buildCategory("image", "BILDE", imageModels),
  buildCategory("video", "VIDEO", videoModels),
  buildCategory("audio", "LYD", audioModels),
];

export const metadata = siteMeta({
  title: "KI-verktøy for KI-skole | Norsk Prompting",
  description:
    "Finn KI-verktøy for KI-skole, prompting og undervisning i Norsk Prompting. Siden samler tekst-, bilde-, video- og lydverktøy som kan brukes i mediefag og generativ praksis.",
  path: "/norsk-prompting/changelog",
});

export default function NorskPromptingChangelogPage() {
  const description =
    "Direktelenker til tekst-, bilde-, video- og lydmodeller du kan teste med gratisnivå eller gratis kreditter. Tilgjengelighet og vilkår kan endres.";

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/changelog"
      title="KI-verktøy"
      description={description}
      jsonLd={[
        buildArticleJsonLd({
          headline: "KI-verktøy for Norsk Prompting",
          description,
          path: "/norsk-prompting/changelog",
          dateModified: "2026-02-26",
        }),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "KI-verktøy", item: absoluteUrl("/norsk-prompting/changelog") },
        ]),
      ]}
    >
      <section className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/88 p-5 md:p-6">
        <p className="text-sm leading-relaxed text-[rgb(var(--muted))]">
          KI-verktøy-siden gir en oversikt over modeller som kan brukes i KI-skole,
          prompting og undervisning i praksis. Her finner du tekst-, bilde-, video-
          og lydverktøy som passer til generativ KI og mediefaglige arbeidsflyter.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">
          Målet er å gjøre det enklere for lærere og elever å velge riktige verktøy
          når de bygger undervisningsopplegg eller tester prompt-teknikk i ulike
          produksjonsformer.
        </p>
      </section>

      <article className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4 pt-7 text-white shadow-[0_10px_30px_rgba(2,6,23,0.35)]">
        <p className="text-sm text-zinc-200">
          Merk: gratisnivå, kreditter og regiontilgang kan endres av leverandørene over tid.
        </p>
      </article>

      <FreeModelsRankingBoard categories={rankingCategories} snapshotLabel="26. februar 2026" />
    </NorskPromptingShell>
  );
}
