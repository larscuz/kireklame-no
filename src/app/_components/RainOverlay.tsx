"use client";

import { useEffect, useRef } from "react";

export default function RainOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

        // Rain drop properties
        const dropsCount = Math.floor((width * height) / 10000); // Responsive amount of rain
        const drops: { x: number; y: number; speed: number; length: number; opacity: number }[] = [];

        for (let i = 0; i < dropsCount; i++) {
            drops.push({
                x: Math.random() * width,
                y: Math.random() * height,
                speed: Math.random() * 15 + 10,
                length: Math.random() * 20 + 10,
                opacity: Math.random() * 0.4 + 0.1,
            });
        }

        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            drops.forEach((drop) => {
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x, drop.y + drop.length);

                // Slightly skewed to simulate wind
                ctx.strokeStyle = `rgba(255, 255, 255, ${drop.opacity})`;
                ctx.lineWidth = 1.5;
                ctx.lineCap = "round";
                ctx.stroke();

                drop.y += drop.speed;

                // Reset drop to top if it goes past the screen
                if (drop.y > height) {
                    drop.y = -drop.length;
                    drop.x = Math.random() * width;
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[5]"
            style={{ mixBlendMode: "overlay", opacity: 0.6 }}
        />
    );
}
