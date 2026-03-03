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
            ? "grid gap-12 lg:grid-cols-[1fr_300px] items-start pt-[5vh] pb-16 border-b-4 border-[rgb(var(--border))] mb-16"
            : "items-start pt-[5vh] pb-16 border-b-4 border-[rgb(var(--border))] mb-16"
        }
      >
        {/* EDITORIAL HERO */}
        <div className="flex flex-col z-10">

          <h1 className="text-6xl md:text-8xl lg:text-[7rem] leading-[0.85] font-black uppercase tracking-tighter text-[rgb(var(--fg))] mb-10">
            {locale === "en" ? (
              <>Find Your<br /><span className="text-[rgb(var(--np-accent))]">Syntax</span></>
            ) : (
              <>Finn Ditt<br /><span className="text-[rgb(var(--np-accent))]">Byrå</span></>
            )}
          </h1>

          <div className="w-full max-w-2xl relative">
            <input
              type="text"
              placeholder={locale === "en" ? "Search agencies, tools, locations..." : "Søk etter byråer, verktøy, sted..."}
              className="w-full bg-transparent border-0 border-b-4 border-[rgb(var(--border))] text-xl md:text-3xl font-bold text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] focus:outline-none focus:ring-0 focus:border-[rgb(var(--np-accent))] transition-colors py-4 px-0 rounded-none"
            />
          </div>

          {/* Featured */}
          {featuredCompany?.slug ? (
            <div className="mt-12 text-sm text-[rgb(var(--muted))] flex flex-col items-start gap-2">
              <span className="inline-block font-bold text-[10px] uppercase tracking-widest text-[rgb(var(--np-accent))]">
                {copy.featuredLabel}
              </span>
              <a
                href={localizePath(locale, `/selskap/${featuredCompany.slug}`)}
                className="text-2xl font-black uppercase tracking-tighter hover:text-[rgb(var(--np-accent))] transition-colors"
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
