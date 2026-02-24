import { canonicalizeIngestRow } from "./content-shape.mjs";
import { evaluateDedupe } from "./dedupe.mjs";
import {
  createDbClient,
  createItem,
  insertDedupeDecision,
  insertFingerprints,
  insertItemVersion,
  loadFingerprintsForItemIds,
  loadItemsByType,
  loadLatestVersion,
  loadPendingIngest,
  slugExists,
  updateIngestStatus,
  updateItem,
} from "./db.mjs";
import { loadEnv } from "./env.mjs";
import { enrichCanonical } from "./llm-enrich.mjs";
import { mergeContentByType } from "./merge.mjs";
import { slugify } from "./text-normalize.mjs";
import { validateEnrichedItem } from "./validator.mjs";

function fallbackSlug(value) {
  const slug = slugify(value || "") || `entry-${Date.now()}`;
  return slug.slice(0, 96);
}

function toErrorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;

  try {
    return JSON.stringify(error);
  } catch {
    return "Ukjent feil";
  }
}

function toDecisionRationale({ dedupe, enrichment, validation, finalDecision }) {
  const parts = [
    `Dedupe: ${dedupe.rationale}`,
    `Overlapp: ${dedupe.overlapScore.toFixed(3)}`,
    `LLM: ${enrichment.enrichmentNotes}`,
    `Confidence: ${Number(enrichment.confidence).toFixed(2)}`,
  ];

  if (validation.warnings.length) {
    parts.push(`QA-varsler: ${validation.warnings.join(" | ")}`);
  }

  if (validation.errors.length) {
    parts.push(`QA-feil: ${validation.errors.join(" | ")}`);
  }

  parts.push(`Final decision: ${finalDecision}`);
  return parts.join(". ");
}

function updateFingerprintCache(cache, itemId, fingerprints) {
  if (!cache.has(itemId)) {
    cache.set(itemId, { exact: new Set(), near: [], embeddings: [], normalizedTexts: [] });
  }

  const bucket = cache.get(itemId);
  bucket.exact.add(fingerprints.exactTagged);
  bucket.near.push(fingerprints.nearTagged);
  bucket.normalizedTexts.push(fingerprints.normalized);
}

function parseArgs(argv) {
  const out = {
    limit: 100,
    itemType: null,
    dryRun: false,
    createdBy: "codex",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--limit" && argv[i + 1]) {
      out.limit = Math.max(1, Number(argv[i + 1]) || 100);
      i += 1;
      continue;
    }

    if (token === "--item-type" && argv[i + 1]) {
      out.itemType = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--created-by" && argv[i + 1]) {
      out.createdBy = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--dry-run") {
      out.dryRun = true;
    }
  }

  return out;
}

export async function runPipeline(options = {}) {
  const env = loadEnv();
  const db = createDbClient(env);
  const limit = options.limit || 100;
  const itemType = options.itemType || null;
  const dryRun = Boolean(options.dryRun);
  const createdBy = options.createdBy || "codex";

  const queue = await loadPendingIngest(db, { limit, itemType });

  const stats = {
    total: queue.length,
    processed: 0,
    created: 0,
    merged: 0,
    rejected: 0,
    errored: 0,
    drafted: 0,
  };

  const typeCache = new Map();

  async function getTypeState(type) {
    if (typeCache.has(type)) return typeCache.get(type);

    const items = await loadItemsByType(db, type);
    const ids = items.map((row) => row.id);
    const fingerprints = await loadFingerprintsForItemIds(db, ids);
    const byId = new Map(items.map((row) => [row.id, row]));

    const state = { items, byId, fingerprints };
    typeCache.set(type, state);
    return state;
  }

  for (const row of queue) {
    try {
      const canonical = canonicalizeIngestRow(row);
      const state = await getTypeState(canonical.itemType);

      const dedupe = evaluateDedupe({
        candidate: canonical,
        existingItems: state.items,
        existingFingerprints: state.fingerprints,
      });

      const existingCandidate = dedupe.candidateItemId ? state.byId.get(dedupe.candidateItemId) || null : null;

      const enrichment = await enrichCanonical({
        itemType: canonical.itemType,
        canonical,
        existingContent: existingCandidate?.content_json || null,
        dedupeDecision: dedupe.decision,
        env,
      });

      let finalDecision = dedupe.decision;
      if (enrichment.decision === "reject" && dedupe.decision !== "create") {
        finalDecision = "reject";
      } else if (enrichment.decision === "merge" && existingCandidate) {
        finalDecision = "merge";
      }

      const validation = validateEnrichedItem({
        itemType: canonical.itemType,
        contentJson: enrichment.contentJson,
        confidence: enrichment.confidence,
      });

      const itemStatus = validation.shouldDraft ? "draft" : "active";
      if (validation.shouldDraft) stats.drafted += 1;

      if (finalDecision === "reject") {
        if (!dryRun) {
          await insertDedupeDecision(db, {
            ingest_id: row.id,
            candidate_item_id: dedupe.candidateItemId,
            overlap_score: dedupe.overlapScore,
            decision: "reject",
            rationale: toDecisionRationale({ dedupe, enrichment, validation, finalDecision }),
          });
          await updateIngestStatus(db, row.id, "rejected");
        }

        stats.rejected += 1;
        stats.processed += 1;
        continue;
      }

      if (finalDecision === "merge" && existingCandidate) {
        const merged = mergeContentByType(
          canonical.itemType,
          existingCandidate.content_json,
          enrichment.contentJson,
          { sourceTag: row.source_tag || options.sourceTag || "unknown" }
        );

        if (!dryRun) {
          const updated = await updateItem(db, existingCandidate.id, {
            content_json: merged.merged,
            status: itemStatus,
            language: "no",
          });

          const version = (await loadLatestVersion(db, existingCandidate.id)) + 1;

          await insertItemVersion(db, {
            item_id: existingCandidate.id,
            version,
            change_type: "merge",
            diff_json: {
              changedFields: merged.changedKeys,
              diff: merged.diff,
              qa: validation,
              enrichment: {
                provider: enrichment.provider,
                model: enrichment.model,
                confidence: enrichment.confidence,
                notes: enrichment.enrichmentNotes,
              },
              source_tag: row.source_tag || options.sourceTag || "unknown",
            },
            source_tag: row.source_tag || options.sourceTag || "unknown",
            created_by: createdBy,
          });

          await insertFingerprints(db, existingCandidate.id, [
            {
              fingerprint: dedupe.candidateFingerprint.exactTagged,
              normalizedText: dedupe.candidateFingerprint.normalized,
            },
            {
              fingerprint: dedupe.candidateFingerprint.nearTagged,
              normalizedText: dedupe.candidateFingerprint.normalized,
            },
          ]);

          await insertDedupeDecision(db, {
            ingest_id: row.id,
            candidate_item_id: existingCandidate.id,
            overlap_score: dedupe.overlapScore,
            decision: "merge",
            rationale: toDecisionRationale({ dedupe, enrichment, validation, finalDecision }),
          });

          await updateIngestStatus(db, row.id, "processed");

          state.byId.set(updated.id, updated);
          state.items = state.items.map((item) => (item.id === updated.id ? updated : item));
          updateFingerprintCache(state.fingerprints, updated.id, dedupe.candidateFingerprint);
        }

        stats.merged += 1;
        stats.processed += 1;
        continue;
      }

      const baseSlug = fallbackSlug(enrichment.slug || canonical.slug || canonical.title);
      let finalSlug = baseSlug;

      if (!dryRun) {
        let attempt = 2;
        while (await slugExists(db, canonical.itemType, finalSlug)) {
          finalSlug = `${baseSlug}-${attempt}`;
          attempt += 1;
        }
      }

      if (!dryRun) {
        const created = await createItem(db, {
          item_type: canonical.itemType,
          slug: finalSlug,
          title: enrichment.title || canonical.title,
          content_json: enrichment.contentJson,
          language: "no",
          status: itemStatus,
        });

        await insertItemVersion(db, {
          item_id: created.id,
          version: 1,
          change_type: "create",
          diff_json: {
            created: true,
            qa: validation,
            enrichment: {
              provider: enrichment.provider,
              model: enrichment.model,
              confidence: enrichment.confidence,
              notes: enrichment.enrichmentNotes,
            },
            source_tag: row.source_tag || options.sourceTag || "unknown",
          },
          source_tag: row.source_tag || options.sourceTag || "unknown",
          created_by: createdBy,
        });

        await insertFingerprints(db, created.id, [
          {
            fingerprint: dedupe.candidateFingerprint.exactTagged,
            normalizedText: dedupe.candidateFingerprint.normalized,
          },
          {
            fingerprint: dedupe.candidateFingerprint.nearTagged,
            normalizedText: dedupe.candidateFingerprint.normalized,
          },
        ]);

        await insertDedupeDecision(db, {
          ingest_id: row.id,
          candidate_item_id: null,
          overlap_score: dedupe.overlapScore,
          decision: "create",
          rationale: toDecisionRationale({ dedupe, enrichment, validation, finalDecision: "create" }),
        });

        await updateIngestStatus(db, row.id, "processed");

        state.items.push(created);
        state.byId.set(created.id, created);
        updateFingerprintCache(state.fingerprints, created.id, dedupe.candidateFingerprint);
      }

      stats.created += 1;
      stats.processed += 1;
    } catch (error) {
      stats.errored += 1;

      if (!dryRun) {
        await updateIngestStatus(db, row.id, "errored").catch(() => null);
      }

      const message = toErrorMessage(error);
      console.error(`[np-engine] ingest ${row.id} feilet: ${message}`);
    }
  }

  return stats;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs(process.argv.slice(2));

  runPipeline(options)
    .then((stats) => {
      console.log(JSON.stringify({ ok: true, stats }, null, 2));
    })
    .catch((error) => {
      const message = toErrorMessage(error);
      console.error(JSON.stringify({ ok: false, error: message }, null, 2));
      process.exit(1);
    });
}
