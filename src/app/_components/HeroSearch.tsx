"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import HeroBackgroundVideo from "./HeroBackgroundVideo";

export default function HeroSearch({
  initialQuery,
  heroVideoUrl,
  featuredCompany,
}: {
  initialQuery: string;
  heroVideoUrl?: string | null;
  featuredCompany?: {
    name: string;
    slug: string;
    company_type?: string | null;
    locationName?: string | null;
  } | null;
}) {


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
      {/* HERO */}
      <div className="relative rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft overflow-hidden">
        {/* Background video (safe: renders nothing if src is undefined) */}
        <HeroBackgroundVideo
  src={heroVideoUrl}
  poster="/covers/cover-1.jpg"
/>


        {/* Foreground content */}
        <div className="relative z-10 p-6 md:p-10">
          {/* Title + CTA */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              KiReklame{" "}
              <span className="text-[rgb(var(--muted))] font-normal">
                {" "}
                – katalog
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

            {featuredCompany?.slug ? (
  <div className="mt-3 text-sm text-[rgb(var(--muted))]">
    <span className="mr-2 inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
      Featured
    </span>
    <a
      href={`/selskap/${featuredCompany.slug}`}
      className="font-semibold underline-offset-2 hover:underline text-[rgb(var(--fg))]"
    >
      {featuredCompany.name}
    </a>
    {(featuredCompany.company_type || featuredCompany.locationName) ? (
      <span className="ml-2 text-[rgb(var(--muted))]">
        {featuredCompany.company_type ? `${featuredCompany.company_type}` : ""}
        {featuredCompany.company_type && featuredCompany.locationName ? " · " : ""}
        {featuredCompany.locationName ? featuredCompany.locationName : ""}
      </span>
    ) : null}
  </div>
) : null}


            <button
              onClick={submit}
              className="rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-6 py-4 font-semibold shadow-soft hover:opacity-90 transition"
            >
              Søk
            </button>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="relative z-10 h-1 bg-gradient-to-r from-black/10 via-black/0 to-black/10 dark:from-white/10 dark:via-white/0 dark:to-white/10" />
      </div>
    </section>
  );
}
