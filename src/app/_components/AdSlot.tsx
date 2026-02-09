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
  variant?: "card" | "banner" | "sidebar";
  className?: string;
  locale: "en" | "no" | "nb" | string;
}) {
  if (!ad) return null;

  const isBanner = variant === "banner";
  const isSidebar = variant === "sidebar";
  const img = isBanner ? ad.mobile_image_url ?? ad.image_url : ad.image_url;
  const label = normalizeSponsorLabel(ad.label ?? sponsorLabel, locale);

  return (
    <aside
      className={`rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft overflow-hidden ${className ?? ""}`}
    >
      <a
        href={ad.href}
        target="_blank"
        rel="noreferrer"
        className="group block"
        aria-label={`${label}: ${ad.title ?? openLinkFallback}`}
      >
        {isSidebar ? (
          <div className="relative h-full overflow-hidden bg-[rgb(var(--bg))] min-h-[260px]">
            {img ? (
              <img
                src={img}
                alt={ad.alt}
                className="absolute inset-0 h-full w-full object-cover object-center"
                loading="lazy"
              />
            ) : null}

            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />

            <div className="absolute inset-0 p-4 flex justify-end">
              <div className="flex justify-end">
                <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                  {label}
                </span>
              </div>
            </div>
          </div>
        ) : isBanner ? (
          <div className="relative overflow-hidden aspect-[16/1.9] sm:aspect-[16/1.6] bg-[rgb(var(--bg))]">
            {img ? (
              <img
                src={img}
                alt={ad.alt}
                className="absolute inset-0 h-full w-full object-contain object-center"
                loading="lazy"
              />
            ) : null}

            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/10 transition" />

            <div className="absolute inset-0 p-3 sm:p-4 flex justify-end">
              <div className="flex justify-end">
                <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                  {label}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="relative aspect-[16/11] overflow-hidden bg-[rgb(var(--bg))]">
              {img ? (
                <img
                  src={img}
                  alt={ad.alt}
                  className="absolute inset-0 h-full w-full object-contain object-center group-hover:scale-[1.02] transition duration-300"
                  loading="lazy"
                />
              ) : null}

              <div className="absolute right-3 top-3 flex gap-2">
                <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                  {label}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold tracking-tight">
                    {ad.title ?? (locale === "en" ? "Sponsored" : "Sponset")}
                  </div>
                  {ad.meta ? (
                    <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                      {ad.meta}
                    </div>
                  ) : null}
                </div>
              </div>

              {ad.description ? (
                <p className="mt-3 text-sm text-[rgb(var(--muted))] line-clamp-2">
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
