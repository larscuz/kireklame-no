"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { postKiExercise, type LlmProviderInfo } from "@/components/ki-opplaring/mdx/exerciseApi";
import WorkshopPassPanel from "@/components/ki-opplaring/WorkshopPassPanel";

type SkillMatch = {
  slug: string;
  relevance_pct: number;
  reasoning: string;
  tips: string[];
  free: boolean;
};

type FocusArea = {
  area: string;
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  free: boolean;
  action: string;
};

type CampaignChatResponse = {
  message: string;
  skills: SkillMatch[];
  focus_areas: FocusArea[];
  follow_up?: string;
};

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  text: string;
  skills?: SkillMatch[];
  focus_areas?: FocusArea[];
  follow_up?: string;
  ts: number;
};

type SkillLookup = {
  slug: string;
  title_no: string;
  name: string;
  category: string;
};

type Props = {
  skillLookup: Record<string, SkillLookup>;
};

const SYMBOLS = {
  bot: "◉",
  user: "◐",
  chat: "◌",
  priority: "⟁",
  plan: "▦",
  skill: "◬",
  follow: "↯",
  free: "◎",
  paid: "◍",
  roi: "✶",
  send: "➤",
} as const;

type CategoryMeta = {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  barColor: string;
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  foundation: {
    label: "Grunnleggende",
    icon: "▣",
    color: "border-slate-400/40",
    bgColor: "bg-slate-400/8",
    textColor: "text-[rgb(var(--fg))]/80",
    barColor: "from-slate-500 to-slate-400",
  },
  strategy: {
    label: "Strategi",
    icon: "⌖",
    color: "border-cyan-400/35",
    bgColor: "bg-cyan-400/8",
    textColor: "text-[rgb(var(--fg))]/80",
    barColor: "from-cyan-500 to-cyan-400",
  },
  content: {
    label: "Innhold",
    icon: "✎",
    color: "border-sky-400/40",
    bgColor: "bg-sky-400/8",
    textColor: "text-[rgb(var(--fg))]/80",
    barColor: "from-sky-500 to-sky-400",
  },
  seo: {
    label: "SEO",
    icon: "⌕",
    color: "border-emerald-400/40",
    bgColor: "bg-emerald-400/8",
    textColor: "text-[rgb(var(--fg))]/80",
    barColor: "from-emerald-500 to-emerald-400",
  },
  paid: {
    label: "Betalt",
    icon: "¤",
    color: "border-amber-400/40",
    bgColor: "bg-amber-400/8",
    textColor: "text-[rgb(var(--fg))]/80",
    barColor: "from-amber-500 to-amber-400",
  },
  cro: {
    label: "CRO",
    icon: "◎",
    color: "border-rose-400/40",
    bgColor: "bg-rose-400/8",
    textColor: "text-[rgb(var(--fg))]/80",
    barColor: "from-rose-500 to-rose-400",
  },
  analytics: {
    label: "Analyse",
    icon: "⌗",
    color: "border-teal-400/35",
    bgColor: "bg-teal-400/8",
    textColor: "text-[rgb(var(--fg))]/80",
    barColor: "from-teal-500 to-teal-400",
  },
  growth: {
    label: "Vekst",
    icon: "↗",
    color: "border-orange-400/40",
    bgColor: "bg-orange-400/8",
    textColor: "text-[rgb(var(--fg))]/80",
    barColor: "from-orange-500 to-orange-400",
  },
  retention: {
    label: "Lojalitet",
    icon: "∞",
    color: "border-fuchsia-400/40",
    bgColor: "bg-fuchsia-400/8",
    textColor: "text-[rgb(var(--fg))]/80",
    barColor: "from-fuchsia-500 to-fuchsia-400",
  },
  sales: {
    label: "Salg",
    icon: "⟢",
    color: "border-lime-400/40",
    bgColor: "bg-lime-400/8",
    textColor: "text-[rgb(var(--fg))]/80",
    barColor: "from-lime-500 to-lime-400",
  },
};

const DEFAULT_CAT: CategoryMeta = {
  label: "Annet",
  icon: "◇",
  color: "border-zinc-400/30",
  bgColor: "bg-zinc-400/8",
  textColor: "text-[rgb(var(--fg))]/80",
  barColor: "from-zinc-500 to-zinc-400",
};

const EFFORT_LABELS: Record<FocusArea["effort"], string> = {
  low: "Lite",
  medium: "Middels",
  high: "Mye",
};

const IMPACT_LABELS: Record<FocusArea["impact"], string> = {
  low: "Lav",
  medium: "Middels",
  high: "Høy",
};

const QUICK_STARTS = [
  "Vi skal lansere en ny nettbutikk for bærekraftige klær",
  "Vi trenger flere leads til B2B SaaS-produktet vårt",
  "Hvordan kan vi øke engasjement på Instagram uten budsjett?",
];

function getCat(category: string): CategoryMeta {
  return CATEGORY_META[category] ?? DEFAULT_CAT;
}

function effortX(effort: FocusArea["effort"]): number {
  if (effort === "low") return 0;
  if (effort === "medium") return 1;
  return 2;
}

function impactY(impact: FocusArea["impact"]): number {
  if (impact === "high") return 0;
  if (impact === "medium") return 1;
  return 2;
}

function scoreFocusArea(area: FocusArea): number {
  const impactScore = area.impact === "high" ? 3 : area.impact === "medium" ? 2 : 1;
  const effortPenalty = area.effort === "high" ? 3 : area.effort === "medium" ? 2 : 1;
  return impactScore - effortPenalty + (area.free ? 1 : 0);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function BriefColumn({
  onUseSuggestion,
}: {
  onUseSuggestion: (value: string) => void;
}) {
  return (
    <aside className="space-y-3 lg:col-span-1">
      <WorkshopPassPanel compact />

      <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/85 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
          Prompt-kompass
        </p>
        <div className="mt-2 space-y-2">
          {[
            { symbol: "①", title: "Mål", hint: "Hva skal kampanjen oppnå?" },
            { symbol: "②", title: "Målgruppe", hint: "Hvem vil du nå?" },
            { symbol: "③", title: "Kanal", hint: "Hvor skal kampanjen distribueres?" },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-[rgb(var(--border))]/55 bg-[rgb(var(--bg))]/65 px-2.5 py-2"
            >
              <p className="text-xs font-semibold text-zinc-100">
                <span className="mr-1 text-[11px] text-cyan-300">{step.symbol}</span>
                {step.title}
              </p>
              <p className="mt-0.5 text-[11px] text-[rgb(var(--muted))]">{step.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/85 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
          Startforslag
        </p>
        <div className="mt-2 space-y-1.5">
          {QUICK_STARTS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onUseSuggestion(suggestion)}
              className="w-full rounded-xl border border-[rgb(var(--border))]/55 bg-[rgb(var(--bg))]/65 px-2.5 py-2 text-left text-[11px] text-[rgb(var(--muted))] transition hover:border-cyan-400/35 hover:bg-cyan-400/8 hover:text-zinc-100"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/85 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
          Symbolnøkkel
        </p>
        <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px] text-[rgb(var(--muted))]">
          <div className="rounded-lg border border-[rgb(var(--border))]/50 bg-[rgb(var(--bg))]/65 px-2 py-1.5">
            {SYMBOLS.free} Gratis
          </div>
          <div className="rounded-lg border border-[rgb(var(--border))]/50 bg-[rgb(var(--bg))]/65 px-2 py-1.5">
            {SYMBOLS.paid} Budsjett
          </div>
          <div className="rounded-lg border border-[rgb(var(--border))]/50 bg-[rgb(var(--bg))]/65 px-2 py-1.5">
            {SYMBOLS.roi} Høy ROI
          </div>
          <div className="rounded-lg border border-[rgb(var(--border))]/50 bg-[rgb(var(--bg))]/65 px-2 py-1.5">
            {SYMBOLS.skill} Ferdighet
          </div>
        </div>
      </section>
    </aside>
  );
}

function PriorityMatrix({ areas }: { areas: FocusArea[] }) {
  const sorted = [...areas].sort((a, b) => scoreFocusArea(b) - scoreFocusArea(a));

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-[rgb(var(--border))]/55 bg-[rgb(var(--bg))]/40 px-3 py-2 text-[11px] text-[rgb(var(--muted))]">
        Ingen prioriteringsdata ennå. Send en melding for å fylle matrisen.
      </div>
    );
  }

  const grid: FocusArea[][][] = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => [])
  );

  for (const area of sorted) {
    grid[impactY(area.impact)][effortX(area.effort)].push(area);
  }

  return (
    <div className="rounded-xl border border-cyan-400/25 bg-[rgb(var(--bg))]/55 p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="text-xs text-[rgb(var(--fg))]/85">{SYMBOLS.priority}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
          Prioriteringsmatrise
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {grid.map((row, yi) =>
          row.map((cell, xi) => {
            const primeZone = yi === 0 && xi === 0;
            return (
              <div
                key={`${yi}-${xi}`}
                className={`min-h-[56px] rounded-lg border p-1 ${
                  primeZone
                    ? "border-emerald-400/40 bg-emerald-400/10"
                    : "border-[rgb(var(--border))]/45 bg-[rgb(var(--bg))]/40"
                }`}
              >
                {cell.length === 0 ? (
                  <span className="text-[9px] text-zinc-500">{primeZone ? `${SYMBOLS.roi} Start` : ""}</span>
                ) : (
                  <div className="space-y-1">
                    {cell.slice(0, 2).map((item) => (
                      <p
                        key={item.area}
                        className={`truncate rounded-md px-1 py-0.5 text-[9px] ${
                          item.free
                            ? "border border-emerald-400/35 bg-emerald-400/10 text-[rgb(var(--fg))]/90"
                            : "border border-amber-400/35 bg-amber-400/10 text-[rgb(var(--fg))]/90"
                        }`}
                      >
                        {item.free ? SYMBOLS.free : SYMBOLS.paid} {item.area}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="mt-1 grid grid-cols-3 gap-1 text-center text-[8px] font-semibold uppercase text-[rgb(var(--muted))]">
        <span>{EFFORT_LABELS.low} innsats</span>
        <span>{EFFORT_LABELS.medium} innsats</span>
        <span>{EFFORT_LABELS.high} innsats</span>
      </div>
    </div>
  );
}

function FocusActionList({ areas }: { areas: FocusArea[] }) {
  if (areas.length === 0) {
    return (
      <div className="rounded-xl border border-[rgb(var(--border))]/55 bg-[rgb(var(--bg))]/40 px-3 py-2 text-[11px] text-[rgb(var(--muted))]">
        Handlingslisten fylles automatisk når assistenten ser nok kontekst.
      </div>
    );
  }

  const sorted = [...areas].sort((a, b) => scoreFocusArea(b) - scoreFocusArea(a)).slice(0, 5);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-zinc-300">{SYMBOLS.plan}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
          Handlingsplan
        </span>
      </div>
      {sorted.map((area, idx) => (
        <div
          key={`${area.area}-${idx}`}
          className={`rounded-lg border px-2.5 py-2 ${
            area.free ? "border-emerald-400/25 bg-emerald-400/8" : "border-amber-400/25 bg-amber-400/8"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[rgb(var(--muted))]">{idx + 1}.</span>
            <p className="min-w-0 truncate text-[11px] font-semibold text-[rgb(var(--fg))]">{area.area}</p>
            <span className="text-[9px] text-[rgb(var(--muted))]">
              {area.free ? SYMBOLS.free : SYMBOLS.paid}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-[rgb(var(--muted))]">
            {IMPACT_LABELS[area.impact]} effekt · {EFFORT_LABELS[area.effort]} innsats
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-[rgb(var(--fg))]/80">{area.action}</p>
        </div>
      ))}
    </div>
  );
}

function SkillPanel({
  skills,
  skillLookup,
}: {
  skills: SkillMatch[];
  skillLookup: Record<string, SkillLookup>;
}) {
  if (skills.length === 0) {
    return (
      <div className="rounded-xl border border-[rgb(var(--border))]/55 bg-[rgb(var(--bg))]/40 px-3 py-2 text-[11px] text-[rgb(var(--muted))]">
        Anbefalte ferdigheter vises her når assistenten har foreslått retning.
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-zinc-300">{SYMBOLS.skill}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
          Anbefalte ferdigheter
        </span>
      </div>
      {skills
        .slice()
        .sort((a, b) => b.relevance_pct - a.relevance_pct)
        .slice(0, 5)
        .map((skill) => {
          const meta = skillLookup[skill.slug];
          const cat = getCat(meta?.category ?? "");
          return (
            <div key={skill.slug} className={`rounded-lg border p-2.5 ${cat.color} ${cat.bgColor}`}>
              <div className="flex items-center gap-2">
                <span className="text-sm">{cat.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-[rgb(var(--fg))]">
                    {meta?.title_no || skill.slug}
                  </p>
                  <p className={`text-[10px] ${cat.textColor}`}>{cat.label}</p>
                </div>
                <span className="text-[10px] font-semibold tabular-nums text-[rgb(var(--fg))]/85">
                  {skill.relevance_pct}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-800/60">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${cat.barColor}`}
                  style={{ width: `${skill.relevance_pct}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[rgb(var(--fg))]/78">{skill.reasoning}</p>
              {meta && (
                <Link
                  href={`/norsk-prompting/marketing-skills/${skill.slug}`}
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[rgb(var(--fg))]/88 hover:underline"
                >
                  Les ferdighet
                  <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          );
        })}
    </div>
  );
}

function AssistantBubble({ msg }: { msg: ChatMsg }) {
  return (
    <div className="flex gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-400/35 bg-cyan-400/12 text-xs text-[rgb(var(--fg))]/90">
        {SYMBOLS.bot}
      </div>
      <div className="min-w-0 max-w-[86%] rounded-2xl rounded-tl-md border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 px-3.5 py-2.5">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[rgb(var(--fg))]/90">{msg.text}</p>
        {msg.follow_up && (
          <p className="mt-2 border-t border-[rgb(var(--border))]/30 pt-2 text-xs italic text-[rgb(var(--fg))]/85">
            {SYMBOLS.follow} {msg.follow_up}
          </p>
        )}
      </div>
    </div>
  );
}

function UserBubble({ msg }: { msg: ChatMsg }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[82%] rounded-2xl rounded-tr-md border border-zinc-300/25 bg-zinc-300/12 px-3.5 py-2.5">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[rgb(var(--fg))]/92">
          <span className="mr-1 text-xs text-zinc-300">{SYMBOLS.user}</span>
          {msg.text}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-400/35 bg-cyan-400/12 text-xs text-[rgb(var(--fg))]/90">
        {SYMBOLS.bot}
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 px-4 py-3">
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300/65" style={{ animationDelay: "0ms" }} />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300/65" style={{ animationDelay: "150ms" }} />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300/65" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

let msgCounter = 0;
function nextId(): string {
  return `msg-${Date.now()}-${++msgCounter}`;
}

export default function CampaignAssistentClient({ skillLookup }: Props) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<LlmProviderInfo | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  const latestAssistantMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === "assistant") return messages[i];
    }
    return null;
  }, [messages]);

  const latestUserMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === "user") return messages[i];
    }
    return null;
  }, [messages]);

  const latestAssistantInsight = useMemo(() => {
    if (!latestAssistantMessage) {
      return {
        message: "",
        focusAreas: [],
        skills: [],
        followUp: undefined,
      };
    }

    return {
      message: latestAssistantMessage.text,
      focusAreas: latestAssistantMessage.focus_areas ?? [],
      skills: latestAssistantMessage.skills ?? [],
      followUp: latestAssistantMessage.follow_up,
    };
  }, [latestAssistantMessage]);

  const canExportStrategy =
    latestAssistantInsight.message.trim().length > 0 ||
    latestAssistantInsight.focusAreas.length > 0 ||
    latestAssistantInsight.skills.length > 0;

  const exportStrategyPdf = () => {
    if (!canExportStrategy) return;

    const win = window.open("", "_blank", "noopener,noreferrer");
    if (!win) return;

    const dateLabel = new Intl.DateTimeFormat("nb-NO", { dateStyle: "long", timeStyle: "short" }).format(new Date());
    const sortedFocusAreas = [...latestAssistantInsight.focusAreas].sort((a, b) => scoreFocusArea(b) - scoreFocusArea(a));
    const sortedSkills = [...latestAssistantInsight.skills].sort((a, b) => b.relevance_pct - a.relevance_pct);

    const focusAreaHtml =
      sortedFocusAreas.length > 0
        ? sortedFocusAreas
            .map(
              (area, index) =>
                `<li><strong>${index + 1}. ${escapeHtml(area.area)}</strong> (${escapeHtml(IMPACT_LABELS[area.impact])} effekt · ${escapeHtml(EFFORT_LABELS[area.effort])} innsats · ${area.free ? "Gratis" : "Budsjett"})<br>${escapeHtml(area.action)}</li>`
            )
            .join("")
        : "<li>Ingen prioriteringsområder generert ennå.</li>";

    const skillsHtml =
      sortedSkills.length > 0
        ? sortedSkills
            .map((skill) => {
              const meta = skillLookup[skill.slug];
              const title = meta?.title_no || skill.slug;
              const tipsHtml =
                skill.tips.length > 0
                  ? `<ul>${skill.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}</ul>`
                  : "";
              return `<li><strong>${escapeHtml(title)}</strong> (${skill.relevance_pct}% relevans)<br>${escapeHtml(skill.reasoning)}${tipsHtml}</li>`;
            })
            .join("")
        : "<li>Ingen ferdighetsforslag generert ennå.</li>";

    const html = `
      <!doctype html>
      <html lang="nb">
        <head>
          <meta charset="utf-8" />
          <title>Kampanje-assistent strategi</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 32px; color: #111827; line-height: 1.45; }
            h1,h2,h3 { margin: 0 0 10px 0; }
            h1 { font-size: 24px; }
            h2 { font-size: 18px; margin-top: 22px; }
            p { margin: 0 0 12px 0; }
            ol, ul { margin: 0 0 12px 20px; padding: 0; }
            li { margin: 0 0 8px 0; }
            .meta { color: #4b5563; font-size: 13px; margin-bottom: 16px; }
            .panel { border: 1px solid #d1d5db; border-radius: 10px; padding: 14px; margin-bottom: 12px; }
            .muted { color: #4b5563; }
          </style>
        </head>
        <body>
          <h1>Kampanje-assistent: Strategiutkast</h1>
          <p class="meta">Generert: ${escapeHtml(dateLabel)}</p>

          ${
            latestUserMessage?.text
              ? `<div class="panel"><h2>Kampanjebeskrivelse</h2><p>${escapeHtml(latestUserMessage.text)}</p></div>`
              : ""
          }

          <div class="panel">
            <h2>Strategisk anbefaling</h2>
            <p>${escapeHtml(latestAssistantInsight.message || "Ingen hovedtekst mottatt.")}</p>
          </div>

          <h2>Prioriterte tiltak</h2>
          <ol>${focusAreaHtml}</ol>

          <h2>Anbefalte ferdigheter</h2>
          <ul>${skillsHtml}</ul>

          ${
            latestAssistantInsight.followUp
              ? `<h2>Oppfølgingsspørsmål</h2><p class="muted">${escapeHtml(latestAssistantInsight.followUp)}</p>`
              : ""
          }
        </body>
      </html>
    `;

    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    setInput("");

    const userMsg: ChatMsg = {
      id: nextId(),
      role: "user",
      text,
      ts: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    const apiMessages = updatedMessages.map((message) => ({
      role: message.role as "user" | "assistant",
      content:
        message.role === "assistant"
          ? JSON.stringify({
              message: message.text,
              skills: message.skills ?? [],
              focus_areas: message.focus_areas ?? [],
              follow_up: message.follow_up,
            })
          : message.text,
    }));

    const response = await postKiExercise<CampaignChatResponse>("campaign_chat", {
      messages: apiMessages,
    });

    setLoading(false);

    if (!response.ok || !response.data) {
      setError(response.error || "Klarte ikke sende melding.");
      return;
    }

    setProvider(response.provider ?? null);

    const assistantMsg: ChatMsg = {
      id: nextId(),
      role: "assistant",
      text: response.data.message,
      skills: response.data.skills?.length ? response.data.skills : undefined,
      focus_areas: response.data.focus_areas?.length ? response.data.focus_areas : undefined,
      follow_up: response.data.follow_up,
      ts: Date.now(),
    };

    setMessages([...updatedMessages, assistantMsg]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[250px_minmax(0,1fr)_320px]">
      <BriefColumn
        onUseSuggestion={(value) => {
          setInput(value);
          inputRef.current?.focus();
        }}
      />

      <section className="flex min-w-0 flex-col rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90">
        <header className="border-b border-[rgb(var(--border))]/60 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
            {SYMBOLS.chat} Samtaleflate
          </p>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Beskriv kampanjen. Assistenten prioriterer gratistiltak og tydelig innsats/effekt.
          </p>
        </header>

        <div
          ref={scrollRef}
          className="min-h-[420px] flex-1 space-y-4 overflow-y-auto p-4"
          style={{ maxHeight: "calc(100vh - 420px)" }}
        >
          {isEmpty && !loading && (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/35 bg-cyan-400/12 text-xl text-[rgb(var(--fg))]/90">
                {SYMBOLS.bot}
              </div>
              <h3 className="text-sm font-semibold text-[rgb(var(--fg))]">Kampanje-assistent klar</h3>
              <p className="max-w-md text-xs leading-relaxed text-[rgb(var(--muted))]">
                Start med mål, målgruppe og kanal. Du får prioritering, handlingsplan og ferdighetsforslag.
              </p>
            </div>
          )}

          {messages.map((msg) =>
            msg.role === "user" ? <UserBubble key={msg.id} msg={msg} /> : <AssistantBubble key={msg.id} msg={msg} />
          )}

          {loading && <TypingIndicator />}

          {error && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-[rgb(var(--fg))]/90">
              {error}
            </div>
          )}
        </div>

        <footer className="border-t border-[rgb(var(--border))]/60 p-3">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isEmpty ? "Beskriv kampanjen din her..." : "Skriv et svar..."}
              disabled={loading}
              rows={1}
              className="min-h-[44px] max-h-28 flex-1 resize-none rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 px-4 py-2.5 text-sm leading-relaxed outline-none placeholder:text-[rgb(var(--muted))]/45 focus:border-cyan-400/45 focus:ring-1 focus:ring-cyan-400/20 disabled:opacity-55"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl border border-cyan-400/45 bg-cyan-400/16 text-sm text-[rgb(var(--fg))]/90 transition hover:bg-cyan-400/26 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-200 border-t-transparent" />
              ) : (
                SYMBOLS.send
              )}
            </button>
          </div>
          {provider && (
            <p className="mt-1 text-[10px] text-[rgb(var(--muted))]">
              {provider.name === "openrouter"
                ? `Motor: OpenRouter (${provider.model})`
                : provider.name === "gemini"
                  ? `Motor: Gemini (${provider.model})`
                  : "Motor: Lokal fallback"}
            </p>
          )}
        </footer>
      </section>

      <aside className="space-y-3 lg:col-span-1">
        <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
              Signalpanel
            </p>
            <button
              type="button"
              onClick={exportStrategyPdf}
              disabled={!canExportStrategy}
              className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--fg))]/88 transition hover:border-cyan-400/35 hover:bg-cyan-400/8 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Eksporter PDF
            </button>
          </div>
          {latestAssistantInsight.followUp ? (
            <p className="mt-2 rounded-lg border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-2 text-[11px] text-[rgb(var(--fg))]/90">
              {SYMBOLS.follow} {latestAssistantInsight.followUp}
            </p>
          ) : (
            <p className="mt-2 text-[11px] text-[rgb(var(--muted))]">
              Oppfølgingsspørsmål vises her når assistenten trenger mer presisjon.
            </p>
          )}
        </section>

        <PriorityMatrix areas={latestAssistantInsight.focusAreas} />
        <FocusActionList areas={latestAssistantInsight.focusAreas} />
        <SkillPanel skills={latestAssistantInsight.skills} skillLookup={skillLookup} />
      </aside>
    </div>
  );
}
