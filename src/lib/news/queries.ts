export const NEWS_SEARCH_TOPICS = [
  "ki-reklame",
  "ai-reklame",
  "ki-media",
  "ai-media",
  "ki-markedsføring",
  "ai-markedsføring",
  "ki-annonser",
  "ai-annonser",
  "ki-byrå",
  "ai-byrå",
] as const;

const PRIORITY_NEWS_QUERIES: string[] = [
  "site:kom24.no KI byrå",
  "site:kom24.no KI effektivitet",
  "site:kom24.no dentsu KI",
  "site:kampanje.com KI byrå",
  "site:medier24.no KI reklame",
  "site:m24.no KI reklame",
  "site:m24.no KI byrå",
  "site:kode24.no KI reklamebyrå",
  "site:nrk.no kunstig intelligens bokomslag",
  "site:nrk.no kunstig intelligens reklame",
];

const CORE_NEWS_QUERIES: string[] = [
  '"ki-reklame" kritikk Norge',
  '"ai-reklame" kritikk Norge',
  '"ki-markedsføring" kritikk Norge',
  '"ai-markedsføring" kritikk Norge',
  '"ki-annonser" Norge',
  '"ai-annonser" Norge',
  '"ki-media" Norge',
  '"ai-media" Norge',
  '"ki-byrå" Norge',
  '"ai-byrå" Norge',
  '"kunstig intelligens" reklamebyrå Norge',
  '"kunstig intelligens" markedsføring Norge',
  '"merking av KI-reklame" Norge',
  '"KI-generert reklame" merking',
  '"agentisk KI" markedsføring',
  '"kunstig intelligens" mediebyrå effektivitet Norge',
  '"dentsu" KI Norge',
  '"kritikk av KI" reklamebransjen',
  '"AI-first" markedsføring Norge',
  '"Språkrådet" KI kommunikasjon',
  '"Kladden" KI kommunikasjon',
  '"TRY" KI satsing',
  '"WPP Media" KI satsing',
];

const SOURCE_FOCUSED_QUERIES: string[] = [
  "site:kom24.no KI reklame",
  "site:kom24.no AI markedsføring",
  "site:kom24.no KI byrå",
  "site:kom24.no KI kritikk",
  "site:kampanje.com KI reklame",
  "site:kampanje.com AI markedsføring",
  "site:kampanje.com KI byrå",
  "site:kampanje.com KI kritikk",
  "site:medier24.no KI reklame",
  "site:m24.no KI reklame",
  "site:m24.no KI medie",
  "site:m24.no KI stemme",
  "site:kode24.no AI reklame",
  "site:kode24.no KI kompetanse",
  "site:kode24.no reklamebyrå KI",
  "site:nrk.no kunstig intelligens bokomslag",
  "site:nrk.no kunstig intelligens medie",
  "site:cw.no KI markedsføring",
  "site:digi.no KI reklame",
  "site:digitalnorway.com KI markedsføring",
  "site:dn.no KI markedsføring",
  "site:dn.no KI reklame",
  "site:dn.no kunstig intelligens kommunikasjon",
];

export const DEFAULT_NEWS_QUERIES: string[] = [
  ...Array.from(
    new Set<string>([
      ...PRIORITY_NEWS_QUERIES,
      ...CORE_NEWS_QUERIES,
      ...SOURCE_FOCUSED_QUERIES,
    ])
  ),
];

export const DEFAULT_NEWS_SOURCE_URLS: string[] = [
  "https://digitalnorway.com/aktuelt/ki-og-markedsforing-disse-lovene-bor-du-vaere-obs-pa",
  "https://www.dn.no/innlegg/ki/arbeid/teknologi/du-bruker-ki-feil/2-1-1932533",
];

export const NEWS_BLOCKED_DOMAINS = new Set<string>([
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "x.com",
  "twitter.com",
  "youtube.com",
  "tiktok.com",
  "reddit.com",
  "wikipedia.org",
]);

const NEWS_ALLOWED_NORWEGIAN_DOMAINS = new Set<string>([
  "kampanje.com",
  "digitalnorway.com",
]);

export function isNorwegianDomain(host: string): boolean {
  const domain = String(host ?? "").toLowerCase().replace(/^www\./, "");
  if (!domain) return false;
  if (domain.endsWith(".no")) return true;
  return NEWS_ALLOWED_NORWEGIAN_DOMAINS.has(domain);
}
