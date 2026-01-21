import Link from "next/link";
import ClaimForm from "./ClaimForm";

export const dynamic = "force-dynamic";

type ParamsLike = { slug: string } | Promise<{ slug: string }>;

export default async function ClaimCompanyPage({
  params,
}: {
  params: ParamsLike;
}) {
  const { slug } = (await params) as { slug: string };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <h1 className="text-2xl font-semibold tracking-tight">
          Claim bedrift
        </h1>

        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Du er i claim-flyten for: <span className="font-medium">{slug}</span>
        </p>

        {/* 👇 HER */}
        <ClaimForm slug={slug} />

        <div className="mt-6 flex gap-3">
          <Link
            href={`/selskap/${slug}`}
            className="inline-flex items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold hover:shadow-soft transition"
          >
            Tilbake til profilen
          </Link>

          <Link
            href="/me"
            className="inline-flex items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold hover:shadow-soft transition"
          >
            Min side
          </Link>
        </div>
      </div>
    </div>
  );
}
