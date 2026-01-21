// src/lib/crawl/searchSerper.ts
type SerperOrganic = { link?: string; title?: string; snippet?: string };

export async function googleSearchTopLink(query: string): Promise<string | null> {
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
      gl: "no",
      hl: "no",
      num: 5,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Serper HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }

  const json = await res.json();
  const organic: SerperOrganic[] = json?.organic ?? [];
  const first = organic.find(o => typeof o?.link === "string" && o.link.startsWith("http"));
  return first?.link ?? null;
}
