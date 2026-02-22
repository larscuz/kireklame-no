import Link from "next/link";
import type { KiOpplaringEntry } from "@/lib/ki-opplaring/content";
import { kiOpplaringTypeLabel } from "@/lib/ki-opplaring/content";
import { toEntryKey } from "@/lib/ki-opplaring/keys";
import { getYouTubeTutorialBundle } from "@/lib/ki-opplaring/tutorialVideos";
import GuideActionPanel from "./GuideActionPanel";
import MetaBadges from "./MetaBadges";
import TrainingMarkdown from "./TrainingMarkdown";

type Props = {
  entry: KiOpplaringEntry;
  related: KiOpplaringEntry[];
  sectionHref: string;
  sectionTitle: string;
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("nb-NO", { dateStyle: "long" });
}

export default async function EntryDetailPage({ entry, related, sectionHref, sectionTitle }: Props) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no").replace(/\/+$/, "");
  const canonicalUrl = `${site}${entry.url}`;
  const tutorialBundle = await getYouTubeTutorialBundle(entry, { limit: 3 });
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "KI Opplæring",
        item: `${site}/ki-opplaring`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: sectionTitle,
        item: `${site}${sectionHref}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: entry.title,
        item: canonicalUrl,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.description,
    inLanguage: "nb-NO",
    dateModified: entry.updatedAt,
    mainEntityOfPage: canonicalUrl,
    about: entry.topics,
    keywords: [...entry.topics, ...entry.tools],
    publisher: {
      "@type": "Organization",
      name: "KiReklame",
      url: site,
    },
  };

  return (
    <main className="bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="border-b border-[rgb(var(--border))] bg-gradient-to-br from-black/10 via-transparent to-black/5 dark:from-white/5 dark:to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[rgb(var(--muted))]">
            <Link href="/ki-opplaring" className="hover:underline">
              KI Opplæring
            </Link>
            <span>/</span>
            <Link href={sectionHref} className="hover:underline">
              {sectionTitle}
            </Link>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
            {kiOpplaringTypeLabel(entry.type)}
          </p>
          <h1 className="mt-2 max-w-4xl text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.04] tracking-tight">
            {entry.title}
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-[rgb(var(--muted))]">{entry.description}</p>
          <p className="mt-3 text-sm text-[rgb(var(--muted))]">Oppdatert {formatDate(entry.updatedAt)}</p>
          <div className="mt-5">
            <MetaBadges entry={entry} />
          </div>
          <GuideActionPanel type={entry.type} slug={entry.slug} />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-12">
        <article className="min-w-0">
          <TrainingMarkdown markdown={entry.body} entryKey={toEntryKey(entry.type, entry.slug)} />

          <div className="mt-10 border-t border-[rgb(var(--border))] pt-6">
            <h2 className="text-2xl font-semibold tracking-tight">Relevante YouTube-tutorials</h2>
            {tutorialBundle.videos.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {tutorialBundle.videos.map((video) => (
                  <a
                    key={video.id}
                    href={video.watchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 transition hover:shadow-lift"
                  >
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="aspect-video w-full rounded-xl border border-[rgb(var(--border))] object-cover"
                      />
                    ) : (
                      <div className="grid aspect-video w-full place-items-center rounded-xl border border-[rgb(var(--border))] bg-black/10 text-xs text-[rgb(var(--muted))]">
                        Ingen forhåndsvisning
                      </div>
                    )}
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                      {video.channelTitle}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-tight">{video.title}</p>
                    <p className="mt-2 text-xs text-[rgb(var(--muted))]">
                      Match: {video.matchedQuery}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[rgb(var(--muted))]">
                Ingen direkte videotreff akkurat nå.
              </p>
            )}

            {tutorialBundle.searchLinks.length ? (
              <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                  Videre søk på YouTube
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tutorialBundle.searchLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-10 border-t border-[rgb(var(--border))] pt-6">
            <h2 className="text-2xl font-semibold tracking-tight">Relatert innhold</h2>
            {related.length === 0 ? (
              <p className="mt-3 text-sm text-[rgb(var(--muted))]">Ingen relaterte saker enda.</p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={`${item.type}-${item.slug}`}
                    href={item.url}
                    className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 transition hover:shadow-lift"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
                      {kiOpplaringTypeLabel(item.type)}
                    </p>
                    <p className="mt-2 text-base font-semibold leading-tight">{item.title}</p>
                    <p className="mt-2 text-sm text-[rgb(var(--muted))]">{item.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </article>

        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
              Innholdsfortegnelse
            </h2>
            {entry.headings.length === 0 ? (
              <p className="mt-3 text-sm text-[rgb(var(--muted))]">Denne siden har ingen seksjonsoverskrifter ennå.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {entry.headings.map((heading) => (
                  <li key={heading.id} className={heading.depth === 3 ? "pl-3 text-[rgb(var(--muted))]" : ""}>
                    <a href={`#${heading.id}`} className="hover:underline">
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">Neste steg</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/ki-opplaring/guider" className="hover:underline">
                  Se alle guider
                </Link>
              </li>
              <li>
                <Link href="/ki-opplaring/ovelser" className="hover:underline">
                  Start en øvelse nå
                </Link>
              </li>
              <li>
                <Link href="/ki-opplaring/verktoy" className="hover:underline">
                  Utforsk verktøy
                </Link>
              </li>
              <li>
                <Link href="/ki-opplaring/ordliste" className="hover:underline">
                  Les ordlisten
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
