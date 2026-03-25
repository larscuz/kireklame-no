export default function HeroBackgroundVideo({
  src,
  poster,
  dimmed = true,
}: {
  src?: string | null;
  poster?: string | null;
  dimmed?: boolean;
}) {
  if (!src) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <video
        className={[
          "absolute inset-0 block h-full w-full max-w-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-[1.08]",
          dimmed ? "opacity-85 group-hover:opacity-100" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        src={src}
        poster={poster ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      {dimmed ? <div className="absolute inset-0 bg-black/35" /> : null}
      {/* Respect reduced motion */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          video { display: none !important; }
        }
      `}</style>
    </div>
  );
}
