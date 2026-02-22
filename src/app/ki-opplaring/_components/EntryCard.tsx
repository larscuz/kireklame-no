import Link from "next/link";
import type { KiOpplaringEntry } from "@/lib/ki-opplaring/content";
import { kiOpplaringTypeLabel } from "@/lib/ki-opplaring/content";
import { toEntryKey } from "@/lib/ki-opplaring/keys";
import BookmarkButton from "./BookmarkButton";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("nb-NO", { dateStyle: "medium" });
}

function topicSummary(topics: string[]): string {
  if (!topics.length) return "Uten tema";
  if (topics.length === 1) return topics[0];
  return `${topics[0]} +${topics.length - 1}`;
}

export default function EntryCard({ entry }: { entry: KiOpplaringEntry }) {
  const entryKey = toEntryKey(entry.type, entry.slug);

  return (
    <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-soft transition hover:shadow-lift">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
        {kiOpplaringTypeLabel(entry.type)} · {entry.level}
      </p>
      <h3 className="mt-2 text-xl font-semibold leading-tight">
        <Link href={entry.url} className="hover:opacity-80">
          {entry.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">{entry.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[rgb(var(--muted))]">
        <span className="rounded-full border border-[rgb(var(--border))] px-2 py-1">{topicSummary(entry.topics)}</span>
        <span className="rounded-full border border-[rgb(var(--border))] px-2 py-1">Oppdatert {formatDate(entry.updatedAt)}</span>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <BookmarkButton entryKey={entryKey} compact />
      </div>
    </article>
  );
}
