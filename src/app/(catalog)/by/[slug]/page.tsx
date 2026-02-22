import type { Metadata } from "next";
import ListingGrid from "@/app/_components/ListingGrid";
import { getCompaniesByLocationSlug, getLocationBySlug } from "@/lib/supabase/server";
import { siteMeta } from "@/lib/seo";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";
import { getAdForPlacement } from "@/lib/ads";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  const name = location?.name ?? slug;

  return siteMeta({
    title: `${name} – KiReklame.no`,
    description: `AI/KI-aktører innen reklame og kreativ produksjon i ${name}.`,
    path: `/by/${slug}`,
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getLocale();
  const { slug } = await params;

  const [location, companies, gridBannerAd] = await Promise.all([
    getLocationBySlug(slug),
    getCompaniesByLocationSlug(slug),
    getAdForPlacement("catalog_grid_banner"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        {location?.name ?? "By"}{" "}
        <span className="text-[rgb(var(--muted))] font-normal">({companies.length})</span>
      </h1>
      <p className="mt-2 text-[rgb(var(--muted))]">
        {locale === "en"
          ? "Curated overview (v1) — more sources will be added via autofill."
          : "Kuratert oversikt (v1) – flere kilder kommer via autofyll."}
      </p>

      <section className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-soft">
        <div className="text-sm font-semibold">
          {locale === "en" ? "Related topics" : "Relaterte temaer"}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <a
            href={localizePath(locale, "/ki-reklamebyra")}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            {locale === "en" ? "AI advertising agencies" : "KI reklamebyrå"}
          </a>
          <a
            href={localizePath(locale, "/ai-video")}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            {locale === "en" ? "AI video production" : "AI‑video produksjon"}
          </a>
          <a
            href={localizePath(locale, "/ki-markedsforing")}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            {locale === "en" ? "AI marketing" : "KI markedsføring"}
          </a>
        </div>
      </section>

      <div className="mt-8">
        <ListingGrid
          companies={companies}
          gridBannerAd={gridBannerAd}
        />
      </div>
    </div>
  );
}
