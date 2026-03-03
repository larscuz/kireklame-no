"use client";

import { useEffect, useRef, useState } from "react";

export default function SnowOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSucking, setIsSucking] = useState(false);

    useEffect(() => {
        const handleSuck = () => setIsSucking(true);
        window.addEventListener("blizzard-suck", handleSuck);
        return () => window.removeEventListener("blizzard-suck", handleSuck);
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

        // Snow properties: highly performant, just white circles
        const flakeCount = Math.floor((width * height) / 4000);
        const flakes: {
            x: number;
            y: number;
            radius: number;
            speedY: number;
            speedX: number;
            step: number;
            stepSize: number;
            opacity: number;
        }[] = [];

        for (let i = 0; i < flakeCount; i++) {
            flakes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.5 + 0.5,
                // Gentle drift
                speedY: Math.random() * 1.5 + 0.5,
                speedX: 0,
                // Sine wave drift parameters
                step: Math.random() * Math.PI * 2,
                stepSize: Math.random() * 0.05 + 0.01,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            if (isSucking) {
                animationFrameId = requestAnimationFrame(draw);
                return; // Stop drawing instantly on click
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

                // Reset if they hit the bottom or sides
                if (flake.y > height + 5 || flake.x > width + 5 || flake.x < -5) {
                    flake.y = -5;
                    flake.x = Math.random() * width;
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
            className={`fixed inset-0 pointer-events-none z-[8] transition-opacity duration-300 ${isSucking ? 'opacity-0' : 'opacity-100'}`}
        />
    );
}
