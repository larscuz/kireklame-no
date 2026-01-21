"use client";
import { useEffect, useState } from "react";

export default function CoverImg({
  src,
  alt,
  className,
  fallbackSrc = "/covers/cover-1.jpg",
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}) {
  const clean = (src ?? "").trim();
  const [currentSrc, setCurrentSrc] = useState(clean || fallbackSrc);

  // viktig: oppdater hvis src endrer seg
  useEffect(() => {
    setCurrentSrc(clean || fallbackSrc);
  }, [clean, fallbackSrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
