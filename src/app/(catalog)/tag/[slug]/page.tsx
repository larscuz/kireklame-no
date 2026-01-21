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

      <div className="mt-8">
        <ListingGrid companies={companies} />
      </div>
    </div>
  );
}
