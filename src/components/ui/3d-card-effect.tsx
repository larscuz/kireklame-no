"use client";

import { cn } from "@/lib/utils";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const ROTATION_DIVISOR = 11;
  const MAX_ROTATION = 20;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / ROTATION_DIVISOR;
    const y = (e.clientY - top - height / 2) / ROTATION_DIVISOR;
    const clampedX = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, x));
    const clampedY = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, y));

    containerRef.current.style.setProperty("--px", `${clampedX / MAX_ROTATION}`);
    containerRef.current.style.setProperty("--py", `${clampedY / MAX_ROTATION}`);
    containerRef.current.style.transform = `rotateY(${clampedX}deg) rotateX(${clampedY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.setProperty("--px", "0");
    containerRef.current.style.setProperty("--py", "0");
    containerRef.current.style.transform = "rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)";
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn("py-20 flex items-center justify-center", containerClassName)}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex items-center justify-center relative transition-transform duration-200 ease-out will-change-transform",
            className
          )}
          style={{
            transformStyle: "preserve-3d",
            ["--px" as string]: "0",
            ["--py" as string]: "0",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    if (!ref.current) return;
    const zAsNumber =
      typeof translateZ === "number"
        ? translateZ
        : Number.isFinite(Number(translateZ))
          ? Number(translateZ)
          : 0;
    const parallaxX = Math.max(10, Math.min(40, Math.abs(zAsNumber) * 0.24));
    const parallaxY = Math.max(8, Math.min(30, Math.abs(zAsNumber) * 0.2));

    if (isMouseEntered) {
      ref.current.style.transform = `translateX(calc(${translateX}px + (var(--px) * ${parallaxX}px))) translateY(calc(${translateY}px + (var(--py) * ${parallaxY}px))) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform =
        "translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
    }
  }, [isMouseEntered, rotateX, rotateY, rotateZ, translateX, translateY, translateZ]);

  return (
    <Tag
      ref={ref}
      className={cn("w-fit transition-transform duration-300 ease-out will-change-transform", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
