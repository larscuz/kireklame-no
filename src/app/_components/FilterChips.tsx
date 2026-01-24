import { buildUrlWithParams, type Facets, type SearchParamsV1 } from "@/lib/utils";

type Props = {
  facets: Facets;
  params: SearchParamsV1;
};

export default function FilterChips({ facets, params }: Props) {
    const groups: Array<{
    label: string;
    options: Array<{ k: keyof SearchParamsV1; v: string; label: string }>;
  }> = [
  /*
    {
      label: "AI-nivå",
      options: [
        { k: "ai", v: "0", label: "Student" },
        { k: "ai", v: "1", label: "Lærling" },
        { k: "ai", v: "2", label: "Avansert" },
        { k: "ai", v: "3", label: "Expert" },
        { k: "ai", v: "4", label: "Mester" },
      ],
    },
    */
    {
      label: "Pris",
      options: [
        { k: "price", v: "0", label: "Lav" },
        { k: "price", v: "1", label: "Rimelig" },
        { k: "price", v: "2", label: "Mellom" },
        { k: "price", v: "3", label: "Premium" },
        { k: "price", v: "4", label: "Enterprise" },
      ],
    },
  ];


  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-soft">
      <div className="flex flex-col gap-5">
        <form
  action="/selskaper"
  method="get"
  className="grid gap-3 sm:grid-cols-2 max-w-xl"
>
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


        {groups.map((g) => (
          <div key={g.label}>
            <div className="text-xs font-semibold tracking-wide text-[rgb(var(--muted))]">
              {g.label}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {g.options.map((opt) => {
                const active = (params as any)[opt.k] === opt.v;
                const href = buildUrlWithParams("/selskaper", params, { [opt.k]: opt.v } as any);

                return (
                  <a
                    key={`${String(opt.k)}:${opt.v}`}
                    href={href}
                    className={[
                      "inline-flex items-center rounded-full border px-3 py-1 text-sm transition",
                      active
                        ? "border-[rgb(var(--fg))] bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
                        : "border-[rgb(var(--border))] bg-[rgb(var(--card))] hover:bg-[rgb(var(--bg))]",
                    ].join(" ")}
                  >
                    {opt.label}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
