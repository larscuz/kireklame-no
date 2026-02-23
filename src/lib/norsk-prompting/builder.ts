import { glossaryTerms } from "@/data/norskPrompting/glossary";
import { norskPromptingRules } from "@/data/norskPrompting/rules";
import { promptTemplates } from "@/data/norskPrompting/templates";
import type {
  GlossaryDomain,
  GlossaryTerm,
  NorskPromptingRule,
  PromptDomain,
  PromptLength,
  PromptOutputType,
  PromptStyle,
} from "@/data/norskPrompting/types";
import { domainLabel, styleLabel } from "./constants";

export type BuildPromptInput = {
  input: string;
  outputType: PromptOutputType;
  domain: PromptDomain;
  style: PromptStyle;
  length: PromptLength;
  strictness: number;
  consistency: number;
  lockRules: boolean;
  jsonMode?: boolean;
  templateId?: string;
};

export type PromptBlock = {
  id: string;
  title: string;
  content: string;
};

export type BuildPromptResult = {
  prompt: string;
  blocks: PromptBlock[];
  usedRules: NorskPromptingRule[];
  usedTerms: GlossaryTerm[];
  negativeList: string[];
  templateId: string | null;
};

const domainToGlossary: Record<PromptDomain, GlossaryDomain[]> = {
  "film-vfx": ["film", "vfx", "photo", "ai"],
  arkitektur: ["arch", "photo", "ai", "design"],
  produkt: ["photo", "design", "ai", "film"],
  dokumentar: ["film", "photo", "ai"],
  "sosiale-medier": ["film", "design", "photo", "ai"],
  historisk: ["arch", "photo", "film", "ai"],
  redaksjonell: ["ai", "design", "film"],
  "design-system": ["design", "ai", "photo"],
};

const sectionOrder: Array<{ id: string; title: string }> = [
  { id: "1", title: "Mål" },
  { id: "2", title: "Motiv + handling" },
  { id: "3", title: "Miljø / setting" },
  { id: "4", title: "Kamera" },
  { id: "5", title: "Lys" },
  { id: "6", title: "Materialer / overflater" },
  { id: "7", title: "Komposisjon" },
  { id: "8", title: "Stil / estetikk" },
  { id: "9", title: "Kontinuitet / konsistens" },
  { id: "10", title: "Begrensninger" },
  { id: "11", title: "Negativ prompting / unngå" },
  { id: "12", title: "Output-spesifikasjon" },
];

function toText(value: unknown): string {
  return String(value ?? "").trim();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function normalizeInput(input: BuildPromptInput): BuildPromptInput {
  return {
    ...input,
    input: toText(input.input),
    strictness: clamp(input.strictness, 0, 100),
    consistency: clamp(input.consistency, 0, 100),
  };
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function detectEnvironment(text: string): string {
  const source = text.toLowerCase();

  if (/regn|vann|dam|v[åa]t/.test(source)) return "Våt setting med fysisk plausibel værologikk og realistiske refleksjoner.";
  if (/tog|stasjon|gate|by/.test(source)) return "Urban setting med stabil geometri, tydelige siktlinjer og konsekvent skala.";
  if (/interi[øo]r|rom|kontor|studio/.test(source)) return "Innendørs setting med kontrollert lys og tydelig romlig avgrensning.";
  if (/skog|natur|fjell|hav/.test(source)) return "Naturlig miljø med fysisk korrekt lys, vær og terrengrespons.";

  return "Definer miljø med fysisk romlogikk, underlag og bakgrunn uten tilfeldige tillegg.";
}

function cameraHint(outputType: PromptOutputType, domain: PromptDomain): string {
  if (outputType === "text") {
    return "Bruk strukturert fagspråk: kort intro, mekanisme, praktisk leveranse. Unngå diffuse formuleringer.";
  }

  if (outputType === "video") {
    return "35mm eller 50mm, stabil POV, én kamerabevegelse om gangen, tydelig start/slutt-tilstand.";
  }

  if (domain === "arkitektur") {
    return "35mm frontalt eller svakt skrått, øyehøyde, nøytral perspektivkontroll uten forvrenging.";
  }

  return "Fast brennvidde (35–50mm), tydelig utsnitt og fokusplan med bevisst dybdeskarphet.";
}

function lightHint(style: PromptStyle, strictness: number): string {
  const base = "Definer key/fill/rim med retning, diffusjon og fargetemperatur (Kelvin).";
  if (style === "dokumentar" || style === "noktern") {
    return `${base} Prioriter nøytral, troverdig lyssetting uten dramatisk grading.`;
  }

  if (strictness > 70) {
    return `${base} Lås primærlyskilde og unngå motstridende skygger.`;
  }

  return `${base} Hold kontrast under kontroll og unngå stiliserte artefakter.`;
}

function outputSpec(outputType: PromptOutputType): string {
  if (outputType === "video") {
    return "Oppgi format (9:16 eller 16:9), varighet, fps, og tydelig sluttramme uten geometrihopp.";
  }

  if (outputType === "image") {
    return "Oppgi formatforhold, oppløsningsmål og krav om konsistent eksponering og detaljnivå.";
  }

  return "Lever i norsk tekstformat med overskrifter, punktliste og avsluttende handlingssjekk.";
}

function chooseTemplate(input: BuildPromptInput) {
  if (input.templateId) {
    const byId = promptTemplates.find((template) => template.id === input.templateId);
    if (byId) return byId;
  }

  return (
    promptTemplates.find(
      (template) => template.outputType === input.outputType && template.domain === input.domain
    ) ?? promptTemplates.find((template) => template.outputType === input.outputType) ?? null
  );
}

function chooseRules(input: BuildPromptInput, templateRuleIds: string[]): NorskPromptingRule[] {
  const base = norskPromptingRules.filter(
    (rule) => rule.appliesTo === "all" || rule.appliesTo === input.outputType
  );

  const recommended = base.filter((rule) => templateRuleIds.includes(rule.id));
  const remainder = base
    .filter((rule) => !templateRuleIds.includes(rule.id))
    .sort((a, b) => b.severity - a.severity);

  const limit = input.lockRules ? 12 : 6;
  const target: NorskPromptingRule[] = [];

  for (const rule of [...recommended, ...remainder]) {
    if (target.find((entry) => entry.id === rule.id)) continue;
    target.push(rule);
    if (target.length >= limit) break;
  }

  return target;
}

function chooseTerms(input: BuildPromptInput, count = 8): GlossaryTerm[] {
  const domains = domainToGlossary[input.domain];
  const source = input.input.toLowerCase();

  const candidates = glossaryTerms.filter((term) => domains.includes(term.domain));
  const weighted = candidates
    .map((term) => {
      const inInput = source.includes(term.term_no.toLowerCase()) || source.includes(term.term_en.toLowerCase());
      const score = inInput ? 10 : term.promptImpact.length % 7;
      return { term, score };
    })
    .sort((a, b) => b.score - a.score || a.term.term_no.localeCompare(b.term.term_no, "nb-NO"));

  return weighted.slice(0, count).map((entry) => entry.term);
}

function buildConstraintList(input: BuildPromptInput, rules: NorskPromptingRule[]): string[] {
  const hard = [
    "Ikke legg til eller fjern nøkkelobjekter uten eksplisitt instruks.",
    "Ingen magisk transformasjon eller uforklarte hopp i geometri.",
    "Hold perspektiv, skala og lysforhold konsistent.",
  ];

  if (input.strictness >= 70) {
    hard.push("Lås identitet, kostyme og miljøparametere gjennom hele outputen.");
    hard.push("Begrens stilisering; prioriter fysisk plausibilitet over effekter.");
  }

  if (input.consistency >= 70) {
    hard.push("Bruk kontinuitetslås: samme objektplassering og bevegelsesregler i hele sekvensen.");
  }

  for (const rule of rules) {
    if (hard.length >= 8) break;
    hard.push(rule.addToPrompt);
  }

  return Array.from(new Set(hard));
}

function buildNegativeList(rules: NorskPromptingRule[], strictness: number): string[] {
  const base = [
    "unngå AI-plastikkhud",
    "unngå tilfeldig tekstfeil i bilde",
    "unngå inkonsistent perspektiv",
  ];

  for (const rule of rules) {
    base.push(rule.negativeAdd);
  }

  if (strictness >= 60) {
    base.push("unngå overmettet grading uten fysisk lyskilde");
  }

  return Array.from(new Set(base)).slice(0, 10);
}

function describeLength(length: PromptLength): string {
  if (length === "kort") return "kort og operativ";
  if (length === "lang") return "detaljert og produksjonsklar";
  return "balansert med tydelig operasjonelle punkter";
}

export function buildPrompt(rawInput: BuildPromptInput): BuildPromptResult {
  const input = normalizeInput(rawInput);
  const sentences = splitSentences(input.input);
  const motif = sentences[0] || "Definer hovedmotiv og handling i én konkret setning.";
  const action = sentences[1] || "Beskriv en fysisk plausibel handling med tydelig årsak og effekt.";

  const template = chooseTemplate(input);
  const rules = chooseRules(input, template?.recommendedRules ?? []);
  const usedTerms = chooseTerms(input, input.length === "lang" ? 10 : 8);
  const constraints = buildConstraintList(input, rules);
  const negativeList = buildNegativeList(rules, input.strictness);

  const templateInstructions = template
    ? template.blocks.map((block) => `${block.title}: ${block.instruction}`).join(" ")
    : "";

  const consistencyLine =
    input.consistency >= 70
      ? "Aktiver høy konsistens: objektpermanens, identitetslås og stabil kamerageometri i hele outputen."
      : "Hold grunnleggende konsistens mellom motiv, miljø og lys.";

  const blocks: PromptBlock[] = [
    {
      id: "1",
      title: "Mål",
      content: `Lag en ${describeLength(input.length)} ${input.outputType === "text" ? "norsk leveranse" : "prompt"} for ${domainLabel[input.domain]} med ${styleLabel[input.style]} tone.`,
    },
    {
      id: "2",
      title: "Motiv + handling",
      content: `${motif} ${action}`,
    },
    {
      id: "3",
      title: "Miljø / setting",
      content: detectEnvironment(input.input),
    },
    {
      id: "4",
      title: "Kamera",
      content: cameraHint(input.outputType, input.domain),
    },
    {
      id: "5",
      title: "Lys",
      content: lightHint(input.style, input.strictness),
    },
    {
      id: "6",
      title: "Materialer / overflater",
      content:
        input.domain === "arkitektur" || input.domain === "produkt"
          ? "Beskriv materialer med ruhet, glans, tekstur og reflektivitet."
          : "Beskriv overflater og kontaktpunkter slik at modellen holder fysisk troverdighet.",
    },
    {
      id: "7",
      title: "Komposisjon",
      content: "Definer fokuspunkt, lagdeling og blikkretning i rammen.",
    },
    {
      id: "8",
      title: "Stil / estetikk",
      content: `Stil: ${styleLabel[input.style]}. ${templateInstructions}`.trim(),
    },
    {
      id: "9",
      title: "Kontinuitet / konsistens",
      content: consistencyLine,
    },
    {
      id: "10",
      title: "Begrensninger",
      content: constraints.join(" "),
    },
    {
      id: "11",
      title: "Negativ prompting / unngå",
      content: negativeList.join("; "),
    },
    {
      id: "12",
      title: "Output-spesifikasjon",
      content: outputSpec(input.outputType),
    },
  ];

  const promptText = sectionOrder
    .map((section) => {
      const block = blocks.find((entry) => entry.id === section.id);
      return `${section.id}) ${section.title}:\n${block?.content ?? ""}`;
    })
    .join("\n\n");

  if (input.jsonMode) {
    return {
      prompt: JSON.stringify(
        {
          meta: {
            outputType: input.outputType,
            domain: input.domain,
            style: input.style,
            strictness: input.strictness,
            consistency: input.consistency,
            lockRules: input.lockRules,
          },
          sections: blocks,
          terminology: usedTerms.map((term) => term.term_no),
          rules: rules.map((rule) => rule.id),
          negativeList,
        },
        null,
        2
      ),
      blocks,
      usedRules: rules,
      usedTerms,
      negativeList,
      templateId: template?.id ?? null,
    };
  }

  return {
    prompt: promptText,
    blocks,
    usedRules: rules,
    usedTerms,
    negativeList,
    templateId: template?.id ?? null,
  };
}
