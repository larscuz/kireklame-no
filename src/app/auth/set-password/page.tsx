// src/app/auth/set-password/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import SetPasswordForm from "./SetPasswordForm";

export default function SetPasswordPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [email, setEmail] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(String(data.user?.email ?? ""));
      setReady(true);
    })();
  }, [supabase]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
          <p className="text-sm text-[rgb(var(--muted))]">Laster…</p>
        </div>
      </div>
    );
  }

  // Ikke verifisert / ingen session → forklar og send til login
  if (!email) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
          <h1 className="text-xl font-semibold tracking-tight">Lag passord</h1>
          <p className="mt-3 text-sm text-[rgb(var(--muted))]">
            Du er ikke logget inn ennå. Bruk lenken i e-posten igjen, eller logg inn.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/auth"
              className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm font-semibold hover:opacity-80"
            >
              Gå til innlogging
            </Link>
            <Link
              href="/"
              className="text-sm text-[rgb(var(--muted))] underline underline-offset-4 hover:opacity-80 self-center"
            >
              Til katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Lag passord</h1>
          <Link href="/" className="text-sm text-[rgb(var(--muted))] hover:underline">
            ← Til katalog
          </Link>
        </div>

        <p className="mt-3 text-sm text-[rgb(var(--muted))] leading-relaxed">
          Du er verifisert via e-postlenken. Lag et passord nå, så kan du logge inn senere uten flere e-poster.
        </p>

        <div className="mt-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3">
          <div className="text-xs font-semibold text-[rgb(var(--muted))]">E-post</div>
          <div className="mt-1 font-medium break-all">{email}</div>
        </div>

        <SetPasswordForm />
      </div>
    </div>
  );
}
