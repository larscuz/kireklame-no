import type { NewsArticle } from "@/lib/news/types";

export const INTERNATIONAL_NEWS_TOPIC = "international_ai_agency";

export const INTERNATIONAL_NEWS_QUERIES: string[] = [
  '"AI-first" ("ad agency" OR "advertising agency" OR "creative agency")',
  '"AI-only" ("creative agency" OR "ad agency")',
  '"generative AI" "creative agency" launch',
  '"AI powered agency collective" launch',
  '"agence publicitaire IA" "100% IA"',
  '"agence creative IA" lancement',
  '"KI Werbeagentur" "AI-first"',
  '"KI Agentur" "100%"',
  '"agencia de publicidad IA" lanza',
  '"agencia creativa IA" "AI-first"',
  '"agencia de marketing IA" lanzamiento',
  '"agencia publicidade IA" lanca',
  '"AI creative studio" launch',
  '"AI-native agency" launch',
  '"fully AI-driven marketing agency"',
  '"genAI creative agency" launch',
  "site:adweek.com AI agency launch",
  "site:campaignasia.com AI powered agency collective launches",
  "site:lbbonline.com gen ai agency",
  "site:newdigitalage.co AI creative agency",
  "site:mediacat.uk hybrid AI adland",
  "site:strategies.fr IA agence",
  "site:e-marketing.fr agence IA",
  "site:lareclame.fr agence 100% IA generative",
  "site:prnewswire.com AI creative agency launch",
  "site:runwayml.com customer ai studio agency",
  "site:finance.yahoo.com AI agency of the year",
  "site:streetinsider.com AI-powered creative agency",
  "site:digitalagencynetwork.com AI creative agency",
  "site:fiftythousandfeet.com AI native agency",
  "site:thebrandtechgroup.com gen ai ad agency",
  "site:omneky.com advertising agents",
  "site:ain.ua AI-only agency",
  "site:martech.org AI ads",
  "site:martech.org OpenAI Google AI ads",
  "site:mezha.ua AI ads",
  "site:kmjournal.net AI ads",
];

export const INTERNATIONAL_NEWS_SEED_URLS: string[] = [
  "https://www.adweek.com/agencies/madwell-david-eisenman-ai-centric-agency/",
  "https://mobilemarketingmagazine.com/vccp-launches-generative-ai-creative-agency-faith/",
  "https://newdigitalage.co/technology/vccp-launches-ai-creative-agency-faith/",
  "https://www.keele.ac.uk/research/researchnews/2023/june/business-expert/artificial-intelligence-creative-agency.php",
  "https://lbbonline.com/news/one-year-of-faith-lessons-from-vccps-gen-ai-agency",
  "https://mediacat.uk/qa-does-the-future-of-adland-lie-in-hybrid-ai/",
  "https://www.vccp.com/work/o2/ai-creative-agency-faith-launches-custom-gen-ai-models-for-o2",
  "https://marcommnews.com/ai-creative-agency-faith-launches-custom-gen-ai-models-for-o2/",
  "https://creative.salon/articles/work/vccp-faith-finding-faith-gen-ai-first-brithday",
  "https://www.adweek.com/media/presenting-adweeks-inaugural-ai-awards/",
  "https://www.monks.com/articles/mediamonks-named-adweeks-inaugural-ai-agency-year",
  "https://www.prnewswire.com/news-releases/mediamonks-shines-as-adweeks-inaugural-ai-agency-of-the-year-301989445.html",
  "https://runwayml.com/news/partnering-with-media-monks",
  "https://finance.yahoo.com/news/s4-capitals-monks-crowned-one-143000109.html",
  "https://runwayml.com/customers/from-traditional-agency-to-ai-studio",
  "https://www.e-marketing.fr/Thematique/agences-1089/Breves/Fred-Farid-lance-Ai-magination-un-studio-de-production-via-398552.htm",
  "https://www.strategies.fr/actualites/agences/LQ4741275C/fred-raillard-aimagination-en-2026-80-de-la-production-sera-faite-avec-lia-ce-sera-la-norme.html",
  "https://www.nyfadvertising.com/jury/index/6c86691b-2ec2-461e-b2c5-ec4556300725",
  "https://www.prnewswire.com/news-releases/cineverse-launches-matchpoint-creative-labs-leveraging-generative-ai-to-enable-creative-services-for-fast-and-ad-supported-streaming-services-302681843.html",
  "https://www.streetinsider.com/Corporate+News/Cineverse+launches+AI-powered+creative+agency+for+streaming+services/25965747.html",
  "https://lareclame.fr/versus/news/heroiks-lance-versus-un-nouveau-modele-dagence-creative-100-ia-generative-2",
  "https://en.ain.ua/2023/02/01/the-first-ai-only-uncreative-agency-is-online-it-generates-ideas-in-minutes-for-free/",
  "https://uxdesign.cc/uncreative-will-ai-eat-human-creativity-alive-a7ef309e1f99",
  "https://www.superside.com/blog/ai-powered-agencies",
  "https://oysters-studio.com/fr",
  "https://animastudios.ai/blog/the-era-of-ai-creative-studios",
  "https://juma.ai/case-studies/the-crew",
  "https://agilebrandguide.com/the-brief-launches-industrys-first-ai-agency-for-marketers/",
  "https://www.campaignasia.com/article/ai-powered-agency-collective-launches-with-quartet-of-creative-businesses/2m1k7vzgajjsllzvtw79yewf8p",
  "https://fiftythousandfeet.com/insights/building-an-ai-native-agency/",
  "https://www.newswire.ca/news-releases/the-creative-agency-embracing-its-ai-first-dna-sets-a-new-standard-for-the-next-era-of-brand-transformation-831196274.html",
  "https://www.grenier.qc.ca/actualites/52492/nouvelle-identite-pour-the-un-known",
  "https://www.emotion.nl/en/ai-studio",
  "https://aeosfilms.com/",
  "https://digitalagencynetwork.com/ai-creative-agency-the-future-of-work-marketing-and-business/",
  "https://futureweek.com/week-in-review-ai-influencers-hurt-brand-trust/",
  "https://www.vccp.com/uk/capabilities/ai",
  "https://www.chanceupon.co/blog/46/are-we-about-to-see-the-first-ai-only-design-studio",
  "https://deriv.com/fr/newsroom/updates/deriv-global-brand-campaign-launch",
  "https://ecocuyo.com/nota/149380/la-agencia-polenta-lanza-coso-su-laboratorio-de-ia-para-empresas-mendocinas-que-quieren-dar-el-salto/",
  "https://www.omneky.com/fr/newsroom/omneky-launches-ai-powered-advertising-agents-to-revolutionize-campaign-management",
  "https://10kr.co/",
  "https://thebrandtechgroup.com/",
  "https://mezha.ua/en/news/ai-companies-are-spending-more-on-ads-than-ever-308561/",
  "https://martech.org/openai-and-google-reveal-competing-visions-for-ai-ads/",
  "https://www.kmjournal.net/news/articleView.html?idxno=8566",
];

const AI_ONLY_PATTERNS = [
  /\bai[- ]only\b/i,
  /\b100%\s*(ai|ia|ki)\b/i,
  /\bfully\s+ai[- ]driven\b/i,
  /\b100%\s+generative\s+ai\b/i,
  /\b100%\s+ia\s+generative\b/i,
  /\bno\s+cameras?\b/i,
  /\bno\s+crews?\b/i,
];

const AI_FIRST_PATTERNS = [
  /\bai[- ]first\b/i,
  /\bki[- ]first\b/i,
  /\bia[- ]first\b/i,
  /\bai[- ]native\b/i,
  /\bai[- ]led\b/i,
  /\bgenerative\s+ai\s+creative\s+agency\b/i,
  /\bai\s+creative\s+agency\b/i,
  /\bai\s+studio\b/i,
  /\bgen\s*ai\s+agency\b/i,
  /\bagence\b.{0,20}\b100%\s+ia\b/i,
];

const AGENCY_PATTERNS = [
  /\badvertising\s+agency\b/i,
  /\bad\s+agency\b/i,
  /\bcreative\s+agency\b/i,
  /\bmarketing\s+agency\b/i,
  /\bagency\b/i,
  /\bagence\b/i,
  /\bagencia\b/i,
  /\bagentur\b/i,
  /\bstudio\b/i,
  /\bcollective\b/i,
  /\bbyr[åa]\b/i,
];

const MARKETING_PATTERNS = [
  /\badvertis/i,
  /\bads?\b/i,
  /\badtech\b/i,
  /\bmartech\b/i,
  /\bmedia\b/i,
  /\bbroadcast/i,
  /\bcreative\b/i,
  /\bmarketing\b/i,
  /\bbrand\b/i,
  /\bcampaign\b/i,
  /\bpublicit/i,
  /\breklame\b/i,
  /\bmarkedsf[øo]ring\b/i,
];

const AI_CONTEXT_PATTERNS = [
  /\bai\b/i,
  /\bki\b/i,
  /\bia\b/i,
  /\bgenai\b/i,
  /\bgenerative\s+ai\b/i,
  /\bartificial\s+intelligence\b/i,
  /\bintelligence\s+artificielle\b/i,
  /\bk[üu]nstliche\s+intelligenz\b/i,
  /\binteligencia\s+artificial\b/i,
];

const NORWEGIAN_NON_DOT_NO = new Set<string>([
  "kampanje.com",
  "digitalnorway.com",
]);

function countMatches(text: string, patterns: RegExp[]): number {
  let hits = 0;
  for (const pattern of patterns) {
    if (pattern.test(text)) hits += 1;
  }
  return hits;
}

export function looksRelevantToInternationalAIAgency(text: string): boolean {
  const input = String(text ?? "");
  if (!input.trim()) return false;
  const aiHits = countMatches(input, AI_CONTEXT_PATTERNS);
  const agencyHits = countMatches(input, AGENCY_PATTERNS);
  const marketHits = countMatches(input, MARKETING_PATTERNS);
  return aiHits > 0 && (agencyHits > 0 || marketHits > 0);
}

export type InternationalAIFirstLabel = "ai_only" | "ai_first" | "not_ai_first" | "unclear";

export type InternationalClassification = {
  label: InternationalAIFirstLabel;
  ai_intensity_score: number;
  confidence: number;
  reasons: string[];
};

export function classifyInternationalAIAgency(args: {
  title?: string | null;
  snippet?: string | null;
  text?: string | null;
}): InternationalClassification {
  const input = `${args.title ?? ""} ${args.snippet ?? ""} ${args.text ?? ""}`.trim();
  const aiHits = countMatches(input, AI_CONTEXT_PATTERNS);
  const agencyHits = countMatches(input, AGENCY_PATTERNS);
  const marketHits = countMatches(input, MARKETING_PATTERNS);
  const aiOnlyHits = countMatches(input, AI_ONLY_PATTERNS);
  const aiFirstHits = countMatches(input, AI_FIRST_PATTERNS);
  const strongAgencyContext = agencyHits > 0 && (marketHits > 0 || aiHits > 1);

  if (aiOnlyHits > 0 && strongAgencyContext) {
    return {
      label: "ai_only",
      ai_intensity_score: 94,
      confidence: 0.8,
      reasons: ["Found explicit AI-only/100% AI signals with agency context."],
    };
  }

  if ((aiFirstHits > 0 || aiOnlyHits > 0) && strongAgencyContext) {
    return {
      label: "ai_first",
      ai_intensity_score: 78,
      confidence: 0.72,
      reasons: ["Found AI-first/AI-native style claims with agency context."],
    };
  }

  if (aiHits > 0 && (agencyHits > 0 || marketHits > 0)) {
    return {
      label: "unclear",
      ai_intensity_score: 52,
      confidence: 0.45,
      reasons: ["Mentions AI in agency/marketing context, but lacks explicit AI-first evidence."],
    };
  }

  return {
    label: "not_ai_first",
    ai_intensity_score: 20,
    confidence: 0.64,
    reasons: ["No strong evidence of AI-first or AI-only agency positioning."],
  };
}

function scoreLanguage(text: string, markers: string[]): number {
  const lc = text.toLowerCase();
  let score = 0;
  for (const marker of markers) {
    if (lc.includes(marker)) score += 1;
  }
  return score;
}

export function guessDocumentLanguage(args: { html?: string | null; text?: string | null }): string {
  const html = String(args.html ?? "");
  const text = String(args.text ?? "");
  const langAttr = html.match(/<html[^>]+lang=["']([a-zA-Z-]+)["']/i)?.[1] ?? "";
  if (langAttr) {
    const normalized = langAttr.split("-")[0]?.trim().toLowerCase();
    if (normalized && normalized.length <= 3) return normalized;
  }

  const sample = text.slice(0, 4000).toLowerCase();
  if (!sample) return "unknown";

  const scores: Array<{ lang: string; score: number }> = [
    { lang: "en", score: scoreLanguage(sample, [" the ", " and ", " agency ", " marketing ", " launch "]) },
    { lang: "fr", score: scoreLanguage(sample, [" le ", " la ", " les ", " agence ", " lancement "]) },
    { lang: "de", score: scoreLanguage(sample, [" der ", " die ", " das ", " agentur ", " werbeagentur "]) },
    { lang: "es", score: scoreLanguage(sample, [" el ", " la ", " agencia ", " lanzamiento ", " publicidad "]) },
    { lang: "pt", score: scoreLanguage(sample, [" de ", " agencia ", " publicidade ", " lancamento "]) },
    { lang: "no", score: scoreLanguage(sample, [" og ", " ikke ", " markedsforing ", " reklame ", " byra "]) },
  ];

  scores.sort((a, b) => b.score - a.score);
  if (scores[0]?.score && scores[0].score >= 2) return scores[0].lang;
  return "unknown";
}

export function isLikelyInternationalDeskArticle(article: NewsArticle): boolean {
  const tags = new Set((article.topic_tags ?? []).map((tag) => String(tag ?? "").toLowerCase()));
  if (tags.has(INTERNATIONAL_NEWS_TOPIC) || tags.has("internasjonalt")) return true;

  const language = String(article.language ?? "").toLowerCase();
  if (language && !["no", "nb", "nn", "unknown"].includes(language)) return true;

  const domain = String(article.source_domain ?? "").toLowerCase().replace(/^www\./, "");
  if (!domain) return false;
  if (NORWEGIAN_NON_DOT_NO.has(domain)) return false;
  return !domain.endsWith(".no");
}
