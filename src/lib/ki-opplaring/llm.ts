import { z } from "zod";

export type LlmTask =
  | "transform_prompt"
  | "exercise_compare"
  | "build_script_10s"
  | "campaign_recommend"
  | "campaign_chat"
  | "prompt_assist";

export type TransformPromptPayload = {
  prompt: string;
  context?: string;
};

export type ExerciseComparePayload = {
  badPrompt: string;
  goodPrompt: string;
  context?: string;
};

export type BuildScript10sPayload = {
  product: string;
  targetAudience: string;
  channel: string;
  tone: string;
  benefit: string;
  cta: string;
  constraints: string;
  format: "9:16" | "16:9";
};

export type CampaignRecommendPayload = {
  brief: string;
};

export type CampaignChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type CampaignChatPayload = {
  messages: CampaignChatMessage[];
};

export type PromptAssistCandidateTerm = {
  slug: string;
  term_no: string;
  definition_no: string;
  promptImpact: string;
};

export type PromptAssistPayload = {
  user_input: string;
  output_type: "image" | "video" | "text";
  domain:
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
  draft_prompt: string;
  candidate_terms: PromptAssistCandidateTerm[];
};

const transformPromptResponseSchema = z.object({
  improved_prompt: z.string().min(1),
  changes: z
    .array(
      z.object({
        why: z.string().min(1),
        example: z.string().min(1),
      })
    )
    .min(1),
  checklist: z.array(z.string().min(1)).min(1),
});

const exerciseCompareResponseSchema = z.object({
  bad_prompt: z.string().optional(),
  good_prompt: z.string().optional(),
  bad_result: z.string().min(1),
  good_result: z.string().min(1),
  diff_summary: z.array(z.string().min(1)).min(1),
  why_good_wins: z.array(z.string().min(1)).min(1),
});

const campaignChatResponseSchema = z.object({
  message: z.string().min(1),
  skills: z
    .array(
      z.object({
        slug: z.string().min(1),
        relevance_pct: z.number().int().min(0).max(100),
        reasoning: z.string().min(1),
        tips: z.array(z.string().min(1)).min(1).max(4),
        free: z.boolean(),
      })
    )
    .optional()
    .default([]),
  focus_areas: z
    .array(
      z.object({
        area: z.string().min(1),
        effort: z.enum(["low", "medium", "high"]),
        impact: z.enum(["low", "medium", "high"]),
        free: z.boolean(),
        action: z.string().min(1),
      })
    )
    .optional()
    .default([]),
  follow_up: z.string().optional(),
});

const campaignRecommendResponseSchema = z.object({
  summary: z.string().min(1),
  skills: z
    .array(
      z.object({
        slug: z.string().min(1),
        relevance_pct: z.number().int().min(0).max(100),
        reasoning: z.string().min(1),
        tips: z.array(z.string().min(1)).min(1).max(4),
      })
    )
    .min(1)
    .max(8),
});

const promptAssistResponseSchema = z.object({
  summary: z.string().min(1),
  chosen_terms: z
    .array(
      z.object({
        slug: z.string().min(1),
        term_no: z.string().min(1),
        relevance_pct: z.number().int().min(0).max(100),
        why: z.string().min(1),
        how_to_use: z.string().min(1),
      })
    )
    .min(1)
    .max(8),
  expanded_prompt: z.string().min(1),
  issues: z
    .array(
      z.object({
        issue: z.string().min(1),
        fix: z.string().min(1),
      })
    )
    .min(1)
    .max(6),
  follow_up: z.string().optional(),
});

const buildScript10sResponseSchema = z.object({
  concept: z.string().min(1),
  format: z.union([z.literal("9:16"), z.literal("16:9")]),
  seconds: z.number().int().min(8).max(12),
  beats: z
    .array(
      z.object({
        t: z.string().min(1),
        vo: z.string().min(1),
        on_screen: z.string().min(1),
        shot: z.string().min(1),
      })
    )
    .min(3)
    .max(5),
  shot_list: z.array(z.string().min(1)).min(3).max(6),
  cta: z.string().min(1),
  sfx_hint: z.string().min(1),
  variants: z
    .array(
      z.object({
        angle: z.string().min(1),
        vo: z.string().min(1),
        on_screen: z.string().min(1),
      })
    )
    .min(2)
    .max(3),
});

export type TransformPromptResponse = z.infer<typeof transformPromptResponseSchema>;
export type ExerciseCompareResponse = z.infer<typeof exerciseCompareResponseSchema>;
export type BuildScript10sResponse = z.infer<typeof buildScript10sResponseSchema>;
export type CampaignRecommendResponse = z.infer<typeof campaignRecommendResponseSchema>;
export type CampaignChatResponse = z.infer<typeof campaignChatResponseSchema>;
export type PromptAssistResponse = z.infer<typeof promptAssistResponseSchema>;

export type LlmResult =
  | { task: "transform_prompt"; data: TransformPromptResponse }
  | { task: "exercise_compare"; data: ExerciseCompareResponse }
  | { task: "build_script_10s"; data: BuildScript10sResponse }
  | { task: "campaign_recommend"; data: CampaignRecommendResponse }
  | { task: "campaign_chat"; data: CampaignChatResponse }
  | { task: "prompt_assist"; data: PromptAssistResponse };

export type LlmProviderInfo = {
  name: "openrouter" | "gemini" | "mock" | "cloudflare" | "fal" | "pollinations";
  model: string;
  cached: boolean;
};

const syntaxProtocolRewriteSchema = z.object({
  improved_prompt: z.string().min(1),
  changes: z
    .array(
      z.object({
        reason: z.string().min(1),
        before: z.string().min(1),
        after: z.string().min(1),
      })
    )
    .min(1),
});

export type SyntaxProtocolRewrite = z.infer<typeof syntaxProtocolRewriteSchema>;

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const OPENROUTER_URL =
  process.env.OPENROUTER_API_URL?.trim() ||
  "https://openrouter.ai/api/v1/chat/completions";

const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL?.trim() ||
  "qwen/qwen2.5-7b-instruct:free";

const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() ||
  "gemini-2.5-flash";

const GEMINI_URL =
  process.env.GEMINI_API_URL?.trim() ||
  "https://generativelanguage.googleapis.com/v1beta/models";

function toText(value: unknown): string {
  return String(value ?? "").trim();
}

function extractJsonString(raw: string): string {
  const source = String(raw ?? "").trim();
  if (!source) return "";

  const fenced = source.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const first = source.indexOf("{");
  const last = source.lastIndexOf("}");
  if (first >= 0 && last > first) {
    return source.slice(first, last + 1).trim();
  }

  return source;
}

function parseJsonObject(raw: string): Record<string, unknown> | null {
  const candidate = extractJsonString(raw);
  if (!candidate) return null;

  try {
    const parsed = JSON.parse(candidate) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function fallbackSyntaxRewrite(prompt: string): SyntaxProtocolRewrite {
  const trimmed = toText(prompt);
  const base = trimmed || "Produkt i naturlig miljø med tydelig handling";

  return {
    improved_prompt: [
      "Scene: kommersiell produktdemonstrasjon i ekte miljø.",
      "Lys: myk key light 45 grader, diffus fill, 5200K, naturlig kontrast.",
      "Materialer: behold realistisk overflaterespons, ingen plastisk glans.",
      "Anatomi/bevegelse: naturlig pust, stabil kroppsholdning, ingen deformasjon.",
      "Constraints: ingen nye objekter, stabil geometri, bevar logo og proporsjoner.",
      `Original idé: ${base}`,
    ].join(" "),
    changes: [
      {
        reason: "Fjernet vage estetikkord og la inn fysisk lysbeskrivelse",
        before: base,
        after: "Lys definert med retning, diffusjon og temperatur.",
      },
      {
        reason: "La til materialrespons og anatomiske begrensninger",
        before: "Uspesifisert materialfølelse",
        after: "Realistisk overflaterespons og naturlig kroppslig bevegelse.",
      },
    ],
  };
}

function syntaxProtocolSystemPrompt(): string {
  return [
    "You are rewriting a creative AI image/video prompt using structured semantic precision.",
    "Rewrite the user's prompt using these rules:",
    "- Remove aesthetic wish words like cinematic, realistic, masterpiece.",
    "- Replace vague descriptors with physical mechanisms.",
    "- Describe light source physics (angle, diffusion, temperature).",
    "- Describe material properties (surface response, texture).",
    "- Describe anatomical detail (muscle tension, breath).",
    "- Describe environmental constraints.",
    "- No poetic adjectives.",
    "- No buzzwords.",
    "- Output only JSON.",
    'Return {"improved_prompt":"...","changes":[{"reason":"...","before":"...","after":"..."}]}',
  ].join(" ");
}

function syntaxProtocolUserPrompt(prompt: string, context?: string): string {
  return [
    "Rewrite this prompt according to the rules.",
    `Context: ${toText(context) || "Commercial creative production"}`,
    `Prompt: ${toText(prompt)}`,
    "Language: Norwegian.",
    "Return only JSON.",
  ].join("\n");
}

export type CampaignSkillSummary = {
  slug: string;
  name: string;
  title_no: string;
  category: string;
  description_en: string;
};

let _skillCatalog: CampaignSkillSummary[] = [];

export function setCampaignSkillCatalog(skills: CampaignSkillSummary[]) {
  _skillCatalog = skills;
}

function buildSkillCatalogBlock(): string {
  if (_skillCatalog.length === 0) return "No skills loaded.";
  return _skillCatalog
    .map(
      (skill) =>
        `- ${skill.slug} | ${skill.name} | ${skill.category} | ${skill.description_en.slice(0, 120)}`
    )
    .join("\n");
}

function makeCampaignChatSystemPrompt(): string {
  return [
    "Du er en pedagogisk markedsføringsrådgiver som snakker norsk.",
    "Du hjelper studenter med å forstå og planlegge digitale kampanjer.",
    "Du skal alltid returnere gyldig JSON.",
    "",
    "Oppførsel:",
    "- Snakk direkte og konkret. Ikke vær vag.",
    "- Still oppfølgingsspørsmål for å spisse anbefalingene.",
    "- Prioriter GRATIS taktikker og organiske strategier over betalte.",
    "- Forklar HVORFOR en ferdighet er viktig, ikke bare HVA den er.",
    "- Vis tydelig hvor studenten bør fokusere innsatsen sin.",
    "- Vær ærlig om hva som krever budsjett vs. hva som er gratis.",
    "",
    "SKILL-KATALOG (slug | name | category | trigger):",
    buildSkillCatalogBlock(),
    "",
    "I hvert svar, inkluder:",
    '- "message": Din samtaletekst (norsk, pedagogisk, direkte)',
    '- "skills": (valgfritt) Array med anbefalte ferdigheter når relevant',
    '- "focus_areas": (valgfritt) Array med fokusområder som viser effort/impact og om det er gratis',
    '- "follow_up": (valgfritt) Et oppfølgingsspørsmål for å spisse anbefalingene',
    "",
    "Schema:",
    '{"message":"...","skills":[{"slug":"...","relevance_pct":85,"reasoning":"...","tips":["..."],"free":true}],"focus_areas":[{"area":"...","effort":"low","impact":"high","free":true,"action":"..."}],"follow_up":"..."}',
    "",
    "Regler for focus_areas:",
    "- effort: low/medium/high (hvor mye arbeid kreves)",
    "- impact: low/medium/high (forventet effekt)",
    "- free: true hvis det kan gjøres uten budsjett",
    "- Prioriter alltid high-impact + low-effort + free tiltak først",
    "- Maks 6 focus_areas per svar",
  ].join("\n");
}

function makeSystemPrompt(task: LlmTask): string {
  if (task === "prompt_assist") {
    return [
      "Du er en norsk prompt-veileder for prompt-utvider og ordforråd.",
      "Du skal kun returnere gyldig JSON.",
      "Ingen markdown, ingen tekst utenfor JSON.",
      "",
      "Regler:",
      "- Bruk KUN term-slugs som finnes i candidate_terms.",
      "- Prioriter presise, forklarte termvalg fremfor mange termvalg.",
      "- Forbedre draft_prompt uten å fjerne brukerens kjerneintensjon.",
      "- Vær konkret om svakheter og konkrete rettinger i issues.",
      "",
      "Schema:",
      '{"summary":"...","chosen_terms":[{"slug":"...","term_no":"...","relevance_pct":85,"why":"...","how_to_use":"..."}],"expanded_prompt":"...","issues":[{"issue":"...","fix":"..."}],"follow_up":"..."}',
    ].join("\n");
  }

  if (task === "campaign_recommend") {
    return [
      "Du er en norsk markedsføringskonsulent med ekspertise innen digital markedsføring.",
      "Du analyserer kampanjebriefs og anbefaler relevante marketing-ferdigheter fra katalogen under.",
      "Du skal kun returnere gyldig JSON.",
      "Ingen markdown, ingen forklarende tekst utenfor JSON.",
      "",
      "SKILL-KATALOG (slug | name | category | trigger):",
      buildSkillCatalogBlock(),
      "",
      "Regler:",
      "- Velg 3-6 ferdigheter som er mest relevante for brukerens kampanjebrief.",
      "- Gi en relevance_pct (0-100) basert på hvor viktig ferdigheten er for kampanjen.",
      "- Skriv reasoning og tips på norsk.",
      "- Tips skal være konkrete og handlingsorienterte for denne spesifikke kampanjen.",
      "- summary skal oppsummere kampanjens behov i 1-2 setninger på norsk.",
      "",
      "Schema:",
      '{"summary":"...","skills":[{"slug":"...","relevance_pct":85,"reasoning":"...","tips":["...","..."]}]}',
    ].join("\n");
  }

  if (task === "transform_prompt") {
    return [
      "Du er en norsk prompt-coach for kreativ kommersiell produksjon.",
      "Du skal kun returnere gyldig JSON.",
      "Ingen markdown, ingen forklarende tekst utenfor JSON.",
      "Svar kort, konkret og handlingsorientert.",
      "Schema:",
      '{"improved_prompt":"...","changes":[{"why":"...","example":"for -> etter"}],"checklist":["..."]}',
    ].join(" ");
  }

  if (task === "exercise_compare") {
    return [
      "Du er en norsk veileder for praktisk KI-opplæring.",
      "Du skal kun returnere gyldig JSON.",
      "Simuler to resultater i tekst: ett fra dårlig prompt og ett fra bra prompt.",
      "Schema:",
      '{"bad_prompt":"...","good_prompt":"...","bad_result":"...","good_result":"...","diff_summary":["..."],"why_good_wins":["..."]}',
    ].join(" ");
  }

  return [
    "Du er en norsk manusforfatter for 10 sekunders kampanjevideo.",
    "Du skal kun returnere gyldig JSON.",
    "Fokuser pa tydelig hook, benefit og CTA.",
    "Maks 6-10 ord i on_screen per beat.",
    "Schema:",
    '{"concept":"...","format":"9:16","seconds":10,"beats":[{"t":"0-2","vo":"...","on_screen":"...","shot":"..."}],"shot_list":["..."],"cta":"...","sfx_hint":"...","variants":[{"angle":"snill","vo":"...","on_screen":"..."},{"angle":"hard","vo":"...","on_screen":"..."}]}',
  ].join(" ");
}

function makeUserPrompt(task: LlmTask, payload: unknown): string {
  if (task === "prompt_assist") {
    const input = payload as PromptAssistPayload;
    const candidateLines = input.candidate_terms
      .slice(0, 16)
      .map(
        (term) =>
          `- ${term.slug} | ${term.term_no} | ${term.definition_no.slice(0, 120)} | ${term.promptImpact.slice(0, 120)}`
      )
      .join("\n");

    return [
      "Forbedre prompten med målrettet ordforråd.",
      `Brukerinput: ${toText(input.user_input)}`,
      `Outputtype: ${toText(input.output_type)}`,
      `Domene: ${toText(input.domain)}`,
      "",
      "Eksisterende draft_prompt:",
      toText(input.draft_prompt),
      "",
      "Candidate_terms (slug | term | definisjon | effekt):",
      candidateLines || "- (ingen)",
      "",
      "Velg 3-6 terms fra listen. Returner kun JSON i schemaet.",
    ].join("\n");
  }

  if (task === "campaign_recommend") {
    const input = payload as CampaignRecommendPayload;
    return [
      "Analyser denne kampanjebriéfen og anbefal relevante marketing-ferdigheter fra katalogen.",
      "",
      `Kampanjebrief: ${toText(input.brief)}`,
      "",
      "Velg 3-6 ferdigheter. Svar pa norsk. Returner kun JSON i schemaet.",
    ].join("\n");
  }

  if (task === "transform_prompt") {
    const input = payload as TransformPromptPayload;
    return [
      "Forbedre prompten under.",
      `Kontekst: ${toText(input.context) || "Ingen ekstra kontekst."}`,
      `Original prompt: ${toText(input.prompt)}`,
      "Svar pa norsk.",
      "Returner kun JSON i schemaet.",
    ].join("\n");
  }

  if (task === "exercise_compare") {
    const input = payload as ExerciseComparePayload;
    return [
      "Sammenlign dårlig og bra prompt for samme case.",
      `Kontekst: ${toText(input.context) || "Ingen ekstra kontekst."}`,
      `Dårlig prompt: ${toText(input.badPrompt)}`,
      `Bra prompt: ${toText(input.goodPrompt)}`,
      "Svar pa norsk.",
      "Returner kun JSON i schemaet.",
    ].join("\n");
  }

  const input = payload as BuildScript10sPayload;
  return [
    "Lag et produksjonsklart 10-sekunders kampanjevideo-manus.",
    `Produkt: ${toText(input.product)}`,
    `Målgruppe: ${toText(input.targetAudience)}`,
    `Kanal: ${toText(input.channel)}`,
    `Format: ${toText(input.format) || "9:16"}`,
    `Tone: ${toText(input.tone)}`,
    `Benefit: ${toText(input.benefit)}`,
    `CTA: ${toText(input.cta)}`,
    `Constraints: ${toText(input.constraints)}`,
    "Tidslinje ma være: 0-2 hook, 2-7 benefit, 7-10 CTA.",
    "Svar pa norsk.",
    "Returner kun JSON i schemaet.",
  ].join("\n");
}

async function callOpenRouter(messages: ChatMessage[], maxTokens: number): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY mangler");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "KiReklame KI Opplaring",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      temperature: 0.2,
      max_tokens: Math.max(300, Math.min(2200, Math.trunc(maxTokens))),
      messages,
      response_format: {
        type: "json_object",
      },
    }),
  });

  const json = (await response.json().catch(() => null)) as
    | {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
        error?: {
          message?: string;
        };
      }
    | null;

  if (!response.ok) {
    const message = json?.error?.message || `OpenRouter-feil (${response.status})`;
    throw new Error(message);
  }

  const content = json?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Tomt svar fra modell");
  }

  return content;
}

async function callGemini(messages: ChatMessage[], maxTokens: number): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY mangler");
  }

  // Separate system instruction from conversation messages
  const systemParts = messages
    .filter((m) => m.role === "system")
    .map((m) => ({ text: m.content }));

  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const url = `${GEMINI_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      maxOutputTokens: Math.max(300, Math.min(8192, Math.trunc(maxTokens))),
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  };

  if (systemParts.length > 0) {
    body.systemInstruction = { parts: systemParts };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await response.json().catch(() => null)) as
    | {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
        error?: { message?: string };
      }
    | null;

  if (!response.ok) {
    const message = json?.error?.message || `Gemini-feil (${response.status})`;
    throw new Error(message);
  }

  const content = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error("Tomt svar fra Gemini");
  }

  return content;
}

type LlmProvider = "openrouter" | "gemini";

async function callLlm(
  messages: ChatMessage[],
  maxTokens: number
): Promise<{ content: string; provider: LlmProvider; model: string }> {
  // Try OpenRouter first if key exists
  const orKey = process.env.OPENROUTER_API_KEY?.trim();
  if (orKey) {
    const content = await callOpenRouter(messages, maxTokens);
    return { content, provider: "openrouter", model: OPENROUTER_MODEL };
  }

  // Try Gemini if key exists
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    const content = await callGemini(messages, maxTokens);
    return { content, provider: "gemini", model: GEMINI_MODEL };
  }

  throw new Error("Ingen LLM API-nøkkel konfigurert (OPENROUTER_API_KEY eller GEMINI_API_KEY)");
}

function makeMockResult(task: LlmTask, payload: unknown): LlmResult {
  if (task === "prompt_assist") {
    const input = payload as PromptAssistPayload;
    const picked = input.candidate_terms.slice(0, 3);
    return {
      task,
      data: {
        summary:
          "Forslaget strammer inn prompten med tydeligere visuelle føringer og konkrete begrep fra ordforrådet.",
        chosen_terms: picked.map((term, index) => ({
          slug: term.slug,
          term_no: term.term_no,
          relevance_pct: Math.max(65, 90 - index * 10),
          why: `${term.term_no} gjør prompten mer styrbar og reduserer tolkning.`,
          how_to_use: `Bruk ${term.term_no} i beskrivelse av scene, lys eller komposisjon med tydelig effektmål.`,
        })),
        expanded_prompt: [
          toText(input.draft_prompt),
          "Stram inn: definer tydelig motiv, komposisjon, lyslogikk og avgrensning mot uønskede variasjoner.",
          "Lås kontinuitet mellom elementer og unngå diffuse stilord uten fysisk forklaring.",
        ]
          .filter(Boolean)
          .join("\n\n"),
        issues: [
          {
            issue: "Prompten er delvis generell i visualisering og mangler styringspunkter.",
            fix: "Legg til klare begrensninger for komposisjon, kameravinkel og hva som ikke skal endres.",
          },
          {
            issue: "Sammenheng mellom ønsket effekt og valgte begrep er ikke eksplisitt.",
            fix: "Knytt hvert fagbegrep til en konkret effekt i output (f.eks. lys, dybde, rytme).",
          },
        ],
        follow_up: "Vil du at forslagene skal vekte realisme, dramatikk eller produktfokus sterkest?",
      },
    };
  }

  if (task === "campaign_chat") {
    return {
      task,
      data: {
        message: "Hei! Jeg er kampanje-assistenten din. Fortell meg om kampanjen du planlegger – hva er målet, hvem er målgruppen, og hvilke kanaler vurderer du? Jo mer du forteller, jo bedre råd kan jeg gi deg.",
        skills: [],
        focus_areas: [],
        follow_up: "Hva er hovedmålet med kampanjen din?",
      },
    };
  }

  if (task === "campaign_recommend") {
    const input = payload as CampaignRecommendPayload;
    return {
      task,
      data: {
        summary: `Kampanjebriéfen handler om: ${toText(input.brief).slice(0, 80)}. Her er anbefalte ferdigheter.`,
        skills: [
          {
            slug: "positioning",
            relevance_pct: 90,
            reasoning: "Posisjonering er grunnleggende for enhver kampanje. Du må definere hvordan merkevaren skiller seg fra konkurrentene.",
            tips: [
              "Definer din unike verdiposisjon først.",
              "Identifiser 2-3 differensieringspunkter.",
            ],
          },
          {
            slug: "landing-page-optimization",
            relevance_pct: 80,
            reasoning: "Landingssiden er der konverteringen skjer. Optimaliser for tydelig budskap og handling.",
            tips: [
              "Bruk én tydelig CTA over folden.",
              "Match budskapet med annonsen som sender trafikk.",
            ],
          },
          {
            slug: "content-strategy",
            relevance_pct: 70,
            reasoning: "En god innholdsstrategi sikrer konsistent kommunikasjon gjennom kampanjen.",
            tips: [
              "Planlegg innhold for alle stadier i kundereisen.",
              "Gjenbruk kjernebudskap i ulike formater.",
            ],
          },
        ],
      },
    };
  }

  if (task === "transform_prompt") {
    const input = payload as TransformPromptPayload;
    return {
      task,
      data: {
        improved_prompt: [
          `Mål: ${toText(input.context) || "Lag kampanjemateriell"}`,
          `Prompt: ${toText(input.prompt)}`,
          "Format: definer 9:16 eller 16:9.",
          "Kamera: spesifiser bevegelse og tempo.",
          "Constraints: ingen nye objekter, behold logo, stabil geometri.",
        ].join("\n"),
        changes: [
          {
            why: "La til tydelig struktur",
            example: "Vag tekst -> mål + format + constraints",
          },
          {
            why: "Reduserte tolkning",
            example: "Generell estetikk -> konkret kamerainstruks",
          },
        ],
        checklist: [
          "Målgruppe er definert",
          "Format og kanal er definert",
          "Minst to constraints er med",
          "Leveranse er tydelig",
        ],
      },
    };
  }

  if (task === "exercise_compare") {
    const input = payload as ExerciseComparePayload;
    return {
      task,
      data: {
        bad_prompt: toText(input.badPrompt),
        good_prompt: toText(input.goodPrompt),
        bad_result:
          "Resultatet blir ujevnt: komposisjon varierer, produktfokus er uklart og detaljene spriker.",
        good_result:
          "Resultatet blir mer konsistent: tydelig komposisjon, stabil geometri og klart fokus pa produktets benefit.",
        diff_summary: [
          "Dårlig prompt er for vag og gir høy tolkning.",
          "Bra prompt styrer format, mål og begrensninger.",
        ],
        why_good_wins: [
          "Klare constraints reduserer hallusinasjoner.",
          "Konkret leveranse gir bedre beslutningsgrunnlag.",
        ],
      },
    };
  }

  const input = payload as BuildScript10sPayload;
  return {
    task,
    data: {
      concept: `Vis ${toText(input.product) || "produktet"} som rask løsning for ${toText(input.targetAudience) || "målgruppen"}`,
      format: toText(input.format) === "16:9" ? "16:9" : "9:16",
      seconds: 10,
      beats: [
        {
          t: "0-2",
          vo: "Kaos i hverdagen?",
          on_screen: "For mye kaos?",
          shot: "Håndholdt nærbilde av frustrasjon, rask start.",
        },
        {
          t: "2-7",
          vo: `${toText(input.product) || "Produktet"} gir deg ${toText(input.benefit) || "bedre flyt"}.`,
          on_screen: "Enklere. Raskere. Klar.",
          shot: "Cut til produkt i bruk, rolig dolly, tydelig benefit i handling.",
        },
        {
          t: "7-10",
          vo: `${toText(input.cta) || "Test i dag"}.`,
          on_screen: toText(input.cta) || "Test i dag",
          shot: "Packshot + logo + tydelig CTA på sluttkort.",
        },
      ],
      shot_list: [
        "Shot 1: Problem/trigger (0-2s)",
        "Shot 2: Løsning i bruk (2-5s)",
        "Shot 3: Benefit close-up (5-7s)",
        "Shot 4: Packshot + CTA (7-10s)",
      ],
      cta: toText(input.cta) || "Test i dag",
      sfx_hint: "Stram perkusjon i hook, lettere løft i beat 2, kort stinger på CTA.",
      variants: [
        {
          angle: "snill",
          vo: `${toText(input.product) || "Produktet"} gjør hverdagen enklere. ${toText(input.cta) || "Prøv nå"}.`,
          on_screen: "Enklere hverdag. Prøv nå.",
        },
        {
          angle: "hard",
          vo: `Stopp tidstyven. ${toText(input.product) || "Produktet"} leverer nå. ${toText(input.cta) || "Start i dag"}.`,
          on_screen: "Stopp tidstyven. Start nå.",
        },
      ],
    },
  };
}

function validateResult(task: LlmTask, parsed: Record<string, unknown> | null): LlmResult | null {
  if (!parsed) return null;

  if (task === "prompt_assist") {
    const validated = promptAssistResponseSchema.safeParse(parsed);
    return validated.success ? { task, data: validated.data } : null;
  }

  if (task === "transform_prompt") {
    const validated = transformPromptResponseSchema.safeParse(parsed);
    return validated.success ? { task, data: validated.data } : null;
  }

  if (task === "exercise_compare") {
    const validated = exerciseCompareResponseSchema.safeParse(parsed);
    return validated.success ? { task, data: validated.data } : null;
  }

  if (task === "campaign_recommend") {
    const validated = campaignRecommendResponseSchema.safeParse(parsed);
    return validated.success ? { task, data: validated.data } : null;
  }

  if (task === "campaign_chat") {
    const validated = campaignChatResponseSchema.safeParse(parsed);
    return validated.success ? { task, data: validated.data } : null;
  }

  const validated = buildScript10sResponseSchema.safeParse(parsed);
  return validated.success ? { task, data: validated.data } : null;
}

export async function rewritePromptWithSyntaxProtocol(
  prompt: string,
  context?: string,
  options: { maxTokens?: number } = {}
): Promise<{ data: SyntaxProtocolRewrite; provider: LlmProviderInfo }> {
  const sourcePrompt = toText(prompt);
  if (!sourcePrompt) {
    return {
      data: fallbackSyntaxRewrite(""),
      provider: {
        name: "mock",
        model: "syntax-fallback-v1",
        cached: false,
      },
    };
  }

  const messages: ChatMessage[] = [
    { role: "system", content: syntaxProtocolSystemPrompt() },
    { role: "user", content: syntaxProtocolUserPrompt(sourcePrompt, context) },
  ];

  const maxTokens = Math.max(250, Math.min(1200, options.maxTokens ?? 700));

  try {
    const first = await callLlm(messages, maxTokens);
    let validated = syntaxProtocolRewriteSchema.safeParse(parseJsonObject(first.content));

    if (!validated.success) {
      const retry = await callLlm(
        [
          ...messages,
          {
            role: "user",
            content:
              "Previous output was invalid JSON. Return only valid JSON with improved_prompt and changes.",
          },
        ],
        maxTokens
      );
      validated = syntaxProtocolRewriteSchema.safeParse(parseJsonObject(retry.content));
    }

    if (!validated.success) {
      return {
        data: fallbackSyntaxRewrite(sourcePrompt),
        provider: {
          name: "mock",
          model: "syntax-fallback-v1",
          cached: false,
        },
      };
    }

    return {
      data: validated.data,
      provider: {
        name: first.provider,
        model: first.model,
        cached: false,
      },
    };
  } catch (err) {
    console.error("[syntax_rewrite] LLM error:", err instanceof Error ? err.message : err);
    return {
      data: fallbackSyntaxRewrite(sourcePrompt),
      provider: {
        name: "mock",
        model: "syntax-fallback-v1",
        cached: false,
      },
    };
  }
}

export async function runCampaignChat(
  payload: CampaignChatPayload,
  options: { maxTokens?: number } = {}
): Promise<{ result: LlmResult; provider: LlmProviderInfo }> {
  const systemMsg: ChatMessage = { role: "system", content: makeCampaignChatSystemPrompt() };
  const history: ChatMessage[] = payload.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const messages: ChatMessage[] = [systemMsg, ...history];
  const maxTokens = Math.max(300, Math.min(4096, options.maxTokens ?? 2500));

  try {
    const first = await callLlm(messages, maxTokens);
    let validated = validateResult("campaign_chat", parseJsonObject(first.content));

    if (!validated) {
      const retryMessages: ChatMessage[] = [
        ...messages,
        {
          role: "user",
          content: "Forrige svar var ikke gyldig JSON. Svar med KUN gyldig JSON i riktig schema.",
        },
      ];
      const retry = await callLlm(retryMessages, maxTokens);
      validated = validateResult("campaign_chat", parseJsonObject(retry.content));
    }

    if (!validated) {
      return {
        result: makeMockResult("campaign_chat", payload),
        provider: { name: "mock", model: "local-mock-v1", cached: false },
      };
    }

    return {
      result: validated,
      provider: { name: first.provider, model: first.model, cached: false },
    };
  } catch (err) {
    console.error("[campaign_chat] LLM error:", err instanceof Error ? err.message : err);
    return {
      result: makeMockResult("campaign_chat", payload),
      provider: { name: "mock", model: "local-mock-v1", cached: false },
    };
  }
}

export async function runKiOpplaringTask(
  task: LlmTask,
  payload: unknown,
  options: { maxTokens?: number } = {}
): Promise<{ result: LlmResult; provider: LlmProviderInfo }> {
  const messages: ChatMessage[] = [
    { role: "system", content: makeSystemPrompt(task) },
    { role: "user", content: makeUserPrompt(task, payload) },
  ];

  const defaultMaxTokens =
    task === "campaign_recommend" ? 1200 : task === "prompt_assist" ? 1400 : 900;
  const maxTokensCap = task === "prompt_assist" ? 2200 : 1200;
  const maxTokens = Math.max(300, Math.min(maxTokensCap, options.maxTokens ?? defaultMaxTokens));

  try {
    const first = await callLlm(messages, maxTokens);
    let validated = validateResult(task, parseJsonObject(first.content));

    if (!validated) {
      const retryMessages: ChatMessage[] = [
        ...messages,
        {
          role: "user",
          content:
            "Forrige svar var ikke gyldig JSON i riktig schema. Svar pa nytt med KUN gyldig JSON.",
        },
      ];

      const retry = await callLlm(retryMessages, maxTokens);
      validated = validateResult(task, parseJsonObject(retry.content));
    }

    if (!validated) {
      return {
        result: makeMockResult(task, payload),
        provider: {
          name: "mock",
          model: "local-mock-v1",
          cached: false,
        },
      };
    }

    return {
      result: validated,
      provider: {
        name: first.provider,
        model: first.model,
        cached: false,
      },
    };
  } catch (err) {
    console.error(`[${task}] LLM error:`, err instanceof Error ? err.message : err);
    return {
      result: makeMockResult(task, payload),
      provider: {
        name: "mock",
        model: "local-mock-v1",
        cached: false,
      },
    };
  }
}
