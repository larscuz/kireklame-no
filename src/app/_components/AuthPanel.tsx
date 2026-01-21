"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

function generateStrongPassword(length = 22) {
  // Avoid ambiguous chars (O/0, I/l/1) and keep it copy-friendly
  const charset =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*_-+";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < length; i++) out += charset[arr[i] % charset.length];
  return out;
}

export default function AuthPanel({
  initialMode = "signin",
}: {
  initialMode?: "signin" | "signup";
}) {

  const supabase = useMemo(() => supabaseBrowser(), []);

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function getNextPath() {
    if (typeof window === "undefined") return "/me";
    const params = new URLSearchParams(window.location.search);
    return params.get("next") ?? "/me";
  }

  function getRedirectToWithNext(next: string) {
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
  }

  // ✅ B2: If we landed here from a Supabase email link, tokens are in URL hash.
  // Example:
  // /auth?next=/auth/reset#access_token=...&refresh_token=...&type=recovery
  useEffect(() => {
    (async () => {
      if (typeof window === "undefined") return;

      const hash = window.location.hash;
      if (!hash || hash.length < 2) return;

      const hashParams = new URLSearchParams(hash.slice(1));
      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token");

      if (!access_token || !refresh_token) return;

      const next = getNextPath();

      setLoading(true);
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      setLoading(false);

      // remove hash so refresh doesn't re-run
      try {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      } catch {}

      if (error) {
        setErr(error.message);
        return;
      }

      // ✅ now logged in -> go to next (usually /auth/reset)
      window.location.href = next;
    })();
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signInWithPassword() {
    setErr(null);
    setMsg(null);

    const e = email.trim();
    if (!e) {
      setErr("Skriv inn e-post.");
      return;
    }
    if (!password) {
      setErr("Skriv inn passord.");
      return;
    }

    const next = getNextPath();

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: e,
      password,
    });
    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    window.location.href = next;
  }

  async function signUpWithPassword() {
    setErr(null);
    setMsg(null);

    const e = email.trim();
    if (!e) {
      setErr("Skriv inn e-post.");
      return;
    }

        if (!password) {
      setErr("Skriv inn passord.");
      return;
    }
    if (password.length < 8) {
      setErr("Passord må være minst 8 tegn.");
      return;
    }
    if (password !== confirmPassword) {
      setErr("Passordene matcher ikke.");
      return;
    }

    const next = getNextPath();
    const redirectTo = getRedirectToWithNext(next);

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: e,
      password,
      options: { emailRedirectTo: redirectTo },
    });

    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    // ✅ If the user already exists, Supabase can return a user with no identities.
    // In that case, no confirmation email is sent. We should prompt "log in" instead.
    const identities = (data?.user as any)?.identities;
    const isExistingUser = Array.isArray(identities) && identities.length === 0;

    if (isExistingUser) {
      setGeneratedPassword(null);
      setPassword("");
      setConfirmPassword("");
      setMode("signin");
      setMsg("Konto finnes allerede. Logg inn med passord i stedet.");
      return;

    }

    setMsg(
      "Sjekk e-posten din og bekreft kontoen (kun første gang). Etter bekreftelse kan du logge inn med passordet."
    );
  }

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setErr(null);
            setMsg(null);
            setGeneratedPassword(null);
          }}
          className={`rounded-xl px-3 py-2 text-sm font-semibold border border-[rgb(var(--border))] transition ${
            mode === "signin"
              ? "bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
              : "bg-transparent text-[rgb(var(--fg))] hover:opacity-80"
          }`}
        >
          Logg inn
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setErr(null);
            setMsg(null);
            setGeneratedPassword(null);
            setPassword("");
          }}
          className={`rounded-xl px-3 py-2 text-sm font-semibold border border-[rgb(var(--border))] transition ${
            mode === "signup"
              ? "bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
              : "bg-transparent text-[rgb(var(--fg))] hover:opacity-80"
          }`}
        >
          Opprett konto
        </button>
      </div>

      {/* Email */}
      <label className="mt-4 grid gap-1">
        <span className="text-sm font-medium">E-post</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
          placeholder="deg@firma.no"
          className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
        />
      </label>

      {/* Password only for signin + forgot password */}
      {mode === "signin" && (
        <div className="mt-3 grid gap-1">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Passord</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
            />
          </label>

          <button
            type="button"
            onClick={async () => {
              setErr(null);
              setMsg(null);

              const e = email.trim();
              if (!e) {
                setErr("Skriv inn e-post først.");
                return;
              }

              const redirectTo = `${window.location.origin}/auth/callback?type=recovery&next=${encodeURIComponent(
                getNextPath()
              )}`;

              setLoading(true);
              const { error } = await supabase.auth.resetPasswordForEmail(e, {
                redirectTo,
              });
              setLoading(false);

              if (error) {
                setErr(error.message);
                return;
              }

              setMsg("Sjekk e-posten for lenke til å sette nytt passord.");
            }}
            className="text-left text-sm font-semibold underline underline-offset-4 hover:opacity-80"
          >
            Glemt passord?
          </button>
        </div>
      )}

      {/* Password for signup (choose yourself) */}
{mode === "signup" && (
  <div className="mt-3 grid gap-3">
    <label className="grid gap-1">
      <span className="text-sm font-medium">Passord</span>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        autoComplete="new-password"
        placeholder="Minst 8 tegn"
        className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
      />
    </label>

    <label className="grid gap-1">
      <span className="text-sm font-medium">Bekreft passord</span>
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        autoComplete="new-password"
        placeholder="Skriv passordet på nytt"
        className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
      />
    </label>
  </div>
)}


      

      {/* Primary action */}
      {mode === "signin" ? (
        <button
          onClick={signInWithPassword}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Logger inn…" : "Logg inn"}
        </button>
      ) : (
        <button
          onClick={signUpWithPassword}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Oppretter…" : "Opprett konto"}
        </button>
      )}

      {/* Messages */}
      {msg && <p className="mt-3 text-sm text-[rgb(var(--muted))]">{msg}</p>}
      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

      <p className="mt-6 text-xs text-[rgb(var(--muted))]">
        V1: Claim er en “pending” forespørsel. Admin kan godkjenne senere.
      </p>
    </div>
  );
}
