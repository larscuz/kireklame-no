// src/app/tips/page.tsx
"use client";

import { useState } from "react";

export default function TipsPage() {
  const [urls, setUrls] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState<string>("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");

    try {
      const res = await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urls,
          email: email.trim() ? email.trim() : null,
          comment: comment.trim() ? comment.trim() : null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMsg(data?.error || "Noe gikk galt.");
        return;
      }

      setStatus("ok");
      setMsg("Takk! Tipset er sendt.");
      setUrls("");
      setEmail("");
      setComment("");
    } catch {
      setStatus("error");
      setMsg("Kunne ikke sende. Prøv igjen.");
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Tips oss</h1>
      <p className="mt-2 text-sm text-[rgb(var(--muted))]">
        Legg inn én eller flere URL-er (én per linje). E-post er valgfritt.
      </p>

      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">URL-er</span>
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={6}
            placeholder={"https://...\nhttps://...\nhttps://..."}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            required
          />
          <span className="text-xs text-[rgb(var(--muted))]">Tips: én URL per linje.</span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">E-post (valgfritt)</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.no"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Kommentar (valgfritt)</span>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Kort begrunnelse / ekstra info…"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center rounded-xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {status === "sending" ? "Sender…" : "Send tips"}
          </button>

          {status !== "idle" ? (
            <span className={`text-sm ${status === "error" ? "text-rose-500" : "text-[rgb(var(--muted))]"}`}>
              {msg}
            </span>
          ) : null}
        </div>
      </form>

      <p className="mt-6 text-xs text-[rgb(var(--muted))]">
        Hvis du legger inn e-post, sender vi en kort bekreftelse (når vi har aktivert det).
      </p>
    </main>
  );
}
