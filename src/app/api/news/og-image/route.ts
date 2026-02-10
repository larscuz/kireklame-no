import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { getPublishedNewsBySlug } from "@/lib/news/articles";

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function isAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function toAbsoluteUrl(site: string, value: string | null | undefined): string | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  if (isAbsoluteHttpUrl(raw)) return raw;
  return `${site}${raw.startsWith("/") ? "" : "/"}${raw}`;
}

async function readFallbackImage(): Promise<Buffer> {
  const fallbackPath = join(process.cwd(), "public", "og-linkedin.jpg");
  return readFile(fallbackPath);
}

async function fetchImageBytes(url: string, site: string): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: site,
      },
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("image/")) return null;

    const bytes = await response.arrayBuffer();
    if (bytes.byteLength <= 0) return null;

    return { bytes, contentType };
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no").replace(/\/+$/, "");
  const url = new URL(req.url);
  const slug = String(url.searchParams.get("slug") ?? "").trim();

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const article = await getPublishedNewsBySlug(slug);
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const heroUrl = toAbsoluteUrl(site, article.hero_image_url);
  if (heroUrl) {
    const fetched = await fetchImageBytes(heroUrl, site);
    if (fetched) {
      return new NextResponse(fetched.bytes, {
        status: 200,
        headers: {
          "Content-Type": fetched.contentType,
          "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }
  }

  const fallback = await readFallbackImage();
  const fallbackBytes = new Uint8Array(fallback);
  return new NextResponse(fallbackBytes, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
