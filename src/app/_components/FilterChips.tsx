import { type Facets, type SearchParamsV1 } from "@/lib/utils";

type Props = {
  facets: Facets;
  params: SearchParamsV1;
};

export default function FilterChips({ facets, params }: Props) {
  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-soft">
      <div className="flex flex-col gap-5">
        <form action="/selskaper" method="get" className="grid gap-3 sm:grid-cols-2 max-w-xl">
          {/* Behold eksisterende params som skjulte inputs, ellers mister du søk/andre filtre */}
          {Object.entries(params as any).map(([k, v]) =>
            v == null || v === "" || k === "ai" || k === "price" ? null : (
              <input key={k} type="hidden" name={k} value={String(v)} />
            )
          )}

          {/* AI */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold tracking-wide text-[rgb(var(--muted))]">
              AI-nivå
            </label>

            <select
              name="ai"
              defaultValue={(params as any).ai ?? ""}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
            >
              <option value="">Alle</option>
              <option value="0">0 – Student</option>
              <option value="1">1 – Lærling</option>
              <option value="2">2 – Avansert</option>
              <option value="3">3 – Ekspert</option>
              <option value="4">4 – Mester</option>
            </select>
          </div>

          {/* Pris */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold tracking-wide text-[rgb(var(--muted))]">
              Pris
            </label>

            <select
              name="price"
              defaultValue={(params as any).price ?? ""}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
            >
              <option value="">Alle</option>
              <option value="0">0 – Lav</option>
              <option value="1">1 – Rimelig</option>
              <option value="2">2 – Mellom</option>
              <option value="3">3 – Premium</option>
              <option value="4">4 – Enterprise</option>
            </select>
          </div>

          {/* Knapper */}
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              className="inline-flex rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm font-medium hover:bg-[rgb(var(--bg))]"
            >
              Bruk filter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
