"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function FilterSearchBar({ initialQuery }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery ?? "");
  const router = useRouter();
  const pathname = usePathname() || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const basePath = isEn ? "/en/selskaper" : "/selskaper";

  function submit() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <label className="block text-[11px] uppercase tracking-wide text-[rgb(var(--muted))]">
          {isEn ? "Search" : "Søk"}
        </label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={
            isEn ? "Search by company, AI level, or price" : "Søk etter bedrift, AI-nivå eller pris"
          }
          className="mt-1 w-full bg-transparent outline-none text-sm rounded-full px-4 py-2 border border-transparent focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
        />
      </div>

      <button
        onClick={submit}
        className="shrink-0 rounded-full bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-5 py-2.5 text-sm font-semibold shadow-soft hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        {isEn ? "Search" : "Søk"}
      </button>
    </div>
  );

}
