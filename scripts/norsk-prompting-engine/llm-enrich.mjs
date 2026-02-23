import { loadEnv } from "./env.mjs";
import { normalizeWhitespace, uniq } from "./text-normalize.mjs";

const ENRICHER_SYSTEM_PROMPT = `DU ER "Norsk Prompting Enricher".
Oppgave: Normaliser og berik innhold til norsk reklamefaglig presisjon uten å endre betydning.

Regler:
- Ikke finn på nye fakta, objekter, steder, eller krav som ikke finnes i input.
- Ikke gjør innhold mer dramatisk; gjør det mer presist.
- Bruk norsk fagterminologi for reklame, film/kamera/lys/VFX/arkitektur.
- Ikke kreativ generering. Kun normalisering, strukturering og sammenslåingsforslag.
- For templates og examples: bruk standard prompt-arkitektur i denne rekkefølgen:
  1) Mål (effekt + kanal + format)
  2) Målgruppe / Innsikt
  3) Kjernebudskap + CTA
  4) Motiv og produkt (låste elementer)
  5) Miljø / kontekst
  6) Kamera (linse, utsnitt, bevegelse)
  7) Lys (key/fill/rim, kvalitet, retning)
  8) Komposisjon / hierarki
  9) Brand locks (logo, typografi, farger, DME)
  10) Begrensninger
  11) Negativ preset
  12) Output-spesifikasjon
- Returner STRICT JSON som matcher schema.
- Hvis input er duplikat eller nær-duplikat: returner "decision": "merge" og foreslå hvilke felt som kan berikes.
- Hvis ren repetisjon: "decision": "reject".
- Hvis nytt konsept: "decision": "create".
- All output på norsk.`;

const FILLER_REPLACEMENTS = [
  [/\bultra cinematic\b/gi, "presis kameraføring"],
  [/\bbest quality\b/gi, "høy teknisk kvalitet"],
  [/\bmasterpiece\b/gi, "faglig presis utførelse"],
  [/\bepic lighting\b/gi, "definert lysretning og kontrast"],
  [/\bcinematic\b/gi, "filmatisk"],
  [/\bvibe\b/gi, "visuell tone"],
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function parseJsonLoose(text) {
  if (!text) return null;
  const direct = String(text).trim();

  try {
    return JSON.parse(direct);
  } catch {
    // ignore
  }

  const codeFenceMatch = direct.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeFenceMatch?.[1]) {
    try {
      return JSON.parse(codeFenceMatch[1]);
    } catch {
      // ignore
    }
  }

  const firstBrace = direct.indexOf("{");
  const lastBrace = direct.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = direct.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      return null;
    }
  }

  return null;
}

function normalizeTextField(input) {
  let value = normalizeWhitespace(input || "");
  for (const [pattern, replacement] of FILLER_REPLACEMENTS) {
    value = value.replace(pattern, replacement);
  }
  return normalizeWhitespace(value);
}

function sanitizeArray(input) {
  if (!Array.isArray(input)) return [];
  return uniq(input.map((entry) => normalizeTextField(entry)).filter(Boolean));
}

function sanitizeMetadata(value) {
  if (!value || typeof value !== "object") return {};
  return value;
}

function hasAllArchitectureSections(text) {
  const normalized = String(text || "")
    .toLowerCase()
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a");

  const required = [
    "mal",
    "malgruppe",
    "kjernebudskap",
    "motiv",
    "miljo",
    "kamera",
    "lys",
    "komposisjon",
    "brand lock",
    "begrensning",
    "negativ",
    "output",
  ];

  return required.every((entry) => normalized.includes(entry));
}

function ensureArchitectureText({ shortInput, longOutput, outputType, metadata, negativePreset }) {
  const normalizedLong = normalizeTextField(longOutput || "");
  if (hasAllArchitectureSections(normalizedLong)) return normalizedLong;

  const taxonomy = metadata && typeof metadata === "object" && metadata.taxonomy ? metadata.taxonomy : {};
  const effect = normalizeTextField(taxonomy.mal || "ikke spesifisert");
  const channel = normalizeTextField(taxonomy.kanal || "ikke spesifisert");
  const format = normalizeTextField(taxonomy.format || "ikke spesifisert");
  const audience = normalizeTextField(taxonomy.malgruppe || "ikke spesifisert");
  const insight = normalizeTextField(taxonomy.innsikt || "ikke spesifisert");
  const cta = normalizeTextField(taxonomy.cta || "ikke spesifisert");
  const brandLock = taxonomy.brandLock ? "Brand-elementer er låst." : "Brand-lock er ikke spesifisert.";
  const textLock = taxonomy.textLock ? "Tekst-lock er aktiv." : "Tekst-lock er ikke spesifisert.";
  const productLock = taxonomy.productLock ? "Produkt-lock er aktiv." : "Produkt-lock er ikke spesifisert.";
  const base = normalizeTextField(shortInput || "Ingen kort input oppgitt.");

  const lines = [
    `1) Mål (effekt + kanal + format): ${effect}. Kanal ${channel}. Format ${format}.`,
    `2) Målgruppe / Innsikt: Målgruppe ${audience}. Innsikt ${insight}.`,
    `3) Kjernebudskap + CTA: Budskap ${base}. CTA ${cta}.`,
    `4) Motiv og produkt (låste elementer): Beskriv motiv og produkt tydelig. ${productLock}`,
    "5) Miljø / kontekst: Miljø og kontekst skal være tydelig definert og produksjonsrelevant.",
    "6) Kamera (linse, utsnitt, bevegelse): Oppgi brennvidde, utsnitt, kameraplassering og eventuell bevegelse.",
    "7) Lys (key/fill/rim, kvalitet, retning): Definer key/fill/rim og lysretning med fysisk plausibilitet.",
    "8) Komposisjon / hierarki: Definer forgrunn, mellomgrunn, bakgrunn og budskaphierarki.",
    `9) Brand locks (logo, typografi, farger, DME): ${brandLock} ${textLock}`,
    "10) Begrensninger: Ingen uønskede objekter, ingen feil produktgeometri, ingen brudd i konsistens.",
    `11) Negativ preset: ${normalizeTextField(negativePreset || "ikke valgt")}.`,
    `12) Output-spesifikasjon: outputType ${normalizeTextField(outputType || "image")}, lever produksjonsklar struktur.`,
  ];

  return lines.join("\n");
}

function sanitizeObjectContent(itemType, content) {
  const src = content && typeof content === "object" ? content : {};

  if (itemType === "rule") {
    return {
      id: normalizeTextField(src.id),
      name: normalizeTextField(src.name),
      category: normalizeTextField(src.category),
      severity: Number(src.severity) || 3,
      description: normalizeTextField(src.description),
      appliesTo: normalizeTextField(src.appliesTo || "all"),
      addToPrompt: normalizeTextField(src.addToPrompt),
      negativeAdd: normalizeTextField(src.negativeAdd),
      tags: sanitizeArray(src.tags),
      metadata: sanitizeMetadata(src.metadata),
    };
  }

  if (itemType === "term") {
    return {
      slug: normalizeTextField(src.slug),
      term_no: normalizeTextField(src.term_no),
      term_en: normalizeTextField(src.term_en),
      domain: normalizeTextField(src.domain || "ai"),
      definition_no: normalizeTextField(src.definition_no),
      promptImpact: normalizeTextField(src.promptImpact),
      examples: sanitizeArray(src.examples),
      relatedTerms: sanitizeArray(src.relatedTerms),
      aliases: sanitizeArray(src.aliases),
      tags: sanitizeArray(src.tags),
      metadata: sanitizeMetadata(src.metadata),
    };
  }

  if (itemType === "template") {
    const blocks = Array.isArray(src.blocks)
      ? src.blocks
          .map((block, index) => ({
            id: normalizeTextField(block?.id || `blokk-${index + 1}`),
            title: normalizeTextField(block?.title || `Blokk ${index + 1}`),
            instruction: normalizeTextField(block?.instruction || block?.text || ""),
          }))
          .filter((block) => block.instruction)
      : [];

    return {
      id: normalizeTextField(src.id),
      title: normalizeTextField(src.title),
      useCase: normalizeTextField(src.useCase),
      outputType: normalizeTextField(src.outputType || "image"),
      domain: normalizeTextField(src.domain || "film-vfx"),
      blocks,
      recommendedRules: sanitizeArray(src.recommendedRules),
      tags: sanitizeArray(src.tags),
      metadata: sanitizeMetadata(src.metadata),
    };
  }

  if (itemType === "example") {
    const metadata = sanitizeMetadata(src.metadata);
    const negativePreset = normalizeTextField(src.negativePreset);
    return {
      slug: normalizeTextField(src.slug),
      title: normalizeTextField(src.title),
      outputType: normalizeTextField(src.outputType || "image"),
      domain: normalizeTextField(src.domain || "film-vfx"),
      shortInput: normalizeTextField(src.shortInput),
      longOutput: ensureArchitectureText({
        shortInput: src.shortInput,
        longOutput: src.longOutput,
        outputType: src.outputType,
        metadata,
        negativePreset,
      }),
      whyWorks: sanitizeArray(src.whyWorks),
      ruleIds: sanitizeArray(src.ruleIds),
      termSlugs: sanitizeArray(src.termSlugs),
      updatedAt: normalizeTextField(src.updatedAt),
      negativePreset,
      tags: sanitizeArray(src.tags),
      metadata,
    };
  }

  if (itemType === "negative_preset") {
    return {
      id: normalizeTextField(src.id),
      title: normalizeTextField(src.title),
      description: normalizeTextField(src.description),
      items: sanitizeArray(src.items),
      tags: sanitizeArray(src.tags),
      metadata: sanitizeMetadata(src.metadata),
    };
  }

  return {
    id: normalizeTextField(src.id),
    navn: normalizeTextField(src.navn),
    effekt: normalizeTextField(src.effekt),
    representasjonsskift: normalizeTextField(src.representasjonsskift),
    promptStruktur: {
      mal: normalizeTextField(src?.promptStruktur?.mal || ""),
    },
    sterkeBegreper: sanitizeArray(src.sterkeBegreper),
    tags: sanitizeArray(src.tags),
    metadata: sanitizeMetadata(src.metadata),
  };
}

function localEnrichment({ itemType, canonical, dedupeDecision }) {
  const contentJson = sanitizeObjectContent(itemType, canonical.contentJson);

  return {
    decision: dedupeDecision,
    contentJson,
    title: normalizeTextField(canonical.title),
    slug: normalizeTextField(canonical.slug),
    enrichmentNotes: "Lokal normalisering brukt (ingen ekstern LLM-tilkobling).",
    confidence: 0.74,
    provider: "local",
    model: "rule-normalizer-v1",
  };
}

function buildSchemaHint(itemType) {
  if (itemType === "rule") {
    return {
      id: "string",
      name: "string",
      category:
        "Konsistens|Kamera|Komposisjon|Kontinuitet|Realisme|Tekst i bilde|Historisk troverdighet|Fysikk|Produksjonslogikk|Lys|Reklame Standard|Debugger|Anti-AI-look",
      severity: "number 1-5",
      description: "string",
      appliesTo: "all|image|video|text",
      addToPrompt: "string",
      negativeAdd: "string",
      tags: ["string"],
      metadata: {},
    };
  }

  if (itemType === "term") {
    return {
      slug: "string",
      term_no: "string",
      term_en: "string",
      domain: "film|vfx|arch|ai|photo|design",
      definition_no: "string",
      promptImpact: "string",
      examples: ["string"],
      relatedTerms: ["string"],
      aliases: ["string"],
      tags: ["string"],
      metadata: {},
    };
  }

  if (itemType === "template") {
    return {
      id: "string",
      title: "string",
      useCase: "string",
      outputType: "image|video|text",
      domain: "film-vfx|arkitektur|produkt|dokumentar|sosiale-medier|historisk|redaksjonell|design-system",
      blocks: [{ id: "string", title: "string", instruction: "string" }],
      recommendedRules: ["string"],
      tags: ["string"],
      metadata: {},
    };
  }

  if (itemType === "example") {
    return {
      slug: "string",
      title: "string",
      outputType: "image|video|text",
      domain: "film-vfx|arkitektur|produkt|dokumentar|sosiale-medier|historisk|redaksjonell|design-system",
      shortInput: "string",
      longOutput: "string",
      whyWorks: ["string"],
      ruleIds: ["string"],
      termSlugs: ["string"],
      updatedAt: "YYYY-MM-DD",
      negativePreset: "string",
      tags: ["string"],
      metadata: {},
    };
  }

  if (itemType === "negative_preset") {
    return {
      id: "string",
      title: "string",
      description: "string",
      items: ["string"],
      tags: ["string"],
      metadata: {},
    };
  }

  return {
    id: "string",
    navn: "string",
    effekt: "string",
    representasjonsskift: "string",
    promptStruktur: { mal: "string" },
    sterkeBegreper: ["string"],
    tags: ["string"],
    metadata: {},
  };
}

async function callOpenRouter({ env, itemType, canonical, existingContent, dedupeDecision }) {
  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const model = env.NP_ENRICHER_MODEL || "qwen/qwen2.5-14b-instruct:free";

  const userPayload = {
    item_type: itemType,
    dedupe_decision_hint: dedupeDecision,
    canonical: {
      slug: canonical.slug,
      title: canonical.title,
      content_json: canonical.contentJson,
    },
    existing_candidate_content_json: existingContent || null,
    expected_schema: buildSchemaHint(itemType),
  };

  const requestBody = {
    model,
    temperature: 0.1,
    messages: [
      { role: "system", content: ENRICHER_SYSTEM_PROMPT },
      {
        role: "user",
        content:
          "Svar med STRICT JSON i format: {\"decision\":\"reject|merge|create\",\"confidence\":0-1,\"enrichment_notes\":\"...\",\"content_json\":{...}}.\nInput:\n" +
          JSON.stringify(userPayload),
      },
    ],
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": env.NP_ENRICHER_REFERER || "https://kireklame.no",
      "X-Title": "Norsk Prompting Data Engine",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const txt = await response.text().catch(() => "");
    throw new Error(`OpenRouter-feil (${response.status}): ${txt.slice(0, 300)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  let parsed = parseJsonLoose(content);
  if (!parsed) {
    const retryBody = {
      ...requestBody,
      messages: [
        ...requestBody.messages,
        {
          role: "user",
          content:
            "Forrige svar var ikke gyldig JSON. Returner kun gyldig JSON med nøyaktig formatet uten forklaring.",
        },
      ],
    };

    const retryRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.NP_ENRICHER_REFERER || "https://kireklame.no",
        "X-Title": "Norsk Prompting Data Engine",
      },
      body: JSON.stringify(retryBody),
    });

    if (!retryRes.ok) {
      const txt = await retryRes.text().catch(() => "");
      throw new Error(`OpenRouter retry-feil (${retryRes.status}): ${txt.slice(0, 300)}`);
    }

    const retryData = await retryRes.json();
    parsed = parseJsonLoose(retryData?.choices?.[0]?.message?.content);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("LLM returnerte ikke gyldig JSON etter retry.");
  }

  const decision = ["reject", "merge", "create"].includes(parsed.decision)
    ? parsed.decision
    : dedupeDecision;

  const contentJson = sanitizeObjectContent(itemType, parsed.content_json || canonical.contentJson);

  return {
    decision,
    contentJson,
    title: normalizeTextField(canonical.title),
    slug: normalizeTextField(canonical.slug),
    enrichmentNotes: normalizeTextField(parsed.enrichment_notes || "LLM normaliserte innholdet."),
    confidence: clamp(Number(parsed.confidence) || 0, 0, 1),
    provider: "openrouter",
    model,
  };
}

export async function enrichCanonical({
  itemType,
  canonical,
  existingContent = null,
  dedupeDecision = "create",
  env = null,
}) {
  const loadedEnv = env || loadEnv();

  try {
    const llmResult = await callOpenRouter({
      env: loadedEnv,
      itemType,
      canonical,
      existingContent,
      dedupeDecision,
    });

    if (llmResult) {
      return llmResult;
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Ukjent LLM-feil";
    const local = localEnrichment({ itemType, canonical, dedupeDecision });
    return {
      ...local,
      enrichmentNotes: `${local.enrichmentNotes} Fallback etter LLM-feil: ${reason}`,
      confidence: 0.68,
    };
  }

  return localEnrichment({ itemType, canonical, dedupeDecision });
}
