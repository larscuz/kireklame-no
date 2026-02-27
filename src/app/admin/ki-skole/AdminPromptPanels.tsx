"use client";

import { useMemo, useState } from "react";
import CopyTextButton from "@/app/norsk-prompting/_components/CopyTextButton";
import { PROMPT_PREVIEW_MAX, parsePromptPanels, promptPreview } from "@/lib/norsk-prompting/promptPanels";

type Props = {
  prompt: string;
  className?: string;
};

export default function AdminPromptPanels({ prompt, className = "" }: Props) {
  const [expanded, setExpanded] = useState(false);
  const panels = useMemo(() => parsePromptPanels(prompt), [prompt]);
  const hasMultiplePanels = panels.length > 1;
  const hasExpandablePanel = panels.some((panel) => panel.content.length > PROMPT_PREVIEW_MAX);

  return (
    <section className={`rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
        Promptvisning (samme logikk som frontend)
      </p>

      <div className="mt-2 space-y-2">
        {panels.map((panel) => (
          <article key={panel.id} className="rounded-lg border border-zinc-600 bg-zinc-950 p-3 text-white">
            {hasMultiplePanels ? (
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.11em] text-zinc-300">{panel.title}</p>
            ) : null}
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap text-xs">
              {expanded || !hasExpandablePanel ? panel.content : promptPreview(panel.content, PROMPT_PREVIEW_MAX)}
            </pre>
          </article>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {hasExpandablePanel ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="rounded-lg border !border-zinc-100 !bg-zinc-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.11em] !text-zinc-950 shadow-sm transition hover:!bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-100"
          >
            {expanded ? "Vis kortversjon" : "Vis hele prompten"}
          </button>
        ) : null}
        {panels.map((panel) => (
          <CopyTextButton
            key={`copy-${panel.id}`}
            value={panel.content}
            label={hasMultiplePanels ? `Kopier ${panel.title}` : "Kopier prompt"}
            className="!border-zinc-700 !bg-zinc-900 !text-zinc-100 hover:!bg-zinc-800"
          />
        ))}
      </div>
    </section>
  );
}
