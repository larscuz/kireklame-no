"use client";

import { useEffect, useMemo, useState } from "react";
import { useKiProgress } from "@/hooks/ki-opplaring/useKiProgress";
import CopyButton from "./CopyButton";

type Props = {
  id: string;
  title?: string;
  task: string;
  placeholder?: string;
  example?: string;
  guideKey?: string;
};

type TemplateApplyDetail = {
  actionId?: string;
  value: string;
};

export default function ActionBlock({
  id,
  title = "Prøv dette nå",
  task,
  placeholder = "Skriv utkastet ditt her...",
  example,
  guideKey,
}: Props) {
  const { progress, saveExercise, markInProgress } = useKiProgress();
  const storedValue = progress.exercises[id]?.value ?? "";
  const savedTs = progress.exercises[id]?.ts ?? null;

  const [value, setValue] = useState(storedValue);
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    if (!value && storedValue) {
      setValue(storedValue);
    }
  }, [storedValue, value]);

  useEffect(() => {
    const handleTemplateApply = (event: Event) => {
      const detail = (event as CustomEvent<TemplateApplyDetail>).detail;
      if (!detail?.value) return;
      if (detail.actionId && detail.actionId !== id) return;

      setValue(detail.value);
      if (guideKey) {
        markInProgress(guideKey, `Mal satt inn i ${id}`);
      }
    };

    window.addEventListener("kir-template-apply", handleTemplateApply);
    return () => {
      window.removeEventListener("kir-template-apply", handleTemplateApply);
    };
  }, [guideKey, id, markInProgress]);

  const savedLabel = useMemo(() => {
    if (!savedTs) return "Ikke lagret ennå";
    return `Sist lagret ${new Date(savedTs).toLocaleString("nb-NO")}`;
  }, [savedTs]);

  return (
    <section id={id} className="my-6 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <span className="text-xs text-[rgb(var(--muted))]">2-10 minutter</span>
      </div>

      <p className="mt-2 text-sm text-[rgb(var(--fg))]/85">{task}</p>

      <textarea
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          if (guideKey) {
            markInProgress(guideKey, `Arbeider i ${id}`);
          }
        }}
        placeholder={placeholder}
        className="mt-3 min-h-32 w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-3 text-sm text-[rgb(var(--fg))] outline-none focus:border-cyan-400"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <CopyButton value={value} label="Kopier svar" copiedLabel="Svar kopiert" />
        <button
          type="button"
          onClick={() => saveExercise(id, value, { guideKey })}
          className="rounded-full border border-cyan-400/40 bg-cyan-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 hover:bg-cyan-400/30"
        >
          Lagre lokalt
        </button>
        {example ? (
          <button
            type="button"
            onClick={() => setShowExample((current) => !current)}
            className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))] hover:bg-black/5 dark:hover:bg-white/5"
          >
            {showExample ? "Skjul eksempel" : "Vis eksempel"}
          </button>
        ) : null}
      </div>

      <p className="mt-2 text-xs text-[rgb(var(--muted))]">{savedLabel}</p>

      {showExample && example ? (
        <pre className="mt-3 overflow-x-auto rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3 text-xs leading-relaxed text-[rgb(var(--fg))]/85">
          <code>{example}</code>
        </pre>
      ) : null}
    </section>
  );
}
