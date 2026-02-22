"use client";

import { useMemo, useState } from "react";
import { useKiProgress } from "@/hooks/ki-opplaring/useKiProgress";
import CopyButton from "./CopyButton";
import { downloadTextFile, postKiExercise, type LlmProviderInfo } from "./exerciseApi";

type Props = {
  id: string;
  title?: string;
  placeholder?: string;
  context?: string;
  guideKey?: string;
};

type TransformResponse = {
  improved_prompt: string;
  changes: Array<{ why: string; example: string }>;
  checklist: string[];
};

export default function PromptTransform({
  id,
  title = "Forbedre prompt",
  placeholder = "Lim inn prompten din her...",
  context,
  guideKey,
}: Props) {
  const { progress, saveExercise, markInProgress } = useKiProgress();
  const [input, setInput] = useState(progress.exercises[id]?.value ?? "");
  const [result, setResult] = useState<TransformResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWhy, setShowWhy] = useState(false);
  const [provider, setProvider] = useState<LlmProviderInfo | null>(null);

  const savedLabel = useMemo(() => {
    const ts = progress.exercises[id]?.ts;
    if (!ts) return "Ikke lagret ennå";
    return `Sist lagret ${new Date(ts).toLocaleString("nb-NO")}`;
  }, [id, progress.exercises]);

  const runTransform = async () => {
    const prompt = input.trim();
    if (!prompt) {
      setError("Skriv inn en prompt først.");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await postKiExercise<TransformResponse>("transform_prompt", {
      prompt,
      context: context || "Kreativ kommersiell produksjon",
    });

    setLoading(false);

    if (!response.ok || !response.data) {
      setError(response.error || "Klarte ikke forbedre prompten.");
      return;
    }

    setProvider(response.provider ?? null);
    setResult(response.data);
    setShowWhy(true);
    saveExercise(id, JSON.stringify({ input: prompt, improved: response.data.improved_prompt }), { guideKey });
  };

  return (
    <section id={id} className="my-6 rounded-2xl border border-indigo-400/35 bg-indigo-500/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <span className="text-xs text-[rgb(var(--muted))]">5-10 minutter</span>
      </div>

      <p className="mt-2 text-sm text-[rgb(var(--fg))]/85">
        Skriv prompten din. Trykk <strong>Forbedre prompt</strong>. Kopier og test direkte.
      </p>

      <textarea
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          if (guideKey) {
            markInProgress(guideKey, `Arbeider i ${id}`);
          }
        }}
        placeholder={placeholder}
        className="mt-3 min-h-28 w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-3 text-sm text-[rgb(var(--fg))] outline-none focus:border-indigo-400"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={runTransform}
          disabled={loading}
          className="rounded-full border border-indigo-300/45 bg-indigo-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-100 hover:bg-indigo-300/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Jobber..." : "Forbedre prompt"}
        </button>
        <button
          type="button"
          onClick={() => setShowWhy((current) => !current)}
          className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))] hover:bg-black/5 dark:hover:bg-white/5"
        >
          {showWhy ? "Skjul forbedring" : "Forklar forbedringen"}
        </button>
        <button
          type="button"
          onClick={() => saveExercise(id, input, { guideKey })}
          className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))] hover:bg-black/5 dark:hover:bg-white/5"
        >
          Lagre
        </button>
      </div>

      <p className="mt-2 text-xs text-[rgb(var(--muted))]">{savedLabel}</p>
      {provider ? (
        <p className="mt-1 text-xs text-[rgb(var(--muted))]">
          Motor: {provider.name === "openrouter" ? `OpenRouter (${provider.model})` : "Lokal fallback"}
        </p>
      ) : null}

      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

      {result ? (
        <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Forbedret prompt</h4>
            <div className="flex flex-wrap gap-2">
              <CopyButton value={result.improved_prompt} label="Kopier" copiedLabel="Kopiert" />
              <button
                type="button"
                onClick={() => downloadTextFile(`prompt-${id}.txt`, result.improved_prompt)}
                className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))] hover:bg-black/5 dark:hover:bg-white/5"
              >
                Last ned .txt
              </button>
            </div>
          </div>
          <pre className="mt-2 overflow-x-auto rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3 text-xs leading-relaxed text-[rgb(var(--fg))]/90">
            <code>{result.improved_prompt}</code>
          </pre>

          {showWhy ? (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Hvorfor bedre</h5>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
                  {result.changes.map((item, index) => (
                    <li key={`${item.why}-${index}`}>
                      <strong>{item.why}:</strong> {item.example}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Klar-før-test</h5>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
                  {result.checklist.map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
