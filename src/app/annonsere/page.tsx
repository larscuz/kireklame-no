import type { Metadata } from "next";
import Link from "next/link";
import { siteMeta } from "@/lib/seo";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  AD_PLACEMENTS,
  placementFormatLabel,
  placementTierLabel,
  type PlacementDefinition,
} from "@/lib/adPlacements";

export const metadata: Metadata = siteMeta({
  title: "Annonsere på KiReklame | Synlige annonseplasser",
  description:
    "Se tilgjengelige annonseplasser på KiReklame. Oversikt over plassering, synlighetsnivå, varighet og enkel kontakt for booking.",
  path: "/annonsere",
});

type AdSnapshot = {
  id: number;
  placement: string;
  title: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
};

type PlacementStats = {
  totalCampaigns: number;
  activeNowCount: number;
  upcomingCount: number;
  activeNowTitles: string[];
};

function parseTime(value: string | null) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isActiveNow(ad: AdSnapshot, nowMs: number) {
  if (!ad.is_active) return false;
  const starts = parseTime(ad.starts_at);
  const ends = parseTime(ad.ends_at);
  if (starts !== null && starts > nowMs) return false;
  if (ends !== null && ends < nowMs) return false;
  return true;
}

function isUpcoming(ad: AdSnapshot, nowMs: number) {
  if (!ad.is_active) return false;
  const starts = parseTime(ad.starts_at);
  return starts !== null && starts > nowMs;
}

function buildPlacementStats(adRows: AdSnapshot[]) {
  const now = Date.now();
  const statsByPlacement = new Map<string, PlacementStats>();

  for (const ad of adRows) {
    const current = statsByPlacement.get(ad.placement) ?? {
      totalCampaigns: 0,
      activeNowCount: 0,
      upcomingCount: 0,
      activeNowTitles: [],
    };

    current.totalCampaigns += 1;
    if (isActiveNow(ad, now)) {
      current.activeNowCount += 1;
      if (ad.title) current.activeNowTitles.push(ad.title);
    }
    if (isUpcoming(ad, now)) {
      current.upcomingCount += 1;
    }

    statsByPlacement.set(ad.placement, current);
  }

  return statsByPlacement;
}

function availabilityLabel(
  stats: PlacementStats,
  locale: "no" | "en"
): { label: string; tone: string; detail: string } {
  if (stats.activeNowCount === 0 && stats.upcomingCount === 0) {
    return {
      label: locale === "en" ? "Open now" : "Ledig nå",
      tone: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
      detail:
        locale === "en"
          ? "No active campaign in this placement."
          : "Ingen aktiv kampanje i denne plasseringen.",
    };
  }

  if (stats.activeNowCount === 0 && stats.upcomingCount > 0) {
    return {
      label: locale === "en" ? "Scheduled" : "Planlagt",
      tone: "text-amber-300 border-amber-500/30 bg-amber-500/10",
      detail:
        locale === "en"
          ? "Upcoming campaign exists, but no live campaign right now."
          : "Det finnes planlagt kampanje, men ingen aktiv akkurat nå.",
    };
  }

  if (stats.activeNowCount > 0 && stats.upcomingCount > 0) {
    return {
      label: locale === "en" ? "High demand" : "Høy etterspørsel",
      tone: "text-orange-300 border-orange-500/30 bg-orange-500/10",
      detail:
        locale === "en"
          ? "Live campaign plus upcoming schedule."
          : "Aktiv kampanje kombinert med fremtidig planlegging.",
    };
  }

  return {
    label: locale === "en" ? "Running now" : "Aktiv nå",
    tone: "text-sky-300 border-sky-500/30 bg-sky-500/10",
    detail:
      locale === "en"
        ? "Placement currently has a live campaign."
        : "Plasseringen har en aktiv kampanje.",
  };
}

function getTiers(locale: "no" | "en") {
  return [
    {
      key: "starter",
      name: locale === "en" ? "Starter" : "Start",
      description:
        locale === "en"
          ? "Entry-level visibility for sustained presence."
          : "Inngangsnivå for jevn tilstedeværelse.",
    },
    {
      key: "standard",
      name: locale === "en" ? "Standard" : "Standard",
      description:
        locale === "en"
          ? "Balanced reach for broad campaign visibility."
          : "Balansert rekkevidde for bred kampanjesynlighet.",
    },
    {
      key: "premium",
      name: locale === "en" ? "Premium" : "Premium",
      description:
        locale === "en"
          ? "High-impact placements with strongest visibility."
          : "Høy-eksponerte plasseringer med sterkest synlighet.",
    },
  ];
}

export default async function AdvertisePage() {
  const locale = await getLocale();
  const contactPath = localizePath(locale, "/kontakt");

  const { data, error } = await supabaseAdmin()
    .from("ads")
    .select("id, placement, title, is_active, starts_at, ends_at")
    .order("placement", { ascending: true });

  const adRows = (data ?? []) as AdSnapshot[];
  const statsByPlacement = buildPlacementStats(adRows);

  const knownPlacementKeys = new Set(AD_PLACEMENTS.map((placement) => placement.key));
  const unknownPlacements = [...new Set(adRows.map((ad) => ad.placement))]
    .filter((placement) => placement && !knownPlacementKeys.has(placement))
    .sort((a, b) => a.localeCompare(b, "nb-NO"))
    .map(
      (placement): PlacementDefinition => ({
        key: placement,
        name: { no: placement, en: placement },
        description: {
          no: "Plassering funnet i databasen, men mangler manuell klassifisering.",
          en: "Placement found in the database but not yet manually classified.",
        },
        surfaces: {
          no: ["Ikke klassifisert"],
          en: ["Unclassified surface"],
        },
        format: "banner",
        tier: "standard",
        durationsDays: [7, 14, 30],
      })
    );

  const placements = [...AD_PLACEMENTS, ...unknownPlacements];
  const tierCards = getTiers(locale);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {locale === "en" ? "Advertise on KiReklame" : "Annonsere på KiReklame"}
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-[rgb(var(--muted))] sm:text-base">
              {locale === "en"
                ? "This page is generated from active placement definitions and ad inventory data. Update placements in admin/DB, and this overview updates automatically."
                : "Denne siden bygges fra aktive plasseringer og annonseoversikt i databasen. Endrer dere plasseringer i admin/DB, oppdateres oversikten automatisk."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={contactPath}
              className="inline-flex items-center rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition"
            >
              {locale === "en" ? "Contact sales" : "Kontakt salg"}
            </Link>
            <a
              href={`mailto:kontakt@kireklame.no?subject=${encodeURIComponent(
                locale === "en"
                  ? "Advertise on KiReklame"
                  : "Annonsere på KiReklame"
              )}`}
              className="inline-flex items-center rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold hover:bg-[rgb(var(--bg))] transition"
            >
              kontakt@kireklame.no
            </a>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft sm:p-8">
        <h2 className="text-xl font-semibold">
          {locale === "en" ? "Visibility hierarchy" : "Synlighetshierarki"}
        </h2>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          {locale === "en"
            ? "Price levels are handled in dialogue. This hierarchy shows relative exposure level without publishing rates."
            : "Prisnivå avtales i dialog. Hierarkiet under viser relativ eksponering uten publiserte priser."}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {tierCards.map((tier) => (
            <div
              key={`tier-${tier.key}`}
              className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-4"
            >
              <div className="text-sm font-semibold">{tier.name}</div>
              <p className="mt-2 text-sm text-[rgb(var(--muted))]">{tier.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">
            {locale === "en" ? "Available ad spaces" : "Tilgjengelige annonseplasser"}
          </h2>
          <div className="text-xs text-[rgb(var(--muted))]">
            {locale === "en"
              ? `${placements.length} placement options`
              : `${placements.length} plasseringsvalg`}
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {locale === "en"
              ? `Could not read ad inventory: ${error.message}`
              : `Kunne ikke lese annonseoversikt: ${error.message}`}
          </div>
        ) : null}

        <div className="mt-4 grid gap-4">
          {placements.map((placement) => {
            const stats = statsByPlacement.get(placement.key) ?? {
              totalCampaigns: 0,
              activeNowCount: 0,
              upcomingCount: 0,
              activeNowTitles: [],
            };
            const availability = availabilityLabel(stats, locale);
            const durationLabels = placement.durationsDays.map((days) =>
              locale === "en" ? `${days} days` : `${days} dager`
            );

            return (
              <article
                key={`placement-card-${placement.key}`}
                className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {placement.name[locale]}
                    </h3>
                    <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                      {placement.description[locale]}
                    </p>
                    <div className="mt-2 inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2.5 py-1 font-mono text-[11px] text-[rgb(var(--muted))]">
                      {placement.key}
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${availability.tone}`}
                  >
                    {availability.label}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-[rgb(var(--muted))]">
                      {locale === "en" ? "Format" : "Format"}
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {placementFormatLabel(placement.format, locale)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-[rgb(var(--muted))]">
                      {locale === "en" ? "Visibility level" : "Synlighetsnivå"}
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {placementTierLabel(placement.tier, locale)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-[rgb(var(--muted))]">
                      {locale === "en" ? "Duration options" : "Varighetsvalg"}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {durationLabels.map((durationLabel) => (
                        <span
                          key={`${placement.key}-${durationLabel}`}
                          className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-0.5 text-xs"
                        >
                          {durationLabel}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-[rgb(var(--muted))]">
                      {locale === "en" ? "Placement status" : "Plasseringsstatus"}
                    </div>
                    <div className="mt-1 text-sm font-medium">{availability.detail}</div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-[1fr,auto]">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-[rgb(var(--muted))]">
                      {locale === "en" ? "Shown on" : "Vises på"}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {placement.surfaces[locale].map((surface) => (
                        <span
                          key={`${placement.key}-surface-${surface}`}
                          className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-0.5 text-xs"
                        >
                          {surface}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-[rgb(var(--muted))]">
                      {locale === "en"
                        ? `Campaigns in DB: ${stats.totalCampaigns} · Active now: ${stats.activeNowCount} · Upcoming: ${stats.upcomingCount}`
                        : `Kampanjer i DB: ${stats.totalCampaigns} · Aktiv nå: ${stats.activeNowCount} · Fremtidige: ${stats.upcomingCount}`}
                    </div>
                    {stats.activeNowTitles.length ? (
                      <div className="mt-1 text-xs text-[rgb(var(--muted))]">
                        {locale === "en" ? "Current titles:" : "Aktive titler:"}{" "}
                        {stats.activeNowTitles.slice(0, 3).join(", ")}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`${contactPath}?placement=${encodeURIComponent(placement.key)}`}
                      className="inline-flex items-center rounded-xl bg-[rgb(var(--fg))] px-3 py-2 text-xs font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition"
                    >
                      {locale === "en" ? "Request this slot" : "Be om denne plassen"}
                    </Link>
                    <a
                      href={`mailto:kontakt@kireklame.no?subject=${encodeURIComponent(
                        locale === "en"
                          ? `Placement inquiry: ${placement.key}`
                          : `Forespørsel annonseplass: ${placement.key}`
                      )}`}
                      className="inline-flex items-center rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs font-semibold hover:bg-[rgb(var(--bg))] transition"
                    >
                      {locale === "en" ? "Email sales" : "Send e-post"}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
