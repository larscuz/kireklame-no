import { createDbClient } from "./db.mjs";

const DOMAINS = [
  "film-vfx",
  "arkitektur",
  "produkt",
  "dokumentar",
  "sosiale-medier",
  "historisk",
  "redaksjonell",
  "design-system",
];

const OUTPUT_TYPES = ["image", "video", "text"];

function parseArgs(argv) {
  const out = {
    count: 100,
    sourceTag: "SeedTemplates100",
    languageHint: "no",
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--count" && argv[i + 1]) {
      out.count = Math.max(1, Number(argv[i + 1]) || 100);
      i += 1;
      continue;
    }

    if (token === "--source-tag" && argv[i + 1]) {
      out.sourceTag = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--language-hint" && argv[i + 1]) {
      out.languageHint = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--dry-run") {
      out.dryRun = true;
    }
  }

  return out;
}

function pad(num) {
  return String(num).padStart(3, "0");
}

function buildTemplateSeed(index) {
  const domain = DOMAINS[index % DOMAINS.length];
  const outputType = OUTPUT_TYPES[index % OUTPUT_TYPES.length];
  const n = index + 1;
  const id = `seed-template-${pad(n)}`;

  return {
    id,
    title: `Mal ${pad(n)}: ${domain}`,
    useCase: `Strukturert ${outputType}-prompt for ${domain} med fokus pa konsistens og leveransekontroll.`,
    outputType,
    domain,
    blocks: [
      {
        id: "mal",
        title: "Mal",
        instruction: "Definer tydelig mal og hva leveransen skal oppna.",
      },
      {
        id: "motiv",
        title: "Motiv",
        instruction: "Beskriv motiv og handling med konkret fysisk kontekst.",
      },
      {
        id: "kamera",
        title: "Kamera",
        instruction: "Spesifiser kamera, utsnitt, bevegelse og stabilitet.",
      },
      {
        id: "lys",
        title: "Lys",
        instruction: "Definer lysretning, kvalitet, intensitet og kontrastforhold.",
      },
      {
        id: "begrensninger",
        title: "Begrensninger",
        instruction: "List hva som ikke skal endres eller introduseres av modellen.",
      },
    ],
    recommendedRules: [
      "motiv-for-stil",
      "las-identitet-kontinuitet",
      "definer-lysretning-kvalitet",
      "avslutt-med-klare-begrensninger",
    ],
    tags: [domain, outputType, "seed"],
    metadata: {
      generatedBy: "np-seed-templates",
      batch: "mvp",
      index: n,
    },
  };
}

async function insertRows(db, rows, size = 250) {
  let inserted = 0;

  for (let i = 0; i < rows.length; i += size) {
    const chunk = rows.slice(i, i + size);
    const { error } = await db.from("np_ingest_queue").insert(chunk);
    if (error) throw error;
    inserted += chunk.length;
  }

  return inserted;
}

export async function seedTemplates(options = {}) {
  const count = options.count || 100;
  const sourceTag = options.sourceTag || "SeedTemplates100";
  const languageHint = options.languageHint || "no";
  const dryRun = Boolean(options.dryRun);

  const payload = Array.from({ length: count }, (_, index) => buildTemplateSeed(index));
  const rows = payload.map((entry) => ({
    item_type: "template",
    raw_text: null,
    raw_json: entry,
    source_tag: sourceTag,
    language_hint: languageHint,
    status: "pending",
  }));

  if (dryRun) {
    return {
      ok: true,
      dryRun: true,
      count: rows.length,
      preview: rows.slice(0, 3),
    };
  }

  const db = createDbClient();
  const inserted = await insertRows(db, rows);

  return {
    ok: true,
    dryRun: false,
    count: inserted,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const opts = parseArgs(process.argv.slice(2));

  seedTemplates(opts)
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      const message = error instanceof Error ? error.message : "Ukjent feil";
      console.error(JSON.stringify({ ok: false, error: message }, null, 2));
      process.exit(1);
    });
}
