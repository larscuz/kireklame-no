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
  secondary_media_url?: string | null;
  client_names?: string[] | null;
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

  const secondaryMediaUrl = (patch.secondary_media_url ?? "").trim() || null;
  const clientNames = Array.from(
    new Set(
      (patch.client_names ?? [])
        .map((name) => String(name ?? "").trim())
        .filter(Boolean)
    )
  ).slice(0, 40);

  const companyPatch = {
    name: patch.name,
    company_type: patch.company_type,
    location_id: patch.location_id,
    ai_level: patch.ai_level,
    price_level: patch.price_level,
    email: patch.email,
    website: patch.website,
    short_description: patch.short_description,
    description: patch.description,
    video_url: patch.video_url,
  };

  const { error: updErr } = await db.from("companies").update(companyPatch).eq("id", id);
  if (updErr) throw new Error(updErr.message);

  const managedKinds = ["secondary_media", "client"];
  const { error: delLinkErr } = await db
    .from("links")
    .delete()
    .eq("company_id", id)
    .in("kind", managedKinds);
  if (delLinkErr) throw new Error(delLinkErr.message);

  const linkRows: Array<{ company_id: string; kind: string; label: string | null; url: string }> =
    [];

  if (secondaryMediaUrl) {
    linkRows.push({
      company_id: id,
      kind: "secondary_media",
      label: "Secondary media",
      url: secondaryMediaUrl,
    });
  }

  for (const clientName of clientNames) {
    linkRows.push({
      company_id: id,
      kind: "client",
      label: clientName,
      // URL er obligatorisk i schema; vi lagrer navn i label.
      url: "#",
    });
  }

  if (linkRows.length) {
    const { error: insLinkErr } = await db.from("links").insert(linkRows);
    if (insLinkErr) throw new Error(insLinkErr.message);
  }

  // Shared public revalidation
  revalidatePath("/selskaper");
  if (current.slug) revalidatePath(`/selskap/${current.slug}`);

  return { slug: current.slug ?? null };
}
