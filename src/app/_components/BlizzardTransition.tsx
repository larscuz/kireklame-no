"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function BlizzardTransition() {
    const router = useRouter();
    const [isActive, setIsActive] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Intercept clicks on links
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (anchor && anchor.href) {
                // Only intercept local relative links or same-hostname links
                const url = new URL(anchor.href, window.location.origin);
                if (url.hostname === window.location.hostname && anchor.target !== "_blank") {
                    e.preventDefault();

                    setIsActive(true);

                    // Dispatch event to hide the canvas snow instantly
                    window.dispatchEvent(new Event("blizzard-suck"));

                    // Ensure React guarantees display: block is processed
                    setTimeout(() => {
                        spawnBlizzard(e.clientX, e.clientY);
                    }, 10);

                    // Perform navigation after the animation expands
                    setTimeout(() => {
                        router.push(anchor.href);
                    }, 800);
                }
            }
        };

        document.addEventListener("click", handleClick, { capture: true });

        return () => {
            document.removeEventListener("click", handleClick, { capture: true });
        };
    }, [router]);

    // Keep active for navigation, then wipe clean
    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                setIsActive(false);
                if (containerRef.current) containerRef.current.innerHTML = "";
            }, 1800);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    const spawnBlizzard = (cx: number, cy: number) => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        container.innerHTML = ""; // Clear any old drops

        const numDrops = 80; // We can do LOTS because it's just opaque CSS circles (60fps guaranteed)
        const w = window.innerWidth;
        const h = window.innerHeight;

        for (let i = 0; i < numDrops; i++) {
            const drop = document.createElement("div");

            // Start randomly scattered
            const startX = Math.random() * w;
            const startY = Math.random() * h;

            drop.className = "snow-particle";
            drop.style.left = `${startX}px`;
            drop.style.top = `${startY}px`;

            // Random small sizes to match the canvas snow
            const size = Math.random() * 8 + 4;
            drop.style.width = `${size}px`;
            drop.style.height = `${size}px`;

            container.appendChild(drop);
            void drop.offsetWidth; // Force CSS reflow

            // Animate to click position fast
            requestAnimationFrame(() => {
                const dist = Math.sqrt(Math.pow(cx - startX, 2) + Math.pow(cy - startY, 2));
                // Swirl effect: slight delay based on distance
                const delay = dist * 0.08 + (Math.random() * 30);

                setTimeout(() => {
                    drop.style.left = `${cx - size / 2}px`;
                    drop.style.top = `${cy - size / 2}px`;
                    // Unlike liquid, snow just piles up and vanishes into the whiteout
                    setTimeout(() => {
                        drop.style.opacity = "0";
                    }, 400);
                }, delay);
            });
        }

        // The massive snowball the cursor forms
        const snowball = document.createElement("div");
        snowball.className = "snow-particle";
        snowball.style.left = `${cx - 20}px`;
        snowball.style.top = `${cy - 20}px`;
        snowball.style.width = "40px";
        snowball.style.height = "40px";
        container.appendChild(snowball);
        void snowball.offsetWidth; // Force reflow

        // The exact moment the particles hit it (around 300ms), it goes nuclear
        requestAnimationFrame(() => {
            setTimeout(() => {
                const massiveSize = Math.max(w, h) * 3; // Huge circle to whiteout entire screen
                snowball.style.width = `${massiveSize}px`;
                snowball.style.height = `${massiveSize}px`;
                snowball.style.left = `${cx - massiveSize / 2}px`;
                snowball.style.top = `${cy - massiveSize / 2}px`;
            }, 300);
        });
    };

    return (
        <div
            className={`fixed inset-0 z-[99999] pointer-events-none ${isActive ? '' : 'hidden'}`}
        >
            {/* Note: NO gooey SVG filter. Instant 60fps locked performance. */}
            <div ref={containerRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
}
