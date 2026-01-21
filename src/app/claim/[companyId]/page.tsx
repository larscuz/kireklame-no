// src/app/claim/[companyId]/page.tsx
import Link from "next/link";
import { siteMeta } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ companyId: string }>;
}): Promise<Metadata> {
  const { companyId } = await params;

  return siteMeta({
    title: "Claim bedrift – KiReklame.no",
    description: "Bekreft eierskap til bedriftsprofilen på KiReklame.no.",
    path: `/claim/${companyId}`,
  });
}

export default async function ClaimLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ companyId: string }>;
  searchParams: Promise<{ message?: string }>;
}) {
  const { companyId } = await params;
  const { message } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Claim bedrift</h1>

      {message ? (
        <p className="mt-3 text-sm text-[rgb(var(--muted))]">{message}</p>
      ) : (
        <p className="mt-3 text-sm text-[rgb(var(--muted))]">
          Du er i ferd med å claime en bedriftsprofil. Logg inn/opprett konto for å fortsette.
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/auth?mode=signup&next=${encodeURIComponent(`/claim/${companyId}`)}`}
          className="inline-flex items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm font-semibold hover:shadow-soft transition"
        >
          Opprett konto
        </Link>

        <Link
          href={`/auth?mode=login&next=${encodeURIComponent(`/claim/${companyId}`)}`}
          className="inline-flex items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm font-semibold hover:shadow-soft transition"
        >
          Logg inn
        </Link>

        <Link href="/selskaper" className="inline-flex items-center underline text-sm">
          Tilbake til katalog
        </Link>
      </div>
    </div>
  );
}
