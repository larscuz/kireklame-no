import type { KiEntryType } from "@/lib/ki-opplaring/keys";

export type LearningPathId = "beginner" | "intermediate" | "pro";

export type LearningPathItem = {
  type: KiEntryType;
  slug: string;
  title: string;
};

export type LearningPath = {
  id: LearningPathId;
  title: string;
  description: string;
  items: LearningPathItem[];
};

export const learningPaths: Record<LearningPathId, LearningPath> = {
  beginner: {
    id: "beginner",
    title: "Nybegynner",
    description: "Grunnmur for praktisk KI-bruk i kreativ produksjon.",
    items: [
      { type: "guide", slug: "start-her-ki-i-reklame-2026", title: "Start her" },
      { type: "guide", slug: "ki-brief-som-fungerer", title: "Skriv KI-brief" },
      { type: "glossary", slug: "hallusinasjon", title: "Forstå hallusinasjon" },
      { type: "glossary", slug: "consistency-lock", title: "Consistency lock" },
      { type: "tool", slug: "freepik", title: "Freepik i praksis" },
      { type: "tema", slug: "ki-i-markedsforing", title: "Tema: KI i markedsføring" },
    ],
  },
  intermediate: {
    id: "intermediate",
    title: "Viderekommen",
    description: "Stabil produksjon, bedre prompting og tydeligere workflow.",
    items: [
      { type: "guide", slug: "prompting-for-video-konsistens", title: "Video-konsistens" },
      { type: "glossary", slug: "first-last-metoden", title: "First/Last-metoden" },
      { type: "glossary", slug: "negativ-prompt", title: "Negativ prompt" },
      { type: "glossary", slug: "prompt-kjede", title: "Prompt-kjede" },
      { type: "tool", slug: "runway", title: "Runway workflow" },
      { type: "tema", slug: "prompting", title: "Tema: Prompting" },
    ],
  },
  pro: {
    id: "pro",
    title: "Pro",
    description: "Operativ kvalitetssikring og leveranselogikk for byrå/produksjon.",
    items: [
      { type: "tema", slug: "ki-video", title: "Tema: KI-video" },
      { type: "guide", slug: "ki-brief-som-fungerer", title: "Presis briefing" },
      { type: "guide", slug: "prompting-for-video-konsistens", title: "Visuell stabilitet" },
      { type: "tool", slug: "runway", title: "Runway i pipeline" },
      { type: "tool", slug: "freepik", title: "Freepik variantproduksjon" },
      { type: "glossary", slug: "prompt-kjede", title: "Prompt-kjede i team" },
    ],
  },
};
