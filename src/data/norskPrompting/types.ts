export type PromptOutputType = "image" | "video" | "text";

export type PromptDomain =
  | "film-vfx"
  | "arkitektur"
  | "produkt"
  | "dokumentar"
  | "sosiale-medier"
  | "historisk"
  | "redaksjonell"
  | "design-system"
  | "surreal_absurd"
  | "animated";

export type PromptStyle =
  | "noktern"
  | "filmatisk"
  | "dokumentar"
  | "reklame"
  | "arkitektonisk"
  | "historisk-presis";

export type PromptLength = "kort" | "medium" | "lang";

export type RuleSeverity = 1 | 2 | 3 | 4 | 5;

export type RuleCategory =
  | "Konsistens"
  | "Kamera"
  | "Komposisjon"
  | "Kontinuitet"
  | "Realisme"
  | "Tekst i bilde"
  | "Historisk troverdighet"
  | "Fysikk"
  | "Produksjonslogikk"
  | "Lys"
  | "Reklame Standard"
  | "Debugger"
  | "Anti-AI-look";

export type NorskPromptingRule = {
  id: string;
  name: string;
  category: RuleCategory;
  severity: RuleSeverity;
  description: string;
  appliesTo: PromptOutputType | "all";
  addToPrompt: string;
  negativeAdd: string;
};

export type GlossaryDomain = "film" | "vfx" | "arch" | "ai" | "photo" | "design";

export type GlossaryTerm = {
  slug: string;
  term_no: string;
  term_en: string;
  domain: GlossaryDomain;
  definition_no: string;
  promptImpact: string;
  examples: string[];
  relatedTerms: string[];
};

export type PromptTemplateBlock = {
  id: string;
  title: string;
  instruction: string;
};

export type PromptTemplate = {
  id: string;
  title: string;
  useCase: string;
  outputType: PromptOutputType;
  domain: PromptDomain;
  blocks: PromptTemplateBlock[];
  recommendedRules: string[];
};

export type CinematicGenre = {
  id: string;
  navn: string;
  effekt: string;
  representasjonsskift?: string;
  promptStruktur: {
    mal: string;
  };
  sterkeBegreper: string[];
};

export type PromptExample = {
  slug: string;
  title: string;
  outputType: PromptOutputType;
  domain: PromptDomain;
  shortInput: string;
  longOutput: string;
  whyWorks: string[];
  ruleIds: string[];
  termSlugs: string[];
  updatedAt: string;
};

export type GovernanceSeverity = "low" | "medium" | "high" | "critical";

export type GovernanceAppliesTo =
  | "rules"
  | "glossary"
  | "templates"
  | "examples"
  | "representationSwitches";

export type NorskPromptingGovernanceRule = {
  id: string;
  name: string;
  category: string;
  severity: GovernanceSeverity;
  appliesTo: GovernanceAppliesTo[];
  description: string;
  enforcementLogic: string;
  addToPrompt: string;
  negativeAdd: string;
};

export type MarketingSkillCategory =
  | "cro"
  | "content"
  | "seo"
  | "paid"
  | "analytics"
  | "retention"
  | "growth"
  | "strategy"
  | "sales"
  | "foundation";

export type MarketingSkill = {
  slug: string;
  name: string;
  title_no: string;
  description_no: string;
  description_en: string;
  category: MarketingSkillCategory;
  content_md: string;
  version: string;
  relatedSkills: string[];
};

export type SemantiskDuplikatAction =
  | "forkast"
  | "sla_sammen"
  | "berik_eksisterende"
  | "opprett_ny";

export type SemantiskDuplikatMetrikk = {
  nameSimilarity: number;
  definitionSimilarity: number;
  promptImpactSimilarity: number;
  constraintsSimilarity: number;
  negativeSimilarity: number;
  samletOverlap: number;
};

export type AlgorithmSourceType =
  | "official_platform"
  | "official_research"
  | "academic_paper"
  | "editorial";

export type AlgorithmPlatform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "facebook"
  | "linkedin"
  | "cross-platform";

export type AlgorithmSourceStatus = "active" | "needs_review" | "archived";

export type AlgorithmConfidence = "high" | "medium" | "low";

export type AlgorithmClaimType = "stable" | "volatile" | "myth" | "interpretation";

export type AlgorithmTeachingUse = "planner" | "diagnosis" | "glossary" | "myth_vs_reality";

export type AlgorithmSource = {
  id: string;
  title: string;
  url: string;
  source_type: AlgorithmSourceType;
  platform: AlgorithmPlatform;
  published_at: string;
  checked_at: string;
  status: AlgorithmSourceStatus;
  summary: string;
  notes: string;
  confidence: AlgorithmConfidence;
};

export type AlgorithmClaim = {
  id: string;
  claim_text: string;
  plain_language: string;
  claim_type: AlgorithmClaimType;
  platform: AlgorithmPlatform;
  confidence: AlgorithmConfidence;
  last_reviewed_at: string;
  teaching_use: AlgorithmTeachingUse;
  source_ids: string[];
};

export type AlgorithmConcept = {
  id: string;
  term: string;
  definition_plain: string;
  definition_technical: string;
  platform_notes: string;
  source_ids: string[];
};

export type AlgorithmPlaybook = {
  id: string;
  goal_type: string;
  audience_stage: string;
  recommended_formats: string[];
  hook_patterns: string[];
  retention_patterns: string[];
  cta_patterns: string[];
  success_metrics: string[];
  related_claim_ids: string[];
};

export type AlgorithmDiagnostic = {
  id: string;
  symptom: string;
  likely_causes: string[];
  evidence_based_checks: string[];
  recommended_changes: string[];
  related_claim_ids: string[];
};
