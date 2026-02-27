import type {
  FreeModelRankingCategory,
  FreeModelRankingItem,
  FreeModelRankingSignals,
} from "./FreeModelsRankingTypes";

type Props = {
  categories: FreeModelRankingCategory[];
  snapshotLabel: string;
};

type ScoredItem = FreeModelRankingItem & {
  score: number;
  rank: number;
};

type ScoredCategory = {
  id: FreeModelRankingCategory["id"];
  title: string;
  items: ScoredItem[];
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function computeInternetScore(signals: FreeModelRankingSignals): number {
  const weighted =
    signals.serpVisibility * 0.34 +
    signals.platformTrust * 0.21 +
    signals.freeTierStrength * 0.16 +
    signals.momentum * 0.14 +
    signals.reliability * 0.09 +
    signals.communityDemand * 0.06;

  return clampScore(weighted);
}

function scoreBand(score: number): string {
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 65) return "C";
  if (score >= 55) return "D";
  return "E";
}

function estimateGooglePosition(serpVisibility: number): number {
  return Math.max(1, Math.round((100 - serpVisibility) / 8) + 1);
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getFaviconUrl(url: string, size = 64): string {
  return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url)}&sz=${size}`;
}

function sortAndScore(categories: FreeModelRankingCategory[]): ScoredCategory[] {
  return categories.map((category) => {
    const sorted = [...category.items]
      .map((item) => ({ ...item, score: computeInternetScore(item.signals), rank: 0 }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.name.localeCompare(b.name, "nb-NO");
      })
      .map((item, index) => ({ ...item, rank: index + 1 }));

    return {
      id: category.id,
      title: category.title,
      items: sorted,
    };
  });
}

function ScoreChip({ item }: { item: FreeModelRankingItem }) {
  const score = computeInternetScore(item.signals);
  const band = scoreBand(score);
  const googleEstimate = estimateGooglePosition(item.signals.serpVisibility);

  return (
    <div className="group relative">
      <span
        className="inline-flex cursor-help items-center gap-1 rounded-lg border border-zinc-300/35 bg-zinc-300/10 px-2 py-1 text-xs font-semibold text-white"
        aria-label={`Internett-score ${score.toFixed(1)}. Hold peker over for detaljer.`}
      >
        {score.toFixed(1)}
        <span className="text-[10px] text-zinc-200/90">{band}</span>
      </span>

      <div className="pointer-events-none absolute right-0 top-full z-[80] mt-2 w-56 translate-y-1 rounded-lg border border-zinc-700 bg-zinc-950 p-2 opacity-0 shadow-[0_12px_28px_rgba(2,6,23,0.45)] ring-1 ring-zinc-900/40 transition group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-300">Ranking-detaljer</p>
        <div className="mt-1 space-y-1 text-[11px] text-zinc-100">
          <p>Total: {score.toFixed(1)}</p>
          <p>SERP synlighet: {item.signals.serpVisibility}</p>
          <p>Google estimat: #{googleEstimate}</p>
          <p>Plattformtillit: {item.signals.platformTrust}</p>
          <p>Gratisnivå: {item.signals.freeTierStrength}</p>
          <p>Momentum: {item.signals.momentum}</p>
          <p>Stabilitet: {item.signals.reliability}</p>
          <p>Etterspørsel (web): {item.signals.communityDemand}</p>
        </div>
      </div>
    </div>
  );
}

export default function FreeModelsRankingBoard({ categories, snapshotLabel }: Props) {
  const scoredCategories = sortAndScore(categories);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4 pt-7 text-white shadow-[0_10px_30px_rgba(2,6,23,0.35)]">
        <h2 className="text-xl font-semibold tracking-tight">Internett-basert ranking</h2>
        <p className="mt-2 text-sm text-zinc-200">
          Hvert verktøy viser en samlet poengscore. Hold pekeren over poengfeltet for detaljert ranking-breakdown.
        </p>
        <p className="mt-1 text-xs text-zinc-400">Datagrunnlag: web-snapshot {snapshotLabel}.</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scoredCategories.map((category) => (
          <section
            key={category.id}
            className="min-w-0 rounded-2xl border border-zinc-700 bg-zinc-900 p-4 pt-7 text-white shadow-[0_10px_30px_rgba(2,6,23,0.35)]"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xl font-semibold tracking-tight">{category.title}</h3>
              <span className="rounded-full border border-zinc-600 px-2 py-1 text-xs text-zinc-300">
                {category.items.length}
              </span>
            </div>

            <div className="mt-3 grid gap-2">
              {category.items.map((item) => (
                <article
                  key={item.id}
                  className="relative min-w-0 overflow-visible rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 transition hover:z-30"
                >
                  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-xl">
                    <img
                      src={getFaviconUrl(item.href, 256)}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover opacity-[0.08] grayscale"
                    />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-300">
                          #{item.rank}
                        </p>
                        <div className="mt-1 flex min-w-0 items-start gap-2">
                          <img
                            src={getFaviconUrl(item.href)}
                            alt={`${item.name} logo`}
                            loading="lazy"
                            decoding="async"
                            className="h-5 w-5 shrink-0"
                          />
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="block min-w-0 text-sm font-semibold text-white underline-offset-2 hover:underline"
                          >
                            {item.name}
                          </a>
                        </div>
                        {getHostname(item.href) ? (
                          <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-zinc-400">
                            {getHostname(item.href)}
                          </p>
                        ) : null}
                      </div>
                      <ScoreChip item={item} />
                    </div>

                    <p className="mt-1 break-all text-xs text-zinc-400">{item.href}</p>
                    <p className="mt-1 text-xs text-zinc-400">{item.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
