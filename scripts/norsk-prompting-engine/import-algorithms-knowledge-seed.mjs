import fs from "node:fs";
import path from "node:path";
import { createDbClient } from "./db.mjs";

const DEFAULT_FILE = "data/norskPrompting/engine-seeds/algorithms-knowledge-v1.json";

const REQUIRED_KEYS = {
  sources: [
    "id",
    "title",
    "url",
    "source_type",
    "platform",
    "published_at",
    "checked_at",
    "status",
    "summary",
    "notes",
    "confidence",
  ],
  claims: [
    "id",
    "claim_text",
    "plain_language",
    "claim_type",
    "platform",
    "confidence",
    "last_reviewed_at",
    "teaching_use",
    "source_ids",
  ],
  concepts: [
    "id",
    "term",
    "definition_plain",
    "definition_technical",
    "platform_notes",
    "source_ids",
  ],
  playbooks: [
    "id",
    "goal_type",
    "audience_stage",
    "recommended_formats",
    "hook_patterns",
    "retention_patterns",
    "cta_patterns",
    "success_metrics",
    "related_claim_ids",
  ],
  diagnostics: [
    "id",
    "symptom",
    "likely_causes",
    "evidence_based_checks",
    "recommended_changes",
    "related_claim_ids",
  ],
};

function parseArgs(argv) {
  const out = {
    file: DEFAULT_FILE,
    dryRun: false,
    truncate: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--file" && argv[i + 1]) {
      out.file = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--dry-run") {
      out.dryRun = true;
      continue;
    }

    if (token === "--truncate") {
      out.truncate = true;
    }
  }

  return out;
}

function resolveAbsolutePath(filePath) {
  if (path.isAbsolute(filePath)) return filePath;
  return path.join(process.cwd(), filePath);
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter((item) => item.length > 0);
}

function normalizePayload(input) {
  return {
    sources: (input.sources || []).map((entry) => ({
      id: String(entry.id),
      title: String(entry.title),
      url: String(entry.url),
      source_type: String(entry.source_type),
      platform: String(entry.platform),
      published_at: String(entry.published_at),
      checked_at: String(entry.checked_at),
      status: String(entry.status),
      summary: String(entry.summary || ""),
      notes: String(entry.notes || ""),
      confidence: String(entry.confidence),
    })),
    claims: (input.claims || []).map((entry) => ({
      id: String(entry.id),
      claim_text: String(entry.claim_text),
      plain_language: String(entry.plain_language),
      claim_type: String(entry.claim_type),
      platform: String(entry.platform),
      confidence: String(entry.confidence),
      last_reviewed_at: String(entry.last_reviewed_at),
      teaching_use: String(entry.teaching_use),
      source_ids: normalizeStringArray(entry.source_ids),
    })),
    concepts: (input.concepts || []).map((entry) => ({
      id: String(entry.id),
      term: String(entry.term),
      definition_plain: String(entry.definition_plain),
      definition_technical: String(entry.definition_technical),
      platform_notes: String(entry.platform_notes || ""),
      source_ids: normalizeStringArray(entry.source_ids),
    })),
    playbooks: (input.playbooks || []).map((entry) => ({
      id: String(entry.id),
      goal_type: String(entry.goal_type),
      audience_stage: String(entry.audience_stage),
      recommended_formats: normalizeStringArray(entry.recommended_formats),
      hook_patterns: normalizeStringArray(entry.hook_patterns),
      retention_patterns: normalizeStringArray(entry.retention_patterns),
      cta_patterns: normalizeStringArray(entry.cta_patterns),
      success_metrics: normalizeStringArray(entry.success_metrics),
      related_claim_ids: normalizeStringArray(entry.related_claim_ids),
    })),
    diagnostics: (input.diagnostics || []).map((entry) => ({
      id: String(entry.id),
      symptom: String(entry.symptom),
      likely_causes: normalizeStringArray(entry.likely_causes),
      evidence_based_checks: normalizeStringArray(entry.evidence_based_checks),
      recommended_changes: normalizeStringArray(entry.recommended_changes),
      related_claim_ids: normalizeStringArray(entry.related_claim_ids),
    })),
  };
}

function validateSeedShape(payload) {
  const bucketNames = Object.keys(REQUIRED_KEYS);

  for (const bucket of bucketNames) {
    if (!Array.isArray(payload[bucket])) {
      throw new Error(`Ugyldig seed: "${bucket}" ma vaere en liste.`);
    }
  }

  for (const [bucket, required] of Object.entries(REQUIRED_KEYS)) {
    payload[bucket].forEach((entry, index) => {
      for (const key of required) {
        if (!(key in entry)) {
          throw new Error(`Mangler felt "${key}" i ${bucket}[${index}].`);
        }
      }
    });
  }
}

async function upsertInChunks(db, table, rows, chunkSize = 200) {
  let processed = 0;

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await db.from(table).upsert(chunk, { onConflict: "id" });
    if (error) {
      throw new Error(`Feil ved upsert i ${table}: ${error.message}`);
    }
    processed += chunk.length;
  }

  return processed;
}

async function truncateAll(db) {
  const tables = [
    "np_algo_diagnostics",
    "np_algo_playbooks",
    "np_algo_concepts",
    "np_algo_claims",
    "np_algo_sources",
  ];

  for (const table of tables) {
    const { error } = await db.from(table).delete().neq("id", "__never__");
    if (error) {
      throw new Error(`Feil ved truncation av ${table}: ${error.message}`);
    }
  }
}

export async function importAlgorithmsKnowledgeSeed(options = {}) {
  const filePath = resolveAbsolutePath(options.file || DEFAULT_FILE);
  const dryRun = Boolean(options.dryRun);
  const truncate = Boolean(options.truncate);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Fant ikke seed-fil: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  const payload = normalizePayload(parsed);
  validateSeedShape(payload);

  if (dryRun) {
    return {
      ok: true,
      dryRun: true,
      file: filePath,
      counts: {
        sources: payload.sources.length,
        claims: payload.claims.length,
        concepts: payload.concepts.length,
        playbooks: payload.playbooks.length,
        diagnostics: payload.diagnostics.length,
      },
      sample: {
        sources: payload.sources.slice(0, 1),
        claims: payload.claims.slice(0, 1),
      },
    };
  }

  const db = createDbClient();

  if (truncate) {
    await truncateAll(db);
  }

  const counts = {};
  counts.sources = await upsertInChunks(db, "np_algo_sources", payload.sources);
  counts.claims = await upsertInChunks(db, "np_algo_claims", payload.claims);
  counts.concepts = await upsertInChunks(db, "np_algo_concepts", payload.concepts);
  counts.playbooks = await upsertInChunks(db, "np_algo_playbooks", payload.playbooks);
  counts.diagnostics = await upsertInChunks(db, "np_algo_diagnostics", payload.diagnostics);

  return {
    ok: true,
    dryRun: false,
    file: filePath,
    truncate,
    counts,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs(process.argv.slice(2));

  importAlgorithmsKnowledgeSeed(options)
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      const message = error instanceof Error ? error.message : "Ukjent feil";
      console.error(JSON.stringify({ ok: false, error: message }, null, 2));
      process.exit(1);
    });
}
