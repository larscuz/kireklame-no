// src/app/_components/HeroInternational.tsx
import HeroBackgroundVideo from "./HeroBackgroundVideo";

export default function HeroInternational({
  heroVideoUrl,
  poster,
}: {
  heroVideoUrl?: string | null;
  poster?: string | null;
}) {
  const subtitle =
    "En kuratert katalog over internasjonale aktører som bruker AI i reklame og kreativ produksjon.";

  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-8">
      <div className="relative rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft overflow-hidden">
        {/* Background video */}
        <HeroBackgroundVideo
          src={heroVideoUrl}
          poster={poster ?? "/covers/cover-1.jpg"}
        />

        {/* Foreground content */}
        <div className="relative z-10 p-6 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Internasjonalt{" "}
              <span className="text-[rgb(var(--muted))] font-normal">
                – katalog
              </span>
            </h1>

            <a
              href="/selskaper"
              className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-3 font-semibold shadow-soft hover:opacity-90 transition"
            >
              Se norske aktører
            </a>
          </div>

          <p className="mt-4 max-w-2xl text-[rgb(var(--muted))] leading-relaxed">
            {subtitle}
          </p>

          {/* Featured */}
          <div className="mt-4 text-sm text-[rgb(var(--muted))]">
            <span className="mr-2 inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
              Featured
            </span>
            <a
              href="/selskap/nmatic"
              className="font-semibold underline-offset-2 hover:underline text-[rgb(var(--fg))]"
            >
              Nmatic
            </a>
            <span className="ml-2 text-[rgb(var(--muted))]">
              Studio · International
            </span>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="relative z-10 h-1 bg-gradient-to-r from-black/10 via-black/0 to-black/10 dark:from-white/10 dark:via-white/0 dark:to-white/10" />
      </div>
    </section>
  );
}
