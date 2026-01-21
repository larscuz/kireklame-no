"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // ✅ Gate: denne siden skal bare fungere når brukeren faktisk er logget inn via e-postlenken.
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // getUser er ofte mer "sannhet" enn getSession i edge-caser
        const { data: userData } = await supabase.auth.getUser();

        if (!mounted) return;

        const ok = !!userData?.user;
        setHasSession(ok);
        setReady(true);

        if (!ok) {
          // ikke vis gammel feilmelding hvis man bare lander her uten session
          setErr(null);
        }
      } catch {
        if (!mounted) return;
        setHasSession(false);
        setReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function setNewPassword() {
    setErr(null);
    setMsg(null);

    // ekstra sikkerhet: ikke la noen prøve å sette passord uten session
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setErr("Du må åpne lenken i e-posten først. Prøv igjen fra e-postlenken.");
      setHasSession(false);
      return;
    }

    if (!pw1 || pw1.length < 10) {
      setErr("Passordet må være minst 10 tegn.");
      return;
    }
    if (pw1 !== pw2) {
      setErr("Passordene er ikke like.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw1 });

    if (!error) {
      // Best effort: sørg for at session-state oppdateres før redirect
      try {
        await supabase.auth.refreshSession();
      } catch {
        // ignore
      }
    }

    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    setMsg("Passord lagret. Du er nå klar til å administrere profilen.");
    setTimeout(() => {
      window.location.href = "/me";
    }, 600);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Sett passord</h1>

      <p className="mt-2 text-[rgb(var(--muted))]">
        Dette er for førstegangspålogging. Du må komme hit via lenken i e-posten.
      </p>

      <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        {!ready ? (
          <p className="text-sm text-[rgb(var(--muted))]">Laster…</p>
        ) : !hasSession ? (
          <div className="grid gap-3">
            <p className="text-sm">
              Du er ikke logget inn her ennå.
              <span className="text-[rgb(var(--muted))]">
                {" "}
                Åpne e-posten fra KiReklame og klikk lenken for å komme tilbake hit.
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                href="/auth"
                className="inline-flex rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 font-semibold hover:shadow-soft transition"
              >
                Gå til innlogging
              </Link>
              <Link href="/" className="underline text-[rgb(var(--muted))] hover:opacity-80">
                Tilbake til katalog
              </Link>
            </div>

            {err && <p className="text-sm text-red-600">{err}</p>}
          </div>
        ) : (
          <>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Nytt passord</span>
              <input
                value={pw1}
                onChange={(e) => setPw1(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="••••••••••••"
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
              />
            </label>

            <label className="mt-3 grid gap-1">
              <span className="text-sm font-medium">Gjenta nytt passord</span>
              <input
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="••••••••••••"
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
              />
            </label>

            <button
              onClick={setNewPassword}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Lagrer…" : "Lagre passord"}
            </button>

            {msg && <p className="mt-3 text-sm text-[rgb(var(--muted))]">{msg}</p>}
            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-[rgb(var(--muted))]">
        Tips: Hvis du havner her uten å være logget inn, betyr det nesten alltid at du ikke åpnet
        lenken fra e-posten (eller at callback ikke satte session).
      </p>
    </div>
  );
}
