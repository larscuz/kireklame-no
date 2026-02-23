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
      className="inline-flex rounded-full border border-zinc-300/35 bg-zinc-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-100 transition hover:bg-zinc-300/20"
    >
      {copied ? "Kopiert" : label}
    </button>
  );
}
