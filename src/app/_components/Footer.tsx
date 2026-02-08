import Link from "next/link";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";

export default function Footer() {
  const locale = getLocale();
  return (
    <footer className="border-t border-[rgb(var(--border))]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="font-semibold tracking-tight">KiReklame.no</div>
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">
              {locale === "en"
                ? "Norwegian directory for AI in advertising and creative production."
                : "Norsk katalog for KI i reklame og kreativ produksjon."}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href={localizePath(locale, "/selskaper")} className="hover:opacity-80 transition">
              {locale === "en" ? "Companies" : "Selskaper"}
            </Link>
            <Link href={localizePath(locale, "/admin/submit")} className="hover:opacity-80 transition">
              {locale === "en" ? "Submit" : "Send inn"}
            </Link>
            <Link href={localizePath(locale, "/auth")} className="hover:opacity-80 transition">
              {locale === "en" ? "Sign in" : "Logg inn"}
            </Link>
          </div>
        </div>

        <div className="mt-8 text-xs text-[rgb(var(--muted))]">
          © {new Date().getFullYear()}{" "}
          {locale === "en"
            ? "KiReklame.no is operated by Cuz Media AS"
            : "KiReklame.no er drevet av Cuz Media AS"}
        </div>
      </div>
    </footer>
  );
}
