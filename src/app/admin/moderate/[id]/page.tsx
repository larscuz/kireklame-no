import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ModerateSubmissionPage({
  params,
}: {
  // I Next.js 15 er params asynkrone – type dem som Promise
  params: Promise<{ id: string }>;
}) {
  // Vent på params før du bruker id
  const { id } = await params;

  // Send til /auth hvis ikke innlogget eller ikke admin
  await requireAdmin(`/admin/moderate/${id}`);

  const db = supabaseAdmin();
  const { data: s, error } = await db
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !s) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold">Finner ikke innsending</h1>
        <p className="mt-3 text-[rgb(var(--muted))]">
          {error?.message ?? "Ukjent feil"}
        </p>
        <p className="mt-6">
          <Link className="underline" href="/me">
            Til /me
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold">Moderér innsending</h1>
        <Link className="underline" href="/">
          Til katalog
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <div className="text-sm text-[rgb(var(--muted))]">Submission ID</div>
        <div className="font-mono text-sm">{s.id}</div>

        <div className="mt-4 grid gap-2">
          <div>
            <b>Bedrift:</b> {s.company_name}
          </div>
          <div>
            <b>Nettside:</b> {s.website ?? "-"}
          </div>
          <div>
            <b>Sted:</b> {s.location ?? "-"}
          </div>
          <div>
            <b>E‑post:</b> {s.contact_email ?? "-"}
          </div>
          <div>
            <b>AI‑nivå:</b> {s.ai_level ?? "-"}
          </div>
          <div>
            <b>Prisnivå:</b> {s.price_level ?? "-"}
          </div>
          <div>
            <b>Tags:</b> {s.tags ?? "-"}
          </div>
          <div>
            <b>Status:</b> {s.status ?? "pending"}
          </div>
        </div>

        {s.cover_image ? (
          <div className="mt-5">
            <div className="text-sm text-[rgb(var(--muted))] mb-2">Bilde</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.cover_image}
              alt="cover"
              className="w-full rounded-2xl border border-[rgb(var(--border))]"
            />
          </div>
        ) : null}

        {s.notes ? (
          <div className="mt-5">
            <div className="text-sm text-[rgb(var(--muted))] mb-2">
              Beskrivelse
            </div>
            <div className="whitespace-pre-wrap text-sm">{s.notes}</div>
          </div>
        ) : null}

        <div className="mt-6 flex gap-3">
          <form action={`/api/admin/submissions/${s.id}/approve`} method="post">
            <button className="rounded-2xl bg-emerald-600 text-white px-5 py-3 font-semibold">
              Godkjenn
            </button>
          </form>

          <form action={`/api/admin/submissions/${s.id}/reject`} method="post">
            <button className="rounded-2xl bg-rose-600 text-white px-5 py-3 font-semibold">
              Avslå
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
