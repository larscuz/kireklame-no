import type { PromptDomain, PromptOutputType } from "./types";

export type OperativeExampleTerm = {
  term: string;
  slug?: string;
  note?: string;
};

export type OperativeExample = {
  slug: string;
  title: string;
  modelName: string;
  outputType: PromptOutputType;
  domain: PromptDomain;
  shortBrief: string;
  briefing: string;
  promptSource: string;
  terms: OperativeExampleTerm[];
  unambiguousTerms: string[];
  finishedPrompt: string;
  resultImage: {
    src: string;
    alt: string;
    caption: string;
    isPlaceholder?: boolean;
  };
  analysis: {
    precisionDrivers: string[];
    modelResponse: string[];
    possibleImprovements: string[];
  };
  expanderSeedInput: string;
  updatedAt: string;
};

const architecturePrompt = `Create a high-resolution advertising architecture visualization in exploded axonometric orthographic projection.

Context and purpose:
Editorial campaign image for a premium residential project where the structural logic must be legible for design and sales teams.

Main subject:
A contemporary townhouse split into clean exploded layers. Keep all facade geometry and floor heights physically plausible and consistent.
Exterior materials: brushed steel framing, untreated oak cladding, matte concrete core.
Interior materials: light oak floors, warm plaster walls, dark steel stair spine.

Environment and spatial logic:
Neutral studio background with subtle depth separation.
Use architectural elevation discipline and orthographic projection behavior.
No dramatic perspective distortion.

Lighting:
Directional key light from left-front at 45 degrees.
Color temperature 5600K neutral daylight.
Softbox key + controlled rim light on edges.
Very light volumetric haze for depth readability.

Camera:
50mm prime framing equivalent.
Shallow depth of field only on the foremost exploded plane.
Preserve clear edge definition on structural layers.

Style and constraints:
Photorealistic editorial advertising style with crisp material response.
Do not alter geometry.
Preserve facade proportions exactly.
Keep all signage panels and text placeholders fully readable.`;

export const operativeExamples: OperativeExample[] = [
  {
    slug: "eksempel-01-arkitektur",
    title: "Eksempel 01 - Arkitektur",
    modelName: "Google Nano Banana Pro",
    outputType: "image",
    domain: "arkitektur",
    shortBrief: "Reklameorientert arkitekturvisualisering med eksplodert aksjonometri.",
    briefing: "Reklamevisualisering av bolig med interiør eksponert på utsiden, der geometri og materialitet skal være teknisk lesbar.",
    promptSource: "Prompt-utvider + manuell presisering av unambiguous terms for geometri, lys og kamera.",
    terms: [
      { term: "Explodert aksjonometri", slug: "explodert-aksjonometri-arch" },
      { term: "Arkitektonisk elevasjon", slug: "arkitektonisk-elevasjon-arch" },
      { term: "Ortografisk projeksjon", slug: "ortografisk-projeksjon-arch" },
      { term: "Materialitet", slug: "materialitet-arch" },
      { term: "Lysretning", slug: "lysretning-photo", note: "Lys fra venstre 45 grader." },
      { term: "Fargetemperatur varm/kald", slug: "fargetemperatur-varm-kald-photo", note: "Låst til 5600K." },
      { term: "Grunn dybdeskarphet", slug: "grunn-dybdeskarphet-film" },
      { term: "50mm fast brennvidde", note: "Brukt som kameraconstraint i prompten." },
    ],
    unambiguousTerms: [
      "Exploded axonometric orthographic projection",
      "5600K neutral daylight",
      "50mm prime framing equivalent",
      "Do not alter geometry",
      "Preserve facade proportions exactly",
    ],
    finishedPrompt: architecturePrompt,
    resultImage: {
      src: "/norsk-prompting/examples/eksempel-01-arkitektur.svg",
      alt: "Explodert aksonometrisk visualisering av townhouse med synlig interiør og nøytral studiobakgrunn.",
      caption: "Illustrasjonsbilde (placeholder) for case-strukturen. Bytt med faktisk modellresultat ved produksjon.",
      isPlaceholder: true,
    },
    analysis: {
      precisionDrivers: [
        "Explodert aksjonometri hindret tilfeldig geometri ved å låse lagvis konstruksjonslogikk.",
        "Ortografisk projeksjon reduserte perspektivforvrengning og ga mer teknisk lesbar fasade.",
        "Presis Kelvin-verdi (5600K) ga nøytral reklameestetikk uten fargestikk.",
      ],
      modelResponse: [
        "Modellen responderte tydelig på materialitet (børstet stål, ubehandlet eik, matt betong).",
        "Bevaringsinstruksene stabiliserte proporsjoner og reduserte deformasjon mellom iterasjoner.",
        "Kamera- og dybdeskarphetsparametere ga kontrollert separasjon mellom eksploderte plan.",
      ],
      possibleImprovements: [
        "Legg inn eksakt lagavstand i meter for enda mer målbar eksplosjonsstruktur.",
        "Definer tekstpaneler med konkret innhold og fontrolle hvis typografi er kritisk leveransekrav.",
        "Presiser bakgrunnsluminans i EV-verdi ved behov for streng reproduksjon mellom flere bilder.",
      ],
    },
    expanderSeedInput:
      "Reklamevisualisering av boligprosjekt i eksplodert aksjonometri med ortografisk projeksjon, 5600K lys og 50mm kamera.",
    updatedAt: "2026-02-26",
  },
];

export const operativeExamplesBySlug = Object.fromEntries(
  operativeExamples.map((example) => [example.slug, example])
) as Record<string, OperativeExample>;
