import fs from "node:fs";
import path from "node:path";
import { slugify } from "./text-normalize.mjs";

const OUT_PATH = path.join(
  process.cwd(),
  "data",
  "norskPrompting",
  "engine-seeds",
  "reklame-batch-v1.json"
);

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function dedupe(arr) {
  return Array.from(new Set(arr.filter(Boolean).map((entry) => String(entry).trim())));
}

const TEXT_OUTPUT_POLICY_TAG = "policy:text-output-only";

function lockLevelFromStrenghet(strenghet) {
  if (strenghet === "hoy" || strenghet === "høy") return "high";
  if (strenghet === "lav") return "low";
  return "mid";
}

function buildProductionHints({
  outputType,
  taxonomy = {},
  audioType = null,
  durationSeconds = null,
  includeCharacter = false,
}) {
  const hints = {};
  const lockLevel = lockLevelFromStrenghet(taxonomy?.strenghet);
  const needsReference = Boolean(taxonomy?.brandLock || taxonomy?.textLock || taxonomy?.productLock);

  if (outputType === "image") {
    hints.image = {
      requiresReference: needsReference,
      referenceType: taxonomy?.productLock ? "brand_asset" : needsReference ? "user_photo" : "generated_seed",
      lockLevel,
    };
  }

  if (outputType === "video") {
    hints.video = {
      recommendsFirstLast: true,
      durationSeconds: Number.isFinite(Number(durationSeconds)) ? Number(durationSeconds) : 10,
      temporalAwareness: true,
      continuityLock: true,
    };
  }

  if (audioType) {
    hints.audio = {
      type: audioType,
      durationSeconds: Number.isFinite(Number(durationSeconds)) ? Number(durationSeconds) : 10,
      structureRequired: true,
    };
  }

  if (includeCharacter) {
    hints.character = {
      recommendsCharacterPack: true,
      identityLock: true,
      wardrobeLock: true,
    };
  }

  return hints;
}

function buildPlatformSuggestions({ outputType, audioType = null }) {
  const base = ["Kopier tekstprompten og bruk den i valgt produksjonsverktøy."];

  if (audioType === "voice") {
    return [...base, "Forslag: ElevenLabs", "Forslag: PlayHT", "Forslag: HeyGen Voice"];
  }

  if (audioType === "music") {
    return [...base, "Forslag: Suno", "Forslag: Udio", "Forslag: Mubert"];
  }

  if (audioType === "sfx") {
    return [...base, "Forslag: ElevenLabs SFX", "Forslag: Adobe Audition", "Forslag: Reaper"];
  }

  if (outputType === "image") {
    return [...base, "Forslag: Midjourney", "Forslag: Firefly", "Forslag: Freepik AI"];
  }

  if (outputType === "video") {
    return [...base, "Forslag: Runway", "Forslag: Veo", "Forslag: Kling"];
  }

  return [...base, "Forslag: ChatGPT", "Forslag: Claude", "Forslag: Gemini"];
}

function taxonomyTags(taxonomy) {
  if (!taxonomy) return [];
  const out = [];

  if (taxonomy.domain) out.push(`domain:${taxonomy.domain}`);
  if (taxonomy.stage) out.push(`stage:${taxonomy.stage}`);
  if (taxonomy.kanal) out.push(`kanal:${taxonomy.kanal}`);
  if (taxonomy.format) out.push(`format:${taxonomy.format}`);
  if (taxonomy.mal) out.push(`mal:${taxonomy.mal}`);
  if (taxonomy.strenghet) out.push(`strenghet:${taxonomy.strenghet}`);
  if (typeof taxonomy.brandLock === "boolean") out.push(`brandLock:${taxonomy.brandLock ? "ja" : "nei"}`);
  if (typeof taxonomy.textLock === "boolean") out.push(`textLock:${taxonomy.textLock ? "ja" : "nei"}`);
  if (typeof taxonomy.productLock === "boolean") {
    out.push(`productLock:${taxonomy.productLock ? "ja" : "nei"}`);
  }

  return out;
}

function attachTaxonomy(entry, taxonomy, extraTags = []) {
  const existingMetadata =
    entry.metadata && typeof entry.metadata === "object" ? entry.metadata : {};

  return {
    ...entry,
    tags: dedupe([...(entry.tags || []), ...taxonomyTags(taxonomy), ...extraTags, TEXT_OUTPUT_POLICY_TAG]),
    metadata: {
      ...existingMetadata,
      taxonomy,
      outputPolicy: "text-only",
      mediaGeneration: false,
    },
  };
}

function standardArchitectureBlocks({
  goal,
  kanal,
  format,
  audience,
  insight,
  budskap,
  cta,
  motiv,
  miljo,
  kamera,
  lys,
  komposisjon,
  brandLocks,
  begrensninger,
  negativePreset,
  outputType,
  audioType = null,
  stemme = "",
  struktur = "",
}) {
  const audioMode = audioType === "voice" || audioType === "music" || audioType === "sfx";

  return [
    { id: "mal", title: "Mål (effekt + kanal + format)", instruction: `${goal}. Kanal ${kanal}. Format ${format}.` },
    { id: "malgruppe", title: "Målgruppe / Innsikt", instruction: `${audience}. Innsikt: ${insight}.` },
    { id: "budskap", title: "Kjernebudskap + CTA", instruction: `${budskap}. CTA: ${cta}.` },
    { id: "motiv", title: "Motiv og produkt (låste elementer)", instruction: motiv },
    { id: "miljo", title: "Miljø / kontekst", instruction: miljo },
    audioMode
      ? {
          id: "stemme",
          title: "Stemme (tone, tempo, alder, språk)",
          instruction: stemme || "Definer stemmens tone, tempo, alder, språk og tydelig uttale.",
        }
      : { id: "kamera", title: "Kamera (linse, utsnitt, bevegelse)", instruction: kamera },
    audioMode
      ? {
          id: "struktur",
          title: "Struktur (BPM, build, hook, miks)",
          instruction: struktur || "Definer BPM, hook, build, dynamikk og miksprioritet.",
        }
      : { id: "lys", title: "Lys (key/fill/rim, kvalitet, retning)", instruction: lys },
    { id: "komposisjon", title: "Komposisjon / hierarki", instruction: komposisjon },
    {
      id: "brand-locks",
      title: "Brand locks (logo, typografi, farger, DME)",
      instruction: brandLocks,
    },
    { id: "begrensninger", title: "Begrensninger", instruction: begrensninger },
    { id: "negativ", title: "Negativ preset", instruction: negativePreset },
    {
      id: "output",
      title: "Output-spesifikasjon",
      instruction: `Lever ${outputType} med produksjonsklar struktur for ${kanal} i ${format}.`,
    },
  ];
}

function standardArchitectureText(opts) {
  const blocks = standardArchitectureBlocks(opts);
  return blocks.map((block, index) => `${index + 1}) ${block.title}: ${block.instruction}`).join("\n");
}

function buildReklameStandardRules() {
  const modules = [
    {
      module: "Strategi/brief",
      appliesTo: "all",
      rules: [
        ["Definer målgruppe eksplisitt", "Målgruppe må beskrives med situasjon og friksjon, ikke bare demografi."],
        ["Definer ønsket effekt", "Velg ett primært mål: kjennskap, konvertering eller engasjement."],
        ["Definer kanal og format først", "Kanal og format skal stå tidlig for å styre komposisjon, tempo og tekstlengde."],
        ["Definer budskaphierarki", "Prioriter overskrift, støttebudskap og CTA i denne rekkefølgen."],
        ["Avgrens én hovedidé", "Prompten skal ha én tydelig kjerneidé for å redusere visuell drift."],
      ],
    },
    {
      module: "Merkevare/identitet",
      appliesTo: "all",
      rules: [
        ["Brand lock må være eksplisitt", "Distinktive merkevareelementer skal defineres som låste."],
        ["Logo lock uten deformasjon", "Logo kan ikke strekkes, roteres tilfeldig eller staves feil."],
        ["Tone of voice må spesifiseres", "Angi tydelig tone: nøktern, autoritativ, leken eller informativ."],
        ["Fargepalett skal låses", "Definer primær- og sekundærfarger som ikke skal overskrides."],
        ["Typografi må være konsekvent", "Spesifiser typografisk stil og hierarki når tekst inngår i motivet."],
      ],
    },
    {
      module: "Produkt og sannhet",
      appliesTo: "all",
      rules: [
        ["Produktfunksjon skal være korrekt", "Prompten må ikke introdusere funksjoner produktet ikke har."],
        ["Produktplassering må være stabil", "Produktets plassering og orientering skal ikke drifte mellom varianter."],
        ["Materialitet må spesifiseres", "Definer overflate, glansgrad og refleksrespons for produktet."],
        ["Skala mot menneske eller miljø", "Produktstørrelse må forankres i fysisk referanse."],
        ["Bruksøyeblikk må være plausibelt", "Vis brukssituasjon med realistisk interaksjon og fysikk."],
      ],
    },
    {
      module: "Film/foto-kontroll",
      appliesTo: "all",
      rules: [
        ["Cinematic krever kamera+lys", "Ordet filmatisk er ugyldig uten brennvidde, lysvalg og kamerabevegelse."],
        ["Lysoppsett må være spesifisert", "Ved dramatisk uttrykk skal key/fill/rim og retning beskrives."],
        ["Kameradata skal være konkrete", "Oppgi brennvidde, utsnitt, høyde og avstand."],
        ["Komposisjon må følge budskap", "Forgrunn, mellomgrunn og bakgrunn skal støtte budskaphierarkiet."],
        ["Tekstlesbarhet er produksjonskrav", "Typografisk lesbarhet skal prioriteres foran effektestetikk."],
      ],
    },
    {
      module: "Kontinuitet (video)",
      appliesTo: "video",
      rules: [
        ["Objekt-permanens i hele klippet", "Ingen objekter skal forsvinne eller oppstå uten årsak."],
        ["Identitetslås for personer", "Ansikt, klær og proporsjoner skal være stabile over tid."],
        ["Tekstlås mellom frames", "All tekst må være identisk i staveform, plassering og størrelse."],
        ["Lys- og skala-kontinuitet", "Lysretning og objektskala skal holdes konsistent i sekvensen."],
        ["Start/slutt-kompatibilitet", "Startbilde og sluttbilde skal kunne kobles med fysisk plausibel overgang."],
      ],
    },
    {
      module: "Negativ kontroll",
      appliesTo: "all",
      rules: [
        ["Bruk preset før kjøring", "Velg negativ preset før generering for å redusere feil."],
        ["Ingen feilskrift", "For reklame med tekst skal feilskrift eksplisitt forbys."],
        ["Ingen deformert logo", "Logo-deformasjon og merkevarebrudd skal eksplisitt forbys."],
        ["Ingen feil produktgeometri", "Produktform og proporsjon må ikke endres av modellen."],
        ["Stramhet skal justeres etter kanal", "Høy stramhet for video/DOOH, middels for eksplorative stillbilder."],
      ],
    },
    {
      module: "Lyd og stemme (tekst-output)",
      appliesTo: "text",
      rules: [
        ["Kun tekst-output", "Systemet skal kun levere tekstprompt som kan copy/pastes i eksterne verktøy."],
        ["Voiceover krever språk tone tempo varighet", "VO-prompts må alltid beskrive språk, tone, tempo og varighet."],
        ["Musikk krever BPM struktur varighet", "Musikkprompts må beskrive BPM, struktur (hook/build/drop) og varighet."],
        ["SFX krever kilde rom og nivå", "SFX-prompts må beskrive lydkilde, rom, avstand og nivå."],
        ["Audio-hook tidlig", "De første 1-2 sekundene må ha tydelig hook i stemme eller lyd."],
        ["Ingen rendering i prompttekst", "Prompten skal ikke inneholde instruks om intern rendering eller mediegenerering."],
      ],
    },
  ];

  const out = [];
  let idx = 1;
  for (const module of modules) {
    for (const [name, description] of module.rules) {
      const id = `reklame-standard-${String(idx).padStart(2, "0")}-${slugify(name)}`;
      out.push(
        attachTaxonomy(
          {
            id,
            name,
            category: "Reklame Standard",
            severity: module.appliesTo === "video" ? 5 : 4,
            description,
            appliesTo: module.appliesTo,
            addToPrompt: `Følg ${module.module.toLowerCase()}: ${description}`,
            negativeAdd: "Unngå vage ord og manglende kontrollkrav i reklameproduksjon.",
          },
          {
            domain: "reklame",
            stage: module.module.startsWith("Strategi") ? "strategi" : "produksjon",
            kanal: "web",
            format: "16:9",
            mal: "kjennskap",
            strenghet: "høy",
            brandLock: true,
            textLock: true,
            productLock: true,
          },
          ["pakke:reklame-standard"]
        )
      );
      idx += 1;
    }
  }

  return out;
}

function buildDebuggerRules() {
  const checks = [
    ["Mangler mål", "Flagg prompts som mangler definert mål (kjennskap/konvertering/engasjement)."],
    ["Mangler kanal og format", "Flagg prompts uten kanal og format i første seksjon."],
    ["Filmatisk uten kamera/lys", "Flagg ordet filmatisk hvis kamera- og lysdata mangler."],
    ["Mangler negativ preset", "Flagg prompts uten negativ kontrollpakke."],
    ["Video uten kontinuitetslås", "Flagg video-prompts uten objekt- og identitetslås."],
    ["Produkt uten materialitet", "Flagg produktprompts uten overflate- og materialbeskrivelse."],
    ["Mangler CTA", "Flagg reklameprompts uten konkret CTA."],
    ["Mangler brand lock", "Flagg reklameprompts uten brand lock i seksjon 9."],
    ["Mangler budskaphierarki", "Flagg hvis overskrift/støtte/CTA ikke er prioritert."],
    ["Tekst uten textLock", "Flagg teksttunge formater uten textLock=true."],
    ["DOOH uten lesbarhetskrav", "Flagg DOOH-prompts uten lesbarhetskrav og kontrastkrav."],
    ["Uklart output-format", "Flagg prompts som ikke oppgir outputType og endelig format."],
    ["Mangler tekst-output policy", "Flagg entries som mangler policy:text-output-only eller outputPolicy=text-only."],
    ["Audio uten strukturfelt", "Flagg audio-prompts uten stemme/struktur eller BPM/varighet."],
  ];

  return checks.map(([name, description], index) =>
    attachTaxonomy(
      {
        id: `debugger-${String(index + 1).padStart(2, "0")}-${slugify(name)}`,
        name: `Debugger: ${name}`,
        category: "Debugger",
        severity: 4,
        description,
        appliesTo: "all",
        addToPrompt: description,
        negativeAdd: "Unngå å kjøre prompt før kritiske mangler er løst.",
      },
      {
        domain: "reklame",
        stage: "strategi",
        kanal: "web",
        format: "16:9",
        mal: "konvertering",
        strenghet: "høy",
        brandLock: true,
        textLock: true,
        productLock: true,
      },
      ["pakke:debugger"]
    )
  );
}

function buildAntiAiLookRules() {
  const rules = [
    "Unngå plastisk hudtekstur og overdrevet skin smoothing.",
    "Unngå falske lens flares uten tydelig lyskilde.",
    "Unngå over-sharpening som skaper halo-effekt.",
    "Unngå uniformt filmkorn-overlay uten motivert sensorprofil.",
    "Unngå beauty-filter på produkter og ansikter i reklame.",
    "Unngå overmettet cyan/magenta-standardlook uten brandbegrunnelse.",
    "Unngå tilfeldig HDR-look som knuser tonalt hierarki.",
    "Unngå urealistisk øyeglans og tannhvithet i portretter.",
    "Unngå kunstig DOF som kutter kanter unaturlig.",
    "Unngå generisk CGI-glans på metall, plast og tekstiler.",
    "Unngå vannmerke-lignende artefakter i bakgrunn.",
    "Unngå mikrokontrast-overslag som gir crunchy teksturer.",
    "Unngå LUT-kollisjon mellom hudtoner og brandfarger.",
    "Unngå feilaktig motion blur-retning i raske bevegelser.",
    "Unngå uleselig tekst pga glow, bloom eller for lav kontrast.",
  ];

  return rules.map((description, index) =>
    attachTaxonomy(
      {
        id: `anti-ai-look-${String(index + 1).padStart(2, "0")}`,
        name: `Anti-AI-look ${index + 1}`,
        category: "Anti-AI-look",
        severity: 4,
        description,
        appliesTo: index >= 8 ? "video" : "all",
        addToPrompt: description,
        negativeAdd: "Unngå generisk AI-look og overprosessert finish.",
      },
      {
        domain: "reklame",
        stage: "post",
        kanal: "web",
        format: "4:5",
        mal: "kjennskap",
        strenghet: "høy",
        brandLock: true,
        textLock: true,
        productLock: true,
      },
      ["pakke:anti-ai-look"]
    )
  );
}

function buildGlossaryTerms() {
  const strategyTerms = [
    "Målgruppe",
    "Innsikt",
    "Kjernebudskap",
    "Verdiforslag",
    "Posisjonering",
    "Differensiering",
    "Budskaphierarki",
    "Call to action",
    "Merkevareløfte",
    "Avsenderidentitet",
    "Distinktive merkevareelementer",
    "Mental tilgjengelighet",
    "Merkesalience",
    "Kategoriinngang",
    "Kjøpsutløser",
    "Friksjonspunkt",
    "Funksjonelt bevis",
    "Emosjonelt bevis",
    "Tonalitet",
    "Narrativ kjerne",
    "Kampanjevinkel",
    "Primærpåstand",
    "Sekundærpåstand",
    "Konverteringsbarriere",
    "Mikromålgruppe",
    "Segmentprioritet",
    "Kommunikasjonsmål",
    "Effektmåling",
    "Kanalpassform",
    "Formatlogikk",
  ];

  const photoTerms = [
    "Nøkkellys",
    "Fill-lys",
    "Kantlys",
    "Lysratio",
    "Fargetemperatur",
    "Mikrokontrast",
    "Dybdeskarphet",
    "Fokusplan",
    "Teksturlesbarhet",
    "Høylysbevaring",
    "Skyggetegning",
    "Specular kontroll",
    "Diffus refleksjon",
    "Polariseringskontroll",
    "Subsurface scattering",
    "Hardt topplys",
    "Mykt sidelys",
    "Volumetrisk lys",
    "Lysfall",
    "Kontrastkurve",
    "Eksponeringslås",
    "Hvitbalanse",
    "Fargetoneseparasjon",
    "Bokeh-karakter",
    "Luminansbalanse",
    "Highlight roll-off",
    "Skyggekvalitet",
    "Lysretning",
    "Reflekskontroll",
    "Sensorprofil",
  ];

  const filmTerms = [
    "Establishing shot",
    "Shot-reverse-shot",
    "180-gradersregelen",
    "Romakse",
    "Blokkeringsprinsipp",
    "Tempo",
    "Klippelogikk",
    "L-cut",
    "J-cut",
    "Rack focus",
    "Crash zoom",
    "Dolly-inn",
    "Dolly-ut",
    "Panorering",
    "Tilt",
    "Handheld mikro-jitter",
    "Locked-off kamera",
    "Kontinuitetsklipp",
    "Match cut",
    "Eyeline match",
    "Action cut",
    "Temporal konsistens",
    "Objekt-permanens",
    "Identitetsdrift",
    "Komposisjonsdrift",
    "Skalahopp",
    "Lyskontinuitet",
    "Scene-lås",
    "Start/slutt-kompatibilitet",
    "Beat-struktur",
  ];

  const copyTerms = [
    "Overskrift",
    "Underrubrik",
    "Brødtekst",
    "Rytme",
    "Kognitiv letthet",
    "Semantisk presisjon",
    "Aktiv stemme",
    "Friksjonsfri CTA",
    "Språklig økonomi",
    "Verbal identitet",
    "Budskapsprioritet",
    "Språkregister",
    "Troverdighetsmarkør",
    "Spisset nytte",
    "Handlingsverb",
    "Teksthierarki",
    "Mikrokopi",
    "Konkretisering",
    "Forbeholdslogikk",
    "Sannhetskrav",
    "Løftepresisjon",
    "Konverteringsformulering",
    "Lesbarhetsnivå",
    "Setningslengdekontroll",
    "On-screen tekst",
    "Voice-over linje",
    "Claim-styring",
    "Benefit-ramme",
    "Proof point",
    "Språk-konsistens",
  ];

  const audioTerms = [
    "Voiceover-tone",
    "Stemmealder",
    "Taletempo",
    "Uttale-presisjon",
    "Pauselengde",
    "Frasebetoning",
    "On-beat levering",
    "BPM",
    "Intro-hook",
    "Build",
    "Drop",
    "Outro-tag",
    "Miksprioritet",
    "Dynamisk range",
    "SFX-lagdeling",
    "Ambience-bed",
    "Romklangstype",
    "Transient-kontroll",
    "Sidechain-demping",
    "Støygulv",
    "Lydnivå-normalisering",
    "VO-tekstlengde",
    "Pustekontroll",
    "Lydkilde-avstand",
    "Mono-kompatibilitet",
    "Stereo-bredde",
    "Hook innen 2 sek",
    "Tempo-bro",
    "Jingle-signatur",
    "SFX-hitpoint",
  ];

  const layoutTerms = [
    "Grid-system",
    "Modulskala",
    "Visuell vekt",
    "Whitespace-kontroll",
    "Fokalpunkt",
    "Kontrastforhold",
    "Typografisk skala",
    "Linjelengde",
    "Radavstand",
    "DOOH-leseavstand",
    "CTA-prioritet",
    "Eye-path",
    "Fold-hierarki",
    "Safe area",
    "Banner-sone",
    "Fargekontrast AA",
    "Merkefarge-dominans",
    "Logo-clearspace",
    "Kantpadding",
    "Visuell redundans",
    "Informasjonstetthet",
    "Mikrokontrast for tekst",
    "Formatadaptasjon",
    "Responsivt hierarki",
    "Bevegelseshierarki",
    "Skjermrytme",
    "Hook-frame",
    "Tekstblokkbalanse",
    "Leseordre",
    "Konverteringspunkt",
  ];

  const architectureTerms = [
    "Arkitektonisk elevasjon",
    "Explodert aksjonometri",
    "Assembly-forward",
    "Ortografisk fasade",
    "Plan-geometri",
    "Snittlinje",
    "Akselinje",
    "Siktlinje",
    "Volumhierarki",
    "Modulrytme",
    "Materialpalett",
    "Konstruksjonslogikk",
    "Skaleringsreferanse",
    "Fasaderaster",
    "Målbar geometri",
    "Romhierarki",
    "Terskelsoner",
    "Funksjonell flyt",
    "Teknisk snitt",
    "Detaljnivå LOD",
  ];

  const clusterConfig = [
    { source: strategyTerms, domain: "design", cluster: "reklamestrategi" },
    { source: photoTerms, domain: "photo", cluster: "foto-lys" },
    { source: filmTerms, domain: "film", cluster: "film-klipp" },
    { source: copyTerms, domain: "design", cluster: "copy-tekst" },
    { source: audioTerms, domain: "vfx", cluster: "audio-produksjon" },
    { source: layoutTerms, domain: "design", cluster: "layout-design" },
    { source: architectureTerms, domain: "arch", cluster: "arkitektur-rom" },
  ];

  const all = [];
  for (const cfg of clusterConfig) {
    for (const termNo of cfg.source) {
      const slug = `${slugify(termNo)}-${cfg.domain}`;
      const before = `Før: "Lag ${termNo.toLowerCase()}."`;
      const after = `Etter: "Definer ${termNo.toLowerCase()} med tydelig funksjon i budskaphierarkiet."`;
      all.push(
        attachTaxonomy(
          {
            slug,
            term_no: termNo,
            term_en: termNo,
            domain: cfg.domain,
            definition_no: `${termNo} er et fagbegrep som styrer kvalitet og kontroll i reklameprompten.`,
            promptImpact: `${termNo} reduserer tolkingsrom og gir mer stabilt, produksjonsklart output.`,
            examples: [before, after],
            relatedTerms: [],
            aliases: [],
          },
          {
            domain: cfg.cluster === "copy-tekst" ? "copy" : cfg.cluster === "reklamestrategi" ? "reklame" : cfg.cluster,
            stage: cfg.cluster === "reklamestrategi" ? "strategi" : cfg.cluster === "copy-tekst" ? "konsept" : "produksjon",
            kanal: "web",
            format: "16:9",
            mal: "kjennskap",
            strenghet: "middels",
            brandLock: true,
            textLock: true,
            productLock: false,
          },
          [`klynge:${cfg.cluster}`]
        )
      );
    }
  }

  return all;
}

function buildNegativePresets() {
  const presets = [
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
      taxonomy: {
        domain: "reklame",
        stage: "produksjon",
        kanal: "web",
        format: "16:9",
        mal: "kjennskap",
        strenghet: "høy",
        brandLock: true,
        textLock: true,
        productLock: true,
      },
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
        "Ingen CGI-look",
        "Ingen anime-stil",
        "Ingen watercolor-stil",
        "Ingen illustrative filter",
      ],
      taxonomy: {
        domain: "reklame",
        stage: "post",
        kanal: "web",
        format: "4:5",
        mal: "kjennskap",
        strenghet: "høy",
        brandLock: true,
        textLock: true,
        productLock: true,
      },
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
      taxonomy: {
        domain: "film",
        stage: "produksjon",
        kanal: "SoMe",
        format: "9:16",
        mal: "engasjement",
        strenghet: "høy",
        brandLock: true,
        textLock: true,
        productLock: true,
      },
    },
    {
      id: "preset-d-reklame-kvalitet",
      title: "Reklame-kvalitet",
      description: "For kommersiell kvalitetssikring av tekst, logo og produkt.",
      items: [
        "Ingen feilskrift i overskrift eller CTA",
        "Ingen deformert logo",
        "Ingen feil produktgeometri",
        "Ingen feil merkefarger",
        "Ingen uleselig tekst",
        "Ingen tilfeldig språkblanding",
        "Ingen uforankret claims",
      ],
      taxonomy: {
        domain: "reklame",
        stage: "publisering",
        kanal: "DOOH",
        format: "banner",
        mal: "konvertering",
        strenghet: "høy",
        brandLock: true,
        textLock: true,
        productLock: true,
      },
    },
    {
      id: "preset-e-audio-konsistens",
      title: "Audio-konsistens",
      description: "For voice, musikk og SFX der timing, nivå og tydelighet må være stabilt.",
      items: [
        "Ingen utydelig språkblanding i voiceover",
        "Ingen tilfeldig tempoendring uten beat-overgang",
        "Ingen clipping eller forvrengning",
        "Ingen masking av CTA med musikknivå",
        "Ingen tilfeldig romklang mellom takes",
        "Ingen manglende hook i åpning",
        "Ingen SFX som kolliderer med hovedbudskap",
        "Ingen udefinert BPM i musikkprompt",
      ],
      taxonomy: {
        domain: "reklame",
        stage: "post",
        kanal: "SoMe",
        format: "9:16",
        mal: "engasjement",
        strenghet: "høy",
        brandLock: true,
        textLock: true,
        productLock: false,
      },
    },
  ];

  return presets.map((preset) =>
    attachTaxonomy(
      {
        id: preset.id,
        title: preset.title,
        description: preset.description,
        items: preset.items,
      },
      preset.taxonomy,
      ["pakke:negative-presets"]
    )
  );
}

function buildTemplates() {
  const categories = [
    {
      key: "produkt-still",
      label: "Produktreklame still",
      outputType: "image",
      domain: "produkt",
      kanal: ["web", "print", "DOOH", "SoMe"],
      format: ["1:1", "4:5", "16:9", "banner"],
      mal: ["kjennskap", "konvertering"],
      stage: "produksjon",
      preset: "preset-b-anti-ai-look",
    },
    {
      key: "produkt-video",
      label: "Produktreklame video",
      outputType: "video",
      domain: "film-vfx",
      kanal: ["SoMe", "TV", "web"],
      format: ["9:16", "16:9", "1:1"],
      mal: ["engasjement", "konvertering"],
      stage: "produksjon",
      preset: "preset-c-video-kontinuitet",
    },
    {
      key: "brand-identitet",
      label: "Brand og identitet",
      outputType: "image",
      domain: "design-system",
      kanal: ["web", "print", "DOOH"],
      format: ["1:1", "16:9", "banner"],
      mal: ["kjennskap"],
      stage: "konsept",
      preset: "preset-d-reklame-kvalitet",
    },
    {
      key: "dooh-plakat",
      label: "DOOH og plakat",
      outputType: "image",
      domain: "redaksjonell",
      kanal: ["DOOH", "print"],
      format: ["16:9", "4:5", "banner"],
      mal: ["kjennskap", "konvertering"],
      stage: "publisering",
      preset: "preset-d-reklame-kvalitet",
    },
    {
      key: "some-hook",
      label: "SoMe hook",
      outputType: "video",
      domain: "sosiale-medier",
      kanal: ["SoMe", "web"],
      format: ["9:16", "1:1", "4:5"],
      mal: ["engasjement", "konvertering"],
      stage: "produksjon",
      preset: "preset-c-video-kontinuitet",
    },
    {
      key: "voiceover-manus",
      label: "Voiceover og dialogmanus",
      outputType: "text",
      domain: "redaksjonell",
      kanal: ["SoMe", "TV", "web"],
      format: ["9:16", "16:9", "1:1"],
      mal: ["engasjement", "konvertering"],
      stage: "konsept",
      preset: "preset-e-audio-konsistens",
      audioType: "voice",
      durationOptions: [6, 10, 15],
    },
    {
      key: "musikk-bed",
      label: "Musikk-bed og jingle",
      outputType: "text",
      domain: "film-vfx",
      kanal: ["SoMe", "TV", "web"],
      format: ["9:16", "16:9", "1:1"],
      mal: ["kjennskap", "engasjement"],
      stage: "post",
      preset: "preset-e-audio-konsistens",
      audioType: "music",
      durationOptions: [6, 10, 15],
    },
    {
      key: "sfx-ambience",
      label: "SFX og ambience",
      outputType: "text",
      domain: "film-vfx",
      kanal: ["SoMe", "TV", "web"],
      format: ["9:16", "16:9", "1:1"],
      mal: ["engasjement", "konvertering"],
      stage: "post",
      preset: "preset-e-audio-konsistens",
      audioType: "sfx",
      durationOptions: [3, 6, 10],
    },
  ];

  const audiences = ["SMB-eier med tidsmangel", "Markedsleder med høyt tempo", "Innholdsprodusent med publiseringspress"];
  const insights = [
    "Målgruppen velger løsningen som er enklest å forstå på få sekunder",
    "Tydelig produktnytte slår visuell støy i feed",
    "Merkevaren må kjennes igjen før CTA har effekt",
  ];
  const motivs = [
    "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri",
    "Produkt i realistisk miljø med synlig funksjon i kontekst",
    "Produkt og avsender i samme bilde for klar avsenderidentitet",
  ];
  const miljos = [
    "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn",
    "Nøytral studio-setting med lesbar materialitet",
    "Bymiljø med moderat aktivitet uten å stjele fokus",
  ];
  const kameraer = [
    "50mm, halvnært utsnitt, statisk kamera",
    "35mm, medium shot, rolig dolly-inn",
    "85mm, nærbilde, låst horisont",
  ];
  const lysvalg = [
    "Key 45 grader, myk fill, rim for separasjon",
    "Hardt key med kontrollert fill og nøytral fargetemperatur",
    "Naturlig vinduslys med subtil fill og presis skyggekontroll",
  ];
  const komposisjoner = [
    "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne",
    "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn",
    "Tydelig visuell hierarki: overskrift, produkt, CTA",
  ];
  const ctas = ["Bestill demo", "Prøv gratis", "Se løsningen", "Kontakt oss", "Lær mer"];

  const out = [];

  for (const category of categories) {
    for (let i = 0; i < 20; i += 1) {
      const kanal = category.kanal[i % category.kanal.length];
      const format = category.format[i % category.format.length];
      const mal = category.mal[i % category.mal.length];
      const audience = audiences[i % audiences.length];
      const insight = insights[i % insights.length];
      const motiv = motivs[i % motivs.length];
      const miljo = miljos[i % miljos.length];
      const kamera = kameraer[i % kameraer.length];
      const lys = lysvalg[i % lysvalg.length];
      const komposisjon = komposisjoner[i % komposisjoner.length];
      const cta = ctas[i % ctas.length];
      const strenghet = category.outputType === "video" ? "høy" : i % 2 === 0 ? "middels" : "høy";
      const audioType = category.audioType || null;
      const durationSeconds =
        Array.isArray(category.durationOptions) && category.durationOptions.length
          ? category.durationOptions[i % category.durationOptions.length]
          : category.outputType === "video"
          ? 10
          : null;
      const taxonomy = {
        domain: "reklame",
        stage: category.stage,
        kanal,
        format,
        mal,
        strenghet,
        brandLock: true,
        textLock: true,
        productLock: true,
      };
      const platformSuggestions = buildPlatformSuggestions({ outputType: category.outputType, audioType });
      const productionHints = buildProductionHints({
        outputType: category.outputType,
        taxonomy,
        audioType,
        durationSeconds,
        includeCharacter: category.outputType === "video",
      });
      const stemme =
        audioType === "voice"
          ? "Norsk bokmål, tydelig uttale, autoritativ men varm tone, tempo 145 ord/min."
          : audioType === "music"
          ? "Ingen voiceover. Beskriv i stedet sonisk karakter og eventuelle vokale ad-libs uten tekstclaim."
          : audioType === "sfx"
          ? "Ingen voiceover. Fokuser på SFX-lag med tydelig kilde og avstand."
          : "";
      const struktur =
        audioType === "voice"
          ? `Varighet ${durationSeconds || 10}s. Hook 0-2s, nytte 2-7s, CTA 7-${durationSeconds || 10}s.`
          : audioType === "music"
          ? `BPM ${durationSeconds && durationSeconds <= 6 ? 118 : 124}. Intro-hook, build, kort drop, tydelig outro innen ${durationSeconds || 10}s.`
          : audioType === "sfx"
          ? `Lagdeling av ambience + impact + UI/SFX-hitpoints. Varighet ${durationSeconds || 6}s med kontrollert nivåbalanse.`
          : "";

      const title = `${category.label} ${String(i + 1).padStart(2, "0")} (${kanal} ${format})`;
      const id = `${category.key}-${String(i + 1).padStart(2, "0")}`;

      const blocks = standardArchitectureBlocks({
        goal: mal,
        kanal,
        format,
        audience,
        insight,
        budskap: "Produktet løser en konkret friksjon raskt og tydelig.",
        cta,
        motiv,
        miljo,
        kamera,
        lys,
        komposisjon,
        brandLocks:
          "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter.",
        begrensninger:
          "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief.",
        negativePreset: category.preset,
        outputType: category.outputType,
        audioType,
        stemme,
        struktur,
      });

      out.push(
        attachTaxonomy(
          {
            id,
            title,
            useCase: `Reklamefaglig mal for ${category.label.toLowerCase()} med fokus på ${mal} og ${kanal}.`,
            outputType: category.outputType,
            domain: category.domain,
            blocks,
            recommendedRules: [
              "reklame-standard-01-definer-malgruppe-eksplisitt",
              "reklame-standard-03-definer-kanal-og-format-forst",
              "reklame-standard-07-logo-lock-uten-deformasjon",
              "reklame-standard-30-stramhet-skal-justeres-etter-kanal",
            ],
            metadata: {
              recommendedNegativePreset: category.preset,
              platformSuggestions,
              productionHints,
            },
          },
          taxonomy,
          [`kategori:${category.key}`]
        )
      );
    }
  }

  const skoleTemplates = [
    {
      id: "skolepakke-oppgave-01",
      title: "Skolepakke: Produktbrief 9:16",
      useCase: "Oppgave: bygg en komplett produktprompt for SoMe-video.",
      outputType: "video",
      domain: "sosiale-medier",
      mal: "konvertering",
      kanal: "SoMe",
      format: "9:16",
      stage: "strategi",
    },
    {
      id: "skolepakke-oppgave-02",
      title: "Skolepakke: Brand lock i kampanjebilde",
      useCase: "Oppgave: sikre brand-konsistens i stillbilde.",
      outputType: "image",
      domain: "design-system",
      mal: "kjennskap",
      kanal: "web",
      format: "1:1",
      stage: "konsept",
    },
    {
      id: "skolepakke-oppgave-03",
      title: "Skolepakke: DOOH lesbarhet",
      useCase: "Oppgave: optimaliser teksthierarki for storformat.",
      outputType: "image",
      domain: "redaksjonell",
      mal: "kjennskap",
      kanal: "DOOH",
      format: "16:9",
      stage: "publisering",
    },
    {
      id: "skolepakke-oppgave-04",
      title: "Skolepakke: Video-kontinuitet 10 sek",
      useCase: "Oppgave: hold identitet, tekst og produkt stabilt i video.",
      outputType: "video",
      domain: "film-vfx",
      mal: "engasjement",
      kanal: "web",
      format: "16:9",
      stage: "produksjon",
    },
    {
      id: "skolepakke-oppgave-05",
      title: "Skolepakke: Copy med friksjonsfri CTA",
      useCase: "Oppgave: skriv prompt for tekstvariant med tydelig CTA.",
      outputType: "text",
      domain: "redaksjonell",
      mal: "konvertering",
      kanal: "web",
      format: "banner",
      stage: "strategi",
    },
    {
      id: "skolepakke-rubrikk-v1",
      title: "Skolepakke: Vurderingsrubrikk",
      useCase: "Rubrikk for å evaluere mål, budskap, brand-lock og teknisk kontroll i prompt.",
      outputType: "text",
      domain: "redaksjonell",
      mal: "engasjement",
      kanal: "web",
      format: "16:9",
      stage: "publisering",
    },
  ];

  for (const seed of skoleTemplates) {
    const taxonomy = {
      domain: "reklame",
      stage: seed.stage,
      kanal: seed.kanal,
      format: seed.format,
      mal: seed.mal,
      strenghet: "høy",
      brandLock: true,
      textLock: true,
      productLock: true,
    };
    const platformSuggestions = buildPlatformSuggestions({ outputType: seed.outputType });
    const productionHints = buildProductionHints({
      outputType: seed.outputType,
      taxonomy,
      durationSeconds: seed.outputType === "video" ? 10 : null,
      includeCharacter: seed.outputType === "video",
    });

    out.push(
      attachTaxonomy(
        {
          id: seed.id,
          title: seed.title,
          useCase: seed.useCase,
          outputType: seed.outputType,
          domain: seed.domain,
          blocks: standardArchitectureBlocks({
            goal: seed.mal,
            kanal: seed.kanal,
            format: seed.format,
            audience: "Student eller junior kreatør",
            insight: "Øvelser med tydelig fasit gir rask læring.",
            budskap: "Løs oppgaven med konkret produksjonskontroll.",
            cta: "Lever promptutkast",
            motiv: "Oppgaven skal beskrive motiv og produkt med låste elementer.",
            miljo: "Bruk realistisk kontekst tilpasset kanal.",
            kamera: "Kamera og utsnitt skal støtte budskap og format.",
            lys: "Lysvalg skal være fysisk plausibelt og konsistent.",
            komposisjon: "Hierarki: overskrift, produkt, CTA.",
            brandLocks: "Brand lock, text lock og product lock skal vurderes eksplisitt.",
            begrensninger: "Ingen feilskrift, ingen logo-deformasjon, ingen geometriavvik.",
            negativePreset: "preset-d-reklame-kvalitet",
            outputType: seed.outputType,
          }),
          recommendedRules: [
            "reklame-standard-01-definer-malgruppe-eksplisitt",
            "reklame-standard-04-definer-budskaphierarki",
            "reklame-standard-15-kameradata-skal-vaere-konkrete",
            "reklame-standard-29-ingen-feil-produktgeometri",
          ],
          metadata: {
            recommendedNegativePreset: "preset-d-reklame-kvalitet",
            skolepakke: true,
            platformSuggestions,
            productionHints,
          },
        },
        taxonomy,
        ["pakke:skolepakke-1-0"]
      )
    );
  }

  return out;
}

function buildExamples() {
  const baseScenarios = [
    ["kampanjebilde for kaffeabonnement", "Produkt i bruk ved frokostbord"],
    ["annonsering av strømavtale", "Person som bytter avtale i mobilapp"],
    ["lansering av elsykkel", "Pendler i urbant miljø med produkt i fokus"],
    ["forsikringskampanje", "Familie i hjemmemiljø med trygghetsbudskap"],
    ["SaaS-verktøy for SMB", "Skjermnær demo av dashboard og verdi"],
    ["helsekost-produkt", "Packshot med materialitet og tydelig claim"],
    ["reiseapp kampanje", "Mobil i hånd med tydelig booking-flow"],
    ["B2B-event", "Scenevisual med foredragsholder og CTA"],
    ["bankprodukt", "Nøktern scene med trygg tone og klar CTA"],
    ["rekrutteringskampanje", "Team-motiv med tydelig avsenderidentitet"],
  ];

  const antiLookScenarios = [
    "hud blir plastisk og overglattet",
    "logo får warping",
    "tekst blir uleselig i motion",
    "falske lens flares dominerer motivet",
    "for mye sharpening og halo",
    "fargegradering kolliderer med brandfarger",
    "kunstige hender i produktscene",
    "bakgrunn morpher mellom klipp",
    "produktets materiale ser syntetisk ut",
    "filmkorn ser lagt oppå som filter",
    "motion blur går i feil retning",
    "høylys klipper ut uten detalj",
    "ansikt mister identitet i sekvens",
    "tekster hopper mellom frames",
    "produktgeometri endrer seg i overgang",
  ];

  const out = [];
  const ruleIds = [
    "reklame-standard-01-definer-malgruppe-eksplisitt",
    "reklame-standard-03-definer-kanal-og-format-forst",
    "reklame-standard-04-definer-budskaphierarki",
    "reklame-standard-07-logo-lock-uten-deformasjon",
    "reklame-standard-16-komposisjon-ma-folge-budskap",
    "reklame-standard-30-stramhet-skal-justeres-etter-kanal",
  ];

  for (let i = 0; i < baseScenarios.length; i += 1) {
    const [scenario, motiv] = baseScenarios[i];
    const kanal = i % 2 === 0 ? "web" : "SoMe";
    const format = i % 2 === 0 ? "16:9" : "9:16";
    const outputType = i % 3 === 0 ? "video" : "image";
    const taxonomy = {
      domain: "reklame",
      stage: "produksjon",
      kanal,
      format,
      mal: i % 2 === 0 ? "konvertering" : "kjennskap",
      strenghet: "høy",
      brandLock: true,
      textLock: true,
      productLock: true,
    };
    const platformSuggestions = buildPlatformSuggestions({ outputType });
    const productionHints = buildProductionHints({
      outputType,
      taxonomy,
      durationSeconds: outputType === "video" ? 10 : null,
      includeCharacter: outputType === "video",
    });

    out.push(
      attachTaxonomy(
        {
          slug: `reklame-eksempel-${String(i + 1).padStart(2, "0")}`,
          title: `Reklameeksempel ${String(i + 1).padStart(2, "0")}`,
          outputType,
          domain: outputType === "video" ? "film-vfx" : "produkt",
          shortInput: `Lag ${scenario} i ${format} for ${kanal}.`,
          longOutput: standardArchitectureText({
            goal: i % 2 === 0 ? "konvertering" : "kjennskap",
            kanal,
            format,
            audience: "Norsk beslutningstaker med kort oppmerksomhetsspenn",
            insight: "Tydelig nytte og klar avsender øker respons.",
            budskap: `Løsningen i scenen skal tydelig kommunisere ${scenario}.`,
            cta: "Lær mer",
            motiv: `${motiv}. Produktgeometri og merkevareelementer skal være låst.`,
            miljo: "Hverdagsnær kontekst med realistiske overflater.",
            kamera: "35mm eller 50mm, medium utsnitt, fysisk plausibel bevegelse.",
            lys: "Definer key/fill/rim, nøytral fargetemperatur og stabil retning.",
            komposisjon: "Overskrift først, produkt deretter, CTA til slutt.",
            brandLocks: "Logo, typografi og fargepalett er låst i alle varianter.",
            begrensninger: "Ingen feilskrift, ingen ekstra objekter, ingen avvik i produktform.",
            negativePreset: outputType === "video" ? "preset-c-video-kontinuitet" : "preset-d-reklame-kvalitet",
            outputType,
          }),
          whyWorks: [
            "Prompten starter med mål, kanal og format.",
            "Budskap og CTA er eksplisitt hierarkisert.",
            "Brand-lock og negativ preset reduserer reklamefeil.",
          ],
          ruleIds,
          termSlugs: ["malgruppe-design", "nokkellys-photo", "shot-reverse-shot-film"],
          updatedAt: "2026-02-23",
          negativePreset: outputType === "video" ? "preset-c-video-kontinuitet" : "preset-d-reklame-kvalitet",
          metadata: {
            platformSuggestions,
            productionHints,
          },
        },
        taxonomy,
        ["pakke:reklame-eksempler"]
      )
    );
  }

  for (let i = 0; i < antiLookScenarios.length; i += 1) {
    const issue = antiLookScenarios[i];
    const outputType = i % 2 === 0 ? "image" : "video";
    const taxonomy = {
      domain: "reklame",
      stage: "post",
      kanal: i % 2 === 0 ? "web" : "SoMe",
      format: i % 2 === 0 ? "4:5" : "9:16",
      mal: "kjennskap",
      strenghet: "høy",
      brandLock: true,
      textLock: true,
      productLock: true,
    };
    const platformSuggestions = buildPlatformSuggestions({ outputType });
    const productionHints = buildProductionHints({
      outputType,
      taxonomy,
      durationSeconds: outputType === "video" ? 8 : null,
      includeCharacter: outputType === "video",
    });

    out.push(
      attachTaxonomy(
        {
          slug: `anti-ai-look-eksempel-${String(i + 1).padStart(2, "0")}`,
          title: `Anti-AI-look eksempel ${String(i + 1).padStart(2, "0")}`,
          outputType,
          domain: i % 2 === 0 ? "produkt" : "film-vfx",
          shortInput: `Lag reklameprompt som unngår at ${issue}.`,
          longOutput: standardArchitectureText({
            goal: "kjennskap",
            kanal: taxonomy.kanal,
            format: taxonomy.format,
            audience: "Markedsteam som trenger profesjonell visuell kvalitet",
            insight: "Overprosessert AI-look reduserer tillit til avsender.",
            budskap: "Vis produktet troverdig uten visuelle artefakter.",
            cta: "Se produktet",
            motiv: "Produkt i bruk, stabil identitet og materialitet.",
            miljo: "Nøktern kommersiell setting uten distraksjoner.",
            kamera: "50mm, rolig kameraføring og kontrollerte utsnitt.",
            lys: "Key/fill/rim med realistisk kontrast, ingen falske flares.",
            komposisjon: "Hierarki: produkt, budskap, CTA.",
            brandLocks: "Merkefarger og logo holdes konsistent.",
            begrensninger: `Unngå ${issue}.`,
            negativePreset: "preset-b-anti-ai-look",
            outputType,
          }),
          whyWorks: [
            "Konkret negativ kontroll mot kjent AI-artefakt.",
            "Fysisk lys- og materiallogikk gir mer troverdig resultat.",
            "Brand-lock sikrer kommersiell konsistens.",
          ],
          ruleIds: [
            "anti-ai-look-01",
            "anti-ai-look-03",
            "anti-ai-look-05",
            "anti-ai-look-10",
            "anti-ai-look-15",
          ],
          termSlugs: ["mikrokontrast-photo", "lysratio-photo", "sprak-konsistens-design"],
          updatedAt: "2026-02-23",
          negativePreset: "preset-b-anti-ai-look",
          metadata: {
            platformSuggestions,
            productionHints,
          },
        },
        taxonomy,
        ["pakke:anti-ai-look"]
      )
    );
  }

  for (let i = 0; i < 10; i += 1) {
    const outputType = i % 2 === 0 ? "video" : "image";
    const taxonomy = {
      domain: "reklame",
      stage: "strategi",
      kanal: i % 2 === 0 ? "SoMe" : "web",
      format: i % 2 === 0 ? "9:16" : "1:1",
      mal: i % 3 === 0 ? "engasjement" : "konvertering",
      strenghet: "høy",
      brandLock: true,
      textLock: true,
      productLock: true,
    };
    const platformSuggestions = buildPlatformSuggestions({ outputType });
    const productionHints = buildProductionHints({
      outputType,
      taxonomy,
      durationSeconds: outputType === "video" ? 10 : null,
      includeCharacter: outputType === "video",
    });

    out.push(
      attachTaxonomy(
        {
          slug: `skolepakke-fasit-${String(i + 1).padStart(2, "0")}`,
          title: `Skolepakke fasit ${String(i + 1).padStart(2, "0")}`,
          outputType,
          domain: i % 2 === 0 ? "sosiale-medier" : "produkt",
          shortInput: `Oppgave ${i + 1}: Lag reklameprompt med tydelig målgruppe, budskap og CTA.`,
          longOutput: standardArchitectureText({
            goal: taxonomy.mal,
            kanal: taxonomy.kanal,
            format: taxonomy.format,
            audience: "Junior kreatør i skolepakke",
            insight: "Klar struktur gir bedre produksjonskontroll.",
            budskap: "Løs en tydelig reklameoppgave med presise rammer.",
            cta: "Lever utkast",
            motiv: "Produkt og avsender må være stabile gjennom hele leveransen.",
            miljo: "Reell kontekst tilpasset kanal og format.",
            kamera: "Definer linse, utsnitt og bevegelse før stilord brukes.",
            lys: "Key/fill/rim med realistisk retning og intensitet.",
            komposisjon: "Budskaphierarki med lesbar CTA.",
            brandLocks: "Logo, typografi, farger og DME låses eksplisitt.",
            begrensninger: "Ingen feilskrift, ingen logo-endringer, ingen produktdrift.",
            negativePreset: "preset-d-reklame-kvalitet",
            outputType,
          }),
          whyWorks: [
            "Følger standardarkitektur i korrekt rekkefølge.",
            "Knytter målgruppe, budskap og kanal sammen.",
            "Bruker negativ preset for QA-klar leveranse.",
          ],
          ruleIds: [
            "reklame-standard-01-definer-malgruppe-eksplisitt",
            "reklame-standard-04-definer-budskaphierarki",
            "reklame-standard-26-bruk-preset-for-kjoring",
          ],
          termSlugs: ["budskaphierarki-design", "friksjonsfri-cta-design", "objekt-permanens-film"],
          updatedAt: "2026-02-23",
          negativePreset: "preset-d-reklame-kvalitet",
          metadata: {
            skolepakke: true,
            platformSuggestions,
            productionHints,
          },
        },
        taxonomy,
        ["pakke:skolepakke-1-0"]
      )
    );
  }

  const audioScenarios = [
    {
      slug: "audio-voiceover-kaffe-10s",
      title: "Audio: Voiceover 10s for kaffeprodukt",
      audioType: "voice",
      domain: "redaksjonell",
      kanal: "SoMe",
      format: "9:16",
      mal: "konvertering",
      durationSeconds: 10,
      shortInput: "Lag norsk voiceover-manus på 10 sek for et kaffeabonnement med tydelig CTA.",
      insight: "Lytteren avgjør på få sekunder om budskapet er relevant.",
      budskap: "Abonnementet gir fersk kaffe levert før jobbstart.",
      cta: "Start prøveperiode",
    },
    {
      slug: "audio-music-bed-15s",
      title: "Audio: Musikk-bed 15s for produktlansering",
      audioType: "music",
      domain: "film-vfx",
      kanal: "TV",
      format: "16:9",
      mal: "kjennskap",
      durationSeconds: 15,
      shortInput: "Lag en musikkprompt for 15 sek reklamebed med tydelig hook og ren outro.",
      insight: "Musikken må støtte merkevaren uten å overdøve budskapet.",
      budskap: "Ny produktlinje med premium følelse og høy klarhet.",
      cta: "Se lanseringen",
    },
    {
      slug: "audio-sfx-ambience-6s",
      title: "Audio: SFX/ambience 6s for app-annonse",
      audioType: "sfx",
      domain: "film-vfx",
      kanal: "web",
      format: "1:1",
      mal: "engasjement",
      durationSeconds: 6,
      shortInput: "Lag SFX-prompt for kort app-spot med tydelig UI-lyd og ren bakgrunn.",
      insight: "Små lydeffekter må støtte handling uten å skape støy.",
      budskap: "Appen gjør daglige oppgaver raskere.",
      cta: "Prøv appen",
    },
    {
      slug: "audio-voiceover-dooh-8s",
      title: "Audio: Voiceover 8s for DOOH-kompanjong",
      audioType: "voice",
      domain: "redaksjonell",
      kanal: "DOOH",
      format: "16:9",
      mal: "kjennskap",
      durationSeconds: 8,
      shortInput: "Lag en kort norsk voiceover med høy tydelighet til DOOH-støtteklipp.",
      insight: "Kort, tydelig språk fungerer best ved høy trafikk og lav oppmerksomhet.",
      budskap: "Tjenesten sparer tid hver uke.",
      cta: "Les mer",
    },
    {
      slug: "audio-music-bed-some-6s",
      title: "Audio: Musikk-hook 6s for SoMe",
      audioType: "music",
      domain: "film-vfx",
      kanal: "SoMe",
      format: "9:16",
      mal: "engasjement",
      durationSeconds: 6,
      shortInput: "Lag en 6-sekunders musikkprompt med rask hook for SoMe.",
      insight: "Hook i første sekund øker sannsynlighet for fullført visning.",
      budskap: "Produktet føles lett og raskt i bruk.",
      cta: "Se hvordan",
    },
    {
      slug: "audio-sfx-produkt-hitpoint-10s",
      title: "Audio: SFX-hitpoints for 10s produktdemo",
      audioType: "sfx",
      domain: "film-vfx",
      kanal: "web",
      format: "16:9",
      mal: "konvertering",
      durationSeconds: 10,
      shortInput: "Lag SFX-prompt med hitpoints til en 10s produktdemo.",
      insight: "Riktige hitpoints styrker opplevd kvalitet i korte produktdemoer.",
      budskap: "Produktet er intuitivt og effektivt.",
      cta: "Bestill demo",
    },
    {
      slug: "audio-voiceover-b2b-12s",
      title: "Audio: B2B voiceover 12s",
      audioType: "voice",
      domain: "redaksjonell",
      kanal: "web",
      format: "16:9",
      mal: "konvertering",
      durationSeconds: 12,
      shortInput: "Lag en profesjonell B2B voiceover-prompt med autoritativ tone på norsk.",
      insight: "B2B-publikum responderer best på konkrete nyttepåstander.",
      budskap: "Løsningen reduserer manuelle timer og feilrate.",
      cta: "Book møte",
    },
    {
      slug: "audio-music-jingle-10s",
      title: "Audio: Jingle 10s med tydelig merkevaresignatur",
      audioType: "music",
      domain: "film-vfx",
      kanal: "TV",
      format: "16:9",
      mal: "kjennskap",
      durationSeconds: 10,
      shortInput: "Lag jingle-prompt på 10 sek med tydelig merkevaresignatur.",
      insight: "En gjenkjennelig signatur styrker merkehukommelse.",
      budskap: "Merkevaren forbindes med trygghet og fremdrift.",
      cta: "Oppdag mer",
    },
    {
      slug: "audio-sfx-ambience-dokumentar-15s",
      title: "Audio: Ambience 15s dokumentarisk reklame",
      audioType: "sfx",
      domain: "film-vfx",
      kanal: "web",
      format: "16:9",
      mal: "kjennskap",
      durationSeconds: 15,
      shortInput: "Lag ambience/SFX-prompt for dokumentarisk reklamefilm på 15 sek.",
      insight: "Troverdig ambience øker opplevd realisme og tillit.",
      budskap: "Produktet fungerer i ekte hverdagsmiljø.",
      cta: "Se historien",
    },
  ];

  for (const scenario of audioScenarios) {
    const taxonomy = {
      domain: "reklame",
      stage: scenario.audioType === "voice" ? "konsept" : "post",
      kanal: scenario.kanal,
      format: scenario.format,
      mal: scenario.mal,
      strenghet: "høy",
      brandLock: true,
      textLock: true,
      productLock: false,
    };
    const platformSuggestions = buildPlatformSuggestions({ outputType: "text", audioType: scenario.audioType });
    const productionHints = buildProductionHints({
      outputType: "text",
      taxonomy,
      audioType: scenario.audioType,
      durationSeconds: scenario.durationSeconds,
      includeCharacter: false,
    });

    out.push(
      attachTaxonomy(
        {
          slug: scenario.slug,
          title: scenario.title,
          outputType: "text",
          domain: scenario.domain,
          shortInput: scenario.shortInput,
          longOutput: standardArchitectureText({
            goal: scenario.mal,
            kanal: scenario.kanal,
            format: scenario.format,
            audience: "Norsk reklamemålgruppe med lav tid og høy beslutningstakt",
            insight: scenario.insight,
            budskap: scenario.budskap,
            cta: scenario.cta,
            motiv: "Produkt og merkeelementer beskrives som låste i manuslinjene.",
            miljo: "Lydmiljø skal støtte budskapet uten å skape støy eller maskering.",
            kamera: "Ikke relevant for audio.",
            lys: "Ikke relevant for audio.",
            stemme:
              scenario.audioType === "voice"
                ? `Norsk bokmål, tydelig uttale, troverdig tone, tempo tilpasset ${scenario.durationSeconds}s.`
                : scenario.audioType === "music"
                ? "Ingen voiceover. Beskriv musikalsk karakter, energi og frekvensbalanse."
                : "Ingen voiceover. Definer kilder, avstand, nivå og romrespons for SFX.",
            struktur:
              scenario.audioType === "voice"
                ? `Hook 0-2s, nytte 2-${Math.max(3, scenario.durationSeconds - 3)}s, CTA ${Math.max(
                    3,
                    scenario.durationSeconds - 3
                  )}-${scenario.durationSeconds}s.`
                : scenario.audioType === "music"
                ? `BPM 120-126, hook tidlig, build mot midt, tydelig outro innen ${scenario.durationSeconds}s.`
                : `Ambience-base + hitpoints + transition cues. Total varighet ${scenario.durationSeconds}s.`,
            komposisjon: "Hierarki i tekst: hook, nytte, CTA. Lydlag skal støtte samme prioritet.",
            brandLocks: "Merkevarenavn, claim og CTA-formulering er låst.",
            begrensninger:
              "Ingen språkblanding, ingen clipping, ingen maskering av CTA, ingen udefinert tempo/BPM.",
            negativePreset: "preset-e-audio-konsistens",
            outputType: "text",
            audioType: scenario.audioType,
          }),
          whyWorks: [
            "Audio-prompten følger samme reklamearkitektur som bilde/video, men med stemme og struktur.",
            "Varighet, tempo og hook er eksplisitt låst for produksjonskontroll.",
            "Negativ preset reduserer vanlige feil i voice/musikk/SFX.",
          ],
          ruleIds: [
            "reklame-standard-31-kun-tekst-output",
            "reklame-standard-32-voiceover-krever-sprak-tone-tempo-varighet",
            "reklame-standard-33-musikk-krever-bpm-struktur-varighet",
            "reklame-standard-34-sfx-krever-kilde-rom-og-niva",
            "reklame-standard-35-audio-hook-tidlig",
            "reklame-standard-36-ingen-rendering-i-prompttekst",
          ],
          termSlugs: ["voiceover-tone-vfx", "bpm-vfx", "sfx-lagdeling-vfx"],
          updatedAt: "2026-02-23",
          negativePreset: "preset-e-audio-konsistens",
          metadata: {
            platformSuggestions,
            productionHints,
          },
        },
        taxonomy,
        ["pakke:audio-tekstprompts"]
      )
    );
  }

  return out;
}

function buildDataset() {
  const reklameRules = buildReklameStandardRules();
  const debuggerRules = buildDebuggerRules();
  const antiAiRules = buildAntiAiLookRules();
  const terms = buildGlossaryTerms();
  const templates = buildTemplates();
  const examples = buildExamples();
  const negativePresets = buildNegativePresets();

  return {
    meta: {
      version: "reklame-v1",
      generatedAt: new Date().toISOString(),
      counts: {
        rules: reklameRules.length + debuggerRules.length + antiAiRules.length,
        terms: terms.length,
        templates: templates.length,
        examples: examples.length,
        negativePresets: negativePresets.length,
      },
    },
    rules: [...reklameRules, ...debuggerRules, ...antiAiRules],
    terms,
    templates,
    examples,
    negativePresets,
  };
}

function parseArgs(argv) {
  const out = {
    out: OUT_PATH,
  };

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--out" && argv[i + 1]) {
      out.out = path.isAbsolute(argv[i + 1]) ? argv[i + 1] : path.join(process.cwd(), argv[i + 1]);
      i += 1;
    }
  }

  return out;
}

export function buildReklameSeedData({ out }) {
  const dataset = buildDataset();
  ensureDir(out);
  fs.writeFileSync(out, JSON.stringify(dataset, null, 2), "utf8");

  return {
    ok: true,
    out: path.relative(process.cwd(), out),
    counts: dataset.meta.counts,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs(process.argv.slice(2));
  const result = buildReklameSeedData(options);
  console.log(JSON.stringify(result, null, 2));
}
