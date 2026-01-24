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
