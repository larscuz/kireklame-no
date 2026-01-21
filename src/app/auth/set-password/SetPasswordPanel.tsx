// src/app/auth/set-password/SetPasswordPanel.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SetPasswordPanel() {
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [email, setEmail] = useState<string>("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Hent bruker fra session (skal være satt av /auth/callback etter recovery-link)
  useEffect(() => {
    let alive = true;

    (async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!alive) return;

      if (error || !data?.user) {
        setErr("Ugyldig eller utløpt lenke. Gå til /auth og bruk «Glemt passord».");
        return;
      }

      setEmail(data.user.email ?? "");
    })();

    return () => {
      alive = false;
    };
  }, [supabase]);

  async function onSetPassword() {
    setErr(null);
    setMsg(null);

    if (!email) {
      setErr("Du må åpne siden via e-postlenken for å sette passord.");
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
    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    setMsg("Passord lagret. Sender deg til Min side…");
    window.location.href = "/me";
  }

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
      <label className="grid gap-1">
        <span className="text-sm font-medium">E-post</span>
        <input
          value={email || ""}
          readOnly
          className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 outline-none opacity-80"
          placeholder="(hentes fra e-postlenken)"
        />
      </label>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Nytt passord</span>
          <input
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            type="password"
            autoComplete="new-password"
            className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 outline-none"
            placeholder="Minst 10 tegn"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Bekreft passord</span>
          <input
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            type="password"
            autoComplete="new-password"
            className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 outline-none"
            placeholder="Gjenta passord"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={onSetPassword}
        disabled={loading}
        className="mt-5 w-full rounded-xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
      >
        {loading ? "Lagrer…" : "Lagre passord og logg inn"}
      </button>

      {msg && <p className="mt-3 text-sm text-[rgb(var(--muted))]">{msg}</p>}
      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

      <p className="mt-5 text-xs text-[rgb(var(--muted))]">
        Hvis lenken er utløpt: gå til <span className="font-mono">/auth</span> og bruk{" "}
        <span className="font-semibold">Glemt passord</span>.
      </p>
    </div>
  );
}
