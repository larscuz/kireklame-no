// src/app/claim/company/[slug]/page.tsx
import type { Metadata } from "next";
import { siteMeta } from "@/lib/seo";
import { getCompanyBySlug } from "@/lib/supabase/server";
import ClaimForm from "./ClaimForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const company = await getCompanyBySlug(slug);
  const name = company?.name ?? slug;

  return siteMeta({
    title: `Claim ${name} – KiReklame.no`,
    description: "Bekreft eierskap til bedriftsprofilen på KiReklame.no.",
    path: `/claim/company/${slug}`,
  });
}

export default async function ClaimCompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const company = await getCompanyBySlug(slug);

  // hvis slug ikke finnes / er feil
  if (!company) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Fant ikke bedriften</h1>
        <p className="mt-3 text-sm text-[rgb(var(--muted))]">
          Denne profilen finnes ikke (eller er ikke publisert).
        </p>
      </div>
    );
  }

  // ClaimForm forventer vanligvis slug + id (basert på din arkitektur)
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Claim {company.name}</h1>
      <p className="mt-3 text-sm text-[rgb(var(--muted))]">
        Send claim for å kunne redigere profilen etter godkjenning.
      </p>

      <div className="mt-8">
        <ClaimForm companyId={company.id} companySlug={company.slug ?? slug} />
      </div>
    </div>
  );
}
