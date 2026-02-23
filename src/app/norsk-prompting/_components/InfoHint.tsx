"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  text: string;
  align?: "left" | "right";
  className?: string;
};

type TooltipPosition = {
  top: number;
  left: number;
};

const VIEWPORT_PADDING = 10;

export default function InfoHint({ text, align = "left", className = "" }: Props) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !mounted) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;
      if (!trigger || !tooltip) return;

      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      let left =
        align === "right"
          ? triggerRect.right - tooltipRect.width
          : triggerRect.left;

      left = Math.max(VIEWPORT_PADDING, Math.min(left, window.innerWidth - tooltipRect.width - VIEWPORT_PADDING));

      let top = triggerRect.bottom + 8;
      const canFitBelow = top + tooltipRect.height <= window.innerHeight - VIEWPORT_PADDING;
      if (!canFitBelow) {
        top = Math.max(VIEWPORT_PADDING, triggerRect.top - tooltipRect.height - 8);
      }

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [align, mounted, open]);

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 text-[11px] font-semibold text-[rgb(var(--muted))] outline-none transition hover:border-zinc-300/40 hover:text-zinc-100 focus:border-zinc-300/40 focus:text-zinc-100"
        aria-label="Forklaring"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        i
      </button>
      {mounted && open
        ? createPortal(
            <span
              ref={tooltipRef}
              className="pointer-events-none fixed z-[9999] min-w-[14rem] max-w-[19rem] rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/95 p-2 text-xs font-normal normal-case leading-relaxed text-[rgb(var(--muted))] shadow-[0_12px_26px_rgba(0,0,0,0.32)]"
              style={{
                top: position.top,
                left: position.left,
              }}
            >
              {text}
            </span>,
            document.body
          )
        : null}
    </span>
  );
}
