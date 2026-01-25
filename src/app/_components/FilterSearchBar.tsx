"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FilterSearchBar({ initialQuery }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery ?? "");
  const router = useRouter();

  function submit() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/selskaper?${params.toString()}`);
  }

  return (
  <div className="flex items-center gap-3">
    <div className="min-w-0 flex-1">
      <label className="block text-[11px] uppercase tracking-wide text-[rgb(var(--muted))]">
        Søk
      </label>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Søk etter bedrift, AI-nivå eller pris"
        className="mt-1 w-full bg-transparent outline-none text-sm"
      />
    </div>

    <button
      onClick={submit}
      className="shrink-0 rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-2.5 text-sm font-semibold shadow-soft hover:opacity-90 transition"
    >
      Søk
    </button>
  </div>
);

}
