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
            ? "grid gap-6 lg:grid-cols-[1fr_360px] items-start mb-20"
            : "grid gap-6 items-start mb-20"
        }
      >
        {/* FLUID HERO */}
        <div className="relative min-h-[500px] flex flex-col justify-end p-8 md:p-16 overflow-hidden rounded-[3rem] liquid-hover-swell group">

          {/* Underlay Video */}
          <div className="absolute inset-0 z-0">
            <HeroBackgroundVideo src={heroVideoUrl} poster="/covers/cover-1.jpg" />
            <div className="absolute inset-0 bg-black/30 pointer-events-none transition-opacity duration-700 group-hover:bg-black/10"></div>
          </div>

          {/* Foreground minimal UI */}
          <div className="relative z-10 w-full max-w-4xl">
            {/* Featured */}
            {featuredCompany?.slug ? (
              <div className="mt-12 flex items-center gap-4 text-white/50 font-bold uppercase tracking-widest text-sm">
                <span>{copy.featuredLabel}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <a
                  href={localizePath(locale, `/selskap/${featuredCompany.slug}`)}
                  className="text-white hover:text-white/70 transition-colors pointer-events-auto liquid-hover-swell"
                >
                  {featuredCompany.name}
                </a>
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
