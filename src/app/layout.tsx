import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Topbar from "./_components/Topbar";
import Footer from "./_components/Footer";
import { siteMeta } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = siteMeta({
  title: "KiReklame.no – Norsk katalog for KI i reklame og kreativ produksjon",
  description:
    "Finn norske byråer, studioer og miljøer som bruker KI/AI i kommersielt kreativt arbeid. Filtrer på sted, tjenester og AI-nivå.",
  path: "/",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://kireklame.no/#organization",
      name: "KiReklame.no",
      url: "https://kireklame.no/",
      logo: {
        "@type": "ImageObject",
        url: "https://kireklame.no/favicon.ico",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://kireklame.no/#website",
      url: "https://kireklame.no/",
      name: "KiReklame.no",
      publisher: { "@id": "https://kireklame.no/#organization" },
      inLanguage: "no",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://kireklame.no/selskaper?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="min-h-screen flex flex-col">
            <Topbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
