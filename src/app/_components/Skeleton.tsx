export default function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-black/5 dark:bg-white/10 ${className}`} />;
}
