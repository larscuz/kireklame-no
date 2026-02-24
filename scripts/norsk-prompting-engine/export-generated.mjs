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

function rowTimestamp(row) {
  const ts = Date.parse(String(row?.updated_at || row?.created_at || ""));
  return Number.isFinite(ts) ? ts : 0;
}

function dedupeByKeyPreferNewest(items, keyFn) {
  const selected = new Map();

  for (const item of items) {
    const key = String(keyFn(item) || "").trim();
    if (!key) continue;

    const existing = selected.get(key);
    if (!existing) {
      selected.set(key, item);
      continue;
    }

    const currentTs = rowTimestamp(item);
    const existingTs = rowTimestamp(existing);

    if (currentTs > existingTs) {
      selected.set(key, item);
      continue;
    }

    if (currentTs === existingTs) {
      const currentId = Number(item?.id) || 0;
      const existingId = Number(existing?.id) || 0;
      if (currentId > existingId) {
        selected.set(key, item);
      }
    }
  }

  return Array.from(selected.entries())
    .sort((left, right) => left[0].localeCompare(right[0], "nb"))
    .map((entry) => entry[1]);
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
  const selectedRows = dedupeByKeyPreferNewest(items, (row) => mapRule(row).id);
  const rows = selectedRows.map((row) => mapRule(row));
  const rawRows = selectedRows.map((row) => row.content_json || {});
  return (
    header("rules.generated.ts") +
    `import type { NorskPromptingRule } from "../types";\n\n` +
    `export const rulesGeneratedRaw = ${toJson(rawRows)};\n\n` +
    `export const rulesGenerated: NorskPromptingRule[] = ${toJson(rows)};\n\n` +
    `export const rulesGeneratedById = Object.fromEntries(rulesGenerated.map((entry) => [entry.id, entry]));\n`
  );
}

function renderGlossaryFile(items) {
  const selectedRows = dedupeByKeyPreferNewest(items, (row) => mapGlossary(row).slug);
  const rows = selectedRows.map((row) => mapGlossary(row));
  const rawRows = selectedRows.map((row) => row.content_json || {});
  return (
    header("glossary.generated.ts") +
    `import type { GlossaryTerm } from "../types";\n\n` +
    `export const glossaryGeneratedRaw = ${toJson(rawRows)};\n\n` +
    `export const glossaryGenerated: GlossaryTerm[] = ${toJson(rows)};\n\n` +
    `export const glossaryGeneratedBySlug = Object.fromEntries(glossaryGenerated.map((entry) => [entry.slug, entry]));\n`
  );
}

function renderTemplatesFile(items) {
  const selectedRows = dedupeByKeyPreferNewest(items, (row) => mapTemplate(row).id);
  const rows = selectedRows.map((row) => mapTemplate(row));
  const rawRows = selectedRows.map((row) => row.content_json || {});
  return (
    header("templates.generated.ts") +
    `import type { PromptTemplate } from "../types";\n\n` +
    `export const templatesGeneratedRaw = ${toJson(rawRows)};\n\n` +
    `export const templatesGenerated: PromptTemplate[] = ${toJson(rows)};\n\n` +
    `export const templatesGeneratedById = Object.fromEntries(templatesGenerated.map((entry) => [entry.id, entry]));\n`
  );
}

function renderExamplesFile(items) {
  const selectedRows = dedupeByKeyPreferNewest(items, (row) => mapExample(row).slug);
  const rows = selectedRows.map((row) => mapExample(row));
  const rawRows = selectedRows.map((row) => row.content_json || {});
  return (
    header("examples.generated.ts") +
    `import type { PromptExample } from "../types";\n\n` +
    `export const examplesGeneratedRaw = ${toJson(rawRows)};\n\n` +
    `export const examplesGenerated: PromptExample[] = ${toJson(rows)};\n\n` +
    `export const examplesGeneratedBySlug = Object.fromEntries(examplesGenerated.map((entry) => [entry.slug, entry]));\n`
  );
}

function renderNegativePresetsFile(items) {
  const selectedRows = dedupeByKeyPreferNewest(items, (row) => mapNegativePreset(row).id);
  const rows = selectedRows.map((row) => mapNegativePreset(row));
  const rawRows = selectedRows.map((row) => row.content_json || {});
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
  const selectedRows = dedupeByKeyPreferNewest(items, (row) => mapRepresentationSwitch(row).id);
  const rows = selectedRows.map((row) => mapRepresentationSwitch(row));
  const rawRows = selectedRows.map((row) => row.content_json || {});
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
      count: dedupeByKeyPreferNewest(rules, (row) => mapRule(row).id).length,
      key: "rules",
    },
    {
      path: path.join(GENERATED_DIR, "glossary.generated.ts"),
      content: renderGlossaryFile(terms),
      count: dedupeByKeyPreferNewest(terms, (row) => mapGlossary(row).slug).length,
      key: "glossary",
    },
    {
      path: path.join(GENERATED_DIR, "templates.generated.ts"),
      content: renderTemplatesFile(templates),
      count: dedupeByKeyPreferNewest(templates, (row) => mapTemplate(row).id).length,
      key: "templates",
    },
    {
      path: path.join(GENERATED_DIR, "examples.generated.ts"),
      content: renderExamplesFile(examples),
      count: dedupeByKeyPreferNewest(examples, (row) => mapExample(row).slug).length,
      key: "examples",
    },
    {
      path: path.join(GENERATED_DIR, "negativePresets.generated.ts"),
      content: renderNegativePresetsFile(negatives),
      count: dedupeByKeyPreferNewest(negatives, (row) => mapNegativePreset(row).id).length,
      key: "negativePresets",
    },
    {
      path: path.join(GENERATED_DIR, "representationSwitches.generated.ts"),
      content: renderRepresentationSwitchesFile(switches),
      count: dedupeByKeyPreferNewest(switches, (row) => mapRepresentationSwitch(row).id).length,
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
