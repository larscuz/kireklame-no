import type { Metadata } from "next";
import ListingGrid from "@/app/_components/ListingGrid";
import { getCompaniesByTagSlug, getTagBySlug } from "@/lib/supabase/server";
import { siteMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const tag = await getTagBySlug(slug);
  const name = tag?.name ?? slug;

  return siteMeta({
    title: `${name} – Tag – KiReklame.no`,
    description: `Aktører som jobber med ${name}.`,
    path: `/tag/${slug}`,
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tag = await getTagBySlug(slug);
  const companies = await getCompaniesByTagSlug(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        {tag?.name ?? "Tag"}{" "}
        <span className="text-[rgb(var(--muted))] font-normal">
          ({companies.length})
        </span>
      </h1>

      <p className="mt-2 text-[rgb(var(--muted))]">
        Tag-basert indeks (SEO) – perfekt for “stikkord”-trafikk.
      </p>

      <section className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-soft">
        <div className="text-sm font-semibold">Relaterte temaer</div>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <a
            href="/ki-reklamebyra"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            KI reklamebyrå
          </a>
          <a
            href="/ai-video"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            AI‑video produksjon
          </a>
          <a
            href="/ki-markedsforing"
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-[rgb(var(--fg))] hover:opacity-80 transition"
          >
            KI markedsføring
          </a>
        </div>
      </section>

      <div className="mt-8">
        <ListingGrid companies={companies} />
      </div>
    </div>
  );
}
