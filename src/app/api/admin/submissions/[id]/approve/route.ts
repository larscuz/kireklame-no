import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function uniqueSlug(db: ReturnType<typeof supabaseAdmin>, base: string) {
  let slug = base;
  for (let i = 2; i < 50; i++) {
    const { data } = await db.from("companies").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  await requireAdmin();
  const db = supabaseAdmin();

  const { data: s, error } = await db
    .from("submissions")
    .select("*")
    .eq("id", ctx.params.id)
    .single();

  if (error || !s) {
    return NextResponse.json(
      { error: error?.message ?? "Submission not found" },
      { status: 404 }
    );
  }

  // Lag company
  const baseSlug = slugify(String(s.company_name ?? "bedrift"));
  const slug = await uniqueSlug(db, baseSlug);

  const short =
    typeof s.notes === "string" && s.notes.trim()
      ? s.notes.trim().slice(0, 160)
      : null;

  const { data: company, error: cErr } = await db
    .from("companies")
    .insert({
      name: s.company_name,
      slug,
      website: s.website,
      email: s.contact_email,
      ai_level: s.ai_level ?? 3,
      price_level: s.price_level ?? 2,
      cover_image: s.cover_image ?? null,
      short_description: short,
      description: s.notes ?? null,
      company_type: "byrå",
      is_verified: true,
      is_placeholder: false,
    })
    .select("id,slug")
    .single();

  if (cErr || !company) {
    return NextResponse.json(
      { error: cErr?.message ?? "Company insert failed" },
      { status: 400 }
    );
  }

  // Oppdater submission
  const { error: uErr } = await db
    .from("submissions")
    .update({
      status: "approved",
      published_company_id: company.id,
    })
    .eq("id", s.id);

  if (uErr) {
    return NextResponse.json({ error: uErr.message }, { status: 400 });
  }

  // ✅ Viktig: cache bust for katalog + detaljside
  revalidatePath("/selskaper");
  revalidatePath(`/selskap/${company.slug}`);

  // ✅ Ikke hardkode localhost (funker i prod også)
  const origin = new URL(req.url).origin;
  return NextResponse.redirect(new URL(`/admin/moderate/${s.id}`, origin));
}
