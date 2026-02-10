import {
  FRONT_LEAD_OVERRIDE_TAG,
  FRONT_NOW_OVERRIDE_TAGS,
} from "@/lib/news/articles";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const FRONT_LAYOUT_TAGS = [
  FRONT_LEAD_OVERRIDE_TAG,
  ...FRONT_NOW_OVERRIDE_TAGS,
] as const;

export type FrontLayoutTag = (typeof FRONT_LAYOUT_TAGS)[number];
export type FrontLayoutAssignments = Record<FrontLayoutTag, string | null>;

type RowWithTags = {
  id: string;
  topic_tags: string[] | null | undefined;
};

function hasTag(tags: string[] | null | undefined, tag: string): boolean {
  return (tags ?? []).some(
    (item) => String(item ?? "").toLowerCase() === String(tag).toLowerCase()
  );
}

export function emptyFrontLayoutAssignments(): FrontLayoutAssignments {
  return Object.fromEntries(
    FRONT_LAYOUT_TAGS.map((tag) => [tag, null])
  ) as FrontLayoutAssignments;
}

export function normalizeFrontLayoutAssignments(
  raw: Partial<Record<FrontLayoutTag, string | null>>
): FrontLayoutAssignments {
  const normalized = emptyFrontLayoutAssignments();
  const used = new Set<string>();
  for (const tag of FRONT_LAYOUT_TAGS) {
    const id = String(raw[tag] ?? "").trim() || null;
    if (!id || used.has(id)) {
      normalized[tag] = null;
      continue;
    }
    used.add(id);
    normalized[tag] = id;
  }
  return normalized;
}

export function readFrontLayoutAssignmentsFromRows(
  rows: RowWithTags[]
): FrontLayoutAssignments {
  const assignments = emptyFrontLayoutAssignments();
  for (const tag of FRONT_LAYOUT_TAGS) {
    const row = rows.find((item) => hasTag(item.topic_tags, tag));
    assignments[tag] = row?.id ?? null;
  }
  return assignments;
}

export async function applyFrontLayoutAssignments(
  assignments: Partial<Record<FrontLayoutTag, string | null>>
) {
  const db = supabaseAdmin();
  const { data: rows, error } = await db
    .from("news_articles")
    .select("id, topic_tags")
    .eq("status", "published")
    .limit(1000);
  if (error) throw new Error(error.message);

  const normalized = normalizeFrontLayoutAssignments(assignments);

  for (const row of rows ?? []) {
    const existingTags = Array.isArray(row.topic_tags) ? row.topic_tags : [];
    const baseTags = existingTags.filter(
      (tag) => !FRONT_LAYOUT_TAGS.includes(tag as FrontLayoutTag)
    );
    const nextTags = [...baseTags];

    for (const tag of FRONT_LAYOUT_TAGS) {
      if (normalized[tag] === row.id) {
        nextTags.push(tag);
      }
    }

    const dedupedNext = Array.from(new Set(nextTags));
    const unchanged =
      dedupedNext.length === existingTags.length &&
      dedupedNext.every((tag, idx) => tag === existingTags[idx]);
    if (unchanged) continue;

    const { error: updateError } = await db
      .from("news_articles")
      .update({ topic_tags: dedupedNext })
      .eq("id", row.id);
    if (updateError) throw new Error(updateError.message);
  }
}
