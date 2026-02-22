"use client";

import { useEffect } from "react";
import UsageMeter from "@/components/ki-opplaring/UsageMeter";
import { toEntryKey } from "@/lib/ki-opplaring/keys";
import { useKiProgress } from "@/hooks/ki-opplaring/useKiProgress";
import { useUsage } from "@/hooks/ki-opplaring/useUsage";
import BookmarkButton from "./BookmarkButton";

type Props = {
  type: "guider" | "tema" | "verktoy" | "ordliste";
  slug: string;
};

export default function GuideActionPanel({ type, slug }: Props) {
  const entryKey = toEntryKey(type, slug);
  const { isCompleted, markCompleted, setLastVisited } = useKiProgress();
  const { usage } = useUsage();
  const completed = isCompleted(entryKey);

  useEffect(() => {
    setLastVisited(type, slug);
  }, [setLastVisited, slug, type]);

  return (
    <div className="mt-5 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <BookmarkButton entryKey={entryKey} />
        <button
          type="button"
          onClick={() => markCompleted(entryKey, !completed)}
          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] transition ${
            completed
              ? "border-emerald-400/50 bg-emerald-400/20 text-emerald-100"
              : "border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:bg-black/5 dark:hover:bg-white/5"
          }`}
        >
          {completed ? "Fullført" : "Marker som fullført"}
        </button>
      </div>

      <UsageMeter
        remaining={usage.remaining}
        used={usage.used}
        limit={usage.limit}
        mode={usage.mode}
        status={usage.status}
        className="max-w-md border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--fg))]"
      />
    </div>
  );
}
