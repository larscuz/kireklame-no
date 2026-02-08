export type Locale = "no" | "en";

export const defaultLocale: Locale = "no";

export function getLocaleFromHeaders(h: Headers): Locale {
  const lang = h.get("x-lang")?.toLowerCase() ?? "";
  if (lang.startsWith("en")) return "en";
  return "no";
}

export function localizePath(locale: Locale, path: string): string {
  if (!path.startsWith("/")) return path;
  if (locale === "en") {
    if (path === "/") return "/en";
    if (path.startsWith("/en")) return path;
    return `/en${path}`;
  }
  return path;
}
