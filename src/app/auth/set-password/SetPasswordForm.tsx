// src/app/auth/set-password/SetPasswordForm.tsx
"use client";

import { useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SetPasswordForm() {
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (!pw1 || pw1.length < 10) {
      setErr("Passordet må være minst 10 tegn.");
      return;
    }
    if (pw1 !== pw2) {
      setErr("Passordene er ikke like.");
      return;
    }

    setLoading(true);

    // Sikkerhet: sørg for at vi faktisk har en session
    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr || !sessionData?.session) {
      setLoading(false);
      setErr("Sesjonen er utløpt. Åpne lenken fra e-posten på nytt.");
      return;
    }

    // Set password (på nåværende innlogget bruker via recovery-session)
    const { error } = await supabase.auth.updateUser({ password: pw1 });

    if (error) {
      setLoading(false);
      setErr(error.message);
      return;
    }

    // (valgfritt men fint) bekreft at vi fortsatt har user/session
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setLoading(false);
      setErr("Kunne ikke bekrefte innlogging. Prøv lenken fra e-posten på nytt.");
      return;
    }

    setMsg("Passord lagret. Logger inn…");
    setLoading(false);

    // Bruk replace så ikke back-knapp går tilbake til recovery-siden
    window.location.replace("/me");
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-semibold">Velg passord *</span>
        <input
          value={pw1}
          onChange={(e) => setPw1(e.target.value)}
          type="password"
          autoComplete="new-password"
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
          placeholder="Minst 10 tegn"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">Gjenta passord *</span>
        <input
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          type="password"
          autoComplete="new-password"
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
          placeholder="Gjenta passord"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-1 inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-6 py-4 font-semibold shadow-soft hover:opacity-90 transition disabled:opacity-60"
      >
        {loading ? "Lagrer…" : "Lagre passord"}
      </button>

      {err ? <p className="text-sm text-red-600">{err}</p> : null}
      {msg ? <p className="text-sm text-[rgb(var(--muted))]">{msg}</p> : null}
    </form>
  );
}
