export type PromptOutputType = "image" | "video" | "text";

export type PromptDomain =
  | "film-vfx"
  | "arkitektur"
  | "produkt"
  | "dokumentar"
  | "sosiale-medier"
  | "historisk"
  | "redaksjonell"
  | "design-system";

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
