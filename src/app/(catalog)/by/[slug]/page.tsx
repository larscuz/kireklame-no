import ListingGrid from "@/app/_components/ListingGrid";
import { getCompaniesByLocationSlug, getLocationBySlug } from "@/lib/supabase/server";
import { siteMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const location = await getLocationBySlug(params.slug);
  const name = location?.name ?? params.slug;
  return siteMeta({
    title: `${name} – KiReklame.no`,
    description: `AI/KI-aktører innen reklame og kreativ produksjon i ${name}.`,
    path: `/by/${params.slug}`
  });
}

export default async function CityPage({ params }: { params: { slug: string } }) {
  const location = await getLocationBySlug(params.slug);
  const companies = await getCompaniesByLocationSlug(params.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        {location?.name ?? "By"}{" "}
        <span className="text-[rgb(var(--muted))] font-normal">({companies.length})</span>
      </h1>
      <p className="mt-2 text-[rgb(var(--muted))]">
        Kuratert oversikt (v1) – flere kilder kommer via autofyll.
      </p>

      <div className="mt-8">
        <ListingGrid companies={companies} />
      </div>
    </div>
  );
}
