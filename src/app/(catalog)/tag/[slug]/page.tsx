import ListingGrid from "@/app/_components/ListingGrid";
import { getCompaniesByTagSlug, getTagBySlug } from "@/lib/supabase/server";
import { siteMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tag = await getTagBySlug(params.slug);
  const name = tag?.name ?? params.slug;
  return siteMeta({
    title: `${name} – Tag – KiReklame.no`,
    description: `Aktører som jobber med ${name}.`,
    path: `/tag/${params.slug}`
  });
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tag = await getTagBySlug(params.slug);
  const companies = await getCompaniesByTagSlug(params.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        {tag?.name ?? "Tag"}{" "}
        <span className="text-[rgb(var(--muted))] font-normal">({companies.length})</span>
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
