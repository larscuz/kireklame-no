"use client";

import Link from "next/link";
import { useState } from "react";
import SignOutButton from "./SignOutButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { localizePath, type Locale } from "@/lib/i18n";

type Props = {
  isAuthed: boolean;
  isAdmin: boolean;
  locale: Locale;
};

export default function MobileMenu({ isAuthed, isAdmin, locale }: Props) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  // Enkel listestil på solid panel (ikke separate kort-knapper)
  const itemClass =
    "block w-full px-4 py-3.5 text-base font-medium text-[rgb(var(--fg))] hover:bg-[rgb(var(--bg))]/60 transition text-left";
  const newsItemClass =
    "block w-full px-4 py-3.5 text-base font-semibold text-black bg-white hover:bg-neutral-100 transition text-left";

  return (
    <>
      {/* Hamburger */}
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft hover:shadow-lift transition"
        aria-label="Åpne meny"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="text-lg leading-none">≡</span>
      </button>

      {/* Overlay + panel */}
      {open ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* overlay click closes */}
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Lukk meny"
            onClick={close}
          />

          <div className="absolute right-0 top-0 h-full w-[86vw] max-w-[340px] bg-[rgb(var(--bg))] border-l border-[rgb(var(--border))] shadow-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">Meny</div>
              <button
                type="button"
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft hover:shadow-lift transition"
                aria-label="Lukk"
                onClick={close}
              >
                ✕
              </button>
            </div>

            <nav className="mt-4 max-h-[calc(100vh-6.5rem)] overflow-y-auto rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/95 backdrop-blur-sm divide-y divide-[rgb(var(--border))]/70">
              <LanguageSwitcher className={itemClass} onClick={close} />

              <Link
                href={localizePath(locale, "/internasjonalt")}
                onClick={close}
                className={itemClass}
              >
                {locale === "en" ? "International" : "Internasjonal"}
              </Link>

              <Link href={localizePath(locale, "/annonsere")} onClick={close} className={itemClass}>
                {locale === "en" ? "Advertise" : "Annonsere"}
              </Link>

              <Link
                href={localizePath(locale, "/ki-reklamebyra")}
                onClick={close}
                className={itemClass}
              >
                {locale === "en" ? "About" : "Om"}
              </Link>

              <Link href={localizePath(locale, "/kontakt")} onClick={close} className={itemClass}>
                {locale === "en" ? "Contact" : "Kontakt"}
              </Link>

              {isAdmin ? (
                <Link href={localizePath(locale, "/admin")} onClick={close} className={itemClass}>
                  Admin
                </Link>
              ) : null}

              {isAuthed ? (
                <>
                  <Link href={localizePath(locale, "/me")} onClick={close} className={itemClass}>
                    {locale === "en" ? "My page" : "Min side"}
                  </Link>

                  <Link
                    href={localizePath(locale, "/ki-avis")}
                    onClick={close}
                    className={newsItemClass}
                  >
                    {locale === "en" ? "KiR News" : "KiR Nyheter"}
                  </Link>

                  {/* SignOutButton støtter ikke onClick -> vi lukker via wrapper */}
                  <div onClick={close}>
                    <SignOutButton className={itemClass}>
                      {locale === "en" ? "Sign out" : "Logg ut"}
                    </SignOutButton>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href={localizePath(locale, "/ki-avis")}
                    onClick={close}
                    className={newsItemClass}
                  >
                    {locale === "en" ? "KiR News" : "KiR Nyheter"}
                  </Link>

                  <Link href={localizePath(locale, "/auth")} onClick={close} className={itemClass}>
                    {locale === "en" ? "Sign in" : "Logg inn"}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
