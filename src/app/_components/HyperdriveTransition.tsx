"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function HyperdriveTransition() {
    const router = useRouter();
    const pathname = usePathname();
    const [isActive, setIsActive] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Aggressively force scroll to top the exact moment the Next.js route swap finishes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (anchor && anchor.href) {
                const url = new URL(anchor.href, window.location.origin);
                if (url.hostname === window.location.hostname && anchor.target !== "_blank") {
                    e.preventDefault();

                    // Step 1: Tell the transition engine to spawn new random stars and collapse them
                    setIsActive(true);
                    setTimeout(() => {
                        spawnHyperdriveSwarm(e.clientX, e.clientY, anchor.href);
                    }, 10);
                }
            }
        };

        document.addEventListener("click", handleClick, { capture: true });
        return () => document.removeEventListener("click", handleClick, { capture: true });
    }, [router]);

    // Keep active long enough for route, then wipe
    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                setIsActive(false);
                if (containerRef.current) containerRef.current.innerHTML = "";
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    const spawnHyperdriveSwarm = (cx: number, cy: number, href: string) => {
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

        const starCount = 300; // Number of standalone DOM particles to generate

        // Step 2: Generate brand new random DOM stars scattered across the whole screen monitor
        for (let i = 0; i < starCount; i++) {
            const drop = document.createElement("div");

            // Randomly scatter them entirely across the viewport width and height
            const startX = Math.random() * w;
            const startY = Math.random() * h;
            // The further they are from the center, the smaller and dimmer they are
            const distFromCenter = Math.sqrt(Math.pow((w / 2) - startX, 2) + Math.pow((h / 2) - startY, 2));
            const maxRadius = 4;
            const starRadius = Math.max(1, maxRadius - (distFromCenter / 400));
            const starOpacity = Math.max(0.2, 1 - (distFromCenter / 800));

            drop.className = "star-particle";
            drop.style.left = `${startX}px`;
            drop.style.top = `${startY}px`;
            drop.style.width = `${starRadius * 2}px`;
            drop.style.height = `${starRadius * 2}px`;
            drop.style.opacity = `${starOpacity}`;

            container.appendChild(drop);
            void drop.offsetWidth; // Reflow

            // Step 3: Animate them slamming into the supernova center exactly where the cursor is
            requestAnimationFrame(() => {
                const distToCursor = Math.sqrt(Math.pow(cx - startX, 2) + Math.pow(cy - startY, 2));
                const delay = distToCursor * 0.15 + (Math.random() * 50);

                setTimeout(() => {
                    drop.style.left = `${cx - starRadius}px`;
                    drop.style.top = `${cy - starRadius}px`;
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
            }, 420);
        });

        // Step 5: Route and reset scroll position under the white flash
        setTimeout(() => {
            router.push(href, { scroll: true });
        }, 500);
    };

    return (
        <div
            className={`fixed inset-0 z-[99999] pointer-events-none ${isActive ? '' : 'hidden'}`}
        >
            <div ref={containerRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
}
