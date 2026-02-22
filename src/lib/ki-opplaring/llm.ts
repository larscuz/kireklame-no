import { z } from "zod";

export type LlmTask = "transform_prompt" | "exercise_compare" | "build_script_10s";

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

export type LlmResult =
  | { task: "transform_prompt"; data: TransformPromptResponse }
  | { task: "exercise_compare"; data: ExerciseCompareResponse }
  | { task: "build_script_10s"; data: BuildScript10sResponse };

export type LlmProviderInfo = {
  name: "openrouter" | "mock" | "cloudflare" | "fal" | "pollinations";
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
  role: "system" | "user";
  content: string;
};

const OPENROUTER_URL =
  process.env.OPENROUTER_API_URL?.trim() ||
  "https://openrouter.ai/api/v1/chat/completions";

const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL?.trim() ||
  "qwen/qwen2.5-7b-instruct:free";

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

function makeSystemPrompt(task: LlmTask): string {
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
      max_tokens: Math.max(300, Math.min(1200, Math.trunc(maxTokens))),
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

function makeMockResult(task: LlmTask, payload: unknown): LlmResult {
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

  if (task === "transform_prompt") {
    const validated = transformPromptResponseSchema.safeParse(parsed);
    return validated.success ? { task, data: validated.data } : null;
  }

  if (task === "exercise_compare") {
    const validated = exerciseCompareResponseSchema.safeParse(parsed);
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
    const firstRaw = await callOpenRouter(messages, maxTokens);
    let validated = syntaxProtocolRewriteSchema.safeParse(parseJsonObject(firstRaw));

    if (!validated.success) {
      const retryRaw = await callOpenRouter(
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
      validated = syntaxProtocolRewriteSchema.safeParse(parseJsonObject(retryRaw));
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
        name: "openrouter",
        model: OPENROUTER_MODEL,
        cached: false,
      },
    };
  } catch {
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

export async function runKiOpplaringTask(
  task: LlmTask,
  payload: unknown,
  options: { maxTokens?: number } = {}
): Promise<{ result: LlmResult; provider: LlmProviderInfo }> {
  const messages: ChatMessage[] = [
    { role: "system", content: makeSystemPrompt(task) },
    { role: "user", content: makeUserPrompt(task, payload) },
  ];

  const maxTokens = Math.max(300, Math.min(1200, options.maxTokens ?? 900));

  try {
    const firstRaw = await callOpenRouter(messages, maxTokens);
    let validated = validateResult(task, parseJsonObject(firstRaw));

    if (!validated) {
      const retryMessages: ChatMessage[] = [
        ...messages,
        {
          role: "user",
          content:
            "Forrige svar var ikke gyldig JSON i riktig schema. Svar pa nytt med KUN gyldig JSON.",
        },
      ];

      const retryRaw = await callOpenRouter(retryMessages, maxTokens);
      validated = validateResult(task, parseJsonObject(retryRaw));
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
        name: "openrouter",
        model: OPENROUTER_MODEL,
        cached: false,
      },
    };
  } catch {
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
