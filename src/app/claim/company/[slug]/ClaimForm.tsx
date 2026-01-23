"use client";

import { useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Props = {
  companyId: string;
  companySlug: string;
};

export default function ClaimForm({ companyId, companySlug }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Eier");
  const [message, setMessage] = useState("");

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; message: string }>(null);

  const supabase = useMemo(() => {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, []);

  const isValid = useMemo(() => {
    const e = email.trim();
    const n = fullName.trim();
    const pwOk = password.length >= 8 && password === password2;
    return n.length >= 2 && e.includes("@") && e.includes(".") && pwOk;
  }, [fullName, email, password, password2]);

  async function ensureAuthAccount() {
    // Prøv signUp først (samme strategi som RegisterCompanyForm)
    let authErrorMsg: string | null = null;

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        // Etter epost-verifisering lander de på claim-siden igjen (om de må verifisere)
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          `/claim/company/${companySlug}`
        )}`,
      },
    });

    if (error) {
      const msg = (error as any)?.message?.toLowerCase?.() ?? "";
      const looksLikeExists =
        msg.includes("already") ||
        msg.includes("exists") ||
        msg.includes("registered") ||
        (msg.includes("email") && msg.includes("taken"));

      if (looksLikeExists) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) authErrorMsg = signInError.message;
      } else {
        authErrorMsg = error.message;
      }
    }

    if (authErrorMsg) throw new Error(authErrorMsg);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setResult(null);

    try {
      // 1) Sørg for at bruker finnes + er innlogget (passordbasert)
      await ensureAuthAccount();

      // 2) Hent access token (til /api/claim)
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token ?? null;

      // Hvis brukeren ikke er verifisert og derfor ikke fikk session, gi tydelig beskjed
      if (!accessToken) {
        setResult({
          ok: true,
          message:
            "Konto opprettet. Sjekk e-posten din og bekreft adressen (hvis du fikk verifiseringsmail), og prøv claim på nytt etterpå.",
        });
        return;
      }

      const payload = {
        companySlug,
        companyId,
        fullName,
        email,
        phone,
        role,
        message: message.trim(),
      };

      const res = await fetch("/api/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.ok) {
        setResult({ ok: true, message: "Claim sendt. Venter på godkjenning." });
      } else if (res.status === 409 && data?.code === "ALREADY_CLAIMED") {
        setResult({
          ok: false,
          message: "Denne bedriften er allerede claimet av noen andre.",
        });
      } else if (res.status === 401) {
        setResult({
          ok: false,
          message:
            "Du er ikke innlogget. Prøv å logge inn, og send claim på nytt.",
        });
      } else {
        setResult({ ok: false, message: data?.error || "Kunne ikke sende claim." });
      }
    } catch (err: any) {
      setResult({ ok: false, message: err?.message || "Nettverksfeil. Prøv igjen." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Navn *</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm"
          placeholder="Fornavn Etternavn"
          autoComplete="name"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">E-post *</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm"
          placeholder="navn@firma.no"
          autoComplete="email"
          inputMode="email"
        />
        <p className="text-xs text-[rgb(var(--muted))]">
          Vi bruker e-posten til innlogging og oppfølging.
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Telefon (valgfritt)</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm"
          placeholder="+47 …"
          autoComplete="tel"
          inputMode="tel"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Rolle</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm"
        >
          <option>Eier</option>
          <option>Daglig leder</option>
          <option>Ansatt</option>
          <option>Representant</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Melding (valgfritt)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm"
          placeholder="Kort forklaring (valgfritt)…"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Velg passord *</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            minLength={8}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm"
            placeholder="Minst 8 tegn"
            autoComplete="new-password"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Gjenta passord *</label>
          <input
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            type="password"
            minLength={8}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm"
            placeholder="Skriv passordet igjen"
            autoComplete="new-password"
          />
        </div>
      </div>

      <p className="text-xs text-[rgb(var(--muted))]">
        Passordet brukes for å opprette kontoen din. Du kan logge inn senere og redigere profilen.
      </p>

      <button
        type="submit"
        disabled={!isValid || submitting}
        className="inline-flex w-full items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm font-semibold hover:shadow-soft transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Sender…" : "Send claim"}
      </button>

      {result && <p className="text-sm text-[rgb(var(--muted))]">{result.message}</p>}

      {!isValid && !result && (
        <p className="text-xs text-[rgb(var(--muted))]">
          Fyll inn navn, gyldig e-post og et passord (minst 8 tegn) som matcher.
        </p>
      )}
    </form>
  );
}
