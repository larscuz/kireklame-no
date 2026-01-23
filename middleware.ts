import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  // ✅ 1) Tving www -> apex for ALT (inkl. /api)
  if (host === "www.kireklame.no") {
    const url = req.nextUrl.clone();
    url.hostname = "kireklame.no";
    return NextResponse.redirect(url, 308);
  }

  // ✅ 2) Fortsett normal flyt (cookie refresh osv.)
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: Parameters<typeof res.cookies.set>[2];
          }>
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Trigger session refresh if needed
  await supabase.auth.getUser();

  return res;
}

export const config = {
  matcher: [
    // ✅ Match alt vi bryr oss om, inkludert /api
    "/((?!_next/static|_next/image|favicon.ico|og.png|logo-mark.svg|covers/).*)",
  ],
};
