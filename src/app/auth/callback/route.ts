// src/app/auth/callback/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);

  // next = hvor vi vil etter at session er satt
  // Default: /me (men recovery-mailen din setter next=/auth/set-password)
  const next = url.searchParams.get("next") ?? "/me";

  // Supabase callback variants:
  // 1) PKCE/code: ?code=...
  // 2) Email confirm / recovery: ?token_hash=...&type=signup|recovery|...
  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type"); // "signup" | "recovery" | ...

  // Hvis bruker åpner callback manuelt uten params, send til /auth
  if (!code && !(token_hash && type)) {
    return NextResponse.redirect(
      new URL(`/auth?next=${encodeURIComponent(next)}`, url.origin)
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: Parameters<typeof cookieStore.set>[2];
          }>
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  // 1) Standard PKCE exchange (ofte brukt av magiclink / recovery også)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL(`/auth?next=${encodeURIComponent(next)}`, url.origin)
      );
    }

    // ✅ VIKTIG: respekter "next" uansett flow-type
    // (du styrer recovery → /auth/set-password via redirect_to-param i mail-linken)
    return NextResponse.redirect(new URL(next, url.origin));
  }

  // 2) Email confirmation / recovery etc.
  const { error } = await supabase.auth.verifyOtp({
    token_hash: token_hash!,
    type: type as any,
  });

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth?next=${encodeURIComponent(next)}`, url.origin)
    );
  }

  // ✅ Samme her: respekter next
  return NextResponse.redirect(new URL(next, url.origin));
}
