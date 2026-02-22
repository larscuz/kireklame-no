"use client";

import { useMode } from "@/hooks/ki-opplaring/useMode";

type Props = {
  title?: string;
  description?: string;
  items?: string[];
};

export default function Deliverable({
  title = "Leveranse",
  description = "Dette bør du kunne levere etter øvelsen.",
  items = [],
}: Props) {
  const { mode } = useMode();
  const isStudent = mode === "student";

  return (
    <section
      className={`my-6 rounded-2xl border p-4 ${
        isStudent
          ? "border-fuchsia-400/40 bg-fuchsia-500/12"
          : "border-indigo-400/35 bg-indigo-500/12"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
        {isStudent ? "Elevmodus" : "Byråmodus"}
      </p>
      <h3 className="mt-1 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-[rgb(var(--fg))]/85">{description}</p>
      {items.length ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
