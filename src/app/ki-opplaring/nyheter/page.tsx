import Link from "next/link";
import { listPublishedNews } from "@/lib/news/articles";
import { siteMeta } from "@/lib/seo";

export const metadata = siteMeta({
  title: "KI Opplæring nyheter | Sekundær feed",
  description: "Nyhetsfeed er sekundær i den nye opplæringsstrukturen. Brukes som supplement til guider og tema-huber.",
  path: "/ki-opplaring/nyheter",
});

function formatDate(value: string | null): string {
  if (!value) return "Dato mangler";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("nb-NO", { dateStyle: "medium" });
}

export default async function KiOpplaringNyheterPage() {
  const news = await listPublishedNews(30);
  const latest = news.slice(0, 12);

  return (
    <main className="bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      <section className="border-b border-[rgb(var(--border))] bg-gradient-to-br from-black/10 via-transparent to-black/5 dark:from-white/5 dark:to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Sekundær feed</p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight">KI-nyheter</h1>
          <p className="mt-3 max-w-3xl text-lg text-[rgb(var(--muted))]">
            Nyheter brukes nå som støtteinnhold. Hovedløpet ligger i guider, tema-huber, verktøy og ordliste.
          </p>
          <div className="mt-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-sm text-[rgb(var(--muted))]">
            Denne seksjonen er flyttet under <Link href="/ki-opplaring" className="underline underline-offset-4">KI Opplæring</Link>.
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 lg:py-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Siste publiserte saker</h2>
          <Link href="/ki-opplaring" className="text-sm font-medium underline underline-offset-4">
            Tilbake til opplæringen
          </Link>
        </div>

        {latest.length === 0 ? (
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 text-sm text-[rgb(var(--muted))]">
            Ingen publiserte nyhetssaker akkurat nå.
          </div>
        ) : (
          <div className="space-y-3">
            {latest.map((article) => (
              <article key={article.id} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
                <p className="text-xs text-[rgb(var(--muted))]">{formatDate(article.published_at ?? article.created_at)}</p>
                <h3 className="mt-1 text-lg font-semibold leading-tight">
                  <Link href={`/ki-avis/${article.slug}`} className="hover:underline">
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                  {article.summary ?? article.excerpt ?? "Oppsummering mangler foreløpig."}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
