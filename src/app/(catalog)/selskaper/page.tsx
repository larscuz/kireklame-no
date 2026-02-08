import type { Metadata } from "next";
import Link from "next/link";

import ListingGrid from "@/app/_components/ListingGrid";
import FilterChips from "@/app/_components/FilterChips";
import { getCompanies } from "@/lib/supabase/server";
import { parseSearchParams } from "@/lib/utils";
import { siteMeta } from "@/lib/seo";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";

export const metadata: Metadata = siteMeta({
  title: "KI‑byråer og reklamebyråer – Norge | KiReklame",
  description:
    "Katalog over norske KI‑byråer, reklamebyråer og studioer for AI‑video, annonser og markedsføring.",
  path: "/selskaper",
});

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const sp = await searchParams;
  const params = parseSearchParams(sp);
  const { companies, facets } = await getCompanies(params);


  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {locale === "en" ? "Companies" : "Selskaper"}
          </h1>
          <p className="mt-2 text-[rgb(var(--muted))]">
            {locale === "en"
              ? "Filter by AI level and price."
              : "Filtrer på AI-nivå og pris."}
          </p>
        </div>
        <div className="hidden md:block text-sm text-[rgb(var(--muted))]">
          {locale === "en" ? `${companies.length} results` : `${companies.length} treff`}
        </div>
      </div>

      {/* ✅ CTA: Registrer bedrift */}
      <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold">
              {locale === "en" ? "Are we missing you?" : "Mangler vi deg?"}
            </div>
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">
              {locale === "en"
                ? "Register your company — we review all submissions before publishing."
                : "Registrer bedriften din — vi modererer alle innsendinger før publisering."}
            </div>
          </div>

          <Link
            href={localizePath(locale, "/register/company")}
            className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-3 text-sm font-semibold shadow-soft hover:opacity-90 transition"
          >
            {locale === "en" ? "Register company" : "Registrer bedrift"}
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <FilterChips facets={facets} params={params} locale={locale} />
      </div>

      <section className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-soft">
        <div className="text-sm font-semibold">
          {locale === "en" ? "Related topics" : "Relaterte temaer"}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <Link
            href={localizePath(locale, "/ki-reklamebyra")}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            {locale === "en" ? "AI advertising agencies" : "KI reklamebyrå"}
          </Link>
          <Link
            href={localizePath(locale, "/ai-video")}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            {locale === "en" ? "AI video production" : "AI‑video produksjon"}
          </Link>
          <Link
            href={localizePath(locale, "/ki-markedsforing")}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            {locale === "en" ? "AI marketing" : "KI markedsføring"}
          </Link>
        </div>
      </section>

      <div className="mt-8">
        <ListingGrid companies={companies} />
      </div>
    </div>
  );
}
