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

type Script10sResponse = {
  concept: string;
  format: "9:16" | "16:9";
  seconds: number;
  beats: Array<{ t: string; vo: string; on_screen: string; shot: string }>;
  shot_list: string[];
  cta: string;
  sfx_hint: string;
  variants: Array<{ angle: string; vo: string; on_screen: string }>;
};

function toMarkdown(result: Script10sResponse): string {
  const beats = result.beats
    .map((beat) => `- ${beat.t}\n  - VO: ${beat.vo}\n  - On-screen: ${beat.on_screen}\n  - Shot: ${beat.shot}`)
    .join("\n");

  const variants = result.variants
    .map((variant) => `- ${variant.angle}\n  - VO: ${variant.vo}\n  - On-screen: ${variant.on_screen}`)
    .join("\n");

  return [
    `# 10s kampanjevideo-manus (${result.format})`,
    "",
    `## Konsept`,
    result.concept,
    "",
    `## Beats (${result.seconds}s)`,
    beats,
    "",
    "## Shot list",
    ...result.shot_list.map((item) => `- ${item}`),
    "",
    "## SFX / musikkhint",
    result.sfx_hint,
    "",
    "## CTA",
    result.cta,
    "",
    "## Varianter",
    variants,
  ].join("\n");
}

function providerLabel(provider: LlmProviderInfo | null): string | null {
  if (!provider) return null;
  if (provider.name === "openrouter") {
    return `Motor: OpenRouter (${provider.model})`;
  }
  return "Motor: Lokal fallback";
}

export default function Script10sExercise({
  id,
  title = "Lag 10s kampanjevideo-manus",
  guideKey,
}: Props) {
  const { progress, markInProgress, saveExercise } = useKiProgress();

  const [product, setProduct] = useState("Produktivitetsapp for små bedrifter");
  const [targetAudience, setTargetAudience] = useState("SMB-ledere i Norge");
  const [channel, setChannel] = useState("Instagram Reels");
  const [tone, setTone] = useState("Direkte, troverdig, kommersiell");
  const [benefit, setBenefit] = useState("mindre manuelt arbeid og raskere levering");
  const [cta, setCta] = useState("Book demo i dag");
  const [constraints, setConstraints] = useState(
    "Ingen nye objekter, behold logo, tydelig produktvisning, realistisk lys"
  );
  const [format, setFormat] = useState<"9:16" | "16:9">("9:16");

  const [result, setResult] = useState<Script10sResponse | null>(null);
  const [provider, setProvider] = useState<LlmProviderInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savedLabel = useMemo(() => {
    const ts = progress.exercises[id]?.ts;
    if (!ts) return "Ikke lagret ennå";
    return `Sist lagret ${new Date(ts).toLocaleString("nb-NO")}`;
  }, [id, progress.exercises]);

  const generateScript = async () => {
    setLoading(true);
    setError(null);

    const response = await postKiExercise<Script10sResponse>("build_script_10s", {
      product,
      targetAudience,
      channel,
      tone,
      benefit,
      cta,
      constraints,
      format,
    });

    setLoading(false);

    if (!response.ok || !response.data) {
      setError(response.error || "Klarte ikke lage manus.");
      return;
    }

    setProvider(response.provider ?? null);
    setResult(response.data);
    saveExercise(
      id,
      JSON.stringify({
        product,
        targetAudience,
        channel,
        tone,
        benefit,
        cta,
        constraints,
        format,
        result: response.data,
      }),
      { guideKey }
    );
  };

  return (
    <section id={id} className="my-6 rounded-2xl border border-amber-400/35 bg-amber-500/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <span className="text-xs text-[rgb(var(--muted))]">7-12 minutter</span>
      </div>

      <p className="mt-2 text-sm text-[rgb(var(--fg))]/85">
        Fyll ut feltene. Trykk <strong>Generer 10s manus</strong>. Kopier og test i videoverktøyet ditt.
      </p>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Produkt
          <input
            value={product}
            onChange={(event) => {
              setProduct(event.target.value);
              if (guideKey) markInProgress(guideKey, `Arbeider i ${id}`);
            }}
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm text-[rgb(var(--fg))] outline-none focus:border-amber-400"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Målgruppe
          <input
            value={targetAudience}
            onChange={(event) => {
              setTargetAudience(event.target.value);
              if (guideKey) markInProgress(guideKey, `Arbeider i ${id}`);
            }}
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm text-[rgb(var(--fg))] outline-none focus:border-amber-400"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Kanal
          <input
            value={channel}
            onChange={(event) => {
              setChannel(event.target.value);
              if (guideKey) markInProgress(guideKey, `Arbeider i ${id}`);
            }}
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm text-[rgb(var(--fg))] outline-none focus:border-amber-400"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Tone
          <input
            value={tone}
            onChange={(event) => {
              setTone(event.target.value);
              if (guideKey) markInProgress(guideKey, `Arbeider i ${id}`);
            }}
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm text-[rgb(var(--fg))] outline-none focus:border-amber-400"
          />
        </label>
      </div>

      <div className="mt-3 grid gap-3">
        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Benefit (2-7 sek)
          <textarea
            value={benefit}
            onChange={(event) => {
              setBenefit(event.target.value);
              if (guideKey) markInProgress(guideKey, `Arbeider i ${id}`);
            }}
            className="mt-1 min-h-20 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm text-[rgb(var(--fg))] outline-none focus:border-amber-400"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          CTA (7-10 sek)
          <input
            value={cta}
            onChange={(event) => {
              setCta(event.target.value);
              if (guideKey) markInProgress(guideKey, `Arbeider i ${id}`);
            }}
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm text-[rgb(var(--fg))] outline-none focus:border-amber-400"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Constraints
          <textarea
            value={constraints}
            onChange={(event) => {
              setConstraints(event.target.value);
              if (guideKey) markInProgress(guideKey, `Arbeider i ${id}`);
            }}
            className="mt-1 min-h-20 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm text-[rgb(var(--fg))] outline-none focus:border-amber-400"
          />
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
          Format
          <select
            value={format}
            onChange={(event) => {
              setFormat(event.target.value as "9:16" | "16:9");
              if (guideKey) markInProgress(guideKey, `Arbeider i ${id}`);
            }}
            className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm text-[rgb(var(--fg))] outline-none focus:border-amber-400"
          >
            <option value="9:16">9:16</option>
            <option value="16:9">16:9</option>
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={generateScript}
          disabled={loading}
          className="rounded-full border border-amber-300/45 bg-amber-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-100 hover:bg-amber-300/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Genererer..." : "Generer 10s manus"}
        </button>

        <button
          type="button"
          onClick={() =>
            saveExercise(
              id,
              JSON.stringify({
                product,
                targetAudience,
                channel,
                tone,
                benefit,
                cta,
                constraints,
                format,
              }),
              { guideKey }
            )
          }
          className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))] hover:bg-black/5 dark:hover:bg-white/5"
        >
          Lagre
        </button>
      </div>

      <p className="mt-2 text-xs text-[rgb(var(--muted))]">{savedLabel}</p>
      {providerLabel(provider) ? <p className="mt-1 text-xs text-[rgb(var(--muted))]">{providerLabel(provider)}</p> : null}
      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}

      {result ? (
        <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
              10s manus klart
            </h4>
            <div className="flex flex-wrap gap-2">
              <CopyButton value={toMarkdown(result)} label="Kopier manus" copiedLabel="Manus kopiert" />
              <button
                type="button"
                onClick={() =>
                  downloadTextFile(`script-10s-${id}.md`, toMarkdown(result), "text/markdown;charset=utf-8")
                }
                className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))] hover:bg-black/5 dark:hover:bg-white/5"
              >
                Last ned .md
              </button>
            </div>
          </div>

          <p className="mt-2 text-sm text-[rgb(var(--fg))]/90">
            <strong>Konsept:</strong> {result.concept}
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {result.beats.map((beat) => (
              <article key={`${beat.t}-${beat.shot}`} className="rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">{beat.t}</p>
                <p className="mt-2 text-sm"><strong>VO:</strong> {beat.vo}</p>
                <p className="mt-1 text-sm"><strong>On-screen:</strong> {beat.on_screen}</p>
                <p className="mt-1 text-sm"><strong>Shot:</strong> {beat.shot}</p>
              </article>
            ))}
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3">
              <h5 className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Shot list</h5>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
                {result.shot_list.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm"><strong>SFX:</strong> {result.sfx_hint}</p>
            </article>

            <article className="rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3">
              <h5 className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Varianter</h5>
              <ul className="mt-2 space-y-2 text-sm text-[rgb(var(--fg))]/85">
                {result.variants.map((variant, index) => (
                  <li key={`${variant.angle}-${index}`}>
                    <strong>{variant.angle}:</strong> VO: {variant.vo} | On-screen: {variant.on_screen}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm"><strong>CTA:</strong> {result.cta}</p>
            </article>
          </div>
        </div>
      ) : null}
    </section>
  );
}
