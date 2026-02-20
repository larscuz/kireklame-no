// src/app/(catalog)/selskap/[slug]/page.tsx

import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Separator from "@/app/_components/Separator";
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

  const ytMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return url;
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
  const secondaryMediaIsMp4 = isMp4Url(secondaryMediaUrl);
  const secondaryMediaEmbedSrc = secondaryMediaIsMp4
    ? null
    : normalizeVideoUrl(secondaryMediaUrl);
  const secondaryMediaIsImage = isImageUrl(secondaryMediaUrl);
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
        ["website", "site", "homepage"].includes(kind) ||
        label.includes("nettside") ||
        label.includes("website") ||
        label.includes("hjemmeside")
      );
    })?.url ??
    null;

  const websiteUrl = toAbsoluteUrl(websiteRaw);
  const websiteHost = hostFromUrl(websiteUrl);

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

      {/* MEDIA */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <div className="relative md:col-span-3 aspect-[16/10] overflow-hidden rounded-2xl border bg-black">
          {!rawVideo ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
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
            <iframe src={embedSrc} className="absolute inset-0 h-full w-full" allowFullScreen />
          ) : null}
        </div>

        <div className="md:col-span-2 flex flex-col gap-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border">
            <CoverImg src={cover} alt={company.name} className="h-full w-full object-cover" />
          </div>

          {companyMiniBannerAd ? (
            <AdSlot
              ad={companyMiniBannerAd}
              sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
              openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
              variant="miniBanner"
              locale={locale}
            />
          ) : null}
        </div>
      </div>

      {/* ABOUT */}
      <div className="mt-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold">{company.name}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[rgb(var(--muted))]">
          <span>{company.location?.name ?? (locale === "en" ? "Unknown location" : "Ukjent sted")}</span>
          <span aria-hidden>•</span>
          <span>{typeLabel(company.company_type, locale)}</span>
          <span aria-hidden>•</span>
          <span>AI: {aiLevelLabel(company.ai_level, locale)}</span>
          <span aria-hidden>•</span>
          <span>
            {locale === "en" ? "Price" : "Pris"}: {priceLevelLabel(company.price_level, locale)}
          </span>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <p className="text-muted">{company.description || company.short_description}</p>

          {secondaryMediaUrl ? (
            <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 sm:p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                {locale === "en" ? "More from the company" : "Mer fra bedriften"}
              </div>

              {secondaryMediaIsImage ? (
                <div className="overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
                  <img
                    src={secondaryMediaUrl}
                    alt={company.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : secondaryMediaIsMp4 ? (
                <video
                  src={secondaryMediaUrl}
                  controls
                  playsInline
                  className="w-full rounded-xl border border-[rgb(var(--border))] bg-black"
                />
              ) : secondaryMediaEmbedSrc ? (
                <div className="overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-black aspect-video">
                  <iframe
                    src={secondaryMediaEmbedSrc}
                    className="h-full w-full"
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
        </div>

        <div className="lg:col-span-4 self-start">
          <div className="rounded-xl border p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {company.email ? (
                <a
                  href={localizePath(locale, `/c/email/${slug}`)}
                  className="block text-center rounded-xl border px-4 py-3 font-semibold"
                >
                  {locale === "en" ? "Contact company" : "Kontakt bedrift"}
                </a>
              ) : (
                <div
                  aria-disabled="true"
                  className="block text-center rounded-xl border px-4 py-3 font-semibold opacity-50 cursor-not-allowed select-none"
                >
                  {locale === "en" ? "Contact company" : "Kontakt bedrift"}
                </div>
              )}

              {websiteUrl ? (
                <a
                  href={localizePath(locale, `/go/${slug}`)}
                  target="_blank"
                  rel="noopener"
                  className="block text-center rounded-lg border px-3 py-2 text-sm font-medium hover:bg-[rgb(var(--bg))]"
                >
                  {locale === "en" ? "Visit website ↗" : "Besøk nettside ↗"}
                </a>
              ) : (
                <div />
              )}
            </div>

            {websiteHost && <p className="mt-2 text-xs text-muted text-center">{websiteHost}</p>}

            <Separator className="my-4" />

            {!user ? (
              !isClaimed ? (
                <Link
                  href={localizePath(locale, `/claim/company/${company.slug}`)}
                  className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium opacity-80 hover:opacity-100 transition"
                >
                  {locale === "en" ? "Claim company" : "Claim bedrift"}
                </Link>
              ) : (
                <p className="text-sm text-muted">
                  {locale === "en" ? "Already claimed" : "Allerede claimet"}
                </p>
              )
            ) : isOwner ? (
              <Link
                href={localizePath(locale, `/me/company/${company.id}`)}
                className="block text-center rounded-xl border px-4 py-3 font-semibold"
              >
                {locale === "en" ? "Edit profile" : "Rediger profil"}
              </Link>
            ) : (
              <ClaimCta companyId={company.id} companySlug={company.slug} />
            )}
          </div>
        </div>
      </div>

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
