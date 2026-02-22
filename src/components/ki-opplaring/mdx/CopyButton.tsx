"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  onCopied?: () => void;
};

export default function CopyButton({
  value,
  label = "Kopier",
  copiedLabel = "Kopiert",
  className,
  onCopied,
}: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value ?? "");
      setCopied(true);
      onCopied?.();
    } catch {
      setCopied(false);
    }
  }, [onCopied, value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={
        className ??
        "rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))] hover:bg-black/5 dark:hover:bg-white/5"
      }
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
