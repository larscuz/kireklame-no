import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const SOURCE_DIR = path.join(process.cwd(), "data", "marketing-skills-source");
const JSON_OUT = path.join(process.cwd(), "data", "norskPrompting", "engine-seeds", "marketing-skills-batch-v1.json");
const TS_OUT = path.join(process.cwd(), "src", "data", "norskPrompting", "marketingSkills.ts");
const TRANSLATION_CACHE_OUT = path.join(
  process.cwd(),
  "data",
  "norskPrompting",
  "engine-seeds",
  "marketing-skills-translation-no-v1.json"
);

const TRANSLATE_NO = process.argv.includes("--translate-no");
const TRANSLATION_PROMPT_VERSION = "no-v1";
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim() || "";

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function sha1(input) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

/** Minimal frontmatter parser — handles the fields we need. */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  let currentKey = null;
  for (const line of match[1].split("\n")) {
    const kvMatch = line.match(/^(\w[\w.-]*):\s*"?(.*?)"?\s*$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      meta[currentKey] = kvMatch[2];
    } else if (line.startsWith("  ") && currentKey === "metadata") {
      const nested = line.trim().match(/^(\w+):\s*(.+)$/);
      if (nested) meta[`metadata_${nested[1]}`] = nested[2];
    }
  }

  return { meta, body: match[2].trim() };
}

/** Extract related skills from related section */
function extractRelatedSkills(body) {
  const match = body.match(/##\s*(Related Skills|Relaterte ferdigheter)\s*\n([\s\S]*?)(?=\n##\s|\n$|$)/i);
  if (!match) return [];
  const links = [...match[2].matchAll(/\*\*([a-z][a-z0-9-]*)\*\*/g)];
  return links.map((m) => m[1]);
}

function loadTranslationCache() {
  if (!fs.existsSync(TRANSLATION_CACHE_OUT)) {
    return {
      meta: {
        version: TRANSLATION_PROMPT_VERSION,
        model: GEMINI_MODEL,
        updatedAt: new Date().toISOString(),
      },
      translations: {},
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(TRANSLATION_CACHE_OUT, "utf8"));
    return {
      meta: parsed.meta || {
        version: TRANSLATION_PROMPT_VERSION,
        model: GEMINI_MODEL,
        updatedAt: new Date().toISOString(),
      },
      translations: parsed.translations || {},
    };
  } catch (error) {
    console.warn("Could not parse translation cache, rebuilding:", error?.message || error);
    return {
      meta: {
        version: TRANSLATION_PROMPT_VERSION,
        model: GEMINI_MODEL,
        updatedAt: new Date().toISOString(),
      },
      translations: {},
    };
  }
}

function saveTranslationCache(cache) {
  ensureDir(TRANSLATION_CACHE_OUT);
  cache.meta = {
    version: TRANSLATION_PROMPT_VERSION,
    model: GEMINI_MODEL,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(TRANSLATION_CACHE_OUT, JSON.stringify(cache, null, 2), "utf8");
}

function sanitizeTranslatedMarkdown(md) {
  const trimmed = md.trim();
  if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
    return trimmed.replace(/^```[a-zA-Z0-9_-]*\n?/, "").replace(/\n?```$/, "").trim();
  }
  return trimmed;
}

async function callGeminiTranslate({ slug, titleNo, bodyEn }) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY mangler i miljøet.");
  }

  const system = [
    "Du er en senior fagoversetter for markedsføring.",
    "Du oversetter til norsk bokmål for praktisk arbeid i norsk marked.",
    "Returner kun markdown uten kodeblokker rundt hele svaret.",
  ].join("\n");

  const user = [
    `Skill slug: ${slug}`,
    `Foretrukket norsk tittel: ${titleNo}`,
    "",
    "Oppgave:",
    "Oversett markdown-innholdet til norsk bokmål.",
    "",
    "Krav:",
    "- Behold markdown-struktur: overskrifter, lister, tabeller, kodeblokker, lenker.",
    "- Behold filstier, kommandoer, URL-er, variabelnavn og slugs uendret.",
    "- Oversett bare vanlig tekst og forklaringer.",
    "- Oversett headingen 'Related Skills' til 'Relaterte ferdigheter'.",
    "- Slugene i relaterte ferdigheter (f.eks. **programmatic-seo**) skal ikke oversettes.",
    "- Tilpass ordvalg og eksempler til norsk marked (mindre målgrupper, ofte mindre budsjett, lokal kanalbruk).",
    "- Bruk NOK der beløp nevnes. Unngå oppdiktede konkrete markedsfakta.",
    "- Bruk bransjevanlig norsk: f.eks. konvertering, målgruppe, annonsebudsjett, organisk trafikk, søkeintensjon.",
    "- Hold stilen handlingsrettet, tydelig og faglig.",
    "",
    "Kildetekst (engelsk markdown):",
    bodyEn,
  ].join("\n");

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: system }],
      },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        maxOutputTokens: 12288,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini HTTP ${response.status}: ${text.slice(0, 700)}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part?.text || "").join("").trim();
  if (!text) {
    throw new Error("Tomt svar fra Gemini.");
  }

  const normalized = sanitizeTranslatedMarkdown(text);
  if (!normalized.startsWith("#")) {
    throw new Error("Oversettelse ser ugyldig ut (mangler markdown heading i starten).");
  }

  return normalized;
}

async function translateBodyNo({ slug, titleNo, bodyEn, cache }) {
  if (!TRANSLATE_NO) return bodyEn;

  const sourceHash = sha1(bodyEn);
  const cached = cache.translations[slug];
  if (
    cached &&
    cached.sourceHash === sourceHash &&
    cached.promptVersion === TRANSLATION_PROMPT_VERSION &&
    typeof cached.content_md_no === "string" &&
    cached.content_md_no.trim().length > 0
  ) {
    return cached.content_md_no;
  }

  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const translated = await callGeminiTranslate({ slug, titleNo, bodyEn });
      cache.translations[slug] = {
        sourceHash,
        promptVersion: TRANSLATION_PROMPT_VERSION,
        translatedAt: new Date().toISOString(),
        content_md_no: translated,
      };
      saveTranslationCache(cache);
      return translated;
    } catch (error) {
      lastError = error;
      const msg = error?.message || String(error);
      console.warn(`[${slug}] translate attempt ${attempt}/3 failed: ${msg}`);
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
      }
    }
  }

  throw new Error(`[${slug}] Oversettelse feilet etter 3 forsøk: ${lastError?.message || lastError}`);
}

const SKILL_CATEGORIES = {
  "ab-test-setup": "analytics",
  "ad-creative": "paid",
  "ai-seo": "seo",
  "analytics-tracking": "analytics",
  "churn-prevention": "retention",
  "cold-email": "content",
  "competitor-alternatives": "strategy",
  "content-strategy": "content",
  "copy-editing": "content",
  "copywriting": "content",
  "email-sequence": "content",
  "form-cro": "cro",
  "free-tool-strategy": "growth",
  "launch-strategy": "strategy",
  "marketing-ideas": "strategy",
  "marketing-psychology": "strategy",
  "onboarding-cro": "cro",
  "page-cro": "cro",
  "paid-ads": "paid",
  "paywall-upgrade-cro": "cro",
  "popup-cro": "cro",
  "pricing-strategy": "strategy",
  "product-marketing-context": "foundation",
  "programmatic-seo": "seo",
  "referral-program": "growth",
  "revops": "sales",
  "sales-enablement": "sales",
  "schema-markup": "seo",
  "seo-audit": "seo",
  "signup-flow-cro": "cro",
  "site-architecture": "seo",
  "social-content": "content",
};

const NORWEGIAN = {
  "ab-test-setup": { title_no: "A/B-testing", description_no: "Planlegg og gjennomfør A/B-tester for å måle hva som fungerer best." },
  "ad-creative": { title_no: "Annonsekreativ", description_no: "Lag og forbedre annonsetekst og kreativt uttrykk for betalte kampanjer." },
  "ai-seo": { title_no: "KI-søkeoptimalisering", description_no: "Optimaliser innhold for KI-søk og KI-genererte svar." },
  "analytics-tracking": { title_no: "Analysesporing", description_no: "Sett opp og forbedre sporing av trafikk, hendelser og konverteringer." },
  "churn-prevention": { title_no: "Frafallsforebygging", description_no: "Reduser frafall med bedre oppfølging, dunning og målrettede tiltak." },
  "cold-email": { title_no: "Kald e-post", description_no: "Skriv B2B-kalde e-poster og oppfølgingssekvenser som skaper respons." },
  "competitor-alternatives": { title_no: "Konkurrent- og alternativsider", description_no: "Bygg sammenligningssider som støtter SEO, salg og tydelig posisjonering." },
  "content-strategy": { title_no: "Innholdsstrategi", description_no: "Planlegg innhold som dekker behov i markedet og bygger etterspørsel." },
  "copy-editing": { title_no: "Tekstredigering", description_no: "Forbedre eksisterende markedsføringstekster for klarhet og effekt." },
  "copywriting": { title_no: "Tekstforfatting", description_no: "Skriv overbevisende tekster for nettsider, annonser og kampanjer." },
  "email-sequence": { title_no: "E-postsekvenser", description_no: "Bygg automatiserte e-postløp for aktivering, nurturing og salg." },
  "form-cro": { title_no: "Skjemaoptimalisering", description_no: "Optimaliser skjemaer for høyere fullføring og bedre leadkvalitet." },
  "free-tool-strategy": { title_no: "Gratisverktøystrategi", description_no: "Bruk gratisverktøy som kanal for SEO, distribusjon og leads." },
  "launch-strategy": { title_no: "Lanseringsstrategi", description_no: "Planlegg lanseringer med tydelig målgruppe, budskap og kanalvalg." },
  "marketing-ideas": { title_no: "Markedsføringsideer", description_no: "Utvikle konkrete markedsføringsgrep for vekst i små og mellomstore markeder." },
  "marketing-psychology": { title_no: "Markedsføringspsykologi", description_no: "Bruk psykologiske prinsipper på en etisk og praktisk måte i kommunikasjon." },
  "onboarding-cro": { title_no: "Onboarding-optimalisering", description_no: "Forbedre onboarding for raskere tid-til-verdi og bedre aktivering." },
  "page-cro": { title_no: "Sidekonvertering (CRO)", description_no: "Øk konverteringsrate på landingssider og nøkkelsider." },
  "paid-ads": { title_no: "Betalte annonser", description_no: "Planlegg, test og optimaliser annonser med kontroll på budsjett og effekt." },
  "paywall-upgrade-cro": { title_no: "Betalingsmur-optimalisering", description_no: "Optimaliser oppgraderingsflater og betalingsmur for flere betalende kunder." },
  "popup-cro": { title_no: "Popup-optimalisering", description_no: "Design popups og modaler som konverterer uten å skade brukeropplevelsen." },
  "pricing-strategy": { title_no: "Prisstrategi", description_no: "Utform prisnivå, pakker og forankring som passer marked og målgruppe." },
  "product-marketing-context": { title_no: "Produktmarkedsføringskontekst", description_no: "Dokumenter produkt, målgruppe og posisjonering som fundament for markedsarbeidet." },
  "programmatic-seo": { title_no: "Programmatisk SEO", description_no: "Bygg skalerbare SEO-sider med maler, data og kvalitetssikring." },
  "referral-program": { title_no: "Henvisnings- og partnerprogram", description_no: "Utvikle referral- og affiliate-program som gir stabil vekst." },
  "revops": { title_no: "Inntektsoperasjoner (RevOps)", description_no: "Samordne marked, salg og kundereise for bedre inntektsflyt." },
  "sales-enablement": { title_no: "Salgsstøtte", description_no: "Lag materiell og prosesser som hjelper salgsteamet å vinne flere avtaler." },
  "schema-markup": { title_no: "Skjemamerking (Schema)", description_no: "Legg til strukturerte data for bedre synlighet i søk og KI-svar." },
  "seo-audit": { title_no: "SEO-revisjon", description_no: "Kartlegg tekniske og innholdsmessige SEO-avvik med tydelige tiltak." },
  "signup-flow-cro": { title_no: "Registreringsflyt-optimalisering", description_no: "Forbedre registreringsflyt for flere fullførte registreringer." },
  "site-architecture": { title_no: "Nettstedsarkitektur", description_no: "Planlegg sidehierarki, internlenking og URL-struktur for skalerbarhet." },
  "social-content": { title_no: "Sosialt innhold", description_no: "Planlegg og produser innhold som fungerer i sosiale kanaler i Norge." },
};

async function buildSkills() {
  const dirs = fs.readdirSync(SOURCE_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());
  const skills = [];
  const cache = loadTranslationCache();

  for (const dir of dirs.sort((a, b) => a.name.localeCompare(b.name))) {
    const skillPath = path.join(SOURCE_DIR, dir.name, "SKILL.md");
    if (!fs.existsSync(skillPath)) {
      console.warn(`Skipping ${dir.name}: no SKILL.md`);
      continue;
    }

    const raw = fs.readFileSync(skillPath, "utf-8");
    const { meta, body } = parseFrontmatter(raw);
    const slug = dir.name;
    const no = NORWEGIAN[slug] || { title_no: slug, description_no: "" };
    const category = SKILL_CATEGORIES[slug] || "foundation";
    const relatedSkills = extractRelatedSkills(body);

    let contentMd = body;
    if (TRANSLATE_NO) {
      process.stdout.write(`Translating ${slug} ... `);
      contentMd = await translateBodyNo({
        slug,
        titleNo: no.title_no,
        bodyEn: body,
        cache,
      });
      process.stdout.write("ok\n");
    }

    const titleMatch = contentMd.match(/^#\s+(.+)$/m);
    const name = titleMatch ? titleMatch[1].trim() : no.title_no;

    skills.push({
      slug,
      name,
      title_no: no.title_no,
      description_no: no.description_no,
      description_en: (meta.description || "").slice(0, 200),
      category,
      content_md: contentMd,
      version: meta.metadata_version || "1.0.0",
      relatedSkills,
    });
  }

  if (TRANSLATE_NO) {
    saveTranslationCache(cache);
  }

  return skills.sort((a, b) => a.slug.localeCompare(b.slug));
}

function writeJsonSeed(skills) {
  ensureDir(JSON_OUT);
  const items = skills.map((s) => ({ item_type: "marketing_skill", ...s }));
  fs.writeFileSync(JSON_OUT, JSON.stringify(items, null, 2), "utf-8");
  console.log(`Wrote ${items.length} skills to ${JSON_OUT}`);
}

function writeTsSeed(skills) {
  ensureDir(TS_OUT);

  const escapeStr = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");

  const entries = skills
    .map((s) => {
      const related = JSON.stringify(s.relatedSkills);
      return `  {
    slug: "${s.slug}",
    name: "${escapeStr(s.name)}",
    title_no: "${escapeStr(s.title_no)}",
    description_no: "${escapeStr(s.description_no)}",
    description_en: \`${escapeStr(s.description_en)}\`,
    category: "${s.category}",
    content_md: \`${escapeStr(s.content_md)}\`,
    version: "${s.version}",
    relatedSkills: ${related},
  }`;
    })
    .join(",\n");

  const ts = `import type { MarketingSkill } from "./types";

export const marketingSkills: MarketingSkill[] = [
${entries},
];

export const marketingSkillsBySlug = Object.fromEntries(
  marketingSkills.map((skill) => [skill.slug, skill])
) as Record<string, MarketingSkill>;
`;

  fs.writeFileSync(TS_OUT, ts, "utf-8");
  console.log(`Wrote ${skills.length} skills to ${TS_OUT}`);
}

async function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Missing source dir: ${SOURCE_DIR}`);
  }

  if (TRANSLATE_NO && !GEMINI_API_KEY) {
    throw new Error("--translate-no krever GEMINI_API_KEY i miljøet.");
  }

  if (TRANSLATE_NO) {
    console.log(`Using Gemini model: ${GEMINI_MODEL}`);
    console.log(`Translation cache: ${TRANSLATION_CACHE_OUT}`);
  }

  const skills = await buildSkills();
  writeJsonSeed(skills);
  writeTsSeed(skills);
  console.log(`\nDone: ${skills.length} marketing skills processed.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
