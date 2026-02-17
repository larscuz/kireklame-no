"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type ShowreelItem = {
  id: string;
  name: string;
  href: string;
  videoUrl: string;
  description?: string | null;
};

type DragState = {
  active: boolean;
  startX: number;
  startRotation: number;
};

const MINI_SLOTS = 6;
const LARGE_SLOTS = 8;

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function slotAngle(slot: number, slotCount: number, visualRotation: number): number {
  const step = 360 / slotCount;
  return -90 + slot * step + visualRotation;
}

function itemAt(items: ShowreelItem[], index: number): ShowreelItem | null {
  if (!items.length) return null;
  return items[mod(index, items.length)] ?? null;
}

export default function StereoscopicViewerWheel({ items }: { items: ShowreelItem[] }) {
  const [scrollRotation, setScrollRotation] = useState(0);
  const [manualRotation, setManualRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const drag = useRef<DragState>({ active: false, startX: 0, startRotation: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);
  const rotation = scrollRotation + manualRotation;

  const count = items.length;
  const itemStep = count > 0 ? 360 / count : 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || count < 2) return;
    let raf = 0;

    const update = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionHeight = sectionRef.current.offsetHeight;
      const startOffset = vh * 0.12;
      const endTravel = Math.max(1, sectionHeight - vh * 0.74);
      const traveled = clamp(startOffset - rect.top, 0, endTravel);
      const progress = clamp(traveled / endTravel, 0, 1);
      setScrollProgress(progress);
      const turns = reducedMotion ? 1 : Math.max(1.8, Math.min(6, count / 2.1));
      setScrollRotation(progress * turns * 360);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count, reducedMotion]);

  const wheelState = (slotCount: number) => {
    if (!count || !itemStep) {
      return {
        activeIndex: 0,
        visualRotation: 0,
      };
    }
    const slotStep = 360 / slotCount;
    const unit = rotation / itemStep;
    const snapped = Math.round(unit);
    const fractional = unit - snapped;
    return {
      activeIndex: mod(snapped, count),
      visualRotation: fractional * slotStep,
    };
  };

  const large = useMemo(() => wheelState(LARGE_SLOTS), [count, itemStep, rotation]);
  const mini = useMemo(() => wheelState(MINI_SLOTS), [count, itemStep, rotation]);
  const active = itemAt(items, large.activeIndex);

  return (
    <section ref={sectionRef} className="relative min-h-[210vh]">
      <div className="sticky top-16">
        <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-soft md:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[rgb(var(--muted))]">View-Master wheel</p>
              <h2 className="text-[clamp(1.5rem,2.8vw,2.2rem)] font-semibold tracking-tight">Stereoscopic Showreel</h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Scroll for å spinne hjulet. Bruk pilknappene for finjustering.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative h-36 w-36 shrink-0 rounded-full border border-white/15 bg-[radial-gradient(circle_at_32%_28%,#111f40,#050913_70%)] shadow-[inset_0_0_0_2px_rgba(255,255,255,.04)]">
                {Array.from({ length: MINI_SLOTS }).map((_, slot) => {
                  const item = itemAt(items, mini.activeIndex + slot);
                  if (!item) return null;
                  const angle = slotAngle(slot, MINI_SLOTS, mini.visualRotation);
                  const radians = (angle * Math.PI) / 180;
                  const orbit = 33;
                  const left = 50 + Math.cos(radians) * orbit;
                  const top = 50 + Math.sin(radians) * orbit;
                  return (
                    <div
                      key={`mini-${slot}-${item.id}`}
                      className="absolute h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-black"
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        transform: `translate(-50%, -50%) rotate(${-angle}deg)`,
                      }}
                    >
                      <video
                        src={item.videoUrl}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  );
                })}
                <div className="absolute inset-[34%] rounded-full border border-white/15 bg-[radial-gradient(circle,#0d162f,#02040c)]" />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setManualRotation((prev) => prev - itemStep)}
                  className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm font-semibold hover:opacity-80 transition"
                  aria-label="Forrige video"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setManualRotation((prev) => prev + itemStep)}
                  className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm font-semibold hover:opacity-80 transition"
                  aria-label="Neste video"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div
            className="relative mx-auto aspect-square w-[min(92vw,920px)] touch-pan-y cursor-grab active:cursor-grabbing rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_45%,#112248,#03060d_63%)] shadow-[inset_0_0_0_3px_rgba(255,255,255,.04)]"
            onPointerDown={(e) => {
              drag.current = {
                active: true,
                startX: e.clientX,
                startRotation: manualRotation,
              };
              setDragging(true);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current.active) return;
              const delta = e.clientX - drag.current.startX;
              setManualRotation(drag.current.startRotation + delta * 0.22);
            }}
            onPointerUp={(e) => {
              drag.current.active = false;
              setDragging(false);
              e.currentTarget.releasePointerCapture(e.pointerId);
            }}
            onPointerCancel={() => {
              drag.current.active = false;
              setDragging(false);
            }}
          >
            {Array.from({ length: LARGE_SLOTS }).map((_, slot) => {
              const item = itemAt(items, large.activeIndex + slot);
              if (!item) return null;
              const angle = slotAngle(slot, LARGE_SLOTS, large.visualRotation);
              const radians = (angle * Math.PI) / 180;
              const orbit = 39;
              const left = 50 + Math.cos(radians) * orbit;
              const top = 50 + Math.sin(radians) * orbit;
              return (
                <div
                  key={`large-${slot}-${item.id}`}
                  className="absolute h-[clamp(76px,13vw,150px)] w-[clamp(76px,13vw,150px)] overflow-hidden rounded-full border border-white/20 bg-black shadow-[0_14px_40px_rgba(0,0,0,.38)]"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    transform: `translate(-50%, -50%) rotate(${-angle}deg)`,
                  }}
                >
                  <video
                    src={item.videoUrl}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                </div>
              );
            })}

            {active ? (
              <div className="absolute inset-[22%] overflow-hidden rounded-full border border-white/15 bg-black">
                <video
                  src={active.videoUrl}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-4 bottom-4">
                  <p className="truncate text-sm font-semibold md:text-lg">{active.name}</p>
                  {active.description ? (
                    <p className="mt-1 hidden text-xs text-white/75 md:block">{active.description}</p>
                  ) : null}
                  <Link
                    href={active.href}
                    className="mt-2 inline-flex text-xs font-semibold underline underline-offset-4 md:text-sm"
                  >
                    Åpne case
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-4 space-y-2">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-white/70 transition-[width] duration-150"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="text-[rgb(var(--muted))]">
                {dragging
                  ? "Dra for å rotere manuelt."
                  : "Scroll videre på siden for å navigere gjennom hele hjulet."}{" "}
                {items.length} mp4-showreels funnet.
              </p>
              {active ? (
                <Link href={active.href} className="font-semibold underline underline-offset-4 hover:opacity-80">
                  Åpne: {active.name}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
