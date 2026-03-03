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
            ? "grid gap-6 lg:grid-cols-[1fr_360px] items-start pt-[8vh] pb-10"
            : "items-start pt-[8vh] pb-10"
        }
      >
        {/* LIQUID CARVED HERO */}
        <div className="flex flex-col items-center justify-center text-center z-10 pointer-events-auto">

          <h1
            className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-10 liquid-blob"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2)) drop-shadow(0 0 40px rgba(100,200,255,0.1))' }}
          >
            {locale === "en" ? "Mutate." : "Muter."}
          </h1>

          <div className="w-full max-w-3xl relative liquid-blob animation-duration-[18s]">
            <div className="liquid-card p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] shadow-[inset_0_0_40px_rgba(0,0,0,0.6),0_10px_30px_rgba(0,0,0,0.3)] border-white/5">
              <span className="text-white/30 font-black text-2xl hidden md:block opacity-50 wobble mix-blend-screen px-4">?</span>
              <input
                type="text"
                placeholder={locale === "en" ? "Feed the syntax..." : "Mat syntaksen..."}
                className="w-full bg-transparent border-0 text-xl md:text-2xl font-bold text-white placeholder:text-white/30 placeholder:font-normal focus:outline-none focus:ring-0 py-4 text-center md:text-left"
              />
              <button
                className="bg-white/5 hover:bg-white/20 text-white px-8 py-5 transition-all font-bold tracking-widest uppercase border border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.1)] w-full md:w-auto"
                style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
              >
                {locale === "en" ? "Inject" : "Injisering"}
              </button>
            </div>
          </div>

          {/* Featured */}
          {featuredCompany?.slug ? (
            <div className="mt-12 text-sm text-white flex items-center gap-3 liquid-card px-6 py-3 border-white/5 rounded-[30%_70%_50%_50%/50%_50%_70%_30%]">
              <span className="inline-block px-2 py-1 bg-white/10 font-bold text-[9px] uppercase tracking-widest rounded-[50%_50%_30%_70%/70%_30%_50%_50%]">
                {copy.featuredLabel}
              </span>
              <a
                href={localizePath(locale, `/selskap/${featuredCompany.slug}`)}
                className="hover:text-[#aaccff] transition-colors font-extrabold tracking-tight"
                style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}
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
