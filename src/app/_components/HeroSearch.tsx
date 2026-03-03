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
            ? "grid gap-6 lg:grid-cols-[1fr_360px] items-start pt-20 pb-10"
            : "items-start pt-20 pb-10"
        }
      >
        {/* MONOLITHIC HERO LOGIC */}
        <div className="flex flex-col justify-center h-[50vh] min-h-[400px] z-10 pointer-events-auto mix-blend-difference text-white">
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter uppercase leading-none mb-6">
            {locale === "en" ? "Index." : "Katalog."}
          </h1>

          <div className="w-full max-w-4xl relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl md:text-4xl lg:text-5xl font-mono opacity-50">
              &gt;_
            </span>
            <input
              type="text"
              placeholder={locale === "en" ? "SEARCH AGENCIES" : "SØK BYRÅER"}
              className="w-full bg-transparent border-0 border-b-2 border-white/30 text-2xl md:text-4xl lg:text-5xl font-mono uppercase py-4 pl-12 md:pl-20 focus:outline-none focus:border-white transition-colors"
            // In a real implementation this would tie back to the search state
            />
          </div>

          {/* Featured */}
          {featuredCompany?.slug ? (
            <div className="mt-12 text-sm text-[rgba(255,255,255,0.6)] font-mono uppercase tracking-widest flex items-center gap-4">
              <span className="inline-block px-3 py-1 bg-white text-black font-bold text-xs">{copy.featuredLabel}</span>
              <a
                href={localizePath(locale, `/selskap/${featuredCompany.slug}`)}
                className="hover:text-white transition-colors"
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
