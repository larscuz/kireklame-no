import type {
  GovernanceAppliesTo,
  SemantiskDuplikatAction,
  SemantiskDuplikatMetrikk,
} from "@/data/norskPrompting/types";

export type DuplikatEntry = {
  id: string;
  sourceType: GovernanceAppliesTo;
  name: string;
  definition: string;
  promptImpact: string;
  constraints: string;
  negative: string;
};

export type DuplikatCandidate = Partial<Omit<DuplikatEntry, "constraints" | "negative">> & {
  name?: string;
  title?: string;
  term_no?: string;
  definition_no?: string;
  description?: string;
  useCase?: string;
  promptImpact?: string;
  constraints?: string | string[];
  negative?: string | string[];
};

export type DuplikatAnalyse = {
  action: SemantiskDuplikatAction;
  overlapPercent: number;
  metrics: SemantiskDuplikatMetrikk;
  reason: string;
  match: DuplikatEntry | null;
  forslag: string;
};

const STOPWORDS = new Set([
  "og",
  "i",
  "på",
  "av",
  "for",
  "med",
  "som",
  "til",
  "er",
  "det",
  "en",
  "et",
  "den",
  "de",
  "skal",
  "ikke",
  "uten",
  "hvis",
  "ved",
  "om",
  "kan",
  "blir",
  "være",
  "vaere",
  "the",
  "and",
  "or",
  "to",
  "of",
  "in",
]);

function normalizeText(value: string): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): Set<string> {
  const normalized = normalizeText(value);
  const tokens = normalized
    .split(" ")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 2)
    .filter((entry) => !STOPWORDS.has(entry));

  return new Set(tokens);
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size && !b.size) return 1;
  if (!a.size || !b.size) return 0;

  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }

  const union = a.size + b.size - intersection;
  return union ? intersection / union : 0;
}

function bigrams(value: string): Set<string> {
  const normalized = normalizeText(value).replace(/\s+/g, "_");
  if (normalized.length < 2) return new Set(normalized ? [normalized] : []);

  const tokens = new Set<string>();
  for (let i = 0; i < normalized.length - 1; i += 1) {
    tokens.add(normalized.slice(i, i + 2));
  }

  return tokens;
}

function dice(a: string, b: string): number {
  const aBigrams = bigrams(a);
  const bBigrams = bigrams(b);

  if (!aBigrams.size && !bBigrams.size) return 1;
  if (!aBigrams.size || !bBigrams.size) return 0;

  let intersection = 0;
  for (const token of aBigrams) {
    if (bBigrams.has(token)) intersection += 1;
  }

  return (2 * intersection) / (aBigrams.size + bBigrams.size);
}

function semanticSimilarity(left: string, right: string): number {
  const l = String(left ?? "");
  const r = String(right ?? "");
  if (!l.trim() && !r.trim()) return 1;
  if (!l.trim() || !r.trim()) return 0;

  const tokenScore = jaccard(tokenize(l), tokenize(r));
  const diceScore = dice(l, r);
  return Math.max(0, Math.min(1, tokenScore * 0.65 + diceScore * 0.35));
}

function toJoinedText(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value.join(" ");
  return String(value ?? "");
}

export function normalizeCandidate(input: DuplikatCandidate, sourceType: GovernanceAppliesTo): DuplikatEntry {
  return {
    id: String(input.id ?? "candidate"),
    sourceType,
    name: String(input.name ?? input.title ?? input.term_no ?? ""),
    definition: String(input.definition ?? input.definition_no ?? input.description ?? ""),
    promptImpact: String(input.promptImpact ?? input.useCase ?? ""),
    constraints: toJoinedText(input.constraints),
    negative: toJoinedText(input.negative),
  };
}

export function calcMetrics(candidate: DuplikatEntry, existing: DuplikatEntry): SemantiskDuplikatMetrikk {
  const nameSimilarity = semanticSimilarity(candidate.name, existing.name);
  const definitionSimilarity = semanticSimilarity(candidate.definition, existing.definition);
  const promptImpactSimilarity = semanticSimilarity(candidate.promptImpact, existing.promptImpact);
  const constraintsSimilarity = semanticSimilarity(candidate.constraints, existing.constraints);
  const negativeSimilarity = semanticSimilarity(candidate.negative, existing.negative);

  const weighted =
    nameSimilarity * 0.25 +
    definitionSimilarity * 0.3 +
    promptImpactSimilarity * 0.2 +
    constraintsSimilarity * 0.15 +
    negativeSimilarity * 0.1;

  return {
    nameSimilarity,
    definitionSimilarity,
    promptImpactSimilarity,
    constraintsSimilarity,
    negativeSimilarity,
    samletOverlap: weighted,
  };
}

function toPercent(score: number): number {
  return Math.round(Math.max(0, Math.min(1, score)) * 100);
}

function classify(overlap: number, nameSimilarity: number): {
  action: SemantiskDuplikatAction;
  reason: string;
  forslag: string;
} {
  if (overlap >= 0.95 || (overlap >= 0.9 && nameSimilarity >= 0.95)) {
    return {
      action: "forkast",
      reason: "Identisk eller praktisk talt identisk entry.",
      forslag: "Forkast ny entry og behold eksisterende som kildeversjon.",
    };
  }

  if (overlap >= 0.8) {
    return {
      action: "sla_sammen",
      reason: "Høy semantisk overlapp over 80 prosent.",
      forslag: "Slå sammen ny informasjon inn i eksisterende entry i stedet for å opprette ny.",
    };
  }

  if (overlap >= 0.4) {
    return {
      action: "berik_eksisterende",
      reason: "Delvis overlapp mellom 40 og 80 prosent.",
      forslag: "Berik eksisterende entry og vurder kobling via relatedTerms.",
    };
  }

  return {
    action: "opprett_ny",
    reason: "Lav semantisk overlapp under 40 prosent.",
    forslag: "Opprett ny entry i riktig kategori.",
  };
}

export function analyseSemantiskDuplikat(
  candidate: DuplikatEntry,
  existingEntries: DuplikatEntry[]
): DuplikatAnalyse {
  if (!existingEntries.length) {
    return {
      action: "opprett_ny",
      overlapPercent: 0,
      metrics: {
        nameSimilarity: 0,
        definitionSimilarity: 0,
        promptImpactSimilarity: 0,
        constraintsSimilarity: 0,
        negativeSimilarity: 0,
        samletOverlap: 0,
      },
      reason: "Ingen eksisterende entries å sammenligne med.",
      match: null,
      forslag: "Opprett ny entry.",
    };
  }

  let bestMatch: DuplikatEntry | null = null;
  let bestMetrics: SemantiskDuplikatMetrikk | null = null;

  for (const entry of existingEntries) {
    const metrics = calcMetrics(candidate, entry);
    if (!bestMetrics || metrics.samletOverlap > bestMetrics.samletOverlap) {
      bestMetrics = metrics;
      bestMatch = entry;
    }
  }

  const metrics = bestMetrics!;
  const decision = classify(metrics.samletOverlap, metrics.nameSimilarity);

  return {
    action: decision.action,
    overlapPercent: toPercent(metrics.samletOverlap),
    metrics,
    reason: decision.reason,
    forslag: decision.forslag,
    match: bestMatch,
  };
}
