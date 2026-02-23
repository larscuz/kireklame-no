import { normalizeWhitespace, wordCount } from "./text-normalize.mjs";

const BANNED_FILLER_PATTERNS = [
  /\bultra\s+cinematic\b/i,
  /\bbest\s+quality\b/i,
  /\bmasterpiece\b/i,
  /\bepic\s+lighting\b/i,
  /\baward[- ]?winning\b/i,
  /\bvibe\b/i,
];

const EXAMPLE_REQUIRED_SECTIONS = [
  /\bmal\b/i,
  /\bmalgruppe\b/i,
  /\bkjernebudskap\b/i,
  /\bmotiv\b/i,
  /\bmiljo\b/i,
  /\bkamera\b/i,
  /\blys\b/i,
  /\bkomposisjon\b/i,
  /\bbrand lock\b/i,
  /\bbegrensning\b/i,
  /\bnegativ\b/i,
  /\boutput\b/i,
];

const TEMPLATE_REQUIRED_BLOCKS = [
  "Mål (effekt + kanal + format)",
  "Målgruppe / Innsikt",
  "Kjernebudskap + CTA",
  "Motiv og produkt (låste elementer)",
  "Miljø / kontekst",
  "Kamera (linse, utsnitt, bevegelse)",
  "Lys (key/fill/rim, kvalitet, retning)",
  "Komposisjon / hierarki",
  "Brand locks (logo, typografi, farger, DME)",
  "Begrensninger",
  "Negativ preset",
  "Output-spesifikasjon",
];

function stripNorwegian(input) {
  return String(input ?? "")
    .toLowerCase()
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a");
}

function hasBannedFiller(value) {
  const text = String(value ?? "");
  return BANNED_FILLER_PATTERNS.some((pattern) => pattern.test(text));
}

function validateExampleStructure(longOutput) {
  const normalized = stripNorwegian(longOutput);
  const missing = [];

  for (const pattern of EXAMPLE_REQUIRED_SECTIONS) {
    if (!pattern.test(normalized)) {
      missing.push(pattern.source.replace(/\\b|\(\?:|\)|\//g, ""));
    }
  }

  return missing;
}

function collectStringFields(itemType, contentJson) {
  if (!contentJson || typeof contentJson !== "object") return [];

  if (itemType === "rule") {
    return [contentJson.name, contentJson.description, contentJson.addToPrompt, contentJson.negativeAdd];
  }

  if (itemType === "term") {
    return [contentJson.term_no, contentJson.term_en, contentJson.definition_no, contentJson.promptImpact];
  }

  if (itemType === "template") {
    return [
      contentJson.title,
      contentJson.useCase,
      ...(contentJson.blocks || []).flatMap((block) => [block.title, block.instruction]),
    ];
  }

  if (itemType === "example") {
    return [contentJson.title, contentJson.shortInput, contentJson.longOutput, ...(contentJson.whyWorks || [])];
  }

  if (itemType === "negative_preset") {
    return [contentJson.title, contentJson.description, ...(contentJson.items || [])];
  }

  return [
    contentJson.navn,
    contentJson.effekt,
    contentJson.representasjonsskift,
    contentJson.promptStruktur?.mal,
    ...(contentJson.sterkeBegreper || []),
  ];
}

function hasReklameTag(contentJson) {
  const tags = Array.isArray(contentJson?.tags) ? contentJson.tags : [];
  return tags.some((entry) => String(entry).toLowerCase() === "domain:reklame");
}

function validateTemplateBlockOrder(contentJson) {
  const titles = Array.isArray(contentJson?.blocks)
    ? contentJson.blocks.map((block) => normalizeWhitespace(block?.title || ""))
    : [];
  if (!titles.length) return TEMPLATE_REQUIRED_BLOCKS;

  const missing = TEMPLATE_REQUIRED_BLOCKS.filter((required) => !titles.includes(required));
  return missing;
}

export function validateEnrichedItem({ itemType, contentJson, confidence }) {
  const warnings = [];
  const errors = [];

  const stringFields = collectStringFields(itemType, contentJson).map((entry) => normalizeWhitespace(entry || ""));

  for (const field of stringFields) {
    if (!field) continue;
    if (hasBannedFiller(field)) {
      warnings.push("Innhold inneholder generiske filler-ord uten spesifikasjon.");
      break;
    }
  }

  if (itemType === "example") {
    const missingSections = validateExampleStructure(contentJson.longOutput || "");
    if (missingSections.length && hasReklameTag(contentJson)) {
      errors.push(
        `Eksempelet mangler deler av fast prompt-arkitektur: ${missingSections.slice(0, 6).join(", " )}.`
      );
    } else if (missingSections.length) {
      warnings.push("Eksempelet avviker fra full reklame-arkitektur. Vurder å strukturere i 12 seksjoner.");
    }

    if (String(contentJson.outputType || "") === "video") {
      const words = wordCount(contentJson.longOutput || "");
      if (words > 260) {
        warnings.push("Video-eksempel er langt. Vurder kortere prompt for høy stramhet.");
      }
    }
  }

  if (itemType === "term") {
    if (!contentJson.promptImpact) {
      errors.push("Term mangler promptImpact.");
    }
  }

  if (itemType === "rule") {
    if (!contentJson.addToPrompt && !contentJson.negativeAdd) {
      warnings.push("Regel har verken addToPrompt eller negativeAdd.");
    }
  }

  if (itemType === "template") {
    const missingBlocks = validateTemplateBlockOrder(contentJson);
    if (missingBlocks.length && hasReklameTag(contentJson)) {
      errors.push(
        `Template mangler standard reklame-blokker: ${missingBlocks.slice(0, 4).join(", ")}.`
      );
    } else if (missingBlocks.length) {
      warnings.push("Template følger ikke full standard reklame-arkitektur.");
    }
  }

  const lowConfidence = Number(confidence) < 0.6;
  if (lowConfidence) {
    warnings.push("LLM-confidence under 0.6. Setter entry til draft.");
  }

  return {
    warnings,
    errors,
    shouldDraft: lowConfidence || errors.length > 0,
    isValid: errors.length === 0,
  };
}
