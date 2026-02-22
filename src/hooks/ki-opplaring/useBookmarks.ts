"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorageJson, subscribeStorage, writeStorageJson } from "./storage";

export type KiBookmarks = Record<string, boolean>;

const BOOKMARKS_KEY = "kir_bookmarks_v1";
const BOOKMARKS_EVENT = "kir-bookmarks-update";

function readBookmarks(): KiBookmarks {
  const parsed = readStorageJson<unknown>(BOOKMARKS_KEY, {});
  if (!parsed || typeof parsed !== "object") return {};

  const out: KiBookmarks = {};
  for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
    if (value === true) {
      out[key] = true;
    }
  }

  return out;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<KiBookmarks>({});

  useEffect(() => {
    setBookmarks(readBookmarks());

    return subscribeStorage(BOOKMARKS_KEY, BOOKMARKS_EVENT, () => {
      setBookmarks(readBookmarks());
    });
  }, []);

  const persist = useCallback((next: KiBookmarks) => {
    writeStorageJson(BOOKMARKS_KEY, next, BOOKMARKS_EVENT);
    setBookmarks(next);
  }, []);

  const setBookmarked = useCallback(
    (entryKey: string, enabled: boolean) => {
      const base = readBookmarks();
      const normalizedKey = String(entryKey ?? "").trim();
      if (!normalizedKey) return;

      const next = { ...base };
      if (enabled) {
        next[normalizedKey] = true;
      } else {
        delete next[normalizedKey];
      }
      persist(next);
    },
    [persist]
  );

  const toggleBookmark = useCallback(
    (entryKey: string) => {
      const normalizedKey = String(entryKey ?? "").trim();
      if (!normalizedKey) return;
      const base = readBookmarks();
      setBookmarked(normalizedKey, !base[normalizedKey]);
    },
    [setBookmarked]
  );

  const isBookmarked = useCallback(
    (entryKey: string) => {
      const normalizedKey = String(entryKey ?? "").trim();
      return Boolean(bookmarks[normalizedKey]);
    },
    [bookmarks]
  );

  return {
    bookmarks,
    bookmarkCount: Object.keys(bookmarks).length,
    setBookmarked,
    toggleBookmark,
    isBookmarked,
  };
}
