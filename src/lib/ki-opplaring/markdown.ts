import { slugify } from "@/lib/slug";

export type KiOpplaringHeading = {
  depth: number;
  text: string;
  id: string;
};

function nextHeadingId(text: string, seen: Map<string, number>): string {
  const base = slugify(text) || "seksjon";
  const current = seen.get(base) ?? 0;
  const next = current + 1;
  seen.set(base, next);
  return next === 1 ? base : `${base}-${next}`;
}

export function extractKiOpplaringHeadings(markdown: string): KiOpplaringHeading[] {
  const lines = String(markdown ?? "").replace(/\r\n/g, "\n").split("\n");
  const seen = new Map<string, number>();
  const out: KiOpplaringHeading[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) continue;
    const text = match[2].trim();
    if (!text) continue;
    out.push({
      depth: match[1].length,
      text,
      id: nextHeadingId(text, seen),
    });
  }

  return out;
}

export function estimateReadingTimeMinutes(markdown: string): number {
  const plain = String(markdown ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/\[[^\]]+\]\([^\)]+\)/g, " ")
    .replace(/[#>*_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = plain ? plain.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 220));
}
