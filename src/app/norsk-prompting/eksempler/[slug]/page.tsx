import Link from "next/link";
import { notFound } from "next/navigation";
import { glossaryTerms, promptExamples, rulesById } from "@/data/norskPrompting/runtime";
import SectionNav from "../../_components/SectionNav";
import CopyTextButton from "../../_components/CopyTextButton";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return promptExamples.map((example) => ({ slug: example.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const example = promptExamples.find((entry) => entry.slug === slug);

  if (!example) {
    return siteMeta({
      title: "Eksempel ikke funnet | Norsk Prompting",
      description: "Eksempelet finnes ikke i biblioteket.",
      path: `/norsk-prompting/eksempler/${slug}`,
    });
  }

  return siteMeta({
    title: `${example.title} | Norsk Prompting eksempel`,
    description: example.shortInput,
    path: `/norsk-prompting/eksempler/${example.slug}`,
  });
}

export default async function ExampleDetailPage({ params }: Props) {
  const { slug } = await params;
  const example = promptExamples.find((entry) => entry.slug === slug);

  if (!example) notFound();

  const usedRules = example.ruleIds
    .map((ruleId) => rulesById[ruleId])
    .filter(Boolean);

  const usedTerms = example.termSlugs
    .map((termSlug) => glossaryTerms.find((term) => term.slug === termSlug))
    .filter(Boolean);

  const description = `Kort input: ${example.shortInput}`;

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
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgb(var(--muted))]">Norsk Prompting · Eksempel</p>
            <h1 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight">{example.title}</h1>
            <p className="mt-3 max-w-4xl text-base text-[rgb(var(--muted))]">{example.shortInput}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:py-8">
        <SectionNav currentPath="/norsk-prompting/eksempler" />

        <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 shadow-[0_10px_30px_rgba(2,6,23,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Kort input</p>
          <p className="mt-2 text-sm">{example.shortInput}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <CopyTextButton value={example.longOutput} label="Kopier langt resultat" />
            <Link
              href={`/norsk-prompting/prompt-utvider?input=${encodeURIComponent(example.shortInput)}&outputType=${example.outputType}&domain=${example.domain}`}
              className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100"
            >
              Kjør i utvider
            </Link>
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Langt resultat</p>
          <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 p-3 text-sm text-[rgb(var(--fg))]/90">
            {example.longOutput}
          </pre>
        </article>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4">
            <h2 className="text-lg font-semibold">Hvorfor dette fungerer</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
              {example.whyWorks.map((point, index) => (
                <li key={`${example.slug}-why-${index}`}>{point}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4">
            <h2 className="text-lg font-semibold">Regler brukt</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
              {usedRules.map((rule) => (
                <li key={rule.id}>
                  <a href={`/norsk-prompting/regler#${rule.id}`} className="underline underline-offset-4">
                    {rule.name}
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="mt-4 text-lg font-semibold">Termer injisert</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
              {usedTerms.map((term) => (
                <li key={term!.slug}>
                  <Link href={`/norsk-prompting/ordforrad/${term!.slug}`} className="underline underline-offset-4">
                    {term!.term_no}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
