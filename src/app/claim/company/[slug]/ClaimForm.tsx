"use client";

import { useMemo, useState } from "react";

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

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; message: string }>(
    null
  );

  const isValid = useMemo(() => {
    const e = email.trim();
    const n = fullName.trim();
    return n.length >= 2 && e.includes("@") && e.includes(".");
  }, [fullName, email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setResult(null);

    // Mikrosteg D: Vi lagrer bare "message" + slug via API (claims-tabellen har typisk company_id/user_id/status/message)
    const payload = {
      companySlug,
      message: message.trim(),
    };

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        // Ikke innlogget → send til auth og tilbake hit
        window.location.href = `/auth?mode=signup&next=${encodeURIComponent(
  `/claim/company/${companySlug}`
)}`;

        return;
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.ok) {
        setResult({ ok: true, message: "Claim sendt. Venter på godkjenning." });
      } else if (res.status === 409 && data?.code === "ALREADY_CLAIMED") {
        setResult({
          ok: false,
          message: "Denne bedriften er allerede claimet av noen andre.",
        });
      } else {
        setResult({ ok: false, message: data?.error || "Kunne ikke sende claim." });
      }
    } catch {
      setResult({ ok: false, message: "Nettverksfeil. Prøv igjen." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Navn</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm"
          placeholder="Fornavn Etternavn"
          autoComplete="name"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">E-post</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm"
          placeholder="navn@firma.no"
          autoComplete="email"
          inputMode="email"
        />
        <p className="text-xs text-[rgb(var(--muted))]">
          Vi bruker e-posten til å sende innlogging og følge opp claim.
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

      <button
        type="submit"
        disabled={!isValid || submitting}
        className="inline-flex w-full items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm font-semibold hover:shadow-soft transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Sender…" : "Send claim"}
      </button>

      {result && (
        <p className="text-sm text-[rgb(var(--muted))]">{result.message}</p>
      )}

      {!isValid && !result && (
        <p className="text-xs text-[rgb(var(--muted))]">
          Fyll inn minst navn og gyldig e-post.
        </p>
      )}
    </form>
  );
}
