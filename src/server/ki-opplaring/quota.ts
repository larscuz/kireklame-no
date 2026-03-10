import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUserOrNull, isAdminUser } from "@/lib/supabase/server";

export type QuotaTier = "anon" | "workshop" | "user" | "admin";
export type QuotaMode = "anon" | "user";
export type QuotaBucket = "llm_text" | "media_image" | "media_video";
type LimitedQuotaTier = Exclude<QuotaTier, "admin">;

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
  tier: QuotaTier;
  isUnlimited: boolean;
  rateWindowSeconds: number;
  rateBurst: number;
};

export type QuotaResult = {
  allowed: boolean;
  usage: QuotaUsage;
  fallbackCookieValue?: string;
};

export const QUOTA_FALLBACK_COOKIE_NAME = "kir_quota_fb_v1";
export const WORKSHOP_PASS_COOKIE_NAME = "kir_workshop_pass_v1";

const QUOTA_FEATURE_FLAG = "QUOTA_ENABLED";
const QUOTA_DEV_FEATURE_FLAG = "QUOTA_ENABLED_IN_DEV";
const UNLIMITED_USAGE_LIMIT = 999_999;
const DEFAULT_WORKSHOP_PASS_TTL_HOURS = 24;
const WORKSHOP_PASS_MIN_TTL_SECONDS = 60;
const WORKSHOP_PASS_MAX_TTL_SECONDS = 60 * 60 * 24 * 30;

const DEFAULT_LIMITS: Record<QuotaBucket, Record<QuotaMode, number>> = {
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

const DEFAULT_WORKSHOP_LIMITS: Record<QuotaBucket, number> = {
  llm_text: 50,
  media_image: 8,
  media_video: 2,
};

const DEFAULT_DEGRADE_LIMITS: Record<QuotaBucket, Record<LimitedQuotaTier, number>> = {
  llm_text: {
    anon: 1,
    workshop: 8,
    user: 3,
  },
  media_image: {
    anon: 1,
    workshop: 2,
    user: 1,
  },
  media_video: {
    anon: 0,
    workshop: 1,
    user: 1,
  },
};

const ANON_RATE_WINDOW_SECONDS = 20;
const USER_RATE_WINDOW_SECONDS = 8;
const WORKSHOP_RATE_WINDOW_SECONDS = 8;
const ANON_RATE_BURST = 2;
const USER_RATE_BURST = 4;
const WORKSHOP_RATE_BURST = 5;

type RateBucket = {
  tokens: number;
  ts: number;
};

type RateStore = Map<string, RateBucket>;

type DegradeCookiePayload = {
  d: string;
  m: QuotaMode;
  t?: LimitedQuotaTier;
  b: QuotaBucket;
  s: string;
  c: number;
};

type WorkshopPassPayload = {
  v: 1;
  id: string;
  exp: number;
};

export type WorkshopPassStatus = {
  id: string;
  expiresAtEpochSeconds: number;
};

export type WorkshopPassIssue = {
  cookieValue: string;
  expiresAtEpochSeconds: number;
  maxAgeSeconds: number;
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

function intFromEnv(name: string, fallback: number, min = 0, max = Number.MAX_SAFE_INTEGER): number {
  const raw = toText(process.env[name]);
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  const truncated = Math.trunc(parsed);
  return Math.max(min, Math.min(max, truncated));
}

function splitCsv(raw: string | undefined): string[] {
  return toText(raw)
    .split(/[,;\n]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toEnvBucket(bucket: QuotaBucket): string {
  if (bucket === "llm_text") return "LLM_TEXT";
  if (bucket === "media_image") return "MEDIA_IMAGE";
  return "MEDIA_VIDEO";
}

function safeEqual(left: string, right: string): boolean {
  try {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    if (leftBuffer.length !== rightBuffer.length) return false;
    return crypto.timingSafeEqual(leftBuffer, rightBuffer);
  } catch {
    return false;
  }
}

function nonAdminTierForMode(mode: QuotaMode): LimitedQuotaTier {
  return mode === "user" ? "user" : "anon";
}

export function quotaEnabled(): boolean {
  if (process.env.NODE_ENV === "development") {
    return boolFromEnv(process.env[QUOTA_DEV_FEATURE_FLAG], false);
  }
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
    (parsed.t !== undefined && parsed.t !== "anon" && parsed.t !== "workshop" && parsed.t !== "user") ||
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
    t: parsed.t,
    b: parsed.b,
    s: parsed.s,
    c: Math.max(0, Math.floor(parsed.c)),
  };
}

function encodeWorkshopPass(payload: WorkshopPassPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encoded}.${signPayload(encoded)}`;
}

function decodeWorkshopPass(raw: string | undefined): WorkshopPassPayload | null {
  const value = toText(raw);
  if (!value) return null;

  const splitIndex = value.lastIndexOf(".");
  if (splitIndex < 1) return null;

  const encoded = value.slice(0, splitIndex);
  const signature = value.slice(splitIndex + 1);
  const expected = signPayload(encoded);

  if (!safeEqual(signature, expected)) return null;

  const parsed = safeJsonParse<WorkshopPassPayload>(Buffer.from(encoded, "base64url").toString("utf8"));
  if (!parsed) return null;

  if (
    parsed.v !== 1 ||
    typeof parsed.id !== "string" ||
    parsed.id.length < 8 ||
    parsed.id.length > 80 ||
    typeof parsed.exp !== "number" ||
    !Number.isFinite(parsed.exp)
  ) {
    return null;
  }

  const exp = Math.max(0, Math.floor(parsed.exp));
  const nowEpoch = Math.floor(Date.now() / 1000);
  if (exp <= nowEpoch) return null;

  return {
    v: 1,
    id: parsed.id,
    exp,
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
  const envKey = `QUOTA_${mode.toUpperCase()}_${toEnvBucket(bucket)}_LIMIT`;
  return intFromEnv(envKey, DEFAULT_LIMITS[bucket][mode], 0);
}

function workshopLimit(bucket: QuotaBucket): number {
  const envKey = `QUOTA_WORKSHOP_${toEnvBucket(bucket)}_LIMIT`;
  return intFromEnv(envKey, DEFAULT_WORKSHOP_LIMITS[bucket], 0);
}

export function quotaLimitForSubject(subject: QuotaSubject, bucket: QuotaBucket): number {
  if (subject.isUnlimited) {
    return UNLIMITED_USAGE_LIMIT;
  }

  if (subject.tier === "workshop") {
    return workshopLimit(bucket);
  }

  return quotaLimit(subject.mode, bucket);
}

function degradeLimitForTier(tier: LimitedQuotaTier, bucket: QuotaBucket): number {
  const envKey = `QUOTA_DEGRADE_${tier.toUpperCase()}_${toEnvBucket(bucket)}_LIMIT`;
  return intFromEnv(envKey, DEFAULT_DEGRADE_LIMITS[bucket][tier], 0);
}

function degradeLimit(subject: QuotaSubject, bucket: QuotaBucket): number {
  if (subject.isUnlimited) return UNLIMITED_USAGE_LIMIT;
  const tier = subject.tier === "admin" ? nonAdminTierForMode(subject.mode) : subject.tier;
  return degradeLimitForTier(tier, bucket);
}

function workshopPassTtlSeconds(): number {
  const ttlHours = intFromEnv("QUOTA_WORKSHOP_PASS_TTL_HOURS", DEFAULT_WORKSHOP_PASS_TTL_HOURS, 1, 24 * 30);
  return ttlHours * 60 * 60;
}

function workshopCodeList(): string[] {
  const single = splitCsv(process.env.QUOTA_WORKSHOP_CODE);
  const many = splitCsv(process.env.QUOTA_WORKSHOP_CODES);
  return Array.from(new Set([...single, ...many]));
}

export function workshopCodesConfigured(): boolean {
  return workshopCodeList().length > 0;
}

export function workshopCodeIsValid(rawCode: string): boolean {
  const candidate = toText(rawCode);
  if (!candidate) return false;

  const codes = workshopCodeList();
  if (codes.length === 0) return false;

  return codes.some((code) => safeEqual(code, candidate));
}

export function issueWorkshopPass(ttlSeconds: number = workshopPassTtlSeconds()): WorkshopPassIssue {
  const safeTtl = Math.max(
    WORKSHOP_PASS_MIN_TTL_SECONDS,
    Math.min(WORKSHOP_PASS_MAX_TTL_SECONDS, Math.trunc(ttlSeconds))
  );
  const expiresAtEpochSeconds = Math.floor(Date.now() / 1000) + safeTtl;
  const payload: WorkshopPassPayload = {
    v: 1,
    id: crypto.randomUUID().replace(/-/g, ""),
    exp: expiresAtEpochSeconds,
  };

  return {
    cookieValue: encodeWorkshopPass(payload),
    expiresAtEpochSeconds,
    maxAgeSeconds: safeTtl,
  };
}

export function readWorkshopPassFromRequest(req: NextRequest): WorkshopPassStatus | null {
  const workshopPass = decodeWorkshopPass(req.cookies.get(WORKSHOP_PASS_COOKIE_NAME)?.value);
  if (!workshopPass) return null;
  return {
    id: workshopPass.id,
    expiresAtEpochSeconds: workshopPass.exp,
  };
}

export async function resolveQuotaSubject(req: NextRequest): Promise<QuotaSubject> {
  const user = await getUserOrNull().catch(() => null);

  if (user?.id) {
    const isAdmin = isAdminUser(user.email);
    return {
      type: "user",
      id: user.id,
      mode: "user",
      tier: isAdmin ? "admin" : "user",
      isUnlimited: isAdmin,
      rateWindowSeconds: USER_RATE_WINDOW_SECONDS,
      rateBurst: isAdmin ? Math.max(USER_RATE_BURST, 20) : USER_RATE_BURST,
    };
  }

  const ip = getRequestIp(req);
  const ua = toText(req.headers.get("user-agent")) || "unknown-agent";
  const anonId = sha256(`${ip}|${ua}|${getSubjectSalt()}`).slice(0, 48);
  const workshopPass = readWorkshopPassFromRequest(req);

  if (workshopPass) {
    return {
      type: "anon",
      id: sha256(`${workshopPass.id}|${anonId}|${getSubjectSalt()}`).slice(0, 48),
      mode: "anon",
      tier: "workshop",
      isUnlimited: false,
      rateWindowSeconds: intFromEnv("QUOTA_WORKSHOP_RATE_WINDOW_SECONDS", WORKSHOP_RATE_WINDOW_SECONDS, 1, 120),
      rateBurst: intFromEnv("QUOTA_WORKSHOP_RATE_BURST", WORKSHOP_RATE_BURST, 1, 50),
    };
  }

  return {
    type: "anon",
    id: anonId,
    mode: "anon",
    tier: "anon",
    isUnlimited: false,
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
  const limit = degradeLimit(subject, bucket);

  if (limit <= 0) {
    return {
      allowed: false,
      usage: limitedUsage(subject.mode, 0, "degraded"),
    };
  }

  const day = utcDayString();
  const token = degradeSubjectToken(subject, bucket);

  const parsed = decodeDegradeCookie(rawCookie);
  const parsedTier = parsed?.t ?? nonAdminTierForMode(parsed?.m ?? "anon");
  const baseCount =
    parsed &&
    parsed.d === day &&
    parsed.m === subject.mode &&
    parsedTier === (subject.tier === "admin" ? nonAdminTierForMode(subject.mode) : subject.tier) &&
    parsed.b === bucket &&
    parsed.s === token
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
    t: subject.tier === "admin" ? nonAdminTierForMode(subject.mode) : subject.tier,
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
  if (subject.isUnlimited) {
    return {
      allowed: true,
      retryAfterSeconds: 0,
    };
  }

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
  const limit = quotaLimitForSubject(subject, bucket);

  if (subject.isUnlimited) {
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
