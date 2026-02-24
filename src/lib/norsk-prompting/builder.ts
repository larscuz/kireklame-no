import { glossaryTerms, norskPromptingRules, promptTemplates } from "@/data/norskPrompting/runtime";
import type {
  GlossaryDomain,
  GlossaryTerm,
  NorskPromptingRule,
  PromptDomain,
  PromptLength,
  PromptOutputType,
  PromptStyle,
} from "@/data/norskPrompting/types";
import { domainLabel, styleLabel } from "./constants";

export type BuildPromptInput = {
  input: string;
  outputType: PromptOutputType;
  domain: PromptDomain;
  style: PromptStyle;
  length: PromptLength;
  strictness: number;
  consistency: number;
  lockRules: boolean;
  jsonMode?: boolean;
  templateId?: string;
  textInVisual?: boolean;
  overlayText?: string;
  overlayLanguage?: string;
  textCase?: "behold" | "store" | "små";
  fontHint?: string;
  textPlacement?: string;
  useReferenceImage?: boolean;
  referenceIntent?: "identitet-logo" | "produktgeometri" | "komposisjon-stil" | "annet";
  referenceNotes?: string;
  useFirstLast?: boolean;
  firstFrame?: string;
  lastFrame?: string;
};

export type PromptBlock = {
  id: string;
  title: string;
  content: string;
};

export type BuildPromptResult = {
  prompt: string;
  blocks: PromptBlock[];
  usedRules: NorskPromptingRule[];
  usedTerms: GlossaryTerm[];
  negativeList: string[];
  templateId: string | null;
  guidance: PromptGuidance;
};

export type GuidanceLevel = "anbefalt" | "valgfritt" | "ikke_nodvendig" | "ikke_relevant";

export type GuidanceDecision = {
  level: GuidanceLevel;
  title: string;
  reason: string;
  howToUse: string;
};

export type PromptGuidance = {
  reference: GuidanceDecision;
  firstLast: GuidanceDecision;
};

type DomainPack = {
  styleTokens: string[];
  controlPoints: string[];
  preferredTermSlugs: string[];
};

const domainToGlossary: Record<PromptDomain, GlossaryDomain[]> = {
  "film-vfx": ["film", "vfx", "photo", "ai"],
  arkitektur: ["arch", "photo", "ai", "design"],
  produkt: ["photo", "design", "ai", "film"],
  dokumentar: ["film", "photo", "ai"],
  "sosiale-medier": ["film", "design", "photo", "ai"],
  historisk: ["arch", "photo", "film", "ai"],
  redaksjonell: ["ai", "design", "film"],
  "design-system": ["design", "ai", "photo"],
  surreal_absurd: ["design", "ai", "film", "photo"],
  animated: ["film", "vfx", "design", "ai"],
};

const domainPacks: Partial<Record<PromptDomain, DomainPack>> = {
  "film-vfx": {
    styleTokens: [
      "shotliste med prioriterte utsnitt",
      "fokusskift mellom plan",
      "bevisst vidvinkel/tele-valg",
      "J-kutt/L-kutt rytme",
      "lydbro i sceneoverganger",
      "matchmove-bevisst kompositt",
      "plate clean-up i post",
      "kontrollert fargegradering",
      "temporal konsistens per shot",
    ],
    controlPoints: [
      "Definer shotliste med start- og slutttilstand per shot før generering.",
      "Hold romakse, blikkretning og lysretning stabil mellom klipp.",
      "Lås subjektidentitet, kostyme og rekvisitt i hele sekvensen.",
      "Ved VFX-innslag: separer matchmove, plate clean-up og grading som eksplisitte steg.",
      "Ved tekst i bilde/video: TEKSTLÅS er absolutt, ingen ekstra ord.",
    ],
    preferredTermSlugs: [
      "shotliste-film",
      "fokusskift-film",
      "vidvinkel-film",
      "j-kutt-film",
      "l-kutt-film",
      "lydbro-film",
      "matchmove-las-vfx",
      "temporal-denoise-vfx",
    ],
  },
  arkitektur: {
    styleTokens: [
      "ortografisk projeksjon ved behov",
      "aksonometrisk lesbarhet",
      "materialitet med realistisk lysrespons",
      "masse/tomrom-balanse",
      "eksplodert aksonometri for lagforståelse",
      "nøktern fargepalett",
    ],
    controlPoints: [
      "Lås målforhold og geometri før estetiske variasjoner.",
      "Hold linjeføring, vertikaler og perspektiv teknisk konsistent.",
      "Definer materialpalett med ruhet, refleksjon og patina.",
      "Bruk skaleringsreferanse som menneske, møbel eller modulmål.",
      "Ved tekst i bilde/video: TEKSTLÅS er absolutt, ingen ekstra ord.",
    ],
    preferredTermSlugs: [
      "ortografisk-projeksjon-arch",
      "aksonometri-arch",
      "arkitektonisk-elevasjon-arch",
      "explodert-aksjonometri-arch",
      "materialitet-arch",
      "masse-og-tomrom-arch",
      "lysretning-photo",
      "objekt-permanens-ai",
    ],
  },
  produkt: {
    styleTokens: [
      "produkthero-lys",
      "teksturseparasjon i overflater",
      "grunn dybdeskarphet for hero-fokus",
      "mikrokontrast i produktkanter",
      "rent negativt rom",
      "typografisk rasterlås for packshot-tekst",
      "stilanker for variantserier",
    ],
    controlPoints: [
      "Lås produktgeometri, etikettplassering og proporsjoner gjennom alle varianter.",
      "Definer én primærlyskilde og hold skyggeretning stabil.",
      "Beskriv materialer med ruhet, glans og reflektivitet eksplisitt.",
      "Hold bakgrunn fri for konkurrerende objekter og tilfeldig støy.",
      "Ved tekst i bilde/video: TEKSTLÅS er absolutt, ingen ekstra ord.",
    ],
    preferredTermSlugs: [
      "produkthero-lys-photo",
      "grunn-dybdeskarphet-photo",
      "teksturseparasjon-photo",
      "motlys-photo",
      "visuell-hierarkilinje-design",
      "typografisk-rasterlas-design",
      "stilanker-ai",
      "negativt-rom-design",
    ],
  },
  dokumentar: {
    styleTokens: [
      "observasjonell kameraføring",
      "dyp fokus for miljølesbarhet",
      "naturlig motlys ved behov",
      "naturlig lysrespons",
      "handholdt mikro-jitter (kontrollert)",
      "lydbro for sceneovergang",
      "narrativ klarhet uten overregi",
      "nøktern grading",
    ],
    controlPoints: [
      "Bevar hendelsesrekkefølge og kausalitet uten iscenesatt overdrivelse.",
      "Lås geografi mellom utsnitt med tydelig etableringsreferanse.",
      "Hold fargegradering og kontrast i et troverdig dokumentarisk spenn.",
      "Hvis voiceover brukes: lås tone, tempo og person gjennom hele leveransen.",
      "Ved tekst i bilde/video: TEKSTLÅS er absolutt, ingen ekstra ord.",
    ],
    preferredTermSlugs: [
      "shotliste-film",
      "vidvinkel-film",
      "dyp-fokus-photo",
      "motlys-photo",
      "lydbro-film",
      "handholdt-mikro-jitter-film",
      "estableringsbilde-film",
      "romakse-film",
    ],
  },
  "sosiale-medier": {
    styleTokens: [
      "hook innen 0-2 sekunder",
      "vertikal komposisjon (9:16)",
      "CTA-hierarki",
      "tempo med tydelige beat-punkter",
      "tydelig teksthierarki",
      "stilanker for serieinnhold",
    ],
    controlPoints: [
      "Prioriter ett hovedbudskap per leveranse og kutt sekundærinformasjon.",
      "Lås brand-elementer: logo, farger, CTA-ordlyd og tone.",
      "Optimaliser utsnitt for safe zones i 9:16 og 1:1 der relevant.",
      "Hold rytme med tydelig start, midtpunkt og avsluttende handling.",
      "Ved tekst i bilde/video: TEKSTLÅS er absolutt, ingen ekstra ord.",
    ],
    preferredTermSlugs: [
      "cta-hierarki-design",
      "visuell-hierarkilinje-design",
      "typografisk-rasterlas-design",
      "shotliste-film",
      "lydbro-film",
      "stilanker-ai",
      "instruksjonsprioritet-ai",
      "negativt-rom-design",
    ],
  },
  historisk: {
    styleTokens: [
      "periodetro materialitet",
      "gylden time eller tidsriktig dagslys",
      "epokespesifikk lyslogikk",
      "tidsriktig kostyme og rekvisitt",
      "arkitektonisk troverdig geometri",
      "moderat filmkorn",
      "nøktern grading",
    ],
    controlPoints: [
      "Forankre scene til eksplisitt årstall eller epoke før stilvalg.",
      "Unngå moderne objekter, typografi og materialer som bryter perioden.",
      "Lås arkitekturdetaljer og bygningsspråk til valgt tidsramme.",
      "Hold fargepalett og lysnivå i tråd med historisk kontekst.",
      "Ved tekst i bilde/video: TEKSTLÅS er absolutt, ingen ekstra ord.",
    ],
    preferredTermSlugs: [
      "arkitektonisk-elevasjon-arch",
      "materialitet-arch",
      "gylden-time-photo",
      "dyp-fokus-photo",
      "fargegradering-vfx",
      "filmkorn-ekte-vs-filter-vfx",
      "estableringsbilde-film",
      "shot-reverse-shot-film",
    ],
  },
  redaksjonell: {
    styleTokens: [
      "begrepslås for nøkkeltermer",
      "VO-tonekart for voiceover",
      "instruksjonsprioritet",
      "visuell hierarkilinje i tekstflater",
      "stram argumentasjonskurve",
      "klar CTA eller konklusjon",
    ],
    controlPoints: [
      "Definer primærpåstand, bevispunkter og ønsket handling i fast rekkefølge.",
      "Lås terminologi: samme nøkkelbegrep skal ikke omskrives tilfeldig.",
      "Hvis voiceover: hold samme tone, tempo og person i hele teksten.",
      "Prioriter korte hovedsetninger med støttende detaljlag.",
      "Ved tekst i bilde/video: TEKSTLÅS er absolutt, ingen ekstra ord.",
    ],
    preferredTermSlugs: [
      "begrepslas-ai",
      "promptkontrakt-ai",
      "instruksjonsprioritet-ai",
      "vo-tonekart-film",
      "visuell-hierarkilinje-design",
      "cta-hierarki-design",
      "kontinuitetslas-ai",
      "temporal-konsistens-ai",
    ],
  },
  "design-system": {
    styleTokens: [
      "typografisk rasterlås",
      "visuell hierarkilinje",
      "konsistent komponentrytmikk",
      "stilanker på tvers av flater",
      "flat farge med tydelig kontrast",
      "ren ikonografi",
    ],
    controlPoints: [
      "Lås spacing-skala, typografisk hierarki og radiusnivåer i hele leveransen.",
      "Definer én primær komponentstil og hold den gjennom alle varianter.",
      "Prioriter tilgjengelig kontrast og lesbarhet før dekorative effekter.",
      "Unngå nye mønstre utenfor definerte designregler.",
      "Ved tekst i bilde/video: TEKSTLÅS er absolutt, ingen ekstra ord.",
    ],
    preferredTermSlugs: [
      "typografisk-rasterlas-design",
      "visuell-hierarkilinje-design",
      "stilanker-ai",
      "instruksjonsprioritet-ai",
      "flat-farge-design",
      "silhuettlesbarhet-design",
      "negativt-rom-design",
    ],
  },
  surreal_absurd: {
    styleTokens: [
      "surrealistisk logikk",
      "absurd kontrast",
      "drømmeaktig",
      "uventede sammenstillinger",
      "symbolsk objektbruk",
      "forstyrret skala",
      "umotivert, men konsistent regel",
      "hyperreal detaljer + ulogisk helhet",
      "poetisk dissonans",
      "metaforisk scene",
    ],
    controlPoints: [
      "Definer én surreal kjerne-uregel og lås den gjennom hele leveransen.",
      "Alt utenfor kjerne-uregelen følger normal fysikk og kausalitet.",
      "Bevar identitet og objekt-permanens uten magisk forsvinning.",
      "Tillat skalaendring kun på eksplisitte elementer, lås resten av scenen.",
      "Hold lys og kamera realistisk selv om motivlogikken er absurd.",
      "Ved tekst i bilde/video: TEKSTLÅS er absolutt, ingen ekstra ord.",
      "Alle absurde elementer må støtte budskap eller motiv, ikke tilfeldig støy.",
    ],
    preferredTermSlugs: [
      "drommelogikk-ai",
      "metaforisk-rekvisitt-design",
      "skala-dissonans-design",
      "visuell-paradoks-ai",
      "symbolsk-komposisjon-design",
      "uventet-materialitet-design",
      "umotivert-samsvar-ai",
      "kontrollert-ulogikk-ai",
      "poetisk-dissonans-design",
      "liminalt-rom-design",
      "defamiliarisering-design",
      "narrativ-friksjon-film",
    ],
  },
  animated: {
    styleTokens: [
      "animasjonsstil",
      "keyframes / nøkkelposering",
      "ren silhuett",
      "overdrevet lesbarhet",
      "stiliserte materialer",
      "kontrollert shading",
      "linjeart / cel shading",
      "klar fargepalett",
      "karakterdesign-konsistens",
      "bevegelseskurver (ease in/out)",
    ],
    controlPoints: [
      "Velg animasjonstype eksplisitt: 2D flat, 2D cutout, 3D stylized eller stop-motion look.",
      "Definer motion grammar med timing, easing og valgfri squash & stretch.",
      "Lås karaktermodell: proporsjoner, ansiktstrekk, fargepalett og klær.",
      "Lås linjetykkelse og linjeuttrykk når 2D brukes.",
      "Lås shader/cel-look når 3D stylized brukes.",
      "Unngå fotorealisme når animert uttrykk er valgt.",
      "Ved tekst i bilde/video: TEKSTLÅS + ingen deformasjon av typografi.",
      "For video: bruk kontinuitetslås og unngå morphing av bakgrunn.",
    ],
    preferredTermSlugs: [
      "cel-shading-vfx",
      "linjeart-design",
      "nokkelposering-film",
      "inbetweening-film",
      "squash-stretch-film",
      "ease-in-ease-out-film",
      "bevegelseskurver-film",
      "rigg-character-rig-vfx",
      "silhuettlesbarhet-design",
      "stiliserte-materialer-vfx",
      "flat-farge-design",
      "animert-timing-film",
    ],
  },
};

const sectionOrder: Array<{ id: string; title: string }> = [
  { id: "1", title: "Mål" },
  { id: "2", title: "Motiv + handling" },
  { id: "3", title: "Miljø / setting" },
  { id: "4", title: "Kamera / stemme" },
  { id: "5", title: "Lys / struktur" },
  { id: "6", title: "Materialer / overflater" },
  { id: "7", title: "Komposisjon" },
  { id: "8", title: "Stil / estetikk" },
  { id: "9", title: "Kontinuitet / konsistens" },
  { id: "10", title: "Referansebilde-strategi" },
  { id: "11", title: "First/Last-strategi (video)" },
  { id: "12", title: "Tekst i bilde/video" },
  { id: "13", title: "Tekstlås (kritisk)" },
  { id: "14", title: "Språkregel (kritisk)" },
  { id: "15", title: "Tekstkontinuitet (video)" },
  { id: "16", title: "Begrensninger" },
  { id: "17", title: "Negativ prompting / unngå" },
  { id: "18", title: "Output-spesifikasjon" },
];

function toText(value: unknown): string {
  return String(value ?? "").trim();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function normalizeInput(input: BuildPromptInput): BuildPromptInput {
  const language = toText(input.overlayLanguage || "norsk") || "norsk";
  const referenceIntent =
    input.referenceIntent === "identitet-logo" ||
    input.referenceIntent === "produktgeometri" ||
    input.referenceIntent === "komposisjon-stil" ||
    input.referenceIntent === "annet"
      ? input.referenceIntent
      : "identitet-logo";

  return {
    ...input,
    input: toText(input.input),
    strictness: clamp(input.strictness, 0, 100),
    consistency: clamp(input.consistency, 0, 100),
    textInVisual: Boolean(input.textInVisual),
    overlayText: toText(input.overlayText),
    overlayLanguage: language,
    textCase: input.textCase === "store" || input.textCase === "små" ? input.textCase : "behold",
    fontHint: toText(input.fontHint),
    textPlacement: toText(input.textPlacement),
    useReferenceImage: Boolean(input.useReferenceImage),
    referenceIntent,
    referenceNotes: toText(input.referenceNotes),
    useFirstLast: Boolean(input.useFirstLast),
    firstFrame: toText(input.firstFrame),
    lastFrame: toText(input.lastFrame),
  };
}

function containsAny(haystack: string, needles: string[]): boolean {
  return needles.some((needle) => haystack.includes(needle));
}

function evaluateReferenceGuidance(input: BuildPromptInput): GuidanceDecision {
  if (input.outputType === "text") {
    return {
      level: "ikke_relevant",
      title: "Ikke relevant",
      reason: "Referansebilde brukes for visuelle leveranser, ikke ren tekst.",
      howToUse: "Ingen tiltak nødvendig for denne outputtypen.",
    };
  }

  const source = `${input.input} ${input.overlayText || ""}`.toLowerCase();
  let score = 0;

  if (input.textInVisual) score += 2;
  if (input.strictness >= 65) score += 1;
  if (input.consistency >= 65) score += 1;
  if (input.domain === "produkt" || input.domain === "arkitektur" || input.domain === "design-system") score += 1;
  if (containsAny(source, ["logo", "merke", "brand", "etikett", "pakning", "samme", "identisk", "produkt", "karakter", "ansikt"])) score += 2;

  if (score >= 4) {
    return {
      level: "anbefalt",
      title: "Anbefalt",
      reason: "Caset krever høy stabilitet i identitet, tekst eller produktdetaljer.",
      howToUse:
        "Bruk ett tydelig referansebilde, lås hva som ikke skal endres, og skriv eksplisitt at geometri, logo og tekst skal bevares.",
    };
  }

  if (score >= 2) {
    return {
      level: "valgfritt",
      title: "Valgfritt, men nyttig",
      reason: "Leveransen kan fungere uten referanse, men referanse reduserer drift.",
      howToUse:
        "Legg ved referanse hvis du ser variasjon i geometri, identitet eller tekst etter første test.",
    };
  }

  return {
    level: "ikke_nodvendig",
    title: "Ikke nødvendig nå",
    reason: "Dette ser ut som en utforskende oppgave uten harde låsekrav.",
    howToUse: "Start uten referanse, og legg den til først hvis du trenger mer stabilitet.",
  };
}

function evaluateFirstLastGuidance(input: BuildPromptInput): GuidanceDecision {
  if (input.outputType !== "video") {
    return {
      level: "ikke_relevant",
      title: "Ikke relevant",
      reason: "First/Last-metoden brukes i video.",
      howToUse: "Ingen tiltak nødvendig for stillbilde eller tekst.",
    };
  }

  const source = `${input.input} ${input.overlayText || ""}`.toLowerCase();
  let score = 0;

  if (input.consistency >= 60) score += 1;
  if (input.strictness >= 60) score += 1;
  if (input.textInVisual) score += 1;
  if (containsAny(source, ["overgang", "sekvens", "scene", "beveg", "løper", "fra", "til", "slutt", "start", "kamera"])) score += 1;
  if (input.domain === "film-vfx" || input.domain === "produkt" || input.domain === "sosiale-medier") score += 1;

  if (score >= 3) {
    return {
      level: "anbefalt",
      title: "Anbefalt",
      reason: "Caset har bevegelse/kontinuitetskrav som bør låses med start- og sluttramme.",
      howToUse:
        "Definer first frame, definer last frame, og beskriv fysisk plausibel overgang mellom dem uten nye objekter.",
    };
  }

  if (score >= 2) {
    return {
      level: "valgfritt",
      title: "Valgfritt, men nyttig",
      reason: "Videoen kan lages uten first/last, men metoden gir ofte mer stabilt resultat.",
      howToUse:
        "Aktiver first/last hvis du får geometrihopp, identitetsdrift eller inkonsistent kameralogikk.",
    };
  }

  return {
    level: "ikke_nodvendig",
    title: "Ikke nødvendig nå",
    reason: "Oppgaven ser enkel ut og kan testes uten first/last først.",
    howToUse: "Start enkelt. Legg til first/last i neste iterasjon hvis stabiliteten faller.",
  };
}

export function getPromptGuidance(rawInput: BuildPromptInput): PromptGuidance {
  const input = normalizeInput(rawInput);

  return {
    reference: evaluateReferenceGuidance(input),
    firstLast: evaluateFirstLastGuidance(input),
  };
}

function referenceStrategyBlock(input: BuildPromptInput, guidance: GuidanceDecision): string {
  if (input.outputType === "text") {
    return "Ikke relevant for tekstleveranse.";
  }

  if (!input.useReferenceImage) {
    return `Anbefaling: ${guidance.title}. ${guidance.reason} ${guidance.howToUse}`;
  }

  const intentMap: Record<NonNullable<BuildPromptInput["referenceIntent"]>, string> = {
    "identitet-logo": "Lås identitet, logo og merkeelementer.",
    "produktgeometri": "Lås produktgeometri, materialitet og proporsjoner.",
    "komposisjon-stil": "Lås komposisjon, utsnitt og visuell retning.",
    annet: "Lås referansen etter spesifisert behov.",
  };

  const base = [
    "Referansebilde: AKTIVERT.",
    intentMap[input.referenceIntent || "identitet-logo"],
    "Bruk referanse som fast kilde for form, geometri og nøkkeldetaljer.",
  ];

  if (input.referenceNotes) {
    base.push(`Referansenotat: ${input.referenceNotes}.`);
  }

  return base.join(" ");
}

function firstLastStrategyBlock(input: BuildPromptInput, guidance: GuidanceDecision): string {
  if (input.outputType !== "video") {
    return "Ikke relevant for stillbilde/tekst.";
  }

  if (!input.useFirstLast) {
    return `Anbefaling: ${guidance.title}. ${guidance.reason} ${guidance.howToUse}`;
  }

  return [
    "First/Last-metode: AKTIVERT.",
    `First frame: ${input.firstFrame || "MÅ FYLLES UT: beskriv startbilde med motiv, lys og kameraposisjon."}`,
    `Last frame: ${input.lastFrame || "MÅ FYLLES UT: beskriv sluttbilde med samme geometri- og identitetslogikk."}`,
    "Overgang: fysisk plausibel bevegelse mellom start og slutt, uten nye objekter eller magiske transformasjoner.",
  ].join(" ");
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function detectEnvironment(text: string): string {
  const source = text.toLowerCase();

  if (/regn|vann|dam|v[åa]t/.test(source)) return "Våt setting med fysisk plausibel værologikk og realistiske refleksjoner.";
  if (/tog|stasjon|gate|by/.test(source)) return "Urban setting med stabil geometri, tydelige siktlinjer og konsekvent skala.";
  if (/interi[øo]r|rom|kontor|studio/.test(source)) return "Innendørs setting med kontrollert lys og tydelig romlig avgrensning.";
  if (/skog|natur|fjell|hav/.test(source)) return "Naturlig miljø med fysisk korrekt lys, vær og terrengrespons.";

  return "Definer miljø med fysisk romlogikk, underlag og bakgrunn uten tilfeldige tillegg.";
}

function cameraHint(outputType: PromptOutputType, domain: PromptDomain): string {
  if (outputType === "text") {
    return "Bruk strukturert fagspråk: kort intro, mekanisme, praktisk leveranse. Unngå diffuse formuleringer.";
  }

  if (outputType === "video") {
    return "35mm eller 50mm, stabil POV, én kamerabevegelse om gangen, tydelig start/slutt-tilstand.";
  }

  if (domain === "arkitektur") {
    return "35mm frontalt eller svakt skrått, øyehøyde, nøytral perspektivkontroll uten forvrenging.";
  }

  return "Fast brennvidde (35–50mm), tydelig utsnitt og fokusplan med bevisst dybdeskarphet.";
}

function detectAudioMode(inputText: string, templateTitle?: string): "voice" | "music" | "sfx" | null {
  const source = `${inputText} ${templateTitle || ""}`.toLowerCase();

  if (/(voiceover|dialog|speaker|fortellerstemme|stemme)/.test(source)) return "voice";
  if (/(musikk|jingle|bpm|ad bed|bumper|track)/.test(source)) return "music";
  if (/(sfx|lydeffekt|ambience|ambient|foley)/.test(source)) return "sfx";

  return null;
}

function textPresenceBlock(input: BuildPromptInput): string {
  if (!input.textInVisual) {
    if (input.outputType === "image" || input.outputType === "video") {
      return "Ingen tekst i bildet/videoen.";
    }

    return "Ingen visuell tekst er spesifisert.";
  }

  const lines = [
    "Tekst i visuell leveranse: JA.",
    `Eksakt tekst: "${input.overlayText || "MÅ FYLLES UT: skriv eksakt tekst her."}"`,
    `Språk: ${input.overlayLanguage || "norsk"}.`,
    `Case: ${input.textCase || "behold"}.`,
  ];

  if (input.fontHint) {
    lines.push(`Font-type (hint): ${input.fontHint}.`);
  }

  if (input.textPlacement) {
    lines.push(`Plassering: ${input.textPlacement}.`);
  }

  return lines.join(" ");
}

function textLockBlock(input: BuildPromptInput): string {
  if (!input.textInVisual) {
    return "Ingen tekst skal genereres. Ingen bokstaver, ingen skilttekst, ingen automatisk typografi.";
  }

  const exactText = input.overlayText || "MÅ FYLLES UT: eksakt tekst";

  return [
    "All tekst i bildet/videoen skal være eksakt som angitt.",
    "Ingen ekstra ord.",
    "Ingen oversettelse.",
    "Ingen alternative formuleringer.",
    "Ingen stavefeil.",
    "Ingen endring av bokstaver.",
    "Ingen tillegg av slagord.",
    "Ingen automatisk generert tekst.",
    `Kun og nøyaktig følgende tekst: "${exactText}".`,
  ].join(" ");
}

function languageRuleBlock(input: BuildPromptInput): string {
  const overrideLanguage = (input.overlayLanguage || "norsk").toLowerCase();
  const hasExplicitOverride = input.textInVisual && overrideLanguage !== "norsk";

  const base = [
    "Alt innhold skal være på norsk.",
    "Modellen skal ikke generere engelsk tekst.",
    "Ingen engelske ord, med mindre de eksplisitt er spesifisert.",
    "Ikke oversett teksten.",
    "Ikke legg til engelske slagord.",
  ];

  if (hasExplicitOverride) {
    base.push(
      `Eksplisitt unntak: tekstlåsen spesifiserer språk "${input.overlayLanguage}". Kun denne teksten er tillatt som avvik.`
    );
  }

  return base.join(" ");
}

function videoTextContinuityBlock(input: BuildPromptInput): string {
  if (input.outputType !== "video") {
    return "Ikke relevant for stillbilde/ren tekstleveranse.";
  }

  if (!input.textInVisual) {
    return "Ingen tekst i video-frames. Hold alle frames fri for tekst.";
  }

  return [
    "Teksten skal være identisk i alle frames.",
    "Ingen bokstavdrift.",
    "Ingen fontendring.",
    "Ingen forvrengning.",
    "Ingen morphing av tekst.",
  ].join(" ");
}

function lightHint(style: PromptStyle, strictness: number): string {
  const base = "Definer key/fill/rim med retning, diffusjon og fargetemperatur (Kelvin).";
  if (style === "dokumentar" || style === "noktern") {
    return `${base} Prioriter nøytral, troverdig lyssetting uten dramatisk grading.`;
  }

  if (strictness > 70) {
    return `${base} Lås primærlyskilde og unngå motstridende skygger.`;
  }

  return `${base} Hold kontrast under kontroll og unngå stiliserte artefakter.`;
}

function outputSpec(outputType: PromptOutputType): string {
  if (outputType === "video") {
    return "Oppgi format (9:16 eller 16:9), varighet, fps, og tydelig sluttramme uten geometrihopp.";
  }

  if (outputType === "image") {
    return "Oppgi formatforhold, oppløsningsmål og krav om konsistent eksponering og detaljnivå.";
  }

  return "Lever i norsk tekstformat med overskrifter, punktliste og avsluttende handlingssjekk.";
}

function chooseTemplate(input: BuildPromptInput) {
  if (!input.templateId) return null;

  const byId = promptTemplates.find((template) => template.id === input.templateId);
  return byId ?? null;
}

function chooseRules(input: BuildPromptInput, templateRuleIds: string[]): NorskPromptingRule[] {
  const base = norskPromptingRules.filter(
    (rule) => rule.appliesTo === "all" || rule.appliesTo === input.outputType
  );

  const recommended = base.filter((rule) => templateRuleIds.includes(rule.id));
  const remainder = base
    .filter((rule) => !templateRuleIds.includes(rule.id))
    .sort((a, b) => b.severity - a.severity);

  const limit = input.lockRules ? 12 : 6;
  const target: NorskPromptingRule[] = [];

  for (const rule of [...recommended, ...remainder]) {
    if (target.find((entry) => entry.id === rule.id)) continue;
    target.push(rule);
    if (target.length >= limit) break;
  }

  return target;
}

function chooseTerms(input: BuildPromptInput, domainPack: DomainPack | null, count = 8): GlossaryTerm[] {
  const domains = domainToGlossary[input.domain];
  const source = input.input.toLowerCase();
  const preferredSlugs = new Set(domainPack?.preferredTermSlugs ?? []);

  const candidates = glossaryTerms.filter((term) => domains.includes(term.domain));
  const weighted = candidates
    .map((term) => {
      const inInput = source.includes(term.term_no.toLowerCase()) || source.includes(term.term_en.toLowerCase());
      const preferred = preferredSlugs.has(term.slug);
      const score = (inInput ? 10 : term.promptImpact.length % 7) + (preferred ? 20 : 0);
      return { term, score };
    })
    .sort((a, b) => b.score - a.score || a.term.term_no.localeCompare(b.term.term_no, "nb-NO"));

  return weighted.slice(0, count).map((entry) => entry.term);
}

function buildConstraintList(input: BuildPromptInput, rules: NorskPromptingRule[], domainPack: DomainPack | null): string[] {
  const hard = [
    "Ikke legg til eller fjern nøkkelobjekter uten eksplisitt instruks.",
    "Ingen magisk transformasjon eller uforklarte hopp i geometri.",
    "Hold perspektiv, skala og lysforhold konsistent.",
  ];

  if (input.outputType === "image" || input.outputType === "video") {
    if (input.textInVisual) {
      hard.push("All synlig tekst skal følge TEKSTLÅS-seksjonen eksakt.");
    } else {
      hard.push("Ingen tekst i bildet/videoen.");
    }
  }

  if (input.strictness >= 70) {
    hard.push("Lås identitet, kostyme og miljøparametere gjennom hele outputen.");
    hard.push("Begrens stilisering; prioriter fysisk plausibilitet over effekter.");
  }

  if (input.consistency >= 70) {
    hard.push("Bruk kontinuitetslås: samme objektplassering og bevegelsesregler i hele sekvensen.");
  }

  if (input.useReferenceImage) {
    hard.push("Referansebilde er låst: ingen endring av logo, produktgeometri eller identitetsmarkører.");
  }

  if (input.outputType === "video" && input.useFirstLast) {
    hard.push("First/Last er låst: start- og sluttramme skal være kompatible med logisk, fysisk overgang.");
  }

  if (domainPack?.controlPoints?.length) {
    hard.push(...domainPack.controlPoints);
  }

  for (const rule of rules) {
    if (hard.length >= 8) break;
    hard.push(rule.addToPrompt);
  }

  return Array.from(new Set(hard));
}

function buildNegativeList(rules: NorskPromptingRule[], strictness: number): string[] {
  const base = [
    "unngå AI-plastikkhud",
    "unngå tilfeldig tekstfeil i bilde",
    "unngå inkonsistent perspektiv",
  ];

  for (const rule of rules) {
    base.push(rule.negativeAdd);
  }

  if (strictness >= 60) {
    base.push("unngå overmettet grading uten fysisk lyskilde");
  }

  return Array.from(new Set(base)).slice(0, 10);
}

function describeLength(length: PromptLength): string {
  if (length === "kort") return "kort og operativ";
  if (length === "lang") return "detaljert og produksjonsklar";
  return "balansert med tydelig operasjonelle punkter";
}

function buildDomainStyleLine(input: BuildPromptInput, templateInstructions: string, domainPack: DomainPack | null): string {
  const styleLine = [`Stil: ${styleLabel[input.style]}.`];

  if (domainPack?.styleTokens?.length) {
    styleLine.push(`Domeneordvalg: ${domainPack.styleTokens.join(", ")}.`);
  }

  if (templateInstructions) {
    styleLine.push(templateInstructions);
  }

  return styleLine.join(" ").trim();
}

export function buildPrompt(rawInput: BuildPromptInput): BuildPromptResult {
  const input = normalizeInput(rawInput);
  const sentences = splitSentences(input.input);
  const motif = sentences[0] || "Definer hovedmotiv og handling i én konkret setning.";
  const action = sentences[1] || "Beskriv en fysisk plausibel handling med tydelig årsak og effekt.";

  const template = chooseTemplate(input);
  const domainPack = domainPacks[input.domain] ?? null;
  const audioMode = detectAudioMode(input.input, template?.title);
  const rules = chooseRules(input, template?.recommendedRules ?? []);
  const usedTerms = chooseTerms(input, domainPack, input.length === "lang" ? 10 : 8);
  const constraints = buildConstraintList(input, rules, domainPack);
  const negativeList = buildNegativeList(rules, input.strictness);
  const languageRule = languageRuleBlock(input);
  const textBlock = textPresenceBlock(input);
  const textLock = textLockBlock(input);
  const textContinuity = videoTextContinuityBlock(input);
  const guidance = getPromptGuidance(input);
  const referenceStrategy = referenceStrategyBlock(input, guidance.reference);
  const firstLastStrategy = firstLastStrategyBlock(input, guidance.firstLast);
  const withTextNegatives = input.textInVisual
    ? [
        ...negativeList,
        "unngå ekstra ord i bilde/video",
        "unngå automatisk oversettelse av tekst",
        "unngå bokstavforvrengning",
      ]
    : [...negativeList, "unngå all tekst i bilde/video"];
  const allNegatives = [...withTextNegatives];

  if (input.useReferenceImage) {
    allNegatives.push("unngå referansedrift i produkt, logo og identitet");
  }

  if (input.outputType === "video" && input.useFirstLast) {
    allNegatives.push("unngå brudd mellom first frame og last frame");
  }

  const uniqueNegativeList = Array.from(new Set(allNegatives)).slice(0, 14);

  const templateInstructions = template
    ? template.blocks.map((block) => `${block.title}: ${block.instruction}`).join(" ")
    : "";

  const consistencyLine =
    input.consistency >= 70
      ? "Aktiver høy konsistens: objektpermanens, identitetslås og stabil kamerageometri i hele outputen."
      : "Hold grunnleggende konsistens mellom motiv, miljø og lys.";
  const domainConsistency =
    domainPack?.controlPoints?.length
      ? ` Domene-kontroll: ${domainPack.controlPoints.slice(0, 2).join(" ")}`
      : "";

  const blocks: PromptBlock[] = [
    {
      id: "1",
      title: "Mål",
      content: `Lag en ${describeLength(input.length)} ${input.outputType === "text" ? "norsk leveranse" : "prompt"} for ${domainLabel[input.domain]} med ${styleLabel[input.style]} tone.`,
    },
    {
      id: "2",
      title: "Motiv + handling",
      content: `${motif} ${action}`,
    },
    {
      id: "3",
      title: "Miljø / setting",
      content: detectEnvironment(input.input),
    },
    {
      id: "4",
      title: "Kamera / stemme",
      content:
        audioMode === "voice"
          ? "Stemme: norsk uttale, tydelig artikulasjon, kontrollert tempo og troverdig kommersiell tone."
          : audioMode === "music"
          ? "Stemme: ingen voiceover. Fokuser på musikalsk identitet, energi og jingle-signatur."
          : audioMode === "sfx"
          ? "Stemme: ingen voiceover. Fokuser på SFX-kilder, avstand, rom og tydelig hitpoint."
          : cameraHint(input.outputType, input.domain),
    },
    {
      id: "5",
      title: "Lys / struktur",
      content:
        audioMode === "voice"
          ? "Struktur: hook 0-2s, nytte 2-7s, CTA 7-10s. Hold språk, tone og tempo konsistent."
          : audioMode === "music"
          ? "Struktur: definer BPM, intro-hook, build, dynamikk og miksprioritet. Hold tydelig outro."
          : audioMode === "sfx"
          ? "Struktur: ambience-base, SFX-lag, hitpoints og nivåbalanse uten masking av budskap."
          : lightHint(input.style, input.strictness),
    },
    {
      id: "6",
      title: "Materialer / overflater",
      content:
        input.domain === "arkitektur" || input.domain === "produkt"
          ? "Beskriv materialer med ruhet, glans, tekstur og reflektivitet."
          : "Beskriv overflater og kontaktpunkter slik at modellen holder fysisk troverdighet.",
    },
    {
      id: "7",
      title: "Komposisjon",
      content: "Definer fokuspunkt, lagdeling og blikkretning i rammen.",
    },
    {
      id: "8",
      title: "Stil / estetikk",
      content: buildDomainStyleLine(input, templateInstructions, domainPack),
    },
    {
      id: "9",
      title: "Kontinuitet / konsistens",
      content: `${consistencyLine}${domainConsistency}`.trim(),
    },
    {
      id: "10",
      title: "Referansebilde-strategi",
      content: referenceStrategy,
    },
    {
      id: "11",
      title: "First/Last-strategi (video)",
      content: firstLastStrategy,
    },
    {
      id: "12",
      title: "Tekst i bilde/video",
      content: textBlock,
    },
    {
      id: "13",
      title: "Tekstlås (kritisk)",
      content: textLock,
    },
    {
      id: "14",
      title: "Språkregel (kritisk)",
      content: languageRule,
    },
    {
      id: "15",
      title: "Tekstkontinuitet (video)",
      content: textContinuity,
    },
    {
      id: "16",
      title: "Begrensninger",
      content: constraints.join(" "),
    },
    {
      id: "17",
      title: "Negativ prompting / unngå",
      content: uniqueNegativeList.join("; "),
    },
    {
      id: "18",
      title: "Output-spesifikasjon",
      content: outputSpec(input.outputType),
    },
  ];

  const promptText = sectionOrder
    .map((section) => {
      const block = blocks.find((entry) => entry.id === section.id);
      return `${section.id}) ${section.title}:\n${block?.content ?? ""}`;
    })
    .join("\n\n");

  if (input.jsonMode) {
    return {
      prompt: JSON.stringify(
        {
          meta: {
            outputType: input.outputType,
            domain: input.domain,
            style: input.style,
            strictness: input.strictness,
            consistency: input.consistency,
          lockRules: input.lockRules,
          textInVisual: input.textInVisual,
          overlayLanguage: input.overlayLanguage,
          textCase: input.textCase,
          textPlacement: input.textPlacement || null,
          hasOverlayText: Boolean(input.overlayText),
          useReferenceImage: input.useReferenceImage,
          referenceIntent: input.referenceIntent,
          hasReferenceNotes: Boolean(input.referenceNotes),
          useFirstLast: input.useFirstLast,
          hasFirstFrame: Boolean(input.firstFrame),
          hasLastFrame: Boolean(input.lastFrame),
        },
        sections: blocks,
        terminology: usedTerms.map((term) => term.term_no),
        rules: rules.map((rule) => rule.id),
        negativeList: uniqueNegativeList,
      },
      null,
      2
      ),
      blocks,
      usedRules: rules,
      usedTerms,
      negativeList: uniqueNegativeList,
      templateId: template?.id ?? null,
      guidance,
    };
  }

  return {
    prompt: promptText,
    blocks,
    usedRules: rules,
    usedTerms,
    negativeList: uniqueNegativeList,
    templateId: template?.id ?? null,
    guidance,
  };
}
