import { supabaseAdmin } from "@/lib/supabase/admin";

export type SponsorAd = {
  id: number;
  title?: string | null;
  meta?: string | null;
  description?: string | null;
  image_url: string;
  mobile_image_url?: string | null;
  href: string;
  alt: string;
  label?: string | null;
  cta_text?: string | null;
};

export async function getAdForPlacement(placement: string) {
  const nowIso = new Date().toISOString();
  const { data } = await supabaseAdmin()
    .from("ads")
    .select(
      "id, title, meta, description, image_url, mobile_image_url, href, alt, label, cta_text, priority, created_at"
    )
    .eq("placement", placement)
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
    .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
    .order("priority", { ascending: true });

  if (data?.length) {
    return pickRotatedAd(
      data as Array<SponsorAd & { priority?: number; created_at?: string }>
    );
  }

  const fallback = getFallbackAd(placement);
  return fallback;
}

function getFallbackAd(placement: string): SponsorAd | null {
  const banner = "/ads/GullhaienBanner.png";
  const hero = "/ads/Gullhaien.png";

  const base: SponsorAd = {
    id: 0,
    title: "Gullhaien 2026",
    meta: "Oslo · Arrangement",
    description: "Celebrating Excellence in AI‑Driven Creative Communication.",
    image_url: hero,
    mobile_image_url: banner,
    href: "https://gullhaien.no/",
    alt: "Gullhaien 2026",
    label: "Sponset",
    cta_text: "Se event →",
  };

  switch (placement) {
    case "home_hero_sidebar":
    case "international_hero_sidebar":
    case "companies_hero_sidebar":
      return base;
    case "catalog_top_banner":
      return { ...base, image_url: banner, mobile_image_url: banner };
    case "catalog_inline_card":
      return { ...base, image_url: hero, mobile_image_url: banner };
    case "other_top_banner":
      return { ...base, image_url: banner, mobile_image_url: banner };
    case "other_mid_banner":
      return { ...base, image_url: banner, mobile_image_url: banner };
    case "other_hero_sidebar":
      return base;
    case "other_inline_card":
      return { ...base, image_url: hero, mobile_image_url: banner };
    case "other_inline_card_2":
      return { ...base, image_url: hero, mobile_image_url: banner };
    default:
      return null;
  }
}

function pickRotatedAd(
  ads: Array<SponsorAd & { priority?: number; created_at?: string }>
) {
  if (!ads.length) return null;

  const minPriority = ads.reduce(
    (min, ad) => Math.min(min, ad.priority ?? 0),
    Number.POSITIVE_INFINITY
  );
  const pool = ads.filter((ad) => (ad.priority ?? 0) === minPriority);
  if (pool.length === 1) return pool[0];

  const intervalMinutes = 30;
  const bucket = Math.floor(Date.now() / (intervalMinutes * 60 * 1000));
  const index = bucket % pool.length;
  return pool[index];
}
