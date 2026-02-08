import type { Metadata } from "next";
import { supabaseServerClient } from "@/lib/supabase/server";
import { siteMeta } from "@/lib/seo";
import { getLocale } from "@/lib/i18n.server";

export const metadata: Metadata = siteMeta({
  title: "Andre KI‑tjenester – Norge | KiReklame",
  description:
    "En kuratert oversikt over AI‑first selskaper i Norge utenfor reklame- og mediebransjen.",
  path: "/andre-ki-tjenester",
});

type AdLead = {
  id: string;
  name: string;
  website: string | null;
  description: string | null;
};

export default async function OtherAiServicesPage() {
  const locale = await getLocale();
  const supabase = await supabaseServerClient();
  const { data, error } = await supabase
    .from("ad_leads")
    .select("id,name,website,description")
    .order("name", { ascending: true });

  const leads: AdLead[] = (data ?? []) as AdLead[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="relative overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.16),transparent_50%)]" />
        <div className="relative px-6 py-10 sm:px-10">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
            <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1">
              {locale === "en" ? "Norway" : "Norge"}
            </span>
            <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1">
              AI‑first
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {locale === "en" ? "Other AI services" : "Andre KI‑tjenester"}
          </h1>
          <p className="mt-3 max-w-2xl text-[rgb(var(--muted))]">
            {locale === "en"
              ? "A curated overview of AI-first companies in Norway outside the advertising and media industry. The goal is to give the public a clear map of who is actually building AI as a core product."
              : "En kuratert oversikt over AI‑first selskaper i Norge utenfor reklame- og mediebransjen. Formålet er å gi publikum et klart kart over hvem som faktisk bygger AI som kjerneprodukt."}
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm shadow-soft">
            <span className="text-[rgb(var(--muted))]">
              {locale === "en" ? "Number of listings" : "Antall oppføringer"}
            </span>
            <span className="rounded-full bg-[rgb(var(--fg))] px-2.5 py-0.5 text-xs font-semibold text-[rgb(var(--bg))]">
              {leads.length}
            </span>
          </div>
        </div>
      </section>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-300/40 bg-rose-50/60 p-5 text-sm text-rose-700">
          {locale === "en"
            ? `Could not fetch listings: ${error.message}`
            : `Kunne ikke hente oppføringer: ${error.message}`}
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="group relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="absolute right-4 top-4 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
              AI‑first
            </div>
            <div className="text-lg font-semibold tracking-tight">{lead.name}</div>
            {lead.description ? (
              <div className="mt-2 text-sm text-[rgb(var(--muted))] line-clamp-3">
                {lead.description}
              </div>
            ) : (
              <div className="mt-2 text-sm text-[rgb(var(--muted))]">
                {locale === "en" ? "Independent AI service in Norway" : "Uavhengig KI‑tjeneste i Norge"}
              </div>
            )}
            {lead.website ? (
              <a
                href={lead.website}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm font-medium text-indigo-500 transition hover:text-indigo-600"
              >
                {locale === "en" ? "Visit website →" : "Besøk nettside →"}
              </a>
            ) : (
              <div className="mt-4 text-sm text-[rgb(var(--muted))]">
                {locale === "en" ? "Website missing" : "Nettside mangler"}
              </div>
            )}
          </div>
        ))}
        {!leads.length && !error ? (
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 text-[rgb(var(--muted))] shadow-soft">
            {locale === "en" ? "No listings yet." : "Ingen oppføringer ennå."}
          </div>
        ) : null}
      </div>
    </div>
  );
}
