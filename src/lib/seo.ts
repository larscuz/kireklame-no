import type { Metadata } from "next";

export function siteMeta(args: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = new URL(args.path, site).toString();

  return {
    title: args.title,
    description: args.description,
    alternates: { canonical: url },
    openGraph: {
      title: args.title,
      description: args.description,
      url,
      siteName: "KiReklame.no",
      locale: "nb_NO",
      type: "website",
      images: [
  {
    url: `${site}/og-linkedin.jpg`,
    width: 1200,
    height: 627
  }
]

    },
    twitter: {
      card: "summary_large_image",
      title: args.title,
      description: args.description,
      images: [`${site}/og-linkedin.jpg`]

    }
  };
}
