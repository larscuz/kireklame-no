"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import UsageMeter from "@/components/ki-opplaring/UsageMeter";
import type { LearningPathId, LearningPathItem } from "@/config/ki-opplaring-paths";
import { learningPaths } from "@/config/ki-opplaring-paths";
import { getTemplateById, topTemplateIds } from "@/config/ki-opplaring-templates";
import { useBookmarks } from "@/hooks/ki-opplaring/useBookmarks";
import { useKiProgress } from "@/hooks/ki-opplaring/useKiProgress";
import { useMode } from "@/hooks/ki-opplaring/useMode";
import { useUsage } from "@/hooks/ki-opplaring/useUsage";
import { entryTypeLabel, toEntryKey, toEntryPath } from "@/lib/ki-opplaring/keys";
import BookmarkButton from "./BookmarkButton";

type EntryType = "guider" | "tema" | "verktoy" | "ordliste";
type LevelType = "beginner" | "intermediate" | "pro";
type CategoryFilter = EntryType | "all";

type WorkspaceEntry = {
  id: string;
  entryKey: string;
  slug: string;
  title: string;
  description: string;
  url: string;
  type: EntryType;
  topics: string[];
  tools: string[];
  audience: string[];
  level: LevelType;
  updatedAt: string;
  readingTimeMinutes: number;
  exercises?: number;
  estimatedMinutes?: number;
  templates?: string[];
};

type TopicCard = {
  topic: string;
  count: number;
};

type Counts = {
  total: number;
  guider: number;
  tema: number;
  verktoy: number;
  ordliste: number;
};

type Props = {
  counts: Counts;
  entries: WorkspaceEntry[];
  topicCards: TopicCard[];
};

type SortType = "newest" | "a-z" | "reading";

type PathStat = {
  completed: number;
  total: number;
  nextItem: LearningPathItem | null;
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("nb-NO", { dateStyle: "medium" });
}

function typeLabel(type: EntryType): string {
  switch (type) {
    case "guider":
      return "Guide";
    case "tema":
      return "Tema";
    case "verktoy":
      return "Verktøy";
    case "ordliste":
      return "Ordliste";
    default:
      return "Innhold";
  }
}

function levelLabel(level: LevelType): string {
  if (level === "beginner") return "Nybegynner";
  if (level === "intermediate") return "Viderekommen";
  return "Pro";
}

function compact(text: string): string {
  return text.toLowerCase().trim();
}

function pathCardCta(pathId: LearningPathId, completed: number): string {
  if (pathId === "beginner") return completed === 0 ? "Start Nybegynner-stien" : "Fortsett Nybegynner";
  if (pathId === "intermediate") return completed === 0 ? "Start Viderekommen" : "Fortsett Viderekommen";
  return completed === 0 ? "Start Pro" : "Fortsett Pro";
}

export default function TrainingWorkspace({ counts, entries, topicCards }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [level, setLevel] = useState<LevelType | "all">("all");
  const [topic, setTopic] = useState<string>("all");
  const [audience, setAudience] = useState<string>("all");
  const [tool, setTool] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [selectedPath, setSelectedPath] = useState<LearningPathId>("beginner");

  const [recentOnly, setRecentOnly] = useState(false);
  const [showGlossary, setShowGlossary] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const { mode, setMode } = useMode();
  const { progress, isCompleted } = useKiProgress();
  const { bookmarks } = useBookmarks();
  const { usage } = useUsage();

  const topicOptions = useMemo(
    () => Array.from(new Set(entries.flatMap((item) => item.topics))).sort((a, b) => a.localeCompare(b, "nb-NO")),
    [entries]
  );

  const audienceOptions = useMemo(
    () => Array.from(new Set(entries.flatMap((item) => item.audience))).sort((a, b) => a.localeCompare(b, "nb-NO")),
    [entries]
  );

  const toolOptions = useMemo(
    () => Array.from(new Set(entries.flatMap((item) => item.tools))).sort((a, b) => a.localeCompare(b, "nb-NO")),
    [entries]
  );

  const filteredEntries = useMemo(() => {
    const now = Date.now();
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
    const needle = compact(query);

    const filtered = entries.filter((item) => {
      if (category !== "all" && item.type !== category) return false;
      if (level !== "all" && item.level !== level) return false;
      if (topic !== "all" && !item.topics.includes(topic)) return false;
      if (audience !== "all" && !item.audience.includes(audience)) return false;
      if (tool !== "all" && !item.tools.includes(tool)) return false;
      if (!showGlossary && item.type === "ordliste") return false;

      if (recentOnly) {
        const ts = new Date(item.updatedAt).getTime();
        if (Number.isNaN(ts) || now - ts > fourteenDaysMs) return false;
      }

      if (!needle) return true;

      const haystack = [
        item.title,
        item.description,
        typeLabel(item.type),
        levelLabel(item.level),
        ...item.topics,
        ...item.tools,
        ...item.audience,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });

    filtered.sort((a, b) => {
      if (sortBy === "a-z") return a.title.localeCompare(b.title, "nb-NO");
      if (sortBy === "reading") return a.readingTimeMinutes - b.readingTimeMinutes;

      const aTs = new Date(a.updatedAt).getTime();
      const bTs = new Date(b.updatedAt).getTime();
      return (Number.isNaN(bTs) ? 0 : bTs) - (Number.isNaN(aTs) ? 0 : aTs);
    });

    return filtered;
  }, [entries, category, level, topic, audience, tool, showGlossary, recentOnly, query, sortBy]);

  const latest = useMemo(
    () =>
      [...entries]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [entries]
  );

  const pathStats = useMemo<Record<LearningPathId, PathStat>>(() => {
    const build = (pathId: LearningPathId): PathStat => {
      const items = learningPaths[pathId].items;
      const completed = items.reduce((sum, item) => {
        const key = toEntryKey(item.type, item.slug);
        return sum + (progress.completed[key] ? 1 : 0);
      }, 0);

      const nextItem = items.find((item) => !progress.completed[toEntryKey(item.type, item.slug)]) ?? null;

      return {
        completed,
        total: items.length,
        nextItem,
      };
    };

    return {
      beginner: build("beginner"),
      intermediate: build("intermediate"),
      pro: build("pro"),
    };
  }, [progress.completed]);

  const selectedPathDef = learningPaths[selectedPath];
  const selectedPathStat = pathStats[selectedPath];
  const selectedPathGuideTotal = selectedPathDef.items.filter((item) => item.type === "guide").length;
  const selectedPathGuideCompleted = selectedPathDef.items.reduce((sum, item) => {
    if (item.type !== "guide") return sum;
    return sum + (progress.completed[toEntryKey(item.type, item.slug)] ? 1 : 0);
  }, 0);

  const selectedPathPercent = Math.round((selectedPathStat.completed / Math.max(1, selectedPathStat.total)) * 100);
  const selectedPathNextHref = selectedPathStat.nextItem
    ? toEntryPath(selectedPathStat.nextItem.type, selectedPathStat.nextItem.slug)
    : null;

  const proLocked = pathStats.beginner.completed < 4 || pathStats.intermediate.completed < 4;

  const continueCard = useMemo(() => {
    const last = progress.lastVisited;
    if (!last) return null;

    const key = toEntryKey(last.type, last.slug);
    const entry = entries.find((item) => item.entryKey === key);

    if (entry) {
      return {
        title: entry.title,
        description: entry.description,
        href: entry.url,
        typeLabel: typeLabel(entry.type),
        ts: last.ts,
      };
    }

    return {
      title: `${entryTypeLabel(last.type)}: ${last.slug}`,
      description: "Sist besøkte side er ikke i filtrert indeks, men du kan fortsette direkte.",
      href: toEntryPath(last.type, last.slug),
      typeLabel: entryTypeLabel(last.type),
      ts: last.ts,
    };
  }, [entries, progress.lastVisited]);

  const preferredAudiences = mode === "student" ? ["SMB", "Innholdsprodusent", "Offentlig"] : ["Byrå", "Innholdsprodusent"];

  const quickTasks = useMemo(() => {
    return entries
      .filter((entry) => entry.type === "guider")
      .filter((entry) => entry.audience.some((item) => preferredAudiences.includes(item)))
      .sort((a, b) => {
        const aCompleted = isCompleted(a.entryKey) ? 1 : 0;
        const bCompleted = isCompleted(b.entryKey) ? 1 : 0;
        if (aCompleted !== bCompleted) return aCompleted - bCompleted;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      })
      .slice(0, 6);
  }, [entries, isCompleted, preferredAudiences]);

  const templateCards = useMemo(() => {
    const scored = topTemplateIds
      .map((templateId) => getTemplateById(templateId))
      .filter((template): template is NonNullable<typeof template> => Boolean(template))
      .map((template) => {
        const modeScore = mode === "agency" ? (template.audiences.includes("Byrå") ? 2 : 0) : template.audiences.includes("Innholdsprodusent") || template.audiences.includes("SMB") ? 2 : 0;
        return {
          template,
          score: modeScore,
        };
      })
      .sort((a, b) => b.score - a.score || a.template.title.localeCompare(b.template.title, "nb-NO"));

    return scored.slice(0, 3).map((item) => item.template);
  }, [mode]);

  const bookmarkedEntries = useMemo(() => {
    return entries
      .filter((entry) => bookmarks[entry.entryKey])
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6);
  }, [bookmarks, entries]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_10%,rgba(31,69,121,0.25),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(33,150,243,0.12),transparent_28%),#05070b] text-[#edf2ff]">
      <div className="mx-auto max-w-[1460px] px-3 py-4 sm:px-4 sm:py-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <aside
            className={`rounded-3xl border border-white/10 bg-[#0b1018]/90 p-3 shadow-2xl backdrop-blur transition-all duration-300 lg:sticky lg:top-20 lg:h-[calc(100vh-6.5rem)] lg:overflow-auto ${
              sidebarCollapsed ? "lg:w-[88px]" : "lg:w-[340px]"
            }`}
          >
            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm font-medium hover:bg-white/10"
              aria-expanded={!sidebarCollapsed}
            >
              <span>{sidebarCollapsed ? "Meny" : "Opplæringspanel"}</span>
              <span className="text-xs uppercase tracking-[0.12em] text-white/60">{sidebarCollapsed ? ">" : "<"}</span>
            </button>

            {sidebarCollapsed ? (
              <div className="mt-3 space-y-2">
                <Link href="/ki-opplaring/guider" className="grid place-items-center rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
                  G
                </Link>
                <Link href="/ki-opplaring/tema" className="grid place-items-center rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
                  T
                </Link>
                <Link href="/ki-opplaring/verktoy" className="grid place-items-center rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
                  V
                </Link>
                <Link href="/ki-opplaring/ordliste" className="grid place-items-center rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
                  O
                </Link>
                <Link href="/ki-opplaring/ovelser" className="grid place-items-center rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
                  Ø
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-transparent p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/80">KI Opplæring</p>
                  <h1 className="mt-2 text-[24px] font-semibold leading-[1.06] tracking-tight">Gjør-arbeidsflate</h1>
                  <p className="mt-2 text-sm text-white/70">
                    Lagre progresjon, bruk maler og jobb i korte oppgaver. Dette er ikke en blogg.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-white/60">Totalt</p>
                    <p className="mt-1 text-lg font-semibold">{counts.total}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-white/60">Guider</p>
                    <p className="mt-1 text-lg font-semibold">{counts.guider}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-white/60">Verktøy</p>
                    <p className="mt-1 text-lg font-semibold">{counts.verktoy}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-white/60">Ordliste</p>
                    <p className="mt-1 text-lg font-semibold">{counts.ordliste}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Modus</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setMode("student")}
                      className={`rounded-xl border px-3 py-2 ${
                        mode === "student" ? "border-cyan-300 bg-cyan-300/20" : "border-white/15 bg-black/20"
                      }`}
                    >
                      Elev
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("agency")}
                      className={`rounded-xl border px-3 py-2 ${
                        mode === "agency" ? "border-cyan-300 bg-cyan-300/20" : "border-white/15 bg-black/20"
                      }`}
                    >
                      Byrå
                    </button>
                  </div>
                </div>

                <nav className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <Link href="/ki-opplaring/ovelser" className="rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.08]">
                    Øvelser
                  </Link>
                  <Link href="/ki-opplaring/guider" className="rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.08]">
                    Guider
                  </Link>
                  <Link href="/ki-opplaring/tema" className="rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.08]">
                    Tema
                  </Link>
                  <Link href="/ki-opplaring/verktoy" className="rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.08]">
                    Verktøy
                  </Link>
                </nav>

                <details className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <summary className="cursor-pointer list-none text-sm font-semibold">
                    Avansert meny (sjeldne endringer)
                  </summary>
                  <div className="mt-3 space-y-3 text-sm">
                    <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                      <span>Kun nylig oppdatert (14 dager)</span>
                      <input
                        type="checkbox"
                        checked={recentOnly}
                        onChange={(event) => setRecentOnly(event.target.checked)}
                        className="h-4 w-4 accent-cyan-400"
                      />
                    </label>

                    <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                      <span>Vis ordliste i resultat</span>
                      <input
                        type="checkbox"
                        checked={showGlossary}
                        onChange={(event) => setShowGlossary(event.target.checked)}
                        className="h-4 w-4 accent-cyan-400"
                      />
                    </label>

                    <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                      <span>Kompakt kortvisning</span>
                      <input
                        type="checkbox"
                        checked={compactMode}
                        onChange={(event) => setCompactMode(event.target.checked)}
                        className="h-4 w-4 accent-cyan-400"
                      />
                    </label>
                  </div>
                </details>
              </>
            )}
          </aside>

          <section className="min-w-0 flex-1 space-y-4">
            <header className="rounded-3xl border border-white/10 bg-[#0a0f17]/90 p-4 shadow-2xl backdrop-blur sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">KiReklame · KI Opplæring</p>
                  <h2 className="mt-2 text-[clamp(1.6rem,3.5vw,2.8rem)] font-semibold leading-[1.02] tracking-tight">
                    Hva vil du gjøre med KI nå?
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm text-white/70 sm:text-base">
                    Kopier maler, gjør mikro-oppgaver, huk av sjekklister og fortsett der du slapp.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs sm:flex sm:flex-wrap sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setCategory("all")}
                    className={`rounded-full border px-3 py-1.5 ${category === "all" ? "border-cyan-300 bg-cyan-300/20" : "border-white/15 bg-white/5"}`}
                  >
                    Alle
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory("guider")}
                    className={`rounded-full border px-3 py-1.5 ${category === "guider" ? "border-cyan-300 bg-cyan-300/20" : "border-white/15 bg-white/5"}`}
                  >
                    Guider
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory("tema")}
                    className={`rounded-full border px-3 py-1.5 ${category === "tema" ? "border-cyan-300 bg-cyan-300/20" : "border-white/15 bg-white/5"}`}
                  >
                    Tema
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory("verktoy")}
                    className={`rounded-full border px-3 py-1.5 ${category === "verktoy" ? "border-cyan-300 bg-cyan-300/20" : "border-white/15 bg-white/5"}`}
                  >
                    Verktøy
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory("ordliste")}
                    className={`rounded-full border px-3 py-1.5 ${category === "ordliste" ? "border-cyan-300 bg-cyan-300/20" : "border-white/15 bg-white/5"}`}
                  >
                    Ordliste
                  </button>
                </div>
              </div>
            </header>

            <UsageMeter
              remaining={usage.remaining}
              used={usage.used}
              limit={usage.limit}
              mode={usage.mode}
              status={usage.status}
              className="border-cyan-300/20 bg-[#0a0f17]/90"
            />

            <section className="rounded-3xl border border-white/10 bg-[#0a0f17]/90 p-4 shadow-2xl backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/75">Gjør dette nå</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <Link
                  href="/ki-opplaring/ovelser#forbedre-prompt"
                  className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-3 text-sm font-semibold hover:bg-cyan-300/20"
                >
                  Forbedre prompt
                </Link>
                <Link
                  href="/ki-opplaring/ovelser#lag-10s-manus"
                  className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-3 text-sm font-semibold hover:bg-cyan-300/20"
                >
                  Lag 10s manus
                </Link>
                <Link
                  href="/ki-opplaring/ovelser#darlig-vs-bra"
                  className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-3 text-sm font-semibold hover:bg-cyan-300/20"
                >
                  Dårlig vs bra prompt
                </Link>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-[#0a0f17]/90 p-4 shadow-2xl backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/75">Fortsett der du slapp</p>
                {continueCard ? (
                  <>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-white/50">{continueCard.typeLabel}</p>
                    <h3 className="mt-1 text-lg font-semibold leading-tight">{continueCard.title}</h3>
                    <p className="mt-1 text-sm text-white/70">{continueCard.description}</p>
                    <p className="mt-2 text-xs text-white/50">
                      Sist aktivitet {new Date(continueCard.ts).toLocaleString("nb-NO")}
                    </p>
                    <Link
                      href={continueCard.href}
                      className="mt-3 inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 hover:bg-cyan-300/25"
                    >
                      Fortsett
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-sm text-white/70">Ingen påbegynt aktivitet ennå.</p>
                    <Link
                      href="/ki-opplaring/guider/start-her-ki-i-reklame-2026"
                      className="mt-3 inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 hover:bg-cyan-300/25"
                    >
                      Start her
                    </Link>
                  </>
                )}
              </article>

              <article className="rounded-3xl border border-white/10 bg-[#0a0f17]/90 p-4 shadow-2xl backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/75">Din progresjon</p>
                <h3 className="mt-2 text-lg font-semibold">{learningPaths[selectedPath].title}</h3>
                <p className="mt-1 text-sm text-white/70">{learningPaths[selectedPath].description}</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full bg-cyan-300/70" style={{ width: `${selectedPathPercent}%` }} />
                </div>
                <p className="mt-2 text-sm text-white/75">
                  {selectedPathStat.completed}/{selectedPathStat.total} fullført · {selectedPathGuideCompleted}/{selectedPathGuideTotal} guider fullført i valgt sti
                </p>
                {selectedPathNextHref ? (
                  <Link
                    href={selectedPathNextHref}
                    className="mt-3 inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 hover:bg-cyan-300/25"
                  >
                    Neste steg
                  </Link>
                ) : (
                  <p className="mt-3 text-xs uppercase tracking-[0.12em] text-emerald-200">Sti fullført</p>
                )}
              </article>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0a0f17]/90 p-4 shadow-2xl backdrop-blur sm:p-5">
              <h3 className="text-lg font-semibold">Velg læringssti</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {(Object.keys(learningPaths) as LearningPathId[]).map((pathId) => {
                  const path = learningPaths[pathId];
                  const stat = pathStats[pathId];
                  const locked = pathId === "pro" ? proLocked : false;
                  const nextHref = stat.nextItem ? toEntryPath(stat.nextItem.type, stat.nextItem.slug) : null;

                  return (
                    <article
                      key={pathId}
                      className={`rounded-2xl border p-3 ${
                        selectedPath === pathId ? "border-cyan-300/60 bg-cyan-300/12" : "border-white/15 bg-white/[0.03]"
                      }`}
                    >
                      <p className="text-[11px] uppercase tracking-[0.12em] text-cyan-200/75">{path.title}</p>
                      <p className="mt-1 text-sm text-white/70">{path.description}</p>
                      <p className="mt-2 text-xs text-white/55">{stat.completed}/{stat.total} fullført</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPath(pathId)}
                          className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.12em] hover:bg-black/30"
                        >
                          Vis progresjon
                        </button>
                        {locked ? (
                          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.12em] text-white/60">
                            Lås opp Pro
                          </span>
                        ) : nextHref ? (
                          <Link
                            href={nextHref}
                            className="rounded-full border border-cyan-300/40 bg-cyan-300/15 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyan-100 hover:bg-cyan-300/25"
                          >
                            {pathCardCta(pathId, stat.completed)}
                          </Link>
                        ) : (
                          <span className="rounded-full border border-emerald-300/40 bg-emerald-300/15 px-3 py-1 text-xs uppercase tracking-[0.12em] text-emerald-100">
                            Fullført
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-[#0a0f17]/90 p-4 shadow-2xl backdrop-blur">
                <h3 className="text-lg font-semibold">Maler</h3>
                <div className="mt-3 grid gap-2">
                  {templateCards.map((template) => (
                    <div key={template.id} className="rounded-2xl border border-white/15 bg-white/[0.03] p-3">
                      <p className="text-sm font-semibold">{template.title}</p>
                      <p className="mt-1 text-xs text-white/65">{template.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(template.content);
                            } catch {
                              // no-op
                            }
                          }}
                          className="rounded-full border border-cyan-300/40 bg-cyan-300/15 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyan-100 hover:bg-cyan-300/25"
                        >
                          Kopier mal
                        </button>
                        <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs text-white/60">
                          {template.audiences.join(" · ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-white/10 bg-[#0a0f17]/90 p-4 shadow-2xl backdrop-blur">
                <h3 className="text-lg font-semibold">Oppgaver du kan gjøre nå</h3>
                <div className="mt-3 grid gap-2">
                  {quickTasks.length === 0 ? (
                    <p className="text-sm text-white/70">Ingen oppgaver tilgjengelig med gjeldende modus/filtre.</p>
                  ) : (
                    quickTasks.map((task) => (
                      <div key={`${task.entryKey}-task`} className="rounded-2xl border border-white/15 bg-white/[0.03] p-3">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-cyan-200/75">{levelLabel(task.level)}</p>
                        <p className="mt-1 text-sm font-semibold">{task.title}</p>
                        <p className="mt-1 text-xs text-white/65">{task.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/60">
                          <span className="rounded-full border border-white/20 bg-black/20 px-2 py-0.5">
                            {task.estimatedMinutes ?? Math.max(2, task.readingTimeMinutes)} min
                          </span>
                          <span className="rounded-full border border-white/20 bg-black/20 px-2 py-0.5">
                            {task.exercises ?? 1} øvelse(r)
                          </span>
                          <Link
                            href={task.url}
                            className="rounded-full border border-cyan-300/40 bg-cyan-300/15 px-3 py-0.5 text-xs uppercase tracking-[0.12em] text-cyan-100 hover:bg-cyan-300/25"
                          >
                            Gjør nå
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </article>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0a0f17]/90 p-4 shadow-2xl backdrop-blur sm:p-5">
              <label htmlFor="training-query" className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
                Søk i opplæringsbiblioteket
              </label>
              <input
                id="training-query"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Søk etter guide, begrep, verktøy eller målgruppe"
                className="mt-2 w-full rounded-2xl border border-cyan-300/35 bg-black/30 px-4 py-3 text-base outline-none ring-0 transition placeholder:text-white/40 focus:border-cyan-300"
              />

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <label className="space-y-1 text-xs text-white/60">
                  <span className="uppercase tracking-[0.12em]">Nivå</span>
                  <select
                    value={level}
                    onChange={(event) => setLevel(event.target.value as LevelType | "all")}
                    className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="all">Alle nivå</option>
                    <option value="beginner">Nybegynner</option>
                    <option value="intermediate">Viderekommen</option>
                    <option value="pro">Pro</option>
                  </select>
                </label>

                <label className="space-y-1 text-xs text-white/60">
                  <span className="uppercase tracking-[0.12em]">Tema</span>
                  <select
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="all">Alle tema</option>
                    {topicOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 text-xs text-white/60">
                  <span className="uppercase tracking-[0.12em]">Målgruppe</span>
                  <select
                    value={audience}
                    onChange={(event) => setAudience(event.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="all">Alle målgrupper</option>
                    {audienceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 text-xs text-white/60">
                  <span className="uppercase tracking-[0.12em]">Verktøy</span>
                  <select
                    value={tool}
                    onChange={(event) => setTool(event.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="all">Alle verktøy</option>
                    {toolOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 text-xs text-white/60">
                  <span className="uppercase tracking-[0.12em]">Sorter</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortType)}
                    className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="newest">Sist oppdatert</option>
                    <option value="a-z">A til Å</option>
                    <option value="reading">Kortest lesetid</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/70">
                <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1">
                  {filteredEntries.length} treff
                </span>
                {query ? (
                  <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">Søk: {query}</span>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                    setLevel("all");
                    setTopic("all");
                    setAudience("all");
                    setTool("all");
                    setSortBy("newest");
                  }}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 transition hover:bg-white/10"
                >
                  Nullstill filtre
                </button>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div className="rounded-3xl border border-white/10 bg-[#0a0f17]/90 p-4 shadow-2xl backdrop-blur sm:p-5">
                <h3 className="text-lg font-semibold">Læringsinnhold</h3>
                {filteredEntries.length === 0 ? (
                  <p className="mt-3 rounded-2xl border border-white/15 bg-white/[0.03] p-4 text-sm text-white/65">
                    Ingen treff med valgte filtre. Prøv å fjerne et filter eller søk bredere.
                  </p>
                ) : (
                  <div className={`mt-3 grid gap-3 ${compactMode ? "sm:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1"}`}>
                    {filteredEntries.map((item) => (
                      <article key={item.id} className="rounded-2xl border border-white/15 bg-white/[0.035] p-4 transition hover:bg-white/[0.08]">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.12em] text-cyan-200/75">
                          <span>
                            {typeLabel(item.type)} · {levelLabel(item.level)}
                          </span>
                          <span className="text-white/45">Oppdatert {formatDate(item.updatedAt)}</span>
                        </div>

                        <h4 className="mt-2 text-lg font-semibold leading-tight">{item.title}</h4>
                        <p className="mt-2 text-sm text-white/65">{item.description}</p>

                        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-white/70">
                          {item.topics.slice(0, 2).map((tag) => (
                            <span key={`${item.id}-${tag}`} className="rounded-full border border-white/20 bg-black/20 px-2 py-0.5">
                              {tag}
                            </span>
                          ))}
                          <span className="rounded-full border border-white/20 bg-black/20 px-2 py-0.5">
                            {item.estimatedMinutes ?? item.readingTimeMinutes} min
                          </span>
                          {progress.completed[item.entryKey] ? (
                            <span className="rounded-full border border-emerald-300/40 bg-emerald-300/15 px-2 py-0.5 text-emerald-100">
                              Fullført
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <p className="text-xs text-white/50">
                            {item.audience.length ? item.audience.slice(0, 2).join(" · ") : "Alle målgrupper"}
                          </p>
                          <div className="flex items-center gap-2">
                            <BookmarkButton entryKey={item.entryKey} compact />
                            <Link
                              href={item.url}
                              className="rounded-full border border-cyan-300/40 bg-cyan-300/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-300/20"
                            >
                              Åpne
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
                <div className="rounded-3xl border border-white/10 bg-[#0a0f17]/90 p-4 shadow-2xl backdrop-blur">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200/75">Din liste</h3>
                  {bookmarkedEntries.length === 0 ? (
                    <p className="mt-2 text-sm text-white/65">Ingen lagrede sider ennå. Trykk "Lagre" på kort eller detaljside.</p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {bookmarkedEntries.map((item) => (
                        <li key={`${item.entryKey}-bookmark`}>
                          <Link href={item.url} className="block rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.08]">
                            <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">{typeLabel(item.type)}</p>
                            <p className="mt-1 text-sm font-medium leading-tight">{item.title}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0a0f17]/90 p-4 shadow-2xl backdrop-blur">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200/75">Nylig oppdatert</h3>
                  <ul className="mt-3 space-y-2">
                    {latest.map((item) => (
                      <li key={`${item.id}-latest`}>
                        <Link href={item.url} className="block rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.08]">
                          <p className="text-xs text-white/45">{formatDate(item.updatedAt)}</p>
                          <p className="mt-1 text-sm font-medium leading-tight">{item.title}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0a0f17]/90 p-4 shadow-2xl backdrop-blur">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200/75">Tema-fordeling</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {topicCards.slice(0, 8).map((item) => (
                      <li key={item.topic} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                        <span>{item.topic}</span>
                        <span className="rounded-full border border-white/20 bg-black/20 px-2 py-0.5 text-xs text-white/70">
                          {item.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}
