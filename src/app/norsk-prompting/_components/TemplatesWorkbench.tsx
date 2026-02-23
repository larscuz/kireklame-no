"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PromptTemplate } from "@/data/norskPrompting/types";
import { domainLabel, outputTypeOptions } from "@/lib/norsk-prompting/constants";
import CopyTextButton from "./CopyTextButton";

const outputTypeLabel = Object.fromEntries(outputTypeOptions.map((option) => [option.value, option.label])) as Record<
  PromptTemplate["outputType"],
  string
>;

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function toTemplateHref(templateId: string): string {
  return `/norsk-prompting/prompt-utvider?template=${encodeURIComponent(templateId)}`;
}

type Props = {
  templates: PromptTemplate[];
};

export default function TemplatesWorkbench({ templates }: Props) {
  const [query, setQuery] = useState("");
  const [outputType, setOutputType] = useState<PromptTemplate["outputType"] | "all">("all");
  const [domain, setDomain] = useState<PromptTemplate["domain"] | "all">("all");
  const [view, setView] = useState<"domain" | "list">("domain");
  const [sortBy, setSortBy] = useState<"title" | "ruleCount">("title");

  const domains = useMemo(() => {
    return Array.from(new Set(templates.map((template) => template.domain))).sort((a, b) =>
      domainLabel[a].localeCompare(domainLabel[b], "nb-NO")
    );
  }, [templates]);

  const needle = normalize(query);

  const filtered = useMemo(() => {
    const list = templates.filter((template) => {
      if (outputType !== "all" && template.outputType !== outputType) return false;
      if (domain !== "all" && template.domain !== domain) return false;
      if (!needle) return true;

      return normalize(`${template.title} ${template.useCase} ${template.domain} ${template.outputType}`).includes(needle);
    });

    list.sort((a, b) => {
      if (sortBy === "ruleCount" && b.recommendedRules.length !== a.recommendedRules.length) {
        return b.recommendedRules.length - a.recommendedRules.length;
      }
      return a.title.localeCompare(b.title, "nb-NO");
    });

    return list;
  }, [templates, outputType, domain, needle, sortBy]);

  const grouped = useMemo(() => {
    const map = new Map<PromptTemplate["domain"], PromptTemplate[]>();
    for (const template of filtered) {
      if (!map.has(template.domain)) map.set(template.domain, []);
      map.get(template.domain)?.push(template);
    }
    return Array.from(map.entries()).sort((a, b) => domainLabel[a[0]].localeCompare(domainLabel[b[0]], "nb-NO"));
  }, [filtered]);

  return (
    <div className="space-y-4">
      <section className="np-node-surface np-template-card rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/92 p-4 pt-7 shadow-[0_12px_36px_rgba(2,6,23,0.2)]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">Visning</p>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">
          Viser {filtered.length} av {templates.length} maler.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setView("domain")}
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
              view === "domain"
                ? "border-zinc-300/35 bg-zinc-300/10 text-zinc-100"
                : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
            }`}
          >
            Etter domene
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
              view === "list"
                ? "border-zinc-300/35 bg-zinc-300/10 text-zinc-100"
                : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
            }`}
          >
            Én liste
          </button>
        </div>

        <div className="mt-4 grid gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/50 p-3 lg:grid-cols-5">
          <label className="lg:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Søk</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Søk etter malnavn eller brukstilfelle"
              className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-zinc-300"
            />
          </label>

          <label>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Output-type</span>
            <select
              value={outputType}
              onChange={(event) => setOutputType(event.target.value as PromptTemplate["outputType"] | "all")}
              className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-zinc-300"
            >
              <option value="all">Alle</option>
              <option value="image">Bilde</option>
              <option value="video">Video</option>
              <option value="text">Tekst</option>
            </select>
          </label>

          <label>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Domene</span>
            <select
              value={domain}
              onChange={(event) => setDomain(event.target.value as PromptTemplate["domain"] | "all")}
              className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-zinc-300"
            >
              <option value="all">Alle domener</option>
              {domains.map((value) => (
                <option key={value} value={value}>
                  {domainLabel[value]}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Sorter</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as "title" | "ruleCount")}
              className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-zinc-300"
            >
              <option value="title">Alfabetisk</option>
              <option value="ruleCount">Flest anbefalte regler</option>
            </select>
          </label>
        </div>
      </section>

      {view === "domain" ? (
        <section className="space-y-3">
          {grouped.map(([groupDomain, groupTemplates], groupIndex) => (
            <details
              key={groupDomain}
              open={needle.length > 0 || groupIndex < 2}
              className="np-node-surface np-template-card rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/92 p-4 pt-7"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3">
                <span className="text-lg font-semibold tracking-tight">{domainLabel[groupDomain]}</span>
                <span className="rounded-full border border-[rgb(var(--border))] px-2 py-1 text-xs text-[rgb(var(--muted))]">
                  {groupTemplates.length} maler
                </span>
              </summary>

              <div className="mt-3 space-y-2">
                {groupTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </details>
          ))}
          {grouped.length === 0 ? (
            <p className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-sm text-[rgb(var(--muted))]">
              Ingen maler matcher filteret.
            </p>
          ) : null}
        </section>
      ) : (
        <section className="space-y-2">
          {filtered.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-sm text-[rgb(var(--muted))]">
              Ingen maler matcher filteret.
            </p>
          ) : null}
        </section>
      )}
    </div>
  );
}

function TemplateCard({ template }: { template: PromptTemplate }) {
  return (
    <details id={template.id} className="np-template-card rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3 scroll-mt-24">
      <summary className="flex cursor-pointer flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
            {outputTypeLabel[template.outputType]} · {domainLabel[template.domain]}
          </p>
          <p className="mt-1 text-base font-semibold">{template.title}</p>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">{template.useCase}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-[rgb(var(--muted))]">
          <span className="rounded-full border border-[rgb(var(--border))] px-2 py-1">
            {template.blocks.length} blokker
          </span>
          <span className="rounded-full border border-[rgb(var(--border))] px-2 py-1">
            {template.recommendedRules.length} regler
          </span>
        </div>
      </summary>

      <div className="mt-3 space-y-3 border-t border-[rgb(var(--border))] pt-3">
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {template.blocks.map((block) => (
            <li key={block.id}>
              <strong>{block.title}:</strong> {block.instruction}
            </li>
          ))}
        </ol>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Anbefalte regler</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {template.recommendedRules.map((ruleId) => (
              <a
                key={ruleId}
                href={`/norsk-prompting/regler#${ruleId}`}
                className="rounded-full border border-[rgb(var(--border))] px-2 py-1 text-xs text-[rgb(var(--muted))]"
              >
                {ruleId}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <CopyTextButton value={template.useCase} label="Kopier bruksområde" />
          <Link
            href={toTemplateHref(template.id)}
            className="inline-flex rounded-full border border-zinc-300/35 bg-zinc-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-100"
          >
            Bruk i utvider
          </Link>
        </div>
      </div>
    </details>
  );
}
