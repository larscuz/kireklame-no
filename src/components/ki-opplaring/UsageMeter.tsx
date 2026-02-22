"use client";

import Link from "next/link";

type Props = {
  remaining: number;
  used: number;
  limit: number;
  mode: "anon" | "user";
  status: "ok" | "limited" | "degraded";
  resetHint?: string;
  className?: string;
};

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export default function UsageMeter({
  remaining,
  used,
  limit,
  mode,
  status,
  resetHint = "Reset ved midnatt UTC",
  className = "",
}: Props) {
  const safeLimit = Math.max(1, Math.trunc(limit));
  const safeUsed = Math.max(0, Math.min(safeLimit, Math.trunc(used)));
  const safeRemaining = Math.max(0, Math.min(safeLimit, Math.trunc(remaining)));
  const percent = clampPercent((safeUsed / safeLimit) * 100);

  const barClass =
    status === "limited"
      ? "bg-rose-400"
      : status === "degraded"
        ? "bg-amber-400"
        : "bg-cyan-300";

  return (
    <section
      className={`rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-sm text-[rgb(var(--fg))] shadow-xl backdrop-blur ${className}`.trim()}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">Usage</p>
      <p className="mt-2 text-sm">
        KI-kjøringer i dag: <strong>{safeUsed}/{safeLimit}</strong>
      </p>
      <p className="mt-1 text-sm">
        Igjen: <strong>{safeRemaining}</strong>
      </p>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <div className={`h-full ${barClass}`} style={{ width: `${percent}%` }} />
      </div>

      <p className="mt-2 text-xs text-[rgb(var(--muted))]">{resetHint}</p>

      {status === "degraded" ? (
        <p className="mt-2 rounded-xl border border-amber-300/40 bg-amber-300/10 px-2.5 py-2 text-xs text-amber-100">
          Begrenset modus: kvotesporing er midlertidig utilgjengelig.
        </p>
      ) : null}

      {status === "limited" ? (
        <p className="mt-2 rounded-xl border border-rose-300/40 bg-rose-300/10 px-2.5 py-2 text-xs text-rose-100">
          Daglig kvote er brukt opp. Prøv igjen etter midnatt UTC.
        </p>
      ) : null}

      {mode === "anon" ? (
        <Link
          href="/auth?next=/ki-opplaring/ovelser"
          className="mt-3 inline-flex rounded-full border border-cyan-300/45 bg-cyan-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 hover:bg-cyan-300/25"
        >
          Logg inn for 20/dag
        </Link>
      ) : null}
    </section>
  );
}
