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
            ? "grid gap-6 lg:grid-cols-[1fr_360px] items-start pt-[10vh] pb-10"
            : "items-start pt-[10vh] pb-10"
        }
      >
        {/* CENTERED FLOATING GLASS PILL HERO */}
        <div className="flex flex-col items-center justify-center text-center z-10 pointer-events-auto">

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-8 drop-shadow-2xl">
            {locale === "en" ? "Explore the latent space." : "Utforsk det latente rommet."}
          </h1>

          <div className="w-full max-w-3xl relative animate-float">
            <div className="glass-pill flex items-center p-2 pl-6 md:pl-8 overflow-hidden">
              <span className="text-white/50 font-mono text-xl mr-4">&gt;</span>
              <input
                type="text"
                placeholder={locale === "en" ? "Search for an AI agency..." : "Søk etter et KI-byrå..."}
                className="w-full bg-transparent border-0 text-xl md:text-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-0 py-4"
              />
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full transition-colors font-medium ml-4 border border-white/10">
                {locale === "en" ? "Search" : "Søk"}
              </button>
            </div>
          </div>

          {/* Featured */}
          {featuredCompany?.slug ? (
            <div className="mt-8 text-sm text-white/60 flex items-center gap-3 bg-white/5 rounded-full px-4 py-2 border border-white/10 backdrop-blur-md">
              <span className="inline-block px-2 py-0.5 bg-white/20 text-white font-semibold text-[10px] uppercase rounded-full tracking-wider">
                {copy.featuredLabel}
              </span>
              <a
                href={localizePath(locale, `/selskap/${featuredCompany.slug}`)}
                className="hover:text-white transition-colors font-medium"
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
