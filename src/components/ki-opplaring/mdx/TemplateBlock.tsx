"use client";

import { getTemplateById } from "@/config/ki-opplaring-templates";
import CopyButton from "./CopyButton";

type Props = {
  templateId: string;
  actionId?: string;
};

export default function TemplateBlock({ templateId, actionId }: Props) {
  const template = getTemplateById(templateId);

  if (!template) {
    return (
      <section className="my-6 rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-100">
        Fant ikke mal med id: <code>{templateId}</code>
      </section>
    );
  }

  return (
    <section className="my-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">Mal</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">{template.title}</h3>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">{template.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <CopyButton value={template.content} label="Kopier mal" copiedLabel="Mal kopiert" />
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("kir-template-apply", {
                  detail: {
                    actionId,
                    value: template.content,
                  },
                })
              );
            }}
            className="rounded-full border border-cyan-400/40 bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 hover:bg-cyan-400/30"
          >
            Bruk denne
          </button>
        </div>
      </div>

      <pre className="mt-3 overflow-x-auto rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3 text-xs leading-relaxed text-[rgb(var(--fg))]/88">
        <code>{template.content}</code>
      </pre>
    </section>
  );
}
