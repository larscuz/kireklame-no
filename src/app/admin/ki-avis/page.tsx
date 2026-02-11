import Link from "next/link";
import type { Metadata } from "next";
import { Bodoni_Moda, Manrope, Source_Serif_4 } from "next/font/google";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchTextBestEffort } from "@/lib/crawl/fetcher";
import { extractArticleSignals } from "@/lib/news/extract";
import {
  guessDocumentLanguage,
  isLikelyInternationalDeskArticle,
} from "@/lib/news/international";
import { shouldTranslateToNorwegian, translateToNorwegianBokmal } from "@/lib/news/translate";
import { requireAdmin } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  FRONT_LEAD_OVERRIDE_TAG,
  FRONT_NOW_OVERRIDE_TAGS,
  listNewsForAdmin,
  normalizeNewsUpsert,
} from "@/lib/news/articles";
import {
  FRONT_LAYOUT_TAGS,
  type FrontLayoutTag,
  applyFrontLayoutAssignments,
  readFrontLayoutAssignmentsFromRows,
} from "@/lib/news/frontLayout";
import {
  cleanText,
  coerceNewsPerspective,
  coerceNewsStatus,
  parseTopicTagsCsv,
  topicTagsToCsv,
} from "@/lib/news/utils";

const masthead = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const headline = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const uiSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const FIELD_CLASS =
  "w-full border border-black/20 bg-[#fcf8ef] px-3 py-2 text-sm text-[#191919] outline-none focus:border-black/45";
const TEXTAREA_CLASS = `${FIELD_CLASS} min-h-[90px]`;
const LABEL_CLASS = "grid gap-1";
const LABEL_TEXT_CLASS = "text-[11px] font-semibold uppercase tracking-[0.15em] text-black/60";
const PRIMARY_BUTTON_CLASS =
  "border border-black bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-black/90";
const SECONDARY_BUTTON_CLASS =
  "border border-black/30 bg-[#f8f4eb] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-black hover:bg-[#f1ede4]";

type AdminNoticeKey =
  | "saved"
  | "created"
  | "deleted"
  | "lead_updated"
  | "layout_updated"
  | "layout_slot_updated"
  | "generated"
  | "generated_no_change"
  | "removed_generated";

const ADMIN_NOTICE_TEXT: Record<AdminNoticeKey, string> = {
  saved: "Endringer lagret.",
  created: "Ny sak opprettet.",
  deleted: "Sak slettet.",
  lead_updated: "Hovedsak oppdatert.",
  layout_updated: "Forside-layout oppdatert.",
  layout_slot_updated: "Forsideslot oppdatert.",
  generated: "Ny tekst ble hentet og lagret fra kilden.",
  generated_no_change: "Ingen ny tekst funnet i kilden. Eksisterende innhold ble beholdt.",
  removed_generated: "Generert ekstratekst ble fjernet.",
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "KiR Nyheter CMS – Admin",
  description: "Redaksjonelt CMS for KiR Nyheter.",
};

function toDateInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

function parseDateInput(raw: string): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function firstSearchParam(
  value: string | string[] | undefined
): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function resolveAdminNotice(
  value: string | string[] | undefined
): { key: AdminNoticeKey; text: string } | null {
  const key = firstSearchParam(value);
  if (!key) return null;
  if (!(key in ADMIN_NOTICE_TEXT)) return null;
  const typed = key as AdminNoticeKey;
  return { key: typed, text: ADMIN_NOTICE_TEXT[typed] };
}

function adminNoticeUrl(
  notice: AdminNoticeKey,
  articleId?: string | null
): string {
  const params = new URLSearchParams({ notice });
  const id = String(articleId ?? "").trim();
  if (id) params.set("item", id);
  const hash = id ? `#article-${id}` : "";
  return `/admin/ki-avis?${params.toString()}${hash}`;
}

function revalidateNewsSurfaces(slug?: string | null) {
  revalidatePath("/ki-avis");
  if (slug) revalidatePath(`/ki-avis/${slug}`);
  revalidatePath("/admin/ki-avis");
  revalidatePath("/sitemap.xml");
  revalidatePath("/news-sitemap.xml");
  revalidatePath("/ki-avis/rss.xml");
}

const SENTENCE_NOISE_PATTERNS = [
  /cookie/i,
  /personvern/i,
  /privacy/i,
  /terms/i,
  /annonser(e|ing)?/i,
  /abonn(er|ement)/i,
  /logg inn/i,
  /jump to/i,
  /subscribe/i,
  /newsletter/i,
  /del på/i,
  /follow us/i,
  /copyright/i,
];

const AI_MARKETING_TERMS = [
  "ai",
  "ki",
  "kunstig intelligens",
  "markedsføring",
  "reklame",
  "byrå",
  "media",
  "kampanje",
  "merkevare",
  "automatisering",
  "effektivisering",
  "kostnad",
  "inntekter",
  "vekst",
];

const TITLE_STOPWORDS = new Set([
  "and",
  "the",
  "for",
  "with",
  "this",
  "that",
  "from",
  "som",
  "for",
  "med",
  "til",
  "det",
  "der",
  "eller",
  "av",
  "på",
  "om",
  "fra",
  "ikke",
]);

function normalizeInputText(raw: string | null | undefined): string {
  return String(raw ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text: string): string[] {
  if (!text) return [];
  const parts = text
    .split(/(?<=[.!?])\s+(?=[A-ZÆØÅ0-9"'(])/g)
    .map((line) => line.trim())
    .filter(Boolean);

  const out: string[] = [];
  for (const part of parts) {
    if (part.length > 340) {
      const chunks = part
        .split(/[,;:]\s+/g)
        .map((chunk) => chunk.trim())
        .filter(Boolean);
      out.push(...chunks);
    } else {
      out.push(part);
    }
  }
  return out;
}

function sentenceLooksUseful(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (trimmed.length < 45 || trimmed.length > 340) return false;
  if (/https?:\/\//i.test(trimmed)) return false;
  if (SENTENCE_NOISE_PATTERNS.some((pattern) => pattern.test(trimmed))) return false;
  return true;
}

function titleKeywords(title: string): string[] {
  return String(title ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9æøå\s-]/gi, " ")
    .split(/\s+/g)
    .map((word) => word.trim())
    .filter((word) => word.length >= 4 && !TITLE_STOPWORDS.has(word))
    .slice(0, 12);
}

function sentenceScore(sentence: string, idx: number, titleTerms: string[]): number {
  const lc = sentence.toLowerCase();
  let score = 0;
  for (const term of titleTerms) {
    if (lc.includes(term)) score += 2.2;
  }
  for (const term of AI_MARKETING_TERMS) {
    if (lc.includes(term)) score += 1.1;
  }
  if (/\d/.test(lc)) score += 0.7;
  if (idx <= 8) score += 0.8;
  if (idx >= 40) score += 0.3;
  return score;
}

function uniqueSentencePush(out: string[], candidate: string): void {
  const needle = candidate.toLowerCase().replace(/\s+/g, " ").trim();
  if (!needle) return;
  const exists = out.some((item) => {
    const lc = item.toLowerCase().replace(/\s+/g, " ").trim();
    return lc === needle || lc.includes(needle.slice(0, 40));
  });
  if (!exists) out.push(candidate);
}

function limitText(text: string, max: number): string {
  const clean = normalizeInputText(text);
  if (clean.length <= max) return clean;
  return `${clean.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function composeHeuristicDraft(args: {
  title: string;
  excerpt: string | null;
  plainText: string;
  isPaywalled: boolean;
}): { summary: string | null; body: string | null } {
  const normalized = normalizeInputText(args.plainText);
  const fallbackExcerpt = cleanText(args.excerpt ?? "", 420);
  if (!normalized) {
    return { summary: fallbackExcerpt, body: null };
  }

  const rawSentences = splitSentences(normalized).filter(sentenceLooksUseful);
  if (!rawSentences.length) {
    return { summary: fallbackExcerpt, body: null };
  }

  const keys = titleKeywords(args.title);
  const scored = rawSentences
    .map((sentence, idx) => ({
      sentence,
      idx,
      score: sentenceScore(sentence, idx, keys),
    }))
    .sort((a, b) => b.score - a.score || a.idx - b.idx);

  const selected: Array<{ sentence: string; idx: number }> = [];
  for (const candidate of scored) {
    if (selected.length >= 10) break;
    const exists = selected.some(
      (item) =>
        item.sentence.toLowerCase() === candidate.sentence.toLowerCase() ||
        item.sentence.toLowerCase().includes(candidate.sentence.toLowerCase().slice(0, 40))
    );
    if (!exists) selected.push({ sentence: candidate.sentence, idx: candidate.idx });
  }
  selected.sort((a, b) => a.idx - b.idx);

  const summaryParts: string[] = [];
  for (const item of selected) {
    if (summaryParts.length >= 3) break;
    uniqueSentencePush(summaryParts, item.sentence);
    const candidate = normalizeInputText(summaryParts.join(" "));
    if (candidate.length >= 260) break;
  }
  const summary = summaryParts.length ? limitText(summaryParts.join(" "), 560) : fallbackExcerpt;

  const summarySet = new Set(summaryParts.map((item) => item.toLowerCase()));
  const bodyCandidates: string[] = [];
  for (const item of selected) {
    if (summarySet.has(item.sentence.toLowerCase())) continue;
    uniqueSentencePush(bodyCandidates, item.sentence);
    if (bodyCandidates.length >= 8) break;
  }
  if (bodyCandidates.length < 5) {
    for (const sentence of rawSentences) {
      if (summarySet.has(sentence.toLowerCase())) continue;
      uniqueSentencePush(bodyCandidates, sentence);
      if (bodyCandidates.length >= 8) break;
    }
  }

  let body: string | null = null;
  if (!args.isPaywalled && bodyCandidates.length >= 2) {
    const paragraphs: string[] = [];
    for (let i = 0; i < bodyCandidates.length; i += 2) {
      const paragraph = bodyCandidates.slice(i, i + 2).join(" ").trim();
      if (paragraph) paragraphs.push(paragraph);
      if (paragraphs.length >= 4) break;
    }
    body = paragraphs.length ? limitText(paragraphs.join("\n\n"), 1800) : null;
  }

  return {
    summary: summary ? limitText(summary, 560) : fallbackExcerpt,
    body,
  };
}

function isPlaceholderLike(value: string | null | undefined): boolean {
  const text = String(value ?? "").trim();
  if (!text) return true;
  return (
    /^__NEW_/i.test(text) ||
    /^\[[^\]]+\]$/.test(text) ||
    /^Kort sammenfatning basert på kilden/i.test(text) ||
    /^Ny redaksjonell utdyping fra kilden/i.test(text)
  );
}

function stripAutoEnrichmentEditorNote(value: string | null | undefined): string | null {
  const lines = String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/Oppdatert med ekstra kildesammenfatning\./i.test(line));
  return lines.length ? lines.join("\n") : null;
}

function hasTag(tags: string[] | null | undefined, tag: string): boolean {
  return (tags ?? []).some((item) => String(item ?? "").toLowerCase() === tag);
}

function hasImage(url: string | null): boolean {
  return /^https?:\/\//i.test(String(url ?? "").trim());
}

function isKIRedaksjonenCandidate(args: {
  source_name: string | null | undefined;
  title: string | null | undefined;
  editor_note: string | null | undefined;
  topic_tags: string[] | null | undefined;
  language: string | null | undefined;
}) {
  const sourceName = String(args.source_name ?? "");
  const title = String(args.title ?? "");
  const editorNote = String(args.editor_note ?? "");
  const tags = args.topic_tags ?? [];
  const language = String(args.language ?? "").toLowerCase().trim();
  const hasInternalTag =
    hasTag(tags, "op_ed") ||
    hasTag(tags, "leder") ||
    hasTag(tags, "redaksjonen") ||
    hasTag(tags, "kir_aivisa") ||
    hasTag(tags, "lars_cuzner");
  const hasInternalSignature =
    /redaksjonen|ki?r?\s*aivisa|lars\s*cuzner/i.test(sourceName) ||
    /op-?ed|leder/i.test(title) ||
    /editor in chief bot redaksjonen|skrevet av ki?r?\s*aivisa/i.test(editorNote);
  const looksInternal = hasInternalTag || hasInternalSignature;
  if (!looksInternal) return false;
  if (hasTag(tags, "internasjonalt") || hasTag(tags, "international_ai_agency")) return false;
  if (language && !["no", "nb", "nn", "unknown"].includes(language)) return false;
  return true;
}

async function saveArticle(formData: FormData) {
  "use server";

  await requireAdmin("/admin/ki-avis");

  const id = String(formData.get("id") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim();
  const source_url = String(formData.get("source_url") ?? "").trim();
  const source_name = String(formData.get("source_name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || null;
  const language = String(formData.get("language") ?? "no").trim() || "no";
  const publishedAtRaw = String(formData.get("published_at") ?? "").trim();
  const published_at = parseDateInput(publishedAtRaw);
  const status = coerceNewsStatus(String(formData.get("status") ?? "draft").trim(), "draft");
  const perspective = coerceNewsPerspective(
    String(formData.get("perspective") ?? "neutral").trim(),
    "neutral"
  );
  const topic_tags = parseTopicTagsCsv(String(formData.get("topic_tags") ?? ""));
  const is_paywalled = formData.get("is_paywalled") === "on";
  const paywall_note = String(formData.get("paywall_note") ?? "").trim() || null;
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const body = String(formData.get("body") ?? "").trim() || null;
  const editor_note = String(formData.get("editor_note") ?? "").trim() || null;
  const hero_image_url = String(formData.get("hero_image_url") ?? "").trim() || null;
  const cloudflare_worker_hint =
    String(formData.get("cloudflare_worker_hint") ?? "").trim() || null;

  if (!title || !source_url) {
    throw new Error("Mangler tittel eller source_url");
  }

  const row = normalizeNewsUpsert({
    id,
    slug,
    title,
    source_name: source_name || "Ukjent kilde",
    source_url,
    language,
    published_at,
    status,
    perspective,
    topic_tags,
    is_paywalled,
    paywall_note,
    excerpt,
    summary,
    body,
    editor_note,
    hero_image_url,
    cloudflare_worker_hint,
  });
  const looksLikeKIRedaksjonen = isKIRedaksjonenCandidate({
    source_name: row.source_name,
    title: row.title,
    editor_note: row.editor_note,
    topic_tags: row.topic_tags,
    language: row.language,
  });
  if (row.status === "published" && !row.published_at && looksLikeKIRedaksjonen) {
    row.published_at = new Date().toISOString();
  }

  const db = supabaseAdmin();
  const payload = { ...row };
  delete (payload as { id?: string | null }).id;
  let savedId = id;

  if (id) {
    const { data: updatedRow, error } = await db
      .from("news_articles")
      .update(payload)
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    savedId = String(updatedRow?.id ?? id);
  } else {
    const { data: upsertedRow, error } = await db
      .from("news_articles")
      .upsert(payload, { onConflict: "source_url", ignoreDuplicates: false })
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    savedId = String(upsertedRow?.id ?? "").trim() || null;
  }

  const shouldAutoLead =
    row.status === "published" &&
    looksLikeKIRedaksjonen &&
    hasImage(row.hero_image_url ?? null) &&
    Boolean(savedId);
  if (shouldAutoLead) {
    await applyFrontLayoutAssignments({
      [FRONT_LEAD_OVERRIDE_TAG]: savedId,
    });
  }

  revalidateNewsSurfaces(row.slug);
  redirect(adminNoticeUrl(id ? "saved" : "created", savedId ?? id));
}

async function deleteArticle(formData: FormData) {
  "use server";
  await requireAdmin("/admin/ki-avis");
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Mangler id");

  const db = supabaseAdmin();
  const { error } = await db.from("news_articles").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateNewsSurfaces();
  redirect(adminNoticeUrl("deleted"));
}

async function setFrontLayoutOverrides(formData: FormData) {
  "use server";
  await requireAdmin("/admin/ki-avis");

  const leadId = String(formData.get("lead_article_id") ?? "").trim() || null;
  const frontNowIds = FRONT_NOW_OVERRIDE_TAGS.map(
    (_tag, idx) => String(formData.get(`front_now_${idx + 1}_id`) ?? "").trim() || null
  );
  const rawAssignments: Record<string, string | null> = {
    [FRONT_LEAD_OVERRIDE_TAG]: leadId,
    [FRONT_NOW_OVERRIDE_TAGS[0]]: frontNowIds[0],
    [FRONT_NOW_OVERRIDE_TAGS[1]]: frontNowIds[1],
    [FRONT_NOW_OVERRIDE_TAGS[2]]: frontNowIds[2],
  };
  await applyFrontLayoutAssignments(rawAssignments);

  revalidateNewsSurfaces();
  redirect(adminNoticeUrl("layout_updated", leadId));
}

async function setFrontLayoutSlotFromRow(formData: FormData) {
  "use server";
  await requireAdmin("/admin/ki-avis");

  const articleId = String(formData.get("id") ?? "").trim();
  const slotTag = String(formData.get("slot_tag") ?? "").trim();
  if (!articleId) throw new Error("Mangler artikkel-id");
  if (!FRONT_LAYOUT_TAGS.includes(slotTag as FrontLayoutTag)) {
    throw new Error("Ugyldig slot");
  }
  const slot = slotTag as FrontLayoutTag;

  const db = supabaseAdmin();
  const { data: rows, error } = await db
    .from("news_articles")
    .select("id, topic_tags")
    .eq("status", "published")
    .limit(1000);
  if (error) throw new Error(error.message);

  const current = readFrontLayoutAssignmentsFromRows((rows ?? []) as Array<{ id: string; topic_tags: string[] | null }>);
  current[slot] = articleId;
  for (const tag of FRONT_LAYOUT_TAGS) {
    if (tag !== slot && current[tag] === articleId) {
      current[tag] = null;
    }
  }
  await applyFrontLayoutAssignments(current);

  revalidateNewsSurfaces();
  redirect(adminNoticeUrl("layout_slot_updated", articleId));
}

async function clearFrontLayoutSlotsFromRow(formData: FormData) {
  "use server";
  await requireAdmin("/admin/ki-avis");

  const articleId = String(formData.get("id") ?? "").trim();
  if (!articleId) throw new Error("Mangler artikkel-id");

  const db = supabaseAdmin();
  const { data: rows, error } = await db
    .from("news_articles")
    .select("id, topic_tags")
    .eq("status", "published")
    .limit(1000);
  if (error) throw new Error(error.message);

  const current = readFrontLayoutAssignmentsFromRows((rows ?? []) as Array<{ id: string; topic_tags: string[] | null }>);
  for (const tag of FRONT_LAYOUT_TAGS) {
    if (current[tag] === articleId) {
      current[tag] = null;
    }
  }
  await applyFrontLayoutAssignments(current);

  revalidateNewsSurfaces();
  redirect(adminNoticeUrl("layout_slot_updated", articleId));
}

async function generateMoreTextFromSource(formData: FormData) {
  "use server";

  await requireAdmin("/admin/ki-avis");
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Mangler artikkel-id");

  const db = supabaseAdmin();
  const { data: row, error: rowError } = await db
    .from("news_articles")
    .select("id,slug,title,source_url,source_name,language,is_paywalled,excerpt,summary,body")
    .eq("id", id)
    .maybeSingle();
  if (rowError || !row) {
    throw new Error(rowError?.message ?? "Fant ikke sak");
  }

  let html = "";
  try {
    const fetched = await fetchTextBestEffort(String(row.source_url ?? ""), {
      timeoutMs: 14_000,
      minPlainLength: 1000,
      alwaysTryReadableFallback: true,
    });
    if (fetched.ok) html = fetched.text;
  } catch {
    // fallback to existing fields below
  }

  const extracted = html
    ? extractArticleSignals({
        html,
        sourceUrl: row.source_url,
        fallbackTitle: row.title,
        fallbackSnippet: row.excerpt,
      })
    : {
        title: row.title,
        excerpt: cleanText(row.excerpt ?? "", 420),
        heroImageUrl: null,
        publishedAt: null,
        isPaywalled: Boolean(row.is_paywalled),
        paywallNote: null,
        language: "unknown" as const,
        perspective: "neutral" as const,
        plainText: normalizeInputText(row.body ?? row.summary ?? row.excerpt ?? ""),
      };

  const plainText = normalizeInputText(extracted.plainText);
  const isPaywalled = Boolean(row.is_paywalled) || Boolean(extracted.isPaywalled);

  const generated = composeHeuristicDraft({
    title: String(extracted.title ?? row.title ?? ""),
    excerpt: extracted.excerpt ?? row.excerpt,
    plainText,
    isPaywalled,
  });

  const language = guessDocumentLanguage({
    html,
    text: `${extracted.title ?? ""} ${extracted.excerpt ?? ""} ${plainText}`.trim(),
  });
  const needsTranslation = shouldTranslateToNorwegian(language);

  let nextSummary = generated.summary;
  let nextBody = generated.body;
  if (needsTranslation) {
    if (nextSummary) nextSummary = (await translateToNorwegianBokmal(nextSummary)) ?? nextSummary;
    if (nextBody) nextBody = (await translateToNorwegianBokmal(nextBody)) ?? nextBody;
  }

  if (isPaywalled) {
    nextBody = null;
    const excerptOnly = cleanText(extracted.excerpt ?? row.excerpt ?? "", 420);
    if (excerptOnly) nextSummary = excerptOnly;
  }

  const summaryToSave = isPaywalled
    ? nextSummary ?? row.summary
    : isPlaceholderLike(row.summary) || String(row.summary ?? "").trim().length < 120
      ? nextSummary ?? row.summary
      : row.summary ?? nextSummary;

  let bodyToSave = row.body;
  if (nextBody) {
    if (isPlaceholderLike(row.body)) {
      bodyToSave = nextBody;
    } else if (!String(row.body ?? "").includes(nextBody.slice(0, 110))) {
      bodyToSave = `${String(row.body ?? "").trim()}\n\n${nextBody}`.trim();
    }
  } else if (isPlaceholderLike(row.body)) {
    bodyToSave = null;
  }

  const hasChanges =
    String(summaryToSave ?? "").trim() !== String(row.summary ?? "").trim() ||
    String(bodyToSave ?? "").trim() !== String(row.body ?? "").trim();

  if (!hasChanges) {
    revalidateNewsSurfaces(row.slug);
    redirect(adminNoticeUrl("generated_no_change", id));
  }

  const { error: updateError } = await db
    .from("news_articles")
    .update({
      summary: summaryToSave ?? null,
      body: bodyToSave ?? null,
    })
    .eq("id", id);

  if (updateError) throw new Error(updateError.message);

  revalidateNewsSurfaces(row.slug);
  redirect(adminNoticeUrl("generated", id));
}

async function removeGeneratedExtraText(formData: FormData) {
  "use server";

  await requireAdmin("/admin/ki-avis");
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Mangler artikkel-id");

  const db = supabaseAdmin();
  const { data: row, error: rowError } = await db
    .from("news_articles")
    .select("id,slug,excerpt,summary,editor_note")
    .eq("id", id)
    .maybeSingle();
  if (rowError || !row) {
    throw new Error(rowError?.message ?? "Fant ikke sak");
  }

  const excerptSummary = cleanText(row.excerpt ?? "", 420);
  const summaryToSave = excerptSummary || (isPlaceholderLike(row.summary) ? null : row.summary);
  const editorNoteToSave = stripAutoEnrichmentEditorNote(row.editor_note);

  const { error: updateError } = await db
    .from("news_articles")
    .update({
      summary: summaryToSave,
      body: null,
      editor_note: editorNoteToSave,
    })
    .eq("id", id);
  if (updateError) throw new Error(updateError.message);

  revalidateNewsSurfaces(row.slug);
  redirect(adminNoticeUrl("removed_generated", id));
}

export default async function KIAvisAdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ notice?: string | string[]; item?: string | string[] }>;
}) {
  await requireAdmin("/admin/ki-avis");
  const sp = (await searchParams) ?? {};
  const notice = resolveAdminNotice(sp.notice);
  const noticeItemId = firstSearchParam(sp.item);
  const rows = await listNewsForAdmin(240);
  const reviewRows = rows.filter((row) => row.status === "draft");
  const nonPublishedRows = rows.filter(
    (row) => row.status !== "draft" && row.status !== "published"
  );
  const publishedRows = rows.filter((row) => row.status === "published");
  const orderedRows = [...reviewRows, ...nonPublishedRows, ...publishedRows];
  const layoutCandidates = rows.filter(
    (row) =>
      row.status === "published" &&
      hasImage(row.hero_image_url) &&
      !isLikelyInternationalDeskArticle(row)
  );
  const activeLeadAny = rows.find((row) => hasTag(row.topic_tags, FRONT_LEAD_OVERRIDE_TAG)) ?? null;
  const activeLeadVisible = layoutCandidates.find((row) => row.id === activeLeadAny?.id) ?? null;
  const activeFrontNowAny = FRONT_NOW_OVERRIDE_TAGS.map(
    (tag) => rows.find((row) => hasTag(row.topic_tags, tag)) ?? null
  );
  const activeFrontNowVisible = FRONT_NOW_OVERRIDE_TAGS.map((tag, idx) => {
    const anyRow = activeFrontNowAny[idx];
    return layoutCandidates.find((row) => row.id === anyRow?.id) ?? null;
  });
  const issueStamp = new Date().toLocaleString("nb-NO", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className={`${uiSans.className} min-h-screen bg-[#f1ede4] text-[#191919]`}>
      <div className="mx-auto max-w-[1280px] px-3 py-5 md:px-4 md:py-6">
        <header className="border-y border-black/20 bg-[#f6f2e9]">
          <div className="border-b border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.21em] text-black/65 md:px-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>Admin-utgave · KiR Nyheter</span>
              <span>Oppdatert {issueStamp}</span>
              <span>AIVISA DRIVES AV CUZ MEDIA AS</span>
            </div>
          </div>

          <div className="px-3 py-4 md:px-4 md:py-5">
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 border-b border-black/20 pb-3">
              <p className="hidden text-[10px] uppercase tracking-[0.22em] text-black/55 md:block">
                Redaksjonell kontrollflate
              </p>

              <div className="text-center">
                <div className="mx-auto mb-2 flex items-center justify-center gap-3">
                  <img src="/KIREKLAMElogo.gif" alt="KiR Nyheter logo" className="h-11 w-11" />
                  <span className={`${masthead.className} text-4xl leading-none md:text-6xl`}>
                    KiR Nyheter CMS
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-black/60 md:text-[11px]">
                  Nasjonal desk for KI-stoff
                </p>
              </div>

              <p className="hidden text-right text-[10px] uppercase tracking-[0.22em] text-black/55 md:block">
                Cuz Media AS
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/72 md:gap-4">
              <Link href="/ki-avis" className="hover:text-black">
                Åpne aivis
              </Link>
              <span className="text-black/35">|</span>
              <Link href="/admin/ki-avis/layout" className="hover:text-black">
                Forside-layout
              </Link>
              <span className="text-black/35">|</span>
              <Link href="/admin" className="hover:text-black">
                Til admin
              </Link>
              <span className="text-black/35">|</span>
              <span>{rows.length} saker i arkivet</span>
            </div>
          </div>
        </header>

        {notice ? (
          <section className="mt-4 border border-emerald-800/30 bg-emerald-100/60 px-4 py-3 text-sm text-emerald-900">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{notice.text}</p>
              <Link
                href={noticeItemId ? `/admin/ki-avis#article-${noticeItemId}` : "/admin/ki-avis"}
                className="text-[11px] font-semibold uppercase tracking-[0.14em] underline underline-offset-4 hover:opacity-80"
              >
                Lukk melding
              </Link>
            </div>
          </section>
        ) : null}

        <section className="mt-4 border border-black/20 bg-[#f8f4eb] p-4">
          <h2 className={`${headline.className} text-[30px] leading-[1.02] md:text-[36px]`}>
            Forside-layout
          </h2>
          <p className="mt-1 text-sm text-black/70">
            Velg hvilke saker som skal ligge i faste forsideslots. Tom verdi betyr automatisk valg.
          </p>
          <p className="mt-2 text-xs text-black/62">
            For rask visuell plassering uten lang scrolling:
            {" "}
            <Link
              href="/admin/ki-avis/layout"
              className="font-semibold uppercase tracking-[0.12em] underline underline-offset-4 hover:opacity-80"
            >
              Åpne layout-kontroll
            </Link>
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="border border-black/15 bg-[#fcf8ef] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-black/58">Hovedsak</p>
              {hasImage(activeLeadAny?.hero_image_url ?? null) ? (
                <img
                  src={activeLeadAny?.hero_image_url ?? ""}
                  alt={activeLeadAny?.title ?? "Hovedsak"}
                  className="mt-2 h-20 w-full border border-black/15 object-cover"
                />
              ) : null}
              <p className="mt-2 text-sm font-semibold leading-snug text-black/85">
                {activeLeadAny?.title ?? "Automatisk"}
              </p>
              {!activeLeadVisible && activeLeadAny ? (
                <p className="mt-1 text-xs text-amber-700">
                  Valgt sak er ikke visbar med nåværende filter.
                </p>
              ) : null}
            </div>

            {FRONT_NOW_OVERRIDE_TAGS.map((tag, idx) => (
              <div key={tag} className="border border-black/15 bg-[#fcf8ef] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-black/58">
                  Forside nå #{idx + 1}
                </p>
                {hasImage(activeFrontNowAny[idx]?.hero_image_url ?? null) ? (
                  <img
                    src={activeFrontNowAny[idx]?.hero_image_url ?? ""}
                    alt={activeFrontNowAny[idx]?.title ?? `Forside nå ${idx + 1}`}
                    className="mt-2 h-20 w-full border border-black/15 object-cover"
                  />
                ) : null}
                <p className="mt-2 text-sm font-semibold leading-snug text-black/85">
                  {activeFrontNowAny[idx]?.title ?? "Automatisk"}
                </p>
                {!activeFrontNowVisible[idx] && activeFrontNowAny[idx] ? (
                  <p className="mt-1 text-xs text-amber-700">
                    Valgt sak er ikke visbar med nåværende filter.
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <form action={setFrontLayoutOverrides} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className={LABEL_CLASS}>
              <span className={LABEL_TEXT_CLASS}>Hovedsak</span>
              <select name="lead_article_id" defaultValue={activeLeadVisible?.id ?? ""} className={FIELD_CLASS}>
                <option value="">Automatisk</option>
                {layoutCandidates.map((row) => (
                  <option key={`lead-${row.id}`} value={row.id}>
                    {row.title} ({row.source_name})
                  </option>
                ))}
              </select>
            </label>

            {FRONT_NOW_OVERRIDE_TAGS.map((tag, idx) => (
              <label key={tag} className={LABEL_CLASS}>
                <span className={LABEL_TEXT_CLASS}>Forside nå #{idx + 1}</span>
                <select
                  name={`front_now_${idx + 1}_id`}
                  defaultValue={activeFrontNowVisible[idx]?.id ?? ""}
                  className={FIELD_CLASS}
                >
                  <option value="">Automatisk</option>
                  {layoutCandidates.map((row) => (
                    <option key={`${tag}-${row.id}`} value={row.id}>
                      {row.title} ({row.source_name})
                    </option>
                  ))}
                </select>
              </label>
            ))}

            <div className="xl:col-span-4">
              <button className={PRIMARY_BUTTON_CLASS}>Lagre forside-layout</button>
            </div>
          </form>

          <p className="mt-2 text-xs text-black/58">
            Kandidater: publiserte saker med gyldig bilde som ikke er internasjonale.
          </p>
        </section>

        <section className="mt-4 border border-black/20 bg-[#f8f4eb] p-4">
          <h1 className={`${headline.className} text-[36px] leading-[1.02] md:text-[44px]`}>Ny sak</h1>
          <p className="mt-1 text-sm text-black/68">
            Opprett ny artikkel for <code className="bg-black/5 px-1">/ki-avis</code>. Publiserte saker
            går rett ut i aivisen.
          </p>

          <form action={saveArticle} className="mt-4 grid gap-3 md:grid-cols-2">
            <input type="hidden" name="id" value="" />

            <label className={LABEL_CLASS}>
              <span className={LABEL_TEXT_CLASS}>Tittel</span>
              <input name="title" required className={FIELD_CLASS} />
            </label>

            <label className={LABEL_CLASS}>
              <span className={LABEL_TEXT_CLASS}>Slug (valgfri)</span>
              <input name="slug" className={FIELD_CLASS} />
            </label>

            <label className={`${LABEL_CLASS} md:col-span-2`}>
              <span className={LABEL_TEXT_CLASS}>Kilde-URL</span>
              <input name="source_url" required className={FIELD_CLASS} />
            </label>

            <label className={LABEL_CLASS}>
              <span className={LABEL_TEXT_CLASS}>Kilde-navn</span>
              <input name="source_name" placeholder="f.eks. Kampanje" className={FIELD_CLASS} />
            </label>

            <label className={LABEL_CLASS}>
              <span className={LABEL_TEXT_CLASS}>Språk</span>
              <input name="language" defaultValue="no" className={FIELD_CLASS} />
            </label>

            <label className={LABEL_CLASS}>
              <span className={LABEL_TEXT_CLASS}>Publisert dato</span>
              <input type="datetime-local" name="published_at" className={FIELD_CLASS} />
            </label>

            <label className={LABEL_CLASS}>
              <span className={LABEL_TEXT_CLASS}>Status</span>
              <select name="status" defaultValue="draft" className={FIELD_CLASS}>
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </label>

            <label className={LABEL_CLASS}>
              <span className={LABEL_TEXT_CLASS}>Vinkel</span>
              <select name="perspective" defaultValue="neutral" className={FIELD_CLASS}>
                <option value="neutral">neutral</option>
                <option value="critical">critical</option>
                <option value="adoption">adoption</option>
              </select>
            </label>

            <label className={LABEL_CLASS}>
              <span className={LABEL_TEXT_CLASS}>Tema-tags (CSV)</span>
              <input name="topic_tags" placeholder="ki_reklame, kritikk, betalingsmur" className={FIELD_CLASS} />
            </label>

            <label className={LABEL_CLASS}>
              <span className={LABEL_TEXT_CLASS}>Hero image URL</span>
              <input name="hero_image_url" className={FIELD_CLASS} />
            </label>

            <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-black/75">
              <input type="checkbox" name="is_paywalled" className="h-4 w-4 border-black/30" />
              Bak betalingsmur
            </label>

            <label className={`${LABEL_CLASS} md:col-span-2`}>
              <span className={LABEL_TEXT_CLASS}>Paywall-notat</span>
              <input name="paywall_note" className={FIELD_CLASS} />
            </label>

            <label className={`${LABEL_CLASS} md:col-span-2`}>
              <span className={LABEL_TEXT_CLASS}>Ingress/Excerpt</span>
              <textarea name="excerpt" rows={2} className={TEXTAREA_CLASS} />
            </label>

            <label className={`${LABEL_CLASS} md:col-span-2`}>
              <span className={LABEL_TEXT_CLASS}>Oppsummering</span>
              <textarea name="summary" rows={4} className={TEXTAREA_CLASS} />
            </label>

            <label className={`${LABEL_CLASS} md:col-span-2`}>
              <span className={LABEL_TEXT_CLASS}>Redaksjonell tekst</span>
              <textarea name="body" rows={6} className={TEXTAREA_CLASS} />
            </label>

            <label className={`${LABEL_CLASS} md:col-span-2`}>
              <span className={LABEL_TEXT_CLASS}>Redaksjonell note</span>
              <textarea name="editor_note" rows={2} className={TEXTAREA_CLASS} />
            </label>

            <label className={`${LABEL_CLASS} md:col-span-2`}>
              <span className={LABEL_TEXT_CLASS}>Cloudflare worker hint</span>
              <input
                name="cloudflare_worker_hint"
                defaultValue="ready_for_worker_enrichment"
                className={FIELD_CLASS}
              />
            </label>

            <div className="md:col-span-2 pt-1">
              <button className={PRIMARY_BUTTON_CLASS}>Lagre ny sak</button>
            </div>
          </form>
        </section>

        <section className="mt-5 border-t border-black/20 pt-4">
          <h2 className={`${masthead.className} text-[36px] leading-none md:text-[44px]`}>
            Eksisterende saker ({orderedRows.length})
          </h2>
          <p className="mt-1 text-sm text-black/68">
            Sidepanelet skiller tydelig mellom <b>til vurdering</b>, <b>ikke publisert</b> og{" "}
            <b>publisert</b>. Til vurdering vises alltid øverst.
          </p>

          <div className="mt-3 grid gap-3 xl:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="border border-black/20 bg-[#f8f4eb] p-3 xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-auto">
              <h3 className={`${headline.className} text-[27px] leading-[1.05]`}>Sakskø</h3>
              <p className="mt-1 text-xs text-black/62">
                Klikk på en sak for å hoppe direkte til redigering.
              </p>

              <div className="mt-3 border border-amber-700/30 bg-amber-50/40">
                <div className="border-b border-amber-700/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-900">
                  Til vurdering ({reviewRows.length})
                </div>
                <div className="max-h-[240px] space-y-2 overflow-auto p-2">
                  {reviewRows.length ? (
                    reviewRows.slice(0, 20).map((row) => (
                      <Link
                        key={`panel-review-${row.id}`}
                        href={`#article-${row.id}`}
                        className={`block border px-2 py-2 text-sm leading-snug hover:bg-amber-100/70 ${
                          noticeItemId === row.id
                            ? "border-emerald-700/35 bg-emerald-50/50"
                            : "border-amber-900/20 bg-[#fcf8ef]"
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-[0.14em] text-black/58">{row.source_name}</p>
                        <p className="mt-1 text-[13px] font-semibold text-black/88">{row.title}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-black/60">Ingen saker til vurdering akkurat nå.</p>
                  )}
                  {reviewRows.length > 20 ? (
                    <p className="text-[10px] uppercase tracking-[0.14em] text-black/58">
                      Viser 20 av {reviewRows.length}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 border border-black/20 bg-[#f6f2e9]">
                <div className="border-b border-black/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/72">
                  Ikke publisert ({nonPublishedRows.length})
                </div>
                <div className="max-h-[220px] space-y-2 overflow-auto p-2">
                  {nonPublishedRows.length ? (
                    nonPublishedRows.slice(0, 16).map((row) => (
                      <Link
                        key={`panel-unpublished-${row.id}`}
                        href={`#article-${row.id}`}
                        className={`block border px-2 py-2 text-sm leading-snug hover:bg-black/5 ${
                          noticeItemId === row.id
                            ? "border-emerald-700/35 bg-emerald-50/50"
                            : "border-black/15 bg-[#fcf8ef]"
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-[0.14em] text-black/58">
                          {row.source_name} · {row.status}
                        </p>
                        <p className="mt-1 text-[13px] font-semibold text-black/88">{row.title}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-black/60">Ingen ikke-publiserte saker utenfor vurderingskø.</p>
                  )}
                  {nonPublishedRows.length > 16 ? (
                    <p className="text-[10px] uppercase tracking-[0.14em] text-black/58">
                      Viser 16 av {nonPublishedRows.length}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 border border-black/20 bg-[#f6f2e9]">
                <div className="border-b border-black/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/72">
                  Publisert ({publishedRows.length})
                </div>
                <div className="max-h-[220px] space-y-2 overflow-auto p-2">
                  {publishedRows.length ? (
                    publishedRows.slice(0, 16).map((row) => (
                      <Link
                        key={`panel-published-${row.id}`}
                        href={`#article-${row.id}`}
                        className={`block border px-2 py-2 text-sm leading-snug hover:bg-black/5 ${
                          noticeItemId === row.id
                            ? "border-emerald-700/35 bg-emerald-50/50"
                            : "border-black/15 bg-[#fcf8ef]"
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-[0.14em] text-black/58">
                          {row.source_name} · published
                        </p>
                        <p className="mt-1 text-[13px] font-semibold text-black/88">{row.title}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-black/60">Ingen publiserte saker ennå.</p>
                  )}
                  {publishedRows.length > 16 ? (
                    <p className="text-[10px] uppercase tracking-[0.14em] text-black/58">
                      Viser 16 av {publishedRows.length}
                    </p>
                  ) : null}
                </div>
              </div>
            </aside>

            <div className="border-y border-black/15 bg-[#f8f4eb]">
              {orderedRows.map((row) => (
              <article
                key={row.id}
                id={`article-${row.id}`}
                className={`border-b px-3 py-4 last:border-b-0 md:px-4 ${
                  noticeItemId === row.id
                    ? "border-emerald-700/35 bg-emerald-50/40"
                    : "border-black/15"
                }`}
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2 border-b border-black/10 pb-2">
                  <div>
                    <p className={`${headline.className} text-[30px] leading-[1.03] md:text-[35px]`}>
                      {row.title}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-black/58">
                      {row.source_name} · {row.status} · {row.perspective}
                    </p>
                    {noticeItemId === row.id && notice ? (
                      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-900">
                        {notice.text}
                      </p>
                    ) : null}
                  </div>
                  <Link
                    href={`/ki-avis/${row.slug}`}
                    className="text-[11px] font-semibold uppercase tracking-[0.14em] underline underline-offset-4 hover:opacity-75"
                  >
                    Åpne sak
                  </Link>
                </div>

                <form action={saveArticle} className="grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={row.id} />

                  <label className={`${LABEL_CLASS} md:col-span-2`}>
                    <span className={LABEL_TEXT_CLASS}>Tittel</span>
                    <input name="title" defaultValue={row.title} required className={FIELD_CLASS} />
                  </label>

                  <label className={LABEL_CLASS}>
                    <span className={LABEL_TEXT_CLASS}>Slug</span>
                    <input name="slug" defaultValue={row.slug} className={FIELD_CLASS} />
                  </label>

                  <label className={LABEL_CLASS}>
                    <span className={LABEL_TEXT_CLASS}>Kilde-navn</span>
                    <input name="source_name" defaultValue={row.source_name} className={FIELD_CLASS} />
                  </label>

                  <label className={`${LABEL_CLASS} md:col-span-2`}>
                    <span className={LABEL_TEXT_CLASS}>Kilde-URL</span>
                    <input name="source_url" defaultValue={row.source_url} required className={FIELD_CLASS} />
                  </label>

                  <label className={LABEL_CLASS}>
                    <span className={LABEL_TEXT_CLASS}>Språk</span>
                    <input name="language" defaultValue={row.language} className={FIELD_CLASS} />
                  </label>

                  <label className={LABEL_CLASS}>
                    <span className={LABEL_TEXT_CLASS}>Publisert dato</span>
                    <input
                      type="datetime-local"
                      name="published_at"
                      defaultValue={toDateInput(row.published_at)}
                      className={FIELD_CLASS}
                    />
                  </label>

                  <label className={LABEL_CLASS}>
                    <span className={LABEL_TEXT_CLASS}>Status</span>
                    <select name="status" defaultValue={row.status} className={FIELD_CLASS}>
                      <option value="draft">draft</option>
                      <option value="published">published</option>
                      <option value="archived">archived</option>
                    </select>
                  </label>

                  <label className={LABEL_CLASS}>
                    <span className={LABEL_TEXT_CLASS}>Vinkel</span>
                    <select name="perspective" defaultValue={row.perspective} className={FIELD_CLASS}>
                      <option value="neutral">neutral</option>
                      <option value="critical">critical</option>
                      <option value="adoption">adoption</option>
                    </select>
                  </label>

                  <label className={`${LABEL_CLASS} md:col-span-2`}>
                    <span className={LABEL_TEXT_CLASS}>Tema-tags (CSV)</span>
                    <input
                      name="topic_tags"
                      defaultValue={topicTagsToCsv(row.topic_tags)}
                      className={FIELD_CLASS}
                    />
                  </label>

                  <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-black/75">
                    <input
                      type="checkbox"
                      name="is_paywalled"
                      defaultChecked={row.is_paywalled}
                      className="h-4 w-4 border-black/30"
                    />
                    Bak betalingsmur
                  </label>

                  <label className={`${LABEL_CLASS} md:col-span-2`}>
                    <span className={LABEL_TEXT_CLASS}>Paywall-notat</span>
                    <input
                      name="paywall_note"
                      defaultValue={row.paywall_note ?? ""}
                      className={FIELD_CLASS}
                    />
                  </label>

                  <label className={`${LABEL_CLASS} md:col-span-2`}>
                    <span className={LABEL_TEXT_CLASS}>Ingress/Excerpt</span>
                    <textarea
                      name="excerpt"
                      rows={2}
                      defaultValue={row.excerpt ?? ""}
                      className={TEXTAREA_CLASS}
                    />
                  </label>

                  <label className={`${LABEL_CLASS} md:col-span-2`}>
                    <span className={LABEL_TEXT_CLASS}>Oppsummering</span>
                    <textarea
                      name="summary"
                      rows={4}
                      defaultValue={row.summary ?? ""}
                      className={TEXTAREA_CLASS}
                    />
                  </label>

                  <label className={`${LABEL_CLASS} md:col-span-2`}>
                    <span className={LABEL_TEXT_CLASS}>Redaksjonell tekst</span>
                    <textarea
                      name="body"
                      rows={6}
                      defaultValue={row.body ?? ""}
                      className={TEXTAREA_CLASS}
                    />
                  </label>

                  <label className={`${LABEL_CLASS} md:col-span-2`}>
                    <span className={LABEL_TEXT_CLASS}>Redaksjonell note</span>
                    <textarea
                      name="editor_note"
                      rows={2}
                      defaultValue={row.editor_note ?? ""}
                      className={TEXTAREA_CLASS}
                    />
                  </label>

                  <label className={LABEL_CLASS}>
                    <span className={LABEL_TEXT_CLASS}>Hero image URL</span>
                    <input
                      name="hero_image_url"
                      defaultValue={row.hero_image_url ?? ""}
                      className={FIELD_CLASS}
                    />
                  </label>

                  <label className={LABEL_CLASS}>
                    <span className={LABEL_TEXT_CLASS}>Cloudflare worker hint</span>
                    <input
                      name="cloudflare_worker_hint"
                      defaultValue={row.cloudflare_worker_hint ?? ""}
                      className={FIELD_CLASS}
                    />
                  </label>

                  <div className="md:col-span-2 flex flex-wrap items-center gap-2 pt-1">
                    <button className={PRIMARY_BUTTON_CLASS}>Lagre endringer</button>
                  </div>
                </form>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <form action={setFrontLayoutSlotFromRow}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="slot_tag" value={FRONT_LEAD_OVERRIDE_TAG} />
                    <button className={SECONDARY_BUTTON_CLASS}>Sett som hovedsak</button>
                  </form>
                  {FRONT_NOW_OVERRIDE_TAGS.map((tag, idx) => (
                    <form key={`${row.id}-${tag}`} action={setFrontLayoutSlotFromRow}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="slot_tag" value={tag} />
                      <button className={SECONDARY_BUTTON_CLASS}>Forside nå #{idx + 1}</button>
                    </form>
                  ))}
                  <form action={clearFrontLayoutSlotsFromRow}>
                    <input type="hidden" name="id" value={row.id} />
                    <button className={SECONDARY_BUTTON_CLASS}>Fjern fra forside-slotter</button>
                  </form>
                </div>

                <form action={generateMoreTextFromSource} className="mt-2">
                  <input type="hidden" name="id" value={row.id} />
                  <button className={SECONDARY_BUTTON_CLASS}>Generer mer tekst fra kilde</button>
                </form>

                <form action={removeGeneratedExtraText} className="mt-2">
                  <input type="hidden" name="id" value={row.id} />
                  <button className={SECONDARY_BUTTON_CLASS}>Fjern generert ekstratekst</button>
                </form>

                <form action={deleteArticle} className="mt-3">
                  <input type="hidden" name="id" value={row.id} />
                  <button className={SECONDARY_BUTTON_CLASS}>Slett sak</button>
                </form>

                <details className="mt-3 border border-black/15 bg-[#f6f2e9] p-3">
                  <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.14em] text-black/70">
                    SQL patch-mal for mer tekst
                  </summary>
                  <p className="mt-2 text-sm text-black/70">
                    Manuell patch-mal: fyll inn egen tekst i feltene under når du vil oppdatere
                    oppsummering og redaksjonell tekst (uten full artikkeltekst).
                  </p>
                  <pre className="mt-2 overflow-x-auto border border-black/15 bg-[#fcf8ef] p-3 text-xs leading-relaxed text-black/80">
{`-- Bytt ut __NEW_SUMMARY__ og __NEW_BODY__ før du kjører.
with patch as (
  select
    '__NEW_SUMMARY__'::text as new_summary,
    '__NEW_BODY__'::text as new_body
)
update news_articles n
set
  summary = case
    when p.new_summary ~ '^__NEW_' then n.summary
    when nullif(trim(p.new_summary), '') is null then n.summary
    else p.new_summary
  end,
  body = case
    when p.new_body ~ '^__NEW_' then n.body
    when nullif(trim(p.new_body), '') is null then n.body
    when coalesce(n.body, '') = '' then p.new_body
    else n.body || E'\\n\\n' || p.new_body
  end,
  editor_note = case
    when p.new_body ~ '^__NEW_' then n.editor_note
    when coalesce(n.editor_note, '') ilike '%Oppdatert med ekstra kildesammenfatning.%' then n.editor_note
    else trim(coalesce(n.editor_note, '') || E'\\nOppdatert med ekstra kildesammenfatning.')
  end
from patch p
where n.id = '${row.id}';`}
                  </pre>
                </details>
              </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
