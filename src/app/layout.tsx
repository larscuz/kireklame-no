import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Topbar from "./_components/Topbar";
import Footer from "./_components/Footer";
import { siteMeta } from "@/lib/seo";

export const metadata: Metadata = siteMeta({
  title: "KiReklame.no – Norsk katalog for KI i reklame og kreativ produksjon",
  description:
    "Finn norske byråer, studioer og frilansmiljøer som bruker KI/AI i kommersielt kreativt arbeid. Filtrer på sted, tjenester og AI-nivå.",
  path: "/"
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="min-h-screen flex flex-col">
            <Topbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
