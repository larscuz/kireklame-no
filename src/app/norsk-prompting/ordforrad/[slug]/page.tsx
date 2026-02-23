import Link from "next/link";
import { notFound } from "next/navigation";
import { glossaryTerms } from "@/data/norskPrompting/runtime";
import CopyTextButton from "../../_components/CopyTextButton";
import SectionNav from "../../_components/SectionNav";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return glossaryTerms.map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const term = glossaryTerms.find((entry) => entry.slug === slug);

  if (!term) {
    return siteMeta({
      title: "Begrep ikke funnet | Norsk Prompting",
      description: "Begrepet finnes ikke i ordforrådet.",
      path: `/norsk-prompting/ordforrad/${slug}`,
    });
  }

  return siteMeta({
    title: `${term.term_no} | Norsk Prompting ordforråd`,
    description: term.definition_no,
    path: `/norsk-prompting/ordforrad/${term.slug}`,
  });
}

export default async function TermPage({ params }: Props) {
  const { slug } = await params;
  const term = glossaryTerms.find((entry) => entry.slug === slug);

  if (!term) notFound();

  const snippet = `${term.term_no}: ${term.promptImpact}`;
  const related = term.relatedTerms
    .map((relatedSlug) => glossaryTerms.find((entry) => entry.slug === relatedSlug))
    .filter(Boolean);

  const jsonLd = [
    buildArticleJsonLd({
      headline: term.term_no,
      description: term.definition_no,
      path: `/norsk-prompting/ordforrad/${term.slug}`,
      dateModified: "2026-02-23",
    }),
    buildBreadcrumbJsonLd([
      { name: "Forside", item: absoluteUrl("/") },
      { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
      { name: "Ordforråd", item: absoluteUrl("/norsk-prompting/ordforrad") },
      { name: term.term_no, item: absoluteUrl(`/norsk-prompting/ordforrad/${term.slug}`) },
    ]),
  ];

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
          <div className="np-hero-card rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 p-5 backdrop-blur sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgb(var(--muted))]">Norsk Prompting · Ordforråd</p>
            <h1 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight">{term.term_no}</h1>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">{term.term_en}</p>
            <p className="mt-3 max-w-4xl text-base text-[rgb(var(--muted))]">{term.definition_no}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:py-8">
        <SectionNav currentPath="/norsk-prompting/ordforrad" />

        <article className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7 shadow-[0_10px_30px_rgba(2,6,23,0.18)]">
          <p className="text-sm"><strong>Prompteffekt:</strong> {term.promptImpact}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <CopyTextButton value={snippet} label="Kopier prompt-snutt" />
            <Link
              href={`/norsk-prompting/prompt-utvider?input=${encodeURIComponent(`${term.term_no}: ${term.promptImpact}`)}&domain=${term.domain === "arch" ? "arkitektur" : term.domain === "film" ? "film-vfx" : term.domain === "vfx" ? "film-vfx" : term.domain === "ai" ? "redaksjonell" : term.domain === "photo" ? "produkt" : "design-system"}`}
              className="inline-flex rounded-full border border-zinc-300/35 bg-zinc-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-100"
            >
              Bruk i utvider
            </Link>
          </div>

          <h2 className="mt-4 text-lg font-semibold">Eksempler</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
            {term.examples.map((example, index) => (
              <li key={`${term.slug}-example-${index}`}>{example}</li>
            ))}
          </ul>

          {related.length ? (
            <>
              <h2 className="mt-4 text-lg font-semibold">Relaterte termer</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {related.map((entry) => (
                  <Link
                    key={entry!.slug}
                    href={`/norsk-prompting/ordforrad/${entry!.slug}`}
                    className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs text-[rgb(var(--muted))] hover:border-zinc-300/35"
                  >
                    {entry!.term_no}
                  </Link>
                ))}
              </div>
            </>
          ) : null}
        </article>
      </section>
    </main>
  );
}
