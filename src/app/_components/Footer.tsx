import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--border))]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="font-semibold tracking-tight">KiReklame.no</div>
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">
              Norsk katalog for KI i reklame og kreativ produksjon.
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/selskaper" className="hover:opacity-80 transition">Selskaper</Link>
            <Link href="/admin/submit" className="hover:opacity-80 transition">Send inn</Link>
            <Link href="/auth" className="hover:opacity-80 transition">Logg inn</Link>
          </div>
        </div>

        <div className="mt-8 text-xs text-[rgb(var(--muted))]">
          © {new Date().getFullYear()} KiReklame.no er drevet av Cuz Media AS
        </div>
      </div>
    </footer>
  );
}
