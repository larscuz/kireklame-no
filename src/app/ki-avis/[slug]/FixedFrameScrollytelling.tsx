"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
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

type SceneTransition = "zoom" | "focusPull";

type SceneLayout = {
  stickyTopClass: string;
  shellClass: string;
  cardClass: string;
  headingClass: string;
  bodyClass: string;
  inactiveClass: string;
};

const SCENE_LAYOUTS: SceneLayout[] = [
  {
    stickyTopClass: "top-[10vh]",
    shellClass: "mr-auto max-w-[min(92vw,58rem)]",
    cardClass: "bg-[#f7f1e7]",
    headingClass: "text-[31px] sm:text-[42px]",
    bodyClass: "text-[21px] leading-[1.28] sm:text-[24px]",
    inactiveClass: "translate-y-5 opacity-60",
  },
  {
    stickyTopClass: "top-[15vh]",
    shellClass: "ml-auto max-w-[min(92vw,52rem)]",
    cardClass: "bg-[#f5ede2]",
    headingClass: "text-[34px] sm:text-[50px]",
    bodyClass: "text-[19px] leading-[1.32] sm:text-[22px]",
    inactiveClass: "translate-y-4 -translate-x-2 opacity-60",
  },
  {
    stickyTopClass: "top-[20vh]",
    shellClass: "mx-auto max-w-[min(92vw,50rem)]",
    cardClass: "bg-[#f8f3ea]",
    headingClass: "text-[37px] sm:text-[58px]",
    bodyClass: "text-[23px] leading-[1.24] sm:text-[30px]",
    inactiveClass: "translate-y-6 opacity-55",
  },
  {
    stickyTopClass: "top-[25vh]",
    shellClass: "mr-auto max-w-[min(92vw,46rem)]",
    cardClass: "bg-[#f6efe2]",
    headingClass: "text-[29px] sm:text-[38px]",
    bodyClass: "text-[18px] leading-[1.35] sm:text-[21px]",
    inactiveClass: "translate-y-4 translate-x-3 opacity-60",
  },
];

const SCENE_HEIGHTS = [
  "min-h-[114vh] sm:min-h-[122vh]",
  "min-h-[126vh] sm:min-h-[134vh]",
  "min-h-[120vh] sm:min-h-[128vh]",
  "min-h-[132vh] sm:min-h-[140vh]",
];

const SCENE_OVERLAYS = [
  "from-black/58 via-black/24 to-black/76",
  "from-[#0a1320]/62 via-black/23 to-black/74",
  "from-[#181209]/58 via-black/21 to-black/72",
  "from-[#0d111a]/60 via-black/24 to-black/78",
];

const SCENE_TRANSITIONS: SceneTransition[] = [
  "zoom",
  "focusPull",
  "zoom",
  "focusPull",
];

function getSceneTransition(index: number): SceneTransition {
  return SCENE_TRANSITIONS[index % SCENE_TRANSITIONS.length];
}

function getSceneLayout(index: number): SceneLayout {
  return SCENE_LAYOUTS[index % SCENE_LAYOUTS.length];
}

function getLayerEasing(transition: SceneTransition): string {
  switch (transition) {
    case "zoom":
      return "cubic-bezier(0.22, 0.61, 0.36, 1)";
    case "focusPull":
      return "cubic-bezier(0.2, 0.75, 0.18, 1)";
    default:
      return "ease-out";
  }
}

function getLayerTransform(transition: SceneTransition, isActive: boolean, progress: number): string {
  const enter = clamp(progress, 0, 1);
  const leave = 1 - enter;
  switch (transition) {
    case "zoom":
      return isActive
        ? `translate3d(0, ${-12 * enter}px, 0) scale(${1.03 + enter * 0.06})`
        : "translate3d(0, 18px, 0) scale(1.11)";
    case "focusPull":
      return isActive
        ? `translate3d(0, ${-5 * enter}px, 0) scale(${1.01 + enter * 0.08})`
        : "translate3d(0, 0, 0) scale(1.12)";
    default:
      return isActive ? "translate3d(0,0,0) scale(1.04)" : "translate3d(0,0,0) scale(1.08)";
  }
}

function buildLayerStyle(args: {
  transition: SceneTransition;
  isActive: boolean;
  progress: number;
  reducedMotion: boolean;
}): CSSProperties {
  const { transition, isActive, progress, reducedMotion } = args;
  if (reducedMotion) {
    return {
      opacity: isActive ? 1 : 0,
      transform: "translate3d(0,0,0) scale(1)",
      filter: isActive ? "brightness(0.9) saturate(1)" : "brightness(0.6) saturate(0.95)",
      zIndex: isActive ? 2 : 1,
      transitionDuration: "130ms",
      transitionTimingFunction: "linear",
    };
  }

  return {
    opacity: isActive ? 1 : 0,
    transform: getLayerTransform(transition, isActive, progress),
    filter: isActive
      ? `brightness(${(0.84 + progress * 0.07).toFixed(2)}) saturate(${(1.02 + progress * 0.08).toFixed(2)})`
      : "brightness(0.66) saturate(0.94) blur(1.2px)",
    zIndex: isActive ? 2 : 1,
    transitionDuration: "920ms",
    transitionTimingFunction: getLayerEasing(transition),
    willChange: "transform, opacity, filter",
  };
}

export default function FixedFrameScrollytelling({
  scenes,
  mastheadClassName,
  headlineClassName,
  showByline,
  bylineText,
}: Props) {
  if (!scenes.length) return null;

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
    const elements = stepRefs.current.filter((step): step is HTMLElement => Boolean(step));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        const top = visible[0].target as HTMLElement;
        const rawIndex = Number(top.dataset.sceneIndex ?? "0");
        if (Number.isFinite(rawIndex)) {
          const bounded = clamp(rawIndex, 0, scenes.length - 1);
          setActiveIndex((prev) => (prev === bounded ? prev : bounded));
        }
      },
      {
        root: null,
        rootMargin: "-15% 0px -35% 0px",
        threshold: [0.25, 0.4, 0.6, 0.8],
      }
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [scenes.length]);

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

  const boundedActiveIndex = clamp(activeIndex, 0, scenes.length - 1);
  const activeScene = scenes[boundedActiveIndex];
  const activeOverlay = SCENE_OVERLAYS[boundedActiveIndex % SCENE_OVERLAYS.length];

  return (
    <section className="mt-6">
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2">
        <div className="sticky top-0 h-screen overflow-hidden border-y border-black/20 bg-black">
          {scenes.map((scene, idx) => {
            const isActive = idx === boundedActiveIndex;
            const transition = getSceneTransition(idx);
            const layerStyle = buildLayerStyle({
              transition,
              isActive,
              progress: activeProgress,
              reducedMotion,
            });
            return (
              <div
                key={`${idx}-${scene.imageSrc}`}
                className="absolute inset-0 transition-[opacity,transform,filter]"
                style={layerStyle}
              >
                <NewsImage
                  src={scene.imageSrc}
                  alt={scene.imageAlt}
                  className="h-full w-full object-cover"
                />
              </div>
            );
          })}

          <div className={`absolute inset-0 bg-gradient-to-b ${activeOverlay}`} />

          <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm md:left-6 md:top-6">
            Scene {boundedActiveIndex + 1} / {scenes.length}
          </div>

          {activeScene?.imageCaption ? (
            <div className="absolute bottom-3 left-3 max-w-[min(92vw,760px)] rounded-xl border border-white/15 bg-black/45 px-3 py-2 text-[11px] uppercase tracking-[0.13em] text-white/85 backdrop-blur-sm md:bottom-6 md:left-6">
              Bildetekst: {activeScene.imageCaption}
            </div>
          ) : null}
        </div>

        <div className="relative z-10 px-3 md:px-4">
          {scenes.map((scene, idx) => {
            const isActive = idx === boundedActiveIndex;
            const layout = getSceneLayout(idx);
            const heightClass = SCENE_HEIGHTS[idx % SCENE_HEIGHTS.length];
            const emphasis = idx % 5 === 2;
            const mega = idx % 7 === 3;
            const headingBoost = mega
              ? "sm:text-[66px] sm:leading-[0.9]"
              : emphasis
                ? "sm:text-[58px] sm:leading-[0.94]"
                : "";
            const bodyBoost = mega ? "sm:text-[31px]" : emphasis ? "sm:text-[27px]" : "";
            return (
              <section
                key={`${idx}-${scene.heading.slice(0, 24)}`}
                ref={(element) => {
                  stepRefs.current[idx] = element;
                }}
                data-scene-index={idx}
                className={`relative py-14 ${heightClass}`}
              >
                <div className={`sticky ${layout.stickyTopClass} ${layout.shellClass}`}>
                  <article
                    className={`rounded-[28px] border border-black/14 ${layout.cardClass} p-4 shadow-[0_20px_48px_rgba(0,0,0,0.25)] ring-1 ring-black/6 transition-[opacity,transform] duration-700 sm:p-6 ${
                      isActive ? "translate-y-0 translate-x-0 opacity-100" : layout.inactiveClass
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/52">
                      Scrollytelling • Scene {idx + 1}
                    </p>
                    <h3
                      className={`${mastheadClassName} mt-2 leading-[1.02] text-black/92 [overflow-wrap:anywhere] hyphens-auto ${layout.headingClass} ${headingBoost}`}
                    >
                      {scene.heading}
                    </h3>
                    <div className="mt-3 space-y-3">
                      {scene.paragraphs.map((paragraph, pIdx) => (
                        <p
                          key={`${idx}-${pIdx}-${paragraph.slice(0, 20)}`}
                          className={`${headlineClassName} text-black/84 [overflow-wrap:anywhere] hyphens-auto ${layout.bodyClass} ${bodyBoost}`}
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
