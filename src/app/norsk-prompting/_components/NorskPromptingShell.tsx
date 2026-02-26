import type { ReactNode } from "react";
import SectionNav from "./SectionNav";

type Props = {
  currentPath: string;
  title: string;
  description: string;
  children: ReactNode;
  jsonLd?: unknown[];
};

export default function NorskPromptingShell({
  currentPath,
  title,
  description,
  children,
  jsonLd = [],
}: Props) {
  return (
    <main className="np-shell min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      {jsonLd.map((entry, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}

      <section className="np-hero border-b border-[rgb(var(--border))]">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:py-6">
          <div className="np-hero-card rounded-2xl border border-[rgb(var(--border))] px-4 py-4 backdrop-blur sm:px-5 sm:py-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="np-chip text-xs font-semibold uppercase tracking-[0.14em]">Norsk Prompting</span>
                  <span className="np-chip-muted text-xs font-semibold uppercase tracking-[0.14em]">Arbeidsflate</span>
                </div>
                <h1 className="mt-2 text-[clamp(1.7rem,3.2vw,2.45rem)] font-semibold leading-[1.07] tracking-tight">{title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[rgb(var(--fg))]/92">{description}</p>
              </div>

              <div className="relative shrink-0">
                <div className="group relative">
                  <span
                    tabIndex={0}
                    className="inline-flex h-7 w-7 cursor-help items-center justify-center rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 text-sm font-semibold text-[rgb(var(--muted))] outline-none transition hover:border-zinc-300/40 hover:bg-zinc-300/08 hover:text-zinc-100 focus:border-zinc-300/40 focus:bg-zinc-300/08 focus:text-zinc-100"
                    aria-label="Hva kan du gjøre her?"
                  >
                    i
                  </span>
                  <div className="pointer-events-none absolute right-0 top-9 z-20 hidden w-72 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/96 p-3 text-xs text-[rgb(var(--muted))] shadow-[0_14px_30px_rgba(0,0,0,0.35)] group-hover:block group-focus-within:block">
                    <p className="font-semibold uppercase tracking-[0.12em] text-zinc-100/90">Hva kan du gjøre her?</p>
                    <p className="mt-2 leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:py-8">
        <SectionNav currentPath={currentPath} />
        <div className="np-node-grid">{children}</div>
      </section>
    </main>
  );
}
