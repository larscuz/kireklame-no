"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { PromptDomain, PromptLength, PromptOutputType, PromptStyle } from "@/data/norskPrompting/types";
import { buildPrompt, type BuildPromptInput, type PromptBlock } from "@/lib/norsk-prompting/builder";
import { outputTypeOptions } from "@/lib/norsk-prompting/constants";
import CopyTextButton from "./CopyTextButton";

type StudentStyle = "noktern" | "filmisk" | "kreativ";
type FormatOption = "" | "16:9" | "9:16" | "1:1";

function toOutputType(value: string | null): PromptOutputType {
  if (value === "video" || value === "text") return value;
  return "image";
}

function toLength(value: string | null): PromptLength {
  if (value === "kort" || value === "lang") return value;
  return "medium";
}

function toStudentStyle(value: string | null): StudentStyle {
  if (value === "filmatisk") return "filmisk";
  if (value === "reklame") return "kreativ";
  return "noktern";
}

function toFormatOption(value: string | null): FormatOption {
  if (value === "16:9" || value === "9:16" || value === "1:1") return value;
  return "";
}

function mapStudentStyle(style: StudentStyle): PromptStyle {
  if (style === "filmisk") return "filmatisk";
  if (style === "kreativ") return "reklame";
  return "noktern";
}

function autoDetectDomain(input: string, outputType: PromptOutputType, format: FormatOption): PromptDomain {
  const source = input.toLowerCase();

  if (outputType === "text") return "redaksjonell";
  if (/(arkitektur|fasade|interi[øo]r|planl[øo]sning|bygg|rom)/.test(source)) return "arkitektur";
  if (/(produkt|pakning|emballasje|flaske|boks|sko|mobil|klokke|parfyme)/.test(source)) return "produkt";
  if (/(historisk|middelalder|viking|epoke|årstall|krig)/.test(source)) return "historisk";
  if (/(surreal|absurd|dr[øo]m|mareritt)/.test(source)) return "surreal_absurd";
  if (/(animasjon|animated|tegnefilm|cartoon|anime)/.test(source)) return "animated";
  if (/(dokumentar|reportasje|intervju)/.test(source)) return "dokumentar";
  if (format === "9:16" || /(reels|shorts|story|tiktok|snap)/.test(source)) return "sosiale-medier";

  return "film-vfx";
}

function strictnessForLength(length: PromptLength): number {
  if (length === "kort") return 56;
  if (length === "lang") return 84;
  return 72;
}

function consistencyForLength(length: PromptLength): number {
  if (length === "kort") return 60;
  if (length === "lang") return 88;
  return 76;
}

function sameRequest(a: BuildPromptInput, b: BuildPromptInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function PromptExpanderClient() {
  const searchParams = useSearchParams();
  const queryInput = searchParams.get("input");
  const hasInitialInput = (queryInput || "").trim().length > 0;

  const [outputType, setOutputType] = useState<PromptOutputType>(toOutputType(searchParams.get("outputType")));
  const [input, setInput] = useState(queryInput || "");
  const [studentStyle, setStudentStyle] = useState<StudentStyle>(toStudentStyle(searchParams.get("style")));
  const [length, setLength] = useState<PromptLength>(toLength(searchParams.get("length")));
  const [format, setFormat] = useState<FormatOption>(toFormatOption(searchParams.get("format")));
  const updateButtonId = "np-student-generate-button";

  const isVisualOutput = outputType === "image" || outputType === "video";

  useEffect(() => {
    if (outputType === "text") {
      setFormat("");
    }
  }, [outputType]);

  const domain = useMemo(() => autoDetectDomain(input, outputType, format), [input, outputType, format]);

  const draftRequest = useMemo<BuildPromptInput>(
    () => ({
      input,
      outputType,
      domain,
      style: mapStudentStyle(studentStyle),
      length,
      format: format || undefined,
      strictness: strictnessForLength(length),
      consistency: consistencyForLength(length),
      lockRules: true,
      jsonMode: false,
      useReferenceImage: isVisualOutput && (length === "lang" || domain === "produkt" || domain === "arkitektur"),
      referenceIntent: domain === "produkt" ? "produktgeometri" : "identitet-logo",
      referenceNotes: "",
      useFirstLast: outputType === "video" && length === "lang",
      firstFrame: "",
      lastFrame: "",
    }),
    [input, outputType, domain, studentStyle, length, format, isVisualOutput]
  );

  const [activeRequest, setActiveRequest] = useState<BuildPromptInput>(draftRequest);
  const result = useMemo(() => buildPrompt(activeRequest), [activeRequest]);
  const [hasGenerated, setHasGenerated] = useState<boolean>(hasInitialInput);
  const [editableSections, setEditableSections] = useState<PromptBlock[]>(hasInitialInput ? result.sections : []);
  const [showInjectedTerms, setShowInjectedTerms] = useState(true);
  const hasDraftChanges = !sameRequest(draftRequest, activeRequest);
  const canGenerate = (!hasGenerated && input.trim().length > 0) || (hasGenerated && hasDraftChanges);
  const visibleInjectedTerms = hasGenerated ? result.injectedTerms : [];
  const visibleLearningPoints = hasGenerated ? result.learningPoints : [];
  const fullPrompt = useMemo(
    () =>
      editableSections
        .map((section) => `${section.title}\n${section.content}`)
        .join("\n\n")
        .trim(),
    [editableSections]
  );
  const hasPromptOutput = fullPrompt.length > 0;
  const hasEditableSections = editableSections.length > 0;
  const hasInjectedTerms = visibleInjectedTerms.length > 0;
  const hasLearningPoints = visibleLearningPoints.length > 0;

  useEffect(() => {
    if (!hasGenerated) {
      setEditableSections([]);
      return;
    }
    setEditableSections(result.sections);
  }, [hasGenerated, result.sections]);

  function updateSection(id: string, content: string) {
    setEditableSections((current) =>
      current.map((section) => (section.id === id ? { ...section, content } : section))
    );
  }

  function generatePrompt() {
    setActiveRequest(draftRequest);
    setHasGenerated(true);
  }

  return (
    <section className="np-node-surface rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/92 p-4 pt-7 shadow-[0_18px_60px_rgba(2,6,23,0.3)] sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">Arbeidsflate</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black">Bygg pro-prompten din</h2>
        <p className="mt-2 text-sm text-black">
          Start med en kort idé, velg stil og detaljer, og generer en ferdig prompt til bilde, video eller tekst.
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3 lg:items-start">
        <aside className="space-y-3 lg:col-span-1">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">1. Outputtype</p>
            <div className="mt-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/75 p-1">
              <div className="grid grid-cols-3 gap-1">
                {outputTypeOptions.map((option) => {
                  const active = outputType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setOutputType(option.value)}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        active
                          ? "border border-zinc-300/40 bg-zinc-300/15 text-zinc-100"
                          : "border border-transparent text-[rgb(var(--muted))] hover:border-zinc-300/20 hover:text-zinc-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
            <label htmlFor="np-idea-input" className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
              2. Skriv ideen din
            </label>
            <textarea
              id="np-idea-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="mt-2 min-h-36 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3 text-sm shadow-inner outline-none placeholder:text-[rgb(var(--muted))] placeholder:opacity-80 focus:border-zinc-300 focus:placeholder-transparent"
              placeholder='Beskriv hva du vil ha, eller gå til Eksempler og velg et case via "Kjør i utvider".'
            />
          </div>

          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">3. Stil</p>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/75 p-1">
              {[
                { value: "noktern" as const, label: "Nøktern" },
                { value: "filmisk" as const, label: "Filmisk" },
                { value: "kreativ" as const, label: "Kreativ" },
              ].map((option) => {
                const active = studentStyle === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStudentStyle(option.value)}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "border border-zinc-300/40 bg-zinc-300/15 text-zinc-100"
                        : "border border-transparent text-[rgb(var(--muted))] hover:border-zinc-300/20 hover:text-zinc-100"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">4. Detaljnivå</p>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/75 p-1">
              {[
                { value: "kort" as const, label: "Kort" },
                { value: "medium" as const, label: "Normal" },
                { value: "lang" as const, label: "Ekstra" },
              ].map((option) => {
                const active = length === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLength(option.value)}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "border border-zinc-300/40 bg-zinc-300/15 text-zinc-100"
                        : "border border-transparent text-[rgb(var(--muted))] hover:border-zinc-300/20 hover:text-zinc-100"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {isVisualOutput ? (
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
              <label htmlFor="np-format-select" className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                5. Format (valgfritt)
              </label>
              <select
                id="np-format-select"
                value={format}
                onChange={(event) => setFormat(event.target.value as FormatOption)}
                className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
              >
                <option value="">Auto</option>
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
                <option value="1:1">1:1</option>
              </select>
            </div>
          ) : null}

          <button
            id={updateButtonId}
            type="button"
            onClick={generatePrompt}
            className="np-action-btn inline-flex w-full items-center justify-center rounded-xl border border-zinc-300/40 bg-zinc-300/15 px-5 py-2.5 text-sm font-semibold text-black shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition hover:bg-zinc-300/25 disabled:cursor-not-allowed disabled:opacity-100"
            disabled={!canGenerate}
          >
            Lag ferdig pro-prompt
          </button>
        </aside>

        <div className="space-y-3 lg:col-span-2">
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-300/30 bg-gradient-to-br from-zinc-500/20 via-zinc-500/5 to-sky-400/12 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-black">Kopier ferdig pro-prompt</p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={generatePrompt}
                    className="np-action-btn inline-flex items-center justify-center rounded-lg border border-zinc-300/40 bg-zinc-300/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.11em] text-black transition hover:bg-zinc-300/25 disabled:cursor-not-allowed disabled:opacity-100"
                    disabled={!canGenerate}
                  >
                    Lag ferdig pro-prompt
                  </button>
                  <CopyTextButton
                    value={fullPrompt}
                    label="Kopier prompt"
                    disabled={!hasPromptOutput}
                    className="text-black disabled:opacity-100"
                  />
                </div>
              </div>
              <pre className="mt-3 max-h-[36rem] overflow-auto whitespace-pre-wrap rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 p-3 text-sm text-[rgb(var(--fg))]/90">
                {fullPrompt}
              </pre>
              <p className="mt-2 text-xs text-black">
                {hasPromptOutput
                  ? "Lim inn i ChatGPT, Midjourney, Runway, Kling eller annet verktøy."
                  : "Prompten vises her etter at du trykker \"Lag ferdig pro-prompt\"."}
              </p>
            </div>

            <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black">
                Redigerbare prompt-seksjoner
              </p>
              <div className="mt-2 max-h-[36rem] space-y-3 overflow-auto pr-1">
                {hasEditableSections ? (
                  editableSections.map((section) => (
                    <label key={section.id} className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                        {section.title}
                      </span>
                      <textarea
                        value={section.content}
                        onChange={(event) => updateSection(section.id, event.target.value)}
                        className="mt-1 min-h-20 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-zinc-300"
                      />
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-black">
                    Seksjonene vises her etter at du har laget en pro-prompt.
                  </p>
                )}
              </div>
            </article>
          </div>

          <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                Begreper som ble lagt til
              </p>
              <button
                type="button"
                onClick={() => setShowInjectedTerms((current) => !current)}
                disabled={!hasInjectedTerms}
                className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--muted))] hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {hasInjectedTerms ? (showInjectedTerms ? "Skjul" : "Vis") : "Ingen"}
              </button>
            </div>
            {showInjectedTerms ? (
              <div className="mt-3 space-y-3">
                {hasInjectedTerms ? (
                  visibleInjectedTerms.map((term) => (
                    <article key={term.slug} className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/70 p-3">
                      <p className="text-sm font-semibold">{term.term_no}</p>
                      <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                        <span className="font-semibold text-zinc-100">Hva det betyr:</span> {term.definition_no}
                      </p>
                      <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                        <span className="font-semibold text-zinc-100">Hvorfor:</span> {term.why}
                      </p>
                      <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                        <span className="font-semibold text-zinc-100">Effekt på bildet/videoen:</span> {term.effect}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-[rgb(var(--muted))]">
                    Ingen ekstra begreper ennå. Lag en pro-prompt for å se hva som blir lagt til.
                  </p>
                )}
              </div>
            ) : null}
          </article>

          <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
              Ting vi la til som du kanskje ikke tenkte på
            </p>
            {hasLearningPoints ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
                {visibleLearningPoints.slice(0, 5).map((item) => (
                  <li key={item.title}>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-[rgb(var(--muted))]">{item.detail}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                Her får du forslag til viktige detaljer systemet la til automatisk.
              </p>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
