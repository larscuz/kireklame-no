export type KiTemplate = {
  id: string;
  title: string;
  description: string;
  content: string;
  audiences: Array<"SMB" | "Byrå" | "Innholdsprodusent" | "Offentlig">;
};

export const kiTemplates: Record<string, KiTemplate> = {
  "ki-brief-v1": {
    id: "ki-brief-v1",
    title: "KI-brief v1",
    description: "Kort brief med kontekst, visuell retning og tekniske regler.",
    audiences: ["Byrå", "Innholdsprodusent", "SMB"],
    content: `Målgruppe: [hvem]
Kanal: [SoMe / nettside / presentasjon]
Format: [16:9 / 9:16 / 1:1]
Stemning: [3-5 stikkord]
Visuell stil: [realistisk / illustrativ / filmatisk]
First frame: [beskrivelse]
Last frame: [beskrivelse]
Bevegelsesregler: [kamera + tempo]
Må ikke endres: [objekter/logo/geometri]
Leveranse: [hva som skal leveres]`,
  },
  "video-konsistens-v1": {
    id: "video-konsistens-v1",
    title: "Video-konsistens prompt",
    description: "Template for first/last + fysisk plausibel overgang.",
    audiences: ["Byrå", "Innholdsprodusent"],
    content: `Create a cinematic shot with stable geometry.
First frame: [describe exact composition]
Last frame: [describe exact composition]
Camera: [slow dolly/pan/tilt]
Motion constraints: no new objects, no deformation, maintain logo integrity.
Lighting: [consistent/natural]
Color: avoid oversaturation.
Output: [duration + aspect ratio]`,
  },
  "leveranse-sjekk-v1": {
    id: "leveranse-sjekk-v1",
    title: "Leveranse-sjekk",
    description: "Sjekkpunkter før du sender AI-generert materiell til kunde.",
    audiences: ["Byrå", "SMB", "Offentlig"],
    content: `1) Stemmer budskap med brief?
2) Er merkevareelementer konsistente?
3) Er tekst og logo uten deformasjon?
4) Er påstander faktasjekket?
5) Er rettigheter/bruksvilkår kontrollert?
6) Er leveransen dokumentert (prompt + versjon + modell)?`,
  },
};

export const topTemplateIds = ["ki-brief-v1", "video-konsistens-v1", "leveranse-sjekk-v1"];

export function getTemplateById(templateId: string): KiTemplate | null {
  return kiTemplates[templateId] ?? null;
}
