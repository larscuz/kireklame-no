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
        {/* SPATIAL HERO */}
        <div className="relative min-h-[400px] md:min-h-[500px] lg:h-[600px] perspective-1000 flex flex-col items-center justify-center -mt-10">

          {/* Tilted Background Cinema */}
          <div
            className="absolute inset-x-0 -top-20 -bottom-20 -z-10 rounded-[3rem] overflow-hidden preserve-3d transition-transform duration-1000"
            style={{
              transform: "rotateX(12deg) scale(0.95) translateZ(-100px)",
              transformOrigin: "bottom center",
              boxShadow: "0 50px 100px -20px rgba(100,200,255,0.15)"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 z-10 pointer-events-none"></div>
            <HeroBackgroundVideo src={heroVideoUrl} poster="/covers/cover-1.jpg" />
          </div>

          {/* Floating UI Layer */}
          <div
            className="relative z-20 flex flex-col items-center justify-center text-center w-full max-w-4xl px-4 hover:-translate-y-2 transition-transform duration-700 pointer-events-auto"
            style={{ transform: "translateZ(50px)" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-10 drop-shadow-2xl">
              {locale === "en" ? "Transcend Focus" : "Finn ditt byrå."}
            </h1>

            <div className="glass-panel w-full max-w-3xl flex md:flex-row flex-col items-center p-2 pl-6 rounded-full mb-12 relative group hover:shadow-[0_40px_100px_rgba(255,255,255,0.1)] transition-shadow duration-500">
              <svg className="w-6 h-6 text-white/50 mr-4 shrink-0 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={locale === "en" ? "Search for partners, tools, minds..." : "Søk etter byråer, tjenester eller verktøy..."}
                className="bg-transparent text-xl md:text-2xl text-white border-0 outline-none w-full placeholder:text-white/40 focus:ring-0 py-4"
              />
              <button className="bg-white/10 hover:bg-white/20 text-white rounded-full px-8 py-4 font-semibold backdrop-blur-md transition-all ml-0 mt-4 md:mt-0 md:ml-4 border border-white/10 shrink-0 w-full md:w-auto">
                {locale === "en" ? "Explore" : "Utforsk"}
              </button>
            </div>

            {/* Featured */}
            {featuredCompany?.slug ? (
              <div className="glass-panel px-6 py-2 rounded-full flex items-center gap-3 backdrop-blur-md border border-white/10 bg-white/5 hover:-translate-y-1 transition-transform">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  {copy.featuredLabel}
                </span>
                <a
                  href={localizePath(locale, `/selskap/${featuredCompany.slug}`)}
                  className="text-sm font-semibold tracking-wide text-white hover:text-blue-200 transition-colors"
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
