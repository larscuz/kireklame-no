import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bodoni_Moda, Manrope, Source_Serif_4 } from "next/font/google";
import AdSlot from "@/app/_components/AdSlot";
import NewsImage from "@/app/_components/NewsImage";
import SocialShareButton from "@/app/_components/SocialShareButton";
import { getAdForPlacement, type SponsorAd } from "@/lib/ads";
import { getLocale } from "@/lib/i18n.server";
import { getPublishedNewsBySlug } from "@/lib/news/articles";
import { isLikelyInternationalDeskArticle } from "@/lib/news/international";
import {
  machineTranslationNote,
  shouldTranslateToNorwegian,
  translateToNorwegianBokmal,
} from "@/lib/news/translate";
import { siteMeta } from "@/lib/seo";
import { getUserOrNull } from "@/lib/supabase/server";
import FixedFrameScrollytelling from "./FixedFrameScrollytelling";

const masthead = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const headline = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const uiSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

function fmtDate(iso: string | null) {
  if (!iso) return "Dato ikke oppgitt";
  try {
    return new Date(iso).toLocaleString("nb-NO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function toIsoOrNull(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function hasImage(url: string | null): boolean {
  return /^https?:\/\//i.test(String(url ?? "").trim());
}

function shortShareDescription(value: string | null | undefined, maxLen = 180): string {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1).trim()}…`;
}

function normalizeTagValue(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "_");
}

function hasTag(tags: string[] | null | undefined, tag: string): boolean {
  const needle = normalizeTagValue(tag);
  return (tags ?? []).some((item) => normalizeTagValue(String(item ?? "")) === needle);
}

function isInternalAivisArticle(args: {
  title: string | null | undefined;
  sourceName: string | null | undefined;
  topicTags: string[] | null | undefined;
  editorNote: string | null | undefined;
}): boolean {
  const title = String(args.title ?? "");
  const sourceName = String(args.sourceName ?? "");
  const editorNote = String(args.editorNote ?? "");
  const hasInternalTag =
    hasTag(args.topicTags, "op_ed") ||
    hasTag(args.topicTags, "leder") ||
    hasTag(args.topicTags, "redaksjonen") ||
    hasTag(args.topicTags, "lars_cuzner") ||
    hasTag(args.topicTags, "kir_aivisa");

  if (hasInternalTag) return true;
  if (/op-?ed|leder/i.test(title)) return true;
  if (/redaksjonen|lars\s*cuzner|ki?r?\s*aivisa/i.test(sourceName)) return true;
  if (/editor in chief bot redaksjonen|lars\s*cuzner|skrevet av ki?r?\s*aivisa/i.test(editorNote)) return true;
  return false;
}

function isSocialShareEligibleArticle(args: {
  title: string | null | undefined;
  sourceName: string | null | undefined;
  topicTags: string[] | null | undefined;
  editorNote: string | null | undefined;
}): boolean {
  const title = String(args.title ?? "");
  const sourceName = String(args.sourceName ?? "");
  const editorNote = String(args.editorNote ?? "");
  const hasEligibleTag =
    hasTag(args.topicTags, "op_ed") ||
    hasTag(args.topicTags, "redaksjonen") ||
    hasTag(args.topicTags, "lars_cuzner");

  if (hasEligibleTag) return true;
  if (/op[\s-]?ed/i.test(title)) return true;
  if (/redaksjonen|lars\s*cuzner/i.test(sourceName)) return true;
  if (/redaksjonen|lars\s*cuzner|skrevet av op[\s-]?ed/i.test(editorNote)) return true;
  return false;
}

function splitBodyIntoNewsParagraphs(text: string): string[] {
  const raw = String(text ?? "").replace(/\r\n/g, "\n").trim();
  if (!raw) return [];

  const seedParts = raw
    .split(/\n{2,}/g)
    .map((part) => part.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean);

  const out: string[] = [];
  for (const part of seedParts.length ? seedParts : [raw]) {
    if (part.length <= 420) {
      out.push(part);
      continue;
    }

    const sentences = part
      .split(/(?<=[.!?])\s+(?=[A-ZÆØÅ0-9"'(])/g)
      .map((line) => line.trim())
      .filter(Boolean);

    if (sentences.length < 2) {
      const coarse = part.match(/.{1,320}(?:\s+|$)/g)?.map((line) => line.trim()).filter(Boolean) ?? [];
      out.push(...(coarse.length ? coarse : [part]));
      continue;
    }

    let current = "";
    for (const sentence of sentences) {
      const candidate = current ? `${current} ${sentence}` : sentence;
      if (candidate.length > 360 && current) {
        out.push(current);
        current = sentence;
      } else {
        current = candidate;
      }
    }
    if (current.trim()) out.push(current.trim());
  }

  return out.map((part) => part.trim()).filter(Boolean);
}

type ScrollyBlock =
  | { kind: "heading"; text: string }
  | { kind: "text"; text: string }
  | { kind: "image"; src: string; alt: string; caption: string | null };

type ScrollyScene = {
  heading: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  imageCaption: string | null;
};

function parseScrollyBodyBlocks(text: string): ScrollyBlock[] {
  const raw = String(text ?? "").replace(/\r\n/g, "\n").trim();
  if (!raw) return [];

  const chunks = raw
    .split(/\n{2,}/g)
    .map((part) => part.trim())
    .filter(Boolean);
  const blocks: ScrollyBlock[] = [];

  for (const chunk of chunks) {
    const lines = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) continue;

    const firstLine = lines[0];
    const headingMatch = firstLine.match(/^#{2,3}\s+(.+)$/);
    if (headingMatch && lines.length === 1) {
      blocks.push({ kind: "heading", text: headingMatch[1].trim() });
      continue;
    }

    const imageMatch = firstLine.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/i);
    if (imageMatch) {
      const alt = imageMatch[1].trim() || "Illustrasjon";
      const src = imageMatch[2].trim();
      const captionText = lines
        .slice(1)
        .join(" ")
        .replace(/^fig\.?:?\s*/i, "")
        .replace(/^bildetekst:?\s*/i, "")
        .replace(/^caption:?\s*/i, "")
        .trim();
      blocks.push({
        kind: "image",
        src,
        alt,
        caption: captionText || null,
      });
      continue;
    }

    const textParts = splitBodyIntoNewsParagraphs(chunk);
    if (textParts.length === 0) continue;
    for (const textPart of textParts) {
      blocks.push({ kind: "text", text: textPart });
    }
  }

  return blocks;
}

function buildScrollyScenes(args: {
  blocks: ScrollyBlock[];
  fallbackTitle: string;
  fallbackImageUrl: string | null;
}): ScrollyScene[] {
  const { blocks, fallbackTitle, fallbackImageUrl } = args;
  const scenes: ScrollyScene[] = [];
  let pendingHeading: string | null = null;
  let pendingParagraphs: string[] = [];

  for (const block of blocks) {
    if (block.kind === "heading") {
      if (pendingParagraphs.length > 0 && scenes.length > 0) {
        scenes[scenes.length - 1].paragraphs.push(...pendingParagraphs);
        pendingParagraphs = [];
      }
      pendingHeading = block.text;
      continue;
    }

    if (block.kind === "text") {
      pendingParagraphs.push(block.text);
      continue;
    }

    const heading = pendingHeading || (scenes.length === 0 ? fallbackTitle : `Del ${scenes.length + 1}`);
    scenes.push({
      heading,
      paragraphs: pendingParagraphs,
      imageSrc: block.src,
      imageAlt: block.alt,
      imageCaption: block.caption,
    });
    pendingHeading = null;
    pendingParagraphs = [];
  }

  if (pendingParagraphs.length > 0 && scenes.length > 0) {
    scenes[scenes.length - 1].paragraphs.push(...pendingParagraphs);
  }

  if (!scenes.length && hasImage(fallbackImageUrl)) {
    const fallbackParagraphs = blocks
      .filter((block): block is Extract<ScrollyBlock, { kind: "text" }> => block.kind === "text")
      .map((block) => block.text)
      .filter(Boolean);
    scenes.push({
      heading: fallbackTitle,
      paragraphs: fallbackParagraphs,
      imageSrc: String(fallbackImageUrl),
      imageAlt: fallbackTitle,
      imageCaption: null,
    });
  }

  return scenes;
}

function adSignature(ad: SponsorAd | null): string {
  if (!ad) return "";
  return `${ad.id}:${ad.href}:${ad.image_url}:${ad.mobile_image_url ?? ""}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedNewsBySlug(slug);
  if (!article) {
    return siteMeta({
      title: "Sak ikke funnet | KiR Nyheter",
      description: "Saken finnes ikke eller er ikke publisert.",
      path: `/ki-avis/${slug}`,
    });
  }

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no").replace(/\/+$/, "");
  const canonicalPath = `/ki-avis/${article.slug}`;
  const description = shortShareDescription(
    article.summary ??
      article.excerpt ??
      "Redaksjonell dekning av KI/AI i reklame og markedsføring."
  );
  const ogImage = `${site}/api/news/og-image?slug=${encodeURIComponent(article.slug)}&v=${encodeURIComponent(
    article.updated_at ?? article.created_at ?? ""
  )}`;
  const pageTitle = `${article.title} | KiR Nyheter`;
  const shareTitle = article.title;
  const base = siteMeta({
    title: pageTitle,
    description,
    path: canonicalPath,
  });
  const publishedIso = toIsoOrNull(article.published_at ?? article.created_at);
  const modifiedIso = toIsoOrNull(article.updated_at ?? article.published_at ?? article.created_at);

  return {
    ...base,
    openGraph: {
      ...(base.openGraph ?? {}),
      type: "article",
      title: shareTitle,
      description,
      url: `${site}${canonicalPath}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
      publishedTime: publishedIso ?? undefined,
      modifiedTime: modifiedIso ?? undefined,
    },
    twitter: {
      ...(base.twitter ?? {}),
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [ogImage],
    },
  };
}

export default async function KIRNyheterArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [locale, viewer] = await Promise.all([getLocale(), getUserOrNull()]);
  const sponsorLabel = locale === "en" ? "Sponsored" : "Sponset";
  const openLinkFallback = locale === "en" ? "Open link" : "Åpne lenke";
  const canOpenCmsEditor = Boolean(viewer);

  const [
    article,
    catalogTopBanner,
    otherTopBanner,
    otherHeroSidebar,
    homeHeroSidebar,
    catalogInlineCard,
    otherInlineCard,
    otherMidBanner,
    gridBanner,
  ] = await Promise.all([
    getPublishedNewsBySlug(slug),
    getAdForPlacement("catalog_top_banner"),
    getAdForPlacement("other_top_banner"),
    getAdForPlacement("other_hero_sidebar"),
    getAdForPlacement("home_hero_sidebar"),
    getAdForPlacement("catalog_inline_card"),
    getAdForPlacement("other_inline_card"),
    getAdForPlacement("other_mid_banner"),
    getAdForPlacement("catalog_grid_banner"),
  ]);

  if (!article) notFound();

  const usedAds = new Set<string>();
  function pickUnique(candidates: Array<SponsorAd | null>) {
    for (const ad of candidates) {
      if (!ad) continue;
      const key = adSignature(ad);
      if (usedAds.has(key)) continue;
      usedAds.add(key);
      return ad;
    }
    return null;
  }

  const topAd = pickUnique([catalogTopBanner, otherTopBanner]);
  const sidebarAd = pickUnique([otherHeroSidebar, homeHeroSidebar]);
  const inlineAd = pickUnique([catalogInlineCard, otherInlineCard]);
  const midBannerAd = pickUnique([otherMidBanner, gridBanner]);

  const bodyChunks = String(article.body ?? "")
    .split(/\n{2,}/g)
    .map((part) => part.trim())
    .filter(Boolean);

  const isInternational = isLikelyInternationalDeskArticle(article);
  const shouldAutoTranslate =
    isInternational && shouldTranslateToNorwegian(article.language) && !hasTag(article.topic_tags, "maskinoversatt");

  let displayTitle = article.title;
  let displaySummary =
    article.summary ??
    article.excerpt ??
    (article.is_paywalled
      ? "Denne saken ligger bak betalingsmur. Legg inn manuell oppsummering i CMS."
      : "Oppsummering mangler foreløpig.");
  let displayBodyChunks = bodyChunks;

  if (shouldAutoTranslate) {
    const translatedTitle = await translateToNorwegianBokmal(article.title);
    const translatedSummary = await translateToNorwegianBokmal(displaySummary);

    if (translatedTitle) displayTitle = translatedTitle;
    if (translatedSummary) displaySummary = translatedSummary;

    if (bodyChunks.length > 0) {
      const translatedBody = await Promise.all(
        bodyChunks.map(async (chunk) => (await translateToNorwegianBokmal(chunk)) ?? chunk)
      );
      displayBodyChunks = translatedBody;
    }
  }

  const displayBodyParagraphs = displayBodyChunks.flatMap((chunk) =>
    splitBodyIntoNewsParagraphs(chunk)
  );
  const isScrollytelling = hasTag(article.topic_tags, "scrollytelling");
  const scrollyBlocks = isScrollytelling
    ? parseScrollyBodyBlocks(displayBodyChunks.join("\n\n"))
    : [];
  const scrollyScenes = isScrollytelling
    ? buildScrollyScenes({
        blocks: scrollyBlocks,
        fallbackTitle: displayTitle,
        fallbackImageUrl: article.hero_image_url,
      })
    : [];
  const hasScrollyScenes = scrollyScenes.length > 0;
  const hasScrollyBlocks = scrollyBlocks.length > 0;
  const isEditorOpEd = isInternalAivisArticle({
    title: article.title,
    sourceName: article.source_name,
    topicTags: article.topic_tags,
    editorNote: article.editor_note,
  });
  const canShowSocialShareButton = isSocialShareEligibleArticle({
    title: article.title,
    sourceName: article.source_name,
    topicTags: article.topic_tags,
    editorNote: article.editor_note,
  });
  const showOriginalSourceLink = !isEditorOpEd;
  const editorBylineText = "Skrevet av Editor in Chief Bot Redaksjonen.";

  const translationNotice =
    isInternational && (hasTag(article.topic_tags, "maskinoversatt") || shouldAutoTranslate)
      ? article.editor_note ?? machineTranslationNote(article.language)
      : null;
  const cleanedEditorNote = String(article.editor_note ?? "").trim() || null;
  const showEditorialNote =
    Boolean(cleanedEditorNote) &&
    cleanedEditorNote !== String(translationNotice ?? "").trim() &&
    !isEditorOpEd;

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://kireklame.no").replace(/\/+$/, "");
  const canonicalUrl = `${site}/ki-avis/${article.slug}`;
  const publishedIso = toIsoOrNull(article.published_at ?? article.created_at);
  const modifiedIso = toIsoOrNull(article.updated_at ?? article.published_at ?? article.created_at);
  const articleImage = hasImage(article.hero_image_url)
    ? String(article.hero_image_url)
    : `${site}/og-linkedin.jpg`;
  const language =
    shouldAutoTranslate || article.language.toLowerCase().startsWith("no")
      ? "nb-NO"
      : article.language.toLowerCase().startsWith("en")
        ? "en"
        : "nb-NO";
  const publisherId = `${site}/#publisher`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": publisherId,
        name: "Cuz Media AS",
        url: site,
        logo: {
          "@type": "ImageObject",
          url: `${site}/KIREKLAMElogo-black.gif`,
        },
      },
      {
        "@type": "NewsArticle",
        "@id": `${canonicalUrl}#article`,
        url: canonicalUrl,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        headline: displayTitle,
        description: displaySummary,
        inLanguage: language,
        image: [articleImage],
        isAccessibleForFree: !article.is_paywalled,
        datePublished: publishedIso,
        dateModified: modifiedIso,
        publisher: {
          "@id": publisherId,
        },
        author: {
          "@type": "Organization",
          name: "KiR Nyheter redaksjonen",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Forside",
            item: `${site}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "KiR Nyheter",
            item: `${site}/ki-avis`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: displayTitle,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className={`${uiSans.className} overflow-x-clip bg-[#f1ede4] text-[#191919] pb-12`}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="border-y border-black/20 bg-[#f6f2e9]">
        <div className="mx-auto max-w-[1260px] border-b border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.21em] text-black/65 md:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>KiR Nyheter · Aivisutgave</span>
            <span>Oppdatert {fmtDate(new Date().toISOString())}</span>
            <span>AIVISA DRIVES AV CUZ MEDIA AS</span>
          </div>
        </div>

        <div className="mx-auto max-w-[1260px] px-3 py-4 md:px-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <Link href="/ki-avis" className="inline-flex items-end gap-3 hover:opacity-80">
              <img src="/KIREKLAMElogo.gif" alt="KiR Nyheter logo" className="h-12 w-12" />
              <div>
                <p className={`${masthead.className} text-4xl leading-none md:text-5xl`}>KiR Nyheter</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-black/60">
                  Nasjonal dekning av KI i reklame og media
                </p>
              </div>
            </Link>
            <Link
              href="/ki-avis/om"
              className="text-[12px] font-semibold uppercase tracking-[0.14em] underline underline-offset-4 hover:opacity-80"
            >
              Om Aivisen
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1260px] px-3 py-5 md:px-4">
        {topAd ? (
          <section className="mb-4 border border-black/20 bg-[#f8f4eb]">
            <AdSlot
              ad={topAd}
              sponsorLabel={sponsorLabel}
              openLinkFallback={openLinkFallback}
              variant="banner"
              locale={locale}
            />
          </section>
        ) : null}

        <div
          className={`grid gap-5 border-y border-black/20 py-4 ${
            hasScrollyScenes ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_318px]"
          }`}
        >
          <article className={`min-w-0 ${hasScrollyScenes ? "" : "lg:pr-2"}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/55">
              Hovedsak · KiR Nyheter
            </p>
            <h1 className={`${headline.className} mt-2 text-[clamp(2.1rem,10.5vw,3.9rem)] leading-[0.96] [overflow-wrap:anywhere] hyphens-auto md:text-[67px]`}>
              {displayTitle}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.13em] text-black/55">
              <span>{article.source_name}</span>
              <span>•</span>
              <span>{fmtDate(article.published_at ?? article.created_at)}</span>
              {article.is_paywalled ? <span className="text-amber-800">Betalingsmur</span> : null}
            </div>

            {showOriginalSourceLink ? (
              <a
                href={article.source_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-[13px] font-semibold uppercase tracking-[0.13em] underline underline-offset-4 hover:opacity-80"
              >
                Les originalkilden
              </a>
            ) : null}
            {canShowSocialShareButton ? (
              <SocialShareButton
                url={canonicalUrl}
                title={displayTitle}
                text={displaySummary}
                className={`${showOriginalSourceLink ? "ml-4 " : ""}mt-3 inline-block align-top`}
              />
            ) : null}
            {canOpenCmsEditor ? (
              <Link
                href={`/admin/ki-avis#article-${article.id}`}
                className={`${showOriginalSourceLink || canShowSocialShareButton ? "ml-4 " : ""}mt-3 inline-block border border-black/25 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] hover:bg-black/5`}
              >
                Utvid tekst i CMS
              </Link>
            ) : null}

            <section className="mt-4 border border-black/20 bg-[#f8f4eb]">
              {hasImage(article.hero_image_url) ? (
                <NewsImage
                  src={article.hero_image_url ?? ""}
                  alt={article.title}
                  className="aspect-[16/8.6] w-full object-cover"
                />
              ) : (
                <div className="aspect-[16/8.6] w-full bg-gradient-to-br from-slate-500 to-slate-800 p-3">
                  <div className="flex h-full items-end justify-between">
                    <span className="bg-black/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                      {article.source_name}
                    </span>
                    <span className="bg-black/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                      KiR Nyheter
                    </span>
                  </div>
                </div>
              )}
            </section>

            <section className="mt-4 border-t border-black/20 pt-4">
              <h2 className={`${masthead.className} text-[30px] sm:text-[34px]`}>Ingress</h2>
              {translationNotice ? (
                <p className="mt-2 border border-black/20 bg-[#f8f4eb] px-3 py-2 text-[12px] uppercase tracking-[0.14em] text-black/60">
                  {translationNotice}
                </p>
              ) : null}
              <p className={`${headline.className} mt-2 text-[24px] leading-[1.16] text-black/82 [overflow-wrap:anywhere] hyphens-auto sm:text-[29px]`}>
                {displaySummary}
              </p>
              {showOriginalSourceLink ? (
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-[13px] font-semibold uppercase tracking-[0.13em] underline underline-offset-4 hover:opacity-80"
                >
                  Les originalkilden
                </a>
              ) : null}
            </section>

            {inlineAd ? (
              <section className="mt-5 border border-black/20 bg-[#f8f4eb] md:max-w-xl">
                <AdSlot
                  ad={inlineAd}
                  sponsorLabel={sponsorLabel}
                  openLinkFallback={openLinkFallback}
                  variant="card"
                  locale={locale}
                />
              </section>
            ) : null}

            {hasScrollyScenes ? (
              <section className="mt-5 border-t border-black/20 pt-4">
                {!isEditorOpEd ? (
                  <h2 className={`${masthead.className} text-[30px] sm:text-[34px]`}>
                    AI-generert tekst fra kilden
                  </h2>
                ) : null}
                <FixedFrameScrollytelling
                  scenes={scrollyScenes}
                  mastheadClassName={masthead.className}
                  headlineClassName={headline.className}
                  showByline={isEditorOpEd}
                  bylineText={editorBylineText}
                />
              </section>
            ) : hasScrollyBlocks ? (
              <section className="mt-5 border-t border-black/20 pt-4">
                {!isEditorOpEd ? (
                  <h2 className={`${masthead.className} text-[30px] sm:text-[34px]`}>
                    AI-generert tekst fra kilden
                  </h2>
                ) : null}
                <div className="mt-3 space-y-6">
                  {scrollyBlocks.map((block, idx) => {
                    if (block.kind === "heading") {
                      return (
                        <h3
                          key={`heading-${idx}-${block.text.slice(0, 24)}`}
                          className={`${masthead.className} border-t border-black/15 pt-3 text-[31px] leading-[1.03] text-black/88 sm:text-[36px]`}
                        >
                          {block.text}
                        </h3>
                      );
                    }
                    if (block.kind === "image") {
                      return (
                        <figure
                          key={`image-${idx}-${block.src}`}
                          className="border border-black/20 bg-[#f8f4eb]"
                        >
                          <NewsImage
                            src={block.src}
                            alt={block.alt}
                            className="aspect-[16/9] w-full object-cover"
                          />
                          {block.caption ? (
                            <figcaption className="px-3 py-2 text-[12px] uppercase tracking-[0.12em] text-black/65">
                              {block.caption}
                            </figcaption>
                          ) : null}
                        </figure>
                      );
                    }
                    return (
                      <p
                        key={`text-${idx}-${block.text.slice(0, 24)}`}
                        className={`${headline.className} text-[23px] leading-[1.3] text-black/85 [overflow-wrap:anywhere] hyphens-auto sm:text-[26px]`}
                      >
                        {block.text}
                      </p>
                    );
                  })}
                </div>
                {isEditorOpEd ? (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.13em] text-black/55">
                    {editorBylineText}
                  </p>
                ) : null}
              </section>
            ) : displayBodyParagraphs.length > 0 ? (
              <section className="mt-5 border-t border-black/20 pt-4">
                {!isEditorOpEd ? (
                  <h2 className={`${masthead.className} text-[30px] sm:text-[34px]`}>
                    AI-generert tekst fra kilden
                  </h2>
                ) : null}
                <div className="mt-3 md:columns-2 md:gap-8">
                  {displayBodyParagraphs.map((chunk, idx) => (
                    <p
                      key={`${idx}-${chunk.slice(0, 24)}`}
                      className={`${headline.className} mb-4 break-inside-avoid text-[20px] leading-[1.34] text-black/85 [overflow-wrap:anywhere] hyphens-auto sm:text-[22px]`}
                    >
                      {chunk}
                    </p>
                  ))}
                </div>
                {isEditorOpEd ? (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.13em] text-black/55">
                    {editorBylineText}
                  </p>
                ) : null}
              </section>
            ) : null}

            {showEditorialNote ? (
              <section className="mt-5 border border-black/20 bg-[#f8f4eb] p-4">
                <h2 className={`${masthead.className} text-[28px] sm:text-[30px]`}>Redaksjonell note</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-black/72">{cleanedEditorNote}</p>
              </section>
            ) : null}

            <div className="mt-7 border-t border-black/20 pt-3">
              <Link href="/ki-avis" className="text-[13px] font-semibold uppercase tracking-[0.14em] underline underline-offset-4">
                Tilbake til forsiden
              </Link>
            </div>
          </article>

          {!hasScrollyScenes ? (
            <aside className="space-y-4 border-t border-black/15 pt-4 lg:border-t-0 lg:border-l lg:pl-4">
              {sidebarAd ? (
                <section className="border border-black/20 bg-[#f8f4eb]">
                  <AdSlot
                    ad={sidebarAd}
                    sponsorLabel={sponsorLabel}
                    openLinkFallback={openLinkFallback}
                    variant="sidebar"
                    locale={locale}
                  />
                </section>
              ) : null}

              <section className="border border-black/20 bg-[#f8f4eb] p-4">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/55">Saksfakta</h2>
                <dl className="mt-3 space-y-2 text-[13px]">
                  <div className="border-b border-black/10 pb-2">
                    <dt className="text-black/52">Kilde</dt>
                    <dd className="mt-1 font-semibold">{article.source_name}</dd>
                  </div>
                  <div className="border-b border-black/10 pb-2">
                    <dt className="text-black/52">Publisert</dt>
                    <dd className="mt-1 font-semibold">{fmtDate(article.published_at ?? article.created_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-black/52">Vinkel</dt>
                    <dd className="mt-1 font-semibold">
                      {article.perspective === "critical"
                        ? "Kritikk"
                        : article.perspective === "adoption"
                          ? "Satsing"
                          : "Analyse"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="border border-black/20 bg-[#f8f4eb] p-4">
                <h2 className={`${masthead.className} text-[29px]`}>KiR Nyheter</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-black/70">
                  Uavhengig dekning av hvordan KI endrer reklame, byråmarked og medieinvesteringer.
                </p>
              </section>
            </aside>
          ) : null}
        </div>

        {midBannerAd ? (
          <section className="mt-5 border border-black/20 bg-[#f8f4eb]">
            <AdSlot
              ad={midBannerAd}
              sponsorLabel={sponsorLabel}
              openLinkFallback={openLinkFallback}
              variant="banner"
              locale={locale}
            />
          </section>
        ) : null}

        <section className="mt-5 border-t border-black/20 pt-3 text-[11px] uppercase tracking-[0.17em] text-black/55">
          AIVISA DRIVES AV CUZ MEDIA AS
        </section>
      </div>
    </main>
  );
}
