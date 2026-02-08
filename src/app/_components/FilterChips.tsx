import { type Facets, type SearchParamsV1 } from "@/lib/utils";
import { localizePath, type Locale } from "@/lib/i18n";

type Props = {
  facets: Facets;
  params: SearchParamsV1;
  basePath?: string;
  locale: Locale;
};

export default function FilterChips({ facets, params, basePath, locale }: Props) {
  // ---- Clear href: behold alt annet (f.eks. q), men fjern filter-feltene vi kontrollerer her
  const keptParams = Object.fromEntries(
    Object.entries(params as any).filter(([k, v]) => {
      if (v == null || v === "") return false;
      if (k === "ai" || k === "price" || k === "type" || k === "loc") return false;
      return true;
    })
  );

  const qs = new URLSearchParams(keptParams as any).toString();
  const clearHref = localizePath(
    locale,
    qs ? `/selskaper?${qs}` : "/selskaper"
  );

  // ---- Sted options (defensivt)
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
          return { value, label };
        })
        .filter(Boolean) as any;
    }
    return [];
  })();

  const selectClass =
    "h-10 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 text-sm";
  const btnClass =
    "h-10 inline-flex items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 text-sm font-medium shadow-soft hover:shadow-lift transition whitespace-nowrap";

  const actionPath = basePath ?? localizePath(locale, "/selskaper");

  return (
    <form action={actionPath} method="get" className="w-full">
      {/* Behold eksisterende params som skjulte inputs, ellers mister du søk/andre filtre */}
      {Object.entries(params as any).map(([k, v]) =>
        v == null || v === "" || k === "ai" || k === "price" || k === "type" || k === "loc" ? null : (
          <input key={k} type="hidden" name={k} value={String(v)} />
        )
      )}

      {/* ÉN ROW på desktop: nowrap + horisontal scroll hvis nødvendig */}
      <div className="hidden md:flex items-center gap-2 overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch] pb-1">
        <select
          name="ai"
          defaultValue={(params as any).ai ?? ""}
          className={`${selectClass} w-[160px] flex-none`}
        >
          <option value="">{locale === "en" ? "AI level" : "AI-nivå"}</option>
          <option value="0">0 – {locale === "en" ? "Student" : "Student"}</option>
          <option value="1">1 – {locale === "en" ? "Apprentice" : "Lærling"}</option>
          <option value="2">2 – {locale === "en" ? "Advanced" : "Avansert"}</option>
          <option value="3">3 – {locale === "en" ? "Expert" : "Ekspert"}</option>
          <option value="4">4 – {locale === "en" ? "Master" : "Mester"}</option>
        </select>

        <select
          name="price"
          defaultValue={(params as any).price ?? ""}
          className={`${selectClass} w-[140px] flex-none`}
        >
          <option value="">{locale === "en" ? "Price" : "Pris"}</option>
          <option value="0">0 – {locale === "en" ? "Low" : "Lav"}</option>
          <option value="1">1 – {locale === "en" ? "Affordable" : "Rimelig"}</option>
          <option value="2">2 – {locale === "en" ? "Mid" : "Mellom"}</option>
          <option value="3">3 – Premium</option>
          <option value="4">4 – Enterprise</option>
        </select>

        <select
          name="type"
          defaultValue={(params as any).type ?? ""}
          className={`${selectClass} w-[150px] flex-none`}
        >
          <option value="">{locale === "en" ? "Type" : "Type"}</option>
          <option value="byrå">{locale === "en" ? "Agency" : "Byrå"}</option>
          <option value="studio">Studio</option>
          <option value="miljø">{locale === "en" ? "Collective" : "Miljø"}</option>
          <option value="frilans">{locale === "en" ? "Freelance" : "Frilans"}</option>
          <option value="ub/sb">{locale === "en" ? "Student" : "UB/SB"}</option>
        </select>

        <select
          name="loc"
          defaultValue={(params as any).loc ?? ""}
          className={`${selectClass} w-[220px] flex-none`}
        >
          <option value="">{locale === "en" ? "Location" : "Sted"}</option>
          {locOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button type="submit" className={`${btnClass} flex-none`}>
          {locale === "en" ? "Apply" : "Bruk"}
        </button>

        <a href={clearHref} className={`${btnClass} flex-none`}>
          {locale === "en" ? "Clear" : "Fjern"}
        </a>
      </div>
    </form>
  );
}
