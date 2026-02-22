import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUserOrNull } from "@/lib/supabase/server";

export type QuotaMode = "anon" | "user";
export type QuotaBucket = "llm_text" | "media_image" | "media_video";

export type QuotaUsage = {
  remaining: number;
  used: number;
  limit: number;
  mode: QuotaMode;
  status: "ok" | "limited" | "degraded";
};

export type QuotaSubject = {
  type: QuotaMode;
  id: string;
  mode: QuotaMode;
  rateWindowSeconds: number;
  rateBurst: number;
};

export type QuotaResult = {
  allowed: boolean;
  usage: QuotaUsage;
  fallbackCookieValue?: string;
};

export const QUOTA_FALLBACK_COOKIE_NAME = "kir_quota_fb_v1";

const QUOTA_FEATURE_FLAG = "QUOTA_ENABLED";
const QUOTA_LIMITS: Record<QuotaBucket, Record<QuotaMode, number>> = {
  llm_text: {
    anon: 3,
    user: 20,
  },
  media_image: {
    anon: 1,
    user: 3,
  },
  media_video: {
    anon: 0,
    user: 1,
  },
};

const DEGRADE_LIMITS: Record<QuotaBucket, Record<QuotaMode, number>> = {
  llm_text: {
    anon: 1,
    user: 3,
  },
  media_image: {
    anon: 1,
    user: 1,
  },
  media_video: {
    anon: 0,
    user: 1,
  },
};

const ANON_RATE_WINDOW_SECONDS = 20;
const USER_RATE_WINDOW_SECONDS = 8;
const ANON_RATE_BURST = 2;
const USER_RATE_BURST = 4;

type RateBucket = {
  tokens: number;
  ts: number;
};

type RateStore = Map<string, RateBucket>;

type DegradeCookiePayload = {
  d: string;
  m: QuotaMode;
  b: QuotaBucket;
  s: string;
  c: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __kir_quota_rate_store__: RateStore | undefined;
}

function getRateStore(): RateStore {
  if (!globalThis.__kir_quota_rate_store__) {
    globalThis.__kir_quota_rate_store__ = new Map<string, RateBucket>();
  }

  return globalThis.__kir_quota_rate_store__;
}

function toText(value: unknown): string {
  return String(value ?? "").trim();
}

function boolFromEnv(value: string | undefined, fallback = false): boolean {
  const normalized = toText(value).toLowerCase();
  if (!normalized) return fallback;
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

export function quotaEnabled(): boolean {
  return boolFromEnv(process.env[QUOTA_FEATURE_FLAG], false);
}

function utcDayString(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function getHmacSecret(): string {
  return process.env.QUOTA_HMAC_SECRET?.trim() || "dev-quota-secret";
}

function signPayload(payload: string): string {
  return crypto.createHmac("sha256", getHmacSecret()).update(payload).digest("base64url");
}

function encodeDegradeCookie(payload: DegradeCookiePayload): string {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encoded}.${signPayload(encoded)}`;
}

function decodeDegradeCookie(raw: string | undefined): DegradeCookiePayload | null {
  const value = toText(raw);
  if (!value) return null;

  const splitIndex = value.lastIndexOf(".");
  if (splitIndex < 1) return null;

  const encoded = value.slice(0, splitIndex);
  const signature = value.slice(splitIndex + 1);
  const expected = signPayload(encoded);

  try {
    const sigBuffer = Buffer.from(signature);
    const expBuffer = Buffer.from(expected);
    if (sigBuffer.length !== expBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expBuffer)) return null;
  } catch {
    return null;
  }

  const parsed = safeJsonParse<DegradeCookiePayload>(Buffer.from(encoded, "base64url").toString("utf8"));
  if (!parsed) return null;

  if (
    typeof parsed.d !== "string" ||
    (parsed.m !== "anon" && parsed.m !== "user") ||
    (parsed.b !== "llm_text" && parsed.b !== "media_image" && parsed.b !== "media_video") ||
    typeof parsed.s !== "string" ||
    typeof parsed.c !== "number" ||
    !Number.isFinite(parsed.c)
  ) {
    return null;
  }

  return {
    d: parsed.d,
    m: parsed.m,
    b: parsed.b,
    s: parsed.s,
    c: Math.max(0, Math.floor(parsed.c)),
  };
}

function getRequestIp(req: NextRequest): string {
  const xff = toText(req.headers.get("x-forwarded-for"));
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = toText(req.headers.get("x-real-ip"));
  if (realIp) return realIp;

  return "0.0.0.0";
}

function getSubjectSalt(): string {
  return process.env.QUOTA_SUBJECT_SALT?.trim() || getHmacSecret();
}

export function quotaLimit(mode: QuotaMode, bucket: QuotaBucket): number {
  return QUOTA_LIMITS[bucket][mode];
}

function degradeLimit(mode: QuotaMode, bucket: QuotaBucket): number {
  return DEGRADE_LIMITS[bucket][mode];
}

export async function resolveQuotaSubject(req: NextRequest): Promise<QuotaSubject> {
  const user = await getUserOrNull().catch(() => null);

  if (user?.id) {
    return {
      type: "user",
      id: user.id,
      mode: "user",
      rateWindowSeconds: USER_RATE_WINDOW_SECONDS,
      rateBurst: USER_RATE_BURST,
    };
  }

  const ip = getRequestIp(req);
  const ua = toText(req.headers.get("user-agent")) || "unknown-agent";
  const anonId = sha256(`${ip}|${ua}|${getSubjectSalt()}`).slice(0, 48);

  return {
    type: "anon",
    id: anonId,
    mode: "anon",
    rateWindowSeconds: ANON_RATE_WINDOW_SECONDS,
    rateBurst: ANON_RATE_BURST,
  };
}

function degradeSubjectToken(subject: QuotaSubject, bucket: QuotaBucket): string {
  return sha256(`${subject.type}:${subject.id}:${bucket}`).slice(0, 20);
}

function limitedUsage(mode: QuotaMode, limit: number, status: QuotaUsage["status"]): QuotaUsage {
  return {
    mode,
    used: Math.max(0, limit),
    limit: Math.max(0, limit),
    remaining: 0,
    status,
  };
}

function consumeDegradedQuota(subject: QuotaSubject, bucket: QuotaBucket, rawCookie: string | undefined): QuotaResult {
  const limit = degradeLimit(subject.mode, bucket);

  if (limit <= 0) {
    return {
      allowed: false,
      usage: limitedUsage(subject.mode, 0, "degraded"),
    };
  }

  const day = utcDayString();
  const token = degradeSubjectToken(subject, bucket);

  const parsed = decodeDegradeCookie(rawCookie);
  const baseCount =
    parsed && parsed.d === day && parsed.m === subject.mode && parsed.b === bucket && parsed.s === token
      ? parsed.c
      : 0;

  if (baseCount >= limit) {
    return {
      allowed: false,
      usage: {
        mode: subject.mode,
        used: baseCount,
        limit,
        remaining: 0,
        status: "degraded",
      },
    };
  }

  const used = baseCount + 1;
  const payload: DegradeCookiePayload = {
    d: day,
    m: subject.mode,
    b: bucket,
    s: token,
    c: used,
  };

  return {
    allowed: true,
    usage: {
      mode: subject.mode,
      used,
      limit,
      remaining: Math.max(limit - used, 0),
      status: "degraded",
    },
    fallbackCookieValue: encodeDegradeCookie(payload),
  };
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Quota RPC timeout"));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export function consumeRateLimit(subject: QuotaSubject): { allowed: boolean; retryAfterSeconds: number } {
  const store = getRateStore();
  const key = `${subject.type}:${subject.id}`;
  const now = Date.now();
  const ratePerMs = 1 / (subject.rateWindowSeconds * 1000);

  const current = store.get(key) ?? {
    tokens: subject.rateBurst,
    ts: now,
  };

  const elapsed = Math.max(0, now - current.ts);
  const refilled = Math.min(subject.rateBurst, current.tokens + elapsed * ratePerMs);

  if (refilled >= 1) {
    store.set(key, {
      tokens: refilled - 1,
      ts: now,
    });

    return {
      allowed: true,
      retryAfterSeconds: 0,
    };
  }

  store.set(key, {
    tokens: refilled,
    ts: now,
  });

  const waitMs = Math.ceil((1 - refilled) / ratePerMs);

  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil(waitMs / 1000)),
  };
}

function supportsSupabaseQuota(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function tryConsumeDailyQuota(
  subject: QuotaSubject,
  bucket: QuotaBucket,
  rawDegradeCookie: string | undefined
): Promise<QuotaResult> {
  const limit = quotaLimit(subject.mode, bucket);

  if (limit <= 0) {
    return {
      allowed: false,
      usage: limitedUsage(subject.mode, 0, "limited"),
    };
  }

  if (!quotaEnabled()) {
    return {
      allowed: true,
      usage: {
        mode: subject.mode,
        used: 0,
        limit,
        remaining: limit,
        status: "ok",
      },
    };
  }

  if (!supportsSupabaseQuota()) {
    return consumeDegradedQuota(subject, bucket, rawDegradeCookie);
  }

  try {
    const db = supabaseAdmin();
    const rpcResult = (await withTimeout(
      Promise.resolve(
        db.rpc("ki_try_consume_quota", {
          p_subject_type: subject.type,
          p_subject_id: subject.id,
          p_limit: limit,
          p_bucket: bucket,
        })
      ),
      2500
    )) as {
      data:
        | Array<{ allowed?: boolean; used?: number; quota_limit?: number; remaining?: number }>
        | { allowed?: boolean; used?: number; quota_limit?: number; remaining?: number }
        | null;
      error?: { message?: string } | null;
    };

    if (rpcResult.error) {
      return consumeDegradedQuota(subject, bucket, rawDegradeCookie);
    }

    const row = Array.isArray(rpcResult.data) ? rpcResult.data[0] : rpcResult.data;

    const allowed = row?.allowed === true;
    const used = Number(row?.used ?? 0);
    const resolvedLimit = Number(row?.quota_limit ?? limit);
    const remaining = Number(row?.remaining ?? Math.max(resolvedLimit - used, 0));

    return {
      allowed,
      usage: {
        mode: subject.mode,
        used: Math.max(0, used),
        limit: Math.max(0, resolvedLimit),
        remaining: Math.max(0, remaining),
        status: allowed ? "ok" : "limited",
      },
    };
  } catch {
    return consumeDegradedQuota(subject, bucket, rawDegradeCookie);
  }
}
