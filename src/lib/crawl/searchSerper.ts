// src/lib/crawl/searchSerper.ts
export type SerperOrganic = { link?: string; title?: string; snippet?: string };

type GoogleSearchOpts = {
  gl?: string;
  hl?: string;
  num?: number;
};

export async function googleSearchOrganicResults(
  query: string,
  opts?: GoogleSearchOpts
): Promise<SerperOrganic[]> {
  const key = process.env.SERPER_API_KEY;
  if (!key) throw new Error("Missing SERPER_API_KEY");

  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: query,
      gl: opts?.gl ?? "no",
      hl: opts?.hl ?? "no",
      num: opts?.num ?? 5,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Serper HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }

  const json = await res.json();
  const organic: SerperOrganic[] = json?.organic ?? [];
  return organic;
}

export async function googleSearchOrganicLinks(
  query: string,
  opts?: GoogleSearchOpts
): Promise<string[]> {
  const organic = await googleSearchOrganicResults(query, opts);
  return organic
    .map((o) => (typeof o?.link === "string" ? o.link : ""))
    .filter((link) => link.startsWith("http"));
}

export async function googleSearchTopLink(
  query: string,
  opts?: GoogleSearchOpts
): Promise<string | null> {
  const organic = await googleSearchOrganicResults(query, opts);
  const first = organic.find(o => typeof o?.link === "string" && o.link.startsWith("http"));
  return first?.link ?? null;
}
