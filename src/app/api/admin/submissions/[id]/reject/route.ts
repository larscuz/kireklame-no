import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_: Request, ctx: { params: { id: string } }) {
  await requireAdmin();
  const db = supabaseAdmin();

  const { error } = await db
    .from("submissions")
    .update({ status: "rejected" })
    .eq("id", ctx.params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL(`/admin/moderate/${ctx.params.id}`, "http://localhost:3000"));
}
