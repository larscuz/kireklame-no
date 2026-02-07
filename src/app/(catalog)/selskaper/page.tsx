import type { Metadata } from "next";
import Link from "next/link";

import ListingGrid from "@/app/_components/ListingGrid";
import FilterChips from "@/app/_components/FilterChips";
import { getCompanies } from "@/lib/supabase/server";
import { parseSearchParams } from "@/lib/utils";
import { siteMeta } from "@/lib/seo";

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
  const sp = await searchParams;
  const params = parseSearchParams(sp);
  const { companies, facets } = await getCompanies(params);


  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Selskaper</h1>
          <p className="mt-2 text-[rgb(var(--muted))]">
            Filtrer på AI-nivå og pris.
          </p>
        </div>
        <div className="hidden md:block text-sm text-[rgb(var(--muted))]">
          {companies.length} treff
        </div>
      </div>

      {/* ✅ CTA: Registrer bedrift */}
      <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold">Mangler vi deg?</div>
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">
              Registrer bedriften din — vi modererer alle innsendinger før publisering.
            </div>
          </div>

          <Link
            href="/register/company"
            className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-3 text-sm font-semibold shadow-soft hover:opacity-90 transition"
          >
            Registrer bedrift
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <FilterChips facets={facets} params={params} />
      </div>

      <section className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-soft">
        <div className="text-sm font-semibold">Relaterte temaer</div>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <Link
            href="/ki-reklamebyra"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            KI reklamebyrå
          </Link>
          <Link
            href="/ai-video"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            AI‑video produksjon
          </Link>
          <Link
            href="/ki-markedsforing"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            KI markedsføring
          </Link>
        </div>
      </section>

      <div className="mt-8">
        <ListingGrid companies={companies} />
      </div>
    </div>
  );
}
