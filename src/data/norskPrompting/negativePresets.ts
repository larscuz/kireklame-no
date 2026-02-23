export type NegativePreset = {
  id: string;
  title: string;
  description: string;
  items: string[];
};

export const negativePresets: NegativePreset[] = [
  {
    id: "preset-a-ingen-endringer",
    title: "Ingen endringer",
    description: "For referanselåste jobber der scene, identitet og geometri skal bevares.",
    items: [
      "Ikke legg til objekter",
      "Ikke fjern objekter",
      "Ikke endre ansikt",
      "Ikke endre tekst",
      "Ikke endre bakgrunn",
      "Ikke endre arkitektur",
      "Ikke moderniser",
      "Ingen stilfilter",
      "Ingen ekstra effekter",
      "Ingen hallusinerte detaljer",
    ],
  },
  {
    id: "preset-b-anti-ai-look",
    title: "Anti-AI-look",
    description: "For profesjonell output uten plastisk eller overprosessert preg.",
    items: [
      "Ingen plast-hud",
      "Ingen beauty filter",
      "Ingen overdrevet skarphet",
      "Ingen falske flares",
      "Ingen falsk filmkorn-overlay",
      "Ingen tegne-look",
      "Ingen CGI-look",
      "Ingen anime-stil",
      "Ingen watercolor-stil",
      "Ingen illustrative filter",
    ],
  },
  {
    id: "preset-c-video-kontinuitet",
    title: "Video-kontinuitet",
    description: "For sekvenser der temporal stabilitet og fysisk logikk er kritisk.",
    items: [
      "Ingen magisk forsvinning",
      "Ingen spontan materialendring",
      "Ingen skala-hopp",
      "Ingen lys-hopp",
      "Ingen bakgrunnsmorfing",
      "Ingen ekstra lemmer",
      "Ingen deformerte hender",
      "Ingen identitetsdrift",
    ],
  },
];

export const negativePresetsById = Object.fromEntries(
  negativePresets.map((entry) => [entry.id, entry])
);
