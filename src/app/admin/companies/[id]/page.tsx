// src/app/admin/companies/[id]/page.tsx
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/server";
import { updateCompanyProfile } from "@/lib/companies/updateCompanyProfile";
import { aiLevelLabel, priceLevelLabel } from "@/lib/utils";


export const dynamic = "force-dynamic";

async function updateCompanyAction(formData: FormData) {
  "use server";

  // ✅ Admin-only
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing company id");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Missing company name");

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


  // ✅ Admin-UI revalidate
  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
}

async function deactivateCompanyAction(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing company id");

  const db = supabaseAdmin();
  const { data: current, error: readErr } = await db
    .from("companies")
    .select("id,slug")
    .eq("id", id)
    .maybeSingle();
  if (readErr) throw new Error(readErr.message);

  const { error } = await db.from("companies").update({ is_active: false }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  revalidatePath("/selskaper");
  if (current?.slug) revalidatePath(`/selskap/${current.slug}`);
}

async function activateCompanyAction(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing company id");

  const db = supabaseAdmin();
  const { data: current, error: readErr } = await db
    .from("companies")
    .select("id,slug")
    .eq("id", id)
    .maybeSingle();
  if (readErr) throw new Error(readErr.message);

  const { error } = await db.from("companies").update({ is_active: true }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  revalidatePath("/selskaper");
  if (current?.slug) revalidatePath(`/selskap/${current.slug}`);
}

export default async function AdminCompanyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Admin-only
  await requireAdmin();

  const { id } = await params;
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
        <h1 className="text-2xl font-semibold">Rediger bedrift</h1>
        <p className="mt-3 text-sm text-[rgb(var(--muted))]">
          {error?.message ?? `Fant ingen bedrift med ID: ${id}`}
        </p>
        <div className="mt-6">
          <Link className="underline text-sm" href="/admin/companies">
            ← Tilbake til liste
          </Link>
        </div>
      </main>
    );
  }

  const { data: locations, error: locErr } = await db
    .from("locations")
    .select("id,name")
    .order("name", { ascending: true });

  if (locErr) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Rediger bedrift</h1>
        <p className="mt-3 text-sm text-[rgb(var(--muted))]">
          DB-feil ved henting av locations: {locErr.message}
        </p>
        <div className="mt-6">
          <Link className="underline text-sm" href="/admin/companies">
            ← Tilbake til liste
          </Link>
        </div>
      </main>
    );
  }

  const loc = Array.isArray((company as any).locations)
    ? (company as any).locations[0]
    : (company as any).locations;

  const isActive = Boolean((company as any).is_active);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Rediger bedrift</h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            ID: <span className="font-mono">{(company as any).id}</span>
            {(company as any).slug ? (
              <>
                {" "}
                • Slug: <span className="font-mono">{(company as any).slug}</span>
              </>
            ) : null}
          </p>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Location: <span className="font-medium text-[rgb(var(--fg))]">{loc?.name ?? "—"}</span>{" "}
            • Status:{" "}
            <span className="font-medium text-[rgb(var(--fg))]">{isActive ? "Aktiv" : "Deaktivert"}</span>
          </p>
        </div>

        <div className="flex gap-3">
          {(company as any).slug ? (
            <Link className="underline text-sm" href={`/selskap/${(company as any).slug}`}>
              Se profil ↗
            </Link>
          ) : null}
          <Link className="underline text-sm" href="/admin/companies">
            ← Tilbake
          </Link>
        </div>
      </div>

      {/* COVER */}
      <div className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <div className="text-sm font-semibold">Cover image</div>

        {(company as any).cover_image ? (
          <div className="mt-3 grid gap-2">
            <img
              src={(company as any).cover_image}
              alt="Cover"
              className="w-full max-h-[240px] object-cover rounded-xl border border-[rgb(var(--border))]"
            />
            <div className="text-xs text-[rgb(var(--muted))] break-words">{(company as any).cover_image}</div>
          </div>
        ) : (
          <div className="mt-3 text-sm text-[rgb(var(--muted))]">Ingen cover image ennå.</div>
        )}

        <form
          action="/api/admin/company-cover"
          method="post"
          encType="multipart/form-data"
          className="mt-4 grid gap-3"
        >
          <input type="hidden" name="company_id" value={(company as any).id} />
          <input type="file" name="file" accept="image/*" required />
          <button
            type="submit"
            className="inline-flex w-fit rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold hover:shadow-soft transition"
          >
            Last opp nytt cover
          </button>
        </form>
      </div>

      {/* VIDEO MP4 (under cover) */}
      <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <div className="text-sm font-semibold">Video (.mp4)</div>

        {(company as any).video_url ? (
          <div className="mt-3 grid gap-2">
            <video
              src={(company as any).video_url}
              controls
              className="w-full max-h-[240px] rounded-xl border border-[rgb(var(--border))] bg-black"
            />
            <div className="text-xs text-[rgb(var(--muted))] break-words">{(company as any).video_url}</div>
          </div>
        ) : (
          <div className="mt-3 text-sm text-[rgb(var(--muted))]">Ingen video ennå.</div>
        )}

        <form
          action="/api/admin/company-video"
          method="post"
          encType="multipart/form-data"
          className="mt-4 grid gap-3"
        >
          <input type="hidden" name="company_id" value={(company as any).id} />
          <input type="file" name="file" accept="video/mp4" required />
          <button
            type="submit"
            className="inline-flex w-fit rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold hover:shadow-soft transition"
          >
            Last opp ny video (.mp4)
          </button>
        </form>

        {(company as any).video_url ? (
          <form action="/api/admin/company-video/remove" method="post" className="mt-3">
            <input type="hidden" name="company_id" value={(company as any).id} />
            <button
              type="submit"
              className="inline-flex w-fit rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm font-semibold hover:shadow-soft transition"
            >
              Fjern video (kun DB)
            </button>
          </form>
        ) : null}
      </div>

      {/* EDIT FORM */}
      <form action={updateCompanyAction} className="mt-8 grid gap-4">
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
            <option value="byrå">Byrå</option>
            <option value="studio">Studio</option>
            <option value="miljø">Miljø</option>
            <option value="frilans">Frilans</option>
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
    rows={6}
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
{[0, 1, 2, 3, 4].map((level) => (
  <option key={level} value={String(level)}>
    {level} – {aiLevelLabel(level)}
  </option>
))}

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
{[0, 1, 2, 3, 4].map((level) => (
  <option key={level} value={String(level)}>
    {level} – {priceLevelLabel(level)}
  </option>
))}

          </select>
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex w-fit rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition"
        >
          Lagre endringer
        </button>
      </form>

      {/* ADMIN: Activate/Deactivate */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {isActive ? (
          <form action={deactivateCompanyAction}>
            <input type="hidden" name="id" value={(company as any).id} />
            <button
              type="submit"
              className="rounded-xl border border-[rgb(var(--border))] bg-rose-500/15 px-4 py-2 text-sm font-semibold hover:shadow-soft transition"
            >
              Deaktiver bedrift
            </button>
          </form>
        ) : (
          <form action={activateCompanyAction}>
            <input type="hidden" name="id" value={(company as any).id} />
            <button
              type="submit"
              className="rounded-xl border border-[rgb(var(--border))] bg-emerald-500/15 px-4 py-2 text-sm font-semibold hover:shadow-soft transition"
            >
              Aktiver bedrift
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
