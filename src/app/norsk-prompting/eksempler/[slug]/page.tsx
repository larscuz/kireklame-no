import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { glossaryBySlug } from "@/data/norskPrompting/runtime";
import { operativeExamples } from "@/data/norskPrompting/operativeExamples";
import CopyTextButton from "../../_components/CopyTextButton";
import SectionNav from "../../_components/SectionNav";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return operativeExamples.map((example) => ({ slug: example.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const example = operativeExamples.find((entry) => entry.slug === slug);

  if (!example) {
    return siteMeta({
      title: "Eksempel ikke funnet | Norsk Prompting",
      description: "Eksempelet finnes ikke i biblioteket.",
      path: `/norsk-prompting/eksempler/${slug}`,
    });
  }

  return siteMeta({
    title: `${example.title} | Norsk Prompting eksempel`,
    description: example.shortBrief,
    path: `/norsk-prompting/eksempler/${example.slug}`,
  });
}

export default async function ExampleDetailPage({ params }: Props) {
  const { slug } = await params;
  const example = operativeExamples.find((entry) => entry.slug === slug);

  if (!example) notFound();

  const terms = example.terms.map((term) => ({
    ...term,
    glossary: term.slug ? glossaryBySlug[term.slug] : undefined,
  }));

  const description = `Kort briefing: ${example.shortBrief}`;
  const runInExpanderHref = `/norsk-prompting/prompt-utvider?input=${encodeURIComponent(example.expanderSeedInput)}&outputType=${example.outputType}`;

  const jsonLd = [
    buildArticleJsonLd({
      headline: example.title,
      description,
      path: `/norsk-prompting/eksempler/${example.slug}`,
      dateModified: example.updatedAt,
    }),
    buildBreadcrumbJsonLd([
      { name: "Forside", item: absoluteUrl("/") },
      { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
      { name: "Eksempler", item: absoluteUrl("/norsk-prompting/eksempler") },
      { name: example.title, item: absoluteUrl(`/norsk-prompting/eksempler/${example.slug}`) },
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
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgb(var(--muted))]">Norsk Prompting · Operativt eksempel</p>
            <h1 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight">{example.title}</h1>
            <p className="mt-3 max-w-4xl text-base text-[rgb(var(--muted))]">{example.shortBrief}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:py-8">
        <SectionNav currentPath="/norsk-prompting/eksempler" />

        <article className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">1. Kort briefing (mediefaglig)</p>
          <p className="mt-2 text-sm text-[rgb(var(--fg))]/90">{example.briefing}</p>
          <p className="mt-2 text-xs text-[rgb(var(--muted))]">Modell: {example.modelName}</p>
        </article>

        <article className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">2. Brukte fagbegreper</p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[rgb(var(--fg))]/90">
            {terms.map((term) => (
              <li key={`${example.slug}-${term.term}`}>
                {term.slug ? (
                  <Link href={`/norsk-prompting/ordforrad/${term.slug}`} className="underline underline-offset-4">
                    {term.term}
                  </Link>
                ) : (
                  <span>{term.term}</span>
                )}
                {term.note ? <span className="text-[rgb(var(--muted))]"> - {term.note}</span> : null}
                {term.glossary ? <span className="block text-xs text-[rgb(var(--muted))]">{term.glossary.definition_no}</span> : null}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Unambiguous terms</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/90">
            {example.unambiguousTerms.map((term) => (
              <li key={`${example.slug}-ua-${term}`}>{term}</li>
            ))}
          </ul>
        </article>

        <article className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">3. Ferdig prompt</p>
          <p className="mt-2 text-xs text-[rgb(var(--muted))]">{example.promptSource}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <CopyTextButton value={example.finishedPrompt} label="Kopier prompt" />
            <Link
              href={runInExpanderHref}
              className="inline-flex rounded-full border border-zinc-300/35 bg-zinc-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-100"
            >
              Kjør i utvider
            </Link>
          </div>

          <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 p-3 text-sm text-[rgb(var(--fg))]/90">
            {example.finishedPrompt}
          </pre>
        </article>

        <article className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">4. Resultatbilde</p>
          {example.resultImage.isPlaceholder ? (
            <p className="mt-2 text-xs text-[rgb(var(--muted))]">Status: Placeholder-bilde for strukturtesting.</p>
          ) : null}
          <div className="mt-3 overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70">
            <Image
              src={example.resultImage.src}
              alt={example.resultImage.alt}
              width={1600}
              height={1000}
              className="h-auto w-full"
            />
          </div>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">{example.resultImage.caption}</p>
        </article>

        <article className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">5. Teknisk analyse</p>

          <h2 className="mt-2 text-base font-semibold">Presisjonsdrivere</h2>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/90">
            {example.analysis.precisionDrivers.map((point) => (
              <li key={`${example.slug}-pd-${point}`}>{point}</li>
            ))}
          </ul>

          <h2 className="mt-4 text-base font-semibold">Hva modellen responderte tydelig på</h2>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/90">
            {example.analysis.modelResponse.map((point) => (
              <li key={`${example.slug}-mr-${point}`}>{point}</li>
            ))}
          </ul>

          <h2 className="mt-4 text-base font-semibold">Hva kunne vært mer presist</h2>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/90">
            {example.analysis.possibleImprovements.map((point) => (
              <li key={`${example.slug}-pi-${point}`}>{point}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
