import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import SignOutButton from "./SignOutButton";
import { supabaseServerClient } from "@/lib/supabase/server";

export default async function Topbar() {
  const supabase = await supabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-[rgb(var(--bg))]/70 border-b border-[rgb(var(--border))]">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] grid place-items-center shadow-soft group-hover:shadow-lift transition">
            <span className="text-sm font-bold tracking-tight">KI</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">KiReklame</div>
            <div className="text-[11px] text-[rgb(var(--muted))] -mt-0.5">kireklame.no</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link href="/selskaper" className="hover:opacity-80 transition">
            Selskaper
          </Link>

          {/* Viktig: dette skal ikke være /admin */}
          <Link href="/register/company" className="hover:opacity-80 transition">
            Registrer bedrift
          </Link>


          {user ? (
  <Link href="/me" className="hover:opacity-80 transition">
    Min side
  </Link>
) : null}

        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Høyre knapp: Utforsk når du ikke er innlogget, Logg ut når du er innlogget */}
          {user ? (
            <SignOutButton className="hidden sm:inline-flex rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm font-medium shadow-soft hover:shadow-lift transition">
              Logg ut
            </SignOutButton>
          ) : (
            <Link
              href="/auth"
              className="hidden sm:inline-flex rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm font-medium shadow-soft hover:shadow-lift transition"
            >
              Logg inn
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
