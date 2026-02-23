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
  | "Lys";

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
