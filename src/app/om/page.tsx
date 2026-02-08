// src/app/om/page.tsx
import Link from "next/link";
import { siteMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";

export const metadata: Metadata = siteMeta({
  title: "Om – KiReklame.no",
  description:
    "Hvorfor KiReklame finnes: en kuratert katalog over norske KI‑byråer og AI‑first aktører i reklame, video og kreativ produksjon.",
  path: "/om",
});

export default function AboutPage() {
  const locale = getLocale();
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 shadow-soft">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {locale === "en" ? "About KiReklame" : "Om KiReklame"}
        </h1>
        <p className="mt-3 text-[rgb(var(--muted))] leading-relaxed">
          {locale === "en"
            ? "KiReklame is a curated directory of Norwegian agencies, studios, and collectives that use AI in commercial creative production."
            : "KiReklame er en kuratert katalog over norske byråer, studioer og miljøer som bruker AI i kommersiell kreativ produksjon."}
        </p>

        <div className="mt-8 space-y-4 text-sm md:text-base leading-relaxed">
          <p>
            {locale === "en"
              ? "KiReklame exists because advertising is changing fast — and AI is no longer an “if” but a “when” and “how”."
              : "KiReklame finnes fordi reklamefeltet er i ferd med å endre seg raskt – og AI er ikke lenger et “om”, men et “når” og “hvordan”."}
          </p>

          <p>
            {locale === "en" ? (
              <>
                In GullhAIen 2025, no prizes were awarded in the category{" "}
                <em>“Film – commercial”</em> (commercials and content). That can be read as AI‑generated
                film not yet taking a clear position in the Norwegian advertising industry. That’s exactly why this directory matters now: 2026 will be a shift year, and the most AI‑first players will largely shape what becomes “normal”.
              </>
            ) : (
              <>
                I GullhAIen 2025 ble det ikke delt ut noen priser i kategorien{" "}
                <em>«Film – kommersiell»</em> (reklamefilm og content). Det kan tolkes som at AI-generert
                film ennå ikke har satt seg i den norske reklamebransjen på en tydelig måte. Samtidig er
                det nettopp derfor denne katalogen er viktig nå: 2026 kommer til å bli et skifteår, og
                de mest AI-first aktørene vil i stor grad forme hva “normalen” blir.
              </>
            )}
          </p>

          <p>
            {locale === "en"
              ? "KiReklame gathers those already working at the intersection of creativity, production, and new tools — and makes them easier to find. You can filter by AI level, price, type, and location, and use the directory as a starting point for collaboration, inspiration, and sourcing services."
              : "KiReklame samler de som allerede jobber i skjæringspunktet mellom kreativitet, produksjon og nye verktøy – og gjør dem enklere å finne. Du kan filtrere på AI-nivå, pris, type og sted, og bruke katalogen som et utgangspunkt for samarbeid, inspirasjon og kjøp av tjenester."}
          </p>

          <p className="text-[rgb(var(--muted))]">
            {locale === "en"
              ? "The list is growing. If your company belongs here, you can register it — or get in touch."
              : "Listen er under oppbygging. Hvis du mener din bedrift hører hjemme her, kan du registrere den – eller ta kontakt."}
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href={localizePath(locale, "/register/company")}
            className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-5 py-3 font-semibold shadow-soft hover:opacity-90 transition"
          >
            {locale === "en" ? "Register company" : "Registrer bedrift"}
          </Link>

          <Link
            href={localizePath(locale, "/selskaper")}
            className="inline-flex items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-5 py-3 font-semibold shadow-soft hover:shadow-lift transition"
          >
            {locale === "en" ? "Explore the directory" : "Utforsk katalogen"}
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
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
