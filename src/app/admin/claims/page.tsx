import Link from "next/link";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/supabase/server";
import { notifySubmitter } from "@/lib/email/notifySubmitter";


export const dynamic = "force-dynamic";

async function approveClaim(formData: FormData) {
  "use server";

  const claimId = String(formData.get("id") ?? "");
  if (!claimId) throw new Error("Mangler claim id");

  const db = supabaseAdmin();

  // 1) Godkjenn claim
  const { error } = await db.from("claims").update({ status: "approved" }).eq("id", claimId);
  if (error) throw new Error(`Kunne ikke godkjenne claim: ${error.message}`);

  // 2) Hent claim + bedriftinfo for e-post
  try {
    const { data: claimRow, error: claimErr } = await db
      .from("claims")
      .select(
        `
        id,
        user_id,
        company_id,
        companies:company_id (
          id,
          name,
          slug
        )
      `
      )
      .eq("id", claimId)
      .maybeSingle();

    if (claimErr) {
      console.warn("CLAIM APPROVE: kunne ikke hente claimRow:", claimErr.message);
    } else if (claimRow?.user_id) {
      // 3) Finn e-post til brukeren via auth
      const { data: userData, error: userErr } = await db.auth.admin.getUserById(
        String(claimRow.user_id)
      );

      if (userErr) {
        console.warn("CLAIM APPROVE: kunne ikke hente user:", userErr.message);
      } else {
        const to = userData?.user?.email ?? null;
        const companyName = (claimRow as any)?.companies?.name ?? "bedriften";
        const companySlug = (claimRow as any)?.companies?.slug ?? null;

        if (to) {
          const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
          const actionUrl = `${site}/me`;

          await notifySubmitter({
            to,
            subject: "Claim godkjent – du kan redigere profilen din i KiReklame",
            title: "Claim godkjent",
            lines: [
              "Admin har godkjent forespørselen din om å bekrefte eierskap.",
              "",
              `Bedrift: ${companyName}`,
              companySlug ? `Profil: ${site}/selskap/${companySlug}` : "",
              "",
              "Du kan nå logge inn og redigere profilen.",
            ].filter(Boolean),
            actionText: "Gå til Min side",
            actionUrl,
          });

          console.log("CLAIM APPROVED MAIL OK", { to, claimId, companySlug });
        }
      }
    }
  } catch (e) {
    console.warn("CLAIM APPROVE: mail-feil (ignored):", e);
  }

  revalidatePath("/admin/claims");
  revalidatePath("/me");
}


async function rejectClaim(formData: FormData) {
  "use server";

  const claimId = String(formData.get("id") ?? "");
  if (!claimId) throw new Error("Mangler claim id");

  const db = supabaseAdmin();
  const { error } = await db.from("claims").update({ status: "rejected" }).eq("id", claimId);
  if (error) throw new Error(`Kunne ikke avslå claim: ${error.message}`);

  revalidatePath("/admin/claims");
  revalidatePath("/me");
}

export default async function AdminClaimsPage() {
      const user = await requireUser();

  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const email = (user.email ?? "").toLowerCase();

  if (!email || !allowed.includes(email)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Ikke tilgang</h1>
        <p className="mt-2 text-[rgb(var(--muted))]">
          Du er logget inn som <code className="px-1">{user.email ?? "ukjent"}</code>, men har ikke admin-tilgang.
        </p>
        <div className="mt-6 text-sm">
          <Link className="underline" href="/auth">
            Gå til innlogging
          </Link>
        </div>
      </div>
    );
  }

  
    const db = supabaseAdmin();

  const { data: claims, error } = await db
  .from("claims")
  .select(`
    id,
    status,
    message,
    created_at,
    company_id,
    companies:company_id (
      id,
      name,
      slug
    ),
    user_id
  `)
  .order("created_at", { ascending: false });



  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Claims</h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Innlogget admin: <span className="font-medium text-[rgb(var(--fg))]">{user.email ?? user.id}</span>

            <span className="font-medium text-[rgb(var(--fg))]">
              {user.email ?? user.id}

            </span>
          </p>
        </div>

        <Link className="text-sm underline" href="/selskaper">
          Til katalog
        </Link>
      </div>

      {error ? (
        <div className="mt-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6">
          <p className="text-sm font-semibold">Kunne ikke hente claims</p>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">{error.message}</p>
        </div>
      ) : null}

      {!error && (!claims || claims.length === 0) ? (
        <div className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 shadow-soft">
          <p className="text-sm font-semibold">Ingen claims funnet</p>
        </div>
      ) : null}

      {!error && claims && claims.length > 0 ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft">
          <div className="grid grid-cols-12 gap-3 border-b border-[rgb(var(--border))] px-4 py-3 text-xs font-semibold text-[rgb(var(--muted))]">
  <div className="col-span-3">Bedrift</div>

  <div className="col-span-3">Bruker</div>
  <div className="col-span-2">Status</div>
  <div className="col-span-2">Handling</div>
  <div className="col-span-2">Melding</div>
</div>


          <div className="divide-y divide-[rgb(var(--border))]">
            {claims.map((c: any) => (
              <div key={c.id} className="grid grid-cols-12 gap-3 px-4 py-3 text-sm">
                <div className="col-span-3">
  <div className="font-semibold">
    {c.companies?.name ?? "Ukjent bedrift"}
  </div>
  {c.companies?.slug ? (
    <Link
      href={`/selskap/${c.companies.slug}`}
      className="text-xs underline text-[rgb(var(--muted))]"
      target="_blank"
    >
      Åpne profil ↗
    </Link>
  ) : null}
</div>

                <div className="col-span-3 text-xs">
  <code>{c.user_id}</code>
</div>

                <div className="col-span-2">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold">
                    {(c.status ?? "pending").toLowerCase()}
                  </span>
                </div>
                <div className="col-span-2 flex flex-wrap gap-2">
  <form action={approveClaim}>
    <input type="hidden" name="id" value={c.id} />
    <button
      type="submit"
      className="rounded-xl border border-[rgb(var(--border))] bg-black text-white px-3 py-1.5 text-xs hover:opacity-90 disabled:opacity-50"
      disabled={(c.status ?? "pending").toLowerCase() === "approved"}
    >
      Godkjenn
    </button>
  </form>

  <form action={rejectClaim}>
    <input type="hidden" name="id" value={c.id} />
    <button
      type="submit"
      className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-xs hover:shadow-soft disabled:opacity-50"
      disabled={(c.status ?? "pending").toLowerCase() === "rejected"}
    >
      Avslå
    </button>
  </form>
</div>

<div className="col-span-2 text-xs text-[rgb(var(--muted))] break-words">
  {c.message ?? ""}
</div>

              </div>
            ))}
          </div>
        </div>
      ) : null}
    </main>
  );
}
