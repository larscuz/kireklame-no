// src/lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { CompanyCardModel, CompanyDetailModel } from "@/lib/types";
import type { Facets, SearchParamsV1 } from "@/lib/utils";

/**
 * Server-side Supabase client (anon key + cookies).
 * Følger RLS.
 */
export async function supabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // cookies settes i middleware
        },
      },
    }
  );
}

/** Admin whitelist via env ADMIN_EMAILS="a@x.no,b@y.no" */
function parseAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = parseAdminEmails();
  return admins.includes(email.toLowerCase());
}

/**
 * ✅ API-safe: hent user uten redirect()
 * Returnerer null hvis ikke innlogget.
 */
export async function getUserOrNull() {
  const supabase = await supabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

/** Krev innlogget bruker (PAGE): redirecter til /auth */
export async function requireUser(nextPath: string = "/me") {
  const supabase = await supabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect(`/auth?next=${encodeURIComponent(nextPath)}`);
  }
  return data.user;
}

/** Krev admin (PAGE): redirecter ikke-admin til /me */
export async function requireAdmin(nextPath: string = "/admin") {
  const user = await requireUser(nextPath);

  if (!isAdminUser(user.email)) {
    redirect("/me");
  }
  return user;
}

/**
 * ✅ API-safe: sjekk om bruker kan redigere bedrift (uten redirect()).
 * Tillatt hvis:
 * - admin, eller
 * - companies.email == user.email (ikke placeholder), eller
 * - approved claim for (companyId,userId)
 */
export async function assertCompanyEditorApi(companyId: string) {
  if (!companyId) throw new Error("Missing companyId");

  const user = await getUserOrNull();
  if (!user) throw new Error("Unauthorized");

  // Admin kan alltid redigere
  if (isAdminUser(user.email)) {
    return { user, isAdmin: true as const };
  }

  const db = supabaseAdmin();

  // Eier via epost
  const { data: company, error: cErr } = await db
    .from("companies")
    .select("id,email,is_placeholder")
    .eq("id", companyId)
    .maybeSingle();

  if (cErr) throw new Error(cErr.message);

  const companyEmail = String(company?.email ?? "").trim().toLowerCase();
  const userEmail = String(user.email ?? "").trim().toLowerCase();

  if (companyEmail && userEmail && companyEmail === userEmail && company?.is_placeholder !== true) {
    return { user, isAdmin: false as const };
  }

  // Ellers: må ha approved claim
  const { data: claim, error } = await db
    .from("claims")
    .select("id,status")
    .eq("company_id", companyId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  const status = String(claim?.status ?? "pending").toLowerCase();
  if (status !== "approved") {
    throw new Error("Not authorized. Claim not approved.");
  }

  return { user, isAdmin: false as const };
}

function normalizeLocation(loc: any): { name: string; slug: string } | null {
  const l = Array.isArray(loc) ? loc[0] : loc;
  if (!l) return null;
  return { name: l.name, slug: l.slug };
}

/**
 * Idempotent: hvis claim allerede finnes (company_id + user_id), ikke feile.
 * Første gang → insert, senere klikk → ingen endring, men ok.
 */
export async function createClaim(args: { companyId: string; userId: string; message?: string }) {
  const supabase = await supabaseServerClient();

  const { error } = await supabase
    .from("claims")
    .upsert(
      {
        company_id: args.companyId,
        user_id: args.userId,
        message: args.message ?? null,
      },
      {
        onConflict: "company_id,user_id",
        ignoreDuplicates: true,
      }
    );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function getCompanies(
  params: SearchParamsV1
): Promise<{
  companies: CompanyCardModel[];
  facets: Facets;
}> {
  const supabase = await supabaseServerClient();

  const [locRes, tagRes] = await Promise.all([
    supabase.from("locations").select("name,slug").order("name"),
    supabase.from("tags").select("name,slug").order("name"),
  ]);

  const types = [
    { value: "byrå", label: "Byrå" },
    { value: "Studio", label: "Studio" },
    { value: "Miljø", label: "Miljø" },
    { value: "frilans", label: "Frilans" },
    { value: "UB/SB", label: "UB/SB" },
  ];

  let query = supabase
    .from("companies")
    .select(
      `
      id,name,slug,short_description,description,ai_level,price_level,company_type,website,email,phone,cover_image,video_url,is_verified,is_placeholder,
      locations:location_id (name,slug),
      links:links (id,kind,label,url),
      company_tags:company_tags ( tags:tag_id (name,slug) )
    `
    )
    .eq("is_active", true)
    .order("is_verified", { ascending: false })
    .order("ai_level", { ascending: false })
    .order("name", { ascending: true });

  if (params.ai) query = query.eq("ai_level", Number(params.ai));
  if (params.type) query = query.eq("company_type", params.type);
  if (params.price) query = query.eq("price_level", Number(params.price));

  if (params.loc) {
    const { data: loc } = await supabase.from("locations").select("id").eq("slug", params.loc).maybeSingle();
    if (loc?.id) query = query.eq("location_id", loc.id);
  }

  if (params.q) {
    const q = `%${params.q}%`;
    query = query.or(`name.ilike.${q},short_description.ilike.${q},description.ilike.${q}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getCompanies] supabase error:", error.message);
    return {
      companies: [],
      facets: {
        locations: locRes.data ?? [],
        tags: tagRes.data ?? [],
        types,
      },
    };
  }

  let companies: CompanyCardModel[] = (data ?? []).map((row: any) => {
    const tags = (row.company_tags ?? []).map((ct: any) => ct.tags).filter(Boolean);

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      short_description: row.short_description,
      ai_level: row.ai_level,
      price_level: row.price_level,
      company_type: row.company_type,
      cover_image: row.cover_image,
      video_url: row.video_url ?? null,
      is_verified: row.is_verified,
      is_placeholder: row.is_placeholder,
      location: normalizeLocation(row.locations),
      tags,
    } satisfies CompanyCardModel;
  });

  if (params.tag) {
    companies = companies.filter((c) => c.tags.some((t: { slug: string }) => t.slug === params.tag));
  }

  return {
    companies,
    facets: {
      locations: locRes.data ?? [],
      tags: tagRes.data ?? [],
      types,
    },
  };
}

export async function getCompanyBySlug(slug: string): Promise<CompanyDetailModel | null> {
  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from("companies")
    .select(
      `
      id,name,slug,short_description,description,ai_level,price_level,company_type,website,email,phone,cover_image,video_url,is_verified,is_placeholder,
      locations:location_id (name,slug),
      links:links (id,kind,label,url),
      company_tags:company_tags ( tags:tag_id (name,slug) )
    `
    )
    .eq("is_active", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;

  const tags = (data.company_tags ?? []).map((ct: any) => ct.tags).filter(Boolean);

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    short_description: data.short_description,
    description: data.description,
    ai_level: data.ai_level,
    price_level: data.price_level,
    company_type: data.company_type,
    website: data.website,
    email: data.email,
    phone: data.phone,
    cover_image: data.cover_image,
    video_url: data.video_url ?? null,
    is_verified: data.is_verified,
    is_placeholder: data.is_placeholder,
    location: normalizeLocation(data.locations),
    tags,
    links: data.links ?? [],
  };
}

export async function getLocationBySlug(slug: string) {
  const supabase = await supabaseServerClient();
  const { data } = await supabase.from("locations").select("id,name,slug,region").eq("slug", slug).maybeSingle();
  return data ?? null;
}

export async function getTagBySlug(slug: string) {
  const supabase = await supabaseServerClient();
  const { data } = await supabase.from("tags").select("id,name,slug,kind").eq("slug", slug).maybeSingle();
  return data ?? null;
}

export async function getCompaniesByLocationSlug(locationSlug: string) {
  const supabase = await supabaseServerClient();

  const { data: loc } = await supabase.from("locations").select("id").eq("slug", locationSlug).maybeSingle();
  if (!loc?.id) return [];

  const { data } = await supabase
    .from("companies")
    .select(
      `
      id,name,slug,short_description,ai_level,price_level,company_type,cover_image,is_verified,is_placeholder,
      locations:location_id (name,slug),
      company_tags:company_tags ( tags:tag_id (name,slug) )
    `
    )
    .eq("is_active", true)
    .eq("location_id", loc.id)
    .order("ai_level", { ascending: false });

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    short_description: row.short_description,
    ai_level: row.ai_level,
    price_level: row.price_level,
    company_type: row.company_type,
    cover_image: row.cover_image,
    is_verified: row.is_verified,
    is_placeholder: row.is_placeholder,
    location: normalizeLocation(row.locations),
    tags: (row.company_tags ?? []).map((ct: any) => ct.tags).filter(Boolean),
  }));
}

export async function getCompaniesByTagSlug(tagSlug: string) {
  const supabase = await supabaseServerClient();

  const { data: tag } = await supabase.from("tags").select("id").eq("slug", tagSlug).maybeSingle();
  if (!tag?.id) return [];

  const { data: joins } = await supabase.from("company_tags").select("company_id").eq("tag_id", tag.id);
  const ids = (joins ?? []).map((j: any) => j.company_id);
  if (!ids.length) return [];

  const { data } = await supabase
    .from("companies")
    .select(
      `
      id,name,slug,short_description,ai_level,price_level,company_type,cover_image,is_verified,is_placeholder,
      locations:location_id (name,slug),
      company_tags:company_tags ( tags:tag_id (name,slug) )
    `
    )
    .eq("is_active", true)
    .in("id", ids)
    .order("ai_level", { ascending: false });

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    short_description: row.short_description,
    ai_level: row.ai_level,
    price_level: row.price_level,
    company_type: row.company_type,
    cover_image: row.cover_image,
    is_verified: row.is_verified,
    is_placeholder: row.is_placeholder,
    location: normalizeLocation(row.locations),
    tags: (row.company_tags ?? []).map((ct: any) => ct.tags).filter(Boolean),
  }));
}
