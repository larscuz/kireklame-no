import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";
import { siteMeta } from "@/lib/seo";
import { getCompanies } from "@/lib/supabase/server";
import StereoscopicViewerWheel from "./StereoscopicViewerWheel";

type ReelItem = {
  id: string;
  name: string;
  href: string;
  videoUrl: string;
  description?: string | null;
};

function getMp4Url(raw: string | null | undefined): string | null {
  const url = String(raw ?? "").trim();
  if (!/^https?:\/\//i.test(url)) return null;
  const lower = url.toLowerCase();
  if (!lower.endsWith(".mp4") && !lower.includes(".mp4?")) return null;
  return url;
}

function titleFromFileName(value: string): string {
  const tail = String(value ?? "").split("/").filter(Boolean).pop() ?? value;
  const base = tail.replace(/\.[a-z0-9]+$/i, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function parseCloudflareShowreels(locale: Locale): ReelItem[] {
  const rawEntries = String(process.env.SHOWREEL_CLOUDFLARE_VIDEOS ?? "").trim();
  if (!rawEntries) return [];

  const baseDir = String(process.env.SHOWREEL_CLOUDFLARE_DIR_URL ?? "")
    .trim()
    .replace(/\/+$/, "");
  const fallbackHref = String(
    process.env.SHOWREEL_CLOUDFLARE_DEFAULT_HREF ?? localizePath(locale, "/kontakt")
  ).trim();
  const defaultDescription = locale === "en" ? "Cloudflare showreel" : "Cloudflare-showreel";

  const out: ReelItem[] = [];
  for (const [idx, chunk] of rawEntries.split(",").entries()) {
    const entry = chunk.trim();
    if (!entry) continue;

    const parts = entry.split("|").map((item) => item.trim());
    const ref = parts[0] ?? "";
    const explicitName = parts[1] ?? "";
    const explicitHref = parts[2] ?? "";
    if (!ref) continue;

    const resolvedUrl =
      /^https?:\/\//i.test(ref)
        ? ref
        : baseDir
          ? `${baseDir}/${ref.replace(/^\/+/, "")}`
          : "";
    const videoUrl = getMp4Url(resolvedUrl);
    if (!videoUrl) continue;

    out.push({
      id: `cf-${idx}`,
      name: explicitName || titleFromFileName(ref) || `Showreel ${idx + 1}`,
      href: explicitHref || fallbackHref || localizePath(locale, "/kontakt"),
      videoUrl,
      description: defaultDescription,
    });
  }

  return out;
}

export const metadata: Metadata = siteMeta({
  title: "KI-reklame i Norge – showreels, byråer og eksempler | KiReklame",
  description:
    "Utforsk KI-reklame i Norge med autoplay showreel, AI-first byråer og konkrete eksempler på video, kampanjer og kreativ produksjon.",
  path: "/ki-reklame",
});

export default async function KiReklamePage() {
  const locale = await getLocale();
  const [{ companies: noCompanies }, { companies: intlCompanies }] = await Promise.all([
    getCompanies({}, { market: "no" }),
    getCompanies({}, { market: "intl" }),
  ]);
  const companies = [...noCompanies, ...intlCompanies];
  const cloudflareItems = parseCloudflareShowreels(locale);

  const seen = new Set<string>();
  const reelItems: ReelItem[] = [];

  for (const item of cloudflareItems) {
    if (seen.has(item.videoUrl)) continue;
    seen.add(item.videoUrl);
    reelItems.push(item);
  }

  for (const company of companies) {
    const videoUrl = getMp4Url(company.video_url ?? null);
    if (!videoUrl || seen.has(videoUrl)) continue;
    seen.add(videoUrl);
    reelItems.push({
      id: company.id,
      name: company.name,
      href: localizePath(locale, `/selskap/${company.slug}`),
      videoUrl,
      description: company.short_description ?? null,
    });
  }

  const faq =
    locale === "en"
      ? [
          {
            q: "What is AI advertising?",
            a: "AI advertising combines strategy, creative, and production with AI tools to produce and optimize campaigns faster.",
          },
          {
            q: "Why a showreel page?",
            a: "It gives buyers one place to compare visual quality, style, and production speed across agencies.",
          },
          {
            q: "Which videos appear in the wheel?",
            a: "Norwegian and international companies with public direct mp4 URLs are included, plus videos you add in the Cloudflare directory.",
          },
        ]
      : [
          {
            q: "Hva er KI-reklame?",
            a: "KI-reklame kombinerer strategi, kreativitet og produksjon med AI-verktøy for raskere utvikling og optimalisering av kampanjer.",
          },
          {
            q: "Hvorfor en egen showreel-side?",
            a: "Siden gjør det enkelt å sammenligne visuell kvalitet, stil og produksjonstempo på tvers av byråer.",
          },
          {
            q: "Hvilke videoer vises i hjulet?",
            a: "Vi viser norske og internasjonale selskaper med offentlig direkte mp4-URL, pluss videoer du legger i Cloudflare-mappen. Videoene spilles av med lyd av/autoplay der nettleseren tillater det.",
          },
        ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <header className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft md:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-[rgb(var(--muted))]">KI-reklame</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
          {locale === "en"
            ? "AI advertising in Norway: showreel + agency landscape"
            : "KI-reklame i Norge: showreel + byråoversikt"}
        </h1>
        <p className="mt-4 max-w-3xl text-[rgb(var(--muted))] leading-relaxed">
          {locale === "en"
            ? "This page is built for high-intent searches around AI advertising. Explore real showreels in a stereoscopic wheel and jump directly to agencies working with AI-first production."
            : "Denne siden er laget for søk med høy intensjon rundt KI-reklame. Utforsk ekte showreels i et stereoskopisk hjul og gå direkte til byråer som jobber AI-first i produksjon."}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={localizePath(locale, "/selskaper")}
            className="inline-flex items-center rounded-xl bg-[rgb(var(--fg))] px-4 py-2.5 text-sm font-semibold text-[rgb(var(--bg))] shadow-soft hover:opacity-90 transition"
          >
            {locale === "en" ? "Explore agencies" : "Utforsk byråer"}
          </Link>
          <Link
            href={localizePath(locale, "/ai-video")}
            className="inline-flex items-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2.5 text-sm font-semibold hover:opacity-80 transition"
          >
            {locale === "en" ? "AI video production" : "AI-video produksjon"}
          </Link>
        </div>
      </header>

      <section className="mt-8">
        {reelItems.length > 0 ? (
          <StereoscopicViewerWheel items={reelItems} />
        ) : (
          <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
            <h2 className="text-xl font-semibold">
              {locale === "en" ? "No public mp4 showreels yet" : "Ingen offentlige mp4-showreels ennå"}
            </h2>
            <p className="mt-2 text-[rgb(var(--muted))]">
              {locale === "en"
                ? "When companies add direct mp4 URLs, they will appear automatically on this page."
                : "Når selskaper legger inn direkte mp4-URL, vises de automatisk på denne siden."}
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          {locale === "en" ? "Frequently asked questions" : "Ofte stilte spørsmål"}
        </h2>
        <div className="mt-4 space-y-4 text-[rgb(var(--muted))]">
          {faq.map((item) => (
            <div key={item.q}>
              <p className="font-semibold text-[rgb(var(--fg))]">{item.q}</p>
              <p className="mt-1 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
