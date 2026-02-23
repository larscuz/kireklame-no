import { normalizeWhitespace, uniq, wordCount } from "./text-normalize.mjs";

function normalizeLine(input) {
  return normalizeWhitespace(input || "");
}

function normalizeList(list) {
  return uniq((list || []).map((entry) => normalizeLine(entry)).filter(Boolean));
}

function normalizeTokenSet(value) {
  return new Set(
    normalizeLine(value)
      .toLowerCase()
      .split(/[^a-z0-9æøå]+/i)
      .map((token) => token.trim())
      .filter((token) => token.length > 2)
  );
}

function jaccardTokens(a, b) {
  const left = normalizeTokenSet(a);
  const right = normalizeTokenSet(b);
  if (!left.size && !right.size) return 1;
  if (!left.size || !right.size) return 0;

  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection += 1;
  }

  const union = left.size + right.size - intersection;
  return union ? intersection / union : 0;
}

function splitSentences(text) {
  return normalizeList(
    String(text || "")
      .split(/[\n.;]+/)
      .map((entry) => entry.trim())
      .filter(Boolean)
  );
}

function mergeSentences(existingText, incomingText) {
  const merged = normalizeList([...splitSentences(existingText), ...splitSentences(incomingText)]);
  if (!merged.length) return "";
  return merged.join(". ") + ".";
}

const TECHNICAL_HINTS = [
  "linse",
  "brennvidde",
  "fargetemperatur",
  "objektpermanens",
  "temporal",
  "material",
  "komposisjon",
  "render",
  "z-dybde",
  "ortograf",
  "romakse",
  "konsistens",
  "kontrast",
  "lys",
  "fysisk",
];

function technicalScore(text) {
  const normalized = String(text || "").toLowerCase();
  let score = 0;

  for (const hint of TECHNICAL_HINTS) {
    if (normalized.includes(hint)) score += 1;
  }

  score += Math.min(8, Math.floor(wordCount(normalized) / 16));
  return score;
}

function preferMorePreciseText(existingText, incomingText) {
  const existing = normalizeLine(existingText);
  const incoming = normalizeLine(incomingText);

  if (!existing) return incoming;
  if (!incoming) return existing;
  if (existing === incoming) return existing;

  const existingScore = technicalScore(existing);
  const incomingScore = technicalScore(incoming);

  if (incomingScore >= existingScore + 2) return incoming;
  if (incomingScore === existingScore && incoming.length > existing.length + 15) return incoming;

  return existing;
}

function diffObject(before, after) {
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  const changed = {};

  for (const key of keys) {
    const left = JSON.stringify(before?.[key] ?? null);
    const right = JSON.stringify(after?.[key] ?? null);
    if (left !== right) {
      changed[key] = {
        before: before?.[key] ?? null,
        after: after?.[key] ?? null,
      };
    }
  }

  return changed;
}

function mergeRule(existing, incoming) {
  return {
    ...existing,
    description: preferMorePreciseText(existing.description, incoming.description),
    addToPrompt: mergeSentences(existing.addToPrompt, incoming.addToPrompt),
    negativeAdd: mergeSentences(existing.negativeAdd, incoming.negativeAdd),
    severity: Math.max(Number(existing.severity) || 3, Number(incoming.severity) || 3),
    tags: normalizeList([...(existing.tags || []), ...(incoming.tags || [])]),
    metadata: {
      ...(existing.metadata && typeof existing.metadata === "object" ? existing.metadata : {}),
      ...(incoming.metadata && typeof incoming.metadata === "object" ? incoming.metadata : {}),
    },
  };
}

function mergeTerm(existing, incoming) {
  return {
    ...existing,
    term_en: preferMorePreciseText(existing.term_en, incoming.term_en),
    definition_no: preferMorePreciseText(existing.definition_no, incoming.definition_no),
    promptImpact: preferMorePreciseText(existing.promptImpact, incoming.promptImpact),
    examples: normalizeList([...(existing.examples || []), ...(incoming.examples || [])]),
    relatedTerms: normalizeList([...(existing.relatedTerms || []), ...(incoming.relatedTerms || [])]),
    aliases: normalizeList([
      ...(existing.aliases || []),
      ...(incoming.aliases || []),
      existing.term_no,
      incoming.term_no,
    ]).filter((entry) => entry !== existing.term_no),
    tags: normalizeList([...(existing.tags || []), ...(incoming.tags || [])]),
    metadata: {
      ...(existing.metadata && typeof existing.metadata === "object" ? existing.metadata : {}),
      ...(incoming.metadata && typeof incoming.metadata === "object" ? incoming.metadata : {}),
    },
  };
}

function mergeTemplateBlocks(existingBlocks, incomingBlocks) {
  const index = new Map((existingBlocks || []).map((block) => [block.id, { ...block }]));

  for (const block of incomingBlocks || []) {
    const current = index.get(block.id);
    if (!current) {
      const duplicateByFunction = Array.from(index.values()).some((existing) => {
        const titleScore = jaccardTokens(existing.title, block.title);
        const instructionScore = jaccardTokens(existing.instruction, block.instruction);
        return titleScore >= 0.88 || instructionScore >= 0.88;
      });

      if (duplicateByFunction) {
        continue;
      }

      index.set(block.id, { ...block });
      continue;
    }

    index.set(block.id, {
      ...current,
      title: preferMorePreciseText(current.title, block.title),
      instruction: preferMorePreciseText(current.instruction, block.instruction),
    });
  }

  return Array.from(index.values());
}

function mergeTemplate(existing, incoming) {
  const incomingTaxonomy =
    incoming.metadata && typeof incoming.metadata === "object" && incoming.metadata.taxonomy
      ? incoming.metadata.taxonomy
      : {};
  const existingTaxonomy =
    existing.metadata && typeof existing.metadata === "object" && existing.metadata.taxonomy
      ? existing.metadata.taxonomy
      : {};

  const uniqueCombination = [
    incomingTaxonomy.kanal || existingTaxonomy.kanal || "",
    incomingTaxonomy.format || existingTaxonomy.format || "",
    incomingTaxonomy.mal || existingTaxonomy.mal || "",
    incomingTaxonomy.strenghet || existingTaxonomy.strenghet || "",
    incomingTaxonomy.brandLock != null
      ? `brand:${incomingTaxonomy.brandLock}`
      : existingTaxonomy.brandLock != null
      ? `brand:${existingTaxonomy.brandLock}`
      : "",
    incomingTaxonomy.textLock != null
      ? `text:${incomingTaxonomy.textLock}`
      : existingTaxonomy.textLock != null
      ? `text:${existingTaxonomy.textLock}`
      : "",
    incomingTaxonomy.productLock != null
      ? `product:${incomingTaxonomy.productLock}`
      : existingTaxonomy.productLock != null
      ? `product:${existingTaxonomy.productLock}`
      : "",
  ]
    .filter(Boolean)
    .join("|");

  return {
    ...existing,
    useCase: preferMorePreciseText(existing.useCase, incoming.useCase),
    blocks: mergeTemplateBlocks(existing.blocks || [], incoming.blocks || []),
    recommendedRules: normalizeList([...(existing.recommendedRules || []), ...(incoming.recommendedRules || [])]),
    tags: normalizeList([...(existing.tags || []), ...(incoming.tags || [])]),
    metadata: {
      ...(existing.metadata && typeof existing.metadata === "object" ? existing.metadata : {}),
      ...(incoming.metadata && typeof incoming.metadata === "object" ? incoming.metadata : {}),
      uniqueCombination,
    },
  };
}

function mergeExample(existing, incoming) {
  return {
    ...existing,
    shortInput: preferMorePreciseText(existing.shortInput, incoming.shortInput),
    longOutput: preferMorePreciseText(existing.longOutput, incoming.longOutput),
    whyWorks: normalizeList([...(existing.whyWorks || []), ...(incoming.whyWorks || [])]),
    ruleIds: normalizeList([...(existing.ruleIds || []), ...(incoming.ruleIds || [])]),
    termSlugs: normalizeList([...(existing.termSlugs || []), ...(incoming.termSlugs || [])]),
    negativePreset: normalizeLine(existing.negativePreset || incoming.negativePreset),
    updatedAt: normalizeLine(incoming.updatedAt || existing.updatedAt),
    tags: normalizeList([...(existing.tags || []), ...(incoming.tags || [])]),
    metadata: {
      ...(existing.metadata && typeof existing.metadata === "object" ? existing.metadata : {}),
      ...(incoming.metadata && typeof incoming.metadata === "object" ? incoming.metadata : {}),
    },
  };
}

function mergeNegativePreset(existing, incoming) {
  return {
    ...existing,
    description: preferMorePreciseText(existing.description, incoming.description),
    items: normalizeList([...(existing.items || []), ...(incoming.items || [])]),
    tags: normalizeList([...(existing.tags || []), ...(incoming.tags || [])]),
    metadata: {
      ...(existing.metadata && typeof existing.metadata === "object" ? existing.metadata : {}),
      ...(incoming.metadata && typeof incoming.metadata === "object" ? incoming.metadata : {}),
    },
  };
}

function mergeRepresentationSwitch(existing, incoming) {
  return {
    ...existing,
    effekt: preferMorePreciseText(existing.effekt, incoming.effekt),
    representasjonsskift: preferMorePreciseText(existing.representasjonsskift, incoming.representasjonsskift),
    promptStruktur: {
      mal: preferMorePreciseText(existing?.promptStruktur?.mal, incoming?.promptStruktur?.mal),
    },
    sterkeBegreper: normalizeList([...(existing.sterkeBegreper || []), ...(incoming.sterkeBegreper || [])]),
    tags: normalizeList([...(existing.tags || []), ...(incoming.tags || [])]),
    metadata: {
      ...(existing.metadata && typeof existing.metadata === "object" ? existing.metadata : {}),
      ...(incoming.metadata && typeof incoming.metadata === "object" ? incoming.metadata : {}),
    },
  };
}

export function mergeContentByType(itemType, existingContent, incomingContent) {
  const existing = existingContent && typeof existingContent === "object" ? existingContent : {};
  const incoming = incomingContent && typeof incomingContent === "object" ? incomingContent : {};

  let merged = incoming;

  if (itemType === "rule") merged = mergeRule(existing, incoming);
  else if (itemType === "term") merged = mergeTerm(existing, incoming);
  else if (itemType === "template") merged = mergeTemplate(existing, incoming);
  else if (itemType === "example") merged = mergeExample(existing, incoming);
  else if (itemType === "negative_preset") merged = mergeNegativePreset(existing, incoming);
  else if (itemType === "representation_switch") merged = mergeRepresentationSwitch(existing, incoming);

  const diff = diffObject(existing, merged);

  return {
    merged,
    diff,
    changedKeys: Object.keys(diff),
  };
}
