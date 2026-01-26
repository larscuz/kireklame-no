"use client";

import Link from "next/link";
import { useState } from "react";
import SignOutButton from "./SignOutButton";

type Props = {
  isAuthed: boolean;
  isAdmin: boolean;
};

export default function MobileMenu({ isAuthed, isAdmin }: Props) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  // Felles styling: én "block list" i stedet for mange separate knapper
  const itemClass =
    "block w-full rounded-xl px-4 py-3 text-sm font-medium border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft hover:shadow-lift transition";

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

            {/* Block list */}
            <nav className="mt-4 grid gap-2">
              <Link href="/internasjonalt" onClick={close} className={itemClass}>
                Internasjonal
              </Link>

              <Link href="/selskaper" onClick={close} className={itemClass}>
                Selskaper
              </Link>

              <Link href="/om" onClick={close} className={itemClass}>
                Om
              </Link>

              <Link href="/kontakt" onClick={close} className={itemClass}>
                Kontakt
              </Link>

              <Link href="/register/company" onClick={close} className={itemClass}>
                Registrer bedrift
              </Link>

              {isAdmin ? (
                <Link href="/admin" onClick={close} className={itemClass}>
                  Admin
                </Link>
              ) : null}

              {/* Divider-ish spacing */}
              <div className="h-2" />

              {isAuthed ? (
                <>
                  <Link href="/me" onClick={close} className={itemClass}>
                    Min side
                  </Link>

                  {/* SignOutButton støtter ikke onClick -> vi lukker via wrapper */}
                  <div onClick={close}>
                    <SignOutButton className={`${itemClass} text-left`}>
                      Logg ut
                    </SignOutButton>
                  </div>
                </>
              ) : (
                <Link href="/auth" onClick={close} className={itemClass}>
                  Logg inn
                </Link>
              )}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
