// src/app/_components/AdSlot.tsx
"use client";

import type { SponsorAd } from "@/lib/ads";

export default function AdSlot({
  ad,
  sponsorLabel,
  openLinkFallback,
  variant = "card",
  className,
  locale,
}: {
  ad: SponsorAd | null;
  sponsorLabel: string;
  openLinkFallback: string;
  variant?: "card" | "banner" | "sidebar" | "hero";
  className?: string;
  locale: "en" | "no" | "nb" | string;
}) {
  if (!ad) return null;

  const isBanner = variant === "banner";
  const isSidebar = variant === "sidebar";
  const isHero = variant === "hero";
  const img =
    isBanner || isHero ? ad.mobile_image_url ?? ad.image_url : ad.image_url;
  const label = normalizeSponsorLabel(ad.label ?? sponsorLabel, locale);
  const title = ad.title ?? (locale === "en" ? "Sponsored" : "Sponset");

  return (
    <aside
      className={`rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft overflow-hidden ${className ?? ""}`}
    >
      <a
        href={ad.href}
        target="_blank"
        rel="noreferrer"
        className="group block touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--fg))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--card))]"
        aria-label={`${label}: ${ad.title ?? openLinkFallback}`}
      >
        {isSidebar ? (
          <div className="relative isolate h-full min-h-[190px] sm:min-h-[220px] lg:min-h-[280px] overflow-hidden bg-[rgb(var(--bg))]">
            {img ? (
              <img
                src={img}
                alt={ad.alt}
                className="absolute inset-0 h-full w-full object-cover object-center"
                style={{ objectPosition: "center center" }}
                loading="lazy"
              />
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/15 to-black/10 group-hover:from-black/20 transition" />

            <div className="absolute inset-0 p-3 sm:p-4 flex justify-end">
              <div className="flex justify-end self-start">
                <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                  {label}
                </span>
              </div>
            </div>
          </div>
        ) : isHero ? (
          <div className="relative isolate h-[122px] w-full overflow-hidden bg-[rgb(var(--bg))] sm:h-[136px]">
            {img ? (
              <img
                src={img}
                alt={ad.alt}
                className="absolute inset-0 h-full w-full object-cover object-center"
                style={{ objectPosition: "center center" }}
                loading="lazy"
              />
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-black/10 to-transparent group-hover:from-black/20 transition" />

            <div className="absolute inset-0 p-2.5 sm:p-3 flex justify-end">
              <div className="flex justify-end self-start">
                <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                  {label}
                </span>
              </div>
            </div>
          </div>
        ) : isBanner ? (
          <div className="relative isolate h-[54px] w-full overflow-hidden bg-[rgb(var(--bg))] sm:h-[62px] lg:h-[72px]">
            {img ? (
              <img
                src={img}
                alt={ad.alt}
                className="absolute inset-0 h-full w-full object-cover object-center"
                style={{ objectPosition: "center center" }}
                loading="lazy"
              />
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-t from-black/22 via-black/6 to-transparent group-hover:from-black/14 transition" />

            <div className="absolute inset-0 p-2 sm:p-3 flex justify-end">
              <div className="flex justify-end self-start">
                <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                  {label}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="relative isolate aspect-[16/10] sm:aspect-[16/11] overflow-hidden bg-[rgb(var(--bg))]">
              {img ? (
                <img
                  src={img}
                  alt={ad.alt}
                  className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-[1.02] transition duration-300"
                  loading="lazy"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-70 group-hover:opacity-55 transition" />

              <div className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 flex gap-2">
                <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                  {label}
                </span>
              </div>
            </div>

            <div className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold tracking-tight text-sm sm:text-base line-clamp-1">
                    {title}
                  </div>
                  {ad.meta ? (
                    <div className="mt-1 text-xs sm:text-sm text-[rgb(var(--muted))] line-clamp-1">
                      {ad.meta}
                    </div>
                  ) : null}
                </div>
              </div>

              {ad.description ? (
                <p className="mt-2.5 text-xs sm:text-sm text-[rgb(var(--muted))] line-clamp-2">
                  {ad.description}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </a>
    </aside>
  );
}

function normalizeSponsorLabel(label: string, locale: string) {
  if (locale !== "en") return label;
  const lowered = label.trim().toLowerCase();
  if (lowered === "sponset" || lowered === "sponset arrangement") {
    return "Sponsored";
  }
  return label;
}
