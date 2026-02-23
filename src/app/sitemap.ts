import type { MetadataRoute } from "next";
import { promptExamples } from "@/data/norskPrompting/examples";
import { glossaryTerms } from "@/data/norskPrompting/glossary";
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
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no";
  const { companies, locations, tags, newsArticles } = await adminListSitemapEntities();

  const base: MetadataRoute.Sitemap = [
    { url: `${site}/`, changeFrequency: "daily", priority: 1 },
    { url: `${site}/annonsere`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site}/selskaper`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site}/andre-ki-tjenester`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site}/ki-reklame`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site}/ki-reklamebyra`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site}/ai-video`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site}/ki-markedsforing`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site}/norsk-prompting`, changeFrequency: "daily", priority: 0.95 },
    { url: `${site}/norsk-prompting/prompt-utvider`, changeFrequency: "daily", priority: 0.92 },
    { url: `${site}/norsk-prompting/regler`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site}/norsk-prompting/maler`, changeFrequency: "weekly", priority: 0.88 },
    { url: `${site}/norsk-prompting/ordforrad`, changeFrequency: "weekly", priority: 0.88 },
    { url: `${site}/norsk-prompting/eksempler`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site}/norsk-prompting/changelog`, changeFrequency: "weekly", priority: 0.7 },
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

  const glossaryUrls: MetadataRoute.Sitemap = glossaryTerms.map((entry) => ({
    url: `${site}/norsk-prompting/ordforrad/${entry.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.72,
  }));

  const exampleUrls: MetadataRoute.Sitemap = promptExamples.map((entry) => ({
    url: `${site}/norsk-prompting/eksempler/${entry.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.82,
  }));

  return uniqByUrl([
    ...base,
    ...companyUrls,
    ...cityUrls,
    ...tagUrls,
    ...newsUrls,
    ...glossaryUrls,
    ...exampleUrls,
  ]);
}
