"use client";

import { useMemo, useState } from "react";
import { useKiProgress } from "@/hooks/ki-opplaring/useKiProgress";
import CopyButton from "./CopyButton";
import { downloadTextFile, postKiExercise, type LlmProviderInfo } from "./exerciseApi";

type Props = {
  id: string;
  title?: string;
  guideKey?: string;
  defaultBadPrompt?: string;
  defaultGoodPrompt?: string;
  context?: string;
};

type ExerciseResponse = {
  bad_result: string;
  good_result: string;
  diff_summary: string[];
  why_good_wins: string[];
};

export default function PromptExercise({
  id,
  title = "Dårlig prompt vs bra prompt",
  guideKey,
  defaultBadPrompt = "Lag en kul reklame for produktet mitt",
  defaultGoodPrompt = "Lag et 9:16 kampanjebilde for [produkt] mot [målgruppe], naturlig lys, tydelig produktfokus, ingen nye objekter, rolig fargepalett.",
  context,
}: Props) {
  const { progress, saveExercise, markInProgress } = useKiProgress();
  const [badPrompt, setBadPrompt] = useState(defaultBadPrompt);
  const [goodPrompt, setGoodPrompt] = useState(defaultGoodPrompt);
  const [localContext, setLocalContext] = useState(context || "Kampanjebilde for digital annonsering");
  const [result, setResult] = useState<ExerciseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<LlmProviderInfo | null>(null);

  const savedLabel = useMemo(() => {
    const ts = progress.exercises[id]?.ts;
    if (!ts) return "Ikke lagret ennå";
    return `Sist lagret ${new Date(ts).toLocaleString("nb-NO")}`;
  }, [id, progress.exercises]);

  const runCompare = async () => {
    if (!badPrompt.trim() || !goodPrompt.trim()) {
      setError("Fyll ut både dårlig og bra prompt.");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await postKiExercise<ExerciseResponse>("exercise_compare", {
      badPrompt,
      goodPrompt,
      context: localContext,
    });

    setLoading(false);

    if (!response.ok || !response.data) {
      setError(response.error || "Klarte ikke kjøre sammenligningen.");
      return;
    }

    setProvider(response.provider ?? null);
    setResult(response.data);
    saveExercise(
      id,
      JSON.stringify({ badPrompt, goodPrompt, context: localContext, result: response.data }),
      { guideKey }
    );
  };

  const runSingle = async () => {
    await runCompare();
  };

  return (
    <section id={id} className="my-6 rounded-2xl border border-cyan-400/35 bg-cyan-500/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <span className="text-xs text-[rgb(var(--muted))]">7-12 minutter</span>
      </div>

      <p className="mt-2 text-sm text-[rgb(var(--fg))]/85">
        Skriv begge prompts. Trykk <strong>Kjør begge</strong>. Se forskjellen side ved side.
      </p>

      <label className="mt-3 block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Kontekst</label>
      <input
        value={localContext}
        onChange={(event) => {
          setLocalContext(event.target.value);
          if (guideKey) markInProgress(guideKey, `Arbeider i ${id}`);
        }}
        className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-cyan-400"
      />

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Dårlig prompt</label>
          <textarea
            value={badPrompt}
            onChange={(event) => {
              setBadPrompt(event.target.value);
              if (guideKey) markInProgress(guideKey, `Arbeider i ${id}`);
            }}
            className="mt-1 min-h-24 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Bra prompt</label>
          <textarea
            value={goodPrompt}
            onChange={(event) => {
              setGoodPrompt(event.target.value);
              if (guideKey) markInProgress(guideKey, `Arbeider i ${id}`);
            }}
            className="mt-1 min-h-24 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={runCompare}
          disabled={loading}
          className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 hover:bg-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Kjører..." : "Kjør begge"}
        </button>
        <button
          type="button"
          onClick={runSingle}
          disabled={loading}
          className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))] hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white/5"
        >
          {loading ? "Kjører..." : "Kjør"}
        </button>
        <button
          type="button"
          onClick={() =>
            saveExercise(id, JSON.stringify({ badPrompt, goodPrompt, context: localContext }), { guideKey })
          }
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
      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}

      {result ? (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-2xl border border-rose-400/35 bg-rose-500/10 p-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-100">Simulert output (dårlig)</h4>
              <p className="mt-2 text-sm text-[rgb(var(--fg))]/90">{result.bad_result}</p>
            </article>

            <article className="rounded-2xl border border-emerald-400/35 bg-emerald-500/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-100">Simulert output (bra)</h4>
                <CopyButton value={result.good_result} label="Kopier" copiedLabel="Kopiert" />
              </div>
              <p className="mt-2 text-sm text-[rgb(var(--fg))]/90">{result.good_result}</p>
            </article>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Se forskjell</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
                {result.diff_summary.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Hvorfor den gode vinner</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
                {result.why_good_wins.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() =>
                  downloadTextFile(
                    `prompt-compare-${id}.md`,
                    `## Dårlig output\n${result.bad_result}\n\n## Bra output\n${result.good_result}\n\n## Forskjell\n- ${result.diff_summary.join("\n- ")}\n\n## Hvorfor bra vinner\n- ${result.why_good_wins.join("\n- ")}`,
                    "text/markdown;charset=utf-8"
                  )
                }
                className="mt-3 rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))] hover:bg-black/5 dark:hover:bg-white/5"
              >
                Last ned .md
              </button>
            </article>
          </div>
        </div>
      ) : null}
    </section>
  );
}
