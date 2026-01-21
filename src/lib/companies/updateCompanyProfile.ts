// src/lib/companies/updateCompanyProfile.ts
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type CompanyProfilePatch = {
  name: string;
  company_type: string | null;
  location_id: string | null;
  ai_level: number | null;
  price_level: number | null;
  email: string | null;
  website: string | null;
  short_description: string | null;
  description: string | null;
  video_url: string | null;
};

export async function updateCompanyProfile(id: string, patch: CompanyProfilePatch) {
  const db = supabaseAdmin();

  const { data: current, error: readErr } = await db
    .from("companies")
    .select("id,slug")
    .eq("id", id)
    .maybeSingle();

  if (readErr) throw new Error(readErr.message);
  if (!current) throw new Error("Company not found");

  const { error: updErr } = await db.from("companies").update(patch).eq("id", id);
  if (updErr) throw new Error(updErr.message);

  // Shared public revalidation
  revalidatePath("/selskaper");
  if (current.slug) revalidatePath(`/selskap/${current.slug}`);

  return { slug: current.slug ?? null };
}
