"use client";

import { useCallback } from "react";

type Props = {
  className?: string;
  label?: string;
  onClick?: () => void;
};

export default function TranslateButton({
  className,
  label = "English",
  onClick,
}: Props) {
  const handleClick = useCallback(() => {
    if (typeof window === "undefined") return;
    const url = `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onClick?.();
  }, [onClick]);

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      title="Google Translate (auto → English)"
      aria-label="Translate this page with Google Translate"
    >
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" className="text-base leading-none">
          🌍
        </span>
        <span>{label}</span>
      </span>
    </button>
  );
}
