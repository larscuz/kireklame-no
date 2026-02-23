const STOP_WORDS = new Set([
  "og",
  "i",
  "på",
  "av",
  "for",
  "til",
  "med",
  "som",
  "det",
  "de",
  "den",
  "et",
  "en",
  "er",
  "skal",
  "kan",
  "ikke",
  "uten",
  "fra",
  "ved",
  "om",
  "the",
  "and",
  "for",
  "with",
]);

export function normalizeWhitespace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function normalizeText(value) {
  return normalizeWhitespace(
    String(value ?? "")
      .toLowerCase()
      .normalize("NFKC")
      .replace(/[‐‑‒–—―]/g, "-")
      .replace(/[“”«»„‟]/g, '"')
      .replace(/[‘’‚‛]/g, "'")
      .replace(/\s*->\s*/g, " til ")
      .replace(/[^\p{L}\p{N}\s\-/:.]/gu, " ")
  );
}

export function tokenize(value, { removeStopWords = false } = {}) {
  const normalized = normalizeText(value);
  const tokens = normalized
    .split(/[\s/]+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => token.length >= 2);

  if (!removeStopWords) return tokens;
  return tokens.filter((token) => !STOP_WORDS.has(token));
}

export function tokenizeSet(value, opts = {}) {
  return new Set(tokenize(value, opts));
}

export function jaccard(a, b) {
  const aSet = a instanceof Set ? a : new Set(a);
  const bSet = b instanceof Set ? b : new Set(b);

  if (!aSet.size && !bSet.size) return 1;
  if (!aSet.size || !bSet.size) return 0;

  let intersection = 0;
  for (const token of aSet) {
    if (bSet.has(token)) intersection += 1;
  }

  const union = aSet.size + bSet.size - intersection;
  return union ? intersection / union : 0;
}

export function diceCoefficient(a, b) {
  const left = normalizeText(a).replace(/\s+/g, "_");
  const right = normalizeText(b).replace(/\s+/g, "_");

  if (!left && !right) return 1;
  if (!left || !right) return 0;

  const bi = (input) => {
    const set = new Set();
    if (input.length < 2) {
      set.add(input);
      return set;
    }
    for (let i = 0; i < input.length - 1; i += 1) {
      set.add(input.slice(i, i + 2));
    }
    return set;
  };

  const leftSet = bi(left);
  const rightSet = bi(right);

  let intersection = 0;
  for (const token of leftSet) {
    if (rightSet.has(token)) intersection += 1;
  }

  return (2 * intersection) / (leftSet.size + rightSet.size);
}

export function uniq(arr) {
  return Array.from(new Set((arr || []).map((entry) => String(entry).trim()).filter(Boolean)));
}

export function slugify(input) {
  return String(input ?? "")
    .toLowerCase()
    .trim()
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function wordCount(value) {
  return tokenize(value).length;
}
