import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getLocale } from "@/lib/i18n.server";
import {
  findShowreelDuplicates,
  getDirectMp4Url,
  normalizeShowreelVideoUrl,
  parseCloudflareShowreels,
  type ShowreelCmsRow,
} from "@/lib/showreel";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type CompanyCandidateRow = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  cover_image: string | null;
  video_url: string | null;
  market: "no" | "intl" | null;
  locations: { name: string | null } | Array<{ name: string | null }> | null;
};

type CompanyCandidate = {
  id: string;
  name: string;
  href: string;
  videoUrl: string;
  normalizedVideoUrl: string;
  description: string | null;
  thumbnailUrl: string | null;
  eyebrow: string;
  market: "no" | "intl";
  alreadyInCms: boolean;
};

function isValidHref(value: string): boolean {
  if (!value) return false;
  if (value.startsWith("/")) return true;
  return /^https?:\/\//i.test(value);
}

function parseSortOrder(raw: string): number {
  const num = Number(raw);
  if (!Number.isFinite(num)) return 0;
  return Math.trunc(num);
}

function locationNameFromRelation(
  relation: CompanyCandidateRow["locations"]
): string | null {
  const node = Array.isArray(relation) ? relation[0] : relation;
  const value = String(node?.name ?? "").trim();
  return value || null;
}

function revalidateShowreelPaths() {
  revalidatePath("/ki-reklame");
  revalidatePath("/en/ki-reklame");
  revalidatePath("/admin/showheel");
}

async function createShowreelEntryAction(formData: FormData) {
  "use server";
  await requireAdmin("/admin/showheel");

  const name = String(formData.get("name") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const rawVideoUrl = String(formData.get("video_url") ?? "").trim();
  const videoUrl = getDirectMp4Url(rawVideoUrl);
  const description = String(formData.get("description") ?? "").trim() || null;
  const thumbnail_url = String(formData.get("thumbnail_url") ?? "").trim() || null;
  const eyebrow = String(formData.get("eyebrow") ?? "").trim() || null;
  const cta_label = String(formData.get("cta_label") ?? "").trim() || null;
  const sort_order = parseSortOrder(String(formData.get("sort_order") ?? "0"));
  const is_active = formData.get("is_active") === "on";

  if (!name || !href || !videoUrl) {
    throw new Error("Mangler påkrevde felt (name, href, video_url).");
  }
  if (!isValidHref(href)) {
    throw new Error("href må være intern path (/...) eller full https:// URL.");
  }

  const db = supabaseAdmin();
  const { error } = await db.from("showreel_entries").insert({
    name,
    href,
    video_url: videoUrl,
    description,
    thumbnail_url,
    eyebrow,
    cta_label,
    sort_order,
    is_active,
  });
  if (error) throw new Error(error.message);

  revalidateShowreelPaths();
}

async function updateShowreelEntryAction(formData: FormData) {
  "use server";
  await requireAdmin("/admin/showheel");

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const rawVideoUrl = String(formData.get("video_url") ?? "").trim();
  const videoUrl = getDirectMp4Url(rawVideoUrl);
  const description = String(formData.get("description") ?? "").trim() || null;
  const thumbnail_url = String(formData.get("thumbnail_url") ?? "").trim() || null;
  const eyebrow = String(formData.get("eyebrow") ?? "").trim() || null;
  const cta_label = String(formData.get("cta_label") ?? "").trim() || null;
  const sort_order = parseSortOrder(String(formData.get("sort_order") ?? "0"));
  const is_active = formData.get("is_active") === "on";

  if (!id) {
    throw new Error("Mangler id.");
  }
  if (!name || !href || !videoUrl) {
    throw new Error("Mangler påkrevde felt (name, href, video_url).");
  }
  if (!isValidHref(href)) {
    throw new Error("href må være intern path (/...) eller full https:// URL.");
  }

  const db = supabaseAdmin();
  const { error } = await db
    .from("showreel_entries")
    .update({
      name,
      href,
      video_url: videoUrl,
      description,
      thumbnail_url,
      eyebrow,
      cta_label,
      sort_order,
      is_active,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidateShowreelPaths();
}

async function removeShowreelEntryAction(formData: FormData) {
  "use server";
  await requireAdmin("/admin/showheel");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Mangler id.");

  const db = supabaseAdmin();
  const { error } = await db.from("showreel_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateShowreelPaths();
}

async function addCompanyCandidateAction(formData: FormData) {
  "use server";
  await requireAdmin("/admin/showheel");

  const name = String(formData.get("name") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const rawVideoUrl = String(formData.get("video_url") ?? "").trim();
  const videoUrl = getDirectMp4Url(rawVideoUrl);
  const description = String(formData.get("description") ?? "").trim() || null;
  const thumbnail_url = String(formData.get("thumbnail_url") ?? "").trim() || null;
  const eyebrow = String(formData.get("eyebrow") ?? "").trim() || null;
  const cta_label = String(formData.get("cta_label") ?? "").trim() || null;

  if (!name || !href || !videoUrl) {
    throw new Error("Kunne ikke legge til kandidat (mangler felt).");
  }

  const db = supabaseAdmin();
  const { error } = await db.from("showreel_entries").insert({
    name,
    href,
    video_url: videoUrl,
    description,
    thumbnail_url,
    eyebrow,
    cta_label,
    sort_order: 0,
    is_active: true,
  });

  if (error) throw new Error(error.message);
  revalidateShowreelPaths();
}

function renderMediaThumb(videoUrl: string, thumbnailUrl: string | null) {
  if (videoUrl) {
    return (
      <video
        src={videoUrl}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
    );
  }
  if (thumbnailUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" loading="lazy" />;
  }
  return <div className="h-full w-full bg-[linear-gradient(135deg,#17233f,#081126)]" />;
}

export default async function AdminShowheelPage() {
  await requireAdmin("/admin/showheel");
  const locale = await getLocale();
  const db = supabaseAdmin();

  const [entriesResult, companiesResult] = await Promise.all([
    db
      .from("showreel_entries")
      .select(
        "id,name,href,video_url,description,thumbnail_url,eyebrow,cta_label,sort_order,is_active,created_at,updated_at"
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    db
      .from("companies")
      .select(
        "id,name,slug,short_description,cover_image,video_url,market,locations:location_id(name)"
      )
      .eq("is_active", true)
      .order("name", { ascending: true }),
  ]);

  const tableMissing = entriesResult.error?.code === "42P01";
  const entries = (entriesResult.data ?? []) as ShowreelCmsRow[];
  const duplicates = findShowreelDuplicates(entries, (row) => row.video_url);
  const duplicateEntryIds = new Set(
    duplicates.flatMap((group) => group.items.map((item) => item.id))
  );

  const cmsVideoKeys = new Set(
    entries
      .map((row) => normalizeShowreelVideoUrl(row.video_url))
      .filter((value): value is string => Boolean(value))
  );

  const companyRows = (companiesResult.data ?? []) as CompanyCandidateRow[];
  const companyCandidates: CompanyCandidate[] = companyRows
    .map((row) => {
      const videoUrl = getDirectMp4Url(row.video_url);
      if (!videoUrl) return null;

      const market: "no" | "intl" = row.market === "intl" ? "intl" : "no";
      const locationName = locationNameFromRelation(row.locations);
      const eyebrow =
        market === "intl"
          ? locale === "en"
            ? "International"
            : "Internasjonalt"
          : locationName || (locale === "en" ? "Norway" : "Norge");

      const normalizedVideoUrl = normalizeShowreelVideoUrl(videoUrl);
      return {
        id: row.id,
        name: row.name,
        href: `/selskap/${row.slug}`,
        videoUrl,
        normalizedVideoUrl,
        description: row.short_description ?? null,
        thumbnailUrl: row.cover_image ?? null,
        eyebrow,
        market,
        alreadyInCms: cmsVideoKeys.has(normalizedVideoUrl),
      } satisfies CompanyCandidate;
    })
    .filter((item): item is CompanyCandidate => Boolean(item));

  const candidateDuplicates = findShowreelDuplicates(
    companyCandidates,
    (candidate) => candidate.videoUrl
  );
  const duplicateCandidateKeys = new Set(
    candidateDuplicates.map((group) => group.normalizedVideoUrl)
  );

  const cloudflareCandidates = parseCloudflareShowreels({ locale }).filter(
    (item) => !cmsVideoKeys.has(normalizeShowreelVideoUrl(item.videoUrl))
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Showheel CMS</h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Visuell styring av /ki-reklame. Legg til, fjern og kontroller duplikater på video-url.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link className="underline" href="/ki-reklame">
            Åpne showheel
          </Link>
          <Link className="underline" href="/admin">
            ← Tilbake
          </Link>
        </div>
      </div>

      {tableMissing ? (
        <section className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
          <h2 className="text-lg font-semibold">Mangler tabell: showreel_entries</h2>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Kjør SQL-filen <code>supabase/showheel-cms.sql</code> i Supabase SQL editor først.
          </p>
        </section>
      ) : null}

      {entriesResult.error && !tableMissing ? (
        <section className="mt-8 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5">
          <h2 className="text-lg font-semibold">DB-feil</h2>
          <p className="mt-2 text-sm text-rose-300">{entriesResult.error.message}</p>
        </section>
      ) : null}

      {!tableMissing ? (
        <section className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Legg til showheel-item</h2>
          <form action={createShowreelEntryAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Navn *</span>
              <input
                name="name"
                required
                placeholder="Christ Theater Showreel"
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Href *</span>
              <input
                name="href"
                required
                placeholder="/selskap/navn-eller https://..."
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="font-medium">Video URL (.mp4) *</span>
              <input
                name="video_url"
                required
                placeholder="https://.../video.mp4"
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Thumbnail URL (valgfri)</span>
              <input
                name="thumbnail_url"
                placeholder="https://.../thumb.jpg"
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Eyebrow (valgfri)</span>
              <input
                name="eyebrow"
                placeholder="Oslo / Internasjonalt"
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="font-medium">Beskrivelse (valgfri)</span>
              <textarea
                name="description"
                rows={2}
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">CTA label (valgfri)</span>
              <input
                name="cta_label"
                placeholder={locale === "en" ? "View case" : "Åpne case"}
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Sort order</span>
              <input
                name="sort_order"
                type="number"
                defaultValue={0}
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm md:col-span-2">
              <input type="checkbox" name="is_active" defaultChecked />
              Aktiv
            </label>

            <button
              type="submit"
              className="inline-flex w-fit rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90"
            >
              Legg til
            </button>
          </form>
        </section>
      ) : null}

      {!tableMissing ? (
        <section className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Duplikat-sjekk</h2>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            {duplicates.length === 0
              ? "Ingen duplikater funnet i showheel-entries."
              : `Fant ${duplicates.length} duplikat-grupper i showheel-entries.`}
          </p>
          {duplicates.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {duplicates.map((group) => (
                <article
                  key={`dup-${group.normalizedVideoUrl}`}
                  className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3"
                >
                  <div className="text-xs text-amber-200 break-all">{group.normalizedVideoUrl}</div>
                  <div className="mt-2 text-sm text-[rgb(var(--muted))]">
                    {group.items.map((item) => item.name).join(" · ")}
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {!tableMissing ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Eksisterende showheel-items ({entries.length})</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {entries.map((entry) => {
              const videoUrl = getDirectMp4Url(entry.video_url) ?? "";
              const hasDuplicate = duplicateEntryIds.has(entry.id);
              return (
                <article
                  key={entry.id}
                  className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-soft"
                >
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-black/20">
                    {renderMediaThumb(videoUrl, entry.thumbnail_url)}
                    <div className="absolute left-2 top-2 rounded-full border border-white/20 bg-black/55 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/85">
                      {entry.is_active ? "Aktiv" : "Inaktiv"}
                    </div>
                    {hasDuplicate ? (
                      <div className="absolute right-2 top-2 rounded-full border border-amber-300/55 bg-amber-500/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-100">
                        Duplikat
                      </div>
                    ) : null}
                  </div>

                  <form action={updateShowreelEntryAction} className="mt-3 grid gap-2">
                    <input type="hidden" name="id" value={entry.id} />
                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-[rgb(var(--muted))]">Navn</span>
                      <input
                        name="name"
                        required
                        defaultValue={entry.name}
                        className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                      />
                    </label>

                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-[rgb(var(--muted))]">Href</span>
                      <input
                        name="href"
                        required
                        defaultValue={entry.href}
                        className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                      />
                    </label>

                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-[rgb(var(--muted))]">Video URL</span>
                      <input
                        name="video_url"
                        required
                        defaultValue={entry.video_url}
                        className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                      />
                    </label>

                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-[rgb(var(--muted))]">Thumbnail URL</span>
                      <input
                        name="thumbnail_url"
                        defaultValue={entry.thumbnail_url ?? ""}
                        className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                      />
                    </label>

                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-[rgb(var(--muted))]">Eyebrow</span>
                      <input
                        name="eyebrow"
                        defaultValue={entry.eyebrow ?? ""}
                        className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                      />
                    </label>

                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-[rgb(var(--muted))]">Beskrivelse</span>
                      <textarea
                        name="description"
                        rows={2}
                        defaultValue={entry.description ?? ""}
                        className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                      />
                    </label>

                    <div className="grid gap-2 md:grid-cols-2">
                      <label className="grid gap-1 text-xs">
                        <span className="font-medium text-[rgb(var(--muted))]">CTA label</span>
                        <input
                          name="cta_label"
                          defaultValue={entry.cta_label ?? ""}
                          className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                        />
                      </label>
                      <label className="grid gap-1 text-xs">
                        <span className="font-medium text-[rgb(var(--muted))]">Sort order</span>
                        <input
                          name="sort_order"
                          type="number"
                          defaultValue={entry.sort_order}
                          className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                        />
                      </label>
                    </div>

                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" name="is_active" defaultChecked={entry.is_active} />
                      Aktiv
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="inline-flex rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-sm font-semibold hover:bg-[rgb(var(--bg))]"
                      >
                        Lagre
                      </button>
                    </div>
                  </form>
                  <form action={removeShowreelEntryAction} className="mt-2">
                    <input type="hidden" name="id" value={entry.id} />
                    <button
                      type="submit"
                      className="inline-flex rounded-lg border border-rose-400/45 px-3 py-1.5 text-sm font-semibold text-rose-200 hover:bg-rose-500/15"
                    >
                      Fjern
                    </button>
                  </form>
                </article>
              );
            })}
            {entries.length === 0 ? (
              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-sm text-[rgb(var(--muted))]">
                Ingen entries ennå. /ki-reklame vil være tom til du legger til items her.
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {!tableMissing ? (
        <section className="mt-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Katalogkandidater med mp4</h2>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Norske og internasjonale selskaper med direkte mp4. Legg til i showheel med ett klikk.
          </p>
          {companiesResult.error ? (
            <p className="mt-3 text-sm text-rose-400">DB-feil: {companiesResult.error.message}</p>
          ) : null}

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {companyCandidates.map((candidate) => {
              const isCandidateDuplicate = duplicateCandidateKeys.has(
                candidate.normalizedVideoUrl
              );
              return (
                <article
                  key={`company-candidate-${candidate.id}`}
                  className="rounded-xl border border-[rgb(var(--border))] p-3"
                >
                  <div className="aspect-video overflow-hidden rounded-lg border border-[rgb(var(--border))] bg-black/20">
                    {renderMediaThumb(candidate.videoUrl, candidate.thumbnailUrl)}
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-semibold">{candidate.name}</div>
                    <div className="mt-1 text-xs text-[rgb(var(--muted))]">{candidate.eyebrow}</div>
                    <div className="mt-2 break-all text-[11px] text-[rgb(var(--muted))]">
                      {candidate.videoUrl}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                      {candidate.alreadyInCms ? (
                        <span className="rounded-full border border-emerald-400/50 bg-emerald-500/15 px-2 py-0.5 text-emerald-200">
                          Allerede i CMS
                        </span>
                      ) : null}
                      {isCandidateDuplicate ? (
                        <span className="rounded-full border border-amber-300/55 bg-amber-500/25 px-2 py-0.5 text-amber-100">
                          Duplikat blant kandidater
                        </span>
                      ) : null}
                      <span className="rounded-full border border-white/20 px-2 py-0.5 text-white/70">
                        {candidate.market === "intl" ? "INTL" : "NO"}
                      </span>
                    </div>
                  </div>
                  {!candidate.alreadyInCms ? (
                    <form action={addCompanyCandidateAction} className="mt-3 flex flex-wrap gap-2">
                      <input type="hidden" name="name" value={candidate.name} />
                      <input type="hidden" name="href" value={candidate.href} />
                      <input type="hidden" name="video_url" value={candidate.videoUrl} />
                      <input
                        type="hidden"
                        name="description"
                        value={candidate.description ?? ""}
                      />
                      <input
                        type="hidden"
                        name="thumbnail_url"
                        value={candidate.thumbnailUrl ?? ""}
                      />
                      <input type="hidden" name="eyebrow" value={candidate.eyebrow} />
                      <input
                        type="hidden"
                        name="cta_label"
                        value={locale === "en" ? "View case" : "Åpne case"}
                      />
                      <button
                        type="submit"
                        className="inline-flex rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-sm font-semibold hover:bg-[rgb(var(--bg))]"
                      >
                        Legg til i showheel
                      </button>
                      <Link
                        href={candidate.href}
                        className="inline-flex rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-sm hover:bg-[rgb(var(--bg))]"
                      >
                        Åpne selskap
                      </Link>
                    </form>
                  ) : (
                    <div className="mt-3">
                      <Link
                        href={candidate.href}
                        className="inline-flex rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-sm hover:bg-[rgb(var(--bg))]"
                      >
                        Åpne selskap
                      </Link>
                    </div>
                  )}
                </article>
              );
            })}
            {companyCandidates.length === 0 && !companiesResult.error ? (
              <p className="text-sm text-[rgb(var(--muted))]">Ingen selskaper med direkte mp4 funnet.</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {!tableMissing && cloudflareCandidates.length > 0 ? (
        <section className="mt-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Cloudflare env-kandidater</h2>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Hentet fra <code>SHOWREEL_CLOUDFLARE_VIDEOS</code>. Nyttig når du vil migrere over til CMS-listen.
          </p>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {cloudflareCandidates.map((item) => (
              <article
                key={`cloudflare-candidate-${item.id}`}
                className="rounded-xl border border-[rgb(var(--border))] p-3"
              >
                <div className="aspect-video overflow-hidden rounded-lg border border-[rgb(var(--border))] bg-black/20">
                  {renderMediaThumb(item.videoUrl, item.thumbnailUrl ?? null)}
                </div>
                <div className="mt-3 text-sm font-semibold">{item.name}</div>
                <div className="mt-2 break-all text-[11px] text-[rgb(var(--muted))]">
                  {item.videoUrl}
                </div>
                <form action={addCompanyCandidateAction} className="mt-3">
                  <input type="hidden" name="name" value={item.name} />
                  <input type="hidden" name="href" value={item.href} />
                  <input type="hidden" name="video_url" value={item.videoUrl} />
                  <input type="hidden" name="description" value={item.description ?? ""} />
                  <input type="hidden" name="thumbnail_url" value={item.thumbnailUrl ?? ""} />
                  <input type="hidden" name="eyebrow" value={item.eyebrow ?? ""} />
                  <input type="hidden" name="cta_label" value={item.ctaLabel ?? ""} />
                  <button
                    type="submit"
                    className="inline-flex rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-sm font-semibold hover:bg-[rgb(var(--bg))]"
                  >
                    Legg til i showheel
                  </button>
                </form>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
