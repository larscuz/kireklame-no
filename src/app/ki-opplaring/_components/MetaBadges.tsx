import type { ReactNode } from "react";
import type { KiOpplaringEntry } from "@/lib/ki-opplaring/content";

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}

export default function MetaBadges({ entry }: { entry: KiOpplaringEntry }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Nivå: {entry.level}</Badge>
      <Badge>Målgruppe: {entry.audience.join(", ") || "Alle"}</Badge>
      <Badge>Verktøy: {entry.tools.join(", ") || "Uavhengig"}</Badge>
      <Badge>Lesetid: ca. {entry.readingTimeMinutes} min</Badge>
    </div>
  );
}
