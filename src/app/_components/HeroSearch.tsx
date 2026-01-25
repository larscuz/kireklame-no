// src/app/_components/HeroSearch.tsx
"use client";

import HeroBackgroundVideo from "./HeroBackgroundVideo";

type SponsorAd = {
  id: number;
  title?: string | null;

  // Desktop (høyre kolonne)
  image_url: string;

  // Mobil (banner) – fallbacker til image_url hvis null/undefined
  mobile_image_url?: string | null;

  href: string;
  alt: string;
  label?: string | null;
  cta_text?: string | null;
};

export default function HeroSearch({
  initialQuery,
  heroVideoUrl,
  featuredCompany,
  sponsorAd,
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
}) {
  const subtitle =
    "En kuratert katalog over norske aktører som bruker AI i reklame og kreativ produksjon.";

  // Bruk banner om den finnes, ellers desktop-bilde som fallback
  const mobileImg = sponsorAd?.mobile_image_url ?? sponsorAd?.image_url ?? null;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-8">
      {/* HERO + SPONSOR SLOT */}
      <div
        className={
          sponsorAd
            ? "grid gap-6 lg:grid-cols-[1fr_360px] items-stretch"
            : "grid gap-6 items-start"
        }
      >
        {/* HERO */}
        <div className="relative min-h-[280px] md:min-h-[320px] lg:h-[360px] rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft overflow-hidden">
          {/* Background video */}
          <HeroBackgroundVideo src={heroVideoUrl} poster="/covers/cover-1.jpg" />

          {/* Foreground content */}
          <div className="relative z-10 p-6 md:p-12">
            {/* Title + CTA */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                KiReklame{" "}
                <span className="text-[rgb(var(--muted))] font-normal"> – katalog</span>
              </h1>

              <a
                href="/register/company"
                className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-3 font-semibold shadow-soft hover:opacity-90 transition"
              >
                Registrer bedrift
              </a>
            </div>

            <p className="mt-4 max-w-2xl text-[rgb(var(--muted))] leading-relaxed">
              {subtitle}
            </p>

            {/* Featured */}
            {featuredCompany?.slug ? (
              <div className="mt-6 text-sm text-[rgb(var(--muted))]">
                <span className="mr-2 inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                  Featured
                </span>
                <a
                  href={`/selskap/${featuredCompany.slug}`}
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
        {sponsorAd ? (
          <>
            {/* Mobil/tablet: banner under hero */}
            <div className="lg:hidden">
              <aside className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft overflow-hidden">
                <a
                  href={sponsorAd.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group block"
                  aria-label={`${sponsorAd.label ?? "Sponset"}: ${
                    sponsorAd.title ?? "Åpne lenke"
                  }`}
                >
                  {/* Stabil banner-høyde via aspect ratio (hindrer at bildet “blåser opp”) */}
                  <div className="relative overflow-hidden aspect-[16/4] sm:aspect-[16/3]">
                    {mobileImg ? (
                      <img
                        src={mobileImg}
                        alt={sponsorAd.alt}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                        loading="lazy"
                      />
                    ) : null}

                    {/* Mild overlay på banner (for ikke å vaske ut motivet) */}
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/10 transition" />

                    {/* Diskré label + CTA */}
                    <div className="absolute inset-0 p-3 sm:p-4 flex items-end justify-between">
                      <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                        {sponsorAd.label ?? "Sponset"}
                      </span>

                      <span className="text-xs sm:text-sm font-semibold text-white/90">
                        {sponsorAd.cta_text ?? ""}
                      </span>
                    </div>
                  </div>
                </a>
              </aside>
            </div>

            {/* Desktop: høyre kolonne – match hero-høyde (og tving bilde til ramma) */}
            <aside className="hidden lg:block rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft overflow-hidden">
              <a
                href={sponsorAd.href}
                target="_blank"
                rel="noreferrer"
                className="group block h-full"
                aria-label={`${sponsorAd.label ?? "Sponset"}: ${
                  sponsorAd.title ?? "Åpne lenke"
                }`}
              >
                <div className="relative h-full overflow-hidden">
                  <img
                    src={sponsorAd.image_url}
                    alt={sponsorAd.alt}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div>
                      <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                        {sponsorAd.label ?? "Sponset"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white/90">
                        {sponsorAd.cta_text ?? ""}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </aside>
          </>
        ) : null}
      </div>
    </section>
  );
}
