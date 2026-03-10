"use client";

import { useEffect, useId, useRef, useState } from "react";

type TrailPoint = {
  x: number;
  y: number;
  t: number;
};

type TrailRenderState = {
  visible: boolean;
  tailPath: string;
  headPath: string;
  headX: number;
  headY: number;
};

const TRAIL_LIFETIME_MS = 360;
const HEAD_WINDOW_MS = 105;
const STALE_HIDE_MS = 700;
const MIN_POINT_DISTANCE_PX = 0.75;

function buildSmoothPath(points: TrailPoint[]): string {
  if (points.length < 2) return "";
  if (points.length === 2) {
    const [a, b] = points;
    return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} L ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
  }

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    const mx = (current.x + next.x) / 2;
    const my = (current.y + next.y) / 2;
    d += ` Q ${current.x.toFixed(2)} ${current.y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
  }

  const penultimate = points[points.length - 2];
  const last = points[points.length - 1];
  d += ` Q ${penultimate.x.toFixed(2)} ${penultimate.y.toFixed(2)} ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

export default function HyperdriveTransition() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [trail, setTrail] = useState<TrailRenderState>({
    visible: false,
    tailPath: "",
    headPath: "",
    headX: 0,
    headY: 0,
  });

  const pointsRef = useRef<TrailPoint[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const hasPointerRef = useRef(false);
  const lastMoveRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const idPrefix = useId().replace(/:/g, "");

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasFinePointer || prefersReducedMotion) return;

    setIsEnabled(true);

    const pushPoint = (x: number, y: number, now: number) => {
      const points = pointsRef.current;
      const last = points[points.length - 1];

      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        if (dx * dx + dy * dy < MIN_POINT_DISTANCE_PX * MIN_POINT_DISTANCE_PX) {
          last.x = x;
          last.y = y;
          last.t = now;
          return;
        }
      }

      points.push({ x, y, t: now });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;

      const now = performance.now();
      const x = event.clientX;
      const y = event.clientY;

      pointerRef.current = { x, y };
      lastMoveRef.current = now;
      hasPointerRef.current = true;
      pushPoint(x, y, now);
    };

    const handlePointerLeave = () => {
      hasPointerRef.current = false;
    };

    const animate = () => {
      const now = performance.now();
      const points = pointsRef.current;
      const cutoff = now - TRAIL_LIFETIME_MS;

      while (points.length > 0 && points[0].t < cutoff) {
        points.shift();
      }

      if (!hasPointerRef.current && now - lastMoveRef.current > STALE_HIDE_MS) {
        points.length = 0;
      }

      if (points.length < 2) {
        setTrail((previous) =>
          previous.visible
            ? {
                visible: false,
                tailPath: "",
                headPath: "",
                headX: previous.headX,
                headY: previous.headY,
              }
            : previous,
        );
        rafRef.current = window.requestAnimationFrame(animate);
        return;
      }

      const headCutoff = now - HEAD_WINDOW_MS;
      const headPoints = points.filter((point) => point.t >= headCutoff);
      const safeHeadPoints = headPoints.length >= 2 ? headPoints : points.slice(-3);
      const head = points[points.length - 1];
      const tailPath = buildSmoothPath(points);
      const headPath = buildSmoothPath(safeHeadPoints);

      setTrail((previous) => {
        if (
          previous.visible &&
          previous.tailPath === tailPath &&
          previous.headPath === headPath &&
          previous.headX === head.x &&
          previous.headY === head.y
        ) {
          return previous;
        }

        return {
          visible: true,
          tailPath,
          headPath,
          headX: head.x,
          headY: head.y,
        };
      });

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      pointsRef.current = [];
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, []);

  if (!isEnabled) return null;

  const trailGlowId = `${idPrefix}-trail-glow`;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 select-none" aria-hidden>
      <svg className={`h-full w-full transition-opacity duration-150 ${trail.visible ? "opacity-100" : "opacity-0"}`}>
        <defs>
          <filter id={trailGlowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#${trailGlowId})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={trail.tailPath} stroke="#67e8f9" strokeWidth="3.2" strokeOpacity="0.1" />
          <path d={trail.tailPath} stroke="#7dd3fc" strokeWidth="2.1" strokeOpacity="0.2" />
          <path d={trail.tailPath} stroke="#bae6fd" strokeWidth="1.3" strokeOpacity="0.35" />
          <path d={trail.headPath} stroke="#f8fafc" strokeWidth="1.6" strokeOpacity="0.92" />
        </g>

        <circle cx={trail.headX} cy={trail.headY} r="1.7" fill="#f8fafc" fillOpacity="0.92" />
      </svg>
    </div>
  );
}
