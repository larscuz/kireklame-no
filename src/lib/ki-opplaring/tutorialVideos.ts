import "server-only";

import { cache } from "react";
import type { KiOpplaringEntry } from "./content";

export type KiOpplaringTutorialVideo = {
  id: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  watchUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  matchedQuery: string;
};

export type KiOpplaringTutorialSearchLink = {
  label: string;
  url: string;
};

export type KiOpplaringTutorialBundle = {
  source: "youtube_api" | "fallback_search" | "none";
  videos: KiOpplaringTutorialVideo[];
  searchLinks: KiOpplaringTutorialSearchLink[];
};

type YouTubeSearchItem = {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    description?: string;
    channelTitle?: string;
    publishedAt?: string;
    liveBroadcastContent?: string;
    thumbnails?: {
      maxres?: { url?: string };
      standard?: { url?: string };
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
};

type YouTubeSearchResponse = {
  items?: YouTubeSearchItem[];
};

type ScoredCandidate = KiOpplaringTutorialVideo & {
  score: number;
  publishedTs: number;
};

const TOOL_QUERY_MAP: Record<string, string[]> = {
  runway: [
    "Runway tutorial video workflow",
    "Runway Gen-3 tutorial",
  ],
  veo: [
    "Google Veo tutorial text to video",
    "Veo AI video tutorial",
  ],
  kling: [
    "Kling AI video tutorial",
    "Kling prompt tutorial",
  ],
  freepik: [
    "Freepik AI image tutorial",
    "Freepik AI workflow tutorial",
  ],
  elevenlabs: [
    "ElevenLabs voice tutorial",
    "ElevenLabs AI audio workflow",
  ],
  heygen: [
    "HeyGen avatar tutorial",
    "HeyGen workflow tutorial",
  ],
  midjourney: [
    "Midjourney tutorial prompting",
    "Midjourney workflow tutorial",
  ],
  firefly: [
    "Adobe Firefly tutorial",
    "Firefly image generation tutorial",
  ],
};

const TOPIC_QUERY_MAP: Record<string, string[]> = {
  "ki i markedsforing": [
    "AI marketing workflow tutorial",
    "creative AI advertising tutorial",
  ],
  "ki video": [
    "AI video tutorial runway veo kling",
    "text to video workflow tutorial",
  ],
  "ki bilde": [
    "AI image generation tutorial",
    "Midjourney Firefly workflow tutorial",
  ],
  "ki lyd": [
    "AI voice tutorial ElevenLabs",
    "AI audio workflow tutorial",
  ],
  prompting: [
    "prompt engineering tutorial image video",
    "prompting workflow tutorial",
  ],
  workflow: [
    "AI workflow tutorial creative production",
    "AI pipeline tutorial marketing team",
  ],
  "ki strategi": [
    "AI strategy tutorial marketing team",
  ],
  "ki juridisk": [
    "AI copyright legal basics tutorial",
  ],
  "ki i offentlig sektor": [
    "AI public sector communication tutorial",
  ],
};

const POSITIVE_KEYWORDS = [
  "tutorial",
  "guide",
  "how to",
  "workflow",
  "walkthrough",
  "tips",
  "prompt",
  "kurs",
  "opplaring",
];

const NEGATIVE_KEYWORDS = [
  "shorts",
  "#shorts",
  "livestream",
  "breaking news",
  "news",
  "reaction",
  "compilation",
  "meme",
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function buildYouTubeSearchUrl(query: string): string {
  const url = new URL("https://www.youtube.com/results");
  url.searchParams.set("search_query", query);
  return url.toString();
}

function toSearchLink(query: string): KiOpplaringTutorialSearchLink {
  return {
    label: query,
    url: buildYouTubeSearchUrl(query),
  };
}

function uniqueQueries(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const value of values) {
    const query = value.trim();
    if (!query) continue;
    const key = normalize(query);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(query);
  }

  return out;
}

function buildQueryPlan(entry: KiOpplaringEntry): string[] {
  const fromTools = entry.tools.flatMap((tool) => {
    const key = normalize(tool);
    return TOOL_QUERY_MAP[key] ?? [`${tool} tutorial`];
  });

  const fromTopics = entry.topics.flatMap((topic) => {
    const key = normalize(topic);
    return TOPIC_QUERY_MAP[key] ?? [`${topic} tutorial`];
  });

  const fromTitle = [
    `${entry.title} tutorial`,
    `${entry.title} workflow`,
  ];

  return uniqueQueries([...fromTools, ...fromTopics, ...fromTitle]).slice(0, 6);
}

function pickThumbnail(item: YouTubeSearchItem): string {
  const thumbs = item.snippet?.thumbnails;
  return (
    thumbs?.maxres?.url ||
    thumbs?.standard?.url ||
    thumbs?.high?.url ||
    thumbs?.medium?.url ||
    thumbs?.default?.url ||
    ""
  );
}

function containsAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function scoreCandidate(item: YouTubeSearchItem, query: string, entryKeywords: string[]): number {
  const title = normalize(item.snippet?.title ?? "");
  const description = normalize(item.snippet?.description ?? "");
  const haystack = `${title} ${description}`;

  let score = 0;

  if (containsAny(haystack, POSITIVE_KEYWORDS)) score += 6;
  if (containsAny(haystack, NEGATIVE_KEYWORDS)) score -= 8;

  const queryParts = normalize(query)
    .split(/\s+/)
    .filter((part) => part.length > 2);

  for (const part of queryParts) {
    if (haystack.includes(part)) score += 1;
  }

  for (const keyword of entryKeywords) {
    if (haystack.includes(keyword)) score += 2;
  }

  const publishedAt = item.snippet?.publishedAt;
  if (publishedAt) {
    const publishedTs = new Date(publishedAt).getTime();
    const twoYearsMs = 2 * 365 * 24 * 60 * 60 * 1000;
    if (Number.isFinite(publishedTs) && Date.now() - publishedTs <= twoYearsMs) {
      score += 2;
    }
  }

  return score;
}

const fetchYouTubeQuery = cache(async (query: string, apiKey: string): Promise<YouTubeSearchItem[]> => {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("maxResults", "10");
  url.searchParams.set("order", "relevance");
  url.searchParams.set("safeSearch", "moderate");
  url.searchParams.set("regionCode", "NO");
  url.searchParams.set("q", query);
  url.searchParams.set("key", apiKey);

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 * 60 * 12 },
    });

    if (!response.ok) return [];

    const json = (await response.json()) as YouTubeSearchResponse;
    return json.items ?? [];
  } catch {
    return [];
  }
});

function entryKeywordTerms(entry: KiOpplaringEntry): string[] {
  const words = [entry.title, ...entry.topics, ...entry.tools]
    .map((value) => normalize(value))
    .flatMap((value) => value.split(/\s+/))
    .filter((value) => value.length > 2);

  return Array.from(new Set(words)).slice(0, 30);
}

export async function getYouTubeTutorialBundle(
  entry: KiOpplaringEntry,
  options?: { limit?: number }
): Promise<KiOpplaringTutorialBundle> {
  const limit = Math.max(1, Math.min(6, options?.limit ?? 3));
  const queries = buildQueryPlan(entry);
  const searchLinks = queries.slice(0, 4).map((query) => toSearchLink(query));

  const apiKey = String(process.env.YOUTUBE_API_KEY ?? "").trim();
  if (!apiKey) {
    return {
      source: searchLinks.length ? "fallback_search" : "none",
      videos: [],
      searchLinks,
    };
  }

  const keywords = entryKeywordTerms(entry);
  const byId = new Map<string, ScoredCandidate>();

  for (const query of queries.slice(0, 4)) {
    const items = await fetchYouTubeQuery(query, apiKey);

    for (const item of items) {
      const videoId = String(item.id?.videoId ?? "").trim();
      if (!videoId) continue;
      if (String(item.snippet?.liveBroadcastContent ?? "").toLowerCase() === "live") continue;

      const title = String(item.snippet?.title ?? "").trim();
      if (!title) continue;

      const score = scoreCandidate(item, query, keywords);
      if (score < 1) continue;

      const publishedAt = String(item.snippet?.publishedAt ?? "").trim();
      const publishedTs = Number.isFinite(new Date(publishedAt).getTime())
        ? new Date(publishedAt).getTime()
        : 0;

      const candidate: ScoredCandidate = {
        id: videoId,
        title,
        channelTitle: String(item.snippet?.channelTitle ?? "YouTube").trim() || "YouTube",
        publishedAt,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnailUrl: pickThumbnail(item),
        matchedQuery: query,
        score,
        publishedTs,
      };

      const previous = byId.get(videoId);
      if (!previous || candidate.score > previous.score) {
        byId.set(videoId, candidate);
      }
    }
  }

  const videos = Array.from(byId.values())
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.publishedTs - a.publishedTs;
    })
    .slice(0, limit)
    .map(({ score: _score, publishedTs: _publishedTs, ...video }) => video);

  if (!videos.length) {
    return {
      source: searchLinks.length ? "fallback_search" : "none",
      videos: [],
      searchLinks,
    };
  }

  return {
    source: "youtube_api",
    videos,
    searchLinks,
  };
}
