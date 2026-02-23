import type { PromptDomain, PromptLength, PromptOutputType, PromptStyle } from "@/data/norskPrompting/types";

export const outputTypeOptions: Array<{ value: PromptOutputType; label: string }> = [
  { value: "image", label: "Bilde" },
  { value: "video", label: "Video" },
  { value: "text", label: "Tekst" },
];

export const domainOptions: Array<{ value: PromptDomain; label: string }> = [
  { value: "film-vfx", label: "Film / VFX" },
  { value: "arkitektur", label: "Arkitektur" },
  { value: "produkt", label: "Produkt" },
  { value: "dokumentar", label: "Dokumentar" },
  { value: "sosiale-medier", label: "Sosiale medier" },
  { value: "historisk", label: "Historisk" },
  { value: "redaksjonell", label: "Redaksjonell" },
  { value: "design-system", label: "Design-system" },
];

export const styleOptions: Array<{ value: PromptStyle; label: string }> = [
  { value: "noktern", label: "Nøktern" },
  { value: "filmatisk", label: "Filmatisk" },
  { value: "dokumentar", label: "Dokumentar" },
  { value: "reklame", label: "Reklame" },
  { value: "arkitektonisk", label: "Arkitektonisk" },
  { value: "historisk-presis", label: "Historisk presis" },
];

export const lengthOptions: Array<{ value: PromptLength; label: string }> = [
  { value: "kort", label: "Kort" },
  { value: "medium", label: "Medium" },
  { value: "lang", label: "Lang" },
];

export const domainLabel: Record<PromptDomain, string> = {
  "film-vfx": "film og VFX",
  arkitektur: "arkitektur og rom",
  produkt: "produktvisualisering",
  dokumentar: "dokumentarisk produksjon",
  "sosiale-medier": "sosiale medier",
  historisk: "historisk rekonstruksjon",
  redaksjonell: "redaksjonell produksjon",
  "design-system": "design-system og UX",
};

export const styleLabel: Record<PromptStyle, string> = {
  noktern: "nøktern",
  filmatisk: "filmatisk med fysisk forankring",
  dokumentar: "dokumentarisk",
  reklame: "reklameorientert",
  arkitektonisk: "arkitektonisk presis",
  "historisk-presis": "historisk presis",
};
