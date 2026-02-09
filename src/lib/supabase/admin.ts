import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function adminListSitemapEntities() {
  const db = supabaseAdmin();

  const [
    { data: companies },
    { data: locations },
    { data: tags },
    { data: newsArticles },
  ] = await Promise.all([
    db.from("companies").select("slug"),
    db.from("locations").select("slug"),
    db.from("tags").select("slug"),
    db.from("news_articles").select("slug").eq("status", "published"),
  ]);

  return {
    companies: companies ?? [],
    locations: locations ?? [],
    tags: tags ?? [],
    newsArticles: newsArticles ?? [],
  };
}
