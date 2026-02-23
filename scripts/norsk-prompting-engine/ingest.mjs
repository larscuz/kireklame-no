import fs from "node:fs";
import path from "node:path";
import { createDbClient } from "./db.mjs";

function parseArgs(argv) {
  const out = {
    file: "",
    itemType: "template",
    sourceTag: "Manual",
    languageHint: "no",
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--file" && argv[i + 1]) {
      out.file = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--item-type" && argv[i + 1]) {
      out.itemType = argv[i + 1];
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

  if (!out.file) {
    throw new Error("Mangler --file <path>.");
  }

  return out;
}

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (ch === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += ch;
  }

  cells.push(current.trim());
  return cells;
}

function parseCsv(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const entry = {};

    for (let i = 0; i < headers.length; i += 1) {
      entry[headers[i]] = values[i] ?? "";
    }

    return entry;
  });
}

function parseMarkdown(raw) {
  const chunks = raw
    .split(/\n\s*---+\s*\n/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (chunks.length > 1) return chunks;

  return raw
    .split(/\n(?=##\s+)/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

function parseInputFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const raw = fs.readFileSync(filePath, "utf8");

  if (ext === ".json") {
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    if (data && typeof data === "object") {
      const map = [
        ["rules", "rule"],
        ["terms", "term"],
        ["templates", "template"],
        ["examples", "example"],
        ["negativePresets", "negative_preset"],
        ["negative_presets", "negative_preset"],
        ["representationSwitches", "representation_switch"],
        ["representation_switches", "representation_switch"],
      ];

      const flattened = [];
      for (const [key, itemType] of map) {
        const entries = data[key];
        if (!Array.isArray(entries)) continue;

        for (const entry of entries) {
          if (entry && typeof entry === "object" && !Array.isArray(entry)) {
            flattened.push({ ...entry, item_type: entry.item_type || itemType });
          }
        }
      }

      if (flattened.length) return flattened;
    }
    return [data];
  }

  if (ext === ".jsonl") {
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  }

  if (ext === ".csv") {
    return parseCsv(raw);
  }

  if (ext === ".md" || ext === ".txt") {
    return parseMarkdown(raw);
  }

  if (ext === ".ts" || ext === ".js" || ext === ".mjs") {
    // MVP: TS/JS behandles som rå tekst for videre manuell eller LLM-normalisering i pipeline.
    return [raw];
  }

  return [raw];
}

function toQueueRow(item, { itemType, sourceTag, languageHint }) {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    const explicitType = item.item_type || item.itemType || item.type;
    const resolvedType = explicitType || itemType;

    const row = {
      item_type: resolvedType,
      raw_text: null,
      raw_json: item,
      source_tag: sourceTag,
      language_hint: languageHint,
      status: "pending",
    };

    if (typeof item.raw_text === "string") row.raw_text = item.raw_text;
    return row;
  }

  return {
    item_type: itemType,
    raw_text: String(item ?? ""),
    raw_json: null,
    source_tag: sourceTag,
    language_hint: languageHint,
    status: "pending",
  };
}

async function insertInChunks(db, rows, size = 250) {
  let inserted = 0;

  for (let i = 0; i < rows.length; i += size) {
    const chunk = rows.slice(i, i + size);
    const { error } = await db.from("np_ingest_queue").insert(chunk);
    if (error) throw error;
    inserted += chunk.length;
  }

  return inserted;
}

export async function ingestBatch(options) {
  const absolute = path.isAbsolute(options.file)
    ? options.file
    : path.join(process.cwd(), options.file);

  if (!fs.existsSync(absolute)) {
    throw new Error(`Finner ikke fil: ${absolute}`);
  }

  const items = parseInputFile(absolute);
  const rows = items.map((item) => toQueueRow(item, options));

  if (options.dryRun) {
    return {
      ok: true,
      dryRun: true,
      file: absolute,
      count: rows.length,
      preview: rows.slice(0, 3),
    };
  }

  const db = createDbClient();
  const inserted = await insertInChunks(db, rows);

  return {
    ok: true,
    dryRun: false,
    file: absolute,
    count: inserted,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const opts = parseArgs(process.argv.slice(2));

  ingestBatch(opts)
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      const message = error instanceof Error ? error.message : "Ukjent feil";
      console.error(JSON.stringify({ ok: false, error: message }, null, 2));
      process.exit(1);
    });
}
