import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import SignOutButton from "./SignOutButton";
import { supabaseServerClient, isAdminUser } from "@/lib/supabase/server";
import MobileMenu from "./MobileMenu";
import TopbarSearch from "./TopbarSearch";
import LanguageSwitcher from "./LanguageSwitcher";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";



export default async function Topbar() {
  const locale = await getLocale();
  const supabase = await supabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const isAdmin = isAdminUser(user?.email);


  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-[rgb(var(--bg))]/70 border-b border-[rgb(var(--border))]">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <Link href={localizePath(locale, "/")} className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] grid place-items-center shadow-soft group-hover:shadow-lift transition overflow-hidden">
            <img
              src="/KIREKLAMElogo.gif"
              alt="KiReklame"
              width={36}
              height={36}
              className="h-8 w-8"
            />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">KiReklame</div>
            <div className="text-[11px] text-[rgb(var(--muted))] -mt-0.5">kireklame.no</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link
            href={localizePath(locale, "/internasjonalt")}
            className="rounded-xl px-3 py-2 text-sm font-medium text-[rgb(var(--fg))] hover:bg-[rgb(var(--muted))]"
          >
            {locale === "en" ? "International" : "Internasjonal"}
          </Link>

          <Link href={localizePath(locale, "/selskaper")} className="hover:opacity-80 transition">
            {locale === "en" ? "Norway" : "Norge"}
          </Link>

          <Link href={localizePath(locale, "/ki-reklamebyra")} className="hover:opacity-80 transition">
            {locale === "en" ? "About" : "Om"}
          </Link>

          <Link href={localizePath(locale, "/tips")} className="hover:opacity-80 transition">
            {locale === "en" ? "Tips" : "Tips"}
          </Link>

          <Link href={localizePath(locale, "/kontakt")} className="hover:opacity-80 transition">
            {locale === "en" ? "Contact" : "Kontakt"}
          </Link>


          {isAdmin ? (
            <Link href={localizePath(locale, "/admin")} className="hover:opacity-80 transition">
              Admin
            </Link>
          ) : null}

          {user ? (
            <Link href={localizePath(locale, "/me")} className="hover:opacity-80 transition">
              {locale === "en" ? "My page" : "Min side"}
            </Link>
          ) : null}

          <Link href={localizePath(locale, "/andre-ki-tjenester")} className="hover:opacity-80 transition">
            {locale === "en" ? "Other AI services" : "Andre KI-tjenester"}
          </Link>
</nav>


        <div className="flex items-center gap-2">
  <MobileMenu isAuthed={!!user} isAdmin={isAdmin} locale={locale} />
  <TopbarSearch />
  <ThemeToggle />
  <LanguageSwitcher className="hidden sm:inline-flex rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm font-medium shadow-soft hover:shadow-lift transition" />


  {user ? (
    <SignOutButton className="hidden sm:inline-flex rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm font-medium shadow-soft hover:shadow-lift transition">
      {locale === "en" ? "Sign out" : "Logg ut"}
    </SignOutButton>
  ) : (
    <Link
      href={localizePath(locale, "/auth")}
      className="hidden sm:inline-flex rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm font-medium shadow-soft hover:shadow-lift transition"
    >
      {locale === "en" ? "Sign in" : "Logg inn"}
    </Link>
  )}
</div>

      </div>
    </header>
  );
}
