// src/app/api/admin/submissions/[id]/reject/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const db = supabaseAdmin();

  const { id } = await params;

  const { error } = await db
    .from("submissions")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // ✅ ikke hardcode localhost – funker i prod også
  const origin = new URL(req.url).origin;
  return NextResponse.redirect(new URL(`/admin/moderate/${id}`, origin));
}
