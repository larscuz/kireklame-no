"use client";

import { useEffect, useState } from "react";

export default function LiquidCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [velocity, setVelocity] = useState(0);

    useEffect(() => {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let lastX = 0;
        let lastY = 0;
        let animationFrameId: number;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Check if hovering an interactive element
            const target = e.target as HTMLElement;
            const isInteractive =
                window.getComputedStyle(target).cursor === "pointer" ||
                target.tagName.toLowerCase() === "a" ||
                target.tagName.toLowerCase() === "button" ||
                target.closest("a") ||
                target.closest("button");

            setIsHovering(Boolean(isInteractive));
        };

        const updateCursor = () => {
            // Lerp for smooth spring physics
            const dx = mouseX - currentX;
            const dy = mouseY - currentY;

            currentX += dx * 0.15;
            currentY += dy * 0.15;

            // Calculate velocity for stretching effect
            const currentVelocity = Math.sqrt(dx * dx + dy * dy);
            setVelocity(currentVelocity);

            setPosition({ x: currentX, y: currentY });

            // Rotate based on movement direction
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            const cursorEl = document.getElementById("liquid-cursor");
            if (cursorEl) {
                // Base size is 64px (gathered drop)
                // If moving fast, stretch it and shrink width.
                // If hovering interactive element, swell massively.
                const stretch = Math.min(currentVelocity * 0.5, 30);
                const scale = isHovering ? 2.5 : (currentVelocity < 2 ? 1.5 : 1);

                cursorEl.style.transform = `translate3d(${currentX - 32}px, ${currentY - 32}px, 0) rotate(${angle}deg) scale(${scale})`;

                if (!isHovering && currentVelocity > 2) {
                    cursorEl.style.width = `${64 + stretch}px`;
                    cursorEl.style.height = `${64 - stretch * 0.3}px`;
                    cursorEl.style.borderRadius = "50% 100% 100% 50%";
                } else {
                    cursorEl.style.width = `64px`;
                    cursorEl.style.height = `64px`;
                    cursorEl.style.borderRadius = "50%";
                }
            }

            lastX = currentX;
            lastY = currentY;

            animationFrameId = requestAnimationFrame(updateCursor);
        };

        window.addEventListener("mousemove", onMouseMove);
        animationFrameId = requestAnimationFrame(updateCursor);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isHovering]);

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        * { cursor: none !important; }
        .liquid-hover-swell { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .liquid-hover-swell:hover { transform: scale(1.04); z-index: 10; position: relative; }
      `}} />
            <div
                id="liquid-cursor"
                className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-[9999] transition-[width,height,border-radius] duration-100 ease-out origin-center"
                style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(4px) brightness(1.2) contrast(1.1) saturate(1.5)",
                    WebkitBackdropFilter: "blur(4px) brightness(1.2) contrast(1.1) saturate(1.5)",
                    boxShadow: "inset 0 10px 20px rgba(255,255,255,0.5), inset 0 -10px 20px rgba(0,0,0,0.2), 0 20px 40px rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    mixBlendMode: "hard-light"
                }}
            >
                {/* Reflection highlight */}
                <div className="absolute top-[15%] left-[20%] w-[30%] h-[20%] bg-white rounded-full blur-[2px] opacity-60 transform -rotate-12"></div>
            </div>
        </>
    );
}
