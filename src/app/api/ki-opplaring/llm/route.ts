import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  runKiOpplaringTask,
  runCampaignChat,
  setCampaignSkillCatalog,
  type BuildScript10sPayload,
  type CampaignChatPayload,
  type CampaignRecommendPayload,
  type ExerciseComparePayload,
  type LlmTask,
  type PromptAssistPayload,
  type TransformPromptPayload,
} from "@/lib/ki-opplaring/llm";
import { glossaryBySlug, marketingSkills } from "@/data/norskPrompting/runtime";
import {
  consumeRateLimit,
  QUOTA_FALLBACK_COOKIE_NAME,
  quotaLimitForSubject,
  resolveQuotaSubject,
  tryConsumeDailyQuota,
  type QuotaBucket,
  type QuotaUsage,
} from "@/server/ki-opplaring/quota";
import {
  runImageCompareGenerate,
  runVideoCompareGenerate,
  type ImageComparePayload,
  type VideoComparePayload,
} from "@/server/ki-opplaring/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TASKS = [
  "transform_prompt",
  "exercise_compare",
  "build_script_10s",
  "campaign_recommend",
  "campaign_chat",
  "prompt_assist",
  "image_compare_generate",
  "video_compare_generate",
] as const;

type ApiTask = (typeof TASKS)[number];

const bodySchema = z.object({
  task: z.enum(TASKS),
  payload: z.unknown().optional(),
});

const transformPayloadSchema = z.object({
  prompt: z.string().trim().min(1).max(2000),
  context: z.string().trim().max(400).optional(),
});

const exercisePayloadSchema = z.object({
  badPrompt: z.string().trim().min(1).max(1200),
  goodPrompt: z.string().trim().min(1).max(1200),
  context: z.string().trim().max(400).optional(),
});

const scriptPayloadSchema = z.object({
  product: z.string().trim().min(1).max(200),
  targetAudience: z.string().trim().min(1).max(200),
  channel: z.string().trim().min(1).max(120),
  tone: z.string().trim().min(1).max(160),
  benefit: z.string().trim().min(1).max(300),
  cta: z.string().trim().min(1).max(120),
  constraints: z.string().trim().min(1).max(400),
  format: z.enum(["9:16", "16:9"]),
});

const campaignRecommendPayloadSchema = z.object({
  brief: z.string().trim().min(10).max(3000),
});

const campaignChatPayloadSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(20),
});

const promptAssistPayloadSchema = z.object({
  user_input: z.string().trim().min(1).max(1200),
  output_type: z.enum(["image", "video", "text"]),
  domain: z.enum([
    "film-vfx",
    "arkitektur",
    "produkt",
    "dokumentar",
    "sosiale-medier",
    "historisk",
    "redaksjonell",
    "design-system",
    "surreal_absurd",
    "animated",
  ]),
  draft_prompt: z.string().trim().min(40).max(2500),
  candidate_slugs: z.array(z.string().trim().min(1).max(120)).min(1).max(20),
});

const imageComparePayloadSchema = z.object({
  prompt: z.string().trim().min(1).max(1200),
  aspectRatio: z.enum(["1:1", "16:9"]).optional().default("1:1"),
});

const videoComparePayloadSchema = z.object({
  prompt: z.string().trim().min(1).max(1000),
  durationSec: z.number().int().min(1).max(4).optional().default(4),
});

type ParsedPayload =
  | TransformPromptPayload
  | ExerciseComparePayload
  | BuildScript10sPayload
  | CampaignRecommendPayload
  | CampaignChatPayload
  | z.infer<typeof promptAssistPayloadSchema>
  | ImageComparePayload
  | VideoComparePayload;

function parsePayload(task: ApiTask, payload: unknown): { ok: true; data: ParsedPayload } | { ok: false; error: string } {
  if (task === "transform_prompt") {
    const parsed = transformPayloadSchema.safeParse(payload ?? {});
    return parsed.success ? { ok: true, data: parsed.data } : { ok: false, error: "Ugyldig payload for transform_prompt." };
  }

  if (task === "exercise_compare") {
    const parsed = exercisePayloadSchema.safeParse(payload ?? {});
    return parsed.success ? { ok: true, data: parsed.data } : { ok: false, error: "Ugyldig payload for exercise_compare." };
  }

  if (task === "build_script_10s") {
    const parsed = scriptPayloadSchema.safeParse(payload ?? {});
    return parsed.success ? { ok: true, data: parsed.data } : { ok: false, error: "Ugyldig payload for build_script_10s." };
  }

  if (task === "campaign_recommend") {
    const parsed = campaignRecommendPayloadSchema.safeParse(payload ?? {});
    return parsed.success ? { ok: true, data: parsed.data } : { ok: false, error: "Ugyldig payload for campaign_recommend. Brief må være minst 10 tegn." };
  }

  if (task === "campaign_chat") {
    const parsed = campaignChatPayloadSchema.safeParse(payload ?? {});
    return parsed.success ? { ok: true, data: parsed.data } : { ok: false, error: "Ugyldig payload for campaign_chat. Meldinger mangler." };
  }

  if (task === "prompt_assist") {
    const parsed = promptAssistPayloadSchema.safeParse(payload ?? {});
    return parsed.success
      ? { ok: true, data: parsed.data }
      : { ok: false, error: "Ugyldig payload for prompt_assist." };
  }

  if (task === "image_compare_generate") {
    const parsed = imageComparePayloadSchema.safeParse(payload ?? {});
    return parsed.success ? { ok: true, data: parsed.data } : { ok: false, error: "Ugyldig payload for image_compare_generate." };
  }

  const parsed = videoComparePayloadSchema.safeParse(payload ?? {});
  return parsed.success ? { ok: true, data: parsed.data } : { ok: false, error: "Ugyldig payload for video_compare_generate." };
}

function payloadSize(payload: ParsedPayload): number {
  return JSON.stringify(payload).length;
}

function taskBucket(task: ApiTask): QuotaBucket {
  if (task === "image_compare_generate") return "media_image";
  if (task === "video_compare_generate") return "media_video";
  return "llm_text";
}

function taskErrorMessage(task: ApiTask): string {
  if (task === "video_compare_generate") {
    return "Klarte ikke kjøre video-sammenligningen akkurat nå.";
  }

  if (task === "image_compare_generate") {
    return "Klarte ikke kjøre bilde-sammenligningen akkurat nå.";
  }

  return "Klarte ikke kjøre KI-øvelsen akkurat nå.";
}

function toUsage(mode: "anon" | "user", limit: number, status: QuotaUsage["status"]): QuotaUsage {
  return {
    mode,
    used: Math.max(0, limit),
    remaining: 0,
    limit: Math.max(0, limit),
    status,
  };
}

export async function POST(req: NextRequest) {
  let activeTask: ApiTask | null = null;

  try {
    const body = bodySchema.safeParse(await req.json().catch(() => ({})));

    if (!body.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Ugyldig request. Bruk task + payload.",
          usage: {
            mode: "anon",
            used: 0,
            remaining: 3,
            limit: 3,
            status: "ok",
          },
        },
        { status: 400 }
      );
    }

    const task = body.data.task;
    activeTask = task;
    const parsedPayload = parsePayload(task, body.data.payload ?? {});

    if (!parsedPayload.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: parsedPayload.error,
          usage: {
            mode: "anon",
            used: 0,
            remaining: 3,
            limit: 3,
            status: "ok",
          },
        },
        { status: 400 }
      );
    }

    const subject = await resolveQuotaSubject(req);
    const bucket = taskBucket(task);
    const limit = quotaLimitForSubject(subject, bucket);
    const isStrictAnonTier = subject.tier === "anon";

    const anonPayloadLimit = task === "prompt_assist" ? 2600 : 1200;

    if (isStrictAnonTier && payloadSize(parsedPayload.data) > anonPayloadLimit) {
      return NextResponse.json(
        {
          ok: false,
          error: `Anonym forespørsel er for stor (maks ${anonPayloadLimit} tegn).`,
          usage: {
            mode: subject.mode,
            used: 0,
            remaining: limit,
            limit,
            status: "ok",
          },
        },
        { status: 400 }
      );
    }

    const rateLimit = consumeRateLimit(subject);

    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        {
          ok: false,
          error: "For mange forespørsler. Vent litt før neste kjøring.",
          usage: toUsage(subject.mode, limit, "limited"),
        },
        { status: 429 }
      );

      response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
      return response;
    }

    const quota = await tryConsumeDailyQuota(
      subject,
      bucket,
      req.cookies.get(QUOTA_FALLBACK_COOKIE_NAME)?.value
    );

    if (!quota.allowed) {
      const response = NextResponse.json(
        {
          ok: false,
          error:
            limit === 0
              ? "Denne øvelsen krever innlogging i gratis tier."
              : quota.usage.status === "degraded"
                ? "Midlertidig begrenset modus aktiv. Daglig kvote er brukt opp."
                : "Daglig kvote er brukt opp. Prøv igjen etter midnatt UTC.",
          usage: quota.usage,
          provider: {
            name: "mock",
            model: "quota-block",
            cached: false,
          },
        },
        { status: 429 }
      );

      if (quota.fallbackCookieValue) {
        response.cookies.set({
          name: QUOTA_FALLBACK_COOKIE_NAME,
          value: quota.fallbackCookieValue,
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 48,
        });
      }

      return response;
    }

    let taskResult: unknown;
    let provider: { name: string; model: string; cached: boolean };

    if (task === "image_compare_generate") {
      const generated = await runImageCompareGenerate(parsedPayload.data as ImageComparePayload);
      taskResult = generated.result;
      provider = generated.provider;
    } else if (task === "video_compare_generate") {
      const generated = await runVideoCompareGenerate(parsedPayload.data as VideoComparePayload);
      taskResult = generated.result;
      provider = generated.provider;
    } else if (task === "campaign_chat") {
      setCampaignSkillCatalog(
        marketingSkills.map((skill) => ({
          slug: skill.slug,
          name: skill.name,
          title_no: skill.title_no,
          category: skill.category,
          description_en: skill.description_en.slice(0, 160),
        }))
      );
      const generated = await runCampaignChat(parsedPayload.data as CampaignChatPayload, {
        maxTokens: 4096,
      });
      taskResult = generated.result.data;
      provider = generated.provider;
    } else if (task === "prompt_assist") {
      const parsedAssist = parsedPayload.data as z.infer<typeof promptAssistPayloadSchema>;
      const candidateTerms = Array.from(new Set(parsedAssist.candidate_slugs))
        .map((slug) => glossaryBySlug[slug])
        .filter(Boolean)
        .slice(0, 12)
        .map((term) => ({
          slug: term.slug,
          term_no: term.term_no,
          definition_no: term.definition_no,
          promptImpact: term.promptImpact,
        }));

      if (candidateTerms.length === 0) {
        return NextResponse.json(
          {
            ok: false,
            error: "Fant ingen gyldige ordforråds-termer for prompt_assist.",
            usage: quota.usage,
          },
          { status: 400 }
        );
      }

      const assistPayload: PromptAssistPayload = {
        user_input: parsedAssist.user_input,
        output_type: parsedAssist.output_type,
        domain: parsedAssist.domain,
        draft_prompt: parsedAssist.draft_prompt,
        candidate_terms: candidateTerms,
      };

      const maxTokens = isStrictAnonTier ? 1000 : 1400;
      const generated = await runKiOpplaringTask("prompt_assist", assistPayload, {
        maxTokens,
      });
      taskResult = generated.result.data;
      provider = generated.provider;
    } else {
      if (task === "campaign_recommend") {
        setCampaignSkillCatalog(
          marketingSkills.map((skill) => ({
            slug: skill.slug,
            name: skill.name,
            title_no: skill.title_no,
            category: skill.category,
            description_en: skill.description_en.slice(0, 160),
          }))
        );
      }

      const maxTokens = isStrictAnonTier ? 700 : (task === "campaign_recommend" ? 1200 : 900);
      const generated = await runKiOpplaringTask(task as LlmTask, parsedPayload.data, {
        maxTokens,
      });
      taskResult = generated.result.data;
      provider = generated.provider;
    }

    const response = NextResponse.json({
      ok: true,
      task,
      result: taskResult,
      data: taskResult,
      usage: quota.usage,
      provider,
    });

    if (quota.fallbackCookieValue) {
      response.cookies.set({
        name: QUOTA_FALLBACK_COOKIE_NAME,
        value: quota.fallbackCookieValue,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 48,
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: taskErrorMessage(activeTask ?? "transform_prompt"),
        detail: error instanceof Error ? error.message : "Ukjent feil",
        usage: {
          mode: "anon",
          used: 0,
          remaining: 0,
          limit: 1,
          status: "degraded",
        },
      },
      { status: 500 }
    );
  }
}
