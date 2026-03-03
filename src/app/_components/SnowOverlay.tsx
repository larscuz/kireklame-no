"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface FlakeData {
    x: number;
    y: number;
    radius: number;
    opacity: number;
}

export default function SnowOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSucking, setIsSucking] = useState(false);

    // We need a stable reference to the current flakes so the event listener can read them
    const flakesRef = useRef<FlakeData[]>([]);

    const handleInit = useCallback((e: Event) => {
        const customEvent = e as CustomEvent<{ cx: number; cy: number; href: string }>;
        const { cx, cy, href } = customEvent.detail;

        setIsSucking(true); // Fades canvas to opacity 0 instantly

        // Dispatch the extracted flakes to the DOM Transition engine
        window.dispatchEvent(
            new CustomEvent("blizzard-start", {
                detail: {
                    flakes: flakesRef.current,
                    cx,
                    cy,
                    href
                }
            })
        );
    }, []);

    useEffect(() => {
        window.addEventListener("blizzard-init", handleInit);
        return () => window.removeEventListener("blizzard-init", handleInit);
    }, [handleInit]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener("resize", handleResize);

        const flakeCount = Math.floor((width * height) / 4000);
        const flakes: (FlakeData & { speedY: number; speedX: number; step: number; stepSize: number; })[] = [];

        for (let i = 0; i < flakeCount; i++) {
            flakes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.5 + 0.5,
                speedY: Math.random() * 1.5 + 0.5,
                speedX: 0,
                step: Math.random() * Math.PI * 2,
                stepSize: Math.random() * 0.05 + 0.01,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            if (isSucking) {
                // Stop rendering frames to save CPU, DOM takes over
                return;
            }

            ctx.fillStyle = "white";

            for (let i = 0; i < flakes.length; i++) {
                const flake = flakes[i];

                flake.step += flake.stepSize;
                flake.speedX = Math.sin(flake.step) * 1;

                flake.y += flake.speedY;
                flake.x += flake.speedX;

                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
                ctx.fill();

                if (flake.y > height + 5 || flake.x > width + 5 || flake.x < -5) {
                    flake.y = -5;
                    flake.x = Math.random() * width;
                }
            }

            // Sync the ref so the event listener always has the exact frame's coordinates
            flakesRef.current = flakes.map(f => ({ x: f.x, y: f.y, radius: f.radius, opacity: f.opacity }));

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isSucking]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-[8] ${isSucking ? 'opacity-0' : 'opacity-100'}`}
        />
    );
}
