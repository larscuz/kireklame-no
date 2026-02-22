import type { Metadata } from "next";
import Link from "next/link";

import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";
import {
  DEFAULT_TOOL_CATALOG_CATEGORY,
  parseToolCatalogCategoryFilter,
  toolCatalogCategoryLabel,
  toolCatalogFilterLabel,
  type ToolCatalogCategory,
  type ToolCatalogCategoryFilter,
} from "@/lib/toolCatalog";
import { siteMeta } from "@/lib/seo";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = siteMeta({
  title: "KI-verktøy katalog | KiReklame",
  description:
    "Sekundærkatalog med kuraterte KI-verktøy. Startkategorier: AdCreative-verktøy og bilde-/videoverktøy.",
  path: "/ki-verktoy",
});

type SearchParamsInput = Record<string, string | string[] | undefined>;

type ToolRow = {
  id: string;
  name: string;
  slug: string;
  website: string;
  description: string | null;
  category: ToolCatalogCategory;
  source_url: string | null;
};

function readFirstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isTableMissing(message: string | undefined): boolean {
  const normalized = String(message ?? "").toLowerCase();
  return normalized.includes("tool_catalog_entries") && (normalized.includes("does not exist") || normalized.includes("relation"));
}

function heroDescription(category: ToolCatalogCategoryFilter): string {
  if (category === "adcreative") {
    return "Verktøy for annonsekreativ, kampanjeproduksjon og kommersiell innholdsoptimalisering.";
  }

  if (category === "image_video_tools") {
    return "Verktøy for AI-generert bilde, video, avatar og visuell produksjon i kommersiell bruk.";
  }

  return "Sekundærkatalog med praktiske KI-verktøy. Denne listen er enkel, redigerbar og kategorisert for raskt verktøyvalg.";
}

function categoryEmptyState(category: ToolCatalogCategoryFilter): string {
  if (category === "adcreative") return "Ingen AdCreative-verktøy ennå.";
  if (category === "image_video_tools") return "Ingen bilde- og videoverktøy ennå.";
  return "Ingen verktøy ennå.";
}

export default async function KiVerktoyCatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const locale = await getLocale();
  const sp = await searchParams;

  const selectedCategory =
    parseToolCatalogCategoryFilter(readFirstParam(sp.category)) ?? DEFAULT_TOOL_CATALOG_CATEGORY;

  const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? supabaseAdmin()
    : await supabaseServerClient();

  const query = supabase
    .from("tool_catalog_entries")
    .select("id,name,slug,website,description,category,source_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  const { data, error } =
    selectedCategory === "all"
      ? await query
      : await query.eq("category", selectedCategory);

  const rows = ((data ?? []) as ToolRow[]).filter((row) => {
    if (selectedCategory === "all") return true;
    return row.category === selectedCategory;
  });

  const basePath = localizePath(locale, "/ki-verktoy");

  const categoryOptions: Array<{
    value: ToolCatalogCategoryFilter;
    label: string;
    href: string;
  }> = [
    {
      value: "all",
      label: toolCatalogFilterLabel("all", locale),
      href: basePath,
    },
    {
      value: "adcreative",
      label: toolCatalogCategoryLabel("adcreative", locale),
      href: `${basePath}?category=adcreative`,
    },
    {
      value: "image_video_tools",
      label: toolCatalogCategoryLabel("image_video_tools", locale),
      href: `${basePath}?category=image_video_tools`,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="relative overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(249,115,22,0.12),transparent_50%)]" />
        <div className="relative px-6 py-10 sm:px-10">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
            <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1">
              Sekundærkatalog
            </span>
            <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1">
              {toolCatalogFilterLabel(selectedCategory, locale)}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">KI-verktøy</h1>
          <p className="mt-3 max-w-3xl text-[rgb(var(--muted))]">{heroDescription(selectedCategory)}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {categoryOptions.map((option) => {
              const isActive = option.value === selectedCategory;
              return (
                <Link
                  key={option.value}
                  href={option.href}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "border-transparent bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
                      : "border-[rgb(var(--border))] bg-[rgb(var(--bg))] text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm shadow-soft">
            <span className="text-[rgb(var(--muted))]">Antall verktøy</span>
            <span className="rounded-full bg-[rgb(var(--fg))] px-2.5 py-0.5 text-xs font-semibold text-[rgb(var(--bg))]">
              {rows.length}
            </span>
          </div>
        </div>
      </section>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-300/40 bg-rose-50/60 p-5 text-sm text-rose-700">
          {isTableMissing(error.message)
            ? "Mangler database-tabell for KI-verktøy. Kjør SQL-filen: supabase/tool-catalog-2026-02-22.sql"
            : `Kunne ikke hente verktøy: ${error.message}`}
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((tool) => (
          <article
            key={tool.id}
            className="group relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="absolute right-4 top-4 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
              {toolCatalogCategoryLabel(tool.category, locale)}
            </div>
            <h2 className="text-lg font-semibold tracking-tight">{tool.name}</h2>
            <p className="mt-2 line-clamp-4 text-sm text-[rgb(var(--muted))]">
              {tool.description || "Kort beskrivelse kommer."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={tool.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm font-medium text-sky-500 transition hover:text-sky-600"
              >
                Besøk verktøy →
              </a>
              {tool.source_url ? (
                <a
                  href={tool.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm text-[rgb(var(--muted))] transition hover:text-[rgb(var(--fg))]"
                >
                  Kilde
                </a>
              ) : null}
            </div>
          </article>
        ))}

        {!rows.length && !error ? (
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 text-[rgb(var(--muted))] shadow-soft">
            {categoryEmptyState(selectedCategory)}
          </div>
        ) : null}
      </div>
    </div>
  );
}
