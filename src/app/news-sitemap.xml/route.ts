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

function toIso(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function toNewsLanguage(language: string): string {
  const normalized = String(language ?? "").toLowerCase();
  if (normalized.startsWith("nb") || normalized.startsWith("nn") || normalized.startsWith("no")) {
    return "no";
  }
  if (normalized.startsWith("en")) return "en";
  return "no";
}

export async function GET() {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no").replace(/\/+$/, "");
  const rows = await listPublishedNews(1000);

  const urlEntries = rows
    .map((article) => {
      const loc = `${site}/ki-avis/${article.slug}`;
      const publishedIso = toIso(article.published_at ?? article.created_at) ?? new Date().toISOString();
      const lastmodIso = toIso(article.updated_at ?? article.published_at ?? article.created_at) ?? publishedIso;
      const title = escapeXml(article.title);
      const language = toNewsLanguage(article.language);

      return [
        "<url>",
        `<loc>${escapeXml(loc)}</loc>`,
        `<lastmod>${lastmodIso}</lastmod>`,
        "<news:news>",
        "<news:publication>",
        "<news:name>KiR Nyheter</news:name>",
        `<news:language>${language}</news:language>`,
        "</news:publication>",
        `<news:publication_date>${publishedIso}</news:publication_date>`,
        `<news:title>${title}</news:title>`,
        "</news:news>",
        "</url>",
      ].join("");
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">` +
    urlEntries +
    `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
