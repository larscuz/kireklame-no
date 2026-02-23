"use client";

import { useMemo, useState } from "react";

type SearchItem = {
  type: "ordforråd" | "mal" | "eksempel";
  title: string;
  description: string;
  href: string;
};

type Props = {
  items: SearchItem[];
  showResultsOnEmptyQuery?: boolean;
};

function compact(value: string): string {
  return value.toLowerCase().trim();
}

export default function SearchPanel({ items, showResultsOnEmptyQuery = true }: Props) {
  const [query, setQuery] = useState("");

  const needle = compact(query);
  const shouldShowResults = showResultsOnEmptyQuery || needle.length > 0;

  const filtered = useMemo(() => {
    if (!needle) return showResultsOnEmptyQuery ? items.slice(0, 8) : [];

    return items
      .filter((item) => `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(needle))
      .slice(0, 16);
  }, [items, needle, showResultsOnEmptyQuery]);

  return (
    <section className="np-template-card rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/92 p-4 shadow-[0_10px_35px_rgba(2,6,23,0.24)]">
      <label htmlFor="norsk-prompting-search" className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
        Søk i ordforråd, maler og eksempler
      </label>
      <input
        id="norsk-prompting-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Søk etter begrep, brukstilfelle eller eksempel"
        className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:border-cyan-400"
      />

      {shouldShowResults ? (
        <ul className="mt-3 space-y-2">
          {filtered.map((item) => (
            <li key={`${item.type}-${item.href}`}>
              <a
                href={item.href}
                className="block rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/72 px-3 py-2 transition hover:-translate-y-px hover:border-cyan-300/40 hover:bg-cyan-300/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/90">{item.type}</p>
                <p className="mt-1 text-sm font-semibold text-[rgb(var(--fg))]">{item.title}</p>
                <p className="mt-1 text-sm text-[rgb(var(--muted))]">{item.description}</p>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
