import { clsx as cx } from "clsx";

export const clsx = cx;

export type SearchParamsV1 = {
  q?: string;
  loc?: string;
  tag?: string;
  ai?: string;
  type?: string;
  price?: string;
};

export type Facets = {
  locations: Array<{ name: string; slug: string }>;
  tags: Array<{ name: string; slug: string }>;
  types: Array<{ value: string; label: string }>;
};

export function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): SearchParamsV1 {
  const get = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const q = get("q")?.toString().slice(0, 120) || undefined;
  const loc = get("loc")?.toString().slice(0, 60) || undefined;
  const tag = get("tag")?.toString().slice(0, 80) || undefined;
  const ai = get("ai")?.toString().slice(0, 2) || undefined;
  const type = get("type")?.toString().slice(0, 30) || undefined;
  const price = get("price")?.toString().slice(0, 2) || undefined;

  return { q, loc, tag, ai, type, price };
}

export async function parseSearchParamsAsync(searchParams: any): Promise<SearchParamsV1> {
  const sp = (await Promise.resolve(searchParams ?? {})) as Record<
    string,
    string | string[] | undefined
  >;
  return parseSearchParams(sp);
}

export function buildUrlWithParams(
  basePath: string,
  params: SearchParamsV1,
  patch: Partial<SearchParamsV1>
) {
  const merged: SearchParamsV1 = { ...params, ...patch };

  for (const k of Object.keys(patch) as Array<keyof SearchParamsV1>) {
    if (params[k] && patch[k] && params[k] === patch[k]) {
      (merged as any)[k] = undefined;
    }
  }

  const sp = new URLSearchParams();
  if (merged.q) sp.set("q", merged.q);
  if (merged.loc) sp.set("loc", merged.loc);
  if (merged.tag) sp.set("tag", merged.tag);
  if (merged.ai) sp.set("ai", merged.ai);
  if (merged.type) sp.set("type", merged.type);
  if (merged.price) sp.set("price", merged.price);

  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function aiLevelLabel(level: number) {
  if (level <= 0) return "Student";
  if (level === 1) return "Lærling";
  if (level === 2) return "Avansert";
  if (level === 3) return "Ekspert";
  return "Mester"; // 4+
}


export function priceLevelLabel(level: number) {
  if (level <= 0) return "Lav";
  if (level === 1) return "Rimelig";
  if (level === 2) return "Mellom";
  if (level === 3) return "Premium";
  return "Enterprise"; // 4+
}


export function typeLabel(type: string) {
  const key = String(type ?? "").trim().toLowerCase();
  const map: Record<string, string> = {
    "byrå": "Byrå",
    "studio": "Studio",
    "miljø": "Miljø",
    "frilans": "Frilans",
    "ub/sb": "UB/SB",
  };
  return map[key] || type;
}


