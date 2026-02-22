"use client";

import UsageMeter from "@/components/ki-opplaring/UsageMeter";
import { useUsage } from "@/hooks/ki-opplaring/useUsage";

export default function ExercisesUsagePanel() {
  const { usage } = useUsage();

  return (
    <UsageMeter
      remaining={usage.remaining}
      used={usage.used}
      limit={usage.limit}
      mode={usage.mode}
      status={usage.status}
      className="border-cyan-300/20 bg-[rgb(var(--card))] text-[rgb(var(--fg))]"
    />
  );
}
