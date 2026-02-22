"use client";

import { slugify } from "@/lib/slug";
import { useKiProgress } from "@/hooks/ki-opplaring/useKiProgress";

type Props = {
  id: string;
  title?: string;
  items: string[];
  guideKey?: string;
};

export default function Checklist({ id, title = "Sjekkliste", items, guideKey }: Props) {
  const { progress, setChecklistItem, resetChecklist } = useKiProgress();
  const checked = progress.checklists[id] ?? {};

  const checkedCount = items.reduce((sum, item, index) => {
    const itemId = `${slugify(item) || "item"}-${index + 1}`;
    return sum + (checked[itemId] ? 1 : 0);
  }, 0);

  return (
    <section className="my-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[rgb(var(--border))] px-2 py-0.5 text-xs text-[rgb(var(--muted))]">
            {checkedCount}/{items.length}
          </span>
          <button
            type="button"
            onClick={() => resetChecklist(id, { guideKey })}
            className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))] hover:bg-black/5 dark:hover:bg-white/5"
          >
            Nullstill
          </button>
        </div>
      </div>

      <ul className="mt-3 space-y-2">
        {items.map((item, index) => {
          const itemId = `${slugify(item) || "item"}-${index + 1}`;
          const enabled = Boolean(checked[itemId]);

          return (
            <li key={itemId}>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[rgb(var(--border))] px-3 py-2 transition hover:bg-black/5 dark:hover:bg-white/5">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(event) => setChecklistItem(id, itemId, event.target.checked, { guideKey })}
                  className="mt-0.5 h-4 w-4 accent-cyan-500"
                />
                <span className={`text-sm leading-relaxed ${enabled ? "text-[rgb(var(--muted))] line-through" : "text-[rgb(var(--fg))]/90"}`}>
                  {item}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
