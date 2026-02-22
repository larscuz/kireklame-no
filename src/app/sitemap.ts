import type { MetadataRoute } from "next";
import { adminListSitemapEntities } from "@/lib/supabase/admin";
import { listAllKiOpplaringEntries } from "@/lib/ki-opplaring/content";

function uniqByUrl(items: MetadataRoute.Sitemap) {
  const seen = new Set<string>();
  return items.filter((i) => {
    if (seen.has(i.url)) return false;
    seen.add(i.url);
    return true;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no";
  const [{ companies, locations, tags, newsArticles }, kiOpplaringEntries] = await Promise.all([
    adminListSitemapEntities(),
    listAllKiOpplaringEntries(),
  ]);

  const base: MetadataRoute.Sitemap = [
    { url: `${site}/`, changeFrequency: "daily", priority: 1 },
    { url: `${site}/annonsere`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site}/selskaper`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site}/ki-verktoy`, changeFrequency: "weekly", priority: 0.75 },
    { url: `${site}/andre-ki-tjenester`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site}/ki-reklame`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site}/ki-reklamebyra`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site}/ai-video`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site}/ki-markedsforing`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site}/ki-opplaring`, changeFrequency: "daily", priority: 0.95 },
    { url: `${site}/ki-opplaring/ovelser`, changeFrequency: "daily", priority: 0.92 },
    { url: `${site}/ki-opplaring/guider`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site}/ki-opplaring/tema`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site}/ki-opplaring/verktoy`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${site}/ki-opplaring/ordliste`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${site}/ki-opplaring/nyheter`, changeFrequency: "daily", priority: 0.7 },
    { url: `${site}/ki-avis/om`, changeFrequency: "weekly", priority: 0.7 },
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

  const newsUrls: MetadataRoute.Sitemap = (newsArticles ?? [])
    .filter((n: any) => {
      const slug = String(n?.slug ?? "").trim().toLowerCase();
      return slug && slug !== "null" && slug !== "undefined";
    })
    .map((n: any) => ({
      url: `${site}/ki-avis/${n.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  const opplaringUrls: MetadataRoute.Sitemap = kiOpplaringEntries.map((entry) => ({
    url: `${site}${entry.url}`,
    changeFrequency: "weekly" as const,
    priority: entry.type === "guider" || entry.type === "tema" ? 0.85 : 0.75,
  }));

  return uniqByUrl([...base, ...companyUrls, ...cityUrls, ...tagUrls, ...newsUrls, ...opplaringUrls]);
}
