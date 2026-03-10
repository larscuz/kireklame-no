"use client";

import { useEffect, useMemo, useState } from "react";

type Tier = "anon" | "workshop" | "user" | "admin";

type WorkshopStatusResponse = {
  ok: boolean;
  active?: boolean;
  expiresAt?: string | null;
  tier?: Tier;
  unlimited?: boolean;
  error?: string;
};

type WorkshopRedeemResponse = {
  ok: boolean;
  expiresAt?: string | null;
  error?: string;
};

type Props = {
  className?: string;
  compact?: boolean;
};

function formatExpiresAt(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function WorkshopPassPanel({ className = "", compact = false }: Props) {
  const [code, setCode] = useState("");
  const [active, setActive] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [tier, setTier] = useState<Tier>("anon");
  const [unlimited, setUnlimited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const expiresLabel = useMemo(() => formatExpiresAt(expiresAt), [expiresAt]);
  const isLoggedInUserTier = tier === "user";

  async function refreshStatus() {
    setStatusLoading(true);
    try {
      const response = await fetch("/api/ki-opplaring/workshop-pass", {
        method: "GET",
      });
      const json = (await response.json().catch(() => null)) as WorkshopStatusResponse | null;

      if (!response.ok || !json?.ok) {
        setError(json?.error || "Klarte ikke lese workshop-status.");
        return;
      }

      setActive(Boolean(json.active));
      setExpiresAt(json.expiresAt ?? null);
      setTier(json.tier ?? "anon");
      setUnlimited(Boolean(json.unlimited));
      setError(null);
    } catch {
      setError("Klarte ikke lese workshop-status.");
    } finally {
      setStatusLoading(false);
    }
  }

  useEffect(() => {
    void refreshStatus();
  }, []);

  async function activatePass() {
    const value = code.trim();
    if (value.length < 4 || loading || unlimited) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/ki-opplaring/workshop-pass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: value }),
      });
      const json = (await response.json().catch(() => null)) as WorkshopRedeemResponse | null;

      if (!response.ok || !json?.ok) {
        setError(json?.error || "Ugyldig workshop-kode.");
        return;
      }

      setCode("");
      setActive(true);
      setExpiresAt(json.expiresAt ?? null);
      setTier("workshop");
      setMessage("Workshop-pass aktivert.");
    } catch {
      setError("Klarte ikke aktivere workshop-pass.");
    } finally {
      setLoading(false);
    }
  }

  async function clearPass() {
    if (loading) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/ki-opplaring/workshop-pass", {
        method: "DELETE",
      });
      const json = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !json?.ok) {
        setError(json?.error || "Klarte ikke fjerne workshop-pass.");
        return;
      }

      setActive(false);
      setExpiresAt(null);
      setTier("anon");
      setMessage("Workshop-pass fjernet.");
    } catch {
      setError("Klarte ikke fjerne workshop-pass.");
    } finally {
      setLoading(false);
    }
  }

  const compactPadding = compact ? "p-2.5" : "p-3";
  const compactText = compact ? "text-[10px]" : "text-xs";

  return (
    <section
      className={`rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/85 ${compactPadding} ${className}`.trim()}
    >
      <p className={`${compactText} font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]`}>
        Workshop-pass (24t)
      </p>

      {statusLoading ? (
        <p className="mt-2 text-[11px] text-[rgb(var(--muted))]">Sjekker status...</p>
      ) : null}

      {!statusLoading && unlimited ? (
        <p className="mt-2 rounded-lg border border-emerald-400/35 bg-emerald-400/10 px-2.5 py-2 text-[11px] text-[rgb(var(--fg))]/90">
          Du er super admin ({tier}). Ubegrenset tilgang er aktiv.
        </p>
      ) : null}

      {!statusLoading && !unlimited ? (
        <div className="mt-2 space-y-2">
          {active ? (
            <p className="rounded-lg border border-cyan-400/35 bg-cyan-400/10 px-2.5 py-2 text-[11px] text-[rgb(var(--fg))]/90">
              Workshop-pass aktiv. {expiresLabel ? `Utløper ${expiresLabel}.` : ""}
            </p>
          ) : isLoggedInUserTier ? (
            <p className="rounded-lg border border-slate-400/30 bg-slate-400/10 px-2.5 py-2 text-[11px] text-[rgb(var(--fg))]/90">
              Innlogget bruker-kvote er aktiv. Workshop-pass brukes kun for anonyme workshop-deltakere.
            </p>
          ) : (
            <p className="text-[11px] text-[rgb(var(--muted))]">
              Aktivér workshop-pass for utvidet testkvote i en begrenset periode.
            </p>
          )}

          <div className="flex gap-2">
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Skriv workshop-kode"
              disabled={loading || isLoggedInUserTier}
              className="min-h-[36px] flex-1 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 px-2.5 py-1.5 text-[11px] outline-none placeholder:text-[rgb(var(--muted))]/55 focus:border-cyan-400/45 focus:ring-1 focus:ring-cyan-400/20"
            />
            <button
              type="button"
              onClick={activatePass}
              disabled={loading || isLoggedInUserTier || code.trim().length < 4}
              className="min-h-[36px] rounded-lg border border-cyan-400/45 bg-cyan-400/14 px-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-[rgb(var(--fg))]/90 transition hover:bg-cyan-400/24 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {loading ? "..." : "Aktiver"}
            </button>
            {active ? (
              <button
                type="button"
                onClick={clearPass}
                disabled={loading}
                className="min-h-[36px] rounded-lg border border-zinc-400/35 bg-zinc-400/10 px-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-[rgb(var(--fg))]/85 transition hover:bg-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Fjern
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {message ? (
        <p className="mt-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-2 text-[11px] text-[rgb(var(--fg))]/90">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="mt-2 rounded-lg border border-rose-400/35 bg-rose-400/10 px-2.5 py-2 text-[11px] text-[rgb(var(--fg))]/90">
          {error}
        </p>
      ) : null}
    </section>
  );
}
