"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function TopbarSearch() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const basePath = isEn ? "/en/selskaper" : "/selskaper";
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      // fokus når vi åpner
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function submit() {
    const query = q.trim();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    router.push(`${basePath}${params.toString() ? `?${params.toString()}` : ""}`);
    setOpen(false);
  }

  return (
    <div className="relative">
      {/* Icon button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft hover:shadow-lift transition"
        aria-label={isEn ? "Search" : "Søk"}
        aria-expanded={open}
      >
        {/* enkel søk-ikon (SVG) */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10.5 18.0a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M16.5 16.5 21 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Dropdown input */}
      {open ? (
        <div className="absolute right-0 mt-2 w-[280px] rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft p-2">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={isEn ? "Search companies…" : "Søk i selskaper…"}
              className="h-9 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 text-sm outline-none"
            />
            <button
              type="button"
              onClick={submit}
              className="h-9 rounded-xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-3 text-sm font-semibold hover:opacity-90 transition"
            >
              {isEn ? "Search" : "Søk"}
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-[rgb(var(--muted))]">
              {isEn ? "Press Enter to search" : "Enter for å søke"}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[11px] text-[rgb(var(--muted))] hover:opacity-80"
            >
              {isEn ? "Close" : "Lukk"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
