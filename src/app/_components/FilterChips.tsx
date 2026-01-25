// src/app/_components/FilterChips.tsx
import { type Facets, type SearchParamsV1 } from "@/lib/utils";

type Props = {
  facets: Facets;
  params: SearchParamsV1;
  basePath?: string;
};

export default function FilterChips({ facets, params, basePath }: Props) {
  // ---- Clear href: behold alt annet (f.eks. q), men fjern filter-feltene vi kontrollerer her
  const keptParams = Object.fromEntries(
    Object.entries(params as any).filter(([k, v]) => {
      if (v == null || v === "") return false;
      if (k === "ai" || k === "price" || k === "type" || k === "loc") return false;
      return true;
    })
  );

  const qs = new URLSearchParams(keptParams as any).toString();
  const clearHref = qs ? `/selskaper?${qs}` : "/selskaper";

  // ---- Sted options: hent defensivt fra facets
  const locOptions: Array<{ value: string; label: string }> = (() => {
    const raw =
      (facets as any)?.locations ??
      (facets as any)?.loc ??
      (facets as any)?.steder ??
      (facets as any)?.place ??
      null;

    if (Array.isArray(raw)) {
      return raw
        .map((x: any) => {
          const value = String(x?.slug ?? x?.value ?? x?.id ?? "").trim();
          const label = String(x?.name ?? x?.label ?? "").trim();
          if (!value || !label) return null;
          if (value.toLowerCase() === "null") return null;
          return { value, label };
        })
        .filter(Boolean) as any;
    }
    return [];
  })();

  return (
    <form
      action={basePath ?? "/selskaper"}
      method="get"
      className="grid gap-2"
    >
      {/* Behold eksisterende params som skjulte inputs */}
      {Object.entries(params as any).map(([k, v]) =>
        v == null ||
        v === "" ||
        k === "ai" ||
        k === "price" ||
        k === "type" ||
        k === "loc" ? null : (
          <input key={k} type="hidden" name={k} value={String(v)} />
        )
      )}

      {/* Row 1: dropdowns (kompakt) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {/* AI */}
        <div className="min-w-0">
          <label className="sr-only">AI-nivå</label>
          <select
            name="ai"
            defaultValue={(params as any).ai ?? ""}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
            aria-label="AI-nivå"
          >
            <option value="">AI: Alle</option>
            <option value="0">0 – Student</option>
            <option value="1">1 – Lærling</option>
            <option value="2">2 – Avansert</option>
            <option value="3">3 – Ekspert</option>
            <option value="4">4 – Mester</option>
          </select>
        </div>

        {/* Pris */}
        <div className="min-w-0">
          <label className="sr-only">Pris</label>
          <select
            name="price"
            defaultValue={(params as any).price ?? ""}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
            aria-label="Pris"
          >
            <option value="">Pris: Alle</option>
            <option value="0">0 – Lav</option>
            <option value="1">1 – Rimelig</option>
            <option value="2">2 – Mellom</option>
            <option value="3">3 – Premium</option>
            <option value="4">4 – Enterprise</option>
          </select>
        </div>

        {/* Type */}
        <div className="min-w-0">
          <label className="sr-only">Type</label>
          <select
            name="type"
            defaultValue={(params as any).type ?? ""}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
            aria-label="Type"
          >
            <option value="">Type: Alle</option>
            <option value="byrå">Byrå</option>
            <option value="studio">Studio</option>
            <option value="miljø">Miljø</option>
            <option value="frilans">Frilans</option>
            <option value="ub/sb">UB/SB</option>
          </select>
        </div>

        {/* Sted */}
        <div className="min-w-0">
          <label className="sr-only">Sted</label>
          <select
            name="loc"
            defaultValue={(params as any).loc ?? ""}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
            aria-label="Sted"
          >
            <option value="">Sted: Alle</option>
            {locOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: actions (samme linje) */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm font-medium hover:bg-[rgb(var(--bg))]"
          >
            Bruk filter
          </button>

          <a
            href={clearHref}
            className="inline-flex items-center justify-center rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm font-medium hover:bg-[rgb(var(--bg))]"
          >
            Fjern filter
          </a>
        </div>

        {/* valgfri: liten hint om at stedlisten kan være tom */}
        {locOptions.length === 0 ? (
          <span className="text-xs text-[rgb(var(--muted))]">
            Steder kommer fra databasen.
          </span>
        ) : null}
      </div>
    </form>
  );
}
