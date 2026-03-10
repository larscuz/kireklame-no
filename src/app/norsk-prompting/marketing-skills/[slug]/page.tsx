import Link from "next/link";
import { notFound } from "next/navigation";
import { marketingSkills } from "@/data/norskPrompting/runtime";
import type { MarketingSkillCategory } from "@/data/norskPrompting/types";
import SectionNav from "../../_components/SectionNav";
import MarkdownContent from "../../_components/MarkdownContent";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

const categoryLabel: Record<MarketingSkillCategory, string> = {
  cro: "CRO",
  content: "Innhold",
  seo: "SEO",
  paid: "Betalt",
  analytics: "Analyse",
  retention: "Lojalitet",
  growth: "Vekst",
  strategy: "Strategi",
  sales: "Salg",
  foundation: "Grunnleggende",
};

export async function generateStaticParams() {
  return marketingSkills.map((skill) => ({ slug: skill.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const skill = marketingSkills.find((entry) => entry.slug === slug);

  if (!skill) {
    return siteMeta({
      title: "Ferdighet ikke funnet | Norsk Prompting",
      description: "Ferdigheten finnes ikke.",
      path: `/norsk-prompting/marketing-skills/${slug}`,
    });
  }

  return siteMeta({
    title: `${skill.title_no} | Marketing Skills`,
    description: skill.description_no,
    path: `/norsk-prompting/marketing-skills/${skill.slug}`,
  });
}

export default async function MarketingSkillPage({ params }: Props) {
  const { slug } = await params;
  const skill = marketingSkills.find((entry) => entry.slug === slug);

  if (!skill) notFound();

  const related = skill.relatedSkills
    .map((relatedSlug) => marketingSkills.find((entry) => entry.slug === relatedSlug))
    .filter(Boolean);

  const jsonLd = [
    buildArticleJsonLd({
      headline: skill.title_no,
      description: skill.description_no,
      path: `/norsk-prompting/marketing-skills/${skill.slug}`,
      dateModified: "2026-03-08",
    }),
    buildBreadcrumbJsonLd([
      { name: "Forside", item: absoluteUrl("/") },
      { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
      { name: "Marketing Skills", item: absoluteUrl("/norsk-prompting/marketing-skills") },
      { name: skill.title_no, item: absoluteUrl(`/norsk-prompting/marketing-skills/${skill.slug}`) },
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
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgb(var(--muted))]">
                Norsk Prompting · Marketing Skills
              </p>
              <span className="rounded-full border border-zinc-300/25 bg-zinc-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgb(var(--fg))]/78">
                {categoryLabel[skill.category]}
              </span>
            </div>
            <h1 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight">
              {skill.title_no}
            </h1>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">{skill.name}</p>
            <p className="mt-3 max-w-4xl text-base text-[rgb(var(--muted))]">{skill.description_no}</p>
            <p className="mt-1 text-xs text-[rgb(var(--muted))]/70">v{skill.version}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:py-8">
        <SectionNav currentPath="/norsk-prompting/marketing-skills" />

        <article className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-5 pt-7 shadow-[0_10px_30px_rgba(2,6,23,0.18)] md:p-7">
          <MarkdownContent content={skill.content_md} />
        </article>

        {related.length > 0 && (
          <section className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
            <h2 className="text-lg font-semibold">Relaterte ferdigheter</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {related.map((entry) => (
                <Link
                  key={entry!.slug}
                  href={`/norsk-prompting/marketing-skills/${entry!.slug}`}
                  className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs text-[rgb(var(--muted))] hover:border-zinc-300/35"
                >
                  {entry!.title_no}
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
