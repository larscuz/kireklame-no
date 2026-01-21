export type Seed = {
  url: string;
  type: "rss" | "html" | "sitemap" | "json";
  trust?: number;
  extractionHint?: string;
};

export type CrawlStats = {
  seeds: number;
  fetched: number;
  candidatesFound: number;
  submissionsInserted: number;
  skippedExisting: number;
  errors: Array<{ where: string; message: string }>;
};
