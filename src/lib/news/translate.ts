const GOOGLE_TRANSLATE_BASE =
  "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=no&dt=t&q=";

export const ENGLISH_AI_GLOSSARY_TERMS: string[] = [
  "AI-native",
  "AI-first",
  "AI-only",
  "Agentic AI",
  "Generative AI",
  "GenAI",
  "Prompt engineering",
  "Prompt engineer",
  "Prompt stack",
  "Creative ops",
  "Ad ops",
  "Brand safety",
  "Foundation model",
  "Fine-tuning",
  "RAG",
  "Retrieval-augmented generation",
  "Multimodal",
  "Latent space",
  "Diffusion model",
  "Synthetic media",
  "Model context protocol",
  "AI governance",
  "Guardrails",
  "Human-in-the-loop",
];

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeWhitespace(text: string): string {
  return String(text ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitForTranslate(text: string, maxChunk = 1200): string[] {
  const raw = String(text ?? "").trim();
  if (!raw) return [];
  const out: string[] = [];
  const paragraphs = raw.split(/\n{2,}/g).map((p) => p.trim()).filter(Boolean);

  for (const paragraph of paragraphs) {
    if (paragraph.length <= maxChunk) {
      out.push(paragraph);
      continue;
    }

    const sentences = paragraph.split(/(?<=[.!?])\s+/g);
    let current = "";
    for (const sentence of sentences) {
      const candidate = current ? `${current} ${sentence}` : sentence;
      if (candidate.length > maxChunk) {
        if (current) out.push(current.trim());
        if (sentence.length > maxChunk) {
          for (let i = 0; i < sentence.length; i += maxChunk) {
            out.push(sentence.slice(i, i + maxChunk).trim());
          }
          current = "";
        } else {
          current = sentence;
        }
      } else {
        current = candidate;
      }
    }
    if (current.trim()) out.push(current.trim());
  }

  return out.filter(Boolean);
}

function protectGlossaryTerms(input: string): {
  text: string;
  replacements: Array<{ token: string; original: string }>;
} {
  let text = String(input ?? "");
  const replacements: Array<{ token: string; original: string }> = [];
  let counter = 0;

  const terms = [...ENGLISH_AI_GLOSSARY_TERMS].sort((a, b) => b.length - a.length);
  for (const term of terms) {
    const pattern = new RegExp(escapeRegExp(term), "gi");
    text = text.replace(pattern, (match) => {
      counter += 1;
      const token = `KIRTERM${String(counter).padStart(4, "0")}X`;
      replacements.push({ token, original: match });
      return token;
    });
  }

  return { text, replacements };
}

function restoreGlossaryTerms(
  input: string,
  replacements: Array<{ token: string; original: string }>
): string {
  let text = String(input ?? "");
  for (const { token, original } of replacements) {
    text = text.replaceAll(token, original);
  }
  return text;
}

async function googleTranslateChunk(chunk: string): Promise<string | null> {
  const q = String(chunk ?? "").trim();
  if (!q) return null;
  const url = `${GOOGLE_TRANSLATE_BASE}${encodeURIComponent(q)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "user-agent":
          "KiReklameBot/0.1 (respectful; contact: kireklame.no) Node/Next",
        accept: "application/json,text/plain,*/*",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) return null;

    const sentences = data[0];
    if (!Array.isArray(sentences)) return null;

    const translated = sentences
      .map((item) => (Array.isArray(item) ? String(item[0] ?? "") : ""))
      .join("")
      .trim();

    return translated || null;
  } catch {
    return null;
  }
}

export function shouldTranslateToNorwegian(language: string | null | undefined): boolean {
  const lang = String(language ?? "").trim().toLowerCase();
  return Boolean(lang) && !["no", "nb", "nn"].includes(lang);
}

export async function translateToNorwegianBokmal(text: string): Promise<string | null> {
  const clean = normalizeWhitespace(text);
  if (!clean) return null;

  const protectedText = protectGlossaryTerms(clean);
  const chunks = splitForTranslate(protectedText.text);
  if (!chunks.length) return null;

  const translatedParts: string[] = [];
  for (const chunk of chunks) {
    const translated = await googleTranslateChunk(chunk);
    if (!translated) return null;
    translatedParts.push(translated);
  }

  const joined = translatedParts.join("\n\n").trim();
  const restored = restoreGlossaryTerms(joined, protectedText.replacements).trim();
  return restored || null;
}

export function machineTranslationNote(language: string): string {
  const sourceLang = String(language ?? "").toLowerCase() || "ukjent språk";
  return `Maskinoversatt fra ${sourceLang} til norsk bokmål (Google Translate). Kan inneholde feil. Fagbegreper som AI-first og AI-native beholdes på engelsk.`;
}
