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

const CARD_WIDTH = 320;

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export default function StereoscopicViewerWheel({ items }: { items: ShowreelItem[] }) {
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const drag = useRef<DragState>({ active: false, startX: 0, startRotation: 0 });

  const count = items.length;
  const step = count > 0 ? 360 / count : 0;
  const radius = useMemo(() => {
    if (count <= 2) return 320;
    const raw = (CARD_WIDTH / 2) / Math.tan(Math.PI / count);
    return Math.max(280, Math.min(560, Math.round(raw)));
  }, [count]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion || dragging || hovered || count < 2) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setRotation((prev) => prev + dt * 0.011);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count, dragging, hovered, reducedMotion]);

  const activeIndex = useMemo(() => {
    if (!count) return 0;
    return mod(Math.round(-rotation / step), count);
  }, [count, rotation, step]);
  const active = items[activeIndex] ?? null;

  return (
    <section className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-soft md:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[rgb(var(--muted))]">Showreel wheel</p>
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Stereoscopic Viewer</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRotation((prev) => prev + step)}
            className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm font-semibold hover:opacity-80 transition"
            aria-label="Forrige video"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setRotation((prev) => prev - step)}
            className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm font-semibold hover:opacity-80 transition"
            aria-label="Neste video"
          >
            →
          </button>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,0,0,.03),transparent_45%),radial-gradient(circle_at_10%_10%,rgba(0,0,0,.04),transparent_25%)]" />

        <div
          className="relative mx-auto h-[440px] max-w-[980px] touch-pan-y cursor-grab active:cursor-grabbing"
          style={{ perspective: "1600px", transformStyle: "preserve-3d" }}
          onWheel={(e) => {
            e.preventDefault();
            setRotation((prev) => prev - (e.deltaY + e.deltaX) * 0.09);
          }}
          onPointerDown={(e) => {
            drag.current = {
              active: true,
              startX: e.clientX,
              startRotation: rotation,
            };
            setDragging(true);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current.active) return;
            const delta = e.clientX - drag.current.startX;
            setRotation(drag.current.startRotation + delta * 0.32);
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
          {items.map((item, idx) => {
            const angle = idx * step + rotation;
            const radians = (angle * Math.PI) / 180;
            const frontness = (Math.cos(radians) + 1) / 2;
            const scale = 0.68 + frontness * 0.34;
            const opacity = 0.38 + frontness * 0.62;
            const yTilt = Math.sin(radians) * 7;

            return (
              <article
                key={item.id}
                className="absolute left-1/2 top-1/2 w-[min(78vw,320px)]"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px) rotateY(${-angle}deg) rotateX(${yTilt}deg) scale(${scale})`,
                  opacity,
                  zIndex: Math.round(frontness * 100),
                  transition: dragging ? "none" : "transform 220ms linear, opacity 220ms linear",
                  willChange: "transform, opacity",
                }}
              >
                <Link
                  href={item.href}
                  className="group block overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-soft"
                >
                  <video
                    src={item.videoUrl}
                    className="aspect-[16/9] w-full object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                  />
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold group-hover:underline">{item.name}</p>
                    {item.description ? (
                      <p className="mt-1 max-h-9 overflow-hidden text-xs leading-[1.2rem] text-[rgb(var(--muted))]">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <p className="text-[rgb(var(--muted))]">
          Dra sidelengs eller bruk pilknappene for å spinne hjulet. {items.length} mp4-showreels funnet.
        </p>
        {active ? (
          <Link href={active.href} className="font-semibold underline underline-offset-4 hover:opacity-80">
            Åpne: {active.name}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
