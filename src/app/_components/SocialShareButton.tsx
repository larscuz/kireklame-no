"use client";

import { useState } from "react";

type SocialShareButtonProps = {
  url: string;
  title: string;
  text?: string | null;
  className?: string;
};

type ShareState = "idle" | "copied" | "failed";

function shortShareText(text: string | null | undefined, maxLen = 180): string {
  const normalized = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (normalized.length <= maxLen) return normalized;
  return `${normalized.slice(0, maxLen - 1).trim()}…`;
}

export default function SocialShareButton({
  url,
  title,
  text,
  className = "",
}: SocialShareButtonProps) {
  const [state, setState] = useState<ShareState>("idle");
  const shareText = shortShareText(text);
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function onShare() {
    setState("idle");

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          text: shareText || undefined,
          url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setState("copied");
        window.setTimeout(() => setState("idle"), 2500);
        return;
      }
    } catch {
      // Falls through to LinkedIn fallback hint below.
    }

    setState("failed");
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onShare}
        className="border border-black/30 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition hover:bg-black/5"
      >
        Del i sosiale medier
      </button>
      {state === "copied" ? (
        <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-black/55">Lenke kopiert.</p>
      ) : null}
      {state === "failed" ? (
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-[11px] font-semibold uppercase tracking-[0.12em] underline underline-offset-4 hover:opacity-80"
        >
          Del via LinkedIn
        </a>
      ) : null}
    </div>
  );
}
