"use client";

import { useMemo, useState } from "react";
import { useKiProgress } from "@/hooks/ki-opplaring/useKiProgress";
import CopyButton from "./CopyButton";
import { downloadTextFile, postKiExercise, type LlmProviderInfo } from "./exerciseApi";

type Props = {
  id: string;
  title?: string;
  guideKey?: string;
};

type RewriteChange = {
  reason: string;
  before: string;
  after: string;
};

type ImageCompareResponse = {
  original_prompt: string;
  improved_prompt: string;
  original_image_url: string;
  improved_image_url: string;
  changes: RewriteChange[];
  why_improved_is_better: string[];
  mock: boolean;
};

type VideoCompareResponse = {
  original_prompt: string;
  improved_prompt: string;
  original_video_url: string;
  improved_video_url: string;
  duration_sec: number;
  changes: RewriteChange[];
  why_improved_is_better: string[];
  mock: boolean;
};

type MediaMode = "image" | "video";

type ExerciseResult =
  | { mode: "image"; data: ImageCompareResponse }
  | { mode: "video"; data: VideoCompareResponse };

function providerLabel(provider: LlmProviderInfo | null): string | null {
  if (!provider) return null;
  if (provider.name === "openrouter") return `Motor: OpenRouter (${provider.model})`;
  if (provider.name === "cloudflare") return `Motor: Cloudflare (${provider.model})`;
  if (provider.name === "pollinations") return `Motor: Pollinations (${provider.model})`;
  if (provider.name === "fal") return `Motor: fal (${provider.model})`;
  return "Motor: Lokal fallback";
}

function isLikelyVideoUrl(url: string): boolean {
  const normalized = String(url ?? "").toLowerCase();
  return normalized.endsWith(".mp4") || normalized.endsWith(".webm") || normalized.endsWith(".ogg") || normalized.includes("video");
}

function toMarkdown(result: ExerciseResult): string {
  const base = [
    "# Prompt vs Media sammenligning",
    "",
    "## Original prompt",
    result.data.original_prompt,
    "",
    "## Forbedret prompt",
    result.data.improved_prompt,
    "",
    "## Endringer",
    ...result.data.changes.map((item) => `- ${item.reason}\n  - Før: ${item.before}\n  - Etter: ${item.after}`),
    "",
    "## Hvorfor forbedret prompt vinner",
    ...result.data.why_improved_is_better.map((item) => `- ${item}`),
    "",
  ];

  if (result.mode === "image") {
    return [
      ...base,
      "## Output",
      `- Original bilde: ${result.data.original_image_url}`,
      `- Forbedret bilde: ${result.data.improved_image_url}`,
    ].join("\n");
  }

  return [
    ...base,
    "## Output",
    `- Original video: ${result.data.original_video_url}`,
    `- Forbedret video: ${result.data.improved_video_url}`,
    `- Varighet: ${result.data.duration_sec} sek`,
  ].join("\n");
}

export default function PromptVsMediaExercise({
  id,
  title = "Prompt vs media: dårlig mot bra",
  guideKey,
}: Props) {
  const { progress, saveExercise, markInProgress } = useKiProgress();

  const [prompt, setPrompt] = useState(
    "Lag en cinematic reklame for en regnskapsapp med flott lys og realisme"
  );
  const [mode, setMode] = useState<MediaMode>("image");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9">("1:1");
  const [durationSec, setDurationSec] = useState(4);

  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [provider, setProvider] = useState<LlmProviderInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savedLabel = useMemo(() => {
    const ts = progress.exercises[id]?.ts;
    if (!ts) return "Ikke lagret ennå";
    return `Sist lagret ${new Date(ts).toLocaleString("nb-NO")}`;
  }, [id, progress.exercises]);

  const runExercise = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setError("Skriv inn en prompt først.");
      return;
    }

    setLoading(true);
    setError(null);

    if (mode === "image") {
      const response = await postKiExercise<ImageCompareResponse>("image_compare_generate", {
        prompt: trimmedPrompt,
        aspectRatio,
      });

      setLoading(false);

      if (!response.ok || !response.data) {
        setError(response.error || "Klarte ikke å generere bilde-sammenligning.");
        return;
      }

      setProvider(response.provider ?? null);
      const nextResult: ExerciseResult = {
        mode: "image",
        data: response.data,
      };
      setResult(nextResult);
      saveExercise(id, JSON.stringify(nextResult), { guideKey });
      return;
    }

    const response = await postKiExercise<VideoCompareResponse>("video_compare_generate", {
      prompt: trimmedPrompt,
      durationSec,
    });

    setLoading(false);

    if (!response.ok || !response.data) {
      setError(response.error || "Klarte ikke å generere video-sammenligning.");
      return;
    }

    setProvider(response.provider ?? null);
    const nextResult: ExerciseResult = {
      mode: "video",
      data: response.data,
    };
    setResult(nextResult);
    saveExercise(id, JSON.stringify(nextResult), { guideKey });
  };

  return (
    <section id={id} className="my-6 rounded-2xl border border-sky-400/35 bg-sky-500/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <span className="text-xs text-[rgb(var(--muted))]">8-15 minutter</span>
      </div>

      <p className="mt-2 text-sm text-[rgb(var(--fg))]/85">
        Skriv prompten din. Kjør sammenligning. Se original vs forbedret side om side.
      </p>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Modus
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as MediaMode)}
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm text-[rgb(var(--fg))] outline-none focus:border-sky-400"
          >
            <option value="image">Bilde</option>
            <option value="video">Video</option>
          </select>
        </label>

        {mode === "image" ? (
          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
            Format
            <select
              value={aspectRatio}
              onChange={(event) => setAspectRatio(event.target.value as "1:1" | "16:9")}
              className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm text-[rgb(var(--fg))] outline-none focus:border-sky-400"
            >
              <option value="1:1">1:1</option>
              <option value="16:9">16:9</option>
            </select>
          </label>
        ) : (
          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
            Varighet (sek)
            <input
              type="number"
              min={1}
              max={4}
              value={durationSec}
              onChange={(event) => setDurationSec(Math.max(1, Math.min(4, Number(event.target.value) || 4)))}
              className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm text-[rgb(var(--fg))] outline-none focus:border-sky-400"
            />
          </label>
        )}

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Handling
          <button
            type="button"
            onClick={runExercise}
            disabled={loading}
            className="mt-1 w-full rounded-xl border border-sky-300/45 bg-sky-300/20 px-3 py-2 text-sm font-semibold text-sky-100 hover:bg-sky-300/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Kjører..." : mode === "image" ? "Kjør bilde-sammenligning" : "Kjør video-sammenligning"}
          </button>
        </label>
      </div>

      <textarea
        value={prompt}
        onChange={(event) => {
          setPrompt(event.target.value);
          if (guideKey) {
            markInProgress(guideKey, `Arbeider i ${id}`);
          }
        }}
        placeholder="Skriv original prompt her"
        className="mt-3 min-h-28 w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-3 text-sm text-[rgb(var(--fg))] outline-none focus:border-sky-400"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => saveExercise(id, JSON.stringify({ mode, prompt, aspectRatio, durationSec }), { guideKey })}
          className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))] hover:bg-black/5 dark:hover:bg-white/5"
        >
          Lagre
        </button>
        {result ? (
          <>
            <CopyButton value={result.data.improved_prompt} label="Kopier forbedret prompt" copiedLabel="Kopiert" />
            <button
              type="button"
              onClick={() => downloadTextFile(`prompt-vs-media-${id}.md`, toMarkdown(result), "text/markdown;charset=utf-8")}
              className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))] hover:bg-black/5 dark:hover:bg-white/5"
            >
              Last ned .md
            </button>
          </>
        ) : null}
      </div>

      <p className="mt-2 text-xs text-[rgb(var(--muted))]">{savedLabel}</p>
      {providerLabel(provider) ? <p className="mt-1 text-xs text-[rgb(var(--muted))]">{providerLabel(provider)}</p> : null}
      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}

      {result ? (
        <div className="mt-4 space-y-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3">
          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-rose-400/35 bg-rose-500/10 p-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-100">Original prompt</h4>
              <p className="mt-2 text-sm text-[rgb(var(--fg))]/90">{result.data.original_prompt}</p>
            </article>
            <article className="rounded-xl border border-emerald-400/35 bg-emerald-500/10 p-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-100">Forbedret prompt</h4>
              <p className="mt-2 text-sm text-[rgb(var(--fg))]/90">{result.data.improved_prompt}</p>
            </article>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3">
              <h5 className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Original output</h5>
              {result.mode === "image" ? (
                <img src={result.data.original_image_url} alt="Original output" className="mt-2 aspect-video w-full rounded-lg border border-[rgb(var(--border))] object-cover" />
              ) : isLikelyVideoUrl(result.data.original_video_url) ? (
                <video src={result.data.original_video_url} controls playsInline muted className="mt-2 aspect-video w-full rounded-lg border border-[rgb(var(--border))] bg-black/40" />
              ) : (
                <img src={result.data.original_video_url} alt="Original video preview" className="mt-2 aspect-video w-full rounded-lg border border-[rgb(var(--border))] object-cover" />
              )}
            </article>

            <article className="rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3">
              <h5 className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Forbedret output</h5>
              {result.mode === "image" ? (
                <img src={result.data.improved_image_url} alt="Forbedret output" className="mt-2 aspect-video w-full rounded-lg border border-[rgb(var(--border))] object-cover" />
              ) : isLikelyVideoUrl(result.data.improved_video_url) ? (
                <video src={result.data.improved_video_url} controls playsInline muted className="mt-2 aspect-video w-full rounded-lg border border-[rgb(var(--border))] bg-black/40" />
              ) : (
                <img src={result.data.improved_video_url} alt="Forbedret video preview" className="mt-2 aspect-video w-full rounded-lg border border-[rgb(var(--border))] object-cover" />
              )}
            </article>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3">
              <h5 className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Endringer</h5>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
                {result.data.changes.map((item, index) => (
                  <li key={`${item.reason}-${index}`}>
                    <strong>{item.reason}:</strong> {item.before} → {item.after}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3">
              <h5 className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Klar-sjekk</h5>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
                <li>Fjernet vage adjektiver</li>
                <li>La til fysisk lysbeskrivelse</li>
                <li>La til materialrespons</li>
                <li>La til anatomisk presisjon</li>
              </ul>

              <h5 className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Hvorfor bedre</h5>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
                {result.data.why_improved_is_better.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          {result.data.mock ? (
            <p className="text-xs text-amber-200">
              Begrenset modus: mock-assets vises fordi provider eller feature-flag ikke er aktiv.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
