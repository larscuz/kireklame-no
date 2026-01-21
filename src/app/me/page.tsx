import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import SignOutButton from "../_components/SignOutButton";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function getSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
  getAll() {
    return cookieStore.getAll();
  },
  setAll(
    cookiesToSet: Array<{
      name: string;
      value: string;
      options?: Parameters<typeof cookieStore.set>[2];
    }>
  ) {
    try {
      cookiesToSet.forEach((c) => {
        cookieStore.set(c.name, c.value, c.options);
      });
    } catch {
      // Best-effort
    }
  },
},

    }
  );
}

function StatusPill({ status }: { status: string | null }) {
  const s = (status ?? "pending").toLowerCase();
  const label =
    s === "approved" ? "Godkjent" : s === "rejected" ? "Avslått" : "Til vurdering";

  const cls =
    s === "approved"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
      : s === "rejected"
        ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/20"
        : "bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-500/20";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

export default async function MePage() {
  const supabase = await getSupabase();

  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
    


  if (!user?.email) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Min side</h1>
        <p className="mt-3 text-[rgb(var(--muted))]">
          Du må logge inn for å se dine innsendinger og selskaper.
        </p>

        <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
          <p className="text-sm">
            Gå til{" "}
            <Link className="underline" href="/auth?next=/me">
              /auth
            </Link>{" "}
            for å logge inn.
          </p>
        </div>
      </main>
    );
  }

  // 1) Mine innsendinger
  // Bruk service role på serveren for å unngå at RLS/policy gjør at brukeren
  // "mister" sine egne submissions i /me. Vi filtrerer strengt på innlogget e-post.
  // Hvis service role key ikke er satt (f.eks. lokalt), faller vi tilbake til vanlig klient.
  const submissionsDb = process.env.SUPABASE_SERVICE_ROLE_KEY ? supabaseAdmin() : supabase;

  const { data: submissions, error: submissionsError } = await submissionsDb
    .from("submissions")
    .select(
      `
    *,
    published_company:companies!submissions_published_company_id_fkey (
      id,
      slug
    )
  `
    )
    .eq("contact_email", user.email)
    .order("created_at", { ascending: false });

  // 2) Mine selskaper
  // - A) direkte match på companies.email
  // - B) via claims (company_id knyttet til user_id)
  const [directRes, claimsRes] = await Promise.all([
    supabase
      .from("companies")
      .select("id, name, slug, website")
      .eq("email", user.email)
      .order("name", { ascending: true }),

    supabase
      .from("claims")
      .select("company_id, status, companies:company_id (id, name, slug, website)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const directCompanies = (directRes.data ?? []) as any[];
  const claimsRows = (claimsRes.data ?? []) as any[];
  const claimsDebug = {
    count: claimsRows.length,
    error: claimsRes.error?.message ?? null,
  };

  const claimStatusByCompanyId = new Map<string, string | null>();
  for (const r of claimsRows) {
    if (r?.company_id) claimStatusByCompanyId.set(r.company_id, r.status ?? null);
  }

  // claims kan være pending/rejected/approved – vi viser alle, men kan filtrere senere
  const claimedCompanies = claimsRows.map((r) => r.companies).filter(Boolean) as any[];

  // dedupe på company.id (hvis samme selskap finnes i begge lister)
  const byId = new Map<string, any>();
  for (const c of [...directCompanies, ...claimedCompanies]) {
    if (c?.id) byId.set(c.id, c);
  }

  const myCompanies = Array.from(byId.values());
  const hasSubmissions = !!submissions && submissions.length > 0;
const hasCompanies = !!myCompanies && myCompanies.length > 0;

// “Venter på godkjenning” = har sendt inn, men har ingen selskaper koblet enda
const waitingForApproval = hasSubmissions && !hasCompanies;


  // hvis en av spørringene feiler, prioriterer vi å vise feilmelding
  const companiesError = directRes.error ?? claimsRes.error;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Min side</h1>
          <p className="mt-2 text-[rgb(var(--muted))]">
            Innlogget som{" "}
            <span className="font-medium text-[rgb(var(--fg))]">{user.email}</span>
          </p>
          {process.env.NODE_ENV !== "production" ? (
  <>
    <p className="mt-1 text-xs text-[rgb(var(--muted))]">user_id: {user.id}</p>
    <p className="mt-2 text-xs text-[rgb(var(--muted))]">
      claimsRows: {claimsDebug.count}
      {claimsDebug.error ? ` • error: ${claimsDebug.error}` : ""}
    </p>
  </>
) : null}

        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/register/company"
            className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
          >
            + Registrer bedrift
          </Link>
          <SignOutButton />
        </div>
      </div>

         

      
      {waitingForApproval ? (
  <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 shadow-soft">
    <p className="text-sm font-semibold">Innsending mottatt – venter på godkjenning</p>
    <p className="mt-2 text-sm text-[rgb(var(--muted))]">
      Du er innlogget, men bedriften din er ikke publisert i katalogen ennå. Når admin har godkjent innsendingen,
      får du e-post og profilen dukker opp her.
    </p>
  </div>
) : null}

      
      {/* UI-hint: hvorfor redigering kan være låst */}
{!waitingForApproval ? (
  <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">

  <p className="text-sm font-semibold">Hvorfor er “Rediger profil” noen ganger låst?</p>
  <p className="mt-2 text-sm text-[rgb(var(--muted))]">
    Det finnes to ulike godkjenninger i systemet:
  </p>

  <ul className="mt-2 list-disc pl-5 text-sm text-[rgb(var(--muted))] grid gap-1">
    <li>
      <b>Godkjenning av innsending</b> (ny bedrift): Admin publiserer innsendingen til katalogen.
    </li>
    <li>
      <b>Godkjenning av claim</b> (eierskap): Admin må godkjenne at du kan redigere en bedrift som allerede finnes.
    </li>
  </ul>

  <p className="mt-2 text-sm text-[rgb(var(--muted))]">
    Hvis du ser <b>“Til vurdering”</b>, betyr det at en claim venter på godkjenning. Hvis du ser <b>“Avslått”</b>, er claim avvist.
  </p>
  </div>
) : null}


      {/* Errors */}
      {companiesError ? (
        <div className="mt-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6">
          <p className="text-sm font-semibold">Kunne ikke hente dine selskaper</p>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">{companiesError.message}</p>
        </div>
      ) : null}

      {submissionsError ? (
        <div className="mt-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6">
          <p className="text-sm font-semibold">Kunne ikke hente innsendinger</p>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">{submissionsError.message}</p>
        </div>
      ) : null}

      {/* Mine selskaper */}
      {!companiesError && myCompanies && myCompanies.length > 0 ? (
        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Mine selskaper</h2>
            <p className="text-xs text-[rgb(var(--muted))]">
              Dette er selskaper der e-post-eier matcher innlogget bruker.
            </p>
          </div>

          <div className="mt-4 grid gap-4">
            {myCompanies.map((c: any) => {
              const website = c.website ? String(c.website) : null;

              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-lg font-semibold truncate">{c.name ?? "Ukjent navn"}</p>

                      {claimStatusByCompanyId.get(c.id) ? (
                        <div className="mt-2">
                          <StatusPill status={claimStatusByCompanyId.get(c.id) ?? null} />
                        </div>
                      ) : null}

                      <p className="mt-1 text-xs text-[rgb(var(--muted))]">{website ? website : ""}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {c.slug ? (
                        <Link className="text-sm underline" href={`/selskap/${c.slug}`}>
                          Se profil
                        </Link>
                      ) : null}

                      {(() => {
                        const status = claimStatusByCompanyId.get(c.id);
                        const canEdit = !status || status === "approved";

                        return canEdit ? (
                          <Link className="text-sm underline" href={`/me/company/${c.id}`}>
                            Rediger profil
                          </Link>
                        ) : (
                          <span className="text-sm text-[rgb(var(--muted))]">
  Redigering låst –{" "}
  {status === "rejected"
    ? "claim ble avslått. Send claim på nytt eller kontakt admin."
    : "claim er til vurdering. Admin må godkjenne før du kan redigere."}
</span>

                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Mine innsendinger */}
      {!submissionsError && submissions && submissions.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Mine innsendinger</h2>

          <div className="mt-4 grid gap-4">
            {submissions.map((s: any) => {
              const created = s.created_at ? new Date(s.created_at).toLocaleString("no-NO") : "";
              const website = s.website as string | null;
              const loc = s.location && s.location.trim() ? s.location : "Ukjent";

              const publishedSlug = s.published_company?.slug as string | null;
              const publishedId = s.published_company?.id as string | null;

              return (
                <div
                  key={s.id}
                  className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-lg font-semibold truncate">
                        {s.company_name ?? "Ukjent navn"}
                      </p>
                      <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                        Sendt inn: {created}
                        {loc ? ` • ${loc}` : ""}
                        {website ? ` • ${website}` : ""}
                      </p>
                    </div>

                    <StatusPill status={s.status ?? "pending"} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {publishedSlug ? (
                      <Link className="text-sm underline" href={`/selskap/${publishedSlug}`}>
                        Se profil
                      </Link>
                    ) : null}

                    {publishedId ? (
                      <Link className="text-sm underline" href={`/me/company/${publishedId}`}>
                        Rediger profil
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Empty state */}
      {!companiesError &&
      (!myCompanies || myCompanies.length === 0) &&
      !submissionsError &&
      (!submissions || submissions.length === 0) ? (
        <div className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 shadow-soft">
          <p className="text-sm font-semibold">Ingen innsendinger eller selskaper funnet</p>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Registrer en bedrift for å få den knyttet til kontoen din.
          </p>
          <div className="mt-5">
            <Link className="underline text-sm" href="/register/company">
              Gå til registrering
            </Link>
          </div>
        </div>
      ) : null}
    </main>
  );
}
