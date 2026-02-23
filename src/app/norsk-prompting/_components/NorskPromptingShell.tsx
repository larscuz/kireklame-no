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
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <div className="np-hero-card rounded-3xl border border-[rgb(var(--border))] p-5 backdrop-blur sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="np-chip text-xs font-semibold uppercase tracking-[0.14em]">Norsk Prompting</span>
                  <span className="np-chip-muted text-xs font-semibold uppercase tracking-[0.14em]">Arbeidsflate</span>
                </div>
                <h1 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.05] tracking-tight">{title}</h1>
                <p className="mt-3 max-w-4xl text-base text-[rgb(var(--muted))]">{description}</p>
              </div>

              <aside className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-cyan-100/90">Arbeidslogikk</p>
                <ol className="mt-2 space-y-2 text-sm text-[rgb(var(--muted))]">
                  <li><strong className="text-[rgb(var(--fg))]">1.</strong> Definer mål</li>
                  <li><strong className="text-[rgb(var(--fg))]">2.</strong> Lås produksjon</li>
                  <li><strong className="text-[rgb(var(--fg))]">3.</strong> Lever prompt</li>
                </ol>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:py-8">
        <SectionNav currentPath={currentPath} />
        {children}
      </section>
    </main>
  );
}
