import type { Metadata } from "next";
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
  thumbnailUrl?: string | null;
  eyebrow?: string | null;
  ctaLabel?: string | null;
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
    const explicitThumb = parts[3] ?? "";
    const explicitEyebrow = parts[4] ?? "";
    const explicitCta = parts[5] ?? "";
    if (!ref) continue;

    const resolvedUrl =
      /^https?:\/\//i.test(ref)
        ? ref
        : baseDir
          ? `${baseDir}/${ref.replace(/^\/+/, "")}`
          : "";
    const videoUrl = getMp4Url(resolvedUrl);
    if (!videoUrl) continue;
    const thumbCandidate =
      /^https?:\/\//i.test(explicitThumb)
        ? explicitThumb
        : explicitThumb && baseDir
          ? `${baseDir}/${explicitThumb.replace(/^\/+/, "")}`
          : null;

    out.push({
      id: `cf-${idx}`,
      name: explicitName || titleFromFileName(ref) || `Showreel ${idx + 1}`,
      href: explicitHref || fallbackHref || localizePath(locale, "/kontakt"),
      videoUrl,
      description: defaultDescription,
      thumbnailUrl: thumbCandidate,
      eyebrow: explicitEyebrow || "Cloudflare",
      ctaLabel: explicitCta || null,
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
  const intlIds = new Set(intlCompanies.map((company) => company.id));
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
    const isIntl = intlIds.has(company.id);
    reelItems.push({
      id: company.id,
      name: company.name,
      href: localizePath(locale, `/selskap/${company.slug}`),
      videoUrl,
      description: company.short_description ?? null,
      thumbnailUrl: company.cover_image ?? null,
      eyebrow: isIntl
        ? locale === "en"
          ? "International"
          : "Internasjonalt"
        : company.location?.name ?? (locale === "en" ? "Norway" : "Norge"),
      ctaLabel: locale === "en" ? "View case" : "Åpne case",
    });
  }

  return (
    <main>
      <h1 className="sr-only">
        {locale === "en"
          ? "AI advertising showreel and agencies"
          : "KI-reklame showreel og byråer"}
      </h1>
      <section>
        {reelItems.length > 0 ? (
          <StereoscopicViewerWheel items={reelItems} />
        ) : (
          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
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
    </main>
  );
}
