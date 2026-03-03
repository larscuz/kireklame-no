"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// Matches the type from SnowOverlay
interface FlakeData {
    x: number;
    y: number;
    radius: number;
    opacity: number;
}

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
                const url = new URL(anchor.href, window.location.origin);
                if (url.hostname === window.location.hostname && anchor.target !== "_blank") {
                    e.preventDefault();

                    // Step 1: Tell the Canvas to freeze, map its flakes, and dispatch the payload to us
                    window.dispatchEvent(
                        new CustomEvent("blizzard-init", {
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
            const customEvent = e as CustomEvent<{ flakes: FlakeData[]; cx: number; cy: number; href: string }>;
            const { flakes, cx, cy, href } = customEvent.detail;

            setIsActive(true);

            // Wait 1 frame so isActive=true resolves the hidden class
            setTimeout(() => {
                spawnExtractedBlizzard(flakes, cx, cy, href);
            }, 10);
        };

        window.addEventListener("blizzard-start", handleStart);
        return () => window.removeEventListener("blizzard-start", handleStart);
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

    const spawnExtractedBlizzard = (flakes: FlakeData[], cx: number, cy: number, href: string) => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        container.innerHTML = "";

        const w = window.innerWidth;
        const h = window.innerHeight;

        // Create the massive snowball core in the center of the click
        const snowball = document.createElement("div");
        snowball.className = "snow-particle";
        snowball.style.left = `${cx - 5}px`;
        snowball.style.top = `${cy - 5}px`;
        snowball.style.width = "10px";
        snowball.style.height = "10px";
        snowball.style.opacity = "0"; // Invisible until things hit it
        container.appendChild(snowball);

        // Step 2: Generate 200 DOM elements that EXACTLY match the canvas state
        for (let i = 0; i < flakes.length; i++) {
            const flake = flakes[i];
            const drop = document.createElement("div");

            drop.className = "snow-particle";
            drop.style.left = `${flake.x}px`;
            drop.style.top = `${flake.y}px`;
            // Multiply canvas radius by 2 for width/height CSS
            drop.style.width = `${flake.radius * 2}px`;
            drop.style.height = `${flake.radius * 2}px`;
            drop.style.opacity = `${flake.opacity}`;

            container.appendChild(drop);
            void drop.offsetWidth; // Reflow

            // Step 3: Animate them into the snowball
            requestAnimationFrame(() => {
                const dist = Math.sqrt(Math.pow(cx - flake.x, 2) + Math.pow(cy - flake.y, 2));
                const delay = dist * 0.15 + (Math.random() * 50);

                setTimeout(() => {
                    drop.style.left = `${cx - flake.radius}px`;
                    drop.style.top = `${cy - flake.radius}px`;

                    // Fade it into the snowball when it arrives
                    setTimeout(() => {
                        drop.style.opacity = "0";
                    }, 400);
                }, delay);
            });
        }

        // Make snowball active as drops start arriving
        void snowball.offsetWidth;
        setTimeout(() => {
            snowball.style.opacity = "1";
            snowball.style.width = "80px";
            snowball.style.height = "80px";
            snowball.style.left = `${cx - 40}px`;
            snowball.style.top = `${cy - 40}px`;
        }, 100);

        // Step 4: Detonate the snowball after the furthest flakes have arrived
        requestAnimationFrame(() => {
            setTimeout(() => {
                const massiveSize = Math.max(w, h) * 3; // Whiteout
                snowball.style.width = `${massiveSize}px`;
                snowball.style.height = `${massiveSize}px`;
                snowball.style.left = `${cx - massiveSize / 2}px`;
                snowball.style.top = `${cy - massiveSize / 2}px`;
            }, 500); // 500ms allows the swarming flakes to finish
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
