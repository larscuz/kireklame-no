// src/app/kontakt/page.tsx
import { siteMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = siteMeta({
  title: "Kontakt – KiReklame.no",
  description: "Kontakt KiReklame for KI‑reklame, AI‑video og markedsføring. Send oss en melding via skjema.",
  path: "/kontakt",
});

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 shadow-soft">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Kontakt</h1>
        <p className="mt-3 text-[rgb(var(--muted))] leading-relaxed">
          Send en melding om KI‑reklame, AI‑video eller markedsføring. Vi svarer
          normalt innen kort tid.
        </p>

        <form
          className="mt-8 grid gap-4"
          method="post"
          action="/api/contact"
        >
          <div className="grid gap-1">
            <label className="text-xs font-semibold tracking-wide text-[rgb(var(--muted))]">
              Navn
            </label>
            <input
              name="name"
              required
              className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm outline-none"
              placeholder="Ditt navn"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs font-semibold tracking-wide text-[rgb(var(--muted))]">
              E-post
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm outline-none"
              placeholder="din@epost.no"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs font-semibold tracking-wide text-[rgb(var(--muted))]">
              Emne
            </label>
            <input
              name="subject"
              required
              className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm outline-none"
              placeholder="Hva gjelder det?"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs font-semibold tracking-wide text-[rgb(var(--muted))]">
              Melding
            </label>
            <textarea
              name="message"
              required
              rows={6}
              className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm outline-none"
              placeholder="Skriv meldingen din her…"
            />
          </div>

          {/* Honeypot (anti-spam). Skjules visuelt. */}
          <div className="hidden">
            <label>
              Ikke fyll ut dette feltet
              <input name="company" />
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-5 py-3 font-semibold shadow-soft hover:opacity-90 transition"
          >
            Send melding
          </button>

          <p className="text-xs text-[rgb(var(--muted))]">
            Ved å sende inn skjemaet godtar du at vi kan kontakte deg på e-post for å følge opp henvendelsen.
          </p>
        </form>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link
            href="/ki-reklamebyra"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            KI reklamebyrå
          </Link>
          <Link
            href="/ai-video"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            AI‑video produksjon
          </Link>
          <Link
            href="/ki-markedsforing"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            KI markedsføring
          </Link>
        </div>
      </div>
    </main>
  );
}
