import type { Metadata } from "next";
import { siteMeta } from "@/lib/seo";
import type { KiOpplaringEntry } from "./content";

export function buildKiOpplaringEntryMetadata(entry: KiOpplaringEntry): Metadata {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no").replace(/\/+$/, "");
  const base = siteMeta({
    title: `${entry.title} | KI Opplæring`,
    description: entry.description,
    path: entry.url,
  });

  const imageUrl = `${site}/og-linkedin.jpg`;

  return {
    ...base,
    openGraph: {
      ...(base.openGraph ?? {}),
      type: "article",
      title: entry.title,
      description: entry.description,
      url: `${site}${entry.url}`,
      modifiedTime: entry.updatedAt,
      images: [{ url: imageUrl, width: 1200, height: 627, alt: entry.title }],
    },
    twitter: {
      ...(base.twitter ?? {}),
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      images: [imageUrl],
    },
  };
}
