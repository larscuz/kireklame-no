import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { slugify } from "./text-normalize.mjs";

const DEFAULT_OUT_PATH = path.join(
  process.cwd(),
  "data",
  "norskPrompting",
  "engine-seeds",
  "xml-terms-batch-v1.json"
);
const DEFAULT_REPORT_PATH = path.join(
  process.cwd(),
  "data",
  "norskPrompting",
  "engine-seeds",
  "xml-terms-batch-v1.report.json"
);
const DEFAULT_INPUT_CANDIDATES = [
  path.join(os.homedir(), "Downloads", "High_Impact_Prompt_Terms_100.xml"),
  path.join(os.homedir(), "Downloads", "Prompt_Engine_Terms_300.xml"),
];

const DOMAIN_MAP = new Map([
  ["kamera", "film"],
  ["camera", "film"],
  ["lys", "photo"],
  ["lighting", "photo"],
  ["komposisjon", "design"],
  ["composition", "design"],
  ["rendering", "vfx"],
  ["audio", "film"],
  ["lyd", "film"],
]);

const TAXONOMY_DOMAIN_MAP = new Map([
  ["kamera", "film-klipp"],
  ["camera", "film-klipp"],
  ["lys", "foto-lys"],
  ["lighting", "foto-lys"],
  ["komposisjon", "komposisjon-design"],
  ["composition", "komposisjon-design"],
  ["rendering", "post-vfx"],
  ["audio", "audio-produksjon"],
  ["lyd", "audio-produksjon"],
]);

function parseArgs(argv) {
  const out = {
    inputs: [],
    out: DEFAULT_OUT_PATH,
    report: DEFAULT_REPORT_PATH,
    minQuality: 0.55,
    includePlaceholderNo: false,
    includeExisting: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--input" && argv[i + 1]) {
      out.inputs.push(argv[i + 1]);
      i += 1;
      continue;
    }

    if (token === "--inputs" && argv[i + 1]) {
      out.inputs.push(
        ...argv[i + 1]
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean)
      );
      i += 1;
      continue;
    }

    if (token === "--out" && argv[i + 1]) {
      out.out = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--report" && argv[i + 1]) {
      out.report = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--min-quality" && argv[i + 1]) {
      out.minQuality = Math.max(0, Math.min(1, Number(argv[i + 1]) || out.minQuality));
      i += 1;
      continue;
    }

    if (token === "--include-placeholder-no") {
      out.includePlaceholderNo = true;
      continue;
    }

    if (token === "--include-existing") {
      out.includeExisting = true;
    }
  }

  if (!out.inputs.length) {
    out.inputs = DEFAULT_INPUT_CANDIDATES.filter((candidate) => fs.existsSync(candidate));
  }

  if (!out.inputs.length) {
    throw new Error(
      "Mangler input. Bruk --input <fil.xml> (kan gjentas) eller --inputs <fil1,fil2>."
    );
  }

  return out;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function decodeXmlEntities(value) {
  return String(value ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)));
}

function normalizeWhitespace(value) {
  return decodeXmlEntities(String(value ?? "")).replace(/\s+/g, " ").trim();
}

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));
  return normalizeWhitespace(match?.[1] || "");
}

function parseXmlTermsFromFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const terms = [];
  const regex = /<Term>([\s\S]*?)<\/Term>/gi;
  let match = regex.exec(raw);

  while (match) {
    const block = match[1] || "";
    terms.push({
      sourceFile: path.basename(filePath),
      english: extractTag(block, "English"),
      norwegian: extractTag(block, "Norwegian"),
      category: extractTag(block, "Category"),
      latentEffect: extractTag(block, "LatentEffect"),
      conflictRisk: extractTag(block, "ConflictRisk"),
      operationalUsage: extractTag(block, "OperationalUsage"),
    });

    match = regex.exec(raw);
  }

  return terms;
}

function isGenericHighImpactTerm(english, norwegian) {
  return (
    /^high impact term \d+$/i.test(english) ||
    /^h[øo]y effekt begrep \d+$/i.test(norwegian)
  );
}

function isPlaceholderNorwegian(value) {
  return /^norsk oversettelse av /i.test(value);
}

function qualityScore(term, placeholderNo, genericHighImpact) {
  let score = 0;

  if (term.english) score += 0.35;
  if (term.norwegian && !placeholderNo) score += 0.35;
  if (term.latentEffect && term.latentEffect.length >= 20) score += 0.15;
  if (term.operationalUsage && term.operationalUsage.length >= 20) score += 0.15;
  if (placeholderNo) score -= 0.25;
  if (genericHighImpact) score -= 0.6;

  return Math.max(0, Math.min(1, score));
}

function toDomain(categoryRaw) {
  const key = slugify(categoryRaw);
  return DOMAIN_MAP.get(key) || "ai";
}

function toTaxonomyDomain(categoryRaw) {
  const key = slugify(categoryRaw);
  return TAXONOMY_DOMAIN_MAP.get(key) || "prompting";
}

function toDefinition(term) {
  if (term.latentEffect) return term.latentEffect;
  if (term.conflictRisk) return `Kontrollbehov: ${term.conflictRisk}`;
  return `Fagterm for ${term.category || "medieproduksjon"}.`;
}

function toPromptImpact(term) {
  const parts = [];
  if (term.latentEffect) parts.push(term.latentEffect);
  if (term.conflictRisk) parts.push(`Kontrollpunkt: ${term.conflictRisk}`);
  if (term.operationalUsage) parts.push(`Operativ bruk: ${term.operationalUsage}`);
  return parts.join(" ").trim();
}

function coerceAbsolute(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
}

function loadExistingSlugs({ includeExisting }) {
  if (includeExisting) return new Set();

  const glossaryPath = path.join(process.cwd(), "src", "data", "norskPrompting", "glossary.ts");
  const generatedGlossaryPath = path.join(
    process.cwd(),
    "src",
    "data",
    "norskPrompting",
    "generated",
    "glossary.generated.ts"
  );
  const out = new Set();

  if (fs.existsSync(glossaryPath)) {
    const raw = fs.readFileSync(glossaryPath, "utf8");
    const regex = /term_no:\s*"([^"]+)"[\s\S]*?domain:\s*"([^"]+)"/g;
    let match = regex.exec(raw);
    while (match) {
      out.add(`${slugify(match[1])}-${match[2]}`);
      match = regex.exec(raw);
    }
  }

  if (fs.existsSync(generatedGlossaryPath)) {
    const raw = fs.readFileSync(generatedGlossaryPath, "utf8");
    const regex = /"slug":\s*"([^"]+)"/g;
    let match = regex.exec(raw);
    while (match) {
      out.add(match[1]);
      match = regex.exec(raw);
    }
  }

  return out;
}

function toRejection(reason, term, quality) {
  return {
    reason,
    qualityScore: quality,
    english: term.english,
    norwegian: term.norwegian,
    category: term.category,
    sourceFile: term.sourceFile,
  };
}

export function buildXmlTermBatch(options) {
  const inputs = options.inputs.map((entry) => coerceAbsolute(entry));
  const outPath = coerceAbsolute(options.out);
  const reportPath = coerceAbsolute(options.report);

  for (const filePath of inputs) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Finner ikke inputfil: ${filePath}`);
    }
  }

  const allParsed = inputs.flatMap((filePath) => parseXmlTermsFromFile(filePath));
  const existingSlugs = loadExistingSlugs({ includeExisting: options.includeExisting });

  const acceptedBySlug = new Map();
  const rejected = [];
  let duplicatesCollapsed = 0;
  let skippedExisting = 0;

  for (const term of allParsed) {
    const genericHighImpact = isGenericHighImpactTerm(term.english, term.norwegian);
    const placeholderNo = isPlaceholderNorwegian(term.norwegian);
    const quality = qualityScore(term, placeholderNo, genericHighImpact);

    if (!term.english) {
      rejected.push(toRejection("missing_english", term, quality));
      continue;
    }

    if (genericHighImpact) {
      rejected.push(toRejection("generic_high_impact_placeholder", term, quality));
      continue;
    }

    if (placeholderNo && !options.includePlaceholderNo) {
      rejected.push(toRejection("placeholder_norwegian", term, quality));
      continue;
    }

    if (quality < options.minQuality) {
      rejected.push(toRejection("below_quality_threshold", term, quality));
      continue;
    }

    const domain = toDomain(term.category);
    const termNo = placeholderNo ? term.english : term.norwegian;
    const slug = `${slugify(termNo)}-${domain}`;

    if (!options.includeExisting && existingSlugs.has(slug)) {
      skippedExisting += 1;
      rejected.push(toRejection("already_exists", term, quality));
      continue;
    }

    const item = {
      item_type: "term",
      slug,
      term_no: termNo,
      term_en: term.english,
      domain,
      definition_no: toDefinition(term),
      promptImpact: toPromptImpact(term),
      examples: term.operationalUsage ? [term.operationalUsage] : [],
      relatedTerms: [],
      aliases: [],
      tags: [
        `source:xml-import`,
        `source_file:${slugify(term.sourceFile) || "unknown"}`,
        `source_category:${slugify(term.category) || "ukjent"}`,
        "policy:text-output-only",
      ],
      metadata: {
        source: {
          type: "xml",
          file: term.sourceFile,
        },
        import: {
          qualityScore: quality,
          placeholderNorwegian: placeholderNo,
          categoryRaw: term.category,
        },
        taxonomy: {
          domain: toTaxonomyDomain(term.category),
          stage: "produksjon",
          kanal: "web",
          format: "16:9",
          mal: "kjennskap",
          strenghet: "middels",
          brandLock: true,
          textLock: true,
          productLock: false,
        },
        outputPolicy: "text-only",
        mediaGeneration: false,
      },
    };

    const previous = acceptedBySlug.get(slug);
    if (!previous) {
      acceptedBySlug.set(slug, { item, quality });
      continue;
    }

    if (quality > previous.quality) {
      acceptedBySlug.set(slug, { item, quality });
    }
    duplicatesCollapsed += 1;
  }

  const accepted = Array.from(acceptedBySlug.values())
    .map((entry) => entry.item)
    .sort((a, b) => String(a.term_no).localeCompare(String(b.term_no), "nb-NO"));

  const reasonCounts = rejected.reduce((acc, entry) => {
    acc[entry.reason] = (acc[entry.reason] || 0) + 1;
    return acc;
  }, {});

  const domainCounts = accepted.reduce((acc, entry) => {
    acc[entry.domain] = (acc[entry.domain] || 0) + 1;
    return acc;
  }, {});

  const payload = {
    meta: {
      name: "XML term batch v1",
      createdAt: new Date().toISOString(),
      sourceFiles: inputs.map((entry) => path.basename(entry)),
      minQuality: options.minQuality,
      includePlaceholderNo: options.includePlaceholderNo,
      includeExisting: options.includeExisting,
    },
    terms: accepted,
  };

  const report = {
    meta: payload.meta,
    counts: {
      parsed: allParsed.length,
      accepted: accepted.length,
      rejected: rejected.length,
      duplicatesCollapsed,
      skippedExisting,
    },
    domains: domainCounts,
    rejectedByReason: reasonCounts,
    acceptedPreview: accepted.slice(0, 25).map((entry) => ({
      slug: entry.slug,
      term_no: entry.term_no,
      term_en: entry.term_en,
      domain: entry.domain,
      source_file: entry.metadata?.source?.file || "",
    })),
    rejectedPreview: rejected.slice(0, 25),
  };

  ensureDir(outPath);
  ensureDir(reportPath);
  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  return {
    ok: true,
    outPath: path.relative(process.cwd(), outPath),
    reportPath: path.relative(process.cwd(), reportPath),
    counts: report.counts,
    domains: report.domains,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs(process.argv.slice(2));

  try {
    const result = buildXmlTermBatch(options);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ukjent feil";
    console.error(JSON.stringify({ ok: false, error: message }, null, 2));
    process.exit(1);
  }
}
