import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf8");
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if (
      (val.startsWith("\"") && val.endsWith("\"")) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function loadEnv() {
  return {
    ...loadEnvFile(path.join(ROOT, ".env")),
    ...loadEnvFile(path.join(ROOT, ".env.local")),
    ...process.env,
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {
    limit: null,
    onlyReal: false,
    dryRun: false,
    apply: false,
    outputDir: "tmp",
    noAi: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === "--limit") {
      const v = Number(args[i + 1]);
      out.limit = Number.isFinite(v) ? v : null;
      i += 1;
      continue;
    }
    if (a === "--only-real") out.onlyReal = true;
    if (a === "--dry-run") out.dryRun = true;
    if (a === "--apply") out.apply = true;
    if (a === "--no-ai") out.noAi = true;
    if (a === "--output-dir") {
      out.outputDir = args[i + 1] || "tmp";
      i += 1;
    }
  }
  return out;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUrl(input) {
  if (!input) return null;
  const trimmed = String(input).trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

function sameOrigin(a, b) {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
}

function decodeHtmlEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;|&laquo;|&raquo;/g, "\"")
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&ndash;|&mdash;/g, "-")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(html) {
  if (!html) return "";
  return decodeHtmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function pickLongish(texts, maxItems = 6) {
  return texts
    .map((x) => x.trim())
    .filter(Boolean)
    .filter((x) => x.length >= 50)
    .sort((a, b) => b.length - a.length)
    .slice(0, maxItems);
}

function extractTagContents(html, tagName) {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi");
  const out = [];
  let match;
  while ((match = re.exec(html))) {
    const text = stripTags(match[1]);
    if (text) out.push(text);
  }
  return out;
}

function extractMetaDescription(html) {
  const patterns = [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i,
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return stripTags(m[1]).trim();
  }
  return "";
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m?.[1] ? stripTags(m[1]).trim() : "";
}

function extractCandidateLinks(baseUrl, html) {
  const re = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  const out = [];
  let match;

  const wanted = [
    "about",
    "om",
    "kontakt",
    "contact",
    "services",
    "tjenester",
    "hvem-vi-er",
    "hva-vi-gjor",
    "case",
    "work",
  ];

  while ((match = re.exec(html))) {
    const href = (match[1] || "").trim();
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      continue;
    }
    let absolute = null;
    try {
      absolute = new URL(href, baseUrl).toString();
    } catch {
      absolute = null;
    }
    if (!absolute) continue;
    if (!sameOrigin(baseUrl, absolute)) continue;
    const lower = absolute.toLowerCase();
    if (!wanted.some((k) => lower.includes(k))) continue;
    out.push(absolute.split("#")[0]);
  }

  return Array.from(new Set(out)).slice(0, 3);
}

async function fetchPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "user-agent": "KiReklameBot/0.2 (description enrichment; respectful crawl)",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, url, text };
  } catch (err) {
    return { ok: false, status: 0, url, text: "", error: String(err) };
  } finally {
    clearTimeout(timeout);
  }
}

function sentenceSplit(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function dedupeSentences(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = item.toLowerCase().replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function tidyDescription(text, maxLen = 720) {
  let s = text.replace(/\s+/g, " ").trim();
  if (!s) return s;
  if (s.length <= maxLen) return s;
  s = s.slice(0, maxLen);
  s = s.replace(/\s+\S*$/, "").trim();
  if (!/[.!?]$/.test(s)) s += ".";
  return s;
}

function buildHeuristicDescription(row, evidence) {
  const name = row.name?.trim() || "Selskapet";
  const short = (row.short_description || "").trim();
  const meta = (evidence.metaDescription || "").trim();
  const title = (evidence.title || "").trim();
  const corpus = [short, meta, ...(evidence.paragraphs || []), ...(evidence.headings || [])]
    .join(" ")
    .toLowerCase();

  const serviceSignals = [
    { re: /\b(reklamefilm|commercial|kampanjefilm)\b/i, label: "reklamefilm og kampanjeinnhold" },
    { re: /\b(video|filmproduksjon|videoproduksjon|short-form|reels)\b/i, label: "videoproduksjon for digitale flater" },
    { re: /\b(so ?me|sosiale medier|social media)\b/i, label: "innhold til sosiale medier" },
    { re: /\b(design|grafisk profil|visuell identitet|branding)\b/i, label: "design og merkevareutvikling" },
    { re: /\b(web|nettside|webutvikling|ux|ui)\b/i, label: "nettsider og digitale brukeropplevelser" },
    { re: /\b(markedsføring|annonsering|performance|kampanje)\b/i, label: "markedsføring og kampanjearbeid" },
    { re: /\b(strategy|strategi|innsikt|analyse)\b/i, label: "strategi, innsikt og analyse" },
    { re: /\b(workshop|kurs|foredrag|opplæring)\b/i, label: "kurs, opplæring og faglig veiledning" },
  ];

  const pickedServices = serviceSignals
    .filter((s) => s.re.test(corpus))
    .map((s) => s.label)
    .slice(0, 3);

  const hasAi = /\b(ai|kunstig intelligens|generativ|maskinlaring)\b/i.test(corpus);
  const hasProduction = /\b(produksjon|leveranse|studio|byra|byrå)\b/i.test(corpus);

  const sentences = [];
  if (short) {
    sentences.push(short);
  } else if (meta) {
    sentences.push(meta);
  } else if (title) {
    sentences.push(`${name} har en offentlig profil med informasjon om tjenester og arbeidsområde.`);
  }

  if (pickedServices.length) {
    sentences.push(`Tjenestene omfatter ${pickedServices.join(", ")}.`);
  } else if (hasProduction) {
    sentences.push("Selskapet leverer kreative og digitale tjenester for kommersielle behov.");
  }

  if (hasAi) {
    sentences.push(
      "Nettsiden viser at kunstig intelligens inngår i arbeidsflyt, metode eller produksjon."
    );
  }

  const websiteHost = (() => {
    try {
      return new URL(normalizeUrl(row.website) || "").host.replace(/^www\./, "");
    } catch {
      return "";
    }
  })();
  if (websiteHost) {
    sentences.push(`Mer informasjon finnes på ${websiteHost}.`);
  }

  return tidyDescription(dedupeSentences(sentences).join(" "), 560);
}

function escapeSqlString(s) {
  return s.replace(/'/g, "''");
}

function toTimestampTag() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function generateWithOpenAI(opts) {
  const { apiKey, model, row, evidence } = opts;
  const prompt = [
    "Du skriver norsk bedriftsbeskrivelse for katalog.",
    "Lag en presis long description pa 2-4 setninger.",
    "Kun bruk fakta fra input.",
    "Ikke finn pa tall eller kunder.",
    "Unnga superlativer, fluff og marketing-prat.",
    "Hvis informasjonen er begrenset, vaer tydelig og nøktern.",
    "",
    `Bedrift: ${row.name}`,
    `URL: ${row.website || ""}`,
    `Eksisterende korttekst: ${row.short_description || ""}`,
    "",
    "Kildedata:",
    JSON.stringify(
      {
        title: evidence.title,
        metaDescription: evidence.metaDescription,
        headings: evidence.headings,
        paragraphs: evidence.paragraphs,
        crawledUrls: evidence.crawledUrls,
      },
      null,
      2
    ),
  ].join("\n");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: "Svar kun med ferdig tekst uten punktliste." },
        { role: "user", content: prompt },
      ],
      max_tokens: 320,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`OpenAI HTTP ${res.status}: ${txt.slice(0, 280)}`);
  }

  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content?.trim() || "";
  return tidyDescription(text);
}

async function crawlCompany(row) {
  const website = normalizeUrl(row.website);
  if (!website) {
    return {
      ok: false,
      reason: "missing_website",
      evidence: null,
    };
  }

  const home = await fetchPage(website);
  if (!home.ok) {
    return {
      ok: false,
      reason: `fetch_failed:${home.status || 0}`,
      evidence: null,
    };
  }

  const homeHtml = home.text || "";
  const candidateLinks = extractCandidateLinks(website, homeHtml);
  const pages = [home];

  for (const link of candidateLinks) {
    await sleep(350);
    const page = await fetchPage(link);
    if (page.ok) pages.push(page);
  }

  const crawledUrls = pages.map((p) => p.url);
  const headings = pickLongish(
    pages.flatMap((p) => [
      ...extractTagContents(p.text, "h1"),
      ...extractTagContents(p.text, "h2"),
    ]),
    6
  );

  const paragraphs = pickLongish(
    pages.flatMap((p) => extractTagContents(p.text, "p")),
    8
  );

  const evidence = {
    crawledUrls,
    title: extractTitle(homeHtml),
    metaDescription: extractMetaDescription(homeHtml),
    headings,
    paragraphs,
  };

  return {
    ok: true,
    reason: "ok",
    evidence,
  };
}

async function main() {
  const args = parseArgs();
  const env = loadEnv();

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const db = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });

  const { data, error } = await db
    .from("companies")
    .select(`
      id,
      name,
      slug,
      website,
      short_description,
      description,
      is_placeholder,
      locations:location_id (
        country,
        name,
        region
      )
    `)
    .order("name", { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
    process.exit(1);
  }

  const all = (data || []).filter((row) => {
    const country = String(row?.locations?.country || "").trim().toLowerCase();
    if (country && country !== "norge" && country !== "norway") return false;
    if (args.onlyReal && row.is_placeholder) return false;
    return true;
  });

  const withWebsite = all.filter((row) => normalizeUrl(row.website));
  const work = args.limit ? withWebsite.slice(0, args.limit) : withWebsite;

  const openAiKey = env.OPENAI_API_KEY || "";
  const openAiModel = env.OPENAI_MODEL || "gpt-4o-mini";
  const canUseAi = Boolean(openAiKey) && !args.noAi;

  const results = [];

  console.log(
    `Starting description crawl. companies=${work.length} ai=${canUseAi ? "on" : "off"} onlyReal=${args.onlyReal}`
  );

  for (let idx = 0; idx < work.length; idx += 1) {
    const row = work[idx];
    const crawl = await crawlCompany(row);

    let newDescription = "";
    let mode = "heuristic";
    if (crawl.ok) {
      if (canUseAi) {
        try {
          newDescription = await generateWithOpenAI({
            apiKey: openAiKey,
            model: openAiModel,
            row,
            evidence: crawl.evidence,
          });
          mode = "openai";
        } catch (err) {
          mode = "heuristic_fallback";
          newDescription = buildHeuristicDescription(row, crawl.evidence);
        }
      } else {
        newDescription = buildHeuristicDescription(row, crawl.evidence);
      }
    }

    const existing = (row.description || "").trim();
    const changed = Boolean(newDescription) && newDescription !== existing;

    results.push({
      id: row.id,
      name: row.name,
      slug: row.slug,
      website: row.website,
      is_placeholder: row.is_placeholder,
      old_description: existing,
      new_description: newDescription,
      changed,
      crawl_ok: crawl.ok,
      crawl_reason: crawl.reason,
      mode,
      evidence: crawl.evidence,
    });

    console.log(
      `[${idx + 1}/${work.length}] ${row.slug} :: crawl=${crawl.reason} changed=${changed ? "yes" : "no"} mode=${mode}`
    );
    await sleep(450);
  }

  const ts = toTimestampTag();
  fs.mkdirSync(args.outputDir, { recursive: true });
  const jsonPath = path.join(args.outputDir, `company-description-crawl-${ts}.json`);
  const sqlPath = path.join(args.outputDir, `company-description-crawl-${ts}.sql`);

  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), "utf8");

  const changedRows = results.filter((r) => r.changed);
  const sqlLines = [
    "-- Review before running",
    `-- Generated at ${new Date().toISOString()}`,
    "begin;",
    ...changedRows.map((r) => {
      return `update public.companies set description = '${escapeSqlString(
        r.new_description
      )}', updated_at = now() where id = '${r.id}';`;
    }),
    "commit;",
    "",
  ];
  fs.writeFileSync(sqlPath, sqlLines.join("\n"), "utf8");

  if (args.apply && !args.dryRun) {
    for (const row of changedRows) {
      const { error: updErr } = await db
        .from("companies")
        .update({ description: row.new_description })
        .eq("id", row.id);
      if (updErr) {
        console.error(`Failed update ${row.slug}: ${updErr.message}`);
      }
      await sleep(180);
    }
  }

  const summary = {
    total: results.length,
    crawled_ok: results.filter((r) => r.crawl_ok).length,
    changed: changedRows.length,
    output_json: jsonPath,
    output_sql: sqlPath,
    applied: Boolean(args.apply && !args.dryRun),
  };

  console.log("\nSummary");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
