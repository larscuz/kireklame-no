import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { estimateReadingTimeMinutes, extractKiOpplaringHeadings, type KiOpplaringHeading } from "./markdown";
import { KI_OPPLARING_TOPICS, type KiOpplaringLevel } from "./taxonomy";

export const KI_OPPLARING_TYPES = ["guider", "tema", "verktoy", "ordliste"] as const;

export type KiOpplaringType = (typeof KI_OPPLARING_TYPES)[number];

export type KiOpplaringFrontmatter = {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  topics: string[];
  level: KiOpplaringLevel;
  audience: string[];
  tools: string[];
  exercises?: number;
  estimatedMinutes?: number;
  learningPath?: KiOpplaringLevel[];
  outcomes?: string[];
  templates?: string[];
};

export type KiOpplaringEntry = KiOpplaringFrontmatter & {
  type: KiOpplaringType;
  body: string;
  url: string;
  readingTimeMinutes: number;
  headings: KiOpplaringHeading[];
  updatedTimestamp: number;
};

export type KiOpplaringSearchItem = {
  title: string;
  description: string;
  url: string;
  type: KiOpplaringType;
  topics: string[];
  tools: string[];
  level: KiOpplaringLevel;
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "ki-opplaring");

function normalizeText(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function normalizeLearningPath(value: unknown): KiOpplaringLevel[] {
  return normalizeArray(value)
    .map((item) => item.toLowerCase())
    .filter((item): item is KiOpplaringLevel => item === "beginner" || item === "intermediate" || item === "pro");
}

function parseFrontmatterValue(raw: string): unknown {
  const value = raw.trim();
  if (!value) return "";

  if (value.startsWith("[") && value.endsWith("]")) {
    try {
      return JSON.parse(value);
    } catch {
      const inner = value.slice(1, -1).trim();
      if (!inner) return [];
      return inner
        .split(",")
        .map((item) => item.trim().replace(/^['\"]/, "").replace(/['\"]$/, ""))
        .filter(Boolean);
    }
  }

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    try {
      return JSON.parse(value.replace(/^'/, '"').replace(/'$/, '"'));
    } catch {
      return value.slice(1, -1);
    }
  }

  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);

  return value;
}

function parseMdxFile(raw: string): { frontmatter: Record<string, unknown>; body: string } {
  const normalized = String(raw ?? "").replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: normalized.trim() };
  }

  const frontmatterLines = match[1].split("\n");
  const frontmatter: Record<string, unknown> = {};

  for (const line of frontmatterLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    frontmatter[key] = parseFrontmatterValue(rawValue);
  }

  return {
    frontmatter,
    body: match[2].trim(),
  };
}

function toUrl(type: KiOpplaringType, slug: string): string {
  return `/ki-opplaring/${type}/${slug}`;
}

function toEntry(type: KiOpplaringType, parsed: { frontmatter: Record<string, unknown>; body: string }, fallbackSlug: string) {
  const slug = normalizeText(parsed.frontmatter.slug) || fallbackSlug;
  const title = normalizeText(parsed.frontmatter.title);
  const description = normalizeText(parsed.frontmatter.description);
  const updatedAt = normalizeText(parsed.frontmatter.updatedAt) || new Date().toISOString().slice(0, 10);
  const topics = normalizeArray(parsed.frontmatter.topics);
  const audience = normalizeArray(parsed.frontmatter.audience);
  const tools = normalizeArray(parsed.frontmatter.tools);
  const outcomes = normalizeArray(parsed.frontmatter.outcomes);
  const templates = normalizeArray(parsed.frontmatter.templates);
  const exercises = normalizeNumber(parsed.frontmatter.exercises);
  const estimatedMinutes = normalizeNumber(parsed.frontmatter.estimatedMinutes);
  const learningPath = normalizeLearningPath(parsed.frontmatter.learningPath);
  const levelRaw = normalizeText(parsed.frontmatter.level).toLowerCase();
  const level: KiOpplaringLevel = levelRaw === "intermediate" || levelRaw === "pro" ? levelRaw : "beginner";

  if (!slug || !title || !description) {
    throw new Error(`Invalid frontmatter in ${type}/${fallbackSlug}.mdx`);
  }

  const headings = extractKiOpplaringHeadings(parsed.body);
  const readingTimeMinutes = estimateReadingTimeMinutes(parsed.body);
  const updatedTimestamp = Number.isFinite(new Date(updatedAt).getTime()) ? new Date(updatedAt).getTime() : 0;

  return {
    type,
    slug,
    title,
    description,
    updatedAt,
    topics,
    level,
    audience,
    tools,
    outcomes,
    templates,
    exercises,
    estimatedMinutes,
    learningPath,
    body: parsed.body,
    url: toUrl(type, slug),
    headings,
    readingTimeMinutes,
    updatedTimestamp,
  } satisfies KiOpplaringEntry;
}

async function readTypeEntries(type: KiOpplaringType): Promise<KiOpplaringEntry[]> {
  const dir = path.join(CONTENT_ROOT, type);

  let files: string[] = [];
  try {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    files = dirents
      .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".mdx"))
      .map((dirent) => dirent.name);
  } catch {
    return [];
  }

  const entries: KiOpplaringEntry[] = [];

  for (const filename of files) {
    const fullPath = path.join(dir, filename);
    try {
      const raw = await fs.readFile(fullPath, "utf8");
      const parsed = parseMdxFile(raw);
      const fallbackSlug = filename.replace(/\.mdx$/, "");
      entries.push(toEntry(type, parsed, fallbackSlug));
    } catch (error) {
      console.error(`[ki-opplaring] Skipper ugyldig fil: ${type}/${filename}`, error);
    }
  }

  return entries.sort((a, b) => {
    if (b.updatedTimestamp !== a.updatedTimestamp) return b.updatedTimestamp - a.updatedTimestamp;
    return a.title.localeCompare(b.title, "nb-NO");
  });
}

const loadAllEntries = cache(async (): Promise<KiOpplaringEntry[]> => {
  const nested = await Promise.all(KI_OPPLARING_TYPES.map((type) => readTypeEntries(type)));
  return nested.flat();
});

export async function listKiOpplaringByType(type: KiOpplaringType): Promise<KiOpplaringEntry[]> {
  const all = await loadAllEntries();
  return all
    .filter((entry) => entry.type === type)
    .sort((a, b) => (b.updatedTimestamp !== a.updatedTimestamp ? b.updatedTimestamp - a.updatedTimestamp : a.title.localeCompare(b.title, "nb-NO")));
}

export async function getKiOpplaringEntry(type: KiOpplaringType, slug: string): Promise<KiOpplaringEntry | null> {
  const entries = await listKiOpplaringByType(type);
  return entries.find((entry) => entry.slug === slug) ?? null;
}

export async function listAllKiOpplaringEntries(): Promise<KiOpplaringEntry[]> {
  const all = await loadAllEntries();
  return [...all].sort((a, b) => (b.updatedTimestamp !== a.updatedTimestamp ? b.updatedTimestamp - a.updatedTimestamp : a.title.localeCompare(b.title, "nb-NO")));
}

export async function listLatestKiOpplaringEntries(limit = 6): Promise<KiOpplaringEntry[]> {
  const all = await listAllKiOpplaringEntries();
  return all.slice(0, Math.max(1, limit));
}

function overlapCount(left: string[], right: string[]): number {
  if (!left.length || !right.length) return 0;
  const lookup = new Set(left.map((item) => item.toLowerCase()));
  return right.reduce((count, value) => count + (lookup.has(value.toLowerCase()) ? 1 : 0), 0);
}

export async function listRelatedKiOpplaringEntries(entry: KiOpplaringEntry, limit = 4): Promise<KiOpplaringEntry[]> {
  const all = await listAllKiOpplaringEntries();

  const scored = all
    .filter((candidate) => !(candidate.type === entry.type && candidate.slug === entry.slug))
    .map((candidate) => {
      const topicOverlap = overlapCount(entry.topics, candidate.topics);
      const toolOverlap = overlapCount(entry.tools, candidate.tools);
      const audienceOverlap = overlapCount(entry.audience, candidate.audience);
      const levelBoost = candidate.level === entry.level ? 1 : 0;
      const typeBoost = candidate.type === entry.type ? 0.5 : 0;
      const score = topicOverlap * 4 + toolOverlap * 3 + audienceOverlap + levelBoost + typeBoost;
      return { candidate, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.candidate.updatedTimestamp !== a.candidate.updatedTimestamp) {
        return b.candidate.updatedTimestamp - a.candidate.updatedTimestamp;
      }
      return a.candidate.title.localeCompare(b.candidate.title, "nb-NO");
    });

  const primary = scored.filter((item) => item.score > 0).slice(0, limit).map((item) => item.candidate);
  if (primary.length >= limit) return primary;

  const used = new Set(primary.map((item) => `${item.type}:${item.slug}`));
  const fallback = scored
    .map((item) => item.candidate)
    .filter((candidate) => !used.has(`${candidate.type}:${candidate.slug}`))
    .slice(0, Math.max(0, limit - primary.length));

  return [...primary, ...fallback];
}

export async function listKiOpplaringSearchIndex(): Promise<KiOpplaringSearchItem[]> {
  const all = await listAllKiOpplaringEntries();
  return all.map((entry) => ({
    title: entry.title,
    description: entry.description,
    url: entry.url,
    type: entry.type,
    topics: entry.topics,
    tools: entry.tools,
    level: entry.level,
  }));
}

export async function listKiOpplaringTopicCards(): Promise<Array<{ topic: string; count: number }>> {
  const all = await listAllKiOpplaringEntries();
  const counts = new Map<string, number>();

  for (const topic of KI_OPPLARING_TOPICS) {
    counts.set(topic, 0);
  }

  for (const entry of all) {
    for (const topic of entry.topics) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic, "nb-NO"));
}

export async function getKiOpplaringCounts() {
  const all = await listAllKiOpplaringEntries();
  const countByType = {
    guider: all.filter((entry) => entry.type === "guider").length,
    tema: all.filter((entry) => entry.type === "tema").length,
    verktoy: all.filter((entry) => entry.type === "verktoy").length,
    ordliste: all.filter((entry) => entry.type === "ordliste").length,
  };

  return {
    total: all.length,
    ...countByType,
  };
}

export function kiOpplaringTypeLabel(type: KiOpplaringType): string {
  switch (type) {
    case "guider":
      return "Guide";
    case "tema":
      return "Tema";
    case "verktoy":
      return "Verktøy";
    case "ordliste":
      return "Ordliste";
    default:
      return "Innhold";
  }
}
