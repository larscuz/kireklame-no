"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface StarData {
    x: number; // 2D screen X
    y: number; // 2D screen Y
    radius: number; // Projected 2D radius
    opacity: number;
}

export default function StarfieldOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isWarpingOut, setIsWarpingOut] = useState(false);

    // Stable reference to the current 2D screen projections of the 3D stars
    const starsRef = useRef<StarData[]>([]);

    const handleInit = useCallback((e: Event) => {
        const customEvent = e as CustomEvent<{ cx: number; cy: number; href: string }>;
        const { cx, cy, href } = customEvent.detail;

        setIsWarpingOut(true);

        // Dispatch extracted 2D coordinates so DOM replicas can overlay them perfectly
        window.dispatchEvent(
            new CustomEvent("supernova-start", {
                detail: {
                    stars: starsRef.current,
                    cx,
                    cy,
                    href
                }
            })
        );
    }, []);

    useEffect(() => {
        window.addEventListener("supernova-init", handleInit);
        return () => window.removeEventListener("supernova-init", handleInit);
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

        // Configuration for 3D projection
        const starCount = Math.floor((width * height) / 1000);
        const fov = 300; // Field of View
        const warpSpeed = 10;

        // Stars are defined in 3D space: x, y, z
        const stars3D: {
            x: number;
            y: number;
            z: number;
            baseRadius: number;
        }[] = [];

        for (let i = 0; i < starCount; i++) {
            stars3D.push({
                x: (Math.random() - 0.5) * 4000, // Spread across a huge 3D X space
                y: (Math.random() - 0.5) * 4000, // Spread across a huge 3D Y space
                z: Math.random() * 2000,         // Depth limits
                baseRadius: Math.random() * 1.5 + 0.5
            });
        }

        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            if (isWarpingOut) {
                return; // Stop rendering
            }

            ctx.fillStyle = "white";
            const current2DStars: StarData[] = [];
            const cx = width / 2;
            const cy = height / 2;

            for (let i = 0; i < stars3D.length; i++) {
                const star = stars3D[i];

                // Warp speed: constantly move towards the viewer (decreasing Z)
                star.z -= warpSpeed;

                // Reset star if it passes the camera or goes out of bounds
                if (star.z <= 10) {
                    star.x = (Math.random() - 0.5) * 4000;
                    star.y = (Math.random() - 0.5) * 4000;
                    star.z = 1999;
                }

                // 3D Perspective Projection Math
                // We project the 3D (x,y,z) coordinate onto a 2D (sx, sy) flat plane
                const scale = fov / star.z;
                const sx = star.x * scale + cx;
                const sy = star.y * scale + cy;
                const projectedRadius = star.baseRadius * scale;
                // Fade in from black depending on depth
                const opacity = Math.min(1, (2000 - star.z) / 1000);

                // Only draw and record if it is on-screen
                if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
                    ctx.beginPath();
                    ctx.arc(sx, sy, projectedRadius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.fill();

                    current2DStars.push({ x: sx, y: sy, radius: projectedRadius, opacity });
                }
            }

            starsRef.current = current2DStars;
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isWarpingOut]);

    return (
        <canvas
            ref={canvasRef}
            // Positioned securely between the layout background and the foreground hero content
            className={`fixed inset-0 pointer-events-none z-0 mix-blend-screen opacity-60 ${isWarpingOut ? 'invisible' : 'visible'}`}
        />
    );
}

