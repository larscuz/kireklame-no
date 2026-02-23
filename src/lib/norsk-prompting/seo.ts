export type BreadcrumbItem = {
  name: string;
  item: string;
};

function siteBase() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no";
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteBase()).toString();
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

export function buildWebPageJsonLd(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url: absoluteUrl(path),
    description,
    inLanguage: "nb-NO",
  };
}

export function buildArticleJsonLd(args: {
  headline: string;
  description: string;
  path: string;
  dateModified?: string;
}) {
  const modified = args.dateModified || new Date().toISOString().slice(0, 10);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.headline,
    description: args.description,
    inLanguage: "nb-NO",
    dateModified: modified,
    author: {
      "@type": "Organization",
      name: "KiReklame.no",
    },
    publisher: {
      "@type": "Organization",
      name: "KiReklame.no",
    },
    mainEntityOfPage: absoluteUrl(args.path),
  };
}
