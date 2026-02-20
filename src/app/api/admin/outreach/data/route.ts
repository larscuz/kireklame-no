import { NextResponse } from "next/server";
import { getUserOrNull, isAdminUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DataKind = "companies" | "ad_leads" | "outreach_sends";

function parseKind(value: string | null): DataKind | null {
  if (value === "companies") return "companies";
  if (value === "ad_leads") return "ad_leads";
  if (value === "outreach_sends") return "outreach_sends";
  return null;
}

function parseMarket(value: string | null): "no" | "intl" {
  return value === "intl" ? "intl" : "no";
}

export async function GET(req: Request) {
  const user = await getUserOrNull();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminUser(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const kind = parseKind(url.searchParams.get("kind"));

  if (!kind) {
    return NextResponse.json(
      { error: "Missing or invalid kind" },
      { status: 400 }
    );
  }

  const db = supabaseAdmin();

  if (kind === "companies") {
    const market = parseMarket(url.searchParams.get("market"));
    const { data, error } = await db
      .from("companies")
      .select("id,name,email,website,slug,market,cover_image")
      .eq("is_active", true)
      .is("deleted_at", null)
      .eq("market", market)
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] });
  }

  if (kind === "ad_leads") {
    const { data, error } = await db
      .from("ad_leads")
      .select("id,name,email,website,source_url,market,status")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] });
  }

  const { data, error } = await db
    .from("outreach_sends")
    .select("recipient_email");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}
