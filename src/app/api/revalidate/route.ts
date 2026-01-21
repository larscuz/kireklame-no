import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const key = req.headers.get("x-revalidate-key");
  if (!key || key !== process.env.REVALIDATE_API_KEY) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const path = typeof body?.path === "string" ? body.path : "/";
  revalidatePath(path);

  return NextResponse.json({ ok: true, path });
}
