// src/app/_components/HeroSearch.tsx
"use client";

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
            ? "grid gap-6 lg:grid-cols-[1fr_360px] items-start pt-[10vh] pb-12"
            : "items-start pt-[10vh] pb-12"
        }
      >
        {/* LENS HERO */}
        <div className="flex flex-col items-center justify-center text-center z-10 pointer-events-auto">

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter text-white mb-12 drop-shadow-2xl">
            {locale === "en" ? "Transcend Focus" : "Finn ditt byrå."}
          </h1>

          <div className="w-full max-w-4xl lens-card p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 rounded-full">
            <svg className="w-8 h-8 text-white/50 ml-6 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={locale === "en" ? "Search for partners, tools, minds..." : "Søk etter byråer, tjenester eller verktøy..."}
              className="w-full bg-transparent border-0 text-xl md:text-2xl font-light text-white placeholder:text-white/40 focus:outline-none focus:ring-0 py-4 text-center md:text-left drop-shadow-md"
            />
            <button className="bg-white text-black hover:bg-white/90 px-10 py-5 rounded-full transition-all font-semibold tracking-wide w-full md:w-auto text-lg shadow-xl">
              {locale === "en" ? "Explore" : "Utforsk"}
            </button>
          </div>

          {/* Featured */}
          {featuredCompany?.slug ? (
            <div className="mt-16 text-sm text-white flex items-center gap-3 lens-card px-6 py-3 rounded-full">
              <span className="inline-block px-3 py-1 bg-white/10 font-medium text-[10px] uppercase tracking-widest rounded-full">
                {copy.featuredLabel}
              </span>
              <a
                href={localizePath(locale, `/selskap/${featuredCompany.slug}`)}
                className="hover:text-white/70 transition-colors font-medium tracking-wide drop-shadow-md"
              >
                {featuredCompany.name}
              </a>
            </div>
          ) : null}
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
