// src/app/admin/settings/page.tsx
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/server";
import AdminSettingsForm from "./AdminSettingsForm";

export const dynamic = "force-dynamic";

async function updateSettingsAction(formData: FormData) {
  "use server";
  await requireAdmin();

  const featured_company_slug =
    String(formData.get("featured_company_slug") ?? "").trim() || null;

  const featured_hero_video_url =
    String(formData.get("featured_hero_video_url") ?? "").trim() || null;
  const featured_hero_poster_url =
    String(formData.get("featured_hero_poster_url") ?? "").trim() || null;

  const companies_featured_company_slug =
    String(formData.get("companies_featured_company_slug") ?? "").trim() || null;

  const companies_hero_video_url =
    String(formData.get("companies_hero_video_url") ?? "").trim() || null;
  const companies_hero_poster_url =
    String(formData.get("companies_hero_poster_url") ?? "").trim() || null;

  const international_featured_company_slug =
    String(formData.get("international_featured_company_slug") ?? "").trim() ||
    null;

  const international_hero_video_url =
    String(formData.get("international_hero_video_url") ?? "").trim() || null;
  const international_hero_poster_url =
    String(formData.get("international_hero_poster_url") ?? "").trim() || null;

  const db = supabaseAdmin();
  const { error } = await db
    .from("site_settings")
    .upsert({
      id: 1,
      featured_company_slug,
      featured_hero_video_url,
      featured_hero_poster_url,
      companies_featured_company_slug,
      companies_hero_video_url,
      companies_hero_poster_url,
      international_featured_company_slug,
      international_hero_video_url,
      international_hero_poster_url,
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
        .select("*")
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

      <AdminSettingsForm
        action={updateSettingsAction}
        settings={settings ?? null}
        companies={(companies ?? []) as Array<{ name: string; slug: string; is_active: boolean }>}
      />
    </main>
  );
}
