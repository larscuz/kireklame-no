// src/app/(catalog)/selskap/[slug]/page.tsx

import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import ClaimCta from "@/app/_components/ClaimCta";
import CoverImg from "@/app/_components/CoverImg";
import AdSlot from "@/app/_components/AdSlot";
import { getCompanyBySlug } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { siteMeta } from "@/lib/seo";
import { aiLevelLabel, priceLevelLabel, typeLabel } from "@/lib/utils";
import { getAdForPlacement } from "@/lib/ads";
import type { Metadata } from "next";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";

function normalizeVideoUrl(url: string | null): string | null {
  if (!url) return null;
  const source = url.trim();
  if (!source) return null;

  const ytEmbedMatch = source.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (ytEmbedMatch) return `https://www.youtube.com/embed/${ytEmbedMatch[1]}`;

  const ytWatchMatch = source.match(/youtube\.com\/watch\?[^#]*v=([a-zA-Z0-9_-]+)/);
  if (ytWatchMatch) return `https://www.youtube.com/embed/${ytWatchMatch[1]}`;

  const shortMatch = source.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  const shortsMatch = source.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;

  const vimeoEmbedMatch = source.match(/player\.vimeo\.com\/video\/(\d+)/);
  if (vimeoEmbedMatch) return `https://player.vimeo.com/video/${vimeoEmbedMatch[1]}`;

  const vimeoMatch = source.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  if (/^https?:\/\/.+\/embed\//i.test(source) || /^https?:\/\/player\./i.test(source)) {
    return source;
  }

  return null;
}

function isMp4Url(url: string | null): boolean {
  if (!url) return false;
  return url.toLowerCase().endsWith(".mp4") || url.toLowerCase().includes(".mp4?");
}

function isImageUrl(url: string | null): boolean {
  if (!url) return false;
  return /\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i.test(url);
}

function normalizeMediaUrl(raw: string | null | undefined): string | null {
  const s = (raw ?? "").trim();
  if (!s) return null;
  if (s.startsWith("/")) return s;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://${s}`;
}

function toAbsoluteUrl(raw: string | null | undefined): string | null {
  const s = (raw ?? "").trim();
  if (!s) return null;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://${s}`;
}

function hostFromUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function pathFromUrl(url: string | null): string {
  if (!url) return "";
  try {
    return new URL(url).pathname.toLowerCase();
  } catch {
    return "";
  }
}

function isWebsiteKind(kind: string): boolean {
  return ["website", "site", "homepage"].includes(kind);
}

function isKnownSocialHost(host: string): boolean {
  const h = host.toLowerCase();
  const domains = [
    "instagram.com",
    "instagr.am",
    "tiktok.com",
    "youtube.com",
    "youtu.be",
    "facebook.com",
    "fb.watch",
    "linkedin.com",
    "threads.net",
    "pinterest.com",
    "snapchat.com",
    "x.com",
    "twitter.com",
  ];
  return domains.some((d) => h === d || h.endsWith(`.${d}`));
}

function isSocialPlatformLink(args: { kind: string; label: string; url: string }): boolean {
  const kind = args.kind.toLowerCase();
  const label = args.label.toLowerCase();
  const url = args.url.toLowerCase();
  if (!url || url === "#") return false;
  if (kind === "client" || isWebsiteKind(kind)) return false;
  if (kind === "secondary_media") return false;

  const host = hostFromUrl(url);
  const scope = `${kind} ${label} ${url}`;

  if (!host) {
    return /(instagram|tiktok|youtube|facebook|linkedin|threads|pinterest|snapchat|reels|shorts)/i.test(
      scope
    );
  }

  if (isKnownSocialHost(host)) return true;

  return /(instagram|tiktok|youtube|facebook|linkedin|threads|pinterest|snapchat|reels|shorts)/i.test(
    scope
  );
}

function isPortraitSocialLink(args: { kind: string; label: string; url: string }): boolean {
  if (!isSocialPlatformLink(args)) return false;

  const url = args.url.toLowerCase();
  const host = hostFromUrl(url);
  const path = pathFromUrl(url);
  const scope = `${args.kind.toLowerCase()} ${args.label.toLowerCase()} ${url}`;

  if (!host) {
    return /(shorts|reel|reels|portrait|vertikal|9:16)/i.test(scope);
  }

  if (host.includes("instagram.com") || host.includes("instagr.am")) {
    return (
      path.includes("/reel/") ||
      path.includes("/reels/") ||
      path.includes("/p/") ||
      path.includes("/tv/")
    );
  }

  if (host.includes("tiktok.com")) return path.includes("/video/");

  if (host.includes("youtube.com")) return path.startsWith("/shorts/");

  if (host.includes("facebook.com") && (path.includes("/reel/") || path.includes("/reels/"))) return true;
  if (host.includes("fb.watch")) return /(reel|reels|short)/i.test(scope);

  if (host.includes("youtu.be")) {
    return /(short|shorts|reel|reels)/i.test(scope);
  }

  return false;
}

function socialPlatformLabel(url: string): string {
  const host = hostFromUrl(url) ?? "";
  const path = pathFromUrl(url);
  if ((host.includes("youtube") && path.startsWith("/shorts/")) || host.includes("youtu.be")) {
    return "YouTube Shorts";
  }
  if (host.includes("facebook") && (path.includes("/reel/") || path.includes("/reels/"))) {
    return "Facebook Reels";
  }
  if (host.includes("instagram")) return "Instagram";
  if (host.includes("tiktok")) return "TikTok";
  if (host.includes("youtube")) return "YouTube";
  if (host.includes("linkedin")) return "LinkedIn";
  if (host.includes("facebook") || host.includes("fb.watch")) return "Facebook";
  if (host.includes("threads.net")) return "Threads";
  if (host.includes("pinterest")) return "Pinterest";
  if (host.includes("snapchat")) return "Snapchat";
  return "Social";
}

// Brukes for å gjøre relative cover paths til absolutte URL-er for OG/Twitter
function toAbsoluteSiteUrl(pathOrUrl: string | null | undefined): string | null {
  const s = (pathOrUrl ?? "").trim();
  if (!s) return null;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://kireklame.no${s.startsWith("/") ? "" : "/"}${s}`;
}

function trimDescription(raw: string, maxLen = 160): string {
  const s = (raw ?? "").trim();
  if (!s) return s;
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen - 1).replace(/\s+\S*$/, "").trim() + "…";
}

// Safe JSON-LD (unngå edge-cases med "<")
function safeJsonLd(obj: unknown) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

async function getSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = await getLocale();
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) {
    return siteMeta({
      title:
        locale === "en"
          ? "Company not found – KiReklame.no"
          : "Fant ikke selskap – KiReklame.no",
      description:
        locale === "en"
          ? "Detail page in KiReklame.no – a directory for AI in advertising and creative production."
          : "Detaljside i KiReklame.no – katalog over KI i reklame og kreativ produksjon.",
      path: `/selskap/${slug}`,
    });
  }

  const name = (company.name ?? "").trim() || "Selskap";

  const rawDesc =
    (company.short_description ?? company.description ?? "").trim() ||
    (locale === "en"
      ? "Find contact info, services, and AI level for actors in advertising and creative production."
      : "Finn kontaktinfo, tjenester og AI-nivå for aktører i reklame og kreativ produksjon.");

  const desc = trimDescription(rawDesc, 160);

  // OG/Twitter image: bruk cover om vi har, ellers fallback
  const ogImage =
    toAbsoluteSiteUrl(company.cover_image) ?? "https://kireklame.no/covers/cover-1.jpg";

  const title =
    locale === "en"
      ? `${name} – AI-first advertising and creative production | KiReklame.no`
      : `${name} – AI-first reklame og kreativ produksjon | KiReklame.no`;

  // siteMeta håndterer canonical/path; vi legger på OG/Twitter eksplisitt
  const base = siteMeta({
    title,
    description: desc,
    path: `/selskap/${slug}`,
  });

  return {
    ...base,
    openGraph: {
      ...(base.openGraph ?? {}),
      title,
      description: desc,
      url: `https://kireklame.no/selskap/${slug}`,
      images: [{ url: ogImage }],
      type: "website",
      siteName: "KiReklame.no",
      locale: "nb_NO",
    },
    twitter: {
      ...(base.twitter ?? {}),
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
    },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getLocale();
  const { slug } = await params;
  const [company, companyMiniBannerAd, topBannerAd] = await Promise.all([
    getCompanyBySlug(slug),
    getAdForPlacement("company_cover_mini_banner"),
    getAdForPlacement("catalog_top_banner"),
  ]);

  if (!company) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">
          {locale === "en" ? "Company not found" : "Fant ikke selskapet"}
        </h1>
        <Link
          href={localizePath(locale, "/selskaper")}
          className="mt-4 inline-block underline"
        >
          {locale === "en" ? "Back to directory" : "Tilbake til katalog"}
        </Link>
      </div>
    );
  }

  const { data: existingClaim } = await supabaseAdmin()
    .from("claims")
    .select("id")
    .eq("company_id", company.id)
    .in("status", ["pending", "approved"])
    .maybeSingle();

  const isClaimed = !!existingClaim;

  const supabase = await getSupabase();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;

  const db = process.env.SUPABASE_SERVICE_ROLE_KEY ? supabaseAdmin() : supabase;
  const userEmail = (user?.email ?? "").toLowerCase();

  const isOwner =
    ((!!userEmail &&
      company.email &&
      company.email.toLowerCase() === userEmail) as boolean) ||
    !!(
      await db
        .from("submissions")
        .select("id")
        .eq("published_company_id", company.id)
        .eq("contact_email", userEmail)
        .maybeSingle()
    ).data;

  const cover = company.cover_image || "/covers/cover-1.jpg";
  const rawVideo = company.video_url ?? null;
  const mp4 = isMp4Url(rawVideo);
  const embedSrc = mp4 ? null : normalizeVideoUrl(rawVideo);
  const links = Array.isArray((company as any).links) ? (company as any).links : [];
  const secondaryMediaLink = links.find(
    (link: any) => String(link?.kind ?? "").toLowerCase() === "secondary_media"
  );
  const secondaryMediaUrl = normalizeMediaUrl(secondaryMediaLink?.url ?? null);
  const featuredClients: string[] = Array.from(
    new Set<string>(
      links
        .filter((link: any) => String(link?.kind ?? "").toLowerCase() === "client")
        .map((link: any) => {
          const label = String(link?.label ?? "").trim();
          if (label) return label;
          const url = String(link?.url ?? "").trim();
          if (url && url !== "#") return url;
          return "";
        })
        .filter(Boolean)
    )
  );

  const websiteRaw: string | null =
    (company as any).website ??
    (company as any).links?.find((l: any) => {
      const kind = String(l?.kind ?? "").toLowerCase();
      const label = String(l?.label ?? "").toLowerCase();
      return (
        isWebsiteKind(kind) ||
        label.includes("nettside") ||
        label.includes("website") ||
        label.includes("hjemmeside")
      );
    })?.url ??
    null;

  const websiteUrl = toAbsoluteUrl(websiteRaw);
  const websiteHost = hostFromUrl(websiteUrl);
  const socialLinkSeed = [
    ...links.map((link: any) => {
      const kind = String(link?.kind ?? "").trim().toLowerCase();
      const label = String(link?.label ?? "").trim();
      const url = normalizeMediaUrl(link?.url ?? null);
      if (!url) return null;
      if (!isSocialPlatformLink({ kind, label, url })) return null;
      return { kind, url, label };
    }),
  ].filter((item): item is { kind: string; url: string; label: string } => !!item?.url);

  const socialLinkMap = new Map<string, { kind: string; url: string; label: string }>();
  for (const item of socialLinkSeed) {
    if (!socialLinkMap.has(item.url)) socialLinkMap.set(item.url, item);
  }

  const socialLinks = Array.from(socialLinkMap.values());
  const portraitSocialLinks = socialLinks.filter((item) => isPortraitSocialLink(item));
  const portraitSocialUrlSet = new Set<string>(portraitSocialLinks.map((item) => item.url));

  const socialMediaItems = portraitSocialLinks
    .map((item, idx) => {
      const embedCandidate = normalizeVideoUrl(item.url);
      const mediaType = isImageUrl(item.url)
        ? "image"
        : isMp4Url(item.url)
          ? "mp4"
          : embedCandidate
            ? "embed"
            : "link";
      const embed = mediaType === "embed" ? embedCandidate : null;

      return {
        id: `social-${idx}`,
        url: item.url,
        label:
          item.label ||
          (locale === "en" ? "Social media" : "Sosiale medier"),
        platform: socialPlatformLabel(item.url),
        mediaType,
        embed,
      };
    })
    .slice(0, 8);

  const socialProfileItems = socialLinks
    .filter((item) => !portraitSocialUrlSet.has(item.url))
    .map((item, idx) => ({
      id: `social-profile-${idx}`,
      url: item.url,
      label: item.label || socialPlatformLabel(item.url),
      platform: socialPlatformLabel(item.url),
    }))
    .slice(0, 8);

  const secondaryMediaEmbedSrc = secondaryMediaUrl ? normalizeVideoUrl(secondaryMediaUrl) : null;

  // --- JSON-LD (Organization) ---
  const canonicalUrl = `https://kireklame.no/selskap/${slug}`;

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${canonicalUrl}#organization`,
    name: company.name,
    url: canonicalUrl,
    description: (company.short_description ?? company.description ?? "").trim() || undefined,
    sameAs: websiteUrl ? [websiteUrl] : undefined,
    address: company.location?.name
      ? {
          "@type": "PostalAddress",
          addressLocality: company.location.name,
          addressCountry: "NO",
        }
      : undefined,
    image: toAbsoluteSiteUrl(company.cover_image) ?? undefined,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {topBannerAd ? (
        <div className="mb-4">
          <AdSlot
            ad={topBannerAd}
            sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
            openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
            variant="banner"
            locale={locale}
          />
        </div>
      ) : null}

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      {/* MEDIA HEADER */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:items-start">
        <div className="space-y-5 lg:col-span-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-black">
            {!rawVideo ? (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-[rgb(var(--muted))]">
                {locale === "en" ? "No video" : "Ingen video"}
              </div>
            ) : mp4 ? (
              <video
                src={rawVideo}
                controls
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : embedSrc ? (
              <iframe
                src={embedSrc}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-[rgb(var(--muted))]">
                {locale === "en" ? "Video unavailable" : "Video utilgjengelig"}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-semibold md:text-4xl">{company.name}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[rgb(var(--muted))]">
              <span>
                {company.location?.name ?? (locale === "en" ? "Unknown location" : "Ukjent sted")}
              </span>
              <span aria-hidden>•</span>
              <span>{typeLabel(company.company_type, locale)}</span>
              <span aria-hidden>•</span>
              <span>AI: {aiLevelLabel(company.ai_level, locale)}</span>
              <span aria-hidden>•</span>
              <span>
                {locale === "en" ? "Price" : "Pris"}: {priceLevelLabel(company.price_level, locale)}
              </span>
            </div>

            <p className="mt-4 leading-relaxed text-muted">
              {company.description || company.short_description}
            </p>
          </div>
        </div>

        <aside className="flex flex-col gap-3 lg:col-span-2">
          <div className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-black">
            <div className="relative aspect-[16/10]">
              <CoverImg src={cover} alt={company.name} className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-2 bottom-2">
                <div className="rounded-xl border border-white/25 bg-black/65 p-2 backdrop-blur-md">
                  <div className="grid grid-cols-2 gap-2">
                    {company.email ? (
                      <a
                        href={localizePath(locale, `/c/contact/${slug}`)}
                        className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-black/45 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black/65"
                      >
                        {locale === "en" ? "Contact company" : "Kontakt bedrift"}
                      </a>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="inline-flex cursor-not-allowed select-none items-center justify-center rounded-lg border border-white/20 bg-black/35 px-3 py-2 text-xs font-semibold text-white/70"
                      >
                        {locale === "en" ? "Contact company" : "Kontakt bedrift"}
                      </span>
                    )}

                    {websiteUrl ? (
                      <a
                        href={localizePath(locale, `/go/${slug}`)}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-black/45 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black/65"
                      >
                        {locale === "en" ? "Visit website ↗" : "Besøk nettside ↗"}
                      </a>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="inline-flex cursor-not-allowed select-none items-center justify-center rounded-lg border border-white/20 bg-black/35 px-3 py-2 text-xs font-semibold text-white/70"
                      >
                        {locale === "en" ? "No website" : "Ingen nettside"}
                      </span>
                    )}
                  </div>
                  {websiteHost ? (
                    <p className="mt-1.5 text-center text-[11px] text-white/75">{websiteHost}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {companyMiniBannerAd ? (
            <div>
              <AdSlot
                ad={companyMiniBannerAd}
                sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
                openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
                variant="miniBanner"
                locale={locale}
              />
            </div>
          ) : null}

          <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
                {locale === "en" ? "Social media" : "Sosiale medier"}
              </h2>
              <span className="rounded-full border border-[rgb(var(--border))] px-2 py-0.5 text-[10px] font-semibold text-[rgb(var(--muted))]">
                9:16
              </span>
            </div>

            {socialMediaItems.length ? (
              <div className="flex gap-3 overflow-x-auto pb-1 lg:max-h-[46rem] lg:flex-col lg:overflow-x-visible lg:overflow-y-auto">
                {socialMediaItems.map((item) => (
                  <article
                    key={item.id}
                    className="group relative w-[42vw] min-w-[150px] max-w-[220px] shrink-0 overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] lg:w-full lg:max-w-none"
                  >
                    <div className="relative aspect-[9/16] bg-black">
                      {item.mediaType === "link" ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-full w-full flex-col justify-between bg-gradient-to-b from-[#0f1730] via-[#0a1022] to-black p-3 text-white"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75">
                            {item.platform}
                          </p>
                          <p className="text-[11px] font-medium leading-relaxed text-white/95">
                            {item.label}
                          </p>
                          <span className="inline-flex w-fit items-center rounded-md border border-white/25 bg-black/35 px-2 py-1 text-[11px] font-medium text-white">
                            {locale === "en" ? "Open media ↗" : "Åpne media ↗"}
                          </span>
                        </a>
                      ) : item.mediaType === "image" ? (
                        <img
                          src={item.url}
                          alt={item.label}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : item.mediaType === "mp4" ? (
                        <video
                          src={item.url}
                          controls
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : item.mediaType === "embed" && item.embed ? (
                        <iframe
                          src={item.embed}
                          className="h-full w-full"
                          loading="lazy"
                          allowFullScreen
                        />
                      ) : null}

                      {item.mediaType !== "link" ? (
                        <>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute right-2 top-2 rounded-full border border-white/30 bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 opacity-0 transition group-hover:opacity-100"
                          >
                            {locale === "en" ? "Open" : "Åpne"}
                          </a>

                          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-2.5 pb-2.5 pt-10 text-white">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                              {item.platform}
                            </p>
                            <p className="mt-0.5 overflow-hidden text-[11px] font-medium leading-tight text-white/95 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                              {item.label}
                            </p>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}

            {socialProfileItems.length ? (
              <div className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                  {locale === "en" ? "Social profiles" : "Sosiale profiler"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {socialProfileItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-md border border-[rgb(var(--border))] px-2.5 py-1.5 text-xs font-medium text-[rgb(var(--fg))] transition hover:bg-[rgb(var(--card))]"
                    >
                      {item.platform} ↗
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
              {locale === "en" ? "Profile ownership" : "Profil-eierskap"}
            </div>

            {!user ? (
              !isClaimed ? (
                <Link
                  href={localizePath(locale, `/claim/company/${company.slug}`)}
                  className="inline-flex items-center justify-center rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-sm font-medium transition hover:bg-[rgb(var(--bg))]"
                >
                  {locale === "en" ? "Claim company" : "Claim bedrift"}
                </Link>
              ) : (
                <p className="text-sm text-[rgb(var(--muted))]">
                  {locale === "en" ? "Already claimed" : "Allerede claimet"}
                </p>
              )
            ) : isOwner ? (
              <Link
                href={localizePath(locale, `/me/company/${company.id}`)}
                className="inline-flex items-center justify-center rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-sm font-medium transition hover:bg-[rgb(var(--bg))]"
              >
                {locale === "en" ? "Edit profile" : "Rediger profil"}
              </Link>
            ) : (
              <ClaimCta companyId={company.id} companySlug={company.slug} />
            )}
          </section>
        </aside>
      </div>

      {secondaryMediaUrl ? (
        <section className="mt-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 sm:p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
            {locale === "en" ? "More from the company" : "Mer fra bedriften"}
          </div>

          {isImageUrl(secondaryMediaUrl) ? (
            <div className="overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
              <img
                src={secondaryMediaUrl}
                alt={company.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : isMp4Url(secondaryMediaUrl) ? (
            <video
              src={secondaryMediaUrl}
              controls
              playsInline
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-black"
            />
          ) : secondaryMediaEmbedSrc ? (
            <div className="aspect-video overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-black">
              <iframe
                src={secondaryMediaEmbedSrc}
                className="h-full w-full"
                loading="lazy"
                allowFullScreen
              />
            </div>
          ) : /^https?:\/\//i.test(secondaryMediaUrl) ? (
            <div className="aspect-video overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-black">
              <iframe
                src={secondaryMediaUrl}
                className="h-full w-full"
                loading="lazy"
                allowFullScreen
              />
            </div>
          ) : (
            <a
              href={secondaryMediaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium hover:bg-[rgb(var(--bg))]"
            >
              {locale === "en" ? "Open media ↗" : "Åpne media ↗"}
            </a>
          )}
        </section>
      ) : null}

      {featuredClients.length ? (
        <section className="mt-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-soft">
          <h2 className="text-lg font-semibold tracking-tight">
            {locale === "en" ? "Clients" : "Kunder"}
          </h2>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            {locale === "en"
              ? "Selected clients the company has worked with."
              : "Utvalgte kunder bedriften har jobbet med."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {featuredClients.map((client) => (
              <span
                key={`client-${client}`}
                className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-sm"
              >
                {client}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
