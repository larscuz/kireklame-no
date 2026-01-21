// src/app/auth/callback/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [msg, setMsg] = useState("Logger deg inn…");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const next = sp.get("next") || "/me";
        const type = sp.get("type") || ""; // "recovery" | "signup" | etc.
        const code = sp.get("code");

        // 1) PKCE/code-flow (hvis Supabase sender ?code=...)
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          if (cancelled) return;

          if (type === "recovery") {
            router.replace("/auth/set-password");
            return;
          }

          router.replace(next);
          return;
        }

        // 2) Implicit/hash-flow (Supabase sender #access_token=...&refresh_token=...)
        const hash = window.location.hash?.startsWith("#")
          ? window.location.hash.slice(1)
          : "";

        const hp = new URLSearchParams(hash);
        const access_token = hp.get("access_token") || "";
        const refresh_token = hp.get("refresh_token") || "";

        if (!access_token || !refresh_token) {
          // Ingen session i URL → send til /auth
          router.replace(`/auth?next=${encodeURIComponent(next)}`);
          return;
        }

        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) throw error;
        if (cancelled) return;

        // Rydd bort hash i URL
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);

        if (type === "recovery") {
          router.replace("/auth/set-password");
          return;
        }

        router.replace(next);
      } catch (e: any) {
        console.error("AUTH CALLBACK FAILED:", e);
        if (cancelled) return;
        setMsg("Kunne ikke logge inn. Prøv å åpne lenken fra e-posten på nytt.");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router, sp, supabase]);

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <div className="text-lg font-semibold">KiReklame</div>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">{msg}</p>
      </div>
    </div>
  );
}
