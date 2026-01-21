import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";

export async function POST(req: Request) {
  const key = req.headers.get("x-ingest-key");
  if (!key || key !== process.env.INGEST_API_KEY) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.companies)) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const results: Array<{ name: string; ok: boolean; slug?: string; error?: string }> = [];

  for (const item of body.companies) {
    try {
      const name = String(item.name || "").trim();
      if (!name) throw new Error("Missing name");

      const slug = item.slug ? String(item.slug) : slugify(name);

      let location_id: string | null = null;
      if (item.location_slug) {
        const { data: loc } = await db
          .from("locations")
          .select("id")
          .eq("slug", String(item.location_slug))
          .maybeSingle();
        location_id = loc?.id ?? null;
      }

      const { data: upserted, error: upsertErr } = await db
        .from("companies")
        .upsert(
          {
            name,
            slug,
            short_description: item.short_description ?? null,
            description: item.description ?? null,
            ai_level: item.ai_level ?? 2,
            price_level: item.price_level ?? 2,
            company_type: item.company_type ?? "byrå",
            website: item.website ?? null,
            cover_image: item.cover_image ?? null,
            location_id,
            is_placeholder: false
          },
          { onConflict: "slug" }
        )
        .select("id, slug")
        .single();

      if (upsertErr) throw upsertErr;

      const company_id = upserted.id as string;

      if (Array.isArray(item.tags) && item.tags.length > 0) {
        const slugs = item.tags.map((s: any) => String(s));
        const { data: tagRows } = await db.from("tags").select("id, slug").in("slug", slugs);
        if (tagRows?.length) {
          for (const t of tagRows) {
            await db.from("company_tags").upsert({ company_id, tag_id: t.id });
          }
        }
      }

      if (Array.isArray(item.links) && item.links.length > 0) {
        await db.from("links").delete().eq("company_id", company_id);
        const linkInserts = item.links.map((l: any) => ({
          company_id,
          kind: String(l.kind || "website"),
          label: l.label ? String(l.label) : null,
          url: String(l.url)
        }));
        await db.from("links").insert(linkInserts);
      }

      results.push({ name, ok: true, slug });
    } catch (e: any) {
      results.push({ name: String(item?.name ?? "unknown"), ok: false, error: e?.message ?? "error" });
    }
  }

  return NextResponse.json({ ok: true, results });
}
