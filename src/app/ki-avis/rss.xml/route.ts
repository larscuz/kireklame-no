import { listPublishedNews } from "@/lib/news/articles";

export const runtime = "nodejs";
export const revalidate = 900;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function coerceDescription(input: string | null | undefined): string {
  const text = String(input ?? "").replace(/\s+/g, " ").trim();
  if (!text) return "Redaksjonell dekning av KI i reklame og markedsforing.";
  return text.slice(0, 500);
}

export async function GET() {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no").replace(/\/+$/, "");
  const feedUrl = `${site}/ki-avis/rss.xml`;
  const rows = await listPublishedNews(120);

  const newestDate =
    rows
      .map((article) => toDate(article.updated_at ?? article.published_at ?? article.created_at))
      .find((date): date is Date => Boolean(date)) ?? new Date();

  const itemsXml = rows
    .map((article) => {
      const articleUrl = `${site}/ki-avis/${article.slug}`;
      const publishedDate = toDate(article.published_at ?? article.created_at) ?? new Date();
      const description = coerceDescription(article.summary ?? article.excerpt ?? article.body);

      return [
        "<item>",
        `<title>${escapeXml(article.title)}</title>`,
        `<link>${escapeXml(articleUrl)}</link>`,
        `<guid isPermaLink="true">${escapeXml(articleUrl)}</guid>`,
        `<pubDate>${publishedDate.toUTCString()}</pubDate>`,
        `<description>${escapeXml(description)}</description>`,
        `<source url="${escapeXml(article.source_url)}">${escapeXml(article.source_name)}</source>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">` +
    `<channel>` +
    `<title>KiR Nyheter</title>` +
    `<link>${escapeXml(`${site}/ki-avis`)}</link>` +
    `<description>Nyheter om KI i reklame, byra og markedsforing.</description>` +
    `<language>no</language>` +
    `<lastBuildDate>${newestDate.toUTCString()}</lastBuildDate>` +
    `<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />` +
    itemsXml +
    `</channel>` +
    `</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
