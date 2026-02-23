type Props = {
  text: string;
  align?: "left" | "right";
  className?: string;
};

export default function InfoHint({ text, align = "left", className = "" }: Props) {
  const tooltipPosition =
    align === "right"
      ? "right-0 top-7 origin-top-right"
      : "left-0 top-7 origin-top-left";

  return (
    <span className={`group relative inline-flex ${className}`}>
      <span
        tabIndex={0}
        className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 text-[11px] font-semibold text-[rgb(var(--muted))] outline-none transition hover:border-zinc-300/40 hover:text-zinc-100 focus:border-zinc-300/40 focus:text-zinc-100"
        aria-label="Forklaring"
      >
        i
      </span>
      <span
        className={`pointer-events-none absolute z-30 hidden min-w-[14rem] max-w-[19rem] rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/95 p-2 text-xs font-normal normal-case leading-relaxed text-[rgb(var(--muted))] shadow-[0_12px_26px_rgba(0,0,0,0.32)] group-hover:block group-focus-within:block ${tooltipPosition}`}
      >
        {text}
      </span>
    </span>
  );
}
