export const NEWS_STATUSES = ["draft", "published", "archived"] as const;
export type NewsStatus = (typeof NEWS_STATUSES)[number];

export const NEWS_PERSPECTIVES = ["critical", "adoption", "neutral"] as const;
export type NewsPerspective = (typeof NEWS_PERSPECTIVES)[number];

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  source_name: string;
  source_url: string;
  source_domain: string | null;
  language: string;
  published_at: string | null;
  discovered_at: string;
  status: NewsStatus;
  perspective: NewsPerspective;
  topic_tags: string[];
  is_paywalled: boolean;
  paywall_note: string | null;
  excerpt: string | null;
  summary: string | null;
  body: string | null;
  hero_image_url: string | null;
  crawl_run_id: string | null;
  crawl_query: string | null;
  cloudflare_worker_hint: string | null;
  evidence: Record<string, unknown> | null;
  editor_note: string | null;
  created_at: string;
  updated_at: string;
};

export type NewsArticleUpsert = {
  id?: string | null;
  slug?: string | null;
  title: string;
  source_name: string;
  source_url: string;
  source_domain?: string | null;
  language?: string | null;
  published_at?: string | null;
  status?: NewsStatus | null;
  perspective?: NewsPerspective | null;
  topic_tags?: string[] | null;
  is_paywalled?: boolean | null;
  paywall_note?: string | null;
  excerpt?: string | null;
  summary?: string | null;
  body?: string | null;
  hero_image_url?: string | null;
  crawl_run_id?: string | null;
  crawl_query?: string | null;
  cloudflare_worker_hint?: string | null;
  evidence?: Record<string, unknown> | null;
  editor_note?: string | null;
};
