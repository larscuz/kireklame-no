import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function safeMailto(email: string, subject: string) {
  const e = String(email ?? "").trim();
  if (!e || !e.includes("@")) return null;

  const s = encodeURIComponent(subject);
  return `mailto:${encodeURIComponent(e)}?subject=${s}`;
}

export async function GET(req: Request, { params }: any) {
  const slug = String(params?.slug ?? "");
  const db = supabaseAdmin();

  const { data: company } = await db
    .from("companies")
    .select("id, name, email")
    .eq("slug", slug)
    .maybeSingle();

  const mailto = safeMailto(company?.email ?? "", `Kontakt via KiReklame: ${company?.name ?? ""}`);

  if (!company || !mailto) {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no";
    return NextResponse.redirect(new URL(`/selskap/${slug}`, base), 302);
  }

  const referrer = req.headers.get("referer") || "";
  const user_agent = req.headers.get("user-agent") || "";

  try {
    await db.from("company_events").insert({
      company_id: company.id,
      event_type: "contact_email",
      target_url: mailto,
      referrer,
      user_agent,
    });
  } catch {
    // logging skal aldri stoppe redirect
  }

  return NextResponse.redirect(mailto, 302);
}
