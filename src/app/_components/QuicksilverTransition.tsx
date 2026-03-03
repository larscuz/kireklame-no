"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function QuicksilverTransition() {
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

                    // Dispatch event to hide the Z-axis rain canvas
                    window.dispatchEvent(new Event("quicksilver-suck"));

                    // Ensure React has committed the isActive state
                    setTimeout(() => {
                        spawnDroplets(e.clientX, e.clientY);
                    }, 10);

                    // Perform navigation after the animation expands
                    setTimeout(() => {
                        router.push(anchor.href);
                    }, 800); // 800ms allows droplets to gather and expand
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
            }, 1800);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    const spawnDroplets = (cx: number, cy: number) => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        container.innerHTML = ""; // Clear any old droplets

        const numDrops = 35; // Dense enough to look like the rain
        const w = window.innerWidth;
        const h = window.innerHeight;

        for (let i = 0; i < numDrops; i++) {
            const drop = document.createElement("div");

            // Start randomly scattered ON screen, pretending to be the existing rain splatters
            const startX = Math.random() * w;
            const startY = Math.random() * h;

            drop.className = "quicksilver-drop";
            drop.style.left = `${startX}px`;
            drop.style.top = `${startY}px`;

            // Random sizes, slightly smaller initially like raindrops
            const size = Math.random() * 15 + 10;
            drop.style.width = `${size}px`;
            drop.style.height = `${size}px`;

            container.appendChild(drop);
            void drop.offsetWidth; // Force CSS reflow to ensure transition starts from position

            // Animate to click position, then merge
            requestAnimationFrame(() => {
                // Stagger the magnetic pull slightly based on distance for cool fluid physics
                const dist = Math.sqrt(Math.pow(cx - startX, 2) + Math.pow(cy - startY, 2));
                const delay = dist * 0.15 + (Math.random() * 50);

                setTimeout(() => {
                    drop.style.left = `${cx - size / 2}px`;
                    drop.style.top = `${cy - size / 2}px`;

                    // As they reach the center, blow them up to join the massive puddle
                    setTimeout(() => {
                        const newSize = Math.random() * 200 + 100;
                        drop.style.width = `${newSize}px`;
                        drop.style.height = `${newSize}px`;
                        drop.style.left = `${cx - newSize / 2}px`;
                        drop.style.top = `${cy - newSize / 2}px`;
                        drop.style.transform = `scale(${15 + Math.random() * 5})`;
                    }, 350); // wait for transit
                }, delay);
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
        void mainDrop.offsetWidth; // Force CSS reflow

        requestAnimationFrame(() => {
            setTimeout(() => {
                const massiveSize = Math.max(w, h) * 1.5;
                mainDrop.style.width = `${massiveSize}px`;
                mainDrop.style.height = `${massiveSize}px`;
                mainDrop.style.left = `${cx - massiveSize / 2}px`;
                mainDrop.style.top = `${cy - massiveSize / 2}px`;
            }, 300); // Expanding after the small drops hit it
        });
    };

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
                className={`fixed inset-0 z-[99999] pointer-events-none ${isActive ? '' : 'hidden'}`}
                style={{ filter: "url('#goo')" }} // apply gooey merge to children
            >
                <div ref={containerRef} className="absolute inset-0 w-full h-full" />
            </div>
        </>
    );
}
