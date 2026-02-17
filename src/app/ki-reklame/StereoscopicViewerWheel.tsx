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

function angularDistanceFromTop(angle: number): number {
  const normalized = mod(angle, 360);
  return Math.min(normalized, 360 - normalized);
}

function shorten(text: string, max = 12): string {
  const value = String(text ?? "").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(1, max - 1))}…`;
}

export default function StereoscopicViewerWheel({ items }: { items: ShowreelItem[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<DragState>({ active: false, startX: 0, startRotation: 0 });
  const smoothSpinTimerRef = useRef<number | null>(null);
  const [scrollRotation, setScrollRotation] = useState(0);
  const [manualRotation, setManualRotation] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [animateSpin, setAnimateSpin] = useState(false);
  const clipSeed = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const count = items.length;
  const step = count > 0 ? 360 / count : 0;
  const rotation = scrollRotation + manualRotation;
  const activeIndex = count > 0 ? mod(Math.round(-rotation / step), count) : 0;
  const activeItem = items[activeIndex] ?? null;
  const wheelLayerStyle = {
    "--reel-radius": "clamp(340px, 52vh, 640px)",
    "--wheel-center-y": "calc(50% + var(--reel-radius))",
  } as CSSProperties;

  function rotateBySteps(steps: number, smooth = true) {
    if (!step) return;
    if (smooth && !reducedMotion) {
      setAnimateSpin(true);
      if (smoothSpinTimerRef.current) {
        window.clearTimeout(smoothSpinTimerRef.current);
      }
      smoothSpinTimerRef.current = window.setTimeout(() => {
        setAnimateSpin(false);
        smoothSpinTimerRef.current = null;
      }, 420);
    } else {
      setAnimateSpin(false);
    }
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
      const start = vh * 0.08;
      const end = Math.max(1, sectionHeight - vh * 0.84);
      const traveled = clamp(start - rect.top, 0, end);
      const progress = clamp(traveled / end, 0, 1);
      const turns = reducedMotion ? 1 : Math.max(2.2, Math.min(8.2, count * 0.48));
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
        rotateBySteps(-1, true);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        rotateBySteps(1, true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count, step]);

  useEffect(
    () => () => {
      if (smoothSpinTimerRef.current) {
        window.clearTimeout(smoothSpinTimerRef.current);
      }
    },
    []
  );

  const ambientMedia = activeItem?.thumbnailUrl || activeItem?.videoUrl || null;

  return (
    <section ref={sectionRef} className="relative min-h-[320vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-[#020611] text-white">
        {ambientMedia ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {activeItem?.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ambientMedia} alt="" className="h-full w-full scale-105 object-cover opacity-32 blur-[4px]" />
            ) : (
              <video
                src={ambientMedia}
                muted
                loop
                autoPlay
                playsInline
                preload="metadata"
                className="h-full w-full scale-105 object-cover opacity-32 blur-[4px]"
              />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(35,71,143,.2),transparent_48%),linear-gradient(180deg,rgba(2,6,14,.3),rgba(2,5,12,.86))]" />
          </div>
        ) : null}

        <div
          className="pointer-events-none absolute left-1/2 top-[var(--wheel-center-y)] h-[max(210vw,210vh)] w-[max(210vw,210vh)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/16 bg-[radial-gradient(circle_at_50%_40%,rgba(13,29,63,.86),rgba(2,6,14,.97)_68%)] shadow-[inset_0_0_0_2px_rgba(255,255,255,.05)]"
          style={wheelLayerStyle}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-[var(--wheel-center-y)] h-[max(190vw,190vh)] w-[max(190vw,190vh)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          style={wheelLayerStyle}
        />

        <div
          className="pointer-events-none absolute left-1/2 top-[var(--wheel-center-y)] h-[max(210vw,210vh)] w-[max(210vw,210vh)] -translate-x-1/2 -translate-y-1/2"
          style={wheelLayerStyle}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: animateSpin ? "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
            }}
          >
            {items.map((item, idx) => {
              const angle = idx * step;
              const absoluteAngle = mod(angle + rotation, 360);
              const distanceFromTop = angularDistanceFromTop(absoluteAngle);
              const showSlot = distanceFromTop <= step * 0.82;
              const playVideo = distanceFromTop <= step * 0.82;
              const z = 2000 - Math.round(distanceFromTop * 10);
              return (
                <article
                  key={`ring-${item.id}`}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(var(--reel-radius) * -1))`,
                    opacity: showSlot ? 1 - distanceFromTop / (step * 0.82) : 0,
                    zIndex: z,
                  }}
                >
                  <div className="h-[min(84vh,920px)] w-[min(96vw,1540px)] overflow-hidden rounded-[clamp(18px,2.8vw,42px)] border border-white/24 bg-black shadow-[0_18px_46px_rgba(0,0,0,.5)]">
                    {playVideo ? (
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
                      <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(189,244,96,.35),rgba(11,26,54,.95))]" />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-[min(84vh,920px)] w-[min(96vw,1540px)] -translate-x-1/2 -translate-y-1/2 rounded-[clamp(18px,2.8vw,42px)] border border-white/26">
          <div
            className="absolute inset-0 rounded-[inherit]"
            style={{
              boxShadow:
                "0 0 0 120vmax rgba(1,4,11,0.82), inset 0 0 0 1px rgba(255,255,255,.16), inset 0 0 120px rgba(0,0,0,.26)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/64 via-transparent to-black/16" />
        </div>

        <div
          className="absolute left-1/2 top-1/2 z-40 h-[min(84vh,920px)] w-[min(96vw,1540px)] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-pan-y active:cursor-grabbing"
          onWheel={(e) => {
            e.preventDefault();
            setAnimateSpin(false);
            setManualRotation((prev) => prev - (e.deltaY + e.deltaX) * 0.11);
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
            setManualRotation(dragRef.current.startRotation + delta * 0.24);
          }}
          onPointerUp={(e) => {
            dragRef.current.active = false;
            setIsDragging(false);
            setManualRotation((prev) => (step ? Math.round(prev / step) * step : prev));
            e.currentTarget.releasePointerCapture(e.pointerId);
          }}
          onPointerCancel={() => {
            dragRef.current.active = false;
            setIsDragging(false);
            setManualRotation((prev) => (step ? Math.round(prev / step) * step : prev));
          }}
        />

        <div className="absolute right-4 top-4 z-50 flex gap-2 md:right-6 md:top-6">
          <button
            type="button"
            onClick={() => rotateBySteps(-1, true)}
            className="rounded-xl border border-white/25 bg-black/45 px-3 py-2 text-sm font-semibold backdrop-blur hover:bg-black/58"
            aria-label="Forrige"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => rotateBySteps(1, true)}
            className="rounded-xl border border-white/25 bg-black/45 px-3 py-2 text-sm font-semibold backdrop-blur hover:bg-black/58"
            aria-label="Neste"
          >
            →
          </button>
        </div>

        {activeItem ? (
          <div className="absolute bottom-4 left-4 z-50 max-w-[min(92vw,720px)] rounded-2xl border border-white/16 bg-black/46 p-4 backdrop-blur md:bottom-6 md:left-6 md:p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/66">{activeItem.eyebrow || "KiReklame"}</p>
            <h2 className="mt-1 text-[clamp(1.2rem,3.2vw,2.5rem)] font-semibold leading-[1.08]">{activeItem.name}</h2>
            {activeItem.description ? <p className="mt-2 text-sm text-white/82 md:text-base">{activeItem.description}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={activeItem.href}
                className="pointer-events-auto inline-flex items-center rounded-xl border border-white/28 bg-black/45 px-3 py-2 text-sm font-semibold hover:bg-black/62"
              >
                {activeItem.ctaLabel || "Åpne case"} <span className="ml-2">&gt;</span>
              </Link>
            </div>
          </div>
        ) : null}

        <aside className="absolute bottom-4 right-4 z-50 w-[min(37vw,260px)] rounded-2xl border border-white/16 bg-black/46 p-2 backdrop-blur md:bottom-6 md:right-6 md:w-[280px] md:p-3">
          <svg viewBox="0 0 100 100" className="w-full" role="presentation">
            <defs>
              {items.map((_, idx) => (
                <clipPath key={`${clipSeed}-clip-${idx}`} id={`${clipSeed}-clip-${idx}`} clipPathUnits="userSpaceOnUse">
                  <rect x={43.4} y={4.9} width={13.2} height={15.4} rx={2.15} ry={2.15} />
                </clipPath>
              ))}
            </defs>

            <circle cx={50} cy={50} r={49.2} className="fill-[#101a33] stroke-white/24" strokeWidth={1.2} />
            <circle cx={50} cy={50} r={31} className="fill-[#0b1328] stroke-white/15" strokeWidth={1} />
            {Array.from({ length: 24 }).map((_, idx) => {
              const angle = (idx * 360) / 24;
              const rad = (angle * Math.PI) / 180;
              const x = 50 + Math.cos(rad) * 46.2;
              const y = 50 + Math.sin(rad) * 46.2;
              return <circle key={`hole-${idx}`} cx={x} cy={y} r={1.15} className="fill-[#d7e4ff]/26" />;
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

          <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-white/70 md:text-xs">
            <span>{isDragging ? "DRAGGING" : "SCROLL / DRAG"}</span>
            <span>{Math.round(scrollProgress * 100)}%</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
