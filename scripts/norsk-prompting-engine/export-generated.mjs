import fs from "node:fs";
import path from "node:path";
import { createDbClient, loadActiveItemsByType } from "./db.mjs";

const GENERATED_DIR = path.join(process.cwd(), "src", "data", "norskPrompting", "generated");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

function toJson(value) {
  return JSON.stringify(value, null, 2);
}

function dedupeByKey(items, keyFn) {
  const seen = new Set();
  const out = [];

  for (const item of items) {
    const key = String(keyFn(item) || "").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

function header(label) {
  return `// AUTO-GENERERT AV Norsk Prompting Data Engine\n// Fil: ${label}\n// Ikke rediger manuelt.\n\n`;
}

function mapRule(row) {
  const content = row?.content_json || {};
  return {
    id: content.id || row?.slug || "",
    name: content.name || "",
    category: content.category || "Produksjonslogikk",
    severity: Number(content.severity) || 3,
    description: content.description || "",
    appliesTo: content.appliesTo || "all",
    addToPrompt: content.addToPrompt || "",
    negativeAdd: content.negativeAdd || "",
  };
}

function mapGlossary(row) {
  const content = row?.content_json || {};
  return {
    slug: content.slug || row?.slug || "",
    term_no: content.term_no || "",
    term_en: content.term_en || "",
    domain: content.domain || "ai",
    definition_no: content.definition_no || "",
    promptImpact: content.promptImpact || "",
    examples: Array.isArray(content.examples) ? content.examples : [],
    relatedTerms: Array.isArray(content.relatedTerms) ? content.relatedTerms : [],
  };
}

function mapTemplate(row) {
  const content = row?.content_json || {};
  return {
    id: content.id || row?.slug || "",
    title: content.title || "",
    useCase: content.useCase || "",
    outputType: content.outputType || "image",
    domain: content.domain || "film-vfx",
    blocks: Array.isArray(content.blocks)
      ? content.blocks.map((block, index) => ({
          id: block?.id || `blokk-${index + 1}`,
          title: block?.title || `Blokk ${index + 1}`,
          instruction: block?.instruction || "",
        }))
      : [],
    recommendedRules: Array.isArray(content.recommendedRules) ? content.recommendedRules : [],
  };
}

function mapExample(row) {
  const content = row?.content_json || {};
  return {
    slug: content.slug || row?.slug || "",
    title: content.title || "",
    outputType: content.outputType || "image",
    domain: content.domain || "film-vfx",
    shortInput: content.shortInput || "",
    longOutput: content.longOutput || "",
    whyWorks: Array.isArray(content.whyWorks) ? content.whyWorks : [],
    ruleIds: Array.isArray(content.ruleIds) ? content.ruleIds : [],
    termSlugs: Array.isArray(content.termSlugs) ? content.termSlugs : [],
    updatedAt: content.updatedAt || new Date().toISOString().slice(0, 10),
  };
}

function mapNegativePreset(row) {
  const content = row?.content_json || {};
  return {
    id: content.id || row?.slug || "",
    title: content.title || "",
    description: content.description || "",
    items: Array.isArray(content.items) ? content.items : [],
  };
}

function mapRepresentationSwitch(row) {
  const content = row?.content_json || {};
  return {
    id: content.id || row?.slug || "",
    navn: content.navn || "",
    effekt: content.effekt || "",
    representasjonsskift: content.representasjonsskift || "",
    promptStruktur: {
      mal: content?.promptStruktur?.mal || "",
    },
    sterkeBegreper: Array.isArray(content.sterkeBegreper) ? content.sterkeBegreper : [],
  };
}

function renderRulesFile(items) {
  const rows = dedupeByKey(items.map((row) => mapRule(row)), (entry) => entry.id);
  const allowed = new Set(rows.map((entry) => entry.id));
  const rawRows = dedupeByKey(
    items.map((row) => row.content_json || {}).filter((entry) => allowed.has(String(entry?.id || ""))),
    (entry) => entry?.id
  );
  return (
    header("rules.generated.ts") +
    `import type { NorskPromptingRule } from "../types";\n\n` +
    `export const rulesGeneratedRaw = ${toJson(rawRows)};\n\n` +
    `export const rulesGenerated: NorskPromptingRule[] = ${toJson(rows)};\n\n` +
    `export const rulesGeneratedById = Object.fromEntries(rulesGenerated.map((entry) => [entry.id, entry]));\n`
  );
}

function renderGlossaryFile(items) {
  const rows = dedupeByKey(items.map((row) => mapGlossary(row)), (entry) => entry.slug);
  const allowed = new Set(rows.map((entry) => entry.slug));
  const rawRows = dedupeByKey(
    items.map((row) => row.content_json || {}).filter((entry) => allowed.has(String(entry?.slug || ""))),
    (entry) => entry?.slug
  );
  return (
    header("glossary.generated.ts") +
    `import type { GlossaryTerm } from "../types";\n\n` +
    `export const glossaryGeneratedRaw = ${toJson(rawRows)};\n\n` +
    `export const glossaryGenerated: GlossaryTerm[] = ${toJson(rows)};\n\n` +
    `export const glossaryGeneratedBySlug = Object.fromEntries(glossaryGenerated.map((entry) => [entry.slug, entry]));\n`
  );
}

function renderTemplatesFile(items) {
  const rows = dedupeByKey(items.map((row) => mapTemplate(row)), (entry) => entry.id);
  const allowed = new Set(rows.map((entry) => entry.id));
  const rawRows = dedupeByKey(
    items.map((row) => row.content_json || {}).filter((entry) => allowed.has(String(entry?.id || ""))),
    (entry) => entry?.id
  );
  return (
    header("templates.generated.ts") +
    `import type { PromptTemplate } from "../types";\n\n` +
    `export const templatesGeneratedRaw = ${toJson(rawRows)};\n\n` +
    `export const templatesGenerated: PromptTemplate[] = ${toJson(rows)};\n\n` +
    `export const templatesGeneratedById = Object.fromEntries(templatesGenerated.map((entry) => [entry.id, entry]));\n`
  );
}

function renderExamplesFile(items) {
  const rows = dedupeByKey(items.map((row) => mapExample(row)), (entry) => entry.slug);
  const allowed = new Set(rows.map((entry) => entry.slug));
  const rawRows = dedupeByKey(
    items.map((row) => row.content_json || {}).filter((entry) => allowed.has(String(entry?.slug || ""))),
    (entry) => entry?.slug
  );
  return (
    header("examples.generated.ts") +
    `import type { PromptExample } from "../types";\n\n` +
    `export const examplesGeneratedRaw = ${toJson(rawRows)};\n\n` +
    `export const examplesGenerated: PromptExample[] = ${toJson(rows)};\n\n` +
    `export const examplesGeneratedBySlug = Object.fromEntries(examplesGenerated.map((entry) => [entry.slug, entry]));\n`
  );
}

function renderNegativePresetsFile(items) {
  const rows = dedupeByKey(items.map((row) => mapNegativePreset(row)), (entry) => entry.id);
  const allowed = new Set(rows.map((entry) => entry.id));
  const rawRows = dedupeByKey(
    items.map((row) => row.content_json || {}).filter((entry) => allowed.has(String(entry?.id || ""))),
    (entry) => entry?.id
  );
  return (
    header("negativePresets.generated.ts") +
    `export type NegativePresetGenerated = {\n` +
    `  id: string;\n` +
    `  title: string;\n` +
    `  description: string;\n` +
    `  items: string[];\n` +
    `};\n\n` +
    `export const negativePresetsGeneratedRaw = ${toJson(rawRows)};\n\n` +
    `export const negativePresetsGenerated: NegativePresetGenerated[] = ${toJson(rows)};\n\n` +
    `export const negativePresetsGeneratedById = Object.fromEntries(negativePresetsGenerated.map((entry) => [entry.id, entry]));\n`
  );
}

function renderRepresentationSwitchesFile(items) {
  const rows = dedupeByKey(items.map((row) => mapRepresentationSwitch(row)), (entry) => entry.id);
  const allowed = new Set(rows.map((entry) => entry.id));
  const rawRows = dedupeByKey(
    items.map((row) => row.content_json || {}).filter((entry) => allowed.has(String(entry?.id || ""))),
    (entry) => entry?.id
  );
  return (
    header("representationSwitches.generated.ts") +
    `import type { CinematicGenre } from "../types";\n\n` +
    `export const representationSwitchesGeneratedRaw = ${toJson(rawRows)};\n\n` +
    `export const representationSwitchesGenerated: CinematicGenre[] = ${toJson(rows)};\n\n` +
    `export const representationSwitchesGeneratedById = Object.fromEntries(representationSwitchesGenerated.map((entry) => [entry.id, entry]));\n`
  );
}

export async function exportGeneratedFiles() {
  const db = createDbClient();
  ensureDir(GENERATED_DIR);

  const [rules, terms, templates, examples, negatives, switches] = await Promise.all([
    loadActiveItemsByType(db, "rule"),
    loadActiveItemsByType(db, "term"),
    loadActiveItemsByType(db, "template"),
    loadActiveItemsByType(db, "example"),
    loadActiveItemsByType(db, "negative_preset"),
    loadActiveItemsByType(db, "representation_switch"),
  ]);

  const files = [
    {
      path: path.join(GENERATED_DIR, "rules.generated.ts"),
      content: renderRulesFile(rules),
      count: dedupeByKey(rules.map((row) => mapRule(row)), (entry) => entry.id).length,
      key: "rules",
    },
    {
      path: path.join(GENERATED_DIR, "glossary.generated.ts"),
      content: renderGlossaryFile(terms),
      count: dedupeByKey(terms.map((row) => mapGlossary(row)), (entry) => entry.slug).length,
      key: "glossary",
    },
    {
      path: path.join(GENERATED_DIR, "templates.generated.ts"),
      content: renderTemplatesFile(templates),
      count: dedupeByKey(templates.map((row) => mapTemplate(row)), (entry) => entry.id).length,
      key: "templates",
    },
    {
      path: path.join(GENERATED_DIR, "examples.generated.ts"),
      content: renderExamplesFile(examples),
      count: dedupeByKey(examples.map((row) => mapExample(row)), (entry) => entry.slug).length,
      key: "examples",
    },
    {
      path: path.join(GENERATED_DIR, "negativePresets.generated.ts"),
      content: renderNegativePresetsFile(negatives),
      count: dedupeByKey(negatives.map((row) => mapNegativePreset(row)), (entry) => entry.id).length,
      key: "negativePresets",
    },
    {
      path: path.join(GENERATED_DIR, "representationSwitches.generated.ts"),
      content: renderRepresentationSwitchesFile(switches),
      count: dedupeByKey(switches.map((row) => mapRepresentationSwitch(row)), (entry) => entry.id).length,
      key: "representationSwitches",
    },
  ];

  for (const file of files) {
    writeFile(file.path, file.content);
  }

  return {
    ok: true,
    outputDir: GENERATED_DIR,
    counts: Object.fromEntries(files.map((file) => [file.key, file.count])),
    files: files.map((file) => path.relative(process.cwd(), file.path)),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  exportGeneratedFiles()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      const message = error instanceof Error ? error.message : "Ukjent feil";
      console.error(JSON.stringify({ ok: false, error: message }, null, 2));
      process.exit(1);
    });
}
