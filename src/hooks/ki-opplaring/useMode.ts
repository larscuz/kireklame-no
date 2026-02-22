"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorageJson, subscribeStorage, writeStorageJson } from "./storage";

export type KiMode = "student" | "agency";

const MODE_KEY = "kir_mode_v1";
const MODE_EVENT = "kir-mode-update";
const DEFAULT_MODE: KiMode = "student";

function normalizeMode(raw: unknown): KiMode {
  return raw === "agency" ? "agency" : "student";
}

export function useMode() {
  const [mode, setModeState] = useState<KiMode>(DEFAULT_MODE);

  useEffect(() => {
    const initial = normalizeMode(readStorageJson<unknown>(MODE_KEY, DEFAULT_MODE));
    setModeState(initial);

    return subscribeStorage(MODE_KEY, MODE_EVENT, () => {
      setModeState(normalizeMode(readStorageJson<unknown>(MODE_KEY, DEFAULT_MODE)));
    });
  }, []);

  const setMode = useCallback((nextMode: KiMode) => {
    writeStorageJson(MODE_KEY, nextMode, MODE_EVENT);
    setModeState(nextMode);
  }, []);

  return {
    mode,
    setMode,
    isStudent: mode === "student",
    isAgency: mode === "agency",
  };
}
