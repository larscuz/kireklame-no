import { createClient } from "@supabase/supabase-js";
import { loadEnv, requireEnv } from "./env.mjs";

function resolveSupabaseConfig(env) {
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    requireEnv(env, ["SUPABASE_SERVICE_ROLE_KEY"]);
    throw new Error("Mangler SUPABASE_URL eller NEXT_PUBLIC_SUPABASE_URL.");
  }

  return { url, key };
}

export function createDbClient(customEnv = null) {
  const env = customEnv || loadEnv();
  const { url, key } = resolveSupabaseConfig(env);

  return createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { "X-Client-Info": "norsk-prompting-engine/1.0" } },
  });
}

export async function loadPendingIngest(db, { limit = 100, itemType = null } = {}) {
  let query = db
    .from("np_ingest_queue")
    .select("id, item_type, raw_text, raw_json, source_tag, language_hint, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (itemType) {
    query = query.eq("item_type", itemType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function loadItemsByType(db, itemType) {
  const { data, error } = await db
    .from("np_items")
    .select("id, item_type, slug, title, content_json, language, status, created_at, updated_at")
    .eq("item_type", itemType);

  if (error) throw error;
  return data || [];
}

function parseVector(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => Number(entry)).filter((entry) => Number.isFinite(entry));
  }

  if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((entry) => Number(entry.trim()))
      .filter((entry) => Number.isFinite(entry));
  }

  return null;
}

export async function loadFingerprintsForItemIds(db, itemIds) {
  if (!itemIds.length) return new Map();

  const { data, error } = await db
    .from("np_fingerprints")
    .select("item_id, fingerprint, normalized_text, embedding")
    .in("item_id", itemIds);

  if (error) throw error;

  const map = new Map();

  for (const row of data || []) {
    if (!map.has(row.item_id)) {
      map.set(row.item_id, {
        exact: new Set(),
        near: [],
        embeddings: [],
        normalizedTexts: [],
      });
    }

    const bucket = map.get(row.item_id);
    const fingerprint = String(row.fingerprint || "").trim();

    if (fingerprint.startsWith("exact:")) {
      bucket.exact.add(fingerprint);
    } else if (fingerprint.startsWith("near:")) {
      bucket.near.push(fingerprint);
    }

    if (row.normalized_text) {
      bucket.normalizedTexts.push(String(row.normalized_text));
    }

    const parsed = parseVector(row.embedding);
    if (parsed?.length) {
      bucket.embeddings.push(parsed);
    }
  }

  return map;
}

export async function insertDedupeDecision(db, record) {
  const { error } = await db.from("np_dedupe_decisions").insert(record);
  if (error) throw error;
}

export async function updateIngestStatus(db, ingestId, status) {
  const { error } = await db.from("np_ingest_queue").update({ status }).eq("id", ingestId);
  if (error) throw error;
}

export async function createItem(db, payload) {
  const { data, error } = await db
    .from("np_items")
    .insert(payload)
    .select("id, item_type, slug, title, content_json, language, status, created_at, updated_at")
    .single();

  if (error) throw error;
  return data;
}

export async function updateItem(db, id, patch) {
  const { data, error } = await db
    .from("np_items")
    .update(patch)
    .eq("id", id)
    .select("id, item_type, slug, title, content_json, language, status, created_at, updated_at")
    .single();

  if (error) throw error;
  return data;
}

export async function loadLatestVersion(db, itemId) {
  const { data, error } = await db
    .from("np_item_versions")
    .select("version")
    .eq("item_id", itemId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.version || 0;
}

export async function insertItemVersion(db, payload) {
  const { error } = await db.from("np_item_versions").insert(payload);
  if (error) throw error;
}

export async function insertFingerprints(db, itemId, rows) {
  if (!rows.length) return;

  const inserts = rows.map((row) => ({
    item_id: itemId,
    fingerprint: row.fingerprint,
    normalized_text: row.normalizedText,
    embedding: row.embedding || null,
  }));

  const { error } = await db.from("np_fingerprints").insert(inserts);
  if (error) throw error;
}

export async function loadActiveItemsByType(db, itemType) {
  const { data, error } = await db
    .from("np_items")
    .select("id, item_type, slug, title, content_json, language, status, created_at, updated_at")
    .eq("status", "active")
    .eq("item_type", itemType)
    .order("slug", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function slugExists(db, itemType, slug) {
  const { data, error } = await db
    .from("np_items")
    .select("id")
    .eq("item_type", itemType)
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data?.id);
}
