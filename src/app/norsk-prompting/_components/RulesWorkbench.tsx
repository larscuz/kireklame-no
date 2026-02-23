"use client";

import { useMemo, useState } from "react";
import type { NorskPromptingGovernanceRule, NorskPromptingRule, RuleSeverity } from "@/data/norskPrompting/types";

const appliesLabel: Record<NorskPromptingRule["appliesTo"] | "all", string> = {
  all: "Alle",
  image: "Bilde",
  video: "Video",
  text: "Tekst",
};

const severityOptions: Array<{ value: RuleSeverity | "all"; label: string }> = [
  { value: "all", label: "Alle nivåer" },
  { value: 5, label: "5 (kritisk)" },
  { value: 4, label: "4+" },
  { value: 3, label: "3+" },
  { value: 2, label: "2+" },
  { value: 1, label: "1+" },
];

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

type Props = {
  rules: NorskPromptingRule[];
  governanceRules: NorskPromptingGovernanceRule[];
};

export default function RulesWorkbench({ rules, governanceRules }: Props) {
  const [view, setView] = useState<"operative" | "system">("operative");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [appliesTo, setAppliesTo] = useState<NorskPromptingRule["appliesTo"] | "all">("all");
  const [minSeverity, setMinSeverity] = useState<RuleSeverity | "all">("all");
  const [sortBy, setSortBy] = useState<"severity" | "alpha">("severity");

  const categories = useMemo(() => {
    return Array.from(new Set(rules.map((rule) => rule.category))).sort((a, b) => a.localeCompare(b, "nb-NO"));
  }, [rules]);

  const needle = normalize(query);

  const filteredRules = useMemo(() => {
    const list = rules.filter((rule) => {
      if (category !== "all" && rule.category !== category) return false;
      if (appliesTo !== "all" && rule.appliesTo !== appliesTo) return false;
      if (minSeverity !== "all" && rule.severity < minSeverity) return false;
      if (!needle) return true;

      return normalize(`${rule.name} ${rule.description} ${rule.id}`).includes(needle);
    });

    list.sort((a, b) => {
      if (sortBy === "alpha") return a.name.localeCompare(b.name, "nb-NO");
      if (b.severity !== a.severity) return b.severity - a.severity;
      return a.name.localeCompare(b.name, "nb-NO");
    });

    return list;
  }, [rules, category, appliesTo, minSeverity, needle, sortBy]);

  const grouped = useMemo(() => {
    const map = new Map<string, NorskPromptingRule[]>();
    for (const rule of filteredRules) {
      if (!map.has(rule.category)) map.set(rule.category, []);
      map.get(rule.category)?.push(rule);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], "nb-NO"));
  }, [filteredRules]);

  return (
    <div className="space-y-4">
      <section className="np-rule-card rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/92 p-4 shadow-[0_12px_36px_rgba(2,6,23,0.2)]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">Visning</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setView("operative")}
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
              view === "operative"
                ? "border-cyan-300/45 bg-cyan-300/15 text-cyan-100"
                : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
            }`}
          >
            Operative regler
          </button>
          <button
            type="button"
            onClick={() => setView("system")}
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
              view === "system"
                ? "border-cyan-300/45 bg-cyan-300/15 text-cyan-100"
                : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
            }`}
          >
            Dataintegritet
          </button>
        </div>

        {view === "operative" ? (
          <div className="mt-4 grid gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/50 p-3 lg:grid-cols-5">
            <label className="lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Søk</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Søk etter regelnavn eller beskrivelse"
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-cyan-400"
              />
            </label>

            <label>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Kategori</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-cyan-400"
              >
                <option value="all">Alle kategorier</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Gjelder</span>
              <select
                value={appliesTo}
                onChange={(event) => setAppliesTo(event.target.value as NorskPromptingRule["appliesTo"] | "all")}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-cyan-400"
              >
                <option value="all">Alle</option>
                <option value="image">Bilde</option>
                <option value="video">Video</option>
                <option value="text">Tekst</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Alvorlighet</span>
                <select
                  value={String(minSeverity)}
                  onChange={(event) =>
                    setMinSeverity(event.target.value === "all" ? "all" : (Number(event.target.value) as RuleSeverity))
                  }
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-cyan-400"
                >
                  {severityOptions.map((option) => (
                    <option key={String(option.value)} value={String(option.value)}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Sorter</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as "severity" | "alpha")}
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-cyan-400"
                >
                  <option value="severity">Alvorlighet</option>
                  <option value="alpha">Alfabetisk</option>
                </select>
              </label>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[rgb(var(--muted))]">
            Systemreglene styrer semantisk deduplisering, merge-policy og datakvalitet i SQL-motoren.
          </p>
        )}
      </section>

      {view === "operative" ? (
        <section className="space-y-3">
          <p className="text-sm text-[rgb(var(--muted))]">
            Viser {filteredRules.length} av {rules.length} operative regler.
          </p>

          {grouped.map(([groupName, groupRules], groupIndex) => (
            <details
              key={groupName}
              open={needle.length > 0 || groupIndex < 2}
              className="np-rule-card rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/92 p-4"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3">
                <span className="text-lg font-semibold tracking-tight">{groupName}</span>
                <span className="rounded-full border border-[rgb(var(--border))] px-2 py-1 text-xs text-[rgb(var(--muted))]">
                  {groupRules.length} regler
                </span>
              </summary>

              <ul className="mt-3 space-y-2">
                {groupRules.map((rule) => (
                  <li key={rule.id}>
                    <details className="np-rule-card rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
                      <summary className="flex cursor-pointer flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">{rule.name}</p>
                          <p className="mt-1 text-sm text-[rgb(var(--muted))]">{rule.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-cyan-300/35 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cyan-100">
                            alvor {rule.severity}
                          </span>
                          <span className="rounded-full border border-[rgb(var(--border))] px-2 py-0.5 text-[11px] uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                            {appliesLabel[rule.appliesTo]}
                          </span>
                        </div>
                      </summary>

                      <div className="mt-3 space-y-2 border-t border-[rgb(var(--border))] pt-3 text-sm">
                        <p>
                          <strong>Legges til prompt:</strong> {rule.addToPrompt || "Ingen direkte injeksjon."}
                        </p>
                        <p>
                          <strong>Negativt tillegg:</strong> {rule.negativeAdd || "Ingen negativ preset."}
                        </p>
                        <p className="text-xs text-[rgb(var(--muted))]">ID: {rule.id}</p>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </details>
          ))}

          {grouped.length === 0 ? (
            <p className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-sm text-[rgb(var(--muted))]">
              Ingen regler matcher filteret.
            </p>
          ) : null}
        </section>
      ) : (
        <section className="space-y-3">
          {governanceRules.map((rule) => (
            <article
              key={rule.id}
              className="rounded-2xl border border-amber-300/35 bg-gradient-to-br from-amber-500/15 to-amber-500/5 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold">{rule.name}</p>
                <span className="rounded-full border border-amber-300/40 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-amber-100">
                  {rule.severity}
                </span>
                <span className="rounded-full border border-[rgb(var(--border))] px-2 py-0.5 text-[11px] uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                  {rule.category}
                </span>
              </div>
              <p className="mt-2 text-sm text-[rgb(var(--muted))]">{rule.description}</p>
              <p className="mt-2 text-sm">
                <strong>Gjelder:</strong> {rule.appliesTo.join(", ")}
              </p>
              <p className="mt-1 text-sm">
                <strong>Håndheving:</strong> {rule.enforcementLogic}
              </p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
