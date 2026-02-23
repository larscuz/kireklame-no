"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { promptTemplates } from "@/data/norskPrompting/templates";
import type { PromptLength, PromptOutputType, PromptStyle, PromptDomain } from "@/data/norskPrompting/types";
import { buildPrompt } from "@/lib/norsk-prompting/builder";
import { domainOptions, lengthOptions, outputTypeOptions, styleOptions } from "@/lib/norsk-prompting/constants";
import CopyTextButton from "./CopyTextButton";

function toOutputType(value: string | null): PromptOutputType {
  if (value === "video" || value === "text") return value;
  return "image";
}

function toDomain(value: string | null): PromptDomain {
  const found = domainOptions.find((item) => item.value === value);
  return found?.value || "film-vfx";
}

function toStyle(value: string | null): PromptStyle {
  const found = styleOptions.find((item) => item.value === value);
  return found?.value || "noktern";
}

function toLength(value: string | null): PromptLength {
  if (value === "kort" || value === "lang") return value;
  return "medium";
}

export default function PromptExpanderClient() {
  const searchParams = useSearchParams();
  const queryInput = searchParams.get("input");

  const [input, setInput] = useState(
    queryInput || "En kvinne løper gjennom en travel togstasjon i regn og mister mobilen i en vanndam."
  );
  const [outputType, setOutputType] = useState<PromptOutputType>(toOutputType(searchParams.get("outputType")));
  const [domain, setDomain] = useState<PromptDomain>(toDomain(searchParams.get("domain")));
  const [style, setStyle] = useState<PromptStyle>(toStyle(searchParams.get("style")));
  const [length, setLength] = useState<PromptLength>(toLength(searchParams.get("length")));
  const [strictness, setStrictness] = useState(78);
  const [consistency, setConsistency] = useState(82);
  const [lockRules, setLockRules] = useState(true);
  const [jsonMode, setJsonMode] = useState(false);
  const [templateId, setTemplateId] = useState<string>(searchParams.get("template") || "");

  const result = useMemo(
    () =>
      buildPrompt({
        input,
        outputType,
        domain,
        style,
        length,
        strictness,
        consistency,
        lockRules,
        jsonMode,
        templateId: templateId || undefined,
      }),
    [input, outputType, domain, style, length, strictness, consistency, lockRules, jsonMode, templateId]
  );

  const templateOptions = useMemo(
    () => promptTemplates.filter((template) => template.outputType === outputType),
    [outputType]
  );

  return (
    <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">Prompt-utvider</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Kort norsk input → lang pro-prompt</h1>
      <p className="mt-2 text-sm text-[rgb(var(--muted))]">
        Generatoren bruker interne regler, maler og termbank. Ingen eksterne LLM-kall.
      </p>

      <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
        Kort beskrivelse / hensikt
      </label>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-2 min-h-28 w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3 text-sm outline-none focus:border-cyan-400"
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Output-type
          <select
            value={outputType}
            onChange={(event) => setOutputType(event.target.value as PromptOutputType)}
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
          >
            {outputTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Domene
          <select
            value={domain}
            onChange={(event) => setDomain(event.target.value as PromptDomain)}
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
          >
            {domainOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Stil
          <select
            value={style}
            onChange={(event) => setStyle(event.target.value as PromptStyle)}
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
          >
            {styleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Lengde
          <select
            value={length}
            onChange={(event) => setLength(event.target.value as PromptLength)}
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
          >
            {lengthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Mal (valgfritt)
          <select
            value={templateId}
            onChange={(event) => setTemplateId(event.target.value)}
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
          >
            <option value="">Automatisk</option>
            {templateOptions.map((template) => (
              <option key={template.id} value={template.id}>
                {template.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
            Stramhet: {strictness}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={strictness}
            onChange={(event) => setStrictness(Number(event.target.value))}
            className="mt-2 w-full"
          />
        </label>

        <label className="text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
            Konsistens: {consistency}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={consistency}
            onChange={(event) => setConsistency(Number(event.target.value))}
            className="mt-2 w-full"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <label className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] px-3 py-1">
          <input type="checkbox" checked={lockRules} onChange={(event) => setLockRules(event.target.checked)} />
          Regellås (følg Norsk Prompting-reglene)
        </label>
        <label className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] px-3 py-1">
          <input type="checkbox" checked={jsonMode} onChange={(event) => setJsonMode(event.target.checked)} />
          JSON-output
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-cyan-300/25 bg-cyan-500/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">Generert prompt</p>
          <CopyTextButton value={result.prompt} label="Kopier prompt" />
        </div>
        <pre className="mt-3 whitespace-pre-wrap text-sm text-[rgb(var(--fg))]/90">{result.prompt}</pre>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <article className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Regler brukt</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
            {result.usedRules.map((rule) => (
              <li key={rule.id}>{rule.name}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Termer injisert</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
            {result.usedTerms.map((term) => (
              <li key={term.slug}>{term.term_no}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
