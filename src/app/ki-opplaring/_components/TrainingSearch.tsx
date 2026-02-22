"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type KiOpplaringSearchItem = {
  title: string;
  description: string;
  url: string;
  type: "guider" | "tema" | "verktoy" | "ordliste";
  topics: string[];
  tools: string[];
  level: "beginner" | "intermediate" | "pro";
};

type Props = {
  index: KiOpplaringSearchItem[];
};

function kiOpplaringTypeLabel(type: KiOpplaringSearchItem["type"]): string {
  switch (type) {
    case "guider":
      return "Guide";
    case "tema":
      return "Tema";
    case "verktoy":
      return "Verktøy";
    case "ordliste":
      return "Ordliste";
    default:
      return "Innhold";
  }
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

export default function TrainingSearch({ index }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = normalize(query);
    const fallback = index.slice(0, 8);
    if (!needle) return fallback;

    return index
      .filter((item) => {
        const haystack = [item.title, item.description, item.level, item.type, ...item.topics, ...item.tools]
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      })
      .slice(0, 10);
  }, [query, index]);

  return (
    <section className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-soft sm:p-6">
      <label htmlFor="ki-opplaring-search" className="text-sm font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
        Søk i KI Opplæring
      </label>
      <input
        id="ki-opplaring-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Søk etter guide, verktøy eller begrep"
        className="mt-3 w-full rounded-2xl border border-[rgb(var(--border))] bg-transparent px-4 py-3 text-base outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/20 dark:focus:border-white/40 dark:focus:ring-white/20"
      />

      <ul className="mt-4 divide-y divide-[rgb(var(--border))] overflow-hidden rounded-2xl border border-[rgb(var(--border))]">
        {results.length === 0 ? (
          <li className="px-4 py-4 text-sm text-[rgb(var(--muted))]">
            Ingen treff. Prøv et bredere søk, for eksempel "prompting" eller "workflow".
          </li>
        ) : (
          results.map((item) => (
            <li key={`${item.type}-${item.url}`}>
              <Link href={item.url} className="block px-4 py-3 transition hover:bg-[rgb(var(--bg))]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
                  {kiOpplaringTypeLabel(item.type)} · {item.level}
                </p>
                <p className="mt-1 text-base font-semibold leading-tight">{item.title}</p>
                <p className="mt-1 text-sm text-[rgb(var(--muted))]">{item.description}</p>
              </Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
