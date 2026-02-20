import type { Metadata } from "next";

export function siteMeta(args: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no";
  const url = new URL(args.path, site).toString();

  return {
    metadataBase: new URL(site),
    title: args.title,
    description: args.description,
    alternates: { canonical: url },
    icons: {
      icon: [
        { url: "/KiR_logo_Black.png", type: "image/png" },
        { url: "/favicon.ico" },
      ],
      shortcut: ["/favicon.ico"],
      apple: [{ url: "/KiR_logo_Black.png" }],
    },
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
          height: 627,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: args.title,
      description: args.description,
      images: [`${site}/og-linkedin.jpg`],
    },
  };
}
