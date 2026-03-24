// src/app/admin/ads/page.tsx
import Link from "next/link";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/server";
import { AD_PLACEMENT_KEYS } from "@/lib/adPlacements";
import {
  ADS_SELECT_BASE,
  ADS_SELECT_WITH_SCHEDULE,
  isMissingAdsScheduleColumns,
} from "@/lib/adsDb";
import AdAssetUploadField from "./AdAssetUploadField";

export const dynamic = "force-dynamic";

const placements = AD_PLACEMENT_KEYS;
const DEFAULT_AD_LABEL = "Sponset arrangement";
const DEFAULT_AD_CTA = "Se event →";

type UploadMode = "r2" | "endpoint" | "missing";
type ScheduleMode = "supported" | "missing";

type AdRow = {
  id: number;
  placement: string;
  title: string | null;
  meta: string | null;
  description: string | null;
  image_url: string | null;
  mobile_image_url: string | null;
  href: string | null;
  alt: string | null;
  label: string | null;
  cta_text: string | null;
  is_active: boolean;
  priority: number | null;
  starts_at: string | null;
  ends_at: string | null;
};

const FALLBACK_OPTION = "__fallback__";

type UploadStatus = {
  mode: UploadMode;
  message: string;
  missing: string[];
};

type AdsLoadResult = {
  rows: AdRow[];
  error: { message: string } | null;
  scheduleMode: ScheduleMode;
};

function hasEnv(name: string): boolean {
  return String(process.env[name] ?? "").trim().length > 0;
}

function resolveUploadStatus(): UploadStatus {
  const r2Ready =
    (hasEnv("R2_ACCOUNT_ID") || hasEnv("CLOUDFLARE_ACCOUNT_ID")) &&
    (hasEnv("ADS_UPLOAD_BUCKET") || hasEnv("R2_BUCKET")) &&
    hasEnv("R2_ACCESS_KEY_ID") &&
    hasEnv("R2_SECRET_ACCESS_KEY") &&
    hasEnv("R2_PUBLIC_BASE_URL");

  if (r2Ready) {
    return {
      mode: "r2",
      message: "Direkte R2-opplasting er aktiv for annonser.",
      missing: [],
    };
  }

  const endpointReady =
    (hasEnv("ADS_UPLOAD_URL") && hasEnv("ADS_UPLOAD_TOKEN")) ||
    (hasEnv("ONECOM_UPLOAD_URL") && hasEnv("ONECOM_UPLOAD_TOKEN"));

  if (endpointReady) {
    return {
      mode: "endpoint",
      message: "Endpoint-opplasting er aktiv for annonser.",
      missing: [],
    };
  }

  const missing: string[] = [];
  if (!(hasEnv("R2_ACCOUNT_ID") || hasEnv("CLOUDFLARE_ACCOUNT_ID"))) {
    missing.push("R2_ACCOUNT_ID eller CLOUDFLARE_ACCOUNT_ID");
  }
  if (!(hasEnv("ADS_UPLOAD_BUCKET") || hasEnv("R2_BUCKET"))) {
    missing.push("ADS_UPLOAD_BUCKET eller R2_BUCKET");
  }
  if (!hasEnv("R2_ACCESS_KEY_ID")) missing.push("R2_ACCESS_KEY_ID");
  if (!hasEnv("R2_SECRET_ACCESS_KEY")) missing.push("R2_SECRET_ACCESS_KEY");
  if (!hasEnv("R2_PUBLIC_BASE_URL")) missing.push("R2_PUBLIC_BASE_URL");

  return {
    mode: "missing",
    message: "Opplasting er ikke konfigurert ennå.",
    missing,
  };
}

function revalidateAdsPaths() {
  revalidatePath("/");
  revalidatePath("/selskaper");
  revalidatePath("/internasjonalt");
  revalidatePath("/andre-ki-tjenester");
  revalidatePath("/admin/ads");
}

async function insertAdWithOptionalSchedule(
  db: SupabaseClient,
  payload: {
    placement: string;
    title: string | null;
    meta: string | null;
    description: string | null;
    image_url: string;
    mobile_image_url: string | null;
    href: string;
    alt: string;
    label: string | null;
    cta_text: string | null;
    priority: number;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
  }
) {
  let { error } = await db.from("ads").insert(payload);
  if (error && isMissingAdsScheduleColumns(error)) {
    const { starts_at: _startsAt, ends_at: _endsAt, ...withoutSchedule } = payload;
    error = (await db.from("ads").insert(withoutSchedule)).error;
  }
  return error;
}

async function updateAdWithOptionalSchedule(
  db: SupabaseClient,
  id: number,
  payload: {
    placement: string;
    priority: number;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
  }
) {
  let { error } = await db.from("ads").update(payload).eq("id", id);
  if (error && isMissingAdsScheduleColumns(error)) {
    const { starts_at: _startsAt, ends_at: _endsAt, ...withoutSchedule } = payload;
    error = (await db.from("ads").update(withoutSchedule).eq("id", id)).error;
  }
  return error;
}

async function promoteAdWithOptionalSchedule(db: SupabaseClient, id: number) {
  let { error } = await db
    .from("ads")
    .update({
      is_active: true,
      priority: 0,
      starts_at: null,
      ends_at: null,
    })
    .eq("id", id);

  if (error && isMissingAdsScheduleColumns(error)) {
    error = (
      await db
        .from("ads")
        .update({
          is_active: true,
          priority: 0,
        })
        .eq("id", id)
    ).error;
  }

  return error;
}

async function cloneAdToPlacementWithOptionalSchedule(
  db: SupabaseClient,
  payload: {
    placement: string;
    title: string | null;
    meta: string | null;
    description: string | null;
    image_url: string;
    mobile_image_url: string | null;
    href: string;
    alt: string;
    label: string | null;
    cta_text: string | null;
  }
) {
  let { error } = await db.from("ads").insert({
    ...payload,
    is_active: true,
    priority: 0,
    starts_at: null,
    ends_at: null,
  });

  if (error && isMissingAdsScheduleColumns(error)) {
    error = (
      await db.from("ads").insert({
        ...payload,
        is_active: true,
        priority: 0,
      })
    ).error;
  }

  return error;
}

async function loadAdsForAdmin(db: SupabaseClient): Promise<AdsLoadResult> {
  const withSchedule = await db
    .from("ads")
    .select(ADS_SELECT_WITH_SCHEDULE)
    .order("id", { ascending: true });

  if (!withSchedule.error) {
    return {
      rows: ((withSchedule.data ?? []) as unknown as AdRow[]).map((ad) => ({
        ...ad,
        image_url: ad.image_url ?? null,
        href: ad.href ?? null,
      })),
      error: null,
      scheduleMode: "supported",
    };
  }

  if (!isMissingAdsScheduleColumns(withSchedule.error)) {
    return {
      rows: [],
      error: { message: withSchedule.error.message },
      scheduleMode: "supported",
    };
  }

  const withoutSchedule = await db
    .from("ads")
    .select(ADS_SELECT_BASE)
    .order("id", { ascending: true });

  if (withoutSchedule.error) {
    return {
      rows: [],
      error: { message: withoutSchedule.error.message },
      scheduleMode: "missing",
    };
  }

  return {
    rows: ((withoutSchedule.data ?? []) as unknown as Array<
      Omit<AdRow, "starts_at" | "ends_at">
    >).map((ad) => ({
      ...ad,
      image_url: ad.image_url ?? null,
      href: ad.href ?? null,
      starts_at: null,
      ends_at: null,
    })),
    error: null,
    scheduleMode: "missing",
  };
}

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
  const label = String(formData.get("label") ?? "").trim() || DEFAULT_AD_LABEL;
  const cta_text = String(formData.get("cta_text") ?? "").trim() || DEFAULT_AD_CTA;
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
  const error = await insertAdWithOptionalSchedule(db, {
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

  revalidateAdsPaths();
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
  const error = await updateAdWithOptionalSchedule(db, id, {
    placement,
    priority,
    is_active,
    starts_at,
    ends_at,
  });

  if (error) throw new Error(error.message);

  revalidateAdsPaths();
}

async function assignPlacementAction(formData: FormData) {
  "use server";
  await requireAdmin();

  const placement = String(formData.get("placement") ?? "").trim();
  const adIdRaw = String(formData.get("ad_id") ?? "").trim();

  if (!placements.includes(placement)) {
    throw new Error("Ugyldig plassering.");
  }

  const db = supabaseAdmin();

  if (!adIdRaw || adIdRaw === FALLBACK_OPTION) {
    const { error } = await db
      .from("ads")
      .update({ is_active: false, priority: 100 })
      .eq("placement", placement);

    if (error) throw new Error(error.message);
    revalidateAdsPaths();
    return;
  }

  const adId = Number(adIdRaw);
  if (!Number.isFinite(adId) || adId <= 0) {
    throw new Error("Ugyldig annonsevalg.");
  }

  const { data: source, error: sourceError } = await db
    .from("ads")
    .select(
      "id, placement, title, meta, description, image_url, mobile_image_url, href, alt, label, cta_text"
    )
    .eq("id", adId)
    .maybeSingle();

  if (sourceError) throw new Error(sourceError.message);
  if (!source) throw new Error("Fant ikke valgt annonse.");
  if (!source.image_url || !source.href || !source.alt) {
    throw new Error("Valgt annonse mangler bilde, lenke eller alt-tekst.");
  }

  let clearPlacementQuery = db
    .from("ads")
    .update({ is_active: false, priority: 100 })
    .eq("placement", placement);

  if (source.placement === placement) {
    clearPlacementQuery = clearPlacementQuery.neq("id", source.id);
  }

  const { error: clearError } = await clearPlacementQuery;
  if (clearError) throw new Error(clearError.message);

  if (source.placement === placement) {
    const promoteError = await promoteAdWithOptionalSchedule(db, source.id);

    if (promoteError) throw new Error(promoteError.message);
  } else {
    const insertError = await cloneAdToPlacementWithOptionalSchedule(db, {
      placement,
      title: source.title,
      meta: source.meta,
      description: source.description,
      image_url: source.image_url,
      mobile_image_url: source.mobile_image_url,
      href: source.href,
      alt: source.alt,
      label: source.label ?? DEFAULT_AD_LABEL,
      cta_text: source.cta_text ?? DEFAULT_AD_CTA,
    });

    if (insertError) throw new Error(insertError.message);
  }

  revalidateAdsPaths();
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
  const uploadStatus = resolveUploadStatus();
  const adsState = await loadAdsForAdmin(db);
  const adRows = adsState.rows;
  const error = adsState.error;
  const scheduleMode = adsState.scheduleMode;

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

  const effectiveByPlacement = new Map(
    effectiveNow.map((slot) => [slot.placement, slot])
  );

  const adOptions = [...adRows].sort((a, b) => {
    const titleA = (a.title ?? "").toLocaleLowerCase("nb-NO");
    const titleB = (b.title ?? "").toLocaleLowerCase("nb-NO");
    if (titleA !== titleB) return titleA.localeCompare(titleB, "nb-NO");
    return a.id - b.id;
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
          <p
            className={`mt-2 text-xs ${
              uploadStatus.mode === "missing" ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {uploadStatus.message}
          </p>
          {uploadStatus.missing.length ? (
            <p className="mt-1 text-[11px] text-[rgb(var(--muted))]">
              Mangler: {uploadStatus.missing.join(", ")}
            </p>
          ) : null}
          {scheduleMode === "missing" ? (
            <p className="mt-1 text-[11px] text-amber-400">
              Tidsplan-felter er deaktivert fordi `ads.starts_at` / `ads.ends_at`
              ikke finnes i databasen ennå.
            </p>
          ) : null}
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
          <AdAssetUploadField
            fieldId="ad-image-url"
            heading="Last opp desktop-bilde"
            description="Laster opp filen og fyller inn URL-feltet automatisk. Du kan også opprette annonsen direkte herfra."
            disabled={uploadStatus.mode === "missing"}
            submitParentOnSuccess
          />
          <input
            id="ad-image-url"
            name="image_url"
            placeholder="/ads/YourImage.png"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Mobil bilde URL (valgfri)</label>
          <AdAssetUploadField
            fieldId="ad-mobile-image-url"
            heading="Last opp mobil-bilde"
            description="Bruk dette hvis du vil ha et eget format for mobil."
            disabled={uploadStatus.mode === "missing"}
          />
          <input
            id="ad-mobile-image-url"
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
            defaultValue={DEFAULT_AD_LABEL}
            placeholder="Sponset / Sponsored"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">CTA‑tekst (valgfri)</label>
          <input
            name="cta_text"
            defaultValue={DEFAULT_AD_CTA}
            placeholder="f.eks. Les mer"
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

        {scheduleMode === "supported" ? (
          <>
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
          </>
        ) : null}

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
        <h2 className="text-lg font-semibold">Plasseringer (statisk liste)</h2>
        <p className="mt-2 text-xs text-[rgb(var(--muted))]">
          Velg hvilken annonse som skal vises i hver plassering. Listen under
          viser også om UI akkurat nå bruker DB-rad eller kode-fallback
          (Gullhaien).
        </p>
        <div className="mt-4 grid gap-2">
          {placements.map((placement) => {
            const slot = effectiveByPlacement.get(placement);
            const selectedAdId = slot?.chosen
              ? String(slot.chosen.id)
              : FALLBACK_OPTION;

            return (
              <form
                key={`placement-assign-${placement}`}
                action={assignPlacementAction}
                className="grid gap-2 rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm md:grid-cols-[minmax(210px,1fr),minmax(280px,1.2fr),minmax(220px,1fr),auto]"
              >
                <input type="hidden" name="placement" value={placement} />
                <div className="font-mono text-[rgb(var(--muted))]">{placement}</div>
                <select
                  name="ad_id"
                  defaultValue={selectedAdId}
                  className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5 text-[rgb(var(--fg))]"
                >
                  <option value={FALLBACK_OPTION}>
                    Kode-fallback (Gullhaien)
                  </option>
                  {adOptions.map((ad) => (
                    <option key={`placement-option-${placement}-${ad.id}`} value={ad.id}>
                      #{ad.id} · {ad.title ?? "Uten tittel"} ({ad.placement})
                    </option>
                  ))}
                </select>
                <div className="text-[rgb(var(--muted))]">
                  <span
                    className={
                      slot?.source === "db" ? "text-emerald-400" : "text-amber-400"
                    }
                  >
                    {slot?.source === "db" ? "DB" : "Fallback"}
                  </span>{" "}
                  ·{" "}
                  {slot?.chosen
                    ? `#${slot.chosen.id} (${slot.chosen.title ?? "Uten tittel"})`
                    : slot?.hasAnyRows
                      ? "ingen aktiv nå"
                      : "ingen DB-rad"}
                </div>
                <button
                  type="submit"
                  className="inline-flex self-center rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-sm font-semibold hover:bg-[rgb(var(--bg))] transition"
                >
                  Lagre plassering
                </button>
              </form>
            );
          })}
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
              className={`grid gap-3 rounded-xl border border-[rgb(var(--border))] px-4 py-3 text-sm ${
                scheduleMode === "supported"
                  ? "md:grid-cols-[auto,minmax(220px,1fr),minmax(180px,1fr),auto,auto,auto,auto,auto]"
                  : "md:grid-cols-[auto,minmax(220px,1fr),minmax(180px,1fr),auto,auto,auto]"
              }`}
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
              {scheduleMode === "supported" ? (
                <>
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
                </>
              ) : (
                <div className="self-center text-[rgb(var(--muted))]">uten tidsplan</div>
              )}
              <button
                type="submit"
                className="inline-flex self-center rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-sm font-semibold hover:bg-[rgb(var(--bg))] transition"
              >
                Lagre
              </button>
            </form>
          ))}
          {!adRows.length && !error ? (
            <p className="text-sm text-[rgb(var(--muted))]">Ingen annonser.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
