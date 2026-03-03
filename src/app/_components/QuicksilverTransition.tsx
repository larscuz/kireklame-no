"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function QuicksilverTransition() {
    const router = useRouter();
    const [isActive, setIsActive] = useState(false);
    const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
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

                    setClickPos({ x: e.clientX, y: e.clientY });
                    setIsActive(true);

                    // Spawn droplets instantly
                    spawnDroplets(e.clientX, e.clientY);

                    // Perform navigation after the animation expands
                    setTimeout(() => {
                        router.push(anchor.href);
                    }, 600); // 600ms allows droplets to gather and expand
                }
            }
        };

        document.addEventListener("click", handleClick, { capture: true });

        return () => {
            document.removeEventListener("click", handleClick, { capture: true });
        };
    }, [router]);

    // Reset state when navigation completes (component essentially stays mounted in Layout)
    useEffect(() => {
        if (isActive) {
            // Keep it active long enough to cover the screen transition, then dissolve
            const timer = setTimeout(() => {
                setIsActive(false);
                if (containerRef.current) containerRef.current.innerHTML = "";
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    const spawnDroplets = (cx: number, cy: number) => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        container.innerHTML = ""; // Clear any old droplets

        const numDrops = 12;
        const w = window.innerWidth;
        const h = window.innerHeight;

        for (let i = 0; i < numDrops; i++) {
            const drop = document.createElement("div");
            // Start from edges
            const startX = Math.random() > 0.5 ? (Math.random() > 0.5 ? -100 : w + 100) : Math.random() * w;
            const startY = startX <= 0 || startX >= w ? Math.random() * h : (Math.random() > 0.5 ? -100 : h + 100);

            drop.className = "quicksilver-drop";
            drop.style.left = `${startX}px`;
            drop.style.top = `${startY}px`;

            // Random sizes
            const size = Math.random() * 40 + 20;
            drop.style.width = `${size}px`;
            drop.style.height = `${size}px`;

            container.appendChild(drop);

            // Animate to click position, then merge
            requestAnimationFrame(() => {
                // Wait slightly for DOM
                setTimeout(() => {
                    drop.style.left = `${cx - size / 2}px`;
                    drop.style.top = `${cy - size / 2}px`;
                    // As they reach the center, expand heavily to consume the screen
                    setTimeout(() => {
                        drop.style.transform = `scale(${100 + Math.random() * 50})`;
                    }, 300); // they take 300ms to arrive, then expand
                }, 10 + i * 5); // Slight stagger
            });
        }

        // Add one main drop directly at the cursor immediately to anchor the click
        const mainDrop = document.createElement("div");
        mainDrop.className = "quicksilver-drop";
        mainDrop.style.left = `${cx - 50}px`;
        mainDrop.style.top = `${cy - 50}px`;
        mainDrop.style.width = "100px";
        mainDrop.style.height = "100px";
        container.appendChild(mainDrop);

        requestAnimationFrame(() => {
            setTimeout(() => {
                mainDrop.style.transform = "scale(80)";
            }, 200);
        });
    };

    if (!isActive) return null;

    return (
        <>
            {/* SVG filter for the gooey liquid merge effect */}
            <svg className="hidden z-0">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10" result="goo" />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>

            <div
                className="fixed inset-0 z-[99999] pointer-events-none"
                style={{ filter: "url('#goo')" }} // apply gooey merge to children
            >
                <div ref={containerRef} className="absolute inset-0 w-full h-full" />
            </div>
        </>
    );
}
