export default function HeroBackgroundVideo({
  src,
  poster,
}: {
  src?: string | null;
  poster?: string | null;
}) {
  if (!src) return null;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
      <video
        className="h-full w-full object-cover"
        src={src}
        poster={poster ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      {/* readability overlay */}
      <div className="absolute inset-0 bg-black/35" />
      {/* Respect reduced motion */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          video { display: none !important; }
        }
      `}</style>
    </div>
  );
}
