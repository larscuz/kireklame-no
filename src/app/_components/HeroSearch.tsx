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
            ? "grid gap-6 lg:grid-cols-[1fr_360px] items-start mb-12"
            : "grid gap-6 items-start mb-12"
        }
      >
        {/* TERMINAL HERO */}
        <div className="relative min-h-[280px] md:min-h-[320px] lg:h-[360px] terminal-card overflow-hidden">
          {/* Corrupted Background video stream */}
          <div className="absolute inset-0 mix-blend-color-dodge opacity-50 grayscale contrast-150 blur-[1px]">
            <HeroBackgroundVideo src={heroVideoUrl} poster="/covers/cover-1.jpg" />
          </div>
          <div className="absolute inset-0 bg-[#00ff00] mix-blend-overlay opacity-10"></div>

          {/* Foreground Terminal Text */}
          <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-12 font-mono">
            <h1 className="text-4xl md:text-6xl font-bold text-[#00ff00] mb-8 drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]">
              {'>'} SYSTEM.INIT(
              <span className="animate-pulse">_</span>)
            </h1>

            <div className="flex items-center text-xl md:text-3xl w-full max-w-3xl bg-black/50 border border-[#00ff00]/50 p-4">
              <span className="text-[#00ff00] font-bold mr-4 animate-pulse">{'>$'}</span>
              <input
                type="text"
                placeholder={locale === "en" ? "Enter query parameters..." : "Skriv inn søkeparametere..."}
                className="w-full bg-transparent border-0 text-[#00ff00] placeholder:text-[#00ff00]/30 focus:outline-none focus:ring-0 p-0 font-mono"
              />
            </div>

            {/* Featured */}
            {featuredCompany?.slug ? (
              <div className="mt-8 text-xs text-[#00ff00]/70 flex items-center gap-4">
                <span className="px-2 py-0.5 border border-[#00ff00]/50 bg-[#00ff00]/10">
                  {copy.featuredLabel}
                </span>
                <a
                  href={localizePath(locale, `/selskap/${featuredCompany.slug}`)}
                  className="hover:bg-[#00ff00] hover:text-black transition-colors px-1"
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
