import Link from "next/link";
import { requireUser, createClaim } from "@/lib/supabase/server";
import { siteMeta } from "@/lib/seo";

export const metadata = siteMeta({
  title: "Claim – KiReklame.no",
  description: "Be om å claime og oppdatere en bedriftsprofil.",
  path: "/claim"
});

export default async function ClaimPage({
  params,
  searchParams
}: {
  params: { companyId: string };
  searchParams: { message?: string };
}) {
  const user = await requireUser();

  const message = searchParams.message?.slice(0, 500) ?? "";
  const result = await createClaim({ companyId: params.companyId, message, userId: user.id });

  return (
    <div className="mx-auto max-w-xl px-4 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Claim sendt</h1>
      <p className="mt-3 text-[rgb(var(--muted))]">
        {result.ok
          ? "Takk! Vi har registrert forespørselen din."
          : `Kunne ikke opprette claim: ${result.error}`}
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          href="/selskaper"
          className="rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm font-medium hover:shadow-soft transition"
        >
          Til katalog
        </Link>
        <Link
          href="/admin/submit"
          className="rounded-xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-2 text-sm font-medium hover:opacity-90 transition"
        >
          Tips oss om flere aktører
        </Link>
      </div>

      <p className="mt-8 text-xs text-[rgb(var(--muted))]">
        Bruker: {user.email ?? user.id}
      </p>
    </div>
  );
}
