"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorageJson, subscribeStorage, writeStorageJson } from "./storage";

const USAGE_KEY = "kir_usage_v1";
const USAGE_EVENT = "kir-usage-update";

export type KiUsageMode = "anon" | "user";
export type KiUsageStatus = "ok" | "limited" | "degraded";

export type KiUsageSnapshot = {
  remaining: number;
  used: number;
  limit: number;
  mode: KiUsageMode;
  status: KiUsageStatus;
  updatedAt: number;
};

const DEFAULT_USAGE: KiUsageSnapshot = {
  remaining: 3,
  used: 0,
  limit: 3,
  mode: "anon",
  status: "ok",
  updatedAt: 0,
};

function toMode(value: unknown): KiUsageMode {
  return value === "user" ? "user" : "anon";
}

function toStatus(value: unknown): KiUsageStatus {
  if (value === "limited") return "limited";
  if (value === "degraded") return "degraded";
  return "ok";
}

function toPositiveNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.trunc(parsed));
}

function normalizeUsage(raw: unknown): KiUsageSnapshot {
  if (!raw || typeof raw !== "object") return DEFAULT_USAGE;

  const candidate = raw as Partial<KiUsageSnapshot>;
  const limit = toPositiveNumber(candidate.limit, 3) || 1;
  const used = Math.min(toPositiveNumber(candidate.used, 0), limit);
  const remaining = Math.min(toPositiveNumber(candidate.remaining, Math.max(limit - used, 0)), limit);

  return {
    mode: toMode(candidate.mode),
    status: toStatus(candidate.status),
    limit,
    used,
    remaining,
    updatedAt: toPositiveNumber(candidate.updatedAt, Date.now()),
  };
}

export function readUsageSnapshot(): KiUsageSnapshot {
  return normalizeUsage(readStorageJson<unknown>(USAGE_KEY, DEFAULT_USAGE));
}

export function persistUsageSnapshot(usage: Omit<KiUsageSnapshot, "updatedAt">): KiUsageSnapshot {
  const next = normalizeUsage({
    ...usage,
    updatedAt: Date.now(),
  });

  writeStorageJson(USAGE_KEY, next, USAGE_EVENT);
  return next;
}

export function useUsage() {
  const [usage, setUsage] = useState<KiUsageSnapshot>(DEFAULT_USAGE);

  useEffect(() => {
    setUsage(readUsageSnapshot());

    return subscribeStorage(USAGE_KEY, USAGE_EVENT, () => {
      setUsage(readUsageSnapshot());
    });
  }, []);

  const saveUsage = useCallback((next: Omit<KiUsageSnapshot, "updatedAt">) => {
    const normalized = persistUsageSnapshot(next);
    setUsage(normalized);
  }, []);

  return {
    usage,
    saveUsage,
  };
}
