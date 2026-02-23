import { promptExamples as staticExamples, examplesBySlug as staticExamplesBySlug } from "./examples";
import { glossaryTerms as staticGlossary, glossaryBySlug as staticGlossaryBySlug } from "./glossary";
import { negativePresets as staticNegativePresets, negativePresetsById as staticNegativePresetsById } from "./negativePresets";
import { norskPromptingRules as staticRules, rulesById as staticRulesById } from "./rules";
import { promptTemplates as staticTemplates, templatesById as staticTemplatesById } from "./templates";
import type { GlossaryTerm, NorskPromptingRule, PromptExample, PromptTemplate } from "./types";
import { examplesGenerated } from "./generated/examples.generated";
import { glossaryGenerated } from "./generated/glossary.generated";
import { negativePresetsGenerated } from "./generated/negativePresets.generated";
import { rulesGenerated } from "./generated/rules.generated";
import { templatesGenerated } from "./generated/templates.generated";

type NegativePreset = {
  id: string;
  title: string;
  description: string;
  items: string[];
};

function dedupeByKey<T>(items: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];

  for (const item of items) {
    const key = keyFn(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

function selectDataset<T>(generated: T[], fallback: T[], keyFn: (item: T) => string): T[] {
  const source = generated.length > 0 ? [...generated, ...fallback] : fallback;
  return dedupeByKey(source, keyFn);
}

export const glossaryTerms: GlossaryTerm[] = selectDataset(
  glossaryGenerated,
  staticGlossary,
  (item) => item.slug
).sort((a, b) => a.term_no.localeCompare(b.term_no, "nb-NO"));

export const glossaryBySlug = Object.fromEntries(
  glossaryTerms.map((entry) => [entry.slug, entry])
) as Record<string, GlossaryTerm>;

export const norskPromptingRules: NorskPromptingRule[] = selectDataset(
  rulesGenerated,
  staticRules,
  (item) => item.id
);

export const rulesById = Object.fromEntries(
  norskPromptingRules.map((entry) => [entry.id, entry])
) as Record<string, NorskPromptingRule>;

export const promptTemplates: PromptTemplate[] = selectDataset(
  templatesGenerated,
  staticTemplates,
  (item) => item.id
);

export const templatesById = Object.fromEntries(
  promptTemplates.map((entry) => [entry.id, entry])
) as Record<string, PromptTemplate>;

export const promptExamples: PromptExample[] = selectDataset(
  examplesGenerated,
  staticExamples,
  (item) => item.slug
);

export const examplesBySlug = Object.fromEntries(
  promptExamples.map((entry) => [entry.slug, entry])
) as Record<string, PromptExample>;

export const negativePresets: NegativePreset[] = selectDataset(
  negativePresetsGenerated,
  staticNegativePresets,
  (item) => item.id
);

export const negativePresetsById = Object.fromEntries(
  negativePresets.map((entry) => [entry.id, entry])
) as Record<string, NegativePreset>;

export const usingGeneratedDatasets = {
  glossary: glossaryGenerated.length > 0,
  rules: rulesGenerated.length > 0,
  templates: templatesGenerated.length > 0,
  examples: examplesGenerated.length > 0,
  negativePresets: negativePresetsGenerated.length > 0,
};

export const runtimeCounts = {
  glossaryDisplayed: glossaryTerms.length,
  glossaryRegistered: glossaryGenerated.length > 0 ? glossaryGenerated.length : staticGlossary.length,
  rulesDisplayed: norskPromptingRules.length,
  rulesRegistered: rulesGenerated.length > 0 ? rulesGenerated.length : staticRules.length,
  templatesDisplayed: promptTemplates.length,
  templatesRegistered: templatesGenerated.length > 0 ? templatesGenerated.length : staticTemplates.length,
  examplesDisplayed: promptExamples.length,
  examplesRegistered: examplesGenerated.length > 0 ? examplesGenerated.length : staticExamples.length,
};

// Keep static references exported for debugging or comparisons in admin tooling.
export const _staticDatasetCounts = {
  glossary: Object.keys(staticGlossaryBySlug).length,
  rules: Object.keys(staticRulesById).length,
  templates: Object.keys(staticTemplatesById).length,
  examples: Object.keys(staticExamplesBySlug).length,
  negativePresets: Object.keys(staticNegativePresetsById).length,
};
