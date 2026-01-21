// Super-enkel RSS/Atom parsing uten ekstra deps.
// Vi bruker regex for å plukke ut <link>... og Atom <link href="...">
export function extractLinksFromRss(xml: string): string[] {
  const links = new Set<string>();

  // RSS: <link>https://...</link>
  const rssLinkRe = /<link>\s*([^<\s]+)\s*<\/link>/gi;
  let m: RegExpExecArray | null;
  while ((m = rssLinkRe.exec(xml))) {
    const u = m[1].trim();
    if (u.startsWith("http")) links.add(u);
  }

  // Atom: <link href="https://..." />
  const atomLinkRe = /<link[^>]+href=["']([^"']+)["'][^>]*\/?>/gi;
  while ((m = atomLinkRe.exec(xml))) {
    const u = m[1].trim();
    if (u.startsWith("http")) links.add(u);
  }

  return Array.from(links);
}
