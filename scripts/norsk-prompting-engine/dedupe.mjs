import { buildFingerprints, hammingDistanceHex64, nearSimilarityFromHamming } from "./fingerprint.mjs";
import { diceCoefficient, jaccard, tokenizeSet } from "./text-normalize.mjs";

function normalizedKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function toUnixMs(value) {
  const ts = Date.parse(String(value || ""));
  return Number.isFinite(ts) ? ts : 0;
}

function findTermSlugMatch(candidate, existingItems) {
  const candidateSlug = normalizedKey(candidate?.slug || candidate?.contentJson?.slug);
  if (!candidateSlug) return null;

  const matches = existingItems.filter((item) => {
    const rowSlug = normalizedKey(item?.slug);
    const contentSlug = normalizedKey(item?.content_json?.slug);
    return rowSlug === candidateSlug || contentSlug === candidateSlug;
  });

  if (!matches.length) return null;

  const directRowSlug = matches.find((item) => normalizedKey(item?.slug) === candidateSlug);
  if (directRowSlug) return directRowSlug;

  return matches.sort((left, right) => {
    const rightTs = toUnixMs(right?.updated_at || right?.created_at);
    const leftTs = toUnixMs(left?.updated_at || left?.created_at);
    return rightTs - leftTs;
  })[0];
}

function toComparableText(item) {
  const content = item.content_json || {};
  const tagsText = `${(content.tags || []).join(" ")}`;
  const metadataText =
    content.metadata && typeof content.metadata === "object" ? JSON.stringify(content.metadata) : "";

  if (item.item_type === "rule") {
    return {
      title: `${content.name || item.title || ""} ${tagsText}`,
      definition: `${content.description || ""} ${metadataText}`,
      impact: `${content.addToPrompt || ""} ${tagsText}`,
      constraints: `${content.addToPrompt || ""} ${tagsText}`,
      negative: `${content.negativeAdd || ""} ${tagsText}`,
    };
  }

  if (item.item_type === "term") {
    return {
      title: `${content.term_no || item.title || ""} ${tagsText}`,
      definition: `${content.definition_no || ""} ${metadataText}`,
      impact: `${content.promptImpact || ""} ${tagsText}`,
      constraints: `${(content.examples || []).join(" ")}`,
      negative: `${(content.relatedTerms || []).join(" ")} ${tagsText}`,
    };
  }

  if (item.item_type === "template") {
    const taxonomy =
      content.metadata && typeof content.metadata === "object" && content.metadata.taxonomy
        ? content.metadata.taxonomy
        : {};
    const signature = [
      taxonomy.kanal || "",
      taxonomy.format || "",
      taxonomy.mal || "",
      taxonomy.brandLock ? "brandLock" : "",
      taxonomy.textLock ? "textLock" : "",
      taxonomy.productLock ? "productLock" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return {
      title: `${content.title || item.title || ""} ${signature} ${tagsText}`,
      definition: `${content.useCase || ""} ${metadataText}`,
      impact: `${(content.blocks || []).map((block) => `${block.title} ${block.instruction}`).join(" ")}`,
      constraints: `${(content.recommendedRules || []).join(" ")} ${signature}`,
      negative: `${tagsText}`,
    };
  }

  if (item.item_type === "example") {
    return {
      title: `${content.title || item.title || ""} ${tagsText}`,
      definition: `${content.shortInput || ""}`,
      impact: `${content.longOutput || ""}`,
      constraints: `${(content.ruleIds || []).join(" ")} ${tagsText}`,
      negative: `${(content.whyWorks || []).join(" ")} ${content.negativePreset || ""}`,
    };
  }

  if (item.item_type === "negative_preset") {
    return {
      title: `${content.title || item.title || ""} ${tagsText}`,
      definition: `${content.description || ""} ${metadataText}`,
      impact: `${(content.items || []).join(" ")} ${tagsText}`,
      constraints: `${(content.items || []).join(" ")} ${tagsText}`,
      negative: `${(content.items || []).join(" ")} ${tagsText}`,
    };
  }

  return {
    title: `${content.navn || item.title || ""} ${tagsText}`,
    definition: `${content.effekt || ""} ${metadataText}`,
    impact: `${content.promptStruktur?.mal || ""}`,
    constraints: `${content.representasjonsskift || ""} ${tagsText}`,
    negative: `${(content.sterkeBegreper || []).join(" ")} ${tagsText}`,
  };
}

function textSimilarity(left, right) {
  const leftTokens = tokenizeSet(left, { removeStopWords: true });
  const rightTokens = tokenizeSet(right, { removeStopWords: true });
  const lexical = jaccard(leftTokens, rightTokens);
  const dice = diceCoefficient(left, right);
  return lexical * 0.7 + dice * 0.3;
}

function semanticScore(candidateText, existingText, nearScore, embeddingScore = null) {
  const titleScore = textSimilarity(candidateText.title, existingText.title);
  const definitionScore = textSimilarity(candidateText.definition, existingText.definition);
  const impactScore = textSimilarity(candidateText.impact, existingText.impact);
  const constraintsScore = textSimilarity(candidateText.constraints, existingText.constraints);
  const negativeScore = textSimilarity(candidateText.negative, existingText.negative);

  let combined =
    titleScore * 0.2 +
    definitionScore * 0.3 +
    impactScore * 0.2 +
    constraintsScore * 0.15 +
    negativeScore * 0.15;

  combined = combined * 0.8 + nearScore * 0.2;

  if (typeof embeddingScore === "number" && Number.isFinite(embeddingScore)) {
    combined = combined * 0.7 + embeddingScore * 0.3;
  }

  return {
    combined,
    components: {
      titleScore,
      definitionScore,
      impactScore,
      constraintsScore,
      negativeScore,
      nearScore,
      embeddingScore,
    },
  };
}

function cosineSimilarity(vecA, vecB) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB)) return null;
  if (!vecA.length || vecA.length !== vecB.length) return null;

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < vecA.length; i += 1) {
    const a = Number(vecA[i]);
    const b = Number(vecB[i]);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }

  if (!magA || !magB) return null;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function evaluateDedupe({ candidate, existingItems, existingFingerprints, candidateEmbedding = null }) {
  const candidateFp = buildFingerprints(candidate.normalizedText);

  if (candidate?.itemType === "term") {
    const slugMatch = findTermSlugMatch(candidate, existingItems);
    if (slugMatch) {
      return {
        decision: "merge",
        overlapScore: 0.99,
        rationale: "Term med identisk slug funnet. Oppdater eksisterende term i stedet for å opprette ny.",
        candidateItemId: slugMatch.id,
        mergeMode: "slug_match",
        candidateFingerprint: candidateFp,
        bestMatch: {
          item: slugMatch,
          score: 0.99,
          details: { slugMatch: true },
        },
      };
    }
  }

  let exactMatchItem = null;
  for (const item of existingItems) {
    const fps = existingFingerprints.get(item.id) || { exact: new Set(), near: [] };
    if (fps.exact.has(candidateFp.exactTagged)) {
      exactMatchItem = item;
      break;
    }
  }

  if (exactMatchItem) {
    return {
      decision: "reject",
      overlapScore: 1,
      rationale: "Identisk fingerprint (exact hash) funnet.",
      candidateItemId: exactMatchItem.id,
      mergeMode: "none",
      candidateFingerprint: candidateFp,
      bestMatch: {
        item: exactMatchItem,
        score: 1,
        details: null,
      },
    };
  }

  const candidateText = {
    title: candidate.title,
    definition: candidate.normalizedText,
    impact: candidate.constraintsText,
    constraints: candidate.constraintsText,
    negative: candidate.negativeText,
  };

  let best = null;

  for (const item of existingItems) {
    const fps = existingFingerprints.get(item.id) || { exact: new Set(), near: [], embeddings: [] };

    let nearScore = 0;
    for (const nearHash of fps.near) {
      const dist = hammingDistanceHex64(candidateFp.near, nearHash.replace(/^near:/, ""));
      nearScore = Math.max(nearScore, nearSimilarityFromHamming(dist));
    }

    let embeddingScore = null;
    if (candidateEmbedding && Array.isArray(candidateEmbedding) && fps.embeddings.length) {
      for (const vec of fps.embeddings) {
        const score = cosineSimilarity(candidateEmbedding, vec);
        if (typeof score === "number") {
          embeddingScore = embeddingScore == null ? score : Math.max(embeddingScore, score);
        }
      }
    }

    const existingText = toComparableText(item);
    const score = semanticScore(candidateText, existingText, nearScore, embeddingScore);

    if (!best || score.combined > best.score) {
      best = {
        item,
        score: score.combined,
        details: score.components,
      };
    }
  }

  const overlap = best?.score ?? 0;

  if (overlap >= 0.85) {
    return {
      decision: "merge",
      overlapScore: overlap,
      rationale: "Hoy semantisk overlapp >= 0.85. Berik eksisterende entry.",
      candidateItemId: best.item.id,
      mergeMode: "high_overlap",
      candidateFingerprint: candidateFp,
      bestMatch: best,
    };
  }

  if (overlap >= 0.55) {
    return {
      decision: "merge",
      overlapScore: overlap,
      rationale: "Middels semantisk overlapp 0.55-0.85. Merge som berikelse.",
      candidateItemId: best.item.id,
      mergeMode: "partial_overlap",
      candidateFingerprint: candidateFp,
      bestMatch: best,
    };
  }

  return {
    decision: "create",
    overlapScore: overlap,
    rationale: "Lav semantisk overlapp < 0.55. Opprett ny entry.",
    candidateItemId: null,
    mergeMode: "none",
    candidateFingerprint: candidateFp,
    bestMatch: best,
  };
}
