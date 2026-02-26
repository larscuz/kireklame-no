import { exampleShowcaseItems, type ExampleShowcaseItem } from "@/data/norskPrompting/exampleShowcase";
import type { PromptOutputType } from "@/data/norskPrompting/types";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ExampleDifficulty = "Vanskelig" | "Svært vanskelig";
type MediaKind = "image" | "video";

type ExampleShowcaseCmsRow = {
  id: string;
  example_key: string;
  title: string;
  output_type: PromptOutputType;
  model_name: string;
  difficulty: string;
  challenge: string;
  short_brief: string;
  mini_tutorial: unknown;
  prompt_text: string;
  terms: unknown;
  media_kind: MediaKind;
  media_src: string | null;
  media_thumbnail_src: string | null;
  media_poster_src: string | null;
  media_alt: string;
  media_caption: string;
  is_placeholder: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function normalizeLines(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry ?? "").trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeDifficulty(value: string): ExampleDifficulty {
  return value === "Svært vanskelig" ? "Svært vanskelig" : "Vanskelig";
}

function mapRowToItem(row: ExampleShowcaseCmsRow): ExampleShowcaseItem {
  const outputType: PromptOutputType = row.output_type === "video" ? "video" : "image";
  const mediaKind: MediaKind = row.media_kind === "video" ? "video" : "image";

  const media =
    mediaKind === "video"
      ? {
          kind: "video" as const,
          src: row.media_src ?? undefined,
          thumbnailSrc: row.media_thumbnail_src ?? undefined,
          posterSrc: row.media_poster_src ?? undefined,
          alt: row.media_alt,
          caption: row.media_caption,
          isPlaceholder: row.is_placeholder,
        }
      : {
          kind: "image" as const,
          src: row.media_src || "/norsk-prompting/examples/eksempel-01-arkitektur.svg",
          thumbnailSrc: row.media_thumbnail_src ?? undefined,
          alt: row.media_alt,
          caption: row.media_caption,
          isPlaceholder: row.is_placeholder,
        };

  return {
    id: row.example_key,
    title: row.title,
    outputType,
    modelName: row.model_name,
    difficulty: normalizeDifficulty(row.difficulty),
    challenge: row.challenge,
    shortBrief: row.short_brief,
    miniTutorial: normalizeLines(row.mini_tutorial),
    prompt: row.prompt_text,
    terms: normalizeLines(row.terms),
    media,
  };
}

export function buildCmsInsertRowsFromStaticExamples() {
  return exampleShowcaseItems.map((item, index) => {
    const isVideo = item.media.kind === "video";

    return {
      example_key: item.id,
      title: item.title,
      output_type: item.outputType,
      model_name: item.modelName,
      difficulty: item.difficulty,
      challenge: item.challenge,
      short_brief: item.shortBrief,
      mini_tutorial: item.miniTutorial,
      prompt_text: item.prompt,
      terms: item.terms,
      media_kind: item.media.kind,
      media_src: isVideo ? item.media.src ?? null : item.media.src,
      media_thumbnail_src: item.media.thumbnailSrc ?? null,
      media_poster_src: item.media.kind === "video" ? item.media.posterSrc ?? null : null,
      media_alt: item.media.alt,
      media_caption: item.media.caption,
      is_placeholder: item.media.isPlaceholder ?? true,
      sort_order: index,
      is_active: true,
    };
  });
}

export async function loadExampleShowcaseItems(): Promise<{
  items: ExampleShowcaseItem[];
  source: "cms" | "static";
  tableMissing: boolean;
  errorMessage?: string;
}> {
  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("ki_skole_examples")
      .select(
        "id,example_key,title,output_type,model_name,difficulty,challenge,short_brief,mini_tutorial,prompt_text,terms,media_kind,media_src,media_thumbnail_src,media_poster_src,media_alt,media_caption,is_placeholder,sort_order,is_active,created_at,updated_at"
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      if (error.code === "42P01") {
        return { items: exampleShowcaseItems, source: "static", tableMissing: true };
      }
      return {
        items: exampleShowcaseItems,
        source: "static",
        tableMissing: false,
        errorMessage: error.message,
      };
    }

    const rows = (data ?? []) as ExampleShowcaseCmsRow[];
    if (rows.length === 0) {
      return { items: exampleShowcaseItems, source: "static", tableMissing: false };
    }

    return {
      items: rows.map(mapRowToItem),
      source: "cms",
      tableMissing: false,
    };
  } catch (error: any) {
    return {
      items: exampleShowcaseItems,
      source: "static",
      tableMissing: false,
      errorMessage: String(error?.message ?? "Unknown error"),
    };
  }
}
