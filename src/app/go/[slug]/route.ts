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

export async function GET(req: Request, { params }: any) {
  const slug = String(params?.slug ?? "");
  const db = supabaseAdmin();

  const { data: company } = await db
    .from("companies")
    .select("id, website")
    .eq("slug", slug)
    .maybeSingle();

  const target = (company?.website ?? "").trim();
  if (!company || !target || !isProbablyUrl(target)) {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no";
    return NextResponse.redirect(new URL("/selskaper", base), 302);
  }

  const referrer = req.headers.get("referer") || "";
  const user_agent = req.headers.get("user-agent") || "";

  try {
    await db.from("company_events").insert({
      company_id: company.id,
      event_type: "outbound_website",
      target_url: target,
      referrer,
      user_agent,
    });
  } catch {
    // logging skal aldri stoppe redirect
  }

  return NextResponse.redirect(target, 302);
}
