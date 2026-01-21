"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const current = theme === "system" ? systemTheme : theme;
  const isDark = current === "dark";

  return (
    <button
      aria-label="Bytt tema"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm font-medium shadow-soft hover:shadow-lift transition"
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
