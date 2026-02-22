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
        <div className="relative min-h-[280px] md:min-h-[320px] lg:h-[360px] rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft overflow-hidden">
          {/* Background video */}
          <HeroBackgroundVideo src={heroVideoUrl} poster="/covers/cover-1.jpg" />

          {/* Foreground content */}
          <div className="relative z-10 flex h-full items-end p-6 md:p-12">
            {/* Featured */}
            {featuredCompany?.slug ? (
              <div className="text-sm text-[rgb(var(--muted))]">
                <span className="mr-2 inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                  {copy.featuredLabel}
                </span>
                <a
                  href={localizePath(locale, `/selskap/${featuredCompany.slug}`)}
                  className="font-semibold underline-offset-2 hover:underline text-[rgb(var(--fg))]"
                >
                  {featuredCompany.name}
                </a>

                {featuredCompany.company_type || featuredCompany.locationName ? (
                  <span className="ml-2 text-[rgb(var(--muted))]">
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
                  variant="hero"
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
