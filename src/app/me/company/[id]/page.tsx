// src/app/me/company/[id]/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { updateCompanyProfile } from "@/lib/companies/updateCompanyProfile";

export const dynamic = "force-dynamic";

/**
 * Hent innlogget bruker (server-side) via cookies.
 */
async function getAuthedUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // settes i middleware/callback
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/**
 * ✅ Ny, konsistent tilgangsregel for "edit company":
 * - approved claim OR direkte eierskap (companies.email === user.email)
 *
 * Returnerer også claimStatus så vi kan vise forklaring i UI.
 */
async function getEditAccess(companyId: string) {
  const user = await getAuthedUser();
  if (!user?.id || !user.email) {
    return { ok: false as const, reason: "not_logged_in" as const, user: null, claimStatus: null };
  }

  const db = supabaseAdmin();

  // 1) Hent company.email (direkte-eierskap)
  const { data: companyRow, error: cErr } = await db
    .from("companies")
    .select("id, email")
    .eq("id", companyId)
    .maybeSingle();

  if (cErr || !companyRow) {
    return { ok: false as const, reason: "company_not_found" as const, user, claimStatus: null };
  }

  const directOwner =
    companyRow.email && String(companyRow.email).toLowerCase() === String(user.email).toLowerCase();

  // 2) Hent claim-status for denne brukeren (hvis finnes)
  const { data: claimRow } = await db
    .from("claims")
    .select("status")
    .eq("company_id", companyId)
    .eq("user_id", user.id)
    .maybeSingle();

  const claimStatus = (claimRow?.status as string | null) ?? null;
  const claimApproved = claimStatus === "approved";

  if (claimApproved || directOwner) {
    return { ok: true as const, user, claimStatus };
  }

  // Ikke tilgang: men vi vil vise *hvorfor* i UI
  return { ok: false as const, reason: "no_access" as const, user, claimStatus };
}

/**
 * Oppdater bedrift (owner-mode).
 * Bruker service role for å unngå RLS-problemer,
 * men krever edit-access (approved claim eller direkte eierskap).
 */
async function updateCompanyAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing company id");

  const access = await getEditAccess(id);
  if (!access.ok) {
    redirect(`/auth?next=${encodeURIComponent(`/me/company/${id}`)}`);
  }

  const name = String(formData.get("name") ?? "").trim();
  const company_type = String(formData.get("company_type") ?? "").trim() || null;

  const locationRaw = String(formData.get("location_id") ?? "").trim();
  const location_id = locationRaw === "" ? null : locationRaw;

  const aiRaw = String(formData.get("ai_level") ?? "").trim();
  const priceRaw = String(formData.get("price_level") ?? "").trim();

  const ai_level = aiRaw === "" ? null : Number(aiRaw);
  const price_level = priceRaw === "" ? null : Number(priceRaw);

  const emailRaw = String(formData.get("email") ?? "").trim();
  const email = emailRaw === "" ? null : emailRaw;

  const videoRaw = String(formData.get("video_url") ?? "").trim();
  const video_url = videoRaw === "" ? null : videoRaw;

    const websiteRaw = String(formData.get("website") ?? "").trim();
  const website = websiteRaw === "" ? null : websiteRaw;

  const shortRaw = String(formData.get("short_description") ?? "").trim();
  const short_description = shortRaw === "" ? null : shortRaw;

  const descRaw = String(formData.get("description") ?? "").trim();
  const description = descRaw === "" ? null : descRaw;


  if (!name) throw new Error("Missing company name");

  // ✅ Felles write-path (håndterer også revalidate for /selskaper + /selskap/[slug])
    await updateCompanyProfile(id, {
    name,
    company_type,
    location_id,
    ai_level: Number.isFinite(ai_level as any) ? ai_level : null,
    price_level: Number.isFinite(price_level as any) ? price_level : null,
    email,
    website,
    short_description,
    description,
    video_url,
  });


  // ✅ Owner-UI revalidate
  revalidatePath("/me");
  revalidatePath(`/me/company/${id}`);

  redirect("/me");
}

/**
 * Soft delete bedrift (uten admin-godkjenning).
 * 2-stegs bekreftelse uten JS: må skrive "SLETT".
 *
 * Forutsetter at companies har kolonnen `deleted_at timestamptz` (nullable).
 */
async function softDeleteCompanyAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing company id");

  const confirm = String(formData.get("confirm_text") ?? "").trim();
  if (confirm !== "SLETT") {
    throw new Error('Bekreftelse mangler. Skriv "SLETT" for å slette.');
  }

  const access = await getEditAccess(id);
  if (!access.ok) {
    redirect(`/auth?next=${encodeURIComponent(`/me/company/${id}`)}`);
  }

  const db = supabaseAdmin();

  const { data: current, error: readErr } = await db
    .from("companies")
    .select("id, slug")
    .eq("id", id)
    .maybeSingle();

  if (readErr) throw new Error(readErr.message);
  if (!current) throw new Error("Company not found");

  const { error: delErr } = await db
    .from("companies")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (delErr) throw new Error(delErr.message);

  revalidatePath("/me");
  revalidatePath("/selskaper");
  if (current.slug) revalidatePath(`/selskap/${current.slug}`);
  revalidatePath(`/me/company/${id}`);

  redirect("/me");
}

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const access = await getEditAccess(id);

  // Hvis ikke innlogget: send til auth med next tilbake hit
  if (!access.ok && access.reason === "not_logged_in") {
    redirect(`/auth?next=${encodeURIComponent(`/me/company/${id}`)}`);
  }

  const db = supabaseAdmin();

  const { data: company, error } = await db
    .from("companies")
    .select(
      `
      id,
      name,
      slug,
      is_active,
      company_type,
      ai_level,
      price_level,
      website,
      short_description,
      description,
      email,
      phone,
      cover_image,
      video_url,
      deleted_at,
      location_id,
      locations:location_id (
        id,
        name,
        slug
      )
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !company) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Fant ikke selskap</h1>
        <p className="mt-3 text-sm text-[rgb(var(--muted))]">
          {error?.message ?? "Ukjent feil"}
        </p>
        <div className="mt-6">
          <Link className="underline text-sm" href="/me">
            Tilbake
          </Link>
        </div>
      </main>
    );
  }

  // Hvis allerede soft-deletet, send bruker tilbake.
  if ((company as any).deleted_at) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Denne bedriften er slettet</h1>
        <p className="mt-3 text-sm text-[rgb(var(--muted))]">
          Profilen er markert som slettet og vises ikke i katalogen.
        </p>
        <div className="mt-6">
          <Link className="underline text-sm" href="/me">
            Tilbake til Min side
          </Link>
        </div>
      </main>
    );
  }

  const { data: locations, error: locErr } = await db
    .from("locations")
    .select("id, name")
    .order("name", { ascending: true });

  if (locErr) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Feil</h1>
        <p className="mt-3 text-sm text-[rgb(var(--muted))]">
          DB-feil ved henting av locations: {locErr.message}
        </p>
        <div className="mt-6">
          <Link className="underline text-sm" href="/me">
            Tilbake
          </Link>
        </div>
      </main>
    );
  }

  const loc = Array.isArray((company as any).locations)
    ? (company as any).locations[0]
    : (company as any).locations;

  const isActive = Boolean((company as any).is_active);

  // ✅ Hvis mangler tilgang: vis forklaring i stedet for hard fail
  if (!access.ok && access.reason === "no_access") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Du har ikke tilgang til å redigere</h1>

        <p className="mt-3 text-sm text-[rgb(var(--muted))]">
          Denne bedriften er publisert, men du må ha enten godkjent claim eller være registrert som
          eier (kontakt-e-post på bedriften må matche din innlogging).
        </p>

        <div className="mt-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-soft">
          <div className="text-sm font-semibold">Status</div>
          <div className="mt-2 text-sm text-[rgb(var(--muted))]">
            Claim-status: <b>{access.claimStatus ?? "ingen claim"}</b>
          </div>
          <div className="mt-2 text-sm text-[rgb(var(--muted))]">
            Publisering: <b>{isActive ? "aktiv" : "ikke aktiv"}</b>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="underline text-sm" href="/me">
            ← Tilbake til Min side
          </Link>

          {(company as any).slug ? (
            <Link className="underline text-sm" href={`/selskap/${(company as any).slug}`}>
              Åpne profilsiden (for å claime) ↗
            </Link>
          ) : null}
        </div>
      </main>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h1>Rediger bedrift</h1>

      <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
        <div>
          <b>ID:</b> {(company as any).id}
        </div>
        <div>
          <b>Slug:</b> {(company as any).slug ?? "—"}
        </div>
        <div>
          <b>Location:</b> {loc?.name ?? "—"}
        </div>
        <div>
          <b>Status:</b> {isActive ? "Aktiv" : "Deaktivert"}
        </div>
      </div>

      {/* COVER IMAGE PREVIEW + UPLOAD */}
      <div
        style={{
          marginTop: 14,
          padding: 12,
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 12,
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Cover image</div>

        {(company as any).cover_image ? (
          <div style={{ display: "grid", gap: 8 }}>
            <img
              src={(company as any).cover_image}
              alt="Cover"
              style={{
                width: "100%",
                maxHeight: 240,
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
            <div style={{ opacity: 0.8, fontSize: 13 }}>{(company as any).cover_image}</div>
          </div>
        ) : (
          <div style={{ opacity: 0.7 }}>Ingen cover image ennå.</div>
        )}

        <form
          action="/api/admin/company-cover"
          method="post"
          encType="multipart/form-data"
          style={{ marginTop: 12, display: "grid", gap: 10 }}
        >
          <input type="hidden" name="company_id" value={(company as any).id} />
          <input type="file" name="file" accept="image/*" required style={{ color: "white" }} />
          <button
            type="submit"
            style={{
              padding: 10,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Last opp nytt cover
          </button>
        </form>
      </div>

      {/* VIDEO PREVIEW + UPLOAD (skal ligge rett under cover) */}
      <div
        style={{
          marginTop: 14,
          padding: 12,
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 12,
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Video (.mp4)</div>

        {(company as any).video_url ? (
          <div style={{ display: "grid", gap: 8 }}>
            <video
              src={(company as any).video_url}
              controls
              style={{
                width: "100%",
                maxHeight: 240,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "black",
              }}
            />
            <div style={{ opacity: 0.8, fontSize: 13 }}>{(company as any).video_url}</div>
          </div>
        ) : (
          <div style={{ opacity: 0.7 }}>Ingen video ennå.</div>
        )}

        <form
          action="/api/admin/company-video"
          method="post"
          encType="multipart/form-data"
          style={{ marginTop: 12, display: "grid", gap: 10 }}
        >
          <input type="hidden" name="company_id" value={(company as any).id} />
          <input type="file" name="file" accept="video/mp4" required style={{ color: "white" }} />
          <button
            type="submit"
            style={{
              padding: 10,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Last opp ny video (.mp4)
          </button>
        </form>

        {(company as any).video_url ? (
          <form action="/api/admin/company-video/remove" method="post" style={{ marginTop: 10 }}>
            <input type="hidden" name="company_id" value={(company as any).id} />
            <button
              type="submit"
              style={{
                padding: 10,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Fjern video (kun DB)
            </button>
          </form>
        ) : null}
      </div>

      <hr style={{ margin: "18px 0", opacity: 0.2 }} />

      {/* ÉN form (ikke inni cover/video) */}
      <form action={updateCompanyAction} className="mt-6 grid gap-4">
        <input type="hidden" name="id" value={(company as any).id} />

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Location</label>
          <select
            name="location_id"
            defaultValue={(company as any).location_id ?? ""}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          >
            <option value="">— Ikke satt —</option>
            {(locations ?? []).map((l: any) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Navn</label>
          <input
            name="name"
            defaultValue={(company as any).name ?? ""}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Company type</label>
          <select
            name="company_type"
            defaultValue={(company as any).company_type ?? "byrå"}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          >
            <option value="Byrå">Byrå</option>
            <option value="Studio">Studio</option>
            <option value="Miljø">Miljø</option>
            <option value="Frilans">Frilans</option>
            <option value="UB/SB">UB/SB</option>
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Kontakt e-post</label>
          <input
            name="email"
            defaultValue={(company as any).email ?? ""}
            placeholder="post@firma.no"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

                <div className="grid gap-2">
          <label className="text-sm font-semibold">Nettside</label>
          <input
            name="website"
            defaultValue={(company as any).website ?? ""}
            placeholder="https://..."
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Kort beskrivelse</label>
          <input
            name="short_description"
            defaultValue={(company as any).short_description ?? ""}
            placeholder="Hva gjør dere, og hvordan bruker dere KI?"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Beskrivelse</label>
          <textarea
            name="description"
            defaultValue={(company as any).description ?? ""}
            rows={5}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>


        <div className="grid gap-2">
          <label className="text-sm font-semibold">Video (YouTube/Vimeo)</label>
          <input
            name="video_url"
            defaultValue={(company as any).video_url ?? ""}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
          <div className="text-xs text-[rgb(var(--muted))]">
            Du kan lime inn vanlig YouTube-lenke (watch?v=). Den konverteres automatisk på profilsiden.
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">AI level</label>
          <select
            name="ai_level"
            defaultValue={(company as any).ai_level ?? ""}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          >
            <option value="">— Ikke satt —</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Price level</label>
          <select
            name="price_level"
            defaultValue={(company as any).price_level ?? ""}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          >
            <option value="">— Ikke satt —</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex w-fit rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition"
        >
          Lagre endringer
        </button>
      </form>

      {/* Soft delete med 2-stegs bekreftelse uten JS */}
      <div
        style={{
          marginTop: 18,
          padding: 12,
          borderRadius: 12,
          border: "1px solid rgba(255, 0, 0, 0.25)",
          background: "rgba(255, 0, 0, 0.06)",
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 6, color: "rgba(255,255,255,0.95)" }}>
          Slett bedrift (soft delete)
        </div>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 10 }}>
          Dette skjuler bedriften fra katalogen. For å bekrefte må du skrive <b>SLETT</b>.
        </div>

        <form action={softDeleteCompanyAction} className="grid gap-3">
          <input type="hidden" name="id" value={(company as any).id} />

          <input
            name="confirm_text"
            placeholder='Skriv "SLETT"'
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />

          <button
            type="submit"
            className="inline-flex w-fit rounded-xl border border-rose-500/30 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Slett bedrift
          </button>
        </form>
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/me">← Tilbake</Link>
      </div>
    </div>
  );
}
