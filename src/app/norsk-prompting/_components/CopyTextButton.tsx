"use client";

import { useState } from "react";

type Props = {
  value: string;
  label?: string;
};

export default function CopyTextButton({ value, label = "Kopier" }: Props) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex items-center rounded-lg border border-zinc-300/35 bg-zinc-300/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.11em] text-zinc-100 shadow-[0_8px_18px_rgba(2,6,23,0.2)] transition hover:bg-zinc-300/20"
    >
      {copied ? "Kopiert" : label}
    </button>
  );
}
