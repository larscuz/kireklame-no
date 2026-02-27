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
  format?: "16:9" | "9:16" | "1:1";
  strictness: number;
  consistency: number;
  lockRules: boolean;
  jsonMode?: boolean;
  templateId?: string;
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

export type LearningPoint = {
  title: string;
  detail: string;
};

export type InjectedTerm = {
  slug: string;
  term_no: string;
  definition_no: string;
  why: string;
  effect: string;
};

export type BuildPromptResult = {
  fullPrompt: string;
  sections: PromptBlock[];
  injectedTerms: InjectedTerm[];
  prompt: string;
  blocks: PromptBlock[];
  usedRules: NorskPromptingRule[];
  usedTerms: GlossaryTerm[];
  negativeList: string[];
  learningPoints: LearningPoint[];
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
      "Hvis tekst nevnes i ideen, integrer den naturlig med tydelig typografisk hierarki og lesbarhet.",
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
      "Hvis tekst nevnes i ideen, integrer den naturlig med tydelig typografisk hierarki og lesbarhet.",
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
      "Hvis tekst nevnes i ideen, integrer den naturlig med tydelig typografisk hierarki og lesbarhet.",
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
      "Hvis tekst nevnes i ideen, integrer den naturlig med tydelig typografisk hierarki og lesbarhet.",
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
      "Hvis tekst nevnes i ideen, integrer den naturlig med tydelig typografisk hierarki og lesbarhet.",
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
      "Hvis tekst nevnes i ideen, integrer den naturlig med tydelig typografisk hierarki og lesbarhet.",
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
      "Hvis tekst nevnes i ideen, integrer den naturlig med tydelig typografisk hierarki og lesbarhet.",
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
      "Hvis tekst nevnes i ideen, integrer den naturlig med tydelig typografisk hierarki og lesbarhet.",
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
      "Hvis tekst nevnes i ideen, integrer den naturlig med tydelig typografisk hierarki og lesbarhet.",
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
      "Hvis tekst nevnes i ideen, integrer den naturlig med tydelig typografisk hierarki og lesbarhet.",
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
  { id: "lead", title: "OPPGAVE TIL CHATMODELL" },
  { id: "goal", title: "MÅL" },
  { id: "motif", title: "MOTIV OG HANDLING" },
  { id: "environment", title: "MILJØ" },
  { id: "camera", title: "KAMERA" },
  { id: "light", title: "LYS" },
  { id: "composition", title: "KOMPOSISJON" },
  { id: "style", title: "STIL OG ETTERARBEID" },
  { id: "speech", title: "SPRÅKLÅS FOR TALE" },
  { id: "output", title: "OUTPUTKRAV" },
  { id: "negative", title: "NEGATIVLISTE" },
];

function toText(value: unknown): string {
  return String(value ?? "").trim();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function normalizeInput(input: BuildPromptInput): BuildPromptInput {
  const format =
    input.format === "16:9" || input.format === "9:16" || input.format === "1:1" ? input.format : undefined;
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
    format,
    strictness: clamp(input.strictness, 0, 100),
    consistency: clamp(input.consistency, 0, 100),
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

function needsGeometryReferenceLock(input: BuildPromptInput): boolean {
  if (input.outputType === "text") return false;

  const source = input.input.toLowerCase();
  const hasExplodedSignals = containsAny(source, [
    "exploded",
    "explodert",
    "axonometric",
    "aksjonometri",
    "aksonometri",
    "orthographic",
    "ortografisk",
  ]);
  const hasPrecisionSignals = containsAny(source, [
    "identisk objekt",
    "samme objekt",
    "preserve all original proportions",
    "bevar proporsjon",
    "produktpresisjon",
    "teknisk visualisering",
    "geometrilås",
  ]);
  const hasRelevantDomain = input.domain === "produkt" || input.domain === "arkitektur" || input.domain === "design-system";

  return hasExplodedSignals || (hasRelevantDomain && hasPrecisionSignals);
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

  if (needsGeometryReferenceLock(input)) {
    return {
      level: "anbefalt",
      title: "Referanse først for geometrilås",
      reason: "Caset krever identisk objekt og teknisk geometribevaring i neste steg.",
      howToUse:
        "Trenger du først å generere et geometrisk referansebilde for å låse form og proporsjon? Generer referansen først, og modifiser visningsform i steg to.",
    };
  }

  const source = input.input.toLowerCase();
  let score = 0;

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

  const source = input.input.toLowerCase();
  let score = 0;

  if (input.consistency >= 60) score += 1;
  if (input.strictness >= 60) score += 1;
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
    "Referansealias: bruk @img1 for første referansebilde, @img2 for neste, osv.",
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
    "Modellnavn: I Kling 3.0 brukes feltene Start image og End image.",
    `Start image: ${input.firstFrame || "MÅ FYLLES UT: beskriv startbilde med motiv, lys og kameraposisjon."}`,
    `End image: ${input.lastFrame || "MÅ FYLLES UT: beskriv sluttbilde med samme geometri- og identitetslogikk."}`,
    "Tag-kobling ved behov: Start image = @img1, End image = @img2.",
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

function hasSpeechSignals(text: string): boolean {
  const source = text.toLowerCase();
  return /(dialog|dialogue|replikk|voiceover|voice-over|fortellerstemme|speaker|stemme|tale|uttale|lip[- ]?sync|sier|says)/.test(
    source
  );
}

function visualTextHintBlock(input: BuildPromptInput): string {
  if (input.outputType === "text") {
    return "Ikke relevant for ren tekstleveranse.";
  }

  const mentionsText = /(tekst|ordlyd|slagord|headline|overskrift|logo|typografi|font|bokstav|caption|tittel|skilt)/i
    .test(input.input);

  if (!mentionsText) {
    return "Hvis motivet skal inneholde tekst, skriv ordlyd, plassering og visuell prioritet direkte i motivbeskrivelsen.";
  }

  return "Tekst i motivet behandles som vanlig del av prompten: behold ordlyd, og styr typografisk hierarki, kontrast, størrelse og plassering i samme spesifikasjon.";
}

function languageRuleBlock(input: BuildPromptInput): string {
  if (input.outputType === "text") {
    return "Svar på norsk med tydelig struktur og konkret ordvalg.";
  }

  if (detectAudioMode(input.input) === "voice" || hasSpeechSignals(input.input)) {
    return "Skriv sluttprompten på norsk. Skill tydelig mellom sceneinstruks og dialoglinjer, og behold ordlyden i dialogen nøyaktig som spesifisert uten omskriving.";
  }

  return "Skriv sluttprompten på norsk. Bruk ett språk konsekvent i instruksjonsteksten. Hvis ideen inneholder konkret tekst i motivet, behold ordlyden slik den er beskrevet.";
}

function speechLanguageLockBlock(input: BuildPromptInput): string {
  if (input.outputType !== "video") {
    return "Ikke relevant: denne leveransetypen har ikke talespor.";
  }

  const speechMode = detectAudioMode(input.input) === "voice" || hasSpeechSignals(input.input);
  if (!speechMode) {
    return "Ingen dialog/voiceover i input. Hvis tale legges til senere: lås valgt språk, krev ordrett replikk i anførselstegn og unngå språkblanding.";
  }

  return [
    "Hard språklås for tale: velg ett talespråk og hold det 100 prosent konsekvent i hele klippet.",
    "Hvis norsk er valgt: spesifiser bokmål med naturlig nøytral Oslo-uttale.",
    "Forby anglifisert uttale: ingen engelske fonemer, ingen engelsk prosodi og ingen anglifisert vokalforming.",
    "Alle replikker i anførselstegn skal leveres ordrett: ingen parafrasering, ingen ekstra/fjernede ord og ingen fyllord.",
    "Legg uttalesegmentering for krevende ord ved behov (eksempel: pre-sen-ta-sjo-nen).",
    "Lip-sync skal følge faktiske fonemer i valgt språk med naturlig rytme og intonasjon.",
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

function outputSpec(outputType: PromptOutputType, format?: "16:9" | "9:16" | "1:1"): string {
  const ratio = format || (outputType === "video" ? "9:16" : "16:9");

  if (outputType === "video") {
    return `Format ${ratio}, varighet 6-10 sekunder, 24 fps, tydelig sluttbilde uten geometrihopp.`;
  }

  if (outputType === "image") {
    return `Format ${ratio}, høy oppløsning, stabil eksponering og tydelig detaljnivå i hovedmotiv.`;
  }

  return "Lever i norsk tekstformat med tydelig struktur, handlingsnær tone og konkret avslutning.";
}

function intermediaryTaskBlock(input: BuildPromptInput): string {
  if (input.outputType === "text") {
    return [
      "Oppgave: bruk spesifikasjonen under til å skrive én ferdig norsk tekstleveranse.",
      "Svar kun med selve sluttteksten.",
      "Ikke skriv forklaring, analyse, overskrifter eller punktliste.",
      "Ikke omskriv oppgaven som en ny instruksjon.",
    ].join(" ");
  }

  const modelTarget = input.outputType === "video" ? "videomodell" : "bildemodell";

  return [
    `Oppgave: bruk spesifikasjonen under til å skrive én ferdig sluttprompt for en ${modelTarget}.`,
    "Dette er ikke en oppgave om å forbedre instruksen eller lage ny meta-instruks.",
    "Svar kun med selve sluttprompten, klar for liming i valgfri AI-modell.",
    "Ikke skriv forklaring, analyse, overskrifter, punktliste, kodeblokk eller ekstra tekst før/etter sluttprompten.",
  ].join(" ");
}

function responseContractBlock(input: BuildPromptInput): string {
  if (input.outputType === "text") {
    return "Svarformat: Kun slutttekst. Ingen forklaringer, ingen metadata.";
  }

  return "Svarformat: Kun én ferdig bilde/video-prompt i ren tekst. Ingen forklaringer eller meta-kommentarer.";
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

const videoTermHints = [
  "video",
  "frame",
  "frames",
  "fps",
  "sekvens",
  "klipp",
  "j-cut",
  "l-cut",
  "shot-reverse-shot",
  "lydbro",
  "voiceover",
  "voice-over",
  "romtone",
  "start-slutt",
  "first-last",
  "first/last",
  "tempo",
  "temporal",
  "match-cut",
  "taletempo",
  "pauselengde",
  "on-beat",
  "intro-hook",
  "bevegelseskurver",
  "inbetweening",
  "squash",
  "stretch",
];

function isVideoSpecificTerm(term: GlossaryTerm): boolean {
  const haystack = [
    term.slug,
    term.term_no,
    term.term_en,
    term.definition_no,
    term.promptImpact,
    ...term.examples,
  ]
    .join(" ")
    .toLowerCase();

  return videoTermHints.some((hint) => haystack.includes(hint));
}

const imageTermPriorityHints = [
  "utsnitt",
  "brennvidde",
  "dybdeskarphet",
  "fokusplan",
  "lysretning",
  "kontrast",
  "materialitet",
  "komposisjon",
  "lagdeling",
  "perspektiv",
];

const videoTermPriorityHints = [
  "kamerabevegelse",
  "kontinuitet",
  "bevegelsesretning",
  "fokusovergang",
  "lyslogikk",
  "rytme",
  "lydmodus",
  "first/last",
  "start-slutt",
];

const textTermPriorityHints = [
  "tone",
  "målgruppe",
  "retor",
  "struktur",
  "cta",
  "narrativ",
  "perspektiv",
];

function termCountByLength(input: BuildPromptInput): number {
  if (input.length === "kort") {
    return 6 + Math.round((input.strictness / 100) * 2);
  }

  if (input.length === "lang") {
    return 16 + Math.round(((input.strictness + input.consistency) / 200) * 8);
  }

  return 8 + Math.round(((input.strictness + input.consistency) / 200) * 6);
}

function termPriorityHints(outputType: PromptOutputType): string[] {
  if (outputType === "video") return videoTermPriorityHints;
  if (outputType === "text") return textTermPriorityHints;
  return imageTermPriorityHints;
}

function termPriorityScore(term: GlossaryTerm, hints: string[]): number {
  const haystack = [term.slug, term.term_no, term.term_en, term.definition_no, term.promptImpact, ...term.examples]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const hint of hints) {
    if (haystack.includes(hint)) score += 3;
  }

  return Math.min(score, 18);
}

function chooseTerms(input: BuildPromptInput, domainPack: DomainPack | null): GlossaryTerm[] {
  const domains = domainToGlossary[input.domain];
  const source = input.input.toLowerCase();
  const preferredSlugs = new Set(domainPack?.preferredTermSlugs ?? []);
  const hints = termPriorityHints(input.outputType);
  const count = termCountByLength(input);

  const candidates = glossaryTerms.filter((term) => {
    if (!domains.includes(term.domain)) return false;
    if (input.outputType === "image" && isVideoSpecificTerm(term)) return false;
    return true;
  });

  const weighted = candidates
    .map((term) => {
      const inInput = source.includes(term.term_no.toLowerCase()) || source.includes(term.term_en.toLowerCase());
      const preferred = preferredSlugs.has(term.slug);
      const score =
        (inInput ? 12 : term.promptImpact.length % 6) +
        (preferred ? 18 : 0) +
        termPriorityScore(term, hints);
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
    hard.push("Start image/End image er låst: start- og sluttramme skal være kompatible med logisk, fysisk overgang.");
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
    const styleBudget = input.length === "lang" ? 4 : input.length === "medium" ? 3 : 2;
    const filteredTokens = domainPack.styleTokens.filter((token) => {
      if (input.outputType !== "image") return true;
      const source = token.toLowerCase();
      return !containsAny(source, ["j-kutt", "l-kutt", "lydbro", "shotliste", "matchmove", "plate clean-up"]);
    });
    styleLine.push(`Domeneordvalg: ${filteredTokens.slice(0, styleBudget).join(", ")}.`);
  }

  if (templateInstructions && input.length === "lang") {
    styleLine.push(templateInstructions);
  }

  return styleLine.join(" ").trim();
}

function pickTermsByHints(terms: GlossaryTerm[], hints: string[], limit: number): string[] {
  const out: string[] = [];

  for (const term of terms) {
    const haystack = `${term.term_no} ${term.term_en} ${term.definition_no} ${term.promptImpact}`.toLowerCase();
    if (hints.some((hint) => haystack.includes(hint)) && !out.includes(term.term_no)) {
      out.push(term.term_no);
    }
    if (out.length >= limit) return out;
  }

  return out;
}

function fillTerms(seed: string[], terms: GlossaryTerm[], target: number): string[] {
  const out = [...seed];
  for (const term of terms) {
    if (out.includes(term.term_no)) continue;
    out.push(term.term_no);
    if (out.length >= target) break;
  }
  return out;
}

function formatFallbackForOutput(outputType: PromptOutputType): "16:9" | "9:16" | "1:1" {
  if (outputType === "video") return "9:16";
  return "16:9";
}

function buildLearningPoints(input: BuildPromptInput, formatValue: "16:9" | "9:16" | "1:1"): LearningPoint[] {
  const points: LearningPoint[] = [
    {
      title: "Kameraavstand",
      detail: "Vi la inn forslag til brennvidde og avstand, slik at motivet holder riktig størrelse i rammen.",
    },
    {
      title: "Lysretning",
      detail: "Vi la inn hovedlys og fylllys, så modellen får tydelig volum i ansikt, produkt eller miljø.",
    },
    {
      title: "Fokuspunkt",
      detail: "Vi presiserte hva som skal være skarpt først, så oppmerksomheten går til riktig del av motivet.",
    },
    {
      title: "Komposisjon",
      detail: "Vi la inn lagdeling og plassering i bildet for å gjøre scenen lettere å lese visuelt.",
    },
    {
      title: "Formatkrav",
      detail: `Vi valgte format ${formatValue}, så prompten passer bedre til kanalen du skal publisere i.`,
    },
  ];

  if (input.outputType === "text") {
    return [
      {
        title: "Målgruppe",
        detail: "Vi la inn målgruppe og tone, slik at teksten treffer riktigere.",
      },
      {
        title: "Struktur",
        detail: "Vi la inn en tydelig rekkefølge for budskap, så teksten blir enklere å følge.",
      },
      {
        title: "Retorisk grep",
        detail: "Vi la inn språkvalg som støtter ønsket effekt, ikke bare generelle formuleringer.",
      },
      {
        title: "CTA",
        detail: "Vi la inn en konkret handling til slutt, så teksten blir mer handlingsrettet.",
      },
      {
        title: "Perspektiv",
        detail: "Vi la inn narrativt perspektiv, så stemmen i teksten blir mer stabil.",
      },
    ];
  }

  return points;
}

type TermFocus = "kamera" | "lys" | "komposisjon" | "miljo" | "bevegelse" | "sprak";

function shortDefinition(definition: string): string {
  const normalized = definition.replace(/\s+/g, " ").trim();
  if (normalized.length <= 180) return normalized;

  const cut = normalized.slice(0, 180);
  const stop = Math.max(cut.lastIndexOf("."), cut.lastIndexOf(","), cut.lastIndexOf(";"));
  if (stop > 80) return `${cut.slice(0, stop).trim()}.`;
  return `${cut.trim()}...`;
}

function detectTermFocus(term: GlossaryTerm, outputType: PromptOutputType): TermFocus {
  const source = `${term.term_no} ${term.term_en} ${term.definition_no} ${term.promptImpact} ${term.examples.join(" ")}`.toLowerCase();

  if (outputType === "text") return "sprak";
  if (/brennvidde|utsnitt|fokus|dybdeskarphet|kamera|linse/.test(source)) return "kamera";
  if (/lys|skygge|kontrast|hoylys|eksponering|rim|fill|key/.test(source)) return "lys";
  if (/komposisjon|lagdeling|perspektiv|fokal|hierarki|blikk/.test(source)) return "komposisjon";
  if (/bevegelse|rytme|kontinuitet|sekvens|tempo|frame|klipp|motion/.test(source)) return "bevegelse";
  if (/miljo|rom|material|overflate|tekstur|setting/.test(source)) return "miljo";
  return outputType === "video" ? "bevegelse" : "miljo";
}

function whyForTerm(focus: TermFocus, input: BuildPromptInput): string {
  const ideaHint = splitSentences(input.input)[0] || "ideen din";

  if (focus === "kamera") return `Begrepet støtter hvordan ${ideaHint.toLowerCase()} skal rammes inn i bildet/videoen.`;
  if (focus === "lys") return `Begrepet støtter lyssettingen i ideen din slik at motivet blir tydeligere.`;
  if (focus === "komposisjon") return `Begrepet støtter komposisjon og blikkretning i ideen din.`;
  if (focus === "bevegelse") return `Begrepet støtter flyt og kontinuitet i sekvensen du beskriver.`;
  if (focus === "sprak") return `Begrepet støtter tone og struktur i teksten du vil lage.`;
  return `Begrepet støtter miljø og materialitet i ideen din.`;
}

function effectForTerm(focus: TermFocus, outputType: PromptOutputType): string {
  if (focus === "kamera") return "Gir strammere perspektiv, tydeligere utsnitt og bedre separasjon mellom motiv og bakgrunn.";
  if (focus === "lys") return "Gir mykere eller tydeligere skygger og mer kontrollert kontrast i motivet.";
  if (focus === "komposisjon") return "Gir tydeligere fokuspunkt, bedre lagdeling og mer lesbar bildeflate.";
  if (focus === "bevegelse") return "Gir jevnere bevegelsesretning og færre hopp mellom frames i video.";
  if (focus === "sprak") return "Gir mer målgruppepresis tone, tydeligere struktur og skarpere CTA.";
  return outputType === "text"
    ? "Gir mer konkret og tydelig tekstbeskrivelse av kontekst og detaljer."
    : "Gir tydeligere miljølogikk og mer troverdig materialrespons i scenen.";
}

function buildInjectedTerms(input: BuildPromptInput, terms: GlossaryTerm[]): InjectedTerm[] {
  return terms.map((term) => {
    const focus = detectTermFocus(term, input.outputType);
    return {
      slug: term.slug,
      term_no: term.term_no,
      definition_no: shortDefinition(term.definition_no),
      why: whyForTerm(focus, input),
      effect: effectForTerm(focus, input.outputType),
    };
  });
}

export function buildPrompt(rawInput: BuildPromptInput): BuildPromptResult {
  const input = normalizeInput(rawInput);
  const formatValue = input.format || formatFallbackForOutput(input.outputType);
  const sentences = splitSentences(input.input);
  const motif = sentences[0] || "Et tydelig hovedmotiv i front med klar visuell prioritet.";
  const action = sentences[1] || "En konkret handling med synlig årsak og effekt i scenen.";

  const template = chooseTemplate(input);
  const domainPack = domainPacks[input.domain] ?? null;
  const audioMode = detectAudioMode(input.input, template?.title);
  const rules = chooseRules(input, template?.recommendedRules ?? []);
  const usedTerms = chooseTerms(input, domainPack);
  const constraints = buildConstraintList(input, rules, domainPack);
  const negativeList = buildNegativeList(rules, input.strictness);
  const languageRule = languageRuleBlock(input);
  const speechLanguageLock = speechLanguageLockBlock(input);
  const visualTextHint = visualTextHintBlock(input);
  const guidance = getPromptGuidance(input);
  const referenceStrategy = referenceStrategyBlock(input, guidance.reference);
  const firstLastStrategy = firstLastStrategyBlock(input, guidance.firstLast);
  const referenceActivated = referenceStrategy.includes("AKTIVERT");
  const firstLastActivated = firstLastStrategy.includes("AKTIVERT");
  const allNegatives = [...negativeList];

  if (input.useReferenceImage) {
    allNegatives.push("unngå referansedrift i produkt, logo og identitet");
  }

  if (input.outputType === "video" && input.useFirstLast) {
    allNegatives.push("unngå brudd mellom Start image og End image");
  }

  const uniqueNegativeList = Array.from(new Set(allNegatives)).slice(0, 8);

  const templateInstructions = template
    ? template.blocks.map((block) => `${block.title}: ${block.instruction}`).join(" ")
    : "";

  const cameraTerms = fillTerms(
    pickTermsByHints(
      usedTerms,
      input.outputType === "text"
        ? ["perspektiv", "narrativ", "utsnitt"]
        : ["utsnitt", "brennvidde", "dybdeskarphet", "fokusplan", "kamera", "fokusovergang"],
      4
    ),
    usedTerms,
    4
  );

  const lightTerms = fillTerms(
    pickTermsByHints(
      usedTerms,
      input.outputType === "text"
        ? ["tone", "retor", "struktur"]
        : ["lysretning", "kontrast", "materialitet", "lys", "hoylys", "skygge"],
      4
    ),
    usedTerms,
    4
  );

  const compositionTerms = fillTerms(
    pickTermsByHints(
      usedTerms,
      input.outputType === "text"
        ? ["struktur", "cta", "narrativ", "målgruppe"]
        : ["komposisjon", "lagdeling", "perspektiv", "fokalpunkt", "hierarki"],
      4
    ),
    usedTerms,
    4
  );

  const styleTerms = fillTerms(
    pickTermsByHints(
      usedTerms,
      input.outputType === "text"
        ? ["tone", "målgruppe", "retor", "cta", "perspektiv"]
        : ["stil", "rytme", "tone", "material", "kontrast", "farge"],
      4
    ),
    usedTerms,
    4
  );

  const hiddenStabilityControls = [
    input.outputType !== "text" && guidance.reference.level === "anbefalt"
      ? needsGeometryReferenceLock(input)
        ? "Kontrollspørsmål: Trenger du først å generere et geometrisk referansebilde for å låse form og proporsjon?"
        : "Hold identitet, logo og produktdetaljer stabile mellom varianter."
      : "",
    input.outputType !== "text" && input.useReferenceImage && needsGeometryReferenceLock(input)
      ? "Arbeidsrekkefølge: 1) Lås objekt i referansebilde. 2) Modifiser visningsform (for eksempel exploded aksjonometri)."
      : "",
    input.outputType !== "text" && referenceActivated
      ? "Bruk referanse som fast kilde for form, geometri og nøkkeldetaljer. Referansealias: @img1, @img2, ..."
      : "",
    input.outputType === "video" && guidance.firstLast.level === "anbefalt"
      ? "Start- og sluttfase skal ha samme identitet, geometri og lysretning."
      : "",
    input.outputType === "video" && firstLastActivated
      ? "Kontinuerlig overgang mellom Start image og End image uten nye objekter eller geometrihopp. I Kling 3.0 brukes feltnavnene Start image/End image."
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const outputControl = [
    outputSpec(input.outputType, formatValue),
    input.outputType !== "text" ? visualTextHint : "",
    hiddenStabilityControls,
  ]
    .filter(Boolean)
    .join(" ");

  const leadInstruction = intermediaryTaskBlock(input);
  const responseContract = responseContractBlock(input);

  const compactConstraints = constraints.slice(0, input.length === "lang" ? 5 : 3).join(" ");

  const sections: PromptBlock[] = [
    {
      id: "lead",
      title: "OPPGAVE TIL CHATMODELL",
      content: leadInstruction,
    },
    {
      id: "goal",
      title: "MÅL",
      content: `${describeLength(input.length)} leveranse for ${domainLabel[input.domain]} med ${styleLabel[input.style]} tone.`,
    },
    {
      id: "motif",
      title: "MOTIV OG HANDLING",
      content: `${motif} ${action} Bruk fagbegreper: ${fillTerms([], usedTerms, Math.min(6, usedTerms.length)).join(", ")}.`,
    },
    {
      id: "environment",
      title: "MILJØ",
      content: `${detectEnvironment(input.input)} Operative begrensninger: ${compactConstraints}`,
    },
    {
      id: "camera",
      title: "KAMERA",
      content: `${cameraHint(input.outputType, input.domain)} Bruk kamera-begreper: ${cameraTerms.join(", ")}.`,
    },
    {
      id: "light",
      title: "LYS",
      content: `${lightHint(input.style, input.strictness)} Bruk lys-begreper: ${lightTerms.join(", ")}.`,
    },
    {
      id: "composition",
      title: "KOMPOSISJON",
      content: `Fokuspunkt, lagdeling og blikkretning skal være tydelig gjennom hele leveransen. Bruk komposisjonsbegreper: ${compositionTerms.join(
        ", "
      )}.`,
    },
    {
      id: "style",
      title: "STIL OG ETTERARBEID",
      content: `${buildDomainStyleLine(input, templateInstructions, domainPack)} Bruk stilbegreper: ${styleTerms.join(
        ", "
      )}. ${audioMode === "voice" ? "Norsk voiceover med jevn rytme og tydelig artikulasjon." : ""} ${
        audioMode === "music" ? "Musikk skal støtte budskap med tydelig oppbygning og avslutning." : ""
      } ${audioMode === "sfx" ? "SFX skal støtte handling med tydelig kilde og romlig plassering." : ""}`.trim(),
    },
    {
      id: "speech",
      title: "SPRÅKLÅS FOR TALE",
      content: speechLanguageLock,
    },
    {
      id: "output",
      title: "OUTPUTKRAV",
      content: `${outputControl} ${responseContract} ${languageRule}`.trim(),
    },
    {
      id: "negative",
      title: "NEGATIVLISTE",
      content: uniqueNegativeList.join("; "),
    },
  ];

  const fullPrompt = sectionOrder
    .map((section) => {
      const block = sections.find((entry) => entry.id === section.id);
      return `${section.title}\n${block?.content ?? ""}`;
    })
    .join("\n\n");

  const learningPoints = buildLearningPoints(input, formatValue);
  const injectedTerms = buildInjectedTerms(input, usedTerms);

  return {
    fullPrompt,
    sections,
    injectedTerms,
    prompt: fullPrompt,
    blocks: sections,
    usedRules: rules,
    usedTerms,
    negativeList: uniqueNegativeList,
    learningPoints,
    templateId: template?.id ?? null,
    guidance,
  };
}
