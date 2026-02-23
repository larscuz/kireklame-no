"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { promptTemplates } from "@/data/norskPrompting/runtime";
import type { PromptLength, PromptOutputType, PromptStyle, PromptDomain } from "@/data/norskPrompting/types";
import { buildPrompt, type BuildPromptInput } from "@/lib/norsk-prompting/builder";
import { domainOptions, lengthOptions, outputTypeOptions, styleOptions } from "@/lib/norsk-prompting/constants";
import CopyTextButton from "./CopyTextButton";
import InfoHint from "./InfoHint";

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

function toBool(value: string | null, fallback = false): boolean {
  if (value == null) return fallback;
  return value === "1" || value === "true" || value === "ja";
}

function sameRequest(a: BuildPromptInput, b: BuildPromptInput): boolean {
  return (
    a.input === b.input &&
    a.outputType === b.outputType &&
    a.domain === b.domain &&
    a.style === b.style &&
    a.length === b.length &&
    a.strictness === b.strictness &&
    a.consistency === b.consistency &&
    a.lockRules === b.lockRules &&
    Boolean(a.jsonMode) === Boolean(b.jsonMode) &&
    (a.templateId || "") === (b.templateId || "") &&
    Boolean(a.textInVisual) === Boolean(b.textInVisual) &&
    (a.overlayText || "") === (b.overlayText || "") &&
    (a.overlayLanguage || "") === (b.overlayLanguage || "") &&
    (a.textCase || "behold") === (b.textCase || "behold") &&
    (a.fontHint || "") === (b.fontHint || "") &&
    (a.textPlacement || "") === (b.textPlacement || "")
  );
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
  const [textInVisual, setTextInVisual] = useState<boolean>(toBool(searchParams.get("textInVisual"), false));
  const [overlayText, setOverlayText] = useState(searchParams.get("overlayText") || "");
  const [overlayLanguage, setOverlayLanguage] = useState(searchParams.get("overlayLanguage") || "norsk");
  const [textCase, setTextCase] = useState<"behold" | "store" | "små">(() => {
    const value = searchParams.get("textCase");
    if (value === "store" || value === "små") return value;
    return "behold";
  });
  const [fontHint, setFontHint] = useState(searchParams.get("fontHint") || "");
  const [textPlacement, setTextPlacement] = useState(searchParams.get("textPlacement") || "");

  const draftRequest = useMemo<BuildPromptInput>(
    () => ({
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
      textInVisual,
      overlayText,
      overlayLanguage,
      textCase,
      fontHint,
      textPlacement,
    }),
    [
      input,
      outputType,
      domain,
      style,
      length,
      strictness,
      consistency,
      lockRules,
      jsonMode,
      templateId,
      textInVisual,
      overlayText,
      overlayLanguage,
      textCase,
      fontHint,
      textPlacement,
    ]
  );

  const [activeRequest, setActiveRequest] = useState<BuildPromptInput>(draftRequest);
  const result = useMemo(() => buildPrompt(activeRequest), [activeRequest]);
  const hasDraftChanges = !sameRequest(draftRequest, activeRequest);

  const templateOptions = useMemo(
    () => promptTemplates.filter((template) => template.outputType === outputType),
    [outputType]
  );
  const isVisualOutput = outputType === "image" || outputType === "video";

  return (
    <section className="np-node-surface np-template-card rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/92 p-4 pt-7 shadow-[0_18px_60px_rgba(2,6,23,0.3)] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">Prompt-utvider</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Kort norsk input → lang pro-prompt</h1>
      <p className="mt-2 text-sm text-[rgb(var(--muted))]">
        Generatoren bruker interne regler, maler og termbank. Ingen eksterne LLM-kall.
      </p>

      <div className="np-pipeline mt-4 text-xs text-[rgb(var(--muted))]">
        <p className="np-pipeline-node"><strong>1.</strong> Beskriv hensikt kort</p>
        <p className="np-pipeline-node"><strong>2.</strong> Sett kontrollvalg</p>
        <p className="np-pipeline-node"><strong>3.</strong> Oppdater og kopier resultat</p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Kort beskrivelse / hensikt
        </label>
        <InfoHint text="Skriv kort hva du vil lage. Hold det konkret: motiv, handling og kontekst." />
      </div>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-2 min-h-28 w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3 text-sm shadow-inner outline-none focus:border-zinc-300"
      />

      <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 p-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
            Tekst i bilde/video
          </p>
          <InfoHint text="Brukes for tekstoverlegg i visuelle leveranser. Når aktivert blir tekstlåsen lagt inn i prompten." />
        </div>

        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
            Skal visuell leveranse inneholde tekst?
            <select
              value={textInVisual ? "ja" : "nei"}
              onChange={(event) => setTextInVisual(event.target.value === "ja")}
              className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm normal-case"
            >
              <option value="nei">Nei</option>
              <option value="ja">Ja</option>
            </select>
          </label>
        </div>

        {!isVisualOutput ? (
          <p className="mt-2 text-xs text-[rgb(var(--muted))]">
            Denne seksjonen brukes når outputtype er satt til Bilde eller Video.
          </p>
        ) : null}

        {textInVisual ? (
          <div className="mt-3 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
              Eksakt tekst (påkrevd)
            </label>
            <textarea
              value={overlayText}
              onChange={(event) => setOverlayText(event.target.value)}
              className="min-h-20 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-zinc-300"
              placeholder="Skriv nøyaktig tekst som skal vises."
            />

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                Språk
                <select
                  value={overlayLanguage}
                  onChange={(event) => setOverlayLanguage(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm normal-case"
                >
                  <option value="norsk">Norsk</option>
                  <option value="engelsk">Engelsk (kun eksplisitt)</option>
                  <option value="blandet">Blandet (kun eksplisitt)</option>
                </select>
              </label>

              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                Case
                <select
                  value={textCase}
                  onChange={(event) => setTextCase(event.target.value as "behold" | "store" | "små")}
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm normal-case"
                >
                  <option value="behold">Behold som skrevet</option>
                  <option value="store">STORE BOKSTAVER</option>
                  <option value="små">små bokstaver</option>
                </select>
              </label>

              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                Font-type (valgfritt)
                <input
                  value={fontHint}
                  onChange={(event) => setFontHint(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm normal-case outline-none focus:border-zinc-300"
                  placeholder="Eks: Grotesk sans"
                />
              </label>

              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                Plassering (valgfritt)
                <input
                  value={textPlacement}
                  onChange={(event) => setTextPlacement(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm normal-case outline-none focus:border-zinc-300"
                  placeholder="Eks: Øvre venstre"
                />
              </label>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-xs text-[rgb(var(--muted))]">
            Utvideren vil legge inn: «Ingen tekst i bildet/videoen.»
          </p>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/50 p-3">
        <div className="mb-2 flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Produksjonsvalg</p>
          <InfoHint text="Disse valgene styrer struktur, terminologi og hvor stramt prompten bygges." />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Outputtype
          <select
            value={outputType}
            onChange={(event) => setOutputType(event.target.value as PromptOutputType)}
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
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
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
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
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
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
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
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
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
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
      </div>

      <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/50 p-3">
        <div className="mb-2 flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Kontrollnivå</p>
          <InfoHint text="Stramhet reduserer tolkning. Konsistens låser kontinuitet mellom elementer og varianter." />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
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
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <label className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 px-3 py-1">
          <input type="checkbox" checked={lockRules} onChange={(event) => setLockRules(event.target.checked)} />
          Regellås (følg Norsk Prompting-reglene)
        </label>
        <label className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 px-3 py-1">
          <input type="checkbox" checked={jsonMode} onChange={(event) => setJsonMode(event.target.checked)} />
          JSON-format
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/50 p-3">
        <button
          type="button"
          onClick={() => setActiveRequest(draftRequest)}
          className="inline-flex w-full items-center justify-center rounded-xl border border-amber-200/45 bg-amber-300/16 px-5 py-2.5 text-sm font-semibold text-zinc-100 shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition hover:bg-amber-300/25 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          disabled={!hasDraftChanges}
        >
          Oppdater prompt nå
        </button>
        <p className="text-xs text-[rgb(var(--muted))]">
          {hasDraftChanges
            ? "Du har endringer som ikke er aktivert ennå."
            : "Resultatet er oppdatert med gjeldende valg."}
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-zinc-300/30 bg-gradient-to-br from-zinc-500/20 via-zinc-500/5 to-amber-400/12 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">Generert prompt</p>
          <CopyTextButton value={result.prompt} label="Kopier prompt" />
        </div>
        <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 p-3 text-sm text-[rgb(var(--fg))]/90">{result.prompt}</pre>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Regler brukt</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
            {result.usedRules.map((rule) => (
              <li key={rule.id}>
                <p>{rule.name}</p>
                <p className="mt-0.5 text-xs text-[rgb(var(--muted))]">{rule.description}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Termer injisert</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
            {result.usedTerms.map((term) => (
              <li key={term.slug}>
                <p>{term.term_no}</p>
                <p className="mt-0.5 text-xs text-[rgb(var(--muted))]">{term.promptImpact}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
