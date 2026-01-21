import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Fant ikke siden</h1>
      <p className="mt-3 text-[rgb(var(--muted))]">
        Lenken kan være feil, eller innholdet er flyttet.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm font-medium hover:shadow-soft transition"
      >
        Til forsiden
      </Link>
    </div>
  );
}
