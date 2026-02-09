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

type AdRow = {
  id: number;
  placement: string;
  title: string | null;
  image_url: string | null;
  href: string | null;
  is_active: boolean;
  priority: number | null;
  starts_at: string | null;
  ends_at: string | null;
};

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

async function updateAdAction(formData: FormData) {
  "use server";
  await requireAdmin();

  const idRaw = String(formData.get("id") ?? "").trim();
  const placement = String(formData.get("placement") ?? "").trim();
  const priorityRaw = String(formData.get("priority") ?? "0").trim();
  const is_active = formData.get("is_active") === "on";
  const startsRaw = String(formData.get("starts_at") ?? "").trim();
  const endsRaw = String(formData.get("ends_at") ?? "").trim();

  const id = Number(idRaw);
  const priority = Number.isFinite(Number(priorityRaw)) ? Number(priorityRaw) : 0;
  const starts_at = startsRaw ? new Date(startsRaw).toISOString() : null;
  const ends_at = endsRaw ? new Date(endsRaw).toISOString() : null;

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Ugyldig annonse-id.");
  }
  if (!placement) {
    throw new Error("Placement er påkrevd.");
  }

  const db = supabaseAdmin();
  const { error } = await db
    .from("ads")
    .update({
      placement,
      priority,
      is_active,
      starts_at,
      ends_at,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/selskaper");
  revalidatePath("/internasjonalt");
  revalidatePath("/andre-ki-tjenester");
  revalidatePath("/admin/ads");
}

function toDateTimeLocalValue(value: string | null | undefined) {
  if (!value) return "";
  return value.replace(" ", "T").slice(0, 16);
}

function getScheduleStatus(
  startsAt: string | null | undefined,
  endsAt: string | null | undefined
) {
  const now = Date.now();
  const starts = startsAt ? Date.parse(startsAt) : null;
  const ends = endsAt ? Date.parse(endsAt) : null;

  if (Number.isFinite(starts as number) && (starts as number) > now) {
    return "fremtid";
  }
  if (Number.isFinite(ends as number) && (ends as number) < now) {
    return "utløpt";
  }
  return "nå";
}

function isActiveNow(ad: {
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
}) {
  if (!ad.is_active) return false;
  const now = Date.now();
  const starts = ad.starts_at ? Date.parse(ad.starts_at) : null;
  const ends = ad.ends_at ? Date.parse(ad.ends_at) : null;
  if (Number.isFinite(starts as number) && (starts as number) > now) return false;
  if (Number.isFinite(ends as number) && (ends as number) < now) return false;
  return true;
}

function pickEffectiveNowForPlacement(placement: string, ads: AdRow[]) {
  const active = ads.filter((ad) => ad.placement === placement && isActiveNow(ad));
  if (!active.length) return null;

  const minPriority = active.reduce(
    (min, ad) => Math.min(min, ad.priority ?? 0),
    Number.POSITIVE_INFINITY
  );
  const pool = active.filter((ad) => (ad.priority ?? 0) === minPriority);
  if (pool.length === 1) return pool[0];

  const intervalMinutes = 30;
  const bucket = Math.floor(Date.now() / (intervalMinutes * 60 * 1000));
  const index = bucket % pool.length;
  return pool[index];
}

export default async function AdminAdsPage() {
  await requireAdmin();
  const db = supabaseAdmin();

  const { data: ads, error } = await db
    .from("ads")
    .select("id, placement, title, image_url, href, is_active, priority, starts_at, ends_at")
    .order("id", { ascending: true });

  const adRows = ((ads ?? []) as AdRow[]).map((ad) => ({
    ...ad,
    image_url: ad.image_url ?? null,
    href: ad.href ?? null,
  }));

  const effectiveNow = placements.map((placement) => {
    const chosen = pickEffectiveNowForPlacement(placement, adRows);
    const hasAnyRows = adRows.some((ad) => ad.placement === placement);
    return {
      placement,
      chosen,
      hasAnyRows,
      source: chosen ? "db" : "fallback",
    };
  });

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
        <h2 className="text-lg font-semibold">Effektiv visning nå (UI)</h2>
        <p className="mt-2 text-xs text-[rgb(var(--muted))]">
          Viser hva nettstedet faktisk bruker per placement akkurat nå:
          DB-rad eller kode-fallback (Gullhaien).
        </p>
        <div className="mt-4 grid gap-2">
          {effectiveNow.map((slot) => (
            <div
              key={`effective-${slot.placement}`}
              className="grid gap-2 rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm md:grid-cols-[minmax(200px,1fr),minmax(120px,auto),minmax(220px,1fr),minmax(80px,auto)]"
            >
              <div className="font-mono text-[rgb(var(--muted))]">{slot.placement}</div>
              <div
                className={
                  slot.source === "db"
                    ? "text-emerald-400"
                    : "text-amber-400"
                }
              >
                {slot.source === "db" ? "DB" : "Fallback"}
              </div>
              <div>
                {slot.chosen ? (
                  <>
                    #{slot.chosen.id} · {slot.chosen.title ?? "Uten tittel"}
                  </>
                ) : (
                  "Gullhaien 2026 (kode-fallback)"
                )}
              </div>
              <div className="text-[rgb(var(--muted))]">
                {slot.chosen
                  ? `pri ${slot.chosen.priority ?? 0}`
                  : slot.hasAnyRows
                    ? "ingen aktiv nå"
                    : "ingen DB-rad"}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <h2 className="text-lg font-semibold">Eksisterende annonser</h2>
        {error ? (
          <p className="mt-2 text-sm text-rose-500">DB‑feil: {error.message}</p>
        ) : null}
        <p className="mt-2 text-xs text-[rgb(var(--muted))]">
          Viser alle annonser (fortid, nåtid og fremtid).
        </p>
        <div className="mt-4 grid gap-3">
          {adRows.map((ad) => (
            <form
              key={ad.id}
              action={updateAdAction}
              className="grid gap-3 rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm md:grid-cols-[auto,minmax(220px,1fr),minmax(180px,1fr),auto,auto,auto,auto,auto]"
            >
              <input type="hidden" name="id" value={ad.id} />
              <div className="font-semibold self-center">#{ad.id}</div>
              <select
                name="placement"
                defaultValue={ad.placement}
                className="min-w-[220px] rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5 text-sm text-[rgb(var(--fg))]"
              >
                {placements.map((p) => (
                  <option key={`${ad.id}-${p}`} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <div className="self-center">{ad.title ?? "—"}</div>
              <label className="inline-flex items-center gap-2 text-[rgb(var(--muted))] self-center">
                pri
                <input
                  name="priority"
                  type="number"
                  defaultValue={ad.priority ?? 0}
                  className="w-20 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-2 py-1 text-sm text-[rgb(var(--fg))]"
                />
              </label>
              <label className="inline-flex items-center gap-2 text-[rgb(var(--muted))] self-center">
                <input
                  name="is_active"
                  type="checkbox"
                  defaultChecked={Boolean(ad.is_active)}
                />
                aktiv
              </label>
              <label className="grid gap-1 text-[rgb(var(--muted))]">
                <span className="text-xs">start</span>
                <input
                  name="starts_at"
                  type="datetime-local"
                  defaultValue={toDateTimeLocalValue(ad.starts_at)}
                  className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-2 py-1 text-sm text-[rgb(var(--fg))]"
                />
              </label>
              <label className="grid gap-1 text-[rgb(var(--muted))]">
                <span className="text-xs">slutt</span>
                <input
                  name="ends_at"
                  type="datetime-local"
                  defaultValue={toDateTimeLocalValue(ad.ends_at)}
                  className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-2 py-1 text-sm text-[rgb(var(--fg))]"
                />
              </label>
              <div className="self-center text-[rgb(var(--muted))]">
                {getScheduleStatus(ad.starts_at, ad.ends_at)}
              </div>
              <button
                type="submit"
                className="inline-flex self-center rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-sm font-semibold hover:bg-[rgb(var(--bg))] transition"
              >
                Lagre
              </button>
            </form>
          ))}
          {!ads?.length && !error ? (
            <p className="text-sm text-[rgb(var(--muted))]">Ingen annonser.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
