// src/app/om/page.tsx
import Link from "next/link";
import { siteMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = siteMeta({
  title: "Om – KiReklame.no",
  description:
    "Hvorfor KiReklame finnes: en kuratert katalog over norske AI-first aktører i reklame og kreativ produksjon.",
  path: "/om",
});

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 shadow-soft">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Om KiReklame</h1>
        <p className="mt-3 text-[rgb(var(--muted))] leading-relaxed">
          KiReklame er en kuratert katalog over norske byråer, studioer og miljøer som bruker AI i
          kommersiell kreativ produksjon.
        </p>

        <div className="mt-8 space-y-4 text-sm md:text-base leading-relaxed">
          <p>
            KiReklame finnes fordi reklamefeltet er i ferd med å endre seg raskt – og AI er ikke
            lenger et “om”, men et “når” og “hvordan”.
          </p>

          <p>
            I GullhAIen 2025 ble det ikke delt ut noen priser i kategorien{" "}
            <em>«Film – kommersiell»</em> (reklamefilm og content). Det kan tolkes som at AI-generert
            film ennå ikke har satt seg i den norske reklamebransjen på en tydelig måte. Samtidig er
            det nettopp derfor denne katalogen er viktig nå: 2026 kommer til å bli et skifteår, og
            de mest AI-first aktørene vil i stor grad forme hva “normalen” blir.
          </p>

          <p>
            KiReklame samler de som allerede jobber i skjæringspunktet mellom kreativitet, produksjon
            og nye verktøy – og gjør dem enklere å finne. Du kan filtrere på AI-nivå, pris, type og
            sted, og bruke katalogen som et utgangspunkt for samarbeid, inspirasjon og kjøp av
            tjenester.
          </p>

          <p className="text-[rgb(var(--muted))]">
            Listen er under oppbygging. Hvis du mener din bedrift hører hjemme her, kan du registrere
            den – eller ta kontakt.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/register/company"
            className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-5 py-3 font-semibold shadow-soft hover:opacity-90 transition"
          >
            Registrer bedrift
          </Link>

          <Link
            href="/selskaper"
            className="inline-flex items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-5 py-3 font-semibold shadow-soft hover:shadow-lift transition"
          >
            Utforsk katalogen
          </Link>
        </div>
      </div>
    </main>
  );
}
