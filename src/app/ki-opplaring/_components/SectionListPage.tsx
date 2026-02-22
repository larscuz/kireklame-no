import Link from "next/link";
import type { KiOpplaringEntry } from "@/lib/ki-opplaring/content";
import EntryCard from "./EntryCard";

type Props = {
  title: string;
  description: string;
  sectionHref: string;
  entries: KiOpplaringEntry[];
  emptyText: string;
};

export default function SectionListPage({ title, description, sectionHref, entries, emptyText }: Props) {
  return (
    <main className="bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      <section className="border-b border-[rgb(var(--border))] bg-gradient-to-br from-black/10 via-transparent to-black/5 dark:from-white/5 dark:to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="text-xs font-medium text-[rgb(var(--muted))]">
            <Link href="/ki-opplaring" className="hover:underline">
              KI Opplæring
            </Link>
            <span className="mx-2">/</span>
            <span>{title}</span>
          </div>
          <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight">{title}</h1>
          <p className="mt-3 max-w-3xl text-lg text-[rgb(var(--muted))]">{description}</p>
          <p className="mt-3 text-sm text-[rgb(var(--muted))]">
            {entries.length} publiserte {title.toLowerCase()} ·
            <Link href={sectionHref} className="ml-1 underline underline-offset-4">
              oppdaterbar evergreen-struktur
            </Link>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 lg:py-12">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 text-sm text-[rgb(var(--muted))]">
            {emptyText}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => (
              <EntryCard key={`${entry.type}-${entry.slug}`} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
