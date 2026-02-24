import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { slugify } from "./text-normalize.mjs";

const DEFAULT_OUT_PATH = path.join(
  process.cwd(),
  "data",
  "norskPrompting",
  "engine-seeds",
  "xml-terms-batch-v1.json"
);
const DEFAULT_REPORT_PATH = path.join(
  process.cwd(),
  "data",
  "norskPrompting",
  "engine-seeds",
  "xml-terms-batch-v1.report.json"
);
const DEFAULT_INPUT_CANDIDATES = [
  path.join(os.homedir(), "Downloads", "High_Impact_Prompt_Terms_100.xml"),
  path.join(os.homedir(), "Downloads", "Prompt_Engine_Terms_300.xml"),
];

const DOMAIN_MAP = new Map([
  ["kamera", "film"],
  ["camera", "film"],
  ["lys", "photo"],
  ["lighting", "photo"],
  ["komposisjon", "design"],
  ["composition", "design"],
  ["rendering", "vfx"],
  ["audio", "film"],
  ["lyd", "film"],
]);

const TAXONOMY_DOMAIN_MAP = new Map([
  ["kamera", "film-klipp"],
  ["camera", "film-klipp"],
  ["lys", "foto-lys"],
  ["lighting", "foto-lys"],
  ["komposisjon", "komposisjon-design"],
  ["composition", "komposisjon-design"],
  ["rendering", "post-vfx"],
  ["audio", "audio-produksjon"],
  ["lyd", "audio-produksjon"],
]);

const ION_MARKER = "(ION) Ikke oversatt til norsk";

const EXACT_NORWEGIAN_BY_ENGLISH = new Map(
  Object.entries({
    "Shallow Depth of Field": "Grunn dybdeskarphet",
    "Deep Focus": "Dyp fokus",
    "Rack Focus": "Fokusskift",
    "Pull Focus": "Fokustrekk",
    "Handheld Camera": "Håndholdt kamera",
    "Steadicam Shot": "Steadicam-shot",
    "Dolly Shot": "Dolly-shot",
    "Tracking Shot": "Tracking-shot",
    "Crane Shot": "Kran-shot",
    "Aerial Shot": "Luftshot",
    "POV Shot": "POV-shot",
    "Over-the-Shoulder Shot": "Over-skulder-shot",
    "Close-Up": "Nærbilde",
    "Extreme Close-Up": "Ekstremt nærbilde",
    "Medium Shot": "Halvnært bilde",
    "Wide Shot": "Totalbilde",
    "Establishing Shot": "Etableringsbilde",
    "Dutch Angle": "Hollandsk vinkel",
    "Low Angle Shot": "Lavvinkel-shot",
    "High Angle Shot": "Høyvinkel-shot",
    "Eye-Level Shot": "Øyehøyde-shot",
    "Telephoto Lens": "Telelinse",
    "Wide Angle Lens": "Vidvinkellinse",
    "Prime Lens": "Fastoptikk",
    "Zoom Lens": "Zoomlinse",
    "50mm Lens": "50mm linse",
    "85mm Portrait Lens": "85mm portrettlinse",
    "Macro Lens": "Makrolinse",
    "Tilt-Shift Lens": "Tilt-shift-linse",
    "Long Take": "Lang tagning",
    "Slow Motion": "Sakte film",
    "Time-Lapse": "Tidsforløp",
    Hyperlapse: "Hyperlapse",
    "Static Frame": "Statisk bilde",
    "Locked-Off Shot": "Låst kamera-shot",
    "Whip Pan": "Piskepanorering",
    "Match Cut": "Match-kutt",
    "Jump Cut": "Hoppkutt",
    "Cross Dissolve": "Kryssoppløsning",
    "Smash Cut": "Smash-kutt",
    "Split Diopter": "Split-diopter",
    "Lens Flare": "Linsereflekser",
    "Natural Camera Shake": "Naturlig kamerarystelse",
    "Neutral Density Filter": "Nøytralgråfilter",
    "Soft Focus": "Myk fokus",
    "Hard Focus": "Hard fokus",
    "Foreground Framing": "Forgrunnsinnramming",
    "Depth Layering": "Dybdelagdeling",
    "Leading Lines": "Ledelinjer",
    "Symmetrical Framing": "Symmetrisk innramming",
    "Asymmetrical Framing": "Asymmetrisk innramming",
    "Negative Space": "Negativt rom",
    "Rule of Thirds": "Tredjedelsregelen",
    "Center Framing": "Sentrert innramming",
    Overexposure: "Overeksponering",
    Underexposure: "Undereksponering",
    "Manual Focus": "Manuell fokus",
    "Auto Focus": "Autofokus",
    "Focus Breathing": "Fokuspumping",
    "Lens Compression": "Linsekompresjon",
    "Rim Light": "Kantlys",
    Backlighting: "Motlys",
    Chiaroscuro: "Klar–mørk kontrast",
    "Golden Hour": "Gylden time",
    "Blue Hour": "Blåtime",
    "Low Key Lighting": "Lav nøkkel-belysning",
    "High Key Lighting": "Høy nøkkel-belysning",
    "Soft Light": "Mykt lys",
    "Hard Light": "Hardt lys",
    "Top Light": "Topplys",
    "Side Light": "Sidelys",
    "Practical Lighting": "Praktisk belysning",
    "Motivated Lighting": "Motivert belysning",
    "Ambient Light": "Omgivelseslys",
    "Bounce Light": "Reflektert lys",
    "Fill Light": "Utfyllingslys",
    "Key Light": "Nøkkellys",
    "Three-Point Lighting": "Tre-punkts belysning",
    "Natural Light": "Naturlig lys",
    "Window Light": "Vinduslys",
    "Volumetric Light": "Volumetrisk lys",
    "God Rays": "Lysgater",
    "Silhouette Lighting": "Silhuettbelysning",
    Candlelight: "Stearinlys-belysning",
    "Neon Lighting": "Neonbelysning",
    "Fluorescent Lighting": "Fluorescerende belysning",
    "LED Lighting": "LED-belysning",
    "Tungsten Light": "Tungstenlys",
    "Daylight Balance": "Dagslysbalanse",
    "Color Gel": "Fargegel",
    "Warm Lighting": "Varm belysning",
    "Cool Lighting": "Kald belysning",
    "Mixed Color Temperature": "Blandet fargetemperatur",
    "Specular Highlight": "Spekulært høylys",
    "Diffuse Reflection": "Diffus refleksjon",
    "Subsurface Scattering": "Subsurface scattering",
    "Global Illumination": "Global illuminering",
    "Shadow Casting": "Skyggekasting",
    "Soft Shadows": "Myke skygger",
    "Hard Shadows": "Harde skygger",
    "Light Falloff": "Lysavfall",
    "Back Rim Glow": "Bakre kantglød",
    "Edge Lighting": "Kantlyssetting",
    Underlighting: "Underlys",
    "Overhead Lighting": "Overhead-belysning",
    "Studio Lighting": "Studiobelysning",
    "Stage Lighting": "Scenebelysning",
    "Practical Shadows": "Praktiske skygger",
    "High Contrast Lighting": "Høykontrast-belysning",
    "Low Contrast Lighting": "Lavkontrast-belysning",
    "Directional Light": "Retningslys",
    "Softbox Lighting": "Softbox-belysning",
    "Reflector Bounce": "Reflektor-bounce",
    "HDR Lighting": "HDR-belysning",
    "Exposure Compensation": "Eksponeringskompensasjon",
    "Light Wrap": "Lysinnpakning",
    "Overhead Diffusion": "Overhead-diffusjon",
    "Cloudy Day Lighting": "Overskyet dagslys-belysning",
    "Sunset Silhouette": "Solnedgangssilhuett",
    "Foreground Separation": "Forgrunnsseparasjon",
    "Background Blur": "Bakgrunnsuskarphet",
    "Visual Hierarchy": "Visuelt hierarki",
    "Depth Composition": "Dybdekomposisjon",
    "Frame Within Frame": "Ramme i ramme",
    "Diagonal Composition": "Diagonal komposisjon",
    "Triangular Composition": "Triangulær komposisjon",
    "Golden Ratio": "Det gyldne snitt",
    "Layered Composition": "Lagdelt komposisjon",
    "Atmospheric Perspective": "Atmosfærisk perspektiv",
    "Color Blocking": "Fargeblokkering",
    Minimalism: "Minimalisme",
    Maximalism: "Maksimalisme",
    Symmetry: "Symmetri",
    "Radial Balance": "Radial balanse",
    "Center Weighting": "Sentervekting",
    "Edge Framing": "Kantinnramming",
    "Horizon Line Placement": "Plassering av horisontlinje",
    "Eye Trace": "Blikkspor",
    "Visual Flow": "Visuell flyt",
    "Contrast Framing": "Kontrastinnramming",
    "Scale Contrast": "Skalakontrast",
    "Subject Isolation": "Subjektisolasjon",
    "Pattern Repetition": "Mønsterrepetisjon",
    "Texture Contrast": "Teksturkontrast",
    "Color Contrast": "Fargekontrast",
    "Monochrome Palette": "Monokrom palett",
    "Muted Palette": "Dempet palett",
    "Vibrant Palette": "Vibrant palett",
    "Analogous Colors": "Analoge farger",
    "Complementary Colors": "Komplementærfarger",
    "Triadic Colors": "Triadiske farger",
    "Color Harmony": "Fargeharmoni",
    "High Saturation": "Høy metning",
    "Low Saturation": "Lav metning",
    "Balanced Exposure": "Balansert eksponering",
    "Intentional Blur": "Bevisst uskarphet",
    "Frontal Composition": "Frontal komposisjon",
    "Oblique Angle Composition": "Skråvinkel-komposisjon",
    "Negative Framing": "Negativ innramming",
    "Spatial Compression": "Romlig kompresjon",
    "Depth of Space": "Romdybde",
    "Open Frame": "Åpen ramme",
    "Closed Frame": "Lukket ramme",
    "Tight Framing": "Tett innramming",
    "Loose Framing": "Løs innramming",
    "Dynamic Tension": "Dynamisk spenning",
    "Visual Anchoring": "Visuell forankring",
    "Object Framing": "Objektinnramming",
    "Natural Framing": "Naturlig innramming",
    "Spatial Rhythm": "Romlig rytme",
    "Leading Perspective": "Ledende perspektiv",
    "Visual Weight": "Visuell vekt",
    "Dominant Subject": "Dominerende subjekt",
    "Secondary Subject": "Sekundært subjekt",
    "Foreground Texture": "Forgrunnstekstur",
    "Shadow Framing": "Skyggeinnramming",
    "Contrast Edge": "Kontrastkant",
    "Diegetic Sound": "Diegetisk lyd",
    "Non-Diegetic Sound": "Ikke-diegetisk lyd",
    "Ambient Noise": "Omgivelsesstøy",
    "Room Tone": "Romtone",
    "Foley Effects": "Foley-effekter",
    "Sound Design": "Lyddesign",
    "Dynamic Range": "Dynamisk område",
    Compression: "Kompresjon",
    Reverb: "Etterklang",
    Delay: "Delay",
    Echo: "Ekko",
    "Stereo Imaging": "Stereobilde",
    "Mono Mix": "Monomiks",
    "Spatial Audio": "Romlig lyd",
    "Surround Sound": "Surroundlyd",
    "Binaural Recording": "Binaural opptak",
    "Voice Over": "Voiceover",
    ADR: "ADR",
    "Sync Sound": "Synkron lyd",
    "Sound Bridge": "Lydbro",
    "Audio Fade In": "Lydfade inn",
    "Audio Fade Out": "Lydfade ut",
    Crossfade: "Kryssfade",
    "Hard Cut Audio": "Hard lydklipp",
    Soundscape: "Lydlandskap",
    "Low Frequency Emphasis": "Lavfrekvent vektlegging",
    "High Frequency Roll-Off": "Høyfrekvent avrulling",
    Equalization: "Equalisering",
    "Noise Floor": "Støygulv",
    "Audio Clipping": "Lydklipping",
    Distortion: "Forvrengning",
    "Clean Dialogue": "Ren dialog",
    "Background Score": "Bakgrunnsmusikk",
    "Minimal Soundtrack": "Minimal soundtrack",
    "Atmospheric Sound": "Atmosfærisk lyd",
    "Natural Acoustics": "Naturlig akustikk",
    "Studio Acoustics": "Studioakustikk",
    "Field Recording": "Feltopptak",
    "Layered Audio": "Lagdelt lyd",
    "Audio Perspective": "Lydperspektiv",
    "Directional Sound": "Retningsbestemt lyd",
    "Audio Depth": "Lyddybde",
    "Sound Texture": "Lydtekstur",
    "Granular Sound": "Granulær lyd",
    "Transient Emphasis": "Transient-vektlegging",
    "Soft Transients": "Myke transienter",
    "Hard Transients": "Harde transienter",
    "Spatial Reverb": "Romlig etterklang",
    "Dry Mix": "Tørr miks",
    "Wet Mix": "Våt miks",
    "Dynamic Compression": "Dynamisk kompresjon",
    "Sidechain Compression": "Sidechain-kompresjon",
    "Audio Contrast": "Lydkontrast",
    "Sound Isolation": "Lydisolasjon",
    "Sound Separation": "Lydseparasjon",
    "Narrative Audio Cue": "Narrativ lydmarkør",
    "Audio Continuity": "Lydkontinuitet",
    "Photorealistic Rendering": "Fotorealistisk rendering",
    "Cinematic Color Grading": "Filmatisk fargegradering",
    "Flat Color Profile": "Flat fargeprofil",
    "Log Profile": "Log-profil",
    "HDR Output": "HDR-output",
    "ACES Workflow": "ACES-arbeidsflyt",
    "High Dynamic Range": "Høyt dynamisk område",
    "Physically Based Rendering": "Fysisk basert rendering",
    "Ray Tracing": "Ray tracing",
    "Path Tracing": "Path tracing",
    "Volumetric Fog": "Volumetrisk tåke",
    "Volumetric Smoke": "Volumetrisk røyk",
    "Particle Simulation": "Partikkelsimulering",
    "Motion Blur": "Bevegelsesuskarphet",
    "Depth of Field Blur": "Dybdeskarphetsuskarphet",
    "Film Grain": "Filmkorn",
    "Digital Noise": "Digital støy",
    "Sharp Rendering": "Skarp rendering",
    "Soft Rendering": "Myk rendering",
    "High Detail Texture": "Høy detaljtekstur",
    "Low Detail Texture": "Lav detaljtekstur",
    "Specular Reflection": "Spekulær refleksjon",
    "Matte Surface": "Matt overflate",
    "Glossy Surface": "Blank overflate",
    "Roughness Map": "Roughness-kart",
    "Normal Map": "Normal-kart",
    "Ambient Occlusion": "Ambient occlusion",
    "Shadow Detail": "Skyggedetalj",
    "Highlight Roll-Off": "Høylysavrulling",
    "Dynamic Contrast": "Dynamisk kontrast",
    "Color Depth": "Fargedybde",
    "Bit Depth": "Bitdybde",
    "Texture Mapping": "Teksturmapping",
    "Surface Realism": "Overflaterealisme",
    "Material Accuracy": "Materialpresisjon",
    "Skin Texture Detail": "Hudteksturdetalj",
    "Cloth Simulation": "Tøysimulering",
    "Hair Simulation": "Hårsimulering",
    "Water Simulation": "Vannsimulering",
    "Realistic Physics": "Realistisk fysikk",
    "Object Persistence": "Objektpermanens",
    "Continuity Lock": "Kontinuitetslås",
    "Temporal Consistency": "Temporal konsistens",
    "Color Temperature Control": "Fargetemperaturkontroll",
    "Neutral Color Balance": "Nøytral fargebalanse",
    "Overprocessed Look": "Overprosessert look",
    "Natural Skin Tone": "Naturlig hudtone",
    "Physical Light Accuracy": "Fysisk lyspresisjon",
    "Micro Contrast": "Mikrokontrast",
    "Macro Contrast": "Makrokontrast",
    "Edge Sharpness": "Kantskarphet",
    "Tone Mapping": "Tonemapping",
    "Color Separation": "Fargeseparasjon",
    "Rendering Fidelity": "Renderingtrofasthet",
    "Photographic Realism": "Fotografisk realisme",
  })
);

function parseArgs(argv) {
  const out = {
    inputs: [],
    out: DEFAULT_OUT_PATH,
    report: DEFAULT_REPORT_PATH,
    minQuality: 0.55,
    includePlaceholderNo: false,
    includeExisting: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--input" && argv[i + 1]) {
      out.inputs.push(argv[i + 1]);
      i += 1;
      continue;
    }

    if (token === "--inputs" && argv[i + 1]) {
      out.inputs.push(
        ...argv[i + 1]
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean)
      );
      i += 1;
      continue;
    }

    if (token === "--out" && argv[i + 1]) {
      out.out = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--report" && argv[i + 1]) {
      out.report = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--min-quality" && argv[i + 1]) {
      out.minQuality = Math.max(0, Math.min(1, Number(argv[i + 1]) || out.minQuality));
      i += 1;
      continue;
    }

    if (token === "--include-placeholder-no") {
      out.includePlaceholderNo = true;
      continue;
    }

    if (token === "--include-existing") {
      out.includeExisting = true;
    }
  }

  if (!out.inputs.length) {
    out.inputs = DEFAULT_INPUT_CANDIDATES.filter((candidate) => fs.existsSync(candidate));
  }

  if (!out.inputs.length) {
    throw new Error(
      "Mangler input. Bruk --input <fil.xml> (kan gjentas) eller --inputs <fil1,fil2>."
    );
  }

  return out;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function decodeXmlEntities(value) {
  return String(value ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)));
}

function normalizeWhitespace(value) {
  return decodeXmlEntities(String(value ?? "")).replace(/\s+/g, " ").trim();
}

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));
  return normalizeWhitespace(match?.[1] || "");
}

function parseXmlTermsFromFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const terms = [];
  const regex = /<Term>([\s\S]*?)<\/Term>/gi;
  let match = regex.exec(raw);

  while (match) {
    const block = match[1] || "";
    terms.push({
      sourceFile: path.basename(filePath),
      english: extractTag(block, "English"),
      norwegian: extractTag(block, "Norwegian"),
      category: extractTag(block, "Category"),
      latentEffect: extractTag(block, "LatentEffect"),
      conflictRisk: extractTag(block, "ConflictRisk"),
      operationalUsage: extractTag(block, "OperationalUsage"),
    });

    match = regex.exec(raw);
  }

  return terms;
}

function isGenericHighImpactTerm(english, norwegian) {
  return (
    /^high impact term \d+$/i.test(english) ||
    /^h[øo]y effekt begrep \d+$/i.test(norwegian)
  );
}

function isPlaceholderNorwegian(value) {
  return /^norsk oversettelse av /i.test(value);
}

function normalizeEnglishTerm(value) {
  return String(value ?? "")
    .replace(/[‐‑‒–—―]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveNorwegianTerm({ english, norwegian, placeholderNo, includePlaceholderNo }) {
  if (!placeholderNo) {
    return {
      termNo: norwegian,
      translationStatus: "provided",
    };
  }

  const normalizedEnglish = normalizeEnglishTerm(english);
  const exact = EXACT_NORWEGIAN_BY_ENGLISH.get(normalizedEnglish);
  if (exact) {
    return {
      termNo: exact,
      translationStatus: "auto_translated_exact",
    };
  }

  if (includePlaceholderNo) {
    return {
      termNo: norwegian,
      translationStatus: "placeholder_kept",
    };
  }

  return {
    termNo: `${normalizedEnglish} ${ION_MARKER}`.trim(),
    translationStatus: "ion_untranslated",
  };
}

function qualityScore(term, genericHighImpact, translationStatus) {
  let score = 0;

  if (term.english) score += 0.35;
  if (translationStatus === "provided" || translationStatus === "auto_translated_exact") score += 0.35;
  if (translationStatus === "ion_untranslated") score += 0.25;
  if (translationStatus === "placeholder_kept") score += 0.1;
  if (term.latentEffect && term.latentEffect.length >= 20) score += 0.15;
  if (term.operationalUsage && term.operationalUsage.length >= 20) score += 0.15;
  if (genericHighImpact) score -= 0.6;

  return Math.max(0, Math.min(1, score));
}

function toDomain(categoryRaw) {
  const key = slugify(categoryRaw);
  return DOMAIN_MAP.get(key) || "ai";
}

function toTaxonomyDomain(categoryRaw) {
  const key = slugify(categoryRaw);
  return TAXONOMY_DOMAIN_MAP.get(key) || "prompting";
}

function toDefinition(term) {
  if (term.latentEffect) return term.latentEffect;
  if (term.conflictRisk) return `Kontrollbehov: ${term.conflictRisk}`;
  return `Fagterm for ${term.category || "medieproduksjon"}.`;
}

function toPromptImpact(term) {
  const parts = [];
  if (term.latentEffect) parts.push(term.latentEffect);
  if (term.conflictRisk) parts.push(`Kontrollpunkt: ${term.conflictRisk}`);
  if (term.operationalUsage) parts.push(`Operativ bruk: ${term.operationalUsage}`);
  return parts.join(" ").trim();
}

function coerceAbsolute(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
}

function loadExistingSlugs({ includeExisting }) {
  if (includeExisting) return new Set();

  const glossaryPath = path.join(process.cwd(), "src", "data", "norskPrompting", "glossary.ts");
  const generatedGlossaryPath = path.join(
    process.cwd(),
    "src",
    "data",
    "norskPrompting",
    "generated",
    "glossary.generated.ts"
  );
  const out = new Set();

  if (fs.existsSync(glossaryPath)) {
    const raw = fs.readFileSync(glossaryPath, "utf8");
    const regex = /term_no:\s*"([^"]+)"[\s\S]*?domain:\s*"([^"]+)"/g;
    let match = regex.exec(raw);
    while (match) {
      out.add(`${slugify(match[1])}-${match[2]}`);
      match = regex.exec(raw);
    }
  }

  if (fs.existsSync(generatedGlossaryPath)) {
    const raw = fs.readFileSync(generatedGlossaryPath, "utf8");
    const regex = /"slug":\s*"([^"]+)"/g;
    let match = regex.exec(raw);
    while (match) {
      out.add(match[1]);
      match = regex.exec(raw);
    }
  }

  return out;
}

function toRejection(reason, term, quality) {
  return {
    reason,
    qualityScore: quality,
    english: term.english,
    norwegian: term.norwegian,
    category: term.category,
    sourceFile: term.sourceFile,
  };
}

export function buildXmlTermBatch(options) {
  const inputs = options.inputs.map((entry) => coerceAbsolute(entry));
  const outPath = coerceAbsolute(options.out);
  const reportPath = coerceAbsolute(options.report);

  for (const filePath of inputs) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Finner ikke inputfil: ${filePath}`);
    }
  }

  const allParsed = inputs.flatMap((filePath) => parseXmlTermsFromFile(filePath));
  const existingSlugs = loadExistingSlugs({ includeExisting: options.includeExisting });

  const acceptedBySlug = new Map();
  const rejected = [];
  let duplicatesCollapsed = 0;
  let skippedExisting = 0;
  let ionCount = 0;
  let autoTranslatedCount = 0;
  let providedCount = 0;

  for (const term of allParsed) {
    const genericHighImpact = isGenericHighImpactTerm(term.english, term.norwegian);
    const placeholderNo = isPlaceholderNorwegian(term.norwegian);
    const translation = resolveNorwegianTerm({
      english: term.english,
      norwegian: term.norwegian,
      placeholderNo,
      includePlaceholderNo: options.includePlaceholderNo,
    });
    const quality = qualityScore(term, genericHighImpact, translation.translationStatus);
    const termNo = translation.termNo;

    if (!term.english) {
      rejected.push(toRejection("missing_english", term, quality));
      continue;
    }

    if (genericHighImpact) {
      rejected.push(toRejection("generic_high_impact_placeholder", term, quality));
      continue;
    }

    if (quality < options.minQuality) {
      rejected.push(toRejection("below_quality_threshold", term, quality));
      continue;
    }

    const domain = toDomain(term.category);
    const slug = `${slugify(termNo)}-${domain}`;

    if (!options.includeExisting && existingSlugs.has(slug)) {
      skippedExisting += 1;
      rejected.push(toRejection("already_exists", term, quality));
      continue;
    }

    const item = {
      item_type: "term",
      slug,
      term_no: termNo,
      term_en: term.english,
      domain,
      definition_no: toDefinition(term),
      promptImpact: toPromptImpact(term),
      examples: term.operationalUsage ? [term.operationalUsage] : [],
      relatedTerms: [],
      aliases: [],
      tags: [
        `source:xml-import`,
        `source_file:${slugify(term.sourceFile) || "unknown"}`,
        `source_category:${slugify(term.category) || "ukjent"}`,
        `translation:${translation.translationStatus}`,
        "policy:text-output-only",
      ],
      metadata: {
        source: {
          type: "xml",
          file: term.sourceFile,
        },
        import: {
          qualityScore: quality,
          placeholderNorwegian: placeholderNo,
          categoryRaw: term.category,
          translationStatus: translation.translationStatus,
        },
        taxonomy: {
          domain: toTaxonomyDomain(term.category),
          stage: "produksjon",
          kanal: "web",
          format: "16:9",
          mal: "kjennskap",
          strenghet: "middels",
          brandLock: true,
          textLock: true,
          productLock: false,
        },
        outputPolicy: "text-only",
        mediaGeneration: false,
      },
    };

    const previous = acceptedBySlug.get(slug);
    if (!previous) {
      acceptedBySlug.set(slug, { item, quality });
      continue;
    }

    if (quality > previous.quality) {
      acceptedBySlug.set(slug, { item, quality });
    }
    duplicatesCollapsed += 1;
  }

  const accepted = Array.from(acceptedBySlug.values())
    .map((entry) => entry.item)
    .sort((a, b) => String(a.term_no).localeCompare(String(b.term_no), "nb-NO"));

  const reasonCounts = rejected.reduce((acc, entry) => {
    acc[entry.reason] = (acc[entry.reason] || 0) + 1;
    return acc;
  }, {});

  const domainCounts = accepted.reduce((acc, entry) => {
    acc[entry.domain] = (acc[entry.domain] || 0) + 1;
    return acc;
  }, {});

  for (const entry of accepted) {
    const status = entry?.metadata?.import?.translationStatus || "provided";
    if (status === "ion_untranslated") ionCount += 1;
    else if (status === "auto_translated_exact") autoTranslatedCount += 1;
    else providedCount += 1;
  }

  const payload = {
    meta: {
      name: "XML term batch v1",
      createdAt: new Date().toISOString(),
      sourceFiles: inputs.map((entry) => path.basename(entry)),
      minQuality: options.minQuality,
      includePlaceholderNo: options.includePlaceholderNo,
      includeExisting: options.includeExisting,
    },
    terms: accepted,
  };

  const report = {
    meta: payload.meta,
    counts: {
      parsed: allParsed.length,
      accepted: accepted.length,
      rejected: rejected.length,
      duplicatesCollapsed,
      skippedExisting,
      translatedExact: autoTranslatedCount,
      translatedION: ionCount,
      translatedProvidedOrKept: providedCount,
    },
    domains: domainCounts,
    rejectedByReason: reasonCounts,
    acceptedPreview: accepted.slice(0, 25).map((entry) => ({
      slug: entry.slug,
      term_no: entry.term_no,
      term_en: entry.term_en,
      domain: entry.domain,
      source_file: entry.metadata?.source?.file || "",
    })),
    rejectedPreview: rejected.slice(0, 25),
  };

  ensureDir(outPath);
  ensureDir(reportPath);
  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  return {
    ok: true,
    outPath: path.relative(process.cwd(), outPath),
    reportPath: path.relative(process.cwd(), reportPath),
    counts: report.counts,
    domains: report.domains,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs(process.argv.slice(2));

  try {
    const result = buildXmlTermBatch(options);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ukjent feil";
    console.error(JSON.stringify({ ok: false, error: message }, null, 2));
    process.exit(1);
  }
}
