"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";

type ShowreelItem = {
  id: string;
  name: string;
  href: string;
  videoUrl: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  eyebrow?: string | null;
  ctaLabel?: string | null;
};

type DragState = {
  active: boolean;
  startX: number;
  startRotation: number;
};

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function shorten(text: string, max = 12): string {
  const value = String(text ?? "").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(1, max - 1))}…`;
}

export default function StereoscopicViewerWheel({ items }: { items: ShowreelItem[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<DragState>({ active: false, startX: 0, startRotation: 0 });
  const [scrollRotation, setScrollRotation] = useState(0);
  const [manualRotation, setManualRotation] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const clipSeed = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const count = items.length;
  const step = count > 0 ? 360 / count : 0;
  const rotation = scrollRotation + manualRotation;
  const activeIndex = count > 0 ? mod(Math.round(-rotation / step), count) : 0;
  const activeItem = items[activeIndex] ?? null;

  function rotateBySteps(steps: number) {
    if (!step) return;
    setManualRotation((prev) => prev - steps * step);
  }

  function moveToIndex(targetIndex: number) {
    if (!count || !step) return;
    const current = activeIndex;
    let delta = targetIndex - current;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    rotateBySteps(delta);
  }

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
      const start = vh * 0.12;
      const end = Math.max(1, sectionHeight - vh * 0.7);
      const traveled = clamp(start - rect.top, 0, end);
      const progress = clamp(traveled / end, 0, 1);
      const turns = reducedMotion ? 1 : Math.max(2, Math.min(7, count * 0.55));
      setScrollProgress(progress);
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

  useEffect(() => {
    if (count < 2) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        rotateBySteps(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        rotateBySteps(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count, step]);

  const ambientMedia = activeItem?.thumbnailUrl || activeItem?.videoUrl || null;

  return (
    <section ref={sectionRef} className="relative min-h-[260vh]">
      <div className="sticky top-14">
        <div
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#060c1c] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,.45)] md:p-6"
          style={
            {
              "--big-wheel-radius": "clamp(170px, 24vw, 330px)",
              "--accent": "#bdf460",
            } as CSSProperties
          }
          data-spin-direction="prev"
        >
          {ambientMedia ? (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {activeItem?.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ambientMedia} alt="" className="h-full w-full scale-110 object-cover opacity-25 blur-[2px]" />
              ) : (
                <video
                  src={ambientMedia}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="h-full w-full scale-110 object-cover opacity-25 blur-[2px]"
                />
              )}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(18,44,89,.36),transparent_45%),linear-gradient(180deg,rgba(5,8,16,.34),rgba(3,6,12,.95))]" />
            </div>
          ) : null}

          <div className="relative">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">Showreel wheel</p>
                <h2 className="text-[clamp(1.35rem,2.4vw,2rem)] font-semibold tracking-tight">View-Master Navigator</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => rotateBySteps(-1)}
                  className="rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm font-semibold backdrop-blur hover:bg-black/40"
                  aria-label="Forrige"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => rotateBySteps(1)}
                  className="rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm font-semibold backdrop-blur hover:bg-black/40"
                  aria-label="Neste"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid items-center gap-5 lg:grid-cols-[1fr_280px]">
              <section
                className="relative h-[min(84vw,760px)] w-full cursor-grab touch-pan-y overflow-visible active:cursor-grabbing"
                onWheel={(e) => {
                  e.preventDefault();
                  rotateBySteps((e.deltaY + e.deltaX) / 120);
                }}
                onPointerDown={(e) => {
                  dragRef.current = {
                    active: true,
                    startX: e.clientX,
                    startRotation: manualRotation,
                  };
                  setIsDragging(true);
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (!dragRef.current.active) return;
                  const delta = e.clientX - dragRef.current.startX;
                  setManualRotation(dragRef.current.startRotation + delta * 0.2);
                }}
                onPointerUp={(e) => {
                  dragRef.current.active = false;
                  setIsDragging(false);
                  e.currentTarget.releasePointerCapture(e.pointerId);
                }}
                onPointerCancel={() => {
                  dragRef.current.active = false;
                  setIsDragging(false);
                }}
              >
                <div className="absolute left-1/2 top-1/2 h-[min(84vw,760px)] w-[min(84vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_42%,rgba(17,35,74,.72),rgba(2,6,12,.94)_66%)] shadow-[inset_0_0_0_2px_rgba(255,255,255,.04)]" />
                <div
                  className="absolute left-1/2 top-1/2 h-[min(84vw,760px)] w-[min(84vw,760px)] -translate-x-1/2 -translate-y-1/2"
                  style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
                >
                  {items.map((item, idx) => {
                    const rawDist = Math.abs(idx - activeIndex);
                    const dist = Math.min(rawDist, count - rawDist);
                    const isActive = dist === 0;
                    const angle = idx * step;
                    const scale = isActive ? 1.02 : dist === 1 ? 0.84 : dist === 2 ? 0.68 : 0.56;
                    const opacity = isActive ? 1 : dist === 1 ? 0.9 : dist === 2 ? 0.72 : 0.5;
                    const z = 100 - dist;

                    return (
                      <article
                        key={item.id}
                        className="absolute left-1/2 top-1/2"
                        aria-hidden={!isActive}
                        style={{
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(var(--big-wheel-radius) * -1))`,
                          opacity,
                          zIndex: z,
                          pointerEvents: isActive ? "auto" : "none",
                        }}
                      >
                        <div
                          className="overflow-hidden rounded-3xl border border-white/20 bg-[#05090f] shadow-[0_20px_60px_rgba(0,0,0,.45)]"
                          style={{
                            width: isActive ? "clamp(270px, 56vw, 640px)" : "clamp(150px, 27vw, 340px)",
                            height: isActive ? "clamp(310px, 52vw, 530px)" : "clamp(180px, 30vw, 330px)",
                            transform: `rotate(${-angle}deg) scale(${scale})`,
                            transformOrigin: "center center",
                            transition: isDragging ? "none" : "transform 320ms ease, opacity 320ms ease",
                          }}
                        >
                          <div className="relative h-full w-full">
                            {isActive ? (
                              <video
                                src={item.videoUrl}
                                muted
                                loop
                                autoPlay
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-cover"
                              />
                            ) : item.thumbnailUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.thumbnailUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                            ) : (
                              <video
                                src={item.videoUrl}
                                muted
                                loop
                                autoPlay
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-cover opacity-80"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                            <div className="absolute inset-x-4 bottom-4">
                              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">
                                {item.eyebrow || "KiReklame"}
                              </p>
                              <h3 className={`${isActive ? "text-2xl md:text-[2rem]" : "text-sm md:text-base"} mt-1 font-semibold leading-[1.1]`}>
                                {item.name}
                              </h3>
                              {item.description ? (
                                <p className={`mt-1 text-white/78 ${isActive ? "text-sm md:text-base" : "text-[11px] md:text-xs"}`}>
                                  {item.description}
                                </p>
                              ) : null}
                              {isActive ? (
                                <div className="mt-3 flex gap-2">
                                  <Link
                                    href={item.href}
                                    className="inline-flex items-center rounded-xl border border-white/25 bg-black/35 px-3 py-2 text-sm font-semibold backdrop-blur hover:bg-black/50"
                                  >
                                    {item.ctaLabel || "Åpne case"} <span className="ml-2">&gt;</span>
                                  </Link>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <aside className="mx-auto w-full max-w-[280px] lg:mx-0" aria-label="Wheel progress">
                <div className="rounded-3xl border border-white/15 bg-black/25 p-3 backdrop-blur">
                  <svg viewBox="0 0 100 100" className="w-full" role="presentation">
                    <defs>
                      {items.map((_, idx) => (
                        <clipPath key={`${clipSeed}-clip-${idx}`} id={`${clipSeed}-clip-${idx}`} clipPathUnits="userSpaceOnUse">
                          <rect x={43.4} y={4.9} width={13.2} height={15.4} rx={2.15} ry={2.15} />
                        </clipPath>
                      ))}
                    </defs>

                    <circle cx={50} cy={50} r={49.2} className="fill-[#101a33] stroke-white/20" strokeWidth={1.2} />
                    <circle cx={50} cy={50} r={31} className="fill-[#0b1328] stroke-white/15" strokeWidth={1} />
                    {Array.from({ length: 24 }).map((_, idx) => {
                      const angle = (idx * 360) / 24;
                      const rad = (angle * Math.PI) / 180;
                      const x = 50 + Math.cos(rad) * 46.2;
                      const y = 50 + Math.sin(rad) * 46.2;
                      return <circle key={`hole-${idx}`} cx={x} cy={y} r={1.2} className="fill-[#d7e4ff]/25" />;
                    })}

                    {items.map((item, idx) => {
                      const angle = idx * step + rotation;
                      const isActive = idx === activeIndex;
                      const thumb = item.thumbnailUrl;

                      return (
                        <g
                          key={`thumb-${item.id}`}
                          transform={`rotate(${angle} 50 50)`}
                          role="button"
                          tabIndex={0}
                          aria-label={item.name}
                          onClick={() => moveToIndex(idx)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              moveToIndex(idx);
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <rect x={48.6} y={0.85} width={2.8} height={5.65} rx={0.64} ry={0.64} className="fill-white/40" />
                          <rect
                            x={42.9}
                            y={4.4}
                            width={14.2}
                            height={16.4}
                            rx={2.6}
                            ry={2.6}
                            className={isActive ? "fill-[#c6f67d] stroke-[#f7ffe3]" : "fill-[#141f3d] stroke-white/30"}
                            strokeWidth={0.6}
                          />
                          {thumb ? (
                            <image
                              href={thumb}
                              x={43.4}
                              y={4.9}
                              width={13.2}
                              height={15.4}
                              preserveAspectRatio="xMidYMid slice"
                              clipPath={`url(#${clipSeed}-clip-${idx})`}
                            />
                          ) : (
                            <rect
                              x={43.4}
                              y={4.9}
                              width={13.2}
                              height={15.4}
                              rx={2.15}
                              ry={2.15}
                              className={isActive ? "fill-[#bdf460]" : "fill-[#1b2a51]"}
                            />
                          )}
                          <rect x={43.4} y={4.9} width={13.2} height={15.4} rx={2.15} ry={2.15} className="fill-transparent stroke-white/30" strokeWidth={0.5} />
                          <text x={50} y={29.4} textAnchor="middle" className="fill-white/80 text-[4px] tracking-[0.04em]">
                            {shorten(item.name, 7)}
                          </text>
                        </g>
                      );
                    })}

                    <circle cx={50} cy={50} r={16.2} className="fill-[#121f40] stroke-white/15" strokeWidth={0.8} />
                    <circle cx={50} cy={50} r={2.3} className="fill-white/60" />
                    <text x={50} y={45.8} textAnchor="middle" className="fill-white/70 text-[3.4px] tracking-[0.08em] uppercase">
                      KiReklame
                    </text>
                    <text x={50} y={51.8} textAnchor="middle" className="fill-white text-[4.2px] font-semibold">
                      {shorten(activeItem?.name ?? "Showreel", 20)}
                    </text>
                    <text x={50} y={57.1} textAnchor="middle" className="fill-white/75 text-[3.8px]">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                    </text>
                  </svg>

                  <p className="mt-2 text-center text-xs text-white/65">Scroll, swipe eller bruk piltaster</p>
                </div>
              </aside>
            </div>

            <div className="mt-4 space-y-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/12">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-150"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className="text-white/70">
                  {isDragging ? "Dra sideveis for å spinne manuelt." : "Scroll nedover for å navigere gjennom stor wheel."}
                </p>
                {activeItem ? (
                  <Link href={activeItem.href} className="font-semibold underline underline-offset-4 hover:text-[var(--accent)]">
                    Åpne: {activeItem.name}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
