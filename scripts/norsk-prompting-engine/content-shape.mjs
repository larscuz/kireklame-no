import { normalizeText, normalizeWhitespace, slugify, uniq } from "./text-normalize.mjs";

export const ITEM_TYPES = new Set([
  "rule",
  "term",
  "template",
  "example",
  "negative_preset",
  "representation_switch",
]);

const RULE_CATEGORIES = new Set([
  "Konsistens",
  "Kamera",
  "Komposisjon",
  "Kontinuitet",
  "Realisme",
  "Tekst i bilde",
  "Historisk troverdighet",
  "Fysikk",
  "Produksjonslogikk",
  "Lys",
  "Reklame Standard",
  "Debugger",
  "Anti-AI-look",
]);

const GLOSSARY_DOMAINS = new Set(["film", "vfx", "arch", "ai", "photo", "design"]);
const OUTPUT_TYPES = new Set(["image", "video", "text"]);
const TEMPLATE_DOMAINS = new Set([
  "film-vfx",
  "arkitektur",
  "produkt",
  "dokumentar",
  "sosiale-medier",
  "historisk",
  "redaksjonell",
  "design-system",
]);

function toSeverity(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(1, Math.min(5, Math.round(value)));
  }

  const mapped = {
    low: 1,
    medium: 2,
    high: 4,
    critical: 5,
  };

  const key = String(value ?? "").toLowerCase().trim();
  return mapped[key] || 3;
}

function toOutputType(value, fallback = "image") {
  const v = String(value ?? fallback).trim();
  if (OUTPUT_TYPES.has(v)) return v;
  return fallback;
}

function toTemplateDomain(value, fallback = "film-vfx") {
  const v = String(value ?? fallback).trim();
  if (TEMPLATE_DOMAINS.has(v)) return v;
  return fallback;
}

function parseJsonMaybe(value) {
  if (!value) return null;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(String(value));
  } catch {
    return null;
  }
}

function coerceArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  if (typeof value === "string") {
    return value
      .split(/[\n,;]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function flattenTaxonomyTags(taxonomy) {
  if (!taxonomy || typeof taxonomy !== "object") return [];

  const out = [];
  const entries = Object.entries(taxonomy);

  for (const [key, value] of entries) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const normalized = normalizeWhitespace(item);
        if (normalized) out.push(`${key}:${normalized}`);
      }
      continue;
    }

    if (typeof value === "boolean") {
      out.push(`${key}:${value ? "ja" : "nei"}`);
      continue;
    }

    const normalized = normalizeWhitespace(value);
    if (normalized) out.push(`${key}:${normalized}`);
  }

  return out;
}

function parseTags(raw) {
  return uniq([
    ...coerceArray(raw.tags),
    ...flattenTaxonomyTags(raw.taxonomy),
  ]);
}

function parseMetadata(raw) {
  const fromRaw = raw.metadata && typeof raw.metadata === "object" ? raw.metadata : {};
  const taxonomy = raw.taxonomy && typeof raw.taxonomy === "object" ? raw.taxonomy : {};

  return {
    ...fromRaw,
    ...(Object.keys(taxonomy).length ? { taxonomy } : {}),
  };
}

function safeTitle(base, fallback) {
  return normalizeWhitespace(base || fallback || "Uten tittel");
}

function toRuleContent(raw, rawText) {
  const name = safeTitle(raw.name || raw.title, rawText.slice(0, 80));
  const id = normalizeWhitespace(raw.id || slugify(name));
  const category = RULE_CATEGORIES.has(raw.category) ? raw.category : "Produksjonslogikk";
  const appliesTo = ["all", "image", "video", "text"].includes(raw.appliesTo)
    ? raw.appliesTo
    : "all";

  const content = {
    id,
    name,
    category,
    severity: toSeverity(raw.severity),
    description: normalizeWhitespace(raw.description || raw.definition || rawText),
    appliesTo,
    addToPrompt: normalizeWhitespace(raw.addToPrompt || ""),
    negativeAdd: normalizeWhitespace(raw.negativeAdd || ""),
    tags: parseTags(raw),
    metadata: parseMetadata(raw),
  };

  return {
    slug: id,
    title: name,
    content,
  };
}

function toTermContent(raw, rawText) {
  const termNo = safeTitle(raw.term_no || raw.title || raw.name, rawText.slice(0, 80));
  const domain = GLOSSARY_DOMAINS.has(raw.domain) ? raw.domain : "ai";
  const slug = normalizeWhitespace(raw.slug || `${slugify(termNo)}-${domain}`);

  const content = {
    slug,
    term_no: termNo,
    term_en: normalizeWhitespace(raw.term_en || termNo),
    domain,
    definition_no: normalizeWhitespace(raw.definition_no || raw.description || rawText),
    promptImpact: normalizeWhitespace(raw.promptImpact || ""),
    examples: uniq(coerceArray(raw.examples)),
    relatedTerms: uniq(coerceArray(raw.relatedTerms || raw.related_terms)),
    aliases: uniq(coerceArray(raw.aliases)),
    tags: parseTags(raw),
    metadata: parseMetadata(raw),
  };

  return {
    slug,
    title: termNo,
    content,
  };
}

function toTemplateContent(raw, rawText) {
  const title = safeTitle(raw.title || raw.name, rawText.slice(0, 80));
  const id = normalizeWhitespace(raw.id || slugify(title));
  const blocks = Array.isArray(raw.blocks)
    ? raw.blocks
        .map((block, index) => ({
          id: normalizeWhitespace(block.id || `block-${index + 1}`),
          title: safeTitle(block.title, `Blokk ${index + 1}`),
          instruction: normalizeWhitespace(block.instruction || block.text || ""),
        }))
        .filter((block) => block.instruction)
    : [];

  const content = {
    id,
    title,
    useCase: normalizeWhitespace(raw.useCase || raw.use_case || raw.description || ""),
    outputType: toOutputType(raw.outputType || raw.output_type || "image"),
    domain: toTemplateDomain(raw.domain || "film-vfx"),
    blocks,
    recommendedRules: uniq(coerceArray(raw.recommendedRules || raw.recommended_rules)),
    tags: parseTags(raw),
    metadata: parseMetadata(raw),
  };

  return {
    slug: id,
    title,
    content,
  };
}

function toExampleContent(raw, rawText) {
  const title = safeTitle(raw.title || raw.name, rawText.slice(0, 80));
  const slug = normalizeWhitespace(raw.slug || slugify(title));

  const content = {
    slug,
    title,
    outputType: toOutputType(raw.outputType || raw.output_type || "image"),
    domain: toTemplateDomain(raw.domain || "film-vfx"),
    shortInput: normalizeWhitespace(raw.shortInput || raw.shortInputNo || raw.short_input || ""),
    longOutput: normalizeWhitespace(raw.longOutput || raw.expandedPromptNo || raw.expanded_prompt_no || rawText),
    whyWorks: uniq(coerceArray(raw.whyWorks || raw.why_works)),
    ruleIds: uniq(coerceArray(raw.ruleIds || raw.rulesUsed || raw.rules_used)),
    termSlugs: uniq(coerceArray(raw.termSlugs || raw.glossaryTermsInjected || raw.glossary_terms_injected)),
    updatedAt: normalizeWhitespace(raw.updatedAt || raw.updated_at || new Date().toISOString().slice(0, 10)),
    negativePreset: normalizeWhitespace(raw.negativePreset || raw.negative_preset || ""),
    tags: parseTags(raw),
    metadata: parseMetadata(raw),
  };

  return {
    slug,
    title,
    content,
  };
}

function toNegativePresetContent(raw, rawText) {
  const title = safeTitle(raw.title || raw.name, rawText.slice(0, 80));
  const id = normalizeWhitespace(raw.id || slugify(title));

  const content = {
    id,
    title,
    description: normalizeWhitespace(raw.description || ""),
    items: uniq(coerceArray(raw.items || raw.negative || raw.constraints || rawText)),
    tags: parseTags(raw),
    metadata: parseMetadata(raw),
  };

  return {
    slug: id,
    title,
    content,
  };
}

function toRepresentationSwitchContent(raw, rawText) {
  const navn = safeTitle(raw.navn || raw.title || raw.name, rawText.slice(0, 80));
  const id = normalizeWhitespace(raw.id || slugify(navn));

  const content = {
    id,
    navn,
    effekt: normalizeWhitespace(raw.effekt || raw.description || ""),
    representasjonsskift: normalizeWhitespace(raw.representasjonsskift || raw.representasjonsskift_no || ""),
    promptStruktur:
      raw.promptStruktur && typeof raw.promptStruktur === "object"
        ? { mal: normalizeWhitespace(raw.promptStruktur.mal || "") }
        : { mal: normalizeWhitespace(raw.prompt || "") },
    sterkeBegreper: uniq(coerceArray(raw.sterkeBegreper || raw.terms)),
    tags: parseTags(raw),
    metadata: parseMetadata(raw),
  };

  return {
    slug: id,
    title: navn,
    content,
  };
}

function buildNormalizedText(itemType, content) {
  if (itemType === "rule") {
    return normalizeText([
      content.name,
      content.category,
      content.description,
      content.addToPrompt,
      content.negativeAdd,
      (content.tags || []).join(" "),
      JSON.stringify(content.metadata || {}),
    ].join(" "));
  }

  if (itemType === "term") {
    return normalizeText([
      content.term_no,
      content.term_en,
      content.definition_no,
      content.promptImpact,
      (content.examples || []).join(" "),
      (content.relatedTerms || []).join(" "),
      (content.tags || []).join(" "),
      JSON.stringify(content.metadata || {}),
    ].join(" "));
  }

  if (itemType === "template") {
    return normalizeText([
      content.title,
      content.useCase,
      content.outputType,
      content.domain,
      (content.blocks || []).map((block) => `${block.title} ${block.instruction}`).join(" "),
      (content.recommendedRules || []).join(" "),
      (content.tags || []).join(" "),
      JSON.stringify(content.metadata || {}),
    ].join(" "));
  }

  if (itemType === "example") {
    return normalizeText([
      content.title,
      content.outputType,
      content.domain,
      content.shortInput,
      content.longOutput,
      (content.whyWorks || []).join(" "),
      (content.ruleIds || []).join(" "),
      (content.termSlugs || []).join(" "),
      content.negativePreset || "",
      (content.tags || []).join(" "),
      JSON.stringify(content.metadata || {}),
    ].join(" "));
  }

  if (itemType === "negative_preset") {
    return normalizeText([
      content.title,
      content.description,
      (content.items || []).join(" "),
      (content.tags || []).join(" "),
      JSON.stringify(content.metadata || {}),
    ].join(" "));
  }

  return normalizeText([
    content.navn,
    content.effekt,
    content.representasjonsskift || "",
    content.promptStruktur?.mal || "",
    (content.sterkeBegreper || []).join(" "),
    (content.tags || []).join(" "),
    JSON.stringify(content.metadata || {}),
  ].join(" "));
}

function buildConstraintText(itemType, content) {
  if (itemType === "rule") return normalizeWhitespace(content.addToPrompt || "");
  if (itemType === "term") {
    return normalizeWhitespace(`${(content.examples || []).join(" ")} ${(content.tags || []).join(" ")}`);
  }
  if (itemType === "template") {
    const metadata = content.metadata && typeof content.metadata === "object" ? content.metadata : {};
    const taxonomy = metadata.taxonomy && typeof metadata.taxonomy === "object" ? metadata.taxonomy : {};
    const taxonomyKeys = [
      taxonomy.kanal,
      taxonomy.format,
      taxonomy.mal,
      taxonomy.brandLock ? "brandLock" : "",
      taxonomy.textLock ? "textLock" : "",
      taxonomy.productLock ? "productLock" : "",
    ]
      .map((entry) => normalizeWhitespace(entry))
      .filter(Boolean)
      .join(" ");

    return normalizeWhitespace(
      `${(content.blocks || []).map((block) => block.instruction).join(" ")} ${(content.tags || []).join(
        " "
      )} ${taxonomyKeys}`
    );
  }
  if (itemType === "example") {
    return normalizeWhitespace(
      `${(content.ruleIds || []).join(" ")} ${(content.longOutput || "")} ${(content.tags || []).join(" ")}`
    );
  }
  if (itemType === "negative_preset") {
    return normalizeWhitespace(`${(content.items || []).join(" ")} ${(content.tags || []).join(" ")}`);
  }
  return normalizeWhitespace(content.promptStruktur?.mal || "");
}

function buildNegativeText(itemType, content) {
  if (itemType === "rule") return normalizeWhitespace(content.negativeAdd || "");
  if (itemType === "term") return normalizeWhitespace(`${(content.relatedTerms || []).join(" ")} ${(content.tags || []).join(" ")}`);
  if (itemType === "template") return normalizeWhitespace(`${(content.recommendedRules || []).join(" ")} ${(content.tags || []).join(" ")}`);
  if (itemType === "example") return normalizeWhitespace(`${(content.whyWorks || []).join(" ")} ${(content.tags || []).join(" ")}`);
  if (itemType === "negative_preset") return normalizeWhitespace(`${(content.items || []).join(" ")} ${(content.tags || []).join(" ")}`);
  return normalizeWhitespace(`${(content.sterkeBegreper || []).join(" ")} ${(content.tags || []).join(" ")}`);
}

export function canonicalizeIngestRow(row) {
  const itemType = row?.item_type;
  if (!ITEM_TYPES.has(itemType)) {
    throw new Error(`Ugyldig item_type i ingest: ${itemType}`);
  }

  const rawJson = parseJsonMaybe(row.raw_json);
  const rawText = normalizeWhitespace(row.raw_text || "");

  if (!rawJson && !rawText) {
    throw new Error("Ingest-rad mangler raw_json og raw_text.");
  }

  const payload = rawJson && typeof rawJson === "object" ? rawJson : { raw_text: rawText };

  let canonical;
  if (itemType === "rule") canonical = toRuleContent(payload, rawText);
  else if (itemType === "term") canonical = toTermContent(payload, rawText);
  else if (itemType === "template") canonical = toTemplateContent(payload, rawText);
  else if (itemType === "example") canonical = toExampleContent(payload, rawText);
  else if (itemType === "negative_preset") canonical = toNegativePresetContent(payload, rawText);
  else canonical = toRepresentationSwitchContent(payload, rawText);

  const normalizedText = buildNormalizedText(itemType, canonical.content);

  return {
    itemType,
    slug: canonical.slug,
    title: canonical.title,
    contentJson: canonical.content,
    normalizedText,
    constraintsText: buildConstraintText(itemType, canonical.content),
    negativeText: buildNegativeText(itemType, canonical.content),
  };
}
