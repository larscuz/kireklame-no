import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Topbar from "./_components/Topbar";
import Footer from "./_components/Footer";
import { siteMeta } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getLocale } from "@/lib/i18n.server";

export const metadata: Metadata = siteMeta({
  title: "KI reklame i Norge – byråer, video og markedsføring | KiReklame",
  description:
    "Finn norske KI‑byråer, reklamebyråer og studioer som lager AI‑video, annonser og markedsføring. Filtrer på sted, tjenester og AI‑nivå.",
  path: "/",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
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
          url: "https://kireklame.no/ip-logo.svg",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://kireklame.no/#website",
        url: "https://kireklame.no/",
        name: "KiReklame.no",
        publisher: { "@id": "https://kireklame.no/#organization" },
        inLanguage: locale === "en" ? "en" : "no",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://kireklame.no/selskaper?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang={locale === "en" ? "en" : "no"} suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden antialiased bg-[#050505]">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="kireklame-theme-v2"
        >
          {/* Ethereal Spline Background */}
          <div className="fixed inset-0 z-0 pointer-events-auto mix-blend-screen opacity-90">
            <iframe
              src="https://my.spline.design/glasscircles-145da5ec54fef2dafb438be55877fba1/"
              frameBorder="0"
              width="100%"
              height="100%"
              className="w-full h-full"
            />
          </div>

          <div className="relative z-10 min-h-screen flex flex-col pointer-events-none [perspective:1200px]">
            <div className="pointer-events-auto"><Topbar /></div>
            <main className="flex-1 pointer-events-auto [transform-style:preserve-3d]">{children}</main>
            <div className="pointer-events-auto"><Footer /></div>
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
