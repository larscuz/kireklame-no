"use client";

import { useEffect, useRef, useState } from "react";
import NewsImage from "@/app/_components/NewsImage";

export type ScrollyScene = {
  heading: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  imageCaption: string | null;
};

type Props = {
  scenes: ScrollyScene[];
  mastheadClassName: string;
  headlineClassName: string;
  showByline: boolean;
  bylineText: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default function FixedFrameScrollytelling({
  scenes,
  mastheadClassName,
  headlineClassName,
  showByline,
  bylineText,
}: Props) {
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeProgress, setActiveProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mediaQuery.matches);
    apply();
    mediaQuery.addEventListener("change", apply);
    return () => mediaQuery.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const steps = stepRefs.current.filter((step): step is HTMLElement => Boolean(step));
      if (!steps.length) return;

      const viewportMid = window.innerHeight * 0.5;
      let nextActive = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (let i = 0; i < steps.length; i += 1) {
        const rect = steps[i].getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const distance = Math.abs(center - viewportMid);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nextActive = i;
        }
      }

      setActiveIndex((prev) => (prev === nextActive ? prev : nextActive));

      const activeStep = steps[nextActive];
      const rect = activeStep.getBoundingClientRect();
      const travel = rect.height + window.innerHeight;
      const progress = clamp((window.innerHeight - rect.top) / Math.max(1, travel), 0, 1);
      setActiveProgress(progress);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scenes.length]);

  return (
    <section className="mt-6">
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2">
        <div className="sticky top-0 h-screen overflow-hidden border-y border-black/20 bg-black">
          {scenes.map((scene, idx) => {
            const isActive = idx === activeIndex;
            const shift = idx - activeIndex;
            const scale = reducedMotion
              ? 1
              : isActive
                ? 1 + activeProgress * 0.06
                : 1.03 + Math.min(0.03, Math.abs(shift) * 0.012);
            const translateY = reducedMotion
              ? 0
              : isActive
                ? activeProgress * -14
                : shift > 0
                  ? 18
                  : -18;

            return (
              <div
                key={`${idx}-${scene.imageSrc}`}
                className="absolute inset-0 transition-[opacity,transform] duration-700 ease-out"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                }}
              >
                <NewsImage
                  src={scene.imageSrc}
                  alt={scene.imageAlt}
                  className="h-full w-full object-cover"
                />
              </div>
            );
          })}

          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/75" />

          <div className="absolute left-3 top-3 border border-white/25 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 md:left-6 md:top-6">
            Scene {activeIndex + 1} / {scenes.length}
          </div>

          {scenes[activeIndex]?.imageCaption ? (
            <div className="absolute bottom-3 left-3 max-w-[min(92vw,760px)] border border-white/20 bg-black/40 px-3 py-2 text-[11px] uppercase tracking-[0.13em] text-white/85 md:bottom-6 md:left-6">
              Bildetekst: {scenes[activeIndex].imageCaption}
            </div>
          ) : null}
        </div>

        <div className="relative z-10 px-3 md:px-4">
          {scenes.map((scene, idx) => {
            const isActive = idx === activeIndex;
            return (
              <section
                key={`${idx}-${scene.heading.slice(0, 24)}`}
                ref={(element) => {
                  stepRefs.current[idx] = element;
                }}
                className="relative min-h-[118vh] py-14 sm:min-h-[125vh]"
              >
                <div className="sticky top-[12vh] mx-auto w-full max-w-3xl">
                  <article
                    className={`border border-black/20 bg-[#f7f1e7]/95 p-4 shadow-[0_24px_64px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-[opacity,transform] duration-500 sm:p-6 ${
                      isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-65"
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/55">
                      Scrollytelling
                    </p>
                    <h3
                      className={`${mastheadClassName} mt-2 text-[31px] leading-[1.02] text-black/90 [overflow-wrap:anywhere] hyphens-auto sm:text-[38px]`}
                    >
                      {scene.heading}
                    </h3>
                    <div className="mt-3 space-y-3">
                      {scene.paragraphs.map((paragraph, pIdx) => (
                        <p
                          key={`${idx}-${pIdx}-${paragraph.slice(0, 20)}`}
                          className={`${headlineClassName} text-[21px] leading-[1.28] text-black/86 [overflow-wrap:anywhere] hyphens-auto sm:text-[24px]`}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </article>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {showByline ? (
        <p className="mt-2 text-[11px] uppercase tracking-[0.13em] text-black/55">{bylineText}</p>
      ) : null}
    </section>
  );
}
