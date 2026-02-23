import { slugify } from "@/lib/slug";
import type { PromptDomain, PromptExample, PromptOutputType } from "./types";

type ExampleSeed = {
  title: string;
  outputType: PromptOutputType;
  domain: PromptDomain;
  shortInput: string;
  focus: string;
  ruleIds: string[];
  termSlugs: string[];
};

const seeds: ExampleSeed[] = [
  {
    title: "Regnfull togstasjon med mobilrefleksjon",
    outputType: "image",
    domain: "film-vfx",
    shortInput: "Kvinne løper i regnfull togstasjon og mister mobilen i vanndam.",
    focus: "fysisk refleksjonslogikk og bevegelseskonsistens",
    ruleIds: ["fysikk-refleksjon-vinkel", "fysikk-regnlogikk", "kamera-brennvidde", "konsistens-scenelas"],
    termSlugs: ["temporal-coherence-ai", "tracking-film", "z-depth-vfx", "key-light-photo"],
  },
  {
    title: "15s reklamefilm for norsk SaaS",
    outputType: "video",
    domain: "sosiale-medier",
    shortInput: "Lag en kort reklamefilm for en norsk regnskapsapp i 9:16.",
    focus: "hook-benefit-cta med tydelig shotlogikk",
    ruleIds: ["produksjon-fremdrift", "kamera-bevegelsesregel", "kontinuitet-first-last", "komposisjon-fokuspunkt"],
    termSlugs: ["etableringsbilde-film", "dolly-film", "design-token-design", "guidance-scale-ai"],
  },
  {
    title: "Arkitektvisualisering av trebygg",
    outputType: "image",
    domain: "arkitektur",
    shortInput: "Vis et moderne trebygg med tydelig offentlig inngangsparti.",
    focus: "materialitet, skala og siktlinjer",
    ruleIds: ["realisme-materialrespons", "realisme-objektproporsjon", "komposisjon-lagdeling", "lys-fargetemperatur"],
    termSlugs: ["materialitet-arch", "siktlinje-arch", "skala-arch", "diffus-refleksjon-photo"],
  },
  {
    title: "Historisk scene: havn i 1890",
    outputType: "image",
    domain: "historisk",
    shortInput: "Lag en troverdig havnescene i Norge rundt 1890, tidlig morgen.",
    focus: "epokekontroll og materialtrohet",
    ruleIds: ["historisk-epokekontroll", "historisk-materialpalett", "realisme-fysisk-lys", "produksjon-ingen-magi"],
    termSlugs: ["hallusinasjon-ai", "materialitet-arch", "fargetemperatur-photo", "plate-vfx"],
  },
  {
    title: "Produktdemo med håndinteraksjon",
    outputType: "video",
    domain: "produkt",
    shortInput: "Vis en hånd som bruker en smart vannflaske i kontormiljø.",
    focus: "kontaktpunkter, materialrespons og kontrollert kamera",
    ruleIds: ["fysikk-kollisjon", "realisme-materialrespons", "kamera-dybdeskarphet", "konsistens-identitetslas"],
    termSlugs: ["specular-highlight-photo", "motion-vector-vfx", "narbilde-film", "referansebilde-ai"],
  },
  {
    title: "Dokumentarisk gateintervju",
    outputType: "video",
    domain: "dokumentar",
    shortInput: "Observasjonell scene av intervju på travel gate uten TV-estetikk.",
    focus: "troverdig håndholdt kamera uten stilisert grading",
    ruleIds: ["kamera-pov", "kamera-akseregel", "realisme-tyngdekraft", "konsistens-fargepalett"],
    termSlugs: ["handholdt-film", "hvitbalanse-photo", "grain-matching-vfx", "prompt-arkitektur-ai"],
  },
  {
    title: "Museumsrom med nordlysinstallasjon",
    outputType: "image",
    domain: "arkitektur",
    shortInput: "Innvendig museumsrom med lysinstallasjon inspirert av nordlys.",
    focus: "kontrollert lysdesign uten overmetning",
    ruleIds: ["lys-primarkilde", "lys-kontrastkontroll", "komposisjon-ledende-linjer", "konsistens-scenelas"],
    termSlugs: ["atrium-arch", "volumetrisk-lys-photo", "komponenttilstand-design", "control-map-ai"],
  },
  {
    title: "Redaksjonell forklaring av temporal coherence",
    outputType: "text",
    domain: "redaksjonell",
    shortInput: "Forklar temporal coherence på norsk for markedsavdeling.",
    focus: "presis fagterminologi og praktisk anvendelse",
    ruleIds: ["tekst-klar-rolle", "tekst-terminologikontroll", "produksjon-briefformat", "produksjon-qa-sjekk"],
    termSlugs: ["temporal-coherence-ai", "object-permanence-ai", "tilbakemeldingssloyfe-design", "shot-reverse-shot-film"],
  },
  {
    title: "Kampanjebilde av sportsutstyr i snø",
    outputType: "image",
    domain: "produkt",
    shortInput: "Vinterkampanje for løpesko i urbant snøvær.",
    focus: "snøpartikler, materialrespons og skala",
    ruleIds: ["fysikk-vindretning", "realisme-materialrespons", "komposisjon-tredjedelsregel", "realisme-fysisk-lys"],
    termSlugs: ["nd-filter-photo", "parallax-film", "denoise-vfx", "negative-prompt-ai"],
  },
  {
    title: "Historisk interiør med levende lys",
    outputType: "image",
    domain: "historisk",
    shortInput: "Interiørscene fra 1700-tallet med levende lys og trepanel.",
    focus: "historisk lyslogikk og materialpalett",
    ruleIds: ["historisk-epokekontroll", "historisk-kontekst", "lys-fargetemperatur", "realisme-materialrespons"],
    termSlugs: ["chiaroscuro-photo", "sokkel-arch", "maskering-design", "clean-plate-vfx"],
  },
  {
    title: "B2B forklaringsvideo med UI-overlay",
    outputType: "video",
    domain: "sosiale-medier",
    shortInput: "Lag en rolig B2B-forklaringsvideo med produktgrensesnitt i fokus.",
    focus: "lesbar tekst, UI-hierarki og stabil bevegelse",
    ruleIds: ["tekst-lesbar-hierarki", "kamera-bevegelsesregel", "kontinuitet-lys-over-tid", "produksjon-versjonering"],
    termSlugs: ["hierarki-design", "gridsystem-design", "locked-off-film", "seed-ai"],
  },
  {
    title: "Dokumentarisk fabrikksekvens",
    outputType: "video",
    domain: "dokumentar",
    shortInput: "Vis produksjonslinje i fabrikk med fokus på prosess og sikkerhet.",
    focus: "produksjonslogikk og aksestabilitet",
    ruleIds: ["kamera-akseregel", "produksjon-fremdrift", "konsistens-identitetslas", "fysikk-temporal-koherens"],
    termSlugs: ["master-shot-film", "camera-solve-vfx", "timing-design", "regel-las-ai"],
  },
  {
    title: "Arkitektonisk nattscene med våt asfalt",
    outputType: "image",
    domain: "arkitektur",
    shortInput: "Nattlig byrom med våt asfalt og tydelig inngang til kulturhus.",
    focus: "refleksjonskontroll og skiltlesbarhet",
    ruleIds: ["fysikk-refleksjon-vinkel", "tekst-i-bilde-advarsel", "lys-primarkilde", "komposisjon-fokuspunkt"],
    termSlugs: ["fasade-arch", "specular-highlight-photo", "cutaway-film", "inpainting-ai"],
  },
  {
    title: "Produktfoto av klokke i studio",
    outputType: "image",
    domain: "produkt",
    shortInput: "Lag et premium produktbilde av armbåndsur på mørk bakgrunn.",
    focus: "mikrodetaljer i metall og glass",
    ruleIds: ["realisme-materialrespons", "lys-kontrastkontroll", "kamera-brennvidde", "komposisjon-fokuspunkt"],
    termSlugs: ["softbox-photo", "polariseringsfilter-photo", "blender-photo", "adapter-ai"],
  },
  {
    title: "Historisk markedsscene med regn",
    outputType: "video",
    domain: "historisk",
    shortInput: "Markedsscene i middelalderby med regn og folkeliv.",
    focus: "epokelogikk og værkonsistens",
    ruleIds: ["historisk-epokekontroll", "fysikk-regnlogikk", "konsistens-scenelas", "produksjon-ingen-magi"],
    termSlugs: ["program-arch", "akse-arch", "tracking-marker-vfx", "object-permanence-ai"],
  },
  {
    title: "Casefilm for offentlig sektor",
    outputType: "video",
    domain: "dokumentar",
    shortInput: "Casefilm om kommunal tjeneste med troverdig hverdagssetting.",
    focus: "nøktern tone og stabil visuell kontinuitet",
    ruleIds: ["konsistens-fargepalett", "kamera-pov", "realisme-ansiktsanatomi", "produksjon-qa-sjekk"],
    termSlugs: ["systemtone-design", "over-skulder-film", "grain-matching-vfx", "token-presisjon-ai"],
  },
  {
    title: "Produktlansering med før/etter-sekvens",
    outputType: "video",
    domain: "produkt",
    shortInput: "Vis før/etter effekt av renseprodukt i ett sammenhengende shot.",
    focus: "fysisk plausibel transformasjon uten magi",
    ruleIds: ["produksjon-ingen-magi", "fysikk-kollisjon", "kamera-shotintensjon", "kontinuitet-objektpermanens"],
    termSlugs: ["insert-film", "render-pass-vfx", "consistency-lock-ai", "kontrastforhold-design"],
  },
  {
    title: "Norsk naturdokumentar i tåke",
    outputType: "video",
    domain: "dokumentar",
    shortInput: "Rolig natursekvens i morgentåke med dyrespor i forgrunn.",
    focus: "stemning gjennom fysikk, ikke filter",
    ruleIds: ["realisme-fysisk-lys", "fysikk-temporal-koherens", "komposisjon-lagdeling", "kamera-dybdeskarphet"],
    termSlugs: ["volumetrisk-lys-photo", "sekvenskart-design", "frame-rate-film", "latentrom-ai"],
  },
  {
    title: "Arkitekturpitch med menneskeflyt",
    outputType: "image",
    domain: "arkitektur",
    shortInput: "Vis nytt kollektivknutepunkt med tydelig fotgjengerflyt.",
    focus: "program, skala og orientering",
    ruleIds: ["komposisjon-ledende-linjer", "realisme-objektproporsjon", "konsistens-scenelas", "lys-fargetemperatur"],
    termSlugs: ["akse-arch", "siktlinje-arch", "responsivt-bruddpunkt-design", "control-map-ai"],
  },
  {
    title: "Redaksjonell tekst: hvorfor norsk prompting",
    outputType: "text",
    domain: "redaksjonell",
    shortInput: "Skriv en kort redaksjonell tekst om hvorfor norsk prompting er viktig.",
    focus: "strategisk argumentasjon uten hype",
    ruleIds: ["tekst-klar-rolle", "tekst-terminologikontroll", "produksjon-briefformat", "konsistens-fargepalett"],
    termSlugs: ["prompt-arkitektur-ai", "systemtone-design", "tilbakemeldingssloyfe-design", "regel-las-ai"],
  },
];

function buildLongOutput(seed: ExampleSeed): string {
  return [
    "1) Mål:",
    `Lag en ${seed.outputType === "video" ? "produksjonsklar videoscene" : seed.outputType === "image" ? "visuelt konsistent scene" : "faglig presis tekst"} for ${seed.domain}, med fokus på ${seed.focus}.`,
    "",
    "2) Motiv + handling:",
    seed.shortInput,
    "",
    "3) Miljø / setting:",
    "Beskriv fysisk rom, underlag, værforhold og relevante bakgrunnselementer med stabil geometri.",
    "",
    "4) Kamera:",
    seed.outputType === "video"
      ? "35mm, øye- eller hoftehøyde, én definert bevegelse med kontrollert tempo."
      : seed.outputType === "image"
        ? "Fast utsnitt med definert brennvidde og tydelig fokusplan."
        : "Teksten skal følge en klar struktur med korte, presise avsnitt.",
    "",
    "5) Lys:",
    "Definer hovedlyskilde, retning, kontrastnivå og fargetemperatur uten diffuse estetikord.",
    "",
    "6) Materialer / overflater:",
    "Materialrespons skal være fysisk plausibel og konsekvent mellom elementene.",
    "",
    "7) Komposisjon:",
    "Tydelig hovedfokus, kontrollert negativt rom og lesbar forgrunn/mellomgrunn/bakgrunn.",
    "",
    "8) Stil / estetikk:",
    "Nøktern, troverdig og profesjonell tone uten AI-glans eller overdreven grading.",
    "",
    "9) Kontinuitet / konsistens:",
    "Lås identitet, objekter og lysadferd slik at sekvensen ikke muterer.",
    "",
    "10) Begrensninger:",
    "Ingen nye objekter, ingen magiske transformasjoner, ingen perspektivbrudd.",
    "",
    "11) Negativ prompting / unngå:",
    "Unngå plastteksturer, tilfeldig motion blur, tekstfeil i bilde og anakronismer.",
    "",
    "12) Output-spesifikasjon:",
    seed.outputType === "video"
      ? "9:16 eller 16:9 avhengig av kanal, 24fps, tydelig start/slutt-tilstand."
      : seed.outputType === "image"
        ? "Lever i valgt aspect ratio med høy detalj og konsistent eksponering."
        : "Lever som strukturert norsk fagtekst med punktvis handlingsråd.",
  ].join("\n");
}

export const promptExamples: PromptExample[] = seeds.map((seed) => ({
  slug: slugify(seed.title),
  title: seed.title,
  outputType: seed.outputType,
  domain: seed.domain,
  shortInput: seed.shortInput,
  longOutput: buildLongOutput(seed),
  whyWorks: [
    "Outputen følger fast prompt-arkitektur i samme rekkefølge hver gang.",
    "Regler og constraints reduserer tolkingsrommet i modellen.",
    "Terminologi fra ordforrådet gjør beskrivelser mer presise og reproduserbare.",
  ],
  ruleIds: seed.ruleIds,
  termSlugs: seed.termSlugs,
  updatedAt: "2026-02-23",
}));

export const examplesBySlug = Object.fromEntries(
  promptExamples.map((example) => [example.slug, example])
);
