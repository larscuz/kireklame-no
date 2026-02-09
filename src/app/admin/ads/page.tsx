// src/app/admin/ads/page.tsx
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const placements = [
  "home_hero_sidebar",
  "companies_hero_sidebar",
  "international_hero_sidebar",
  "catalog_top_banner",
  "catalog_inline_card",
  "catalog_grid_banner",
  "catalog_grid_banner_2",
  "catalog_grid_banner_3",
  "other_top_banner",
  "other_mid_banner",
  "other_hero_sidebar",
  "other_inline_card",
  "other_inline_card_2",
];

async function createAdAction(formData: FormData) {
  "use server";
  await requireAdmin();

  const placement = String(formData.get("placement") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || null;
  const meta = String(formData.get("meta") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const image_url = String(formData.get("image_url") ?? "").trim();
  const mobile_image_url = String(formData.get("mobile_image_url") ?? "").trim() || null;
  const href = String(formData.get("href") ?? "").trim();
  const alt = String(formData.get("alt") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim() || null;
  const cta_text = String(formData.get("cta_text") ?? "").trim() || null;
  const priorityRaw = String(formData.get("priority") ?? "0").trim();
  const priority = Number.isFinite(Number(priorityRaw)) ? Number(priorityRaw) : 0;
  const is_active = formData.get("is_active") === "on";

  const startsRaw = String(formData.get("starts_at") ?? "").trim();
  const endsRaw = String(formData.get("ends_at") ?? "").trim();
  const starts_at = startsRaw ? new Date(startsRaw).toISOString() : null;
  const ends_at = endsRaw ? new Date(endsRaw).toISOString() : null;

  if (!placement || !image_url || !href || !alt) {
    throw new Error("Mangler påkrevde felt (placement, image_url, href, alt).");
  }

  const db = supabaseAdmin();
  const { error } = await db.from("ads").insert({
    placement,
    title,
    meta,
    description,
    image_url,
    mobile_image_url,
    href,
    alt,
    label,
    cta_text,
    priority,
    is_active,
    starts_at,
    ends_at,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/selskaper");
  revalidatePath("/internasjonalt");
  revalidatePath("/andre-ki-tjenester");
  revalidatePath("/admin/ads");
}

export default async function AdminAdsPage() {
  await requireAdmin();
  const db = supabaseAdmin();

  const { data: ads, error } = await db
    .from("ads")
    .select("id, placement, title, is_active, priority, starts_at, ends_at")
    .order("placement", { ascending: true })
    .order("priority", { ascending: true });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Annonser</h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Legg til annonser per plassering (placement). Bruk starts/ends for
            planlegging.
          </p>
        </div>
        <Link className="underline text-sm" href="/admin">
          ← Tilbake
        </Link>
      </div>

      <form
        action={createAdAction}
        className="mt-8 grid gap-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft"
      >
        <div className="grid gap-2">
          <label className="text-sm font-semibold">Placement</label>
          <select
            name="placement"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
            defaultValue=""
          >
            <option value="" disabled>
              Velg plassering
            </option>
            {placements.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Tittel (valgfri)</label>
          <input
            name="title"
            placeholder="f.eks. Gullhaien 2026"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Meta (valgfri)</label>
          <input
            name="meta"
            placeholder="f.eks. Oslo · Arrangement"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Beskrivelse (valgfri)</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Kort beskrivelse som vises i kort-visning."
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Bilde URL (påkrevd)</label>
          <input
            name="image_url"
            placeholder="/ads/YourImage.png"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Mobil bilde URL (valgfri)</label>
          <input
            name="mobile_image_url"
            placeholder="/ads/YourImageMobile.png"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Lenke (påkrevd)</label>
          <input
            name="href"
            placeholder="https://..."
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Alt‑tekst (påkrevd)</label>
          <input
            name="alt"
            placeholder="Kort bildebeskrivelse"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Label (valgfri)</label>
          <input
            name="label"
            placeholder="Sponset / Sponsored"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">CTA‑tekst (valgfri)</label>
          <input
            name="cta_text"
            placeholder="Se event →"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Prioritet</label>
          <input
            name="priority"
            type="number"
            defaultValue={0}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
          <p className="text-xs text-[rgb(var(--muted))]">
            Lavere tall = høyere prioritet.
          </p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Start (valgfri)</label>
          <input
            name="starts_at"
            type="datetime-local"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Slutt (valgfri)</label>
          <input
            name="ends_at"
            type="datetime-local"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" defaultChecked />
          Aktiv
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition"
          >
            Legg til annonse
          </button>
        </div>
      </form>

      <section className="mt-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <h2 className="text-lg font-semibold">Eksisterende annonser</h2>
        {error ? (
          <p className="mt-2 text-sm text-rose-500">DB‑feil: {error.message}</p>
        ) : null}
        <div className="mt-4 grid gap-3">
          {(ads ?? []).map((ad: any) => (
            <div
              key={ad.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm"
            >
              <div className="font-semibold">#{ad.id}</div>
              <div className="text-[rgb(var(--muted))]">{ad.placement}</div>
              <div>{ad.title ?? "—"}</div>
              <div className="text-[rgb(var(--muted))]">
                pri {ad.priority ?? 0}
              </div>
              <div className="text-[rgb(var(--muted))]">
                {ad.is_active ? "aktiv" : "av"}
              </div>
              <div className="text-[rgb(var(--muted))]">
                {ad.starts_at ? "start" : "—"} / {ad.ends_at ? "slutt" : "—"}
              </div>
            </div>
          ))}
          {!ads?.length && !error ? (
            <p className="text-sm text-[rgb(var(--muted))]">Ingen annonser.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
