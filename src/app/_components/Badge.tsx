import { clsx } from "@/lib/utils";

export default function Badge({
  children,
  variant = "default"
}: {
  children: React.ReactNode;
  variant?: "default" | "muted";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium shadow-soft",
        "border-[rgb(var(--border))]",
        variant === "default"
          ? "bg-[rgb(var(--card))]"
          : "bg-[rgb(var(--bg))] text-[rgb(var(--muted))]"
      )}
    >
      {children}
    </span>
  );
}
