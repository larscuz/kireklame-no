import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const target = slug ? `/go/${encodeURIComponent(slug)}` : "/selskaper";
  return NextResponse.redirect(new URL(target, req.url), 302);
}
