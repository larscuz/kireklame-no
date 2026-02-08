// src/app/admin/settings/page.tsx
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function updateSettingsAction(formData: FormData) {
  "use server";
  await requireAdmin();

  const featured_company_slug =
    String(formData.get("featured_company_slug") ?? "").trim() || null;

  const featured_hero_video_url =
    String(formData.get("featured_hero_video_url") ?? "").trim() || null;

  const companies_featured_company_slug =
    String(formData.get("companies_featured_company_slug") ?? "").trim() || null;

  const companies_hero_video_url =
    String(formData.get("companies_hero_video_url") ?? "").trim() || null;

  const international_featured_company_slug =
    String(formData.get("international_featured_company_slug") ?? "").trim() ||
    null;

  const international_hero_video_url =
    String(formData.get("international_hero_video_url") ?? "").trim() || null;

  const db = supabaseAdmin();
  const { error } = await db
    .from("site_settings")
    .upsert({
      id: 1,
      featured_company_slug,
      featured_hero_video_url,
      companies_featured_company_slug,
      companies_hero_video_url,
      international_featured_company_slug,
      international_hero_video_url,
    });

  if (error) throw new Error(error.message);

  // bust cache
  revalidatePath("/");
  revalidatePath("/selskaper");
  revalidatePath("/internasjonalt");
  revalidatePath("/admin/settings");
}

export default async function AdminSettingsPage() {
  await requireAdmin();
  const db = supabaseAdmin();

  const [{ data: settings, error: sErr }, { data: companies, error: cErr }] =
    await Promise.all([
      db
        .from("site_settings")
        .select(
          "featured_company_slug, featured_hero_video_url, companies_featured_company_slug, companies_hero_video_url, international_featured_company_slug, international_hero_video_url"
        )
        .eq("id", 1)
        .maybeSingle(),
      db.from("companies").select("name, slug, is_active").order("name", { ascending: true }),
    ]);

  if (sErr) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Innstillinger</h1>
        <p className="mt-3 text-sm text-[rgb(var(--muted))]">DB-feil: {sErr.message}</p>
        <Link className="mt-6 inline-block underline text-sm" href="/admin">
          ← Tilbake
        </Link>
      </main>
    );
  }

  if (cErr) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Innstillinger</h1>
        <p className="mt-3 text-sm text-[rgb(var(--muted))]">DB-feil: {cErr.message}</p>
        <Link className="mt-6 inline-block underline text-sm" href="/admin">
          ← Tilbake
        </Link>
      </main>
    );
  }

  const active = (companies ?? []).filter((c: any) => c.is_active);
  const inactive = (companies ?? []).filter((c: any) => !c.is_active);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Innstillinger</h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Hero: Featured selskap + bakgrunnsvideo.
          </p>
        </div>
        <Link className="underline text-sm" href="/admin">
          ← Tilbake
        </Link>
      </div>

      <form
        action={updateSettingsAction}
        className="mt-8 grid gap-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft"
      >
        <div className="text-sm font-semibold text-[rgb(var(--muted))]">
          Forside
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Featured selskap</label>
          <select
            name="featured_company_slug"
            defaultValue={settings?.featured_company_slug ?? ""}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          >
            <option value="">— Ingen —</option>

            <optgroup label="Aktive">
              {active.map((c: any) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.slug})
                </option>
              ))}
            </optgroup>

            {inactive.length ? (
              <optgroup label="Ikke aktive">
                {inactive.map((c: any) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({c.slug})
                  </option>
                ))}
              </optgroup>
            ) : null}
          </select>
          <p className="text-xs text-[rgb(var(--muted))]">
            Vises under søkefeltet på forsiden og lenker til /selskap/[slug].
          </p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Hero video URL (.mp4)</label>
          <input
            name="featured_hero_video_url"
            defaultValue={settings?.featured_hero_video_url ?? ""}
            placeholder="https://.../video.mp4"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
          <p className="text-xs text-[rgb(var(--muted))]">
            Bruk en direkte .mp4-url. Tomt felt = ingen bakgrunnsvideo.
          </p>
        </div>

        <div className="mt-2 text-sm font-semibold text-[rgb(var(--muted))]">
          Selskaper
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Featured selskap</label>
          <select
            name="companies_featured_company_slug"
            defaultValue={settings?.companies_featured_company_slug ?? ""}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          >
            <option value="">— Ingen —</option>

            <optgroup label="Aktive">
              {active.map((c: any) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.slug})
                </option>
              ))}
            </optgroup>

            {inactive.length ? (
              <optgroup label="Ikke aktive">
                {inactive.map((c: any) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({c.slug})
                  </option>
                ))}
              </optgroup>
            ) : null}
          </select>
          <p className="text-xs text-[rgb(var(--muted))]">
            Vises i hero-blokken på /selskaper og lenker til /selskap/[slug].
          </p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">
            Hero video URL (.mp4)
          </label>
          <input
            name="companies_hero_video_url"
            defaultValue={settings?.companies_hero_video_url ?? ""}
            placeholder="https://.../video.mp4"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
          <p className="text-xs text-[rgb(var(--muted))]">
            Tomt felt = ingen bakgrunnsvideo.
          </p>
        </div>

        <div className="mt-2 text-sm font-semibold text-[rgb(var(--muted))]">
          Internasjonalt
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Featured selskap</label>
          <select
            name="international_featured_company_slug"
            defaultValue={settings?.international_featured_company_slug ?? ""}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          >
            <option value="">— Ingen —</option>

            <optgroup label="Aktive">
              {active.map((c: any) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.slug})
                </option>
              ))}
            </optgroup>

            {inactive.length ? (
              <optgroup label="Ikke aktive">
                {inactive.map((c: any) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({c.slug})
                  </option>
                ))}
              </optgroup>
            ) : null}
          </select>
          <p className="text-xs text-[rgb(var(--muted))]">
            Vises i hero-blokken på /internasjonalt og lenker til /selskap/[slug].
          </p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">
            Hero video URL (.mp4)
          </label>
          <input
            name="international_hero_video_url"
            defaultValue={settings?.international_hero_video_url ?? ""}
            placeholder="https://.../video.mp4"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          />
          <p className="text-xs text-[rgb(var(--muted))]">
            Tomt felt = ingen bakgrunnsvideo.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition"
          >
            Lagre
          </button>

          <a
            href="/"
            className="inline-flex rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold hover:bg-[rgb(var(--bg))] transition"
          >
            Åpne forsiden ↗
          </a>
        </div>
      </form>
    </main>
  );
}
