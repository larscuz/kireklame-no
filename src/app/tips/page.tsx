// src/app/tips/page.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function TipsPage() {
  const pathname = usePathname() || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
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
        setMsg(data?.error || (isEn ? "Something went wrong." : "Noe gikk galt."));
        return;
      }

      setStatus("ok");
      setMsg(isEn ? "Thanks! Your tip was sent." : "Takk! Tipset er sendt.");
      setUrls("");
      setEmail("");
      setComment("");
    } catch {
      setStatus("error");
      setMsg(isEn ? "Could not send. Try again." : "Kunne ikke sende. Prøv igjen.");
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">
        {isEn ? "Send a tip" : "Tips oss"}
      </h1>
      <p className="mt-2 text-sm text-[rgb(var(--muted))]">
        {isEn
          ? "Add one or more URLs (one per line). Email is optional."
          : "Legg inn én eller flere URL-er (én per linje). E-post er valgfritt."}
      </p>

      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">{isEn ? "URLs" : "URL-er"}</span>
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={6}
            placeholder={"https://...\nhttps://...\nhttps://..."}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            required
          />
          <span className="text-xs text-[rgb(var(--muted))]">
            {isEn ? "Tip: one URL per line." : "Tips: én URL per linje."}
          </span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">
            {isEn ? "Email (optional)" : "E-post (valgfritt)"}
          </span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isEn ? "you@email.com" : "din@epost.no"}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">
            {isEn ? "Comment (optional)" : "Kommentar (valgfritt)"}
          </span>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              isEn ? "Short reason / extra info…" : "Kort begrunnelse / ekstra info…"
            }
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center rounded-xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {status === "sending"
              ? isEn
                ? "Sending…"
                : "Sender…"
              : isEn
                ? "Send tip"
                : "Send tips"}
          </button>

          {status !== "idle" ? (
            <span className={`text-sm ${status === "error" ? "text-rose-500" : "text-[rgb(var(--muted))]"}`}>
              {msg}
            </span>
          ) : null}
        </div>
      </form>

      <p className="mt-6 text-xs text-[rgb(var(--muted))]">
        {isEn
          ? "If you include an email, we’ll send a short confirmation (once enabled)."
          : "Hvis du legger inn e-post, sender vi en kort bekreftelse (når vi har aktivert det)."}
      </p>
    </main>
  );
}
