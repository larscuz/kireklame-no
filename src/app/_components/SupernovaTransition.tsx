"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface StarData {
    x: number;
    y: number;
    radius: number;
    opacity: number;
}

export default function SupernovaTransition() {
    const router = useRouter();
    const [isActive, setIsActive] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (anchor && anchor.href) {
                const url = new URL(anchor.href, window.location.origin);
                if (url.hostname === window.location.hostname && anchor.target !== "_blank") {
                    e.preventDefault();

                    // Step 1: Tell the Starfield Canvas to freeze, dump its 2D coordinates, and vanish
                    window.dispatchEvent(
                        new CustomEvent("supernova-init", {
                            detail: { cx: e.clientX, cy: e.clientY, href: anchor.href }
                        })
                    );
                }
            }
        };

        document.addEventListener("click", handleClick, { capture: true });
        return () => document.removeEventListener("click", handleClick, { capture: true });
    }, []);

    // Listen for the payload from the Canvas
    useEffect(() => {
        const handleStart = (e: Event) => {
            const customEvent = e as CustomEvent<{ stars: StarData[]; cx: number; cy: number; href: string }>;
            const { stars, cx, cy, href } = customEvent.detail;

            setIsActive(true);

            setTimeout(() => {
                spawnExtractedSupernova(stars, cx, cy, href);
            }, 10);
        };

        window.addEventListener("supernova-start", handleStart);
        return () => window.removeEventListener("supernova-start", handleStart);
    }, [router]);

    // Keep active long enough for route, then wipe
    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                setIsActive(false);
                if (containerRef.current) containerRef.current.innerHTML = "";
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    const spawnExtractedSupernova = (stars: StarData[], cx: number, cy: number, href: string) => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        container.innerHTML = "";

        const w = window.innerWidth;
        const h = window.innerHeight;

        // Create the massive supernova core
        const core = document.createElement("div");
        core.className = "star-particle";
        core.style.left = `${cx - 5}px`;
        core.style.top = `${cy - 5}px`;
        core.style.width = "10px";
        core.style.height = "10px";
        core.style.opacity = "0"; // Invisible until things hit it
        container.appendChild(core);

        // Limit the number of stars rendered so the DOM transition stays at 60fps locking
        // We only take the ~300 largest/brightest stars on screen
        const optimizedStars = stars.sort((a, b) => b.radius - a.radius).slice(0, 300);

        // Step 2: Generate exact DOM replicas of the active stars
        for (let i = 0; i < optimizedStars.length; i++) {
            const star = optimizedStars[i];
            const drop = document.createElement("div");

            drop.className = "star-particle";
            drop.style.left = `${star.x}px`;
            drop.style.top = `${star.y}px`;
            drop.style.width = `${star.radius * 2}px`;
            drop.style.height = `${star.radius * 2}px`;
            drop.style.opacity = `${star.opacity}`;

            container.appendChild(drop);
            void drop.offsetWidth; // Reflow

            // Step 3: Animate them slamming into the supernova center (Reverse Warp)
            requestAnimationFrame(() => {
                const dist = Math.sqrt(Math.pow(cx - star.x, 2) + Math.pow(cy - star.y, 2));
                const delay = dist * 0.15 + (Math.random() * 50);

                setTimeout(() => {
                    drop.style.left = `${cx - star.radius}px`;
                    drop.style.top = `${cy - star.radius}px`;
                    drop.style.transform = `scale(0.5)`; // shrink as they hit the core

                    // Fade it into the supernova when it arrives
                    setTimeout(() => {
                        drop.style.opacity = "0";
                    }, 400);
                }, delay);
            });
        }

        // Make supernova core active as stars start arriving
        void core.offsetWidth;
        setTimeout(() => {
            core.style.opacity = "1";
            core.style.width = "100px";
            core.style.height = "100px";
            core.style.left = `${cx - 50}px`;
            core.style.top = `${cy - 50}px`;
            // Intense brightness right before detonation
            core.style.boxShadow = "0 0 50px rgba(255,255,255,1), 0 0 100px rgba(255,255,255,0.8)";
        }, 100);

        // Step 4: Detonate the supernova
        requestAnimationFrame(() => {
            setTimeout(() => {
                const massiveSize = Math.max(w, h) * 3; // Whiteout
                core.style.width = `${massiveSize}px`;
                core.style.height = `${massiveSize}px`;
                core.style.left = `${cx - massiveSize / 2}px`;
                core.style.top = `${cy - massiveSize / 2}px`;
                core.style.boxShadow = "0 0 0px transparent"; // Lose the distinct shadow as it floods the screen
            }, 500);
        });

        // Step 5: Route
        setTimeout(() => {
            router.push(href);
        }, 650);
    };

    return (
        <div
            className={`fixed inset-0 z-[99999] pointer-events-none ${isActive ? '' : 'hidden'}`}
        >
            <div ref={containerRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
}
