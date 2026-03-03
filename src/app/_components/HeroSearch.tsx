// src/app/_components/HeroSearch.tsx
"use client";

import HeroBackgroundVideo from "./HeroBackgroundVideo";
import AdSlot from "./AdSlot";
import { localizePath, type Locale } from "@/lib/i18n";
import type { SponsorAd } from "@/lib/ads";

export default function HeroSearch({
  initialQuery,
  heroVideoUrl,
  featuredCompany,
  sponsorAd,
  sponsorMiniAd,
  locale,
  copy,
}: {
  initialQuery: string; // beholdes for kompatibilitet (kan fjernes senere)
  heroVideoUrl?: string | null;
  featuredCompany?: {
    name: string;
    slug: string;
    company_type?: string | null;
    locationName?: string | null;
  } | null;
  sponsorAd?: SponsorAd | null;
  sponsorMiniAd?: SponsorAd | null;
  locale: Locale;
  copy: {
    featuredLabel: string;
    sponsorLabel: string;
    openLinkFallback: string;
  };
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-4 pb-4">
      {/* HERO + SPONSOR SLOT */}
      <div
        className={
          sponsorAd || sponsorMiniAd
            ? "grid gap-6 lg:grid-cols-[1fr_360px] items-start"
            : "grid gap-6 items-start"
        }
      >
        {/* HERO */}
        <div className="relative min-h-[280px] md:min-h-[320px] lg:h-[360px] rounded-2xl flex items-end">
          {/* Background video */}
          <div className="absolute inset-0 mix-blend-luminosity opacity-40 rounded-2xl overflow-hidden pointer-events-none">
            <HeroBackgroundVideo src={heroVideoUrl} poster="/covers/cover-1.jpg" />
          </div>

          {/* Foreground content floating in Z-space */}
          <div className="relative z-10 p-6 md:p-12 w-full np-neon-shadow bg-black/20 backdrop-blur-md rounded-2xl border border-[rgb(var(--border))] translate-y-6 sm:translate-y-10 lg:translate-x-10 lg:w-[110%] transition-transform duration-700 hover:translate-y-4">
            {/* Featured */}
            {featuredCompany?.slug ? (
              <div className="text-sm text-[rgb(var(--muted))]">
                <span className="mr-2 inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-fuchsia-500/20 text-fuchsia-300 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                  {copy.featuredLabel}
                </span>
                <a
                  href={localizePath(locale, `/selskap/${featuredCompany.slug}`)}
                  className="font-semibold underline-offset-2 hover:underline text-[rgb(var(--fg))] drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] text-lg sm:text-2xl"
                >
                  {featuredCompany.name}
                </a>

                {featuredCompany.company_type || featuredCompany.locationName ? (
                  <span className="ml-2 text-[rgb(var(--muted))] hidden sm:inline-block">
                    {featuredCompany.company_type ? featuredCompany.company_type : ""}
                    {featuredCompany.company_type && featuredCompany.locationName ? " · " : ""}
                    {featuredCompany.locationName ? featuredCompany.locationName : ""}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {/* SPONSOR */}
        {sponsorAd || sponsorMiniAd ? (
          <>
            <div className="lg:hidden">
              {sponsorAd ? (
                <AdSlot
                  ad={sponsorAd}
                  sponsorLabel={copy.sponsorLabel}
                  openLinkFallback={copy.openLinkFallback}
                  variant="banner"
                  compact
                  locale={locale}
                />
              ) : null}
            </div>

            <div className="hidden lg:flex lg:flex-col lg:gap-3">
              {sponsorAd ? (
                <AdSlot
                  ad={sponsorAd}
                  sponsorLabel={copy.sponsorLabel}
                  openLinkFallback={copy.openLinkFallback}
                  variant="sidebar"
                  locale={locale}
                />
              ) : null}
              {sponsorMiniAd ? (
                <AdSlot
                  ad={sponsorMiniAd}
                  sponsorLabel={copy.sponsorLabel}
                  openLinkFallback={copy.openLinkFallback}
                  variant="miniBanner"
                  locale={locale}
                />
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
