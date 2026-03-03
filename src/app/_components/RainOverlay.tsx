"use client";

import { useEffect, useRef, useState } from "react";

export default function RainOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSucking, setIsSucking] = useState(false);

    useEffect(() => {
        const handleSuck = () => setIsSucking(true);
        window.addEventListener("quicksilver-suck", handleSuck);
        return () => window.removeEventListener("quicksilver-suck", handleSuck);
    }, []);

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

        // Z-Axis Rain drop properties
        const dropsCount = Math.floor((width * height) / 8000);
        const drops: {
            x: number;
            y: number;
            maxRadius: number;
            currentRadius: number;
            life: number;
            maxLife: number;
            opacity: number;
            speedY: number;
        }[] = [];

        // Pre-fill some drops so it's raining immediately
        for (let i = 0; i < dropsCount; i++) {
            drops.push(createDrop(width, height, true));
        }

        function createDrop(w: number, h: number, instant = false) {
            const maxLife = Math.random() * 200 + 100;
            const maxRadius = Math.random() * 3 + 1;
            return {
                x: Math.random() * w,
                y: Math.random() * h,
                maxRadius,
                currentRadius: instant ? maxRadius : 0,
                life: instant ? Math.random() * maxLife : 0,
                maxLife,
                opacity: Math.random() * 0.4 + 0.2, // Subtler glass hits
                speedY: Math.random() * 1.5 + 0.2 // Slow drip down the glass
            };
        }

        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Don't draw if sucked
            if (isSucking) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }

            for (let i = 0; i < drops.length; i++) {
                const drop = drops[i];

                // Scale up (hitting the glass)
                if (drop.currentRadius < drop.maxRadius) {
                    drop.currentRadius += 0.5;
                }

                ctx.beginPath();
                ctx.arc(drop.x, drop.y, drop.currentRadius, 0, Math.PI * 2);

                // Draw a droplet
                ctx.fillStyle = `rgba(255, 255, 255, ${drop.opacity * (1 - drop.life / drop.maxLife)})`;
                ctx.fill();

                // Gravity (slowly sliding down the glass)
                if (drop.currentRadius >= drop.maxRadius) {
                    drop.y += drop.speedY;
                    drop.life++;
                }

                // Reset drop if it "evaporates" or slides off
                if (drop.life >= drop.maxLife || drop.y > height + 20) {
                    drops[i] = createDrop(width, height);
                }
            }

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
            className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${isSucking ? 'opacity-0' : 'opacity-100'}`}
            style={{ mixBlendMode: 'overlay' }}
        />
    );
}
