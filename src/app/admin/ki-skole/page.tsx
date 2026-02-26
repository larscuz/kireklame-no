import Link from "next/link";
import { revalidatePath } from "next/cache";
import { buildCmsInsertRowsFromStaticExamples } from "@/lib/norsk-prompting/exampleShowcaseCms";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ExampleDifficulty = "Vanskelig" | "Svært vanskelig";
type OutputType = "image" | "video";
type MediaKind = "image" | "video";
type UploadMode = "r2" | "endpoint" | "missing";

type ExampleRow = {
  id: string;
  example_key: string;
  title: string;
  output_type: OutputType;
  model_name: string;
  difficulty: ExampleDifficulty;
  challenge: string;
  short_brief: string;
  mini_tutorial: string[];
  prompt_text: string;
  terms: string[];
  media_kind: MediaKind;
  media_src: string | null;
  media_thumbnail_src: string | null;
  media_poster_src: string | null;
  media_alt: string;
  media_caption: string;
  is_placeholder: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type UploadStatus = {
  mode: UploadMode;
  message: string;
  missing: string[];
};

function hasEnv(name: string): boolean {
  return String(process.env[name] ?? "").trim().length > 0;
}

function resolveUploadStatus(): UploadStatus {
  const r2Ready =
    (hasEnv("R2_ACCOUNT_ID") || hasEnv("CLOUDFLARE_ACCOUNT_ID")) &&
    (hasEnv("KI_SKOLE_UPLOAD_BUCKET") || hasEnv("R2_BUCKET")) &&
    hasEnv("R2_ACCESS_KEY_ID") &&
    hasEnv("R2_SECRET_ACCESS_KEY") &&
    hasEnv("R2_PUBLIC_BASE_URL");

  if (r2Ready) {
    return {
      mode: "r2",
      message: "Direkte R2-opplasting er aktiv.",
      missing: [],
    };
  }

  const endpointReady =
    (hasEnv("KI_SKOLE_UPLOAD_URL") && hasEnv("KI_SKOLE_UPLOAD_TOKEN")) ||
    (hasEnv("ONECOM_UPLOAD_URL") && hasEnv("ONECOM_UPLOAD_TOKEN"));

  if (endpointReady) {
    return {
      mode: "endpoint",
      message: "Endpoint-opplasting er aktiv (fallback-modus).",
      missing: [],
    };
  }

  const missing: string[] = [];
  if (!(hasEnv("R2_ACCOUNT_ID") || hasEnv("CLOUDFLARE_ACCOUNT_ID"))) missing.push("R2_ACCOUNT_ID eller CLOUDFLARE_ACCOUNT_ID");
  if (!(hasEnv("KI_SKOLE_UPLOAD_BUCKET") || hasEnv("R2_BUCKET"))) missing.push("KI_SKOLE_UPLOAD_BUCKET eller R2_BUCKET");
  if (!hasEnv("R2_ACCESS_KEY_ID")) missing.push("R2_ACCESS_KEY_ID");
  if (!hasEnv("R2_SECRET_ACCESS_KEY")) missing.push("R2_SECRET_ACCESS_KEY");
  if (!hasEnv("R2_PUBLIC_BASE_URL")) missing.push("R2_PUBLIC_BASE_URL");

  return {
    mode: "missing",
    message: "Opplasting er ikke komplett konfigurert ennå.",
    missing,
  };
}

function parseSortOrder(raw: string): number {
  const num = Number(raw);
  if (!Number.isFinite(num)) return 0;
  return Math.trunc(num);
}

function parseLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeOutputType(value: string): OutputType {
  return value === "video" ? "video" : "image";
}

function normalizeMediaKind(value: string): MediaKind {
  return value === "video" ? "video" : "image";
}

function normalizeDifficulty(value: string): ExampleDifficulty {
  return value === "Svært vanskelig" ? "Svært vanskelig" : "Vanskelig";
}

function textAreaValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry ?? "").trim()).filter(Boolean).join("\n");
  }
  return String(value ?? "").trim();
}

function revalidateKISkolePaths() {
  revalidatePath("/admin/ki-skole");
  revalidatePath("/norsk-prompting/eksempler");
}

async function seedExamplesAction() {
  "use server";
  await requireAdmin("/admin/ki-skole");

  const db = supabaseAdmin();
  const rows = buildCmsInsertRowsFromStaticExamples();
  const { error } = await db.from("ki_skole_examples").upsert(rows, { onConflict: "example_key" });
  if (error) throw new Error(error.message);

  revalidateKISkolePaths();
}

async function createExampleAction(formData: FormData) {
  "use server";
  await requireAdmin("/admin/ki-skole");

  const exampleKey = String(formData.get("example_key") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const outputType = normalizeOutputType(String(formData.get("output_type") ?? "image"));
  const modelName = String(formData.get("model_name") ?? "").trim();
  const difficulty = normalizeDifficulty(String(formData.get("difficulty") ?? "Vanskelig"));
  const challenge = String(formData.get("challenge") ?? "").trim();
  const shortBrief = String(formData.get("short_brief") ?? "").trim();
  const miniTutorial = parseLines(String(formData.get("mini_tutorial") ?? ""));
  const promptText = String(formData.get("prompt_text") ?? "").trim();
  const terms = parseLines(String(formData.get("terms") ?? ""));
  const mediaKind = normalizeMediaKind(String(formData.get("media_kind") ?? outputType));
  const mediaSrc = String(formData.get("media_src") ?? "").trim() || null;
  const mediaThumbnailSrc = String(formData.get("media_thumbnail_src") ?? "").trim() || null;
  const mediaPosterSrc = String(formData.get("media_poster_src") ?? "").trim() || null;
  const mediaAlt = String(formData.get("media_alt") ?? "").trim();
  const mediaCaption = String(formData.get("media_caption") ?? "").trim();
  const sortOrder = parseSortOrder(String(formData.get("sort_order") ?? "0"));
  const isActive = formData.get("is_active") === "on";
  const isPlaceholder = formData.get("is_placeholder") === "on";

  if (!exampleKey || !title || !modelName || !challenge || !shortBrief || !promptText || !mediaAlt || !mediaCaption) {
    throw new Error("Mangler påkrevde felter.");
  }

  const db = supabaseAdmin();
  const { error } = await db.from("ki_skole_examples").insert({
    example_key: exampleKey,
    title,
    output_type: outputType,
    model_name: modelName,
    difficulty,
    challenge,
    short_brief: shortBrief,
    mini_tutorial: miniTutorial,
    prompt_text: promptText,
    terms,
    media_kind: mediaKind,
    media_src: mediaSrc,
    media_thumbnail_src: mediaThumbnailSrc,
    media_poster_src: mediaPosterSrc,
    media_alt: mediaAlt,
    media_caption: mediaCaption,
    sort_order: sortOrder,
    is_active: isActive,
    is_placeholder: isPlaceholder,
  });

  if (error) throw new Error(error.message);
  revalidateKISkolePaths();
}

async function updateExampleAction(formData: FormData) {
  "use server";
  await requireAdmin("/admin/ki-skole");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Mangler id.");

  const exampleKey = String(formData.get("example_key") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const outputType = normalizeOutputType(String(formData.get("output_type") ?? "image"));
  const modelName = String(formData.get("model_name") ?? "").trim();
  const difficulty = normalizeDifficulty(String(formData.get("difficulty") ?? "Vanskelig"));
  const challenge = String(formData.get("challenge") ?? "").trim();
  const shortBrief = String(formData.get("short_brief") ?? "").trim();
  const miniTutorial = parseLines(String(formData.get("mini_tutorial") ?? ""));
  const promptText = String(formData.get("prompt_text") ?? "").trim();
  const terms = parseLines(String(formData.get("terms") ?? ""));
  const mediaKind = normalizeMediaKind(String(formData.get("media_kind") ?? outputType));
  const mediaSrc = String(formData.get("media_src") ?? "").trim() || null;
  const mediaThumbnailSrc = String(formData.get("media_thumbnail_src") ?? "").trim() || null;
  const mediaPosterSrc = String(formData.get("media_poster_src") ?? "").trim() || null;
  const mediaAlt = String(formData.get("media_alt") ?? "").trim();
  const mediaCaption = String(formData.get("media_caption") ?? "").trim();
  const sortOrder = parseSortOrder(String(formData.get("sort_order") ?? "0"));
  const isActive = formData.get("is_active") === "on";
  const isPlaceholder = formData.get("is_placeholder") === "on";

  if (!exampleKey || !title || !modelName || !challenge || !shortBrief || !promptText || !mediaAlt || !mediaCaption) {
    throw new Error("Mangler påkrevde felter.");
  }

  const db = supabaseAdmin();
  const { error } = await db
    .from("ki_skole_examples")
    .update({
      example_key: exampleKey,
      title,
      output_type: outputType,
      model_name: modelName,
      difficulty,
      challenge,
      short_brief: shortBrief,
      mini_tutorial: miniTutorial,
      prompt_text: promptText,
      terms,
      media_kind: mediaKind,
      media_src: mediaSrc,
      media_thumbnail_src: mediaThumbnailSrc,
      media_poster_src: mediaPosterSrc,
      media_alt: mediaAlt,
      media_caption: mediaCaption,
      sort_order: sortOrder,
      is_active: isActive,
      is_placeholder: isPlaceholder,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateKISkolePaths();
}

async function removeExampleAction(formData: FormData) {
  "use server";
  await requireAdmin("/admin/ki-skole");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Mangler id.");

  const db = supabaseAdmin();
  const { error } = await db.from("ki_skole_examples").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateKISkolePaths();
}

function renderMediaPreview(row: ExampleRow) {
  const fallback = "/norsk-prompting/examples/eksempel-01-arkitektur.svg";

  if (row.media_kind === "video") {
    if (row.media_src) {
      return (
        <video
          src={row.media_src}
          poster={row.media_poster_src ?? row.media_thumbnail_src ?? fallback}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      );
    }

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={row.media_thumbnail_src ?? row.media_poster_src ?? fallback} alt="" className="h-full w-full object-cover" loading="lazy" />;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={row.media_src ?? row.media_thumbnail_src ?? fallback} alt="" className="h-full w-full object-cover" loading="lazy" />;
}

export default async function AdminKISkolePage() {
  await requireAdmin("/admin/ki-skole");

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("ki_skole_examples")
    .select(
      "id,example_key,title,output_type,model_name,difficulty,challenge,short_brief,mini_tutorial,prompt_text,terms,media_kind,media_src,media_thumbnail_src,media_poster_src,media_alt,media_caption,is_placeholder,sort_order,is_active,created_at,updated_at"
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const tableMissing = error?.code === "42P01";
  const rows = (data ?? []) as ExampleRow[];
  const uploadStatus = resolveUploadStatus();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">KI-skole CMS</h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Visuell CMS for Eksempler: prompt, metadata og media (bilde/video) koblet til Cloudflare-upload.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link className="underline" href="/norsk-prompting/eksempler">
            Åpne Eksempler
          </Link>
          <Link className="underline" href="/admin">
            ← Tilbake
          </Link>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Upload-oppsett</p>
        <p className="mt-1 text-sm text-[rgb(var(--fg))]/90">
          Status:{" "}
          <span className={uploadStatus.mode === "missing" ? "text-amber-300" : "text-emerald-300"}>{uploadStatus.message}</span>
        </p>
        <details className="mt-2 text-xs text-[rgb(var(--muted))]">
          <summary className="cursor-pointer select-none">Vis tekniske detaljer</summary>
          <div className="mt-2 space-y-1">
            <p>Primær modus: direkte R2-opplasting med `KI_SKOLE_UPLOAD_PREFIX` og bucket `intelligenspartiet-media`.</p>
            <p>Fallback modus: endpoint med `KI_SKOLE_UPLOAD_URL` og `KI_SKOLE_UPLOAD_TOKEN`.</p>
            {uploadStatus.missing.length > 0 ? (
              <p>Mangler nå: {uploadStatus.missing.join(", ")}.</p>
            ) : null}
          </div>
        </details>
      </section>

      {tableMissing ? (
        <section className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
          <h2 className="text-lg font-semibold">Mangler tabell: ki_skole_examples</h2>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Kjør SQL-filen <code>supabase/ki-skole-cms-2026-02-26.sql</code> i Supabase SQL editor først.
          </p>
        </section>
      ) : null}

      {error && !tableMissing ? (
        <section className="mt-8 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5">
          <h2 className="text-lg font-semibold">DB-feil</h2>
          <p className="mt-2 text-sm text-rose-200">{error.message}</p>
        </section>
      ) : null}

      {!tableMissing ? (
        <section className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Startdata</h2>
            <form action={seedExamplesAction}>
              <button
                type="submit"
                className="inline-flex rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-sm font-semibold hover:bg-[rgb(var(--bg))]"
              >
                Importer forslag til CMS
              </button>
            </form>
          </div>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Henter inn forslagene fra kodebasen til databasen (upsert på `example_key`).
          </p>
        </section>
      ) : null}

      {!tableMissing ? (
        <section className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Nytt eksempel</h2>

          <form action={createExampleAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Example key *</span>
              <input
                name="example_key"
                required
                placeholder="vid-dialog-car-interior"
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Tittel *</span>
              <input
                name="title"
                required
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Output type</span>
              <select name="output_type" defaultValue="image" className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2">
                <option value="image">image</option>
                <option value="video">video</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Media kind</span>
              <select name="media_kind" defaultValue="image" className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2">
                <option value="image">image</option>
                <option value="video">video</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Modell *</span>
              <input
                name="model_name"
                required
                placeholder="Kling 3.0"
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Vanskelighetsgrad</span>
              <select name="difficulty" defaultValue="Vanskelig" className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2">
                <option value="Vanskelig">Vanskelig</option>
                <option value="Svært vanskelig">Svært vanskelig</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="font-medium">Hvorfor vanskelig *</span>
              <input
                name="challenge"
                required
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="font-medium">Kort briefing *</span>
              <input
                name="short_brief"
                required
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="font-medium">Mini tutorial (én linje per punkt)</span>
              <textarea name="mini_tutorial" rows={4} className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2" />
            </label>

            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="font-medium">Prompt *</span>
              <textarea name="prompt_text" required rows={8} className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2" />
            </label>

            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="font-medium">Fagbegreper (én linje per begrep)</span>
              <textarea name="terms" rows={4} className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2" />
            </label>

            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="font-medium">Media src (URL)</span>
              <input
                name="media_src"
                placeholder="https://..."
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-medium">Media thumbnail src</span>
                <input
                  name="media_thumbnail_src"
                  placeholder="https://..."
                  className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="font-medium">Media poster src</span>
                <input
                  name="media_poster_src"
                  placeholder="https://..."
                  className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
                />
              </label>
            </div>

            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="font-medium">Media alt *</span>
              <input
                name="media_alt"
                required
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="font-medium">Media caption *</span>
              <input
                name="media_caption"
                required
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

            <div className="grid gap-2 text-sm md:col-span-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="is_active" defaultChecked />
                Aktiv
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="is_placeholder" defaultChecked />
                Placeholder-media
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex w-fit rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90"
            >
              Opprett eksempel
            </button>
          </form>
        </section>
      ) : null}

      {!tableMissing ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Eksisterende eksempler ({rows.length})</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {rows.map((row) => (
              <article key={row.id} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-soft">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-black/20">
                  {renderMediaPreview(row)}
                  <div className="absolute left-2 top-2 rounded-full border border-white/20 bg-black/55 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/85">
                    {row.output_type} · {row.media_kind}
                  </div>
                  <div className="absolute right-2 top-2 rounded-full border border-white/20 bg-black/55 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/85">
                    {row.is_active ? "Aktiv" : "Inaktiv"}
                  </div>
                </div>

                <form action="/api/admin/ki-skole-media" method="post" encType="multipart/form-data" className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 p-3">
                  <input type="hidden" name="example_id" value={row.id} />
                  <input type="hidden" name="media_kind" value={row.media_kind} />
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Cloudflare-opplasting</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      name="file"
                      accept={row.media_kind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/png,image/jpeg,image/webp"}
                      required
                      className="max-w-full text-xs"
                    />
                    <button
                      type="submit"
                      className="inline-flex rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-sm font-semibold hover:bg-[rgb(var(--bg))]"
                    >
                      Last opp fil
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-[rgb(var(--muted))]">Oppdaterer `media_src` automatisk for dette kortet.</p>
                </form>

                <form action={updateExampleAction} className="mt-3 grid gap-2">
                  <input type="hidden" name="id" value={row.id} />

                  <label className="grid gap-1 text-xs">
                    <span className="font-medium text-[rgb(var(--muted))]">Example key</span>
                    <input
                      name="example_key"
                      defaultValue={row.example_key}
                      required
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="grid gap-1 text-xs">
                    <span className="font-medium text-[rgb(var(--muted))]">Tittel</span>
                    <input
                      name="title"
                      defaultValue={row.title}
                      required
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                    />
                  </label>

                  <div className="grid gap-2 md:grid-cols-2">
                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-[rgb(var(--muted))]">Output type</span>
                      <select name="output_type" defaultValue={row.output_type} className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm">
                        <option value="image">image</option>
                        <option value="video">video</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-[rgb(var(--muted))]">Media kind</span>
                      <select name="media_kind" defaultValue={row.media_kind} className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm">
                        <option value="image">image</option>
                        <option value="video">video</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-[rgb(var(--muted))]">Modell</span>
                      <input
                        name="model_name"
                        defaultValue={row.model_name}
                        required
                        className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-[rgb(var(--muted))]">Vanskelighetsgrad</span>
                      <select name="difficulty" defaultValue={row.difficulty} className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm">
                        <option value="Vanskelig">Vanskelig</option>
                        <option value="Svært vanskelig">Svært vanskelig</option>
                      </select>
                    </label>
                  </div>

                  <label className="grid gap-1 text-xs">
                    <span className="font-medium text-[rgb(var(--muted))]">Hvorfor vanskelig</span>
                    <input
                      name="challenge"
                      defaultValue={row.challenge}
                      required
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="grid gap-1 text-xs">
                    <span className="font-medium text-[rgb(var(--muted))]">Kort briefing</span>
                    <input
                      name="short_brief"
                      defaultValue={row.short_brief}
                      required
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="grid gap-1 text-xs">
                    <span className="font-medium text-[rgb(var(--muted))]">Mini tutorial (én linje per punkt)</span>
                    <textarea
                      name="mini_tutorial"
                      rows={4}
                      defaultValue={textAreaValue(row.mini_tutorial)}
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="grid gap-1 text-xs">
                    <span className="font-medium text-[rgb(var(--muted))]">Prompt</span>
                    <textarea
                      name="prompt_text"
                      rows={8}
                      defaultValue={row.prompt_text}
                      required
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="grid gap-1 text-xs">
                    <span className="font-medium text-[rgb(var(--muted))]">Fagbegreper (én linje per begrep)</span>
                    <textarea
                      name="terms"
                      rows={4}
                      defaultValue={textAreaValue(row.terms)}
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="grid gap-1 text-xs">
                    <span className="font-medium text-[rgb(var(--muted))]">Media src</span>
                    <input
                      name="media_src"
                      defaultValue={row.media_src ?? ""}
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                    />
                  </label>

                  <div className="grid gap-2 md:grid-cols-2">
                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-[rgb(var(--muted))]">Thumbnail src</span>
                      <input
                        name="media_thumbnail_src"
                        defaultValue={row.media_thumbnail_src ?? ""}
                        className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-[rgb(var(--muted))]">Poster src</span>
                      <input
                        name="media_poster_src"
                        defaultValue={row.media_poster_src ?? ""}
                        className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                      />
                    </label>
                  </div>

                  <label className="grid gap-1 text-xs">
                    <span className="font-medium text-[rgb(var(--muted))]">Media alt</span>
                    <input
                      name="media_alt"
                      defaultValue={row.media_alt}
                      required
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="grid gap-1 text-xs">
                    <span className="font-medium text-[rgb(var(--muted))]">Media caption</span>
                    <input
                      name="media_caption"
                      defaultValue={row.media_caption}
                      required
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="grid gap-1 text-xs">
                    <span className="font-medium text-[rgb(var(--muted))]">Sort order</span>
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={row.sort_order}
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                    />
                  </label>

                  <div className="grid gap-2 text-sm">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" name="is_active" defaultChecked={row.is_active} />
                      Aktiv
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" name="is_placeholder" defaultChecked={row.is_placeholder} />
                      Placeholder-media
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="submit"
                      className="inline-flex rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-sm font-semibold hover:bg-[rgb(var(--bg))]"
                    >
                      Lagre
                    </button>
                  </div>
                </form>

                <form action={removeExampleAction} className="mt-2">
                  <input type="hidden" name="id" value={row.id} />
                  <button
                    type="submit"
                    className="inline-flex rounded-lg border border-rose-400/45 px-3 py-1.5 text-sm font-semibold text-rose-200 hover:bg-rose-500/15"
                  >
                    Fjern
                  </button>
                </form>
              </article>
            ))}
            {rows.length === 0 ? (
              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-sm text-[rgb(var(--muted))]">
                Ingen KI-skole-eksempler i CMS ennå.
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
