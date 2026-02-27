"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CopyTextButton from "./CopyTextButton";
import type { ExampleShowcaseItem } from "@/data/norskPrompting/exampleShowcase";

type Props = {
  items: ExampleShowcaseItem[];
};

type FilterMode = "all" | "image" | "video";

function promptPreview(value: string, max = 520): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}...`;
}

function shouldShowPlaceholderCaption(item: ExampleShowcaseItem): boolean {
  return item.media.isPlaceholder !== false && item.media.caption.trim().length > 0;
}

function MediaThumb({ item, onOpen }: { item: ExampleShowcaseItem; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = item.media.kind === "video" && Boolean(item.media.src);

  const handleEnter = () => {
    if (!hasVideo) return;
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => undefined);
  };

  const handleLeave = () => {
    if (!hasVideo) return;
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      className="group relative block w-full overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 text-left"
    >
      {item.media.kind === "image" ? (
        <img
          src={item.media.thumbnailSrc ?? item.media.src}
          alt={item.media.alt}
          loading="lazy"
          decoding="async"
          className="aspect-video h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      ) : hasVideo ? (
        <video
          ref={videoRef}
          src={item.media.src}
          poster={item.media.posterSrc ?? item.media.thumbnailSrc}
          muted
          loop
          playsInline
          preload="metadata"
          className="aspect-video h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <img
          src={item.media.thumbnailSrc ?? item.media.posterSrc ?? "/norsk-prompting/examples/eksempel-01-arkitektur.svg"}
          alt={item.media.alt}
          loading="lazy"
          decoding="async"
          className="aspect-video h-full w-full object-cover opacity-90"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
      <div className="absolute left-2 top-2 rounded-full border border-zinc-300/40 bg-black/45 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
        {item.outputType === "video" ? "Video" : "Bilde"}
      </div>
      <div className="absolute bottom-2 right-2 rounded-full border border-zinc-300/40 bg-black/45 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
        Klikk for popup
      </div>
      {item.media.kind === "video" && !item.media.src ? (
        <div className="absolute bottom-2 left-2 rounded-full border border-amber-300/40 bg-amber-300/18 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-50">
          Mangler videofil
        </div>
      ) : null}
    </button>
  );
}

function MediaModal({ item, onClose }: { item: ExampleShowcaseItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/72 p-4" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 text-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-700 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300">{item.modelName}</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">{item.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-600 bg-zinc-800/90 px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white"
          >
            Lukk
          </button>
        </div>

        <div className="max-h-[calc(92vh-4.5rem)] overflow-auto p-4">
          {item.media.kind === "image" ? (
            <img
              src={item.media.src}
              alt={item.media.alt}
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-xl border border-[rgb(var(--border))]"
            />
          ) : item.media.src ? (
            <video
              src={item.media.src}
              poster={item.media.posterSrc ?? item.media.thumbnailSrc}
              controls
              autoPlay
              playsInline
              className="h-auto w-full rounded-xl border border-[rgb(var(--border))] bg-black"
            />
          ) : (
            <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-8 text-sm text-zinc-300">
              Video er ikke lastet opp ennå. Legg inn `media.src` for dette eksemplet når filen er i Cloudflare.
            </div>
          )}

          {shouldShowPlaceholderCaption(item) ? <p className="mt-3 text-sm text-zinc-300">{item.media.caption}</p> : null}
        </div>
      </div>
    </div>
  );
}

export default function ExamplesShowcaseBoard({ items }: Props) {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.outputType === filter);
  }, [filter, items]);

  const activeItem = filteredItems.find((item) => item.id === activeId) ?? items.find((item) => item.id === activeId) ?? null;

  useEffect(() => {
    if (!activeId) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeId]);

  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4 pt-7 text-white shadow-[0_10px_30px_rgba(2,6,23,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Avanserte eksempeloppskrifter</h2>
            <p className="mt-1 text-sm text-zinc-300">
              Prompt til venstre, media til høyre. Video spiller ved hover (når videofil er satt) og åpnes i popup ved klikk.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Alle" },
              { id: "image", label: "Bilde" },
              { id: "video", label: "Video" },
            ].map((option) => {
              const active = option.id === filter;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFilter(option.id as FilterMode)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                    active
                      ? "border-zinc-300/45 bg-zinc-300/18 !text-white"
                      : "border-zinc-600 bg-zinc-800/70 !text-white/85 hover:!text-white"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </article>

      <div className="grid gap-3">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            id={`example-${item.id}`}
            className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4 pt-7 text-white shadow-[0_10px_30px_rgba(2,6,23,0.35)]"
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)] lg:items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-zinc-300/35 bg-zinc-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                    {item.outputType === "video" ? "Video" : "Bilde"}
                  </span>
                  <span className="rounded-full border border-zinc-600 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-zinc-300">
                    {item.modelName}
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-300">{item.shortBrief}</p>
                <p className="mt-2 text-sm text-white">
                  <strong>Hvorfor vanskelig:</strong> {item.challenge}
                </p>

                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300">Mini tutorial</p>
                <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-white">
                  {item.miniTutorial.map((step) => (
                    <li key={`${item.id}-step-${step}`}>{step}</li>
                  ))}
                </ol>

                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300">Prompt (klar til bruk)</p>
                <pre className="mt-1 max-h-52 overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-600 bg-zinc-950 p-3 text-xs text-white">
                  {promptPreview(item.prompt)}
                </pre>

                <div className="mt-2 flex flex-wrap gap-2">
                  <CopyTextButton value={item.prompt} label="Kopier prompt" className="!border-white/35 !bg-white/10 !text-white hover:!bg-white/20" />
                </div>

                <p className="mt-2 text-xs text-zinc-300">Fagbegreper: {item.terms.join(" · ")}</p>
              </div>

              <div className="min-w-0">
                <MediaThumb item={item} onOpen={() => setActiveId(item.id)} />
                {shouldShowPlaceholderCaption(item) ? <p className="mt-2 text-xs text-zinc-300">{item.media.caption}</p> : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {activeItem ? <MediaModal item={activeItem} onClose={() => setActiveId(null)} /> : null}
    </section>
  );
}
