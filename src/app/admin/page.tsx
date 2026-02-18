// src/app/admin/page.tsx
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const Card = ({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) => (
  <Link
    href={href}
    className="block rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft hover:shadow-lift transition"
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-lg font-semibold">{title}</div>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">{desc}</p>
      </div>
      <span className="text-sm text-[rgb(var(--muted))]">Åpne ↗</span>
    </div>
  </Link>
);

export default async function AdminDashboardPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Super-admin verktøy for KiReklame.
          </p>
        </div>

        <Link className="underline text-sm" href="/">
          ← Til forsiden
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card
          href="/admin/ki-avis"
          title="KiR Nyheter CMS"
          desc="Rediger og publiser saker til KiR Nyheter."
        />
        <Card
          href="/admin/ki-avis/layout"
          title="KiR Forside-layout"
          desc="Plasser hovedsak og Forside nå-slots visuelt uten lang scrolling."
        />
        <Card
          href="/admin/showheel"
          title="Showheel CMS"
          desc="Visuell kontroll på /ki-reklame: legg til, fjern og sjekk duplikater."
        />
        <Card
          href="/admin/settings"
          title="Innstillinger"
          desc="Featured selskap + hero video på forsiden."
        />
        <Card
          href="/admin/ads"
          title="Annonser"
          desc="Legg til og administrer annonse-plasseringer."
        />
        <Card
          href="/admin/moderate"
          title="Moderering"
          desc="Godkjenn/avslå innsendinger og publisering."
        />
        <Card
          href="/admin/claims"
          title="Claims"
          desc="Godkjenn/avslå hvem som kan redigere bedrifter."
        />
        <Card
          href="/admin/companies"
          title="Selskaper"
          desc="Admin-visning av selskaper (status, lenker, redigering)."
        />
        <Card
          href="/admin/outreach"
          title="Outreach"
          desc="Send personlige e-poster med cover image."
        />
      </div>
    </main>
  );
}
