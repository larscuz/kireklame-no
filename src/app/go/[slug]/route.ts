import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function isProbablyUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(req: Request, ctx: { params: { slug: string } }) {
  const slug = ctx.params.slug;

  const db = supabaseAdmin();

  const { data: company } = await db
    .from("companies")
    .select("id, website")
    .eq("slug", slug)
    .maybeSingle();

  const target = (company?.website ?? "").trim();
  if (!company || !target || !isProbablyUrl(target)) {
    // fallback hvis slug ikke finnes / mangler website
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no";
    return NextResponse.redirect(new URL("/selskaper", base), 302);
  }

  const referrer = req.headers.get("referer") || "";
  const user_agent = req.headers.get("user-agent") || "";

  // Best effort logging: aldri blokk redirect
try {
  await db.from("company_events").insert({
    company_id: company.id,
    event_type: "outbound_website",
    target_url: target,
    referrer,
    user_agent,
  });
} catch {
  // bevisst tom: logging skal aldri stoppe redirect
}


  return NextResponse.redirect(target, 302);
}
