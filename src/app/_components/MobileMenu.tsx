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
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Lukk meny"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-[82vw] max-w-[320px] bg-[rgb(var(--bg))] border-l border-[rgb(var(--border))] shadow-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">Meny</div>
              <button
                type="button"
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft hover:shadow-lift transition"
                aria-label="Lukk"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <nav className="mt-4 flex flex-col gap-2 text-sm">
              <Link
                href="/selskaper"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-3 shadow-soft hover:shadow-lift transition"
              >
                Selskaper
              </Link>

              <Link
                href="/om"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-3 shadow-soft hover:shadow-lift transition"
              >
                Om
              </Link>

              <Link
                href="/kontakt"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-3 shadow-soft hover:shadow-lift transition"
              >
                Kontakt
              </Link>

              <Link
                href="/register/company"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-3 shadow-soft hover:shadow-lift transition"
              >
                Registrer bedrift
              </Link>

              {isAdmin ? (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-3 shadow-soft hover:shadow-lift transition"
                >
                  Admin
                </Link>
              ) : null}

              {isAuthed ? (
                <>
                  <Link
                    href="/me"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-3 shadow-soft hover:shadow-lift transition"
                  >
                    Min side
                  </Link>

                  <SignOutButton className="text-left rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-3 shadow-soft hover:shadow-lift transition">
                    Logg ut
                  </SignOutButton>
                </>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-3 shadow-soft hover:shadow-lift transition"
                >
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
