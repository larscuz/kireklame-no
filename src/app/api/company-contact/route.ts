import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const form = await req.formData();
  const slug = String(form.get("slug") ?? "").trim();
  const target = slug ? `/go/${encodeURIComponent(slug)}` : "/selskaper";
  return NextResponse.redirect(new URL(target, req.url), { status: 303 });
}
