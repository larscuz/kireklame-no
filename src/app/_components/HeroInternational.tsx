// src/app/_components/HeroInternational.tsx
import HeroBackgroundVideo from "./HeroBackgroundVideo";
import { localizePath, type Locale } from "@/lib/i18n";
import type { SponsorAd } from "@/lib/ads";
import AdSlot from "./AdSlot";

export default function HeroInternational({
  heroVideoUrl,
  poster,
  locale,
  copy,
  sponsorAd,
  featuredCompany,
}: {
  heroVideoUrl?: string | null;
  poster?: string | null;
  locale: Locale;
  copy: {
    title: string;
    titleMuted: string;
    subtitle: string;
    cta: string;
    featuredLabel: string;
    featuredMeta: string;
    sponsorLabel: string;
    openLinkFallback: string;
  };
  sponsorAd?: SponsorAd | null;
  featuredCompany?: {
    name: string;
    slug: string;
    meta?: string | null;
  } | null;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-4 pb-4">
      <div
        className={
          sponsorAd
            ? "grid gap-6 lg:grid-cols-[1fr_360px] items-stretch"
            : "grid gap-6 items-start"
        }
      >
        <div className="relative rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft overflow-hidden">
          {/* Background video */}
          <HeroBackgroundVideo
            src={heroVideoUrl}
            poster={poster ?? "/covers/cover-1.jpg"}
          />

          {/* Foreground content */}
          <div className="relative z-10 p-6 md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                {copy.title}{" "}
                <span className="text-[rgb(var(--muted))] font-normal">
                  {copy.titleMuted}
                </span>
              </h1>

              <a
                href={localizePath(locale, "/selskaper")}
                className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-3 font-semibold shadow-soft hover:opacity-90 transition"
              >
                {copy.cta}
              </a>
            </div>

            <p className="mt-4 max-w-2xl text-[rgb(var(--muted))] leading-relaxed">
              {copy.subtitle}
            </p>

            {/* Featured */}
            {featuredCompany?.slug ? (
              <div className="mt-4 text-sm text-[rgb(var(--muted))]">
                <span className="mr-2 inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                  {copy.featuredLabel}
                </span>
                <a
                  href={localizePath(locale, `/selskap/${featuredCompany.slug}`)}
                  className="font-semibold underline-offset-2 hover:underline text-[rgb(var(--fg))]"
                >
                  {featuredCompany.name}
                </a>
                {featuredCompany.meta ? (
                  <span className="ml-2 text-[rgb(var(--muted))]">
                    {featuredCompany.meta}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Bottom divider */}
          <div className="relative z-10 h-1 bg-gradient-to-r from-black/10 via-black/0 to-black/10 dark:from-white/10 dark:via-white/0 dark:to-white/10" />
        </div>

        {sponsorAd ? (
          <>
            <div className="lg:hidden">
              <AdSlot
                ad={sponsorAd}
                sponsorLabel={copy.sponsorLabel}
                openLinkFallback={copy.openLinkFallback}
                variant="hero"
                locale={locale}
              />
            </div>
            <div className="hidden lg:block">
              <AdSlot
                ad={sponsorAd}
                sponsorLabel={copy.sponsorLabel}
                openLinkFallback={copy.openLinkFallback}
                variant="sidebar"
                locale={locale}
              />
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
