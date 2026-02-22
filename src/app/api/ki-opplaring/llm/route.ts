import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  runKiOpplaringTask,
  type BuildScript10sPayload,
  type ExerciseComparePayload,
  type LlmTask,
  type TransformPromptPayload,
} from "@/lib/ki-opplaring/llm";
import {
  consumeRateLimit,
  QUOTA_FALLBACK_COOKIE_NAME,
  quotaLimit,
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
    const limit = quotaLimit(subject.mode, bucket);

    if (subject.mode === "anon" && payloadSize(parsedPayload.data) > 1200) {
      return NextResponse.json(
        {
          ok: false,
          error: "Anonym forespørsel er for stor (maks 1200 tegn).",
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
    } else {
      const maxTokens = subject.mode === "anon" ? 700 : 900;
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
