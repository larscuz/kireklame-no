"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSearch({ initialQuery }: { initialQuery: string }) {
  const [q, setQ] = useState(initialQuery);
  const router = useRouter();

  const subtitle = useMemo(() => {
    return "En kuratert katalog over norske aktører som bruker AI i reklame og kreativ produksjon.";
  }, []);

  function submit() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/selskaper?${params.toString()}`);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-8">
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft overflow-hidden">
        <div className="p-6 md:p-10">
          {/* Title + CTA */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              KiReklame{" "}
              <span className="text-[rgb(var(--muted))] font-normal">
                 - katalog
              </span>
            </h1>

            <a
              href="/register/company"
              className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-3 font-semibold shadow-soft hover:opacity-90 transition"
            >
              Registrer bedrift
            </a>
          </div>

          <p className="mt-4 max-w-2xl text-[rgb(var(--muted))] leading-relaxed">
            {subtitle}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 shadow-soft">
              <label className="block text-[11px] uppercase tracking-wide text-[rgb(var(--muted))]">
                Søk
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Søk på bedrift, AI-nivå eller pris-nivå"
                className="mt-1 w-full bg-transparent outline-none text-base"
              />
            </div>

            <button
              onClick={submit}
              className="rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-6 py-4 font-semibold shadow-soft hover:opacity-90 transition"
            >
              Søk
            </button>
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-black/10 via-black/0 to-black/10 dark:from-white/10 dark:via-white/0 dark:to-white/10" />
      </div>
    </section>
  );
}
