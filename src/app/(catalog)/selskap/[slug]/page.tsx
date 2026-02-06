// src/app/(catalog)/selskap/[slug]/page.tsx

import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Separator from "@/app/_components/Separator";
import ClaimCta from "@/app/_components/ClaimCta";
import CoverImg from "@/app/_components/CoverImg";
import { getCompanyBySlug } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { siteMeta } from "@/lib/seo";
import { aiLevelLabel, priceLevelLabel, typeLabel } from "@/lib/utils";
import type { Metadata } from "next";

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
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) {
    return siteMeta({
      title: "Fant ikke selskap – KiReklame.no",
      description:
        "Detaljside i KiReklame.no – katalog over KI i reklame og kreativ produksjon.",
      path: `/selskap/${slug}`,
    });
  }

  const name = (company.name ?? "").trim() || "Selskap";

  const rawDesc =
    (company.short_description ?? company.description ?? "").trim() ||
    "Finn kontaktinfo, tjenester og AI-nivå for aktører i reklame og kreativ produksjon.";

  const desc = trimDescription(rawDesc, 160);

  // OG/Twitter image: bruk cover om vi har, ellers fallback
  const ogImage =
    toAbsoluteSiteUrl(company.cover_image) ?? "https://kireklame.no/covers/cover-1.jpg";

  const title = `${name} – AI-first reklame og kreativ produksjon | KiReklame.no`;

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
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Fant ikke selskapet</h1>
        <Link href="/selskaper" className="mt-4 inline-block underline">
          Tilbake til katalog
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
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      {/* MEDIA */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5 md:grid-rows-2">
        <div className="relative md:col-span-3 md:row-span-2 aspect-[16/10] overflow-hidden rounded-2xl border bg-black">
          {!rawVideo ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
              Ingen video
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

        <div className="relative md:col-span-2 md:row-span-2 aspect-[16/10] overflow-hidden rounded-2xl border">
          <CoverImg src={cover} alt={company.name} className="h-full w-full object-cover" />
        </div>
      </div>

      {/* ABOUT */}
      <div className="mt-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold">{company.name}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[rgb(var(--muted))]">
          <span>{company.location?.name ?? "Ukjent sted"}</span>
          <span aria-hidden>•</span>
          <span>{typeLabel(company.company_type)}</span>
          <span aria-hidden>•</span>
          <span>AI: {aiLevelLabel(company.ai_level)}</span>
          <span aria-hidden>•</span>
          <span>Pris: {priceLevelLabel(company.price_level)}</span>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <p className="text-muted">{company.description || company.short_description}</p>
        </div>

        <div className="lg:col-span-4 self-start">
          <div className="rounded-xl border p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {company.email ? (
                <a
                  href={`/c/email/${slug}`}
                  className="block text-center rounded-xl border px-4 py-3 font-semibold"
                >
                  Kontakt bedrift
                </a>
              ) : (
                <div
                  aria-disabled="true"
                  className="block text-center rounded-xl border px-4 py-3 font-semibold opacity-50 cursor-not-allowed select-none"
                >
                  Kontakt bedrift
                </div>
              )}

              {websiteUrl ? (
                <a
                  href={`/go/${slug}`}
                  target="_blank"
                  rel="noopener"
                  className="block text-center rounded-lg border px-3 py-2 text-sm font-medium hover:bg-[rgb(var(--bg))]"
                >
                  Besøk nettside ↗
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
                  href={`/claim/company/${company.slug}`}
                  className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium opacity-80 hover:opacity-100 transition"
                >
                  Claim bedrift
                </Link>
              ) : (
                <p className="text-sm text-muted">Allerede claimet</p>
              )
            ) : isOwner ? (
              <Link
                href={`/me/company/${company.id}`}
                className="block text-center rounded-xl border px-4 py-3 font-semibold"
              >
                Rediger profil
              </Link>
            ) : (
              <ClaimCta companyId={company.id} companySlug={company.slug} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
