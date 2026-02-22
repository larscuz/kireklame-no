"use client";

import { useBookmarks } from "@/hooks/ki-opplaring/useBookmarks";

type Props = {
  entryKey: string;
  compact?: boolean;
};

export default function BookmarkButton({ entryKey, compact = false }: Props) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(entryKey);

  return (
    <button
      type="button"
      onClick={() => toggleBookmark(entryKey)}
      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] transition ${
        bookmarked
          ? "border-amber-400/60 bg-amber-400/20 text-amber-100"
          : "border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:bg-black/5 dark:hover:bg-white/5"
      }`}
      aria-pressed={bookmarked}
      title={bookmarked ? "Fjern fra din liste" : "Lagre i din liste"}
    >
      {compact ? (bookmarked ? "Lagret" : "Lagre") : bookmarked ? "Fjern" : "Lagre"}
    </button>
  );
}
