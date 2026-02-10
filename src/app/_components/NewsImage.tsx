"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
};

export default function NewsImage({
  src,
  alt,
  className,
  fallbackSrc = "/covers/cover-1.jpg",
}: Props) {
  const clean = String(src ?? "").trim();
  const initial = useMemo(() => clean || fallbackSrc, [clean, fallbackSrc]);
  const [currentSrc, setCurrentSrc] = useState(initial);

  useEffect(() => {
    setCurrentSrc(initial);
  }, [initial]);

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
