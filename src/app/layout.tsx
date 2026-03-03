import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Topbar from "./_components/Topbar";
import Footer from "./_components/Footer";
import HeroBackgroundVideo from "./_components/HeroBackgroundVideo";
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
      <body className="min-h-screen overflow-x-hidden antialiased">
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
          <div className="min-h-screen lg:grid lg:grid-cols-2 bg-black flex flex-col">
            {/* LEFT SIDE: Fixed Editorial Video */}
            <div className="hidden lg:block relative h-screen sticky top-0 overflow-hidden bg-[#0a0a0a]">
              <HeroBackgroundVideo src="/videos/hero-bg.mp4" poster="/covers/cover-1.jpg" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/60 pointer-events-none" />
            </div>

            {/* RIGHT SIDE: Scrolling Directory */}
            <div className="flex flex-col min-h-screen bg-[rgb(var(--bg))] lg:border-l-[4px] border-white/10 relative z-10">
              <Topbar />
              <main className="flex-1 px-4 lg:px-12 py-8">{children}</main>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
