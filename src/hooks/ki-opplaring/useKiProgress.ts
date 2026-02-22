"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { parseEntryKey, toEntryKey, type KiEntryTypeInput } from "@/lib/ki-opplaring/keys";
import { readStorageJson, subscribeStorage, writeStorageJson } from "./storage";

const PROGRESS_KEY = "kir_progress_v1";
const PROGRESS_EVENT = "kir-progress-update";

export type KiLastVisited = {
  type: string;
  slug: string;
  ts: number;
};

export type KiProgressState = {
  lastVisited: KiLastVisited | null;
  completed: Record<string, boolean>;
  inProgress: Record<string, { notes?: string; ts: number }>;
  checklists: Record<string, Record<string, boolean>>;
  exercises: Record<string, { value: string; ts: number }>;
};

const DEFAULT_PROGRESS: KiProgressState = {
  lastVisited: null,
  completed: {},
  inProgress: {},
  checklists: {},
  exercises: {},
};

function normalizeProgress(raw: unknown): KiProgressState {
  if (!raw || typeof raw !== "object") return DEFAULT_PROGRESS;

  const candidate = raw as Partial<KiProgressState>;

  return {
    lastVisited:
      candidate.lastVisited &&
      typeof candidate.lastVisited === "object" &&
      typeof candidate.lastVisited.slug === "string" &&
      typeof candidate.lastVisited.type === "string"
        ? {
            type: candidate.lastVisited.type,
            slug: candidate.lastVisited.slug,
            ts: Number(candidate.lastVisited.ts ?? Date.now()),
          }
        : null,
    completed: Object.fromEntries(
      Object.entries(candidate.completed ?? {}).filter(([, value]) => value === true)
    ),
    inProgress: Object.fromEntries(
      Object.entries(candidate.inProgress ?? {}).map(([key, value]) => {
        const normalized = value && typeof value === "object" ? value : {};
        return [
          key,
          {
            notes: typeof (normalized as { notes?: unknown }).notes === "string" ? (normalized as { notes?: string }).notes : undefined,
            ts: Number((normalized as { ts?: unknown }).ts ?? Date.now()),
          },
        ];
      })
    ),
    checklists: Object.fromEntries(
      Object.entries(candidate.checklists ?? {}).map(([checklistId, items]) => {
        if (!items || typeof items !== "object") {
          return [checklistId, {} as Record<string, boolean>];
        }

        const normalizedItems: Record<string, boolean> = {};
        for (const [itemId, enabled] of Object.entries(items as Record<string, unknown>)) {
          if (enabled === true) {
            normalizedItems[itemId] = true;
          }
        }

        return [checklistId, normalizedItems];
      })
    ),
    exercises: Object.fromEntries(
      Object.entries(candidate.exercises ?? {}).map(([exerciseId, value]) => {
        const normalized = value && typeof value === "object" ? value : {};
        return [
          exerciseId,
          {
            value: typeof (normalized as { value?: unknown }).value === "string" ? (normalized as { value: string }).value : "",
            ts: Number((normalized as { ts?: unknown }).ts ?? Date.now()),
          },
        ];
      })
    ),
  };
}

function readProgress(): KiProgressState {
  return normalizeProgress(readStorageJson<unknown>(PROGRESS_KEY, DEFAULT_PROGRESS));
}

type ExerciseOptions = {
  guideKey?: string;
};

type ChecklistOptions = {
  guideKey?: string;
};

export function useKiProgress() {
  const [progress, setProgress] = useState<KiProgressState>(DEFAULT_PROGRESS);

  useEffect(() => {
    setProgress(readProgress());

    return subscribeStorage(PROGRESS_KEY, PROGRESS_EVENT, () => {
      setProgress(readProgress());
    });
  }, []);

  const persist = useCallback((next: KiProgressState) => {
    writeStorageJson(PROGRESS_KEY, next, PROGRESS_EVENT);
    setProgress(next);
  }, []);

  const setLastVisited = useCallback(
    (type: KiEntryTypeInput | string, slug: string) => {
      const base = readProgress();
      const entryKey = toEntryKey(type, slug);
      const parsed = parseEntryKey(entryKey);
      if (!parsed) return;

      persist({
        ...base,
        lastVisited: {
          type: parsed.type,
          slug: parsed.slug,
          ts: Date.now(),
        },
      });
    },
    [persist]
  );

  const markInProgress = useCallback(
    (entryKey: string, notes?: string) => {
      const base = readProgress();
      const normalizedKey = String(entryKey ?? "").trim();
      if (!normalizedKey) return;

      persist({
        ...base,
        inProgress: {
          ...base.inProgress,
          [normalizedKey]: {
            notes: notes?.trim() || base.inProgress[normalizedKey]?.notes,
            ts: Date.now(),
          },
        },
      });
    },
    [persist]
  );

  const markCompleted = useCallback(
    (entryKey: string, completed = true) => {
      const base = readProgress();
      const normalizedKey = String(entryKey ?? "").trim();
      if (!normalizedKey) return;

      const nextCompleted = { ...base.completed };
      const nextInProgress = { ...base.inProgress };

      if (completed) {
        nextCompleted[normalizedKey] = true;
        delete nextInProgress[normalizedKey];
      } else {
        delete nextCompleted[normalizedKey];
      }

      persist({
        ...base,
        completed: nextCompleted,
        inProgress: nextInProgress,
      });
    },
    [persist]
  );

  const saveExercise = useCallback(
    (exerciseId: string, value: string, options: ExerciseOptions = {}) => {
      const base = readProgress();
      const normalizedExerciseId = String(exerciseId ?? "").trim();
      if (!normalizedExerciseId) return;

      const ts = Date.now();
      const trimmedValue = String(value ?? "");
      const next: KiProgressState = {
        ...base,
        exercises: {
          ...base.exercises,
          [normalizedExerciseId]: {
            value: trimmedValue,
            ts,
          },
        },
      };

      if (options.guideKey) {
        next.inProgress = {
          ...next.inProgress,
          [options.guideKey]: {
            notes: trimmedValue.slice(0, 160),
            ts,
          },
        };

        const parsed = parseEntryKey(options.guideKey);
        if (parsed) {
          next.lastVisited = {
            type: parsed.type,
            slug: parsed.slug,
            ts,
          };
        }
      }

      persist(next);
    },
    [persist]
  );

  const setChecklistItem = useCallback(
    (checklistId: string, itemId: string, checked: boolean, options: ChecklistOptions = {}) => {
      const base = readProgress();
      const normalizedChecklistId = String(checklistId ?? "").trim();
      const normalizedItemId = String(itemId ?? "").trim();
      if (!normalizedChecklistId || !normalizedItemId) return;

      const currentChecklist = { ...(base.checklists[normalizedChecklistId] ?? {}) };
      if (checked) {
        currentChecklist[normalizedItemId] = true;
      } else {
        delete currentChecklist[normalizedItemId];
      }

      const ts = Date.now();
      const next: KiProgressState = {
        ...base,
        checklists: {
          ...base.checklists,
          [normalizedChecklistId]: currentChecklist,
        },
      };

      if (options.guideKey) {
        next.inProgress = {
          ...next.inProgress,
          [options.guideKey]: {
            notes: `Checklist oppdatert (${normalizedChecklistId})`,
            ts,
          },
        };

        const parsed = parseEntryKey(options.guideKey);
        if (parsed) {
          next.lastVisited = {
            type: parsed.type,
            slug: parsed.slug,
            ts,
          };
        }
      }

      persist(next);
    },
    [persist]
  );

  const resetChecklist = useCallback(
    (checklistId: string, options: ChecklistOptions = {}) => {
      const base = readProgress();
      const normalizedChecklistId = String(checklistId ?? "").trim();
      if (!normalizedChecklistId) return;

      const nextChecklists = { ...base.checklists };
      delete nextChecklists[normalizedChecklistId];

      const ts = Date.now();
      const next: KiProgressState = {
        ...base,
        checklists: nextChecklists,
      };

      if (options.guideKey) {
        next.inProgress = {
          ...next.inProgress,
          [options.guideKey]: {
            notes: `Checklist nullstilt (${normalizedChecklistId})`,
            ts,
          },
        };
      }

      persist(next);
    },
    [persist]
  );

  const isCompleted = useCallback(
    (entryKey: string) => {
      const normalizedKey = String(entryKey ?? "").trim();
      return Boolean(progress.completed[normalizedKey]);
    },
    [progress.completed]
  );

  const completedCount = useMemo(() => Object.keys(progress.completed).length, [progress.completed]);

  return {
    progress,
    completedCount,
    setLastVisited,
    markInProgress,
    markCompleted,
    saveExercise,
    setChecklistItem,
    resetChecklist,
    isCompleted,
  };
}
