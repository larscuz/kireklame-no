"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  algorithmCampaignFramework,
  algorithmClaimById,
  algorithmClaims,
  algorithmClaimsByType,
  algorithmConcepts,
  algorithmDiagnostics,
  algorithmPlatformCards,
  algorithmPlaybooks,
  algorithmSourceById,
  algorithmSourceHierarchy,
  algorithmSources,
} from "@/data/norskPrompting/algorithmsKnowledge";
import type { AlgorithmClaim, AlgorithmPlatform, AlgorithmSource } from "@/data/norskPrompting/types";
import InfoHint from "./InfoHint";

const platformLabel: Record<AlgorithmPlatform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  "cross-platform": "På tvers av plattformer",
};

const sourceTypeLabel: Record<AlgorithmSource["source_type"], string> = {
  official_platform: "Offisiell plattform",
  official_research: "Offisiell research",
  academic_paper: "Akademisk forskning",
  editorial: "Redaksjonell",
};

const confidenceLabel: Record<AlgorithmSource["confidence"], string> = {
  high: "Høy tillit",
  medium: "Middels tillit",
  low: "Lav tillit",
};

const claimTypeBadge: Record<AlgorithmClaim["claim_type"], string> = {
  stable: "Stabil",
  volatile: "Volatil",
  myth: "Myte",
  interpretation: "Tolkning",
};

const teachingUseLabel: Record<AlgorithmClaim["teaching_use"], string> = {
  planner: "Planlegging",
  diagnosis: "Diagnose",
  glossary: "Ordliste",
  myth_vs_reality: "Myte vs virkelighet",
};

const platformOptions: Array<{ value: Exclude<AlgorithmPlatform, "cross-platform">; label: string }> = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
];

const mythRealityPairs: Array<{ mythId: string; realityIds: string[] }> = [
  {
    mythId: "clm-200-view-jail-myth",
    realityIds: ["clm-viewer-behavior-matters", "clm-topic-fit-over-follower-count", "clm-diagnose-over-blame"],
  },
  {
    mythId: "clm-hashtag-trick-myth",
    realityIds: ["clm-rec-based-discovery", "clm-campaign-first-thinking"],
  },
  {
    mythId: "clm-followers-are-everything-myth",
    realityIds: ["clm-small-account-can-breakthrough", "clm-trial-reels-non-follower-test"],
  },
];

function sortByReviewedDateDesc(items: AlgorithmClaim[]): AlgorithmClaim[] {
  return items
    .slice()
    .sort((a, b) => new Date(b.last_reviewed_at).getTime() - new Date(a.last_reviewed_at).getTime());
}

function claimSources(claim: AlgorithmClaim): AlgorithmSource[] {
  return claim.source_ids
    .map((sourceId) => algorithmSourceById[sourceId])
    .filter(Boolean);
}

function toNonNegativeNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

function toPercent(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return (numerator / denominator) * 100;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function ClaimEvidence({ claim }: { claim: AlgorithmClaim }) {
  const sources = claimSources(claim);
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {sources.map((source) => (
        <a
          key={`${claim.id}-${source.id}`}
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--muted))] hover:border-zinc-300/35 hover:text-zinc-100"
        >
          Kilde: {source.title}
        </a>
      ))}
    </div>
  );
}

function ClaimCard({ claim }: { claim: AlgorithmClaim }) {
  return (
    <article className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/62 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-zinc-300/30 bg-zinc-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-100">
          {claimTypeBadge[claim.claim_type]}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
          {platformLabel[claim.platform]} · {teachingUseLabel[claim.teaching_use]}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold text-zinc-100">{claim.claim_text}</p>
      <p className="mt-1 text-xs leading-relaxed text-[rgb(var(--muted))]">{claim.plain_language}</p>
      <ClaimEvidence claim={claim} />
    </article>
  );
}

export default function AlgorithmsWorkbench() {
  const stableClaims = sortByReviewedDateDesc(algorithmClaimsByType.stable);
  const volatileClaims = sortByReviewedDateDesc(algorithmClaimsByType.volatile);
  const myths = sortByReviewedDateDesc(algorithmClaimsByType.myth);

  const [plannerPlaybookId, setPlannerPlaybookId] = useState(algorithmPlaybooks[0]?.id ?? "");
  const [plannerPlatform, setPlannerPlatform] = useState<Exclude<AlgorithmPlatform, "cross-platform">>("instagram");
  const [plannerAudience, setPlannerAudience] = useState("VGS-elever (mediefag)");
  const [plannerTopicAngle, setPlannerTopicAngle] = useState("Hvordan små kontoer kan nå ut uten å jage algoritme-mytter");
  const [plannerFormat, setPlannerFormat] = useState("Kort video 9:16");
  const [plannerHook, setPlannerHook] = useState("Kan en konto med 350 følgere fortsatt vinne reach i 2026?");
  const [plannerValueDelivery, setPlannerValueDelivery] = useState(
    "Vis ett konkret eksempel + hvorfor det fungerte gjennom signaler"
  );
  const [plannerRetention, setPlannerRetention] = useState("3 steg: hook → bevis → handling");
  const [plannerCta, setPlannerCta] = useState("Lagre denne sjekklisten og test én variant i dag");
  const [plannerIteration, setPlannerIteration] = useState(
    "Test 3 hook-varianter over 7 dager og evaluer hold/klikk før neste runde"
  );
  const [kpiViews, setKpiViews] = useState("1000");
  const [kpiThreeSecondHolds, setKpiThreeSecondHolds] = useState("430");
  const [kpiTotalWatchSeconds, setKpiTotalWatchSeconds] = useState("11200");
  const [kpiVideoLengthSeconds, setKpiVideoLengthSeconds] = useState("35");
  const [kpiSaves, setKpiSaves] = useState("44");
  const [kpiShares, setKpiShares] = useState("26");

  const kpiSnapshot = useMemo(() => {
    const views = toNonNegativeNumber(kpiViews);
    const threeSecondHolds = toNonNegativeNumber(kpiThreeSecondHolds);
    const totalWatchSeconds = toNonNegativeNumber(kpiTotalWatchSeconds);
    const videoLengthSeconds = Math.max(1, toNonNegativeNumber(kpiVideoLengthSeconds));
    const saves = toNonNegativeNumber(kpiSaves);
    const shares = toNonNegativeNumber(kpiShares);
    const averageWatchSeconds = views > 0 ? totalWatchSeconds / views : 0;
    const averageWatchPercent = toPercent(averageWatchSeconds, videoLengthSeconds);

    return {
      hold3sPercent: toPercent(threeSecondHolds, views),
      averageWatchSeconds,
      averageWatchPercent,
      savesRatePercent: toPercent(saves, views),
      sharesRatePercent: toPercent(shares, views),
    };
  }, [kpiViews, kpiThreeSecondHolds, kpiTotalWatchSeconds, kpiVideoLengthSeconds, kpiSaves, kpiShares]);

  const selectedPlaybook = useMemo(
    () => algorithmPlaybooks.find((playbook) => playbook.id === plannerPlaybookId) ?? algorithmPlaybooks[0],
    [plannerPlaybookId]
  );

  const plannerClaims = useMemo(
    () =>
      (selectedPlaybook?.related_claim_ids ?? [])
        .map((claimId) => algorithmClaimById[claimId])
        .filter(Boolean),
    [selectedPlaybook]
  );

  const [diagnosticId, setDiagnosticId] = useState(algorithmDiagnostics[0]?.id ?? "");
  const [diagnosticContext, setDiagnosticContext] = useState("");
  const selectedDiagnostic = useMemo(
    () => algorithmDiagnostics.find((entry) => entry.id === diagnosticId) ?? algorithmDiagnostics[0],
    [diagnosticId]
  );
  const diagnosticClaims = useMemo(
    () =>
      (selectedDiagnostic?.related_claim_ids ?? [])
        .map((claimId) => algorithmClaimById[claimId])
        .filter(Boolean),
    [selectedDiagnostic]
  );

  const [conceptQuery, setConceptQuery] = useState("");
  const conceptNeedle = conceptQuery.toLowerCase().trim();
  const visibleConcepts = useMemo(() => {
    if (!conceptNeedle) return algorithmConcepts;
    return algorithmConcepts.filter((concept) => {
      return `${concept.term} ${concept.definition_plain} ${concept.definition_technical} ${concept.platform_notes}`
        .toLowerCase()
        .includes(conceptNeedle);
    });
  }, [conceptNeedle]);

  const plannerSteps = [
    { label: "Mål", value: selectedPlaybook?.goal_type ?? "Velg måltype" },
    { label: "Publikum", value: plannerAudience },
    { label: "Temavinkel", value: plannerTopicAngle },
    { label: "Format", value: plannerFormat },
    { label: "Første-frame hook", value: plannerHook },
    { label: "Verdileveranse", value: plannerValueDelivery },
    { label: "Retention-design", value: plannerRetention },
    { label: "CTA", value: plannerCta },
    { label: "Test/iterasjon", value: plannerIteration },
  ];

  const assistantPriorities = useMemo(
    () => [
      {
        title: "Hook som stopper scroll",
        what: plannerHook || "Start med ett tydelig løfte i første sekunder.",
        why: "Høy 3s hold viser om åpningen faktisk fanger interesse.",
      },
      {
        title: "Verdileveranse med tydelig struktur",
        what: plannerValueDelivery || "Lever konkret verdi raskt og bygg videre i steg.",
        why: "Average watch time viser om innholdet oppleves relevant og nyttig.",
      },
      {
        title: "CTA + iterasjon med KPI-styring",
        what: `${plannerCta || "Velg én tydelig handling."} ${plannerIteration || ""}`.trim(),
        why: "Saves og shares viser nytte og spredning, og gir retning for neste test.",
      },
    ],
    [plannerHook, plannerValueDelivery, plannerCta, plannerIteration]
  );

  const assistantSummary = useMemo(() => {
    const platform = platformLabel[plannerPlatform];
    const goal = selectedPlaybook?.goal_type ?? "Kampanjemål";
    const format = plannerFormat || "kortvideo";
    return `For ${plannerAudience || "målgruppen"} på ${platform} anbefaler vi ${format.toLowerCase()} for ${goal.toLowerCase()}. Prioriter tydelig opening, konkret verdi tidlig og en CTA som kan måles og itereres.`;
  }, [plannerAudience, plannerPlatform, plannerFormat, selectedPlaybook]);

  const exportAssistantPdf = () => {
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (!win) return;

    const dateLabel = new Intl.DateTimeFormat("nb-NO", { dateStyle: "long" }).format(new Date());
    const priorityHtml = assistantPriorities
      .map(
        (item, index) =>
          `<li><strong>${index + 1}. ${escapeHtml(item.title)}</strong><br>${escapeHtml(item.what)}<br><em>${escapeHtml(item.why)}</em></li>`
      )
      .join("");
    const kpiHtml = (selectedPlaybook?.success_metrics ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    const stepHtml = plannerSteps
      .map((step, index) => `<li><strong>${index + 1}. ${escapeHtml(step.label)}:</strong> ${escapeHtml(step.value || "")}</li>`)
      .join("");
    const claimHtml = plannerClaims
      .map((claim) => `<li><strong>${escapeHtml(claim.claim_text)}</strong><br>${escapeHtml(claim.plain_language)}</li>`)
      .join("");
    const html = `
      <!doctype html>
      <html lang="nb">
        <head>
          <meta charset="utf-8" />
          <title>Algoritme-assistent eksport</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 32px; color: #111827; line-height: 1.45; }
            h1,h2,h3 { margin: 0 0 10px 0; }
            h1 { font-size: 24px; }
            h2 { font-size: 18px; margin-top: 24px; }
            p { margin: 0 0 12px 0; }
            ol, ul { margin: 0 0 12px 20px; padding: 0; }
            li { margin: 0 0 8px 0; }
            .meta { color: #4b5563; font-size: 13px; margin-bottom: 16px; }
            .panel { border: 1px solid #d1d5db; border-radius: 10px; padding: 14px; margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <h1>Algoritme-assistent: kundeklar plan</h1>
          <p class="meta">Dato: ${escapeHtml(dateLabel)} · Plattform: ${escapeHtml(platformLabel[plannerPlatform])}</p>

          <div class="panel">
            <h2>Kort anbefaling</h2>
            <p>${escapeHtml(assistantSummary)}</p>
          </div>

          <h2>Prioriteter</h2>
          <ol>${priorityHtml}</ol>

          <h2>KPI-fokus</h2>
          <ul>${kpiHtml}</ul>

          <h2>Detaljert plan</h2>
          <ol>${stepHtml}</ol>

          <h2>Evidensbasert begrunnelse</h2>
          <ul>${claimHtml}</ul>
        </body>
      </html>
    `;

    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <section className="order-2 np-node-surface h-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[rgb(var(--muted))]">
            KPI-start (intro)
          </p>
          <InfoHint text="Liten startmodul for å forstå de mest grunnleggende KPI-ene før kampanjeplanlegging." />
        </div>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Brukes for video i Instagram Reels, TikTok, LinkedIn og Facebook. Disse KPI-ene går utover vanity metrics og
          måler oppmerksomhet, kvalitet, nytte og spredning.
        </p>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
              Legg inn tall
            </p>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                Visninger
              </span>
              <input
                value={kpiViews}
                onChange={(event) => setKpiViews(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                Seere som holder i minst 3 sekunder
              </span>
              <input
                value={kpiThreeSecondHolds}
                onChange={(event) => setKpiThreeSecondHolds(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                Total watch time (sekunder)
              </span>
              <input
                value={kpiTotalWatchSeconds}
                onChange={(event) => setKpiTotalWatchSeconds(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                Videolengde (sekunder)
              </span>
              <input
                value={kpiVideoLengthSeconds}
                onChange={(event) => setKpiVideoLengthSeconds(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">Saves</span>
              <input
                value={kpiSaves}
                onChange={(event) => setKpiSaves(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">Shares</span>
              <input
                value={kpiShares}
                onChange={(event) => setKpiShares(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>
          </div>

          <div className="space-y-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">KPI-resultat</p>
            <article className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/75 p-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-zinc-100">3s Hold</p>
              <p className="mt-1 text-sm text-[rgb(var(--fg))]/92">
                {kpiSnapshot.hold3sPercent.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                Måler hook og stop-scroll-effekt i de første sekundene.
              </p>
            </article>

            <article className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/75 p-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-zinc-100">Average Watch Time</p>
              <p className="mt-1 text-sm text-[rgb(var(--fg))]/92">
                {kpiSnapshot.averageWatchSeconds.toFixed(1)}s ({kpiSnapshot.averageWatchPercent.toFixed(1)}% av videolengde)
              </p>
              <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                Måler om innholdet oppleves relevant nok til å bli sett videre.
              </p>
            </article>

            <article className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/75 p-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-zinc-100">Saves</p>
              <p className="mt-1 text-sm text-[rgb(var(--fg))]/92">
                {kpiSnapshot.savesRatePercent.toFixed(2)}% rate per visning
              </p>
              <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                Måler verdi/nytte: innhold som folk vil tilbake til.
              </p>
            </article>

            <article className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/75 p-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-zinc-100">Shares</p>
              <p className="mt-1 text-sm text-[rgb(var(--fg))]/92">
                {kpiSnapshot.sharesRatePercent.toFixed(2)}% rate per visning
              </p>
              <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                Måler spredning og relevans: innhold som folk sender videre.
              </p>
            </article>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
          <table className="min-w-full divide-y divide-[rgb(var(--border))] text-left text-xs">
            <thead className="bg-[rgb(var(--bg))]/75 text-[rgb(var(--muted))]">
              <tr>
                <th className="px-3 py-2 font-semibold uppercase tracking-[0.1em]">KPI</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-[0.1em]">Fokuserer på</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-[0.1em]">Indikerer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--border))] bg-[rgb(var(--card))]/70">
              <tr>
                <td className="px-3 py-2 text-zinc-100">3s Hold</td>
                <td className="px-3 py-2 text-[rgb(var(--muted))]">Hook</td>
                <td className="px-3 py-2 text-[rgb(var(--muted))]">Umiddelbar interesse / stop-scroll-styrke</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-zinc-100">Average Watch Time</td>
                <td className="px-3 py-2 text-[rgb(var(--muted))]">Content depth</td>
                <td className="px-3 py-2 text-[rgb(var(--muted))]">Kvalitet og lengde på engasjement</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-zinc-100">Saves</td>
                <td className="px-3 py-2 text-[rgb(var(--muted))]">Verdi / nytte</td>
                <td className="px-3 py-2 text-[rgb(var(--muted))]">Innhold verdt å vende tilbake til (høy intensjon)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-zinc-100">Shares</td>
                <td className="px-3 py-2 text-[rgb(var(--muted))]">Reach / viralitet</td>
                <td className="px-3 py-2 text-[rgb(var(--muted))]">Høy relevans og delbarhet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="order-3 np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7 xl:col-span-2">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[rgb(var(--muted))]">
            Hvordan discovery fungerer nå
          </p>
          <InfoHint text="Denne modulen er kildebasert. Hver påstand under peker til én eller flere registrerte kilder." />
        </div>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Verktøyet er bygget for å forklare moderne anbefalingslogikk og gjøre den om til praktisk kampanjeplanlegging.
          Fokus er mål, publikum, topic fit, hook, retention, tilfredshet og iterasjon.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {stableClaims.slice(0, 6).map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      </section>

      <section className="order-4 grid gap-3 lg:grid-cols-3 xl:col-span-2">
        {platformOptions.map((platform) => {
          const card = algorithmPlatformCards[platform.value];
          const stable = card.stable_claim_ids.map((claimId) => algorithmClaimById[claimId]).filter(Boolean);
          const volatile = card.volatile_claim_ids.map((claimId) => algorithmClaimById[claimId]).filter(Boolean);
          return (
            <article
              key={platform.value}
              className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[rgb(var(--muted))]">
                {card.title}-kort
              </p>
              <p className="mt-2 text-sm text-[rgb(var(--fg))]/92">{card.summary}</p>

              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.11em] text-zinc-100/90">
                Stabilt å undervise
              </p>
              <ul className="mt-1 space-y-1 text-xs text-[rgb(var(--muted))]">
                {stable.map((claim) => (
                  <li key={claim.id} className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55 px-2 py-1.5">
                    {claim.plain_language}
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.11em] text-zinc-100/90">
                Volatilt (må re-sjekkes)
              </p>
              <ul className="mt-1 space-y-1 text-xs text-[rgb(var(--muted))]">
                {volatile.map((claim) => (
                  <li key={claim.id} className="rounded-lg border border-amber-400/30 bg-amber-400/8 px-2 py-1.5">
                    {claim.plain_language}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <section className="order-1 np-node-surface h-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[rgb(var(--muted))]">
          Algoritme-assistent
        </p>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Bygger på kampanjeplanlegger-rammen: {algorithmCampaignFramework.join(" → ")}.
        </p>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55 p-3">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                Kampanjemål (playbook)
              </span>
              <select
                value={plannerPlaybookId}
                onChange={(event) => {
                  const nextId = event.target.value;
                  setPlannerPlaybookId(nextId);
                  const playbook = algorithmPlaybooks.find((entry) => entry.id === nextId);
                  if (!playbook) return;
                  setPlannerFormat(playbook.recommended_formats[0] ?? "");
                  setPlannerHook(playbook.hook_patterns[0] ?? "");
                  setPlannerRetention(playbook.retention_patterns[0] ?? "");
                  setPlannerCta(playbook.cta_patterns[0] ?? "");
                  setPlannerIteration(
                    `Kjør 3 tester i ${platformLabel[plannerPlatform]} og evaluer: ${playbook.success_metrics.join(", ")}`
                  );
                }}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              >
                {algorithmPlaybooks.map((playbook) => (
                  <option key={playbook.id} value={playbook.id}>
                    {playbook.goal_type}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">Plattform</span>
              <select
                value={plannerPlatform}
                onChange={(event) => setPlannerPlatform(event.target.value as Exclude<AlgorithmPlatform, "cross-platform">)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              >
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">Publikum</span>
              <input
                value={plannerAudience}
                onChange={(event) => setPlannerAudience(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">Temavinkel</span>
              <textarea
                rows={2}
                value={plannerTopicAngle}
                onChange={(event) => setPlannerTopicAngle(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">Format</span>
              <input
                value={plannerFormat}
                onChange={(event) => setPlannerFormat(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">Første-frame hook</span>
              <textarea
                rows={2}
                value={plannerHook}
                onChange={(event) => setPlannerHook(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">Verdileveranse</span>
              <textarea
                rows={2}
                value={plannerValueDelivery}
                onChange={(event) => setPlannerValueDelivery(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">Retention-design</span>
              <textarea
                rows={2}
                value={plannerRetention}
                onChange={(event) => setPlannerRetention(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">CTA</span>
              <input
                value={plannerCta}
                onChange={(event) => setPlannerCta(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">Iterasjonsplan</span>
              <textarea
                rows={2}
                value={plannerIteration}
                onChange={(event) => setPlannerIteration(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>
          </div>

          <div className="space-y-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                Algoritme-assistent (kundeklar)
              </p>
              <button
                type="button"
                onClick={exportAssistantPdf}
                className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-100 hover:border-zinc-300/40"
              >
                Eksporter PDF
              </button>
            </div>

            <article className="rounded-lg border border-emerald-400/30 bg-emerald-400/8 p-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-emerald-200">
                Kort anbefaling til kunde
              </p>
              <p className="mt-1 text-sm text-[rgb(var(--fg))]/92">{assistantSummary}</p>
            </article>

            <article className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/75 p-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                Viktigste prioriteringer nå
              </p>
              <ol className="mt-2 space-y-2">
                {assistantPriorities.map((item, index) => (
                  <li key={item.title} className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55 p-2">
                    <p className="text-xs font-semibold text-zinc-100">
                      {index + 1}. {item.title}
                    </p>
                    <p className="mt-1 text-xs text-[rgb(var(--fg))]/90">{item.what}</p>
                    <p className="mt-1 text-xs text-[rgb(var(--muted))]">{item.why}</p>
                  </li>
                ))}
              </ol>
            </article>

            {selectedPlaybook ? (
              <article className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/75 p-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                  KPI-fokus
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedPlaybook.success_metrics.map((metric) => (
                    <span
                      key={metric}
                      className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--muted))]"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </article>
            ) : null}

            <details className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/75 p-2.5">
              <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                Vis detaljert plan og pedagogisk begrunnelse
              </summary>

              <ol className="mt-3 space-y-2">
                {plannerSteps.map((step, index) => (
                  <li key={step.label} className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55 p-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                      {index + 1}. {step.label}
                    </p>
                    <p className="mt-1 text-sm text-zinc-100">{step.value || "Legg inn verdi"}</p>
                  </li>
                ))}
              </ol>

              {selectedPlaybook ? (
                <article className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-400/8 p-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-emerald-200">
                    Playbook-signaler
                  </p>
                  <p className="mt-1 text-xs text-[rgb(var(--fg))]/90">
                    Publikumsstadium: {selectedPlaybook.audience_stage}
                  </p>
                  <p className="mt-1 text-xs text-[rgb(var(--fg))]/90">
                    Målbare KPI-er: {selectedPlaybook.success_metrics.join(", ")}
                  </p>
                </article>
              ) : null}

              <div className="mt-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                  Relevante evidens-claims
                </p>
                <div className="mt-2 space-y-2">
                  {plannerClaims.map((claim) => (
                    <ClaimCard key={claim.id} claim={claim} />
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className="order-5 np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7 xl:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[rgb(var(--muted))]">
          Diagnose svak ytelse
        </p>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Velg symptom, legg inn kontekst, og få forklaringer som er koblet mot evidensbaserte claims.
        </p>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55 p-3">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">Symptom</span>
              <select
                value={diagnosticId}
                onChange={(event) => setDiagnosticId(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              >
                {algorithmDiagnostics.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.symptom}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-3 block">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                Observasjoner (valgfritt)
              </span>
              <textarea
                rows={5}
                value={diagnosticContext}
                onChange={(event) => setDiagnosticContext(event.target.value)}
                placeholder="Eksempel: 2 400 visninger, 28% faller av innen 2 sekunder, få kommentarer."
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
              />
            </label>
          </div>

          <div className="space-y-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55 p-3">
            {selectedDiagnostic ? (
              <>
                <article className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/75 p-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                    Mulige årsaker
                  </p>
                  <ul className="mt-1 space-y-1 text-sm text-zinc-100">
                    {selectedDiagnostic.likely_causes.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/75 p-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
                    Hva du bør sjekke
                  </p>
                  <ul className="mt-1 space-y-1 text-sm text-zinc-100">
                    {selectedDiagnostic.evidence_based_checks.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-lg border border-emerald-400/30 bg-emerald-400/8 p-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-emerald-200">
                    Neste endringer å teste
                  </p>
                  <ul className="mt-1 space-y-1 text-sm text-[rgb(var(--fg))]/92">
                    {selectedDiagnostic.recommended_changes.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </article>

                {diagnosticContext.trim().length > 0 ? (
                  <p className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]/70 px-2.5 py-2 text-xs text-[rgb(var(--muted))]">
                    Notat lagret i økt: "{diagnosticContext.trim()}"
                  </p>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {diagnosticClaims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      </section>

      <section className="order-6 np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7 xl:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[rgb(var(--muted))]">
          Myte vs virkelighet
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {mythRealityPairs.map((pair) => {
            const myth = algorithmClaimById[pair.mythId];
            const realities = pair.realityIds.map((claimId) => algorithmClaimById[claimId]).filter(Boolean);
            if (!myth) return null;
            return (
              <article key={pair.mythId} className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/58 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-rose-200">Myte</p>
                <p className="mt-1 text-sm font-semibold text-zinc-100">{myth.plain_language}</p>
                <ClaimEvidence claim={myth} />

                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-emerald-200">Virkelighet</p>
                <ul className="mt-1 space-y-1 text-xs text-[rgb(var(--muted))]">
                  {realities.map((claim) => (
                    <li key={claim.id} className="rounded-md border border-emerald-400/25 bg-emerald-400/10 px-2 py-1.5">
                      {claim.plain_language}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {myths.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      </section>

      <section className="order-7 np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7 xl:col-span-2">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[rgb(var(--muted))]">Glossary</p>
          <InfoHint text="Begrepene kan brukes i undervisning, planlegging og kampanjeanalyse." />
        </div>
        <input
          value={conceptQuery}
          onChange={(event) => setConceptQuery(event.target.value)}
          placeholder="Søk etter begrep (f.eks. retention, topic fit, candidate generation)"
          className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 px-3 py-2 text-sm outline-none focus:border-zinc-300"
        />
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {visibleConcepts.map((concept) => (
            <details
              key={concept.id}
              className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/58 p-3"
              open={conceptNeedle.length > 0}
            >
              <summary className="cursor-pointer text-sm font-semibold text-zinc-100">{concept.term}</summary>
              <p className="mt-2 text-xs text-[rgb(var(--muted))]">{concept.definition_plain}</p>
              <p className="mt-1 text-xs text-[rgb(var(--muted))]/90">{concept.definition_technical}</p>
              <p className="mt-1 text-[11px] text-zinc-100/90">Plattformnotat: {concept.platform_notes}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {concept.source_ids.map((sourceId) => {
                  const source = algorithmSourceById[sourceId];
                  if (!source) return null;
                  return (
                    <a
                      key={`${concept.id}-${source.id}`}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[rgb(var(--border))] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--muted))] hover:text-zinc-100"
                    >
                      {source.title}
                    </a>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="order-8 np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7 xl:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[rgb(var(--muted))]">
          Kilderegister og struktur
        </p>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Hver claim er koblet til kilder i datastrukturen. Dette gjør verktøyet oppdaterbart uten å skrive om hele
          produktet.
        </p>

        <article className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
            Kildehierarki
          </p>
          <ol className="mt-1 space-y-1 text-xs text-[rgb(var(--muted))]">
            {algorithmSourceHierarchy.map((layer, index) => (
              <li key={layer}>
                {index + 1}. {layer}
              </li>
            ))}
          </ol>
        </article>

        <div className="mt-3 overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
          <table className="min-w-full divide-y divide-[rgb(var(--border))] text-left text-xs">
            <thead className="bg-[rgb(var(--bg))]/75 text-[rgb(var(--muted))]">
              <tr>
                <th className="px-3 py-2 font-semibold uppercase tracking-[0.1em]">Kilde</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-[0.1em]">Type</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-[0.1em]">Plattform</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-[0.1em]">Status</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-[0.1em]">Sjekket</th>
                <th className="px-3 py-2 font-semibold uppercase tracking-[0.1em]">Tillit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--border))] bg-[rgb(var(--card))]/70">
              {algorithmSources.map((source) => (
                <tr key={source.id}>
                  <td className="px-3 py-2">
                    <a href={source.url} target="_blank" rel="noreferrer" className="font-semibold text-zinc-100 hover:underline">
                      {source.title}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-[rgb(var(--muted))]">{sourceTypeLabel[source.source_type]}</td>
                  <td className="px-3 py-2 text-[rgb(var(--muted))]">{platformLabel[source.platform]}</td>
                  <td className="px-3 py-2 text-[rgb(var(--muted))]">{source.status}</td>
                  <td className="px-3 py-2 text-[rgb(var(--muted))]">{source.checked_at}</td>
                  <td className="px-3 py-2 text-[rgb(var(--muted))]">{confidenceLabel[source.confidence]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          <article className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
              Claims klassifisering
            </p>
            <ul className="mt-1 space-y-1 text-xs text-[rgb(var(--muted))]">
              <li>Stable: {algorithmClaimsByType.stable.length}</li>
              <li>Volatile: {algorithmClaimsByType.volatile.length}</li>
              <li>Myth: {algorithmClaimsByType.myth.length}</li>
              <li>Interpretation: {algorithmClaimsByType.interpretation.length}</li>
            </ul>
          </article>
          <article className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[rgb(var(--muted))]">
              Moduler
            </p>
            <ul className="mt-1 space-y-1 text-xs text-[rgb(var(--muted))]">
              <li>KPI-start (intro)</li>
              <li>How discovery works now</li>
              <li>Instagram / YouTube / TikTok / Facebook / LinkedIn-kort</li>
              <li>Campaign planner</li>
              <li>Diagnose weak performance</li>
              <li>Myth vs reality</li>
              <li>Glossary</li>
            </ul>
            <p className="mt-2 text-xs text-[rgb(var(--muted))]">
              Kombiner med <Link href="/norsk-prompting/marketing-skills/kampanje-assistent" className="underline">Kampanje-assistent</Link> for
              praktiske forslag i sanntid.
            </p>
          </article>
        </div>
      </section>

      <section className="order-9 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-3 text-xs text-[rgb(var(--fg))]/92 xl:col-span-2">
        Dette er en levende kunnskapsmodell. Oppdater `sources` og `claims` jevnlig, og hold volatile påstander i
        review-kø med ny `checked_at`.
      </section>
    </div>
  );
}
