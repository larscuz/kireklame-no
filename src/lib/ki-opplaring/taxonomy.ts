export const KI_OPPLARING_TOPICS = [
  "KI i markedsføring",
  "KI video",
  "KI bilde",
  "KI lyd",
  "Prompting",
  "Workflow",
  "KI strategi",
  "KI juridisk",
  "KI i offentlig sektor",
] as const;

export const KI_OPPLARING_LEVELS = ["beginner", "intermediate", "pro"] as const;

export const KI_OPPLARING_AUDIENCES = ["SMB", "Byrå", "Innholdsprodusent", "Offentlig"] as const;

export const KI_OPPLARING_TOOLS = [
  "Runway",
  "Veo",
  "Kling",
  "Freepik",
  "ElevenLabs",
  "HeyGen",
  "Midjourney",
  "Firefly",
] as const;

export type KiOpplaringLevel = (typeof KI_OPPLARING_LEVELS)[number];
