import type { MetadataRoute } from "next";
import { adminListSitemapEntities } from "@/lib/supabase/admin";

function uniqByUrl(items: MetadataRoute.Sitemap) {
  const seen = new Set<string>();
  return items.filter((i) => {
    if (seen.has(i.url)) return false;
    seen.add(i.url);
    return true;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { companies, locations, tags } = await adminListSitemapEntities();

  const base: MetadataRoute.Sitemap = [
    { url: `${site}/`, changeFrequency: "daily", priority: 1 },
    { url: `${site}/selskaper`, changeFrequency: "daily", priority: 0.9 },
  ];

  const companyUrls: MetadataRoute.Sitemap = (companies ?? [])
    .filter((c: any) => !!c?.slug && String(c.slug).trim().toLowerCase() !== "null")
    .map((c: any) => ({
      url: `${site}/selskap/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const cityUrls: MetadataRoute.Sitemap = (locations ?? [])
    .filter((l: any) => {
      const slug = String(l?.slug ?? "").trim().toLowerCase();
      return slug && slug !== "null" && slug !== "undefined";
    })
    .map((l: any) => ({
      url: `${site}/by/${l.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const tagUrls: MetadataRoute.Sitemap = (tags ?? [])
    .filter((t: any) => {
      const slug = String(t?.slug ?? "").trim().toLowerCase();
      return slug && slug !== "null" && slug !== "undefined";
    })
    .map((t: any) => ({
      url: `${site}/tag/${t.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  return uniqByUrl([...base, ...companyUrls, ...cityUrls, ...tagUrls]);
}
