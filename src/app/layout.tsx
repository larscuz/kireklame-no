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
      <body className="min-h-screen overflow-x-hidden antialiased bg-black selection:bg-[#00ff00] selection:text-black">
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
          <div className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>

          <div className="min-h-screen flex flex-col relative z-10 text-[#00ff00]">
            <Topbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
