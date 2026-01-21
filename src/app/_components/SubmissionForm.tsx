"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  userEmail: string;
};

export default function SubmissionForm({ userEmail }: Props) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formEl = e.currentTarget;
    setMsg(null);
    setLoading(true);

    const form = new FormData(formEl);

    // 🔒 Sett e-post automatisk fra innlogget bruker
    form.set("contact_email", userEmail);

    // Lagre submission
    const res = await fetch("/api/submit", {
      method: "POST",
      body: form,
    });

    const data = await res.json().catch(() => ({}));

    setLoading(false);

    if (!res.ok) {
      setMsg(data?.error || "Kunne ikke sende inn. Prøv igjen.");
      return;
    }

    setMsg(
      "Innsending registrert. Du finner den nå på Min side."
    );

    formEl?.reset();
  }

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 md:p-8 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Registrer bedrift
        </h1>
        <Link
          href="/me"
          className="text-sm text-[rgb(var(--muted))] hover:underline"
        >
          ← Min side
        </Link>
      </div>

      <p className="mt-3 text-sm text-[rgb(var(--muted))]">
        Innlogget som <strong>{userEmail}</strong>
      </p>

      <p className="mt-4 text-[rgb(var(--muted))] leading-relaxed">
        Send inn bedriften din til kireklame.no. Vi modererer alle innsendinger før
        publisering. Etter godkjenning kan du redigere profilen selv.
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Bedriftsnavn *</span>
          <input
            name="company_name"
            required
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
            placeholder="F.eks. Rose Project"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Nettside</span>
          <input
            name="website"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
            placeholder="https://... (valgfritt)"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Kort notat</span>
          <textarea
            name="notes"
            rows={4}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
            placeholder="Hva gjør dere, og hvordan bruker dere KI?"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-6 py-4 font-semibold shadow-soft hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Sender…" : "Send inn"}
        </button>

        {msg ? (
          <p className="text-sm text-[rgb(var(--muted))]">{msg}</p>
        ) : (
          <p className="text-xs text-[rgb(var(--muted))]">
            Innsendingen blir synlig på Min side umiddelbart.
          </p>
        )}
      </form>
    </div>
  );
}
