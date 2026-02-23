"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { promptTemplates } from "@/data/norskPrompting/runtime";
import type { PromptLength, PromptOutputType, PromptStyle, PromptDomain } from "@/data/norskPrompting/types";
import {
  buildPrompt,
  getPromptGuidance,
  type BuildPromptInput,
  type GuidanceLevel,
} from "@/lib/norsk-prompting/builder";
import { domainOptions, lengthOptions, outputTypeOptions, styleOptions } from "@/lib/norsk-prompting/constants";
import CopyTextButton from "./CopyTextButton";
import InfoHint from "./InfoHint";

function toOutputType(value: string | null): PromptOutputType {
  if (value === "video" || value === "text") return value;
  return "image";
}

function toDomain(value: string | null): PromptDomain {
  const found = domainOptions.find((item) => item.value === value);
  return found?.value || "film-vfx";
}

function toStyle(value: string | null): PromptStyle {
  const found = styleOptions.find((item) => item.value === value);
  return found?.value || "noktern";
}

function toLength(value: string | null): PromptLength {
  if (value === "kort" || value === "lang") return value;
  return "medium";
}

function toBool(value: string | null, fallback = false): boolean {
  if (value == null) return fallback;
  return value === "1" || value === "true" || value === "ja";
}

function toReferenceIntent(
  value: string | null
): "identitet-logo" | "produktgeometri" | "komposisjon-stil" | "annet" {
  if (value === "identitet-logo" || value === "produktgeometri" || value === "komposisjon-stil" || value === "annet") {
    return value;
  }
  return "identitet-logo";
}

function guidanceBadgeClass(level: GuidanceLevel): string {
  if (level === "anbefalt") {
    return "border-emerald-300/40 bg-emerald-300/15 text-emerald-100";
  }
  if (level === "valgfritt") {
    return "border-amber-300/40 bg-amber-300/15 text-amber-100";
  }
  if (level === "ikke_nodvendig") {
    return "border-zinc-300/35 bg-zinc-300/10 text-zinc-100";
  }
  return "border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 text-[rgb(var(--muted))]";
}

function sameRequest(a: BuildPromptInput, b: BuildPromptInput): boolean {
  return (
    a.input === b.input &&
    a.outputType === b.outputType &&
    a.domain === b.domain &&
    a.style === b.style &&
    a.length === b.length &&
    a.strictness === b.strictness &&
    a.consistency === b.consistency &&
    a.lockRules === b.lockRules &&
    Boolean(a.jsonMode) === Boolean(b.jsonMode) &&
    (a.templateId || "") === (b.templateId || "") &&
    Boolean(a.textInVisual) === Boolean(b.textInVisual) &&
    (a.overlayText || "") === (b.overlayText || "") &&
    (a.overlayLanguage || "") === (b.overlayLanguage || "") &&
    (a.textCase || "behold") === (b.textCase || "behold") &&
    (a.fontHint || "") === (b.fontHint || "") &&
    (a.textPlacement || "") === (b.textPlacement || "") &&
    Boolean(a.useReferenceImage) === Boolean(b.useReferenceImage) &&
    (a.referenceIntent || "identitet-logo") === (b.referenceIntent || "identitet-logo") &&
    (a.referenceNotes || "") === (b.referenceNotes || "") &&
    Boolean(a.useFirstLast) === Boolean(b.useFirstLast) &&
    (a.firstFrame || "") === (b.firstFrame || "") &&
    (a.lastFrame || "") === (b.lastFrame || "")
  );
}

export default function PromptExpanderClient() {
  const searchParams = useSearchParams();
  const queryInput = searchParams.get("input");

  const [input, setInput] = useState(
    queryInput || "En kvinne løper gjennom en travel togstasjon i regn og mister mobilen i en vanndam."
  );
  const [outputType, setOutputType] = useState<PromptOutputType>(toOutputType(searchParams.get("outputType")));
  const [domain, setDomain] = useState<PromptDomain>(toDomain(searchParams.get("domain")));
  const [style, setStyle] = useState<PromptStyle>(toStyle(searchParams.get("style")));
  const [length, setLength] = useState<PromptLength>(toLength(searchParams.get("length")));
  const [strictness, setStrictness] = useState(78);
  const [consistency, setConsistency] = useState(82);
  const [lockRules, setLockRules] = useState(true);
  const [jsonMode, setJsonMode] = useState(false);
  const [templateId, setTemplateId] = useState<string>(searchParams.get("template") || "");
  const [textInVisual, setTextInVisual] = useState<boolean>(toBool(searchParams.get("textInVisual"), false));
  const [overlayText, setOverlayText] = useState(searchParams.get("overlayText") || "");
  const [overlayLanguage, setOverlayLanguage] = useState(searchParams.get("overlayLanguage") || "norsk");
  const [textCase, setTextCase] = useState<"behold" | "store" | "små">(() => {
    const value = searchParams.get("textCase");
    if (value === "store" || value === "små") return value;
    return "behold";
  });
  const [fontHint, setFontHint] = useState(searchParams.get("fontHint") || "");
  const [textPlacement, setTextPlacement] = useState(searchParams.get("textPlacement") || "");
  const [useReferenceImage, setUseReferenceImage] = useState<boolean>(
    toBool(searchParams.get("useReferenceImage"), false)
  );
  const [referenceIntent, setReferenceIntent] = useState<"identitet-logo" | "produktgeometri" | "komposisjon-stil" | "annet">(
    toReferenceIntent(searchParams.get("referenceIntent"))
  );
  const [referenceNotes, setReferenceNotes] = useState(searchParams.get("referenceNotes") || "");
  const [useFirstLast, setUseFirstLast] = useState<boolean>(toBool(searchParams.get("useFirstLast"), false));
  const [firstFrame, setFirstFrame] = useState(searchParams.get("firstFrame") || "");
  const [lastFrame, setLastFrame] = useState(searchParams.get("lastFrame") || "");

  const draftRequest = useMemo<BuildPromptInput>(
    () => ({
      input,
      outputType,
      domain,
      style,
      length,
      strictness,
      consistency,
      lockRules,
      jsonMode,
      templateId: templateId || undefined,
      textInVisual,
      overlayText,
      overlayLanguage,
      textCase,
      fontHint,
      textPlacement,
      useReferenceImage,
      referenceIntent,
      referenceNotes,
      useFirstLast,
      firstFrame,
      lastFrame,
    }),
    [
      input,
      outputType,
      domain,
      style,
      length,
      strictness,
      consistency,
      lockRules,
      jsonMode,
      templateId,
      textInVisual,
      overlayText,
      overlayLanguage,
      textCase,
      fontHint,
      textPlacement,
      useReferenceImage,
      referenceIntent,
      referenceNotes,
      useFirstLast,
      firstFrame,
      lastFrame,
    ]
  );

  const [activeRequest, setActiveRequest] = useState<BuildPromptInput>(draftRequest);
  const result = useMemo(() => buildPrompt(activeRequest), [activeRequest]);
  const guidance = useMemo(() => getPromptGuidance(draftRequest), [draftRequest]);
  const hasDraftChanges = !sameRequest(draftRequest, activeRequest);

  const templateOptions = useMemo(
    () => promptTemplates.filter((template) => template.outputType === outputType),
    [outputType]
  );
  const isVisualOutput = outputType === "image" || outputType === "video";
  const updateButtonId = "np-update-prompt-button";

  useEffect(() => {
    if (outputType !== "video" && useFirstLast) {
      setUseFirstLast(false);
    }
  }, [outputType, useFirstLast]);

  useEffect(() => {
    if (outputType === "text" && useReferenceImage) {
      setUseReferenceImage(false);
    }
  }, [outputType, useReferenceImage]);

  return (
    <section className="np-node-surface rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/92 p-4 pt-7 shadow-[0_18px_60px_rgba(2,6,23,0.3)] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">Prompt-utvider</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Kort norsk input → lang pro-prompt</h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Generatoren bruker interne regler, maler og termbank. Ingen eksterne LLM-kall.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 px-3 py-1 text-xs text-[rgb(var(--muted))]">
          <span className={`h-2 w-2 rounded-full ${hasDraftChanges ? "bg-amber-300" : "bg-emerald-300"}`} />
          {hasDraftChanges ? "Utkast har endringer" : "Oppdatert"}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12 lg:items-start">
        <aside className="space-y-3 lg:col-span-5 xl:col-span-4 2xl:col-span-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7.5rem)] lg:overflow-auto lg:pr-1">
          <div
            className={`rounded-2xl border p-3 ${
              hasDraftChanges
                ? "border-amber-300/45 bg-amber-300/10"
                : "border-[rgb(var(--border))] bg-[rgb(var(--bg))]/55"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
              Oppdatering
            </p>
            <p className="mt-1 text-sm text-[rgb(var(--fg))]/92">
              {hasDraftChanges
                ? "Du har endringer som ikke vises i prompten til høyre ennå."
                : "Prompten til høyre er synkronisert med valgene dine."}
            </p>
            <a
              href={`#${updateButtonId}`}
              className="mt-2 inline-flex items-center rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--muted))] transition hover:border-zinc-300/40 hover:text-zinc-100"
            >
              Gå til oppdater-knapp
            </a>
          </div>
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Kort beskrivelse</p>
              <InfoHint text="Skriv kort hva du vil lage. Hold det konkret: motiv, handling og kontekst." />
            </div>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="mt-2 min-h-28 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3 text-sm shadow-inner outline-none focus:border-zinc-300"
            />
          </div>

          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Produksjonsvalg</p>
              <InfoHint text="Disse valgene styrer struktur, terminologi og hvor stramt prompten bygges." />
            </div>

            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/75 p-1">
              <div className="grid grid-cols-3 gap-1">
                {outputTypeOptions.map((option) => {
                  const active = outputType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setOutputType(option.value)}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        active
                          ? "border border-zinc-300/40 bg-zinc-300/15 text-zinc-100"
                          : "border border-transparent text-[rgb(var(--muted))] hover:border-zinc-300/20 hover:text-zinc-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                <span className="mb-1 flex items-center gap-2">
                  Domene
                  <InfoHint text="Domene styrer ordvalg, kontrollpunkter og fagterminologi i prompten." />
                </span>
                <select
                  value={domain}
                  onChange={(event) => setDomain(event.target.value as PromptDomain)}
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                >
                  {domainOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                <span className="mb-1 flex items-center gap-2">
                  Stil
                  <InfoHint text="Stil justerer tone og estetisk retning uten å endre den tekniske strukturen." />
                </span>
                <select
                  value={style}
                  onChange={(event) => setStyle(event.target.value as PromptStyle)}
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                >
                  {styleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                <span className="mb-1 flex items-center gap-2">
                  Lengde
                  <InfoHint text="Kort gir raskere, enklere prompt. Lang gir mer detaljert produksjonskontroll." />
                </span>
                <select
                  value={length}
                  onChange={(event) => setLength(event.target.value as PromptLength)}
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                >
                  {lengthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                <span className="mb-1 flex items-center gap-2">
                  Mal (valgfritt)
                  <InfoHint text="Velg en mal for ferdig rammestruktur. Automatisk velger best match ut fra outputtype og domene." />
                </span>
                <select
                  value={templateId}
                  onChange={(event) => setTemplateId(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
                >
                  <option value="">Automatisk</option>
                  {templateOptions.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Tekst i bilde/video</p>
              <InfoHint text="Brukes for tekstoverlegg i visuelle leveranser. Når aktivert blir tekstlåsen lagt inn i prompten." />
            </div>

            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
              <span className="mb-1 flex items-center gap-2">
                Skal visuell leveranse inneholde tekst?
                <InfoHint text="Sett til Ja hvis bilde/video skal ha synlig tekst. Sett til Nei for å tvinge tekstfri leveranse." />
              </span>
              <select
                value={textInVisual ? "ja" : "nei"}
                onChange={(event) => setTextInVisual(event.target.value === "ja")}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm normal-case"
              >
                <option value="nei">Nei</option>
                <option value="ja">Ja</option>
              </select>
            </label>

            {!isVisualOutput ? (
              <p className="mt-2 text-xs text-[rgb(var(--muted))]">
                Denne seksjonen brukes når outputtype er satt til Bilde eller Video.
              </p>
            ) : null}

            {textInVisual ? (
              <div className="mt-3 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                  <span className="mb-1 flex items-center gap-2">
                    Eksakt tekst (påkrevd)
                    <InfoHint text="Skriv nøyaktig teksten som skal vises. Denne låses i prompten uten omskriving." />
                  </span>
                  <textarea
                    value={overlayText}
                    onChange={(event) => setOverlayText(event.target.value)}
                    className="mt-1 min-h-20 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-zinc-300"
                    placeholder="Skriv nøyaktig tekst som skal vises."
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                    <span className="mb-1 flex items-center gap-2">
                      Språk
                      <InfoHint text="Språkvalg styrer tekstregel i prompten. Norsk er standard for denne arbeidsflaten." />
                    </span>
                    <select
                      value={overlayLanguage}
                      onChange={(event) => setOverlayLanguage(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm normal-case"
                    >
                      <option value="norsk">Norsk</option>
                      <option value="engelsk">Engelsk (kun eksplisitt)</option>
                      <option value="blandet">Blandet (kun eksplisitt)</option>
                    </select>
                  </label>

                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                    <span className="mb-1 flex items-center gap-2">
                      Case
                      <InfoHint text="Bestemmer om teksten beholdes som skrevet, tvinges til STORE eller små bokstaver." />
                    </span>
                    <select
                      value={textCase}
                      onChange={(event) => setTextCase(event.target.value as "behold" | "store" | "små")}
                      className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm normal-case"
                    >
                      <option value="behold">Behold som skrevet</option>
                      <option value="store">STORE BOKSTAVER</option>
                      <option value="små">små bokstaver</option>
                    </select>
                  </label>

                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                    <span className="mb-1 flex items-center gap-2">
                      Font-type (valgfritt)
                      <InfoHint text="Hint til typografi i visuell rendering, for eksempel grotesk, serif eller condensed." />
                    </span>
                    <input
                      value={fontHint}
                      onChange={(event) => setFontHint(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm normal-case outline-none focus:border-zinc-300"
                      placeholder="Eks: Grotesk sans"
                    />
                  </label>

                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                    <span className="mb-1 flex items-center gap-2">
                      Plassering (valgfritt)
                      <InfoHint text="Hint om hvor teksten skal ligge i rammen, f.eks. øvre venstre eller sentrert nederst." />
                    </span>
                    <input
                      value={textPlacement}
                      onChange={(event) => setTextPlacement(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm normal-case outline-none focus:border-zinc-300"
                      placeholder="Eks: Øvre venstre"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-[rgb(var(--muted))]">
                Utvideren vil legge inn: «Ingen tekst i bildet/videoen.»
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Referanse og first/last</p>
              <InfoHint text="Her får du logisk anbefaling basert på caset ditt. Du kan aktivere låsene direkte i prompten." />
            </div>

            <article className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">Referansebilde</p>
                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${guidanceBadgeClass(guidance.reference.level)}`}>
                  {guidance.reference.title}
                </span>
              </div>
              <p className="mt-2 text-xs text-[rgb(var(--muted))]">{guidance.reference.reason}</p>
              <p className="mt-1 text-xs text-[rgb(var(--muted))]">{guidance.reference.howToUse}</p>

              <div className="mt-3 flex items-center gap-2">
                <label className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 px-3 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={useReferenceImage}
                    onChange={(event) => setUseReferenceImage(event.target.checked)}
                    disabled={!isVisualOutput}
                  />
                  Bruk referansebilde i prompten
                </label>
                <InfoHint text="Aktiver når produkt, logo, tekst eller karakter må være stabil mellom varianter." />
              </div>

              {useReferenceImage ? (
                <div className="mt-3 space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                    <span className="mb-1 flex items-center gap-2">
                      Hva skal låses?
                      <InfoHint text="Velg hva referansen primært skal kontrollere: identitet/logo, geometri eller komposisjon." />
                    </span>
                    <select
                      value={referenceIntent}
                      onChange={(event) => setReferenceIntent(event.target.value as "identitet-logo" | "produktgeometri" | "komposisjon-stil" | "annet")}
                      className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm normal-case"
                    >
                      <option value="identitet-logo">Identitet / logo</option>
                      <option value="produktgeometri">Produktgeometri</option>
                      <option value="komposisjon-stil">Komposisjon / stilretning</option>
                      <option value="annet">Annet</option>
                    </select>
                  </label>

                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                    <span className="mb-1 flex items-center gap-2">
                      Referansenotat (valgfritt)
                      <InfoHint text="Skriv kort hva som må bevares fra referansen, f.eks. etikettplassering eller proporsjoner." />
                    </span>
                    <textarea
                      value={referenceNotes}
                      onChange={(event) => setReferenceNotes(event.target.value)}
                      className="mt-1 min-h-20 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm normal-case outline-none focus:border-zinc-300"
                      placeholder="Eks: Behold etikett, logo-placering og proporsjoner."
                    />
                  </label>
                </div>
              ) : null}
            </article>

            <article className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">First / Last (video)</p>
                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${guidanceBadgeClass(guidance.firstLast.level)}`}>
                  {guidance.firstLast.title}
                </span>
              </div>
              <p className="mt-2 text-xs text-[rgb(var(--muted))]">{guidance.firstLast.reason}</p>
              <p className="mt-1 text-xs text-[rgb(var(--muted))]">{guidance.firstLast.howToUse}</p>

              <div className="mt-3 flex items-center gap-2">
                <label className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 px-3 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={useFirstLast}
                    onChange={(event) => setUseFirstLast(event.target.checked)}
                    disabled={outputType !== "video"}
                  />
                  Bruk first/last-metoden
                </label>
                <InfoHint text="Aktiver når video skal være stabil over tid med definert start- og sluttstatus." />
              </div>

              {outputType !== "video" ? (
                <p className="mt-2 text-xs text-[rgb(var(--muted))]">
                  Bytt outputtype til Video for å aktivere first/last-feltene.
                </p>
              ) : null}

              {outputType === "video" && useFirstLast ? (
                <div className="mt-3 space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                    <span className="mb-1 flex items-center gap-2">
                      First frame
                      <InfoHint text="Beskriv nøyaktig startbilde: motiv, kamera, lys og geometri." />
                    </span>
                    <textarea
                      value={firstFrame}
                      onChange={(event) => setFirstFrame(event.target.value)}
                      className="mt-1 min-h-20 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm normal-case outline-none focus:border-zinc-300"
                      placeholder="Beskriv startbilde: motiv, lys, kamera, geometri."
                    />
                  </label>

                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                    <span className="mb-1 flex items-center gap-2">
                      Last frame
                      <InfoHint text="Beskriv nøyaktig sluttbilde. Dette brukes til å låse overgangsbanen i sekvensen." />
                    </span>
                    <textarea
                      value={lastFrame}
                      onChange={(event) => setLastFrame(event.target.value)}
                      className="mt-1 min-h-20 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm normal-case outline-none focus:border-zinc-300"
                      placeholder="Beskriv sluttbilde: samme identitet, ny sluttposisjon."
                    />
                  </label>
                </div>
              ) : null}
            </article>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Kontrollnivå</p>
              <InfoHint text="Stramhet reduserer tolkning. Konsistens låser kontinuitet mellom elementer og varianter." />
            </div>
            <div className="space-y-3">
              <label className="block text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                  <span className="flex items-center gap-2">
                    Stramhet: {strictness}
                    <InfoHint text="Høy stramhet gir færre tolkninger og mer eksplisitte constraints i prompten." />
                  </span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={strictness}
                  onChange={(event) => setStrictness(Number(event.target.value))}
                  className="mt-2 w-full"
                />
              </label>

              <label className="block text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                  <span className="flex items-center gap-2">
                    Konsistens: {consistency}
                    <InfoHint text="Høy konsistens prioriterer stabilitet i identitet, geometri, lys og objektplassering." />
                  </span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={consistency}
                  onChange={(event) => setConsistency(Number(event.target.value))}
                  className="mt-2 w-full"
                />
              </label>
            </div>
          </div>

          <div
            id="np-update-panel"
            className={`rounded-2xl border p-3 lg:sticky lg:bottom-0 lg:backdrop-blur ${
              hasDraftChanges
                ? "border-amber-300/45 bg-[rgba(120,85,30,0.18)]"
                : "border-[rgb(var(--border))] bg-[rgb(var(--bg))]/72"
            }`}
          >
            <div className="space-y-2 text-sm">
              <div className="inline-flex items-center gap-2">
                <label className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 px-3 py-1">
                  <input type="checkbox" checked={lockRules} onChange={(event) => setLockRules(event.target.checked)} />
                  Regellås
                </label>
                <InfoHint text="Når aktiv vil prompten prioritere regelmotoren sterkere, med tydeligere kontroll- og negativblokker." />
              </div>

              <div className="inline-flex items-center gap-2">
                <label className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 px-3 py-1">
                  <input type="checkbox" checked={jsonMode} onChange={(event) => setJsonMode(event.target.checked)} />
                  JSON-format
                </label>
                <InfoHint
                  align="right"
                  text="JSON-format gir samme innhold i maskinlesbar struktur. Nyttig når prompten skal brukes i automatisering eller scripts."
                />
              </div>
            </div>

            <div className="mt-3">
              <button
                id={updateButtonId}
                type="button"
                onClick={() => setActiveRequest(draftRequest)}
                className="inline-flex w-full items-center justify-center rounded-xl border border-amber-200/45 bg-amber-300/16 px-5 py-2.5 text-sm font-semibold text-zinc-100 shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition hover:bg-amber-300/25 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!hasDraftChanges}
              >
                Oppdater prompt nå
              </button>
              <p className="mt-2 text-xs text-[rgb(var(--muted))]">
                {hasDraftChanges
                  ? "Du har endringer som ikke er aktivert ennå."
                  : "Resultatet er oppdatert med gjeldende valg."}
              </p>
            </div>
          </div>
        </aside>

        <div className="space-y-3 lg:col-span-7 xl:col-span-8 2xl:col-span-9">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 px-2 py-1 uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                {outputTypeOptions.find((option) => option.value === outputType)?.label}
              </span>
              <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 px-2 py-1 uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                {domainOptions.find((option) => option.value === domain)?.label}
              </span>
              <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 px-2 py-1 uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                {styleOptions.find((option) => option.value === style)?.label}
              </span>
              <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 px-2 py-1 uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                {lengthOptions.find((option) => option.value === length)?.label}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-300/30 bg-gradient-to-br from-zinc-500/20 via-zinc-500/5 to-amber-400/12 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">Generert prompt</p>
              <CopyTextButton value={result.prompt} label="Kopier prompt" />
            </div>
            <pre className="mt-3 max-h-[36rem] overflow-auto whitespace-pre-wrap rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 p-3 text-sm text-[rgb(var(--fg))]/90">
              {result.prompt}
            </pre>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Regler brukt</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
                {result.usedRules.map((rule) => (
                  <li key={rule.id}>
                    <p>{rule.name}</p>
                    <p className="mt-0.5 text-xs text-[rgb(var(--muted))]">{rule.description}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Termer injisert</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
                {result.usedTerms.map((term) => (
                  <li key={term.slug}>
                    <p>{term.term_no}</p>
                    <p className="mt-0.5 text-xs text-[rgb(var(--muted))]">{term.promptImpact}</p>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
