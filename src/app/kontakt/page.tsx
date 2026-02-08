// src/app/kontakt/page.tsx
import Link from "next/link";
import { siteMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";

export const metadata: Metadata = siteMeta({
  title: "Kontakt – KiReklame.no",
  description: "Kontakt KiReklame for KI‑reklame, AI‑video og markedsføring. Send oss en melding via skjema.",
  path: "/kontakt",
});

export default function ContactPage() {
  const locale = getLocale();
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 shadow-soft">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {locale === "en" ? "Contact" : "Kontakt"}
        </h1>
        <p className="mt-3 text-[rgb(var(--muted))] leading-relaxed">
          {locale === "en"
            ? "Send a message about AI advertising, AI video, or marketing. We typically reply shortly."
            : "Send en melding om KI‑reklame, AI‑video eller markedsføring. Vi svarer normalt innen kort tid."}
        </p>

        <form
          className="mt-8 grid gap-4"
          method="post"
          action="/api/contact"
        >
          <div className="grid gap-1">
            <label className="text-xs font-semibold tracking-wide text-[rgb(var(--muted))]">
              {locale === "en" ? "Name" : "Navn"}
            </label>
            <input
              name="name"
              required
              className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm outline-none"
              placeholder={locale === "en" ? "Your name" : "Ditt navn"}
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs font-semibold tracking-wide text-[rgb(var(--muted))]">
              {locale === "en" ? "Email" : "E-post"}
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
              {locale === "en" ? "Subject" : "Emne"}
            </label>
            <input
              name="subject"
              required
              className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm outline-none"
              placeholder={locale === "en" ? "What is this about?" : "Hva gjelder det?"}
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs font-semibold tracking-wide text-[rgb(var(--muted))]">
              {locale === "en" ? "Message" : "Melding"}
            </label>
            <textarea
              name="message"
              required
              rows={6}
              className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm outline-none"
              placeholder={
                locale === "en" ? "Write your message here…" : "Skriv meldingen din her…"
              }
            />
          </div>

          {/* Honeypot (anti-spam). Skjules visuelt. */}
          <div className="hidden">
            <label>
              {locale === "en" ? "Do not fill in this field" : "Ikke fyll ut dette feltet"}
              <input name="company" />
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-5 py-3 font-semibold shadow-soft hover:opacity-90 transition"
          >
            {locale === "en" ? "Send message" : "Send melding"}
          </button>

          <p className="text-xs text-[rgb(var(--muted))]">
            {locale === "en"
              ? "By submitting the form you agree that we may contact you by email to follow up."
              : "Ved å sende inn skjemaet godtar du at vi kan kontakte deg på e-post for å følge opp henvendelsen."}
          </p>
        </form>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link
            href={localizePath(locale, "/ki-reklamebyra")}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            {locale === "en" ? "AI advertising agencies" : "KI reklamebyrå"}
          </Link>
          <Link
            href={localizePath(locale, "/ai-video")}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            {locale === "en" ? "AI video production" : "AI‑video produksjon"}
          </Link>
          <Link
            href={localizePath(locale, "/ki-markedsforing")}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            {locale === "en" ? "AI marketing" : "KI markedsføring"}
          </Link>
        </div>
      </div>
    </main>
  );
}
