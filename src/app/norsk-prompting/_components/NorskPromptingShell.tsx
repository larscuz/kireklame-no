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
    <main className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      {jsonLd.map((entry, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}

      <section className="border-b border-[rgb(var(--border))] bg-gradient-to-br from-black/10 via-transparent to-black/5 dark:from-white/5 dark:to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgb(var(--muted))]">Norsk Prompting</p>
          <h1 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight">{title}</h1>
          <p className="mt-3 max-w-4xl text-base text-[rgb(var(--muted))]">{description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:py-8">
        <SectionNav currentPath={currentPath} />
        {children}
      </section>
    </main>
  );
}
