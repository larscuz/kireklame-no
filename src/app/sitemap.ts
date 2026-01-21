import type { MetadataRoute } from "next";
import { adminListSitemapEntities } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { companies, locations, tags } = await adminListSitemapEntities();

  const base: MetadataRoute.Sitemap = [
    { url: `${site}/`, changeFrequency: "daily", priority: 1 },
    { url: `${site}/selskaper`, changeFrequency: "daily", priority: 0.9 }
  ];

  const companyUrls = companies.map((c) => ({
    url: `${site}/selskap/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  const cityUrls = locations.map((l) => ({
    url: `${site}/by/${l.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6
  }));

  const tagUrls = tags.map((t) => ({
    url: `${site}/tag/${t.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6
  }));

  return [...base, ...companyUrls, ...cityUrls, ...tagUrls];
}
