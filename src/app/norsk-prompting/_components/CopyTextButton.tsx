"use client";

import { useState } from "react";

type Props = {
  value: string;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export default function CopyTextButton({ value, label = "Kopier", disabled = false, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={async () => {
        if (disabled || value.trim().length === 0) return;

        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          setCopied(false);
        }
      }}
      className={`inline-flex items-center rounded-lg border border-zinc-300/35 bg-zinc-300/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.11em] text-zinc-100 shadow-[0_8px_18px_rgba(2,6,23,0.2)] transition hover:bg-zinc-300/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {copied ? "Kopiert" : label}
    </button>
  );
}
