import crypto from "node:crypto";
import { normalizeText, tokenize } from "./text-normalize.mjs";

function hashToken64(token) {
  const digest = crypto.createHash("sha256").update(token).digest();
  return digest.readBigUInt64BE(0);
}

export function exactHash(input) {
  return crypto.createHash("sha256").update(normalizeText(input)).digest("hex");
}

export function simhash64(input) {
  const tokens = tokenize(input, { removeStopWords: true });
  const vector = Array.from({ length: 64 }, () => 0);

  for (const token of tokens) {
    const hash = hashToken64(token);
    for (let bit = 0n; bit < 64n; bit += 1n) {
      const mask = 1n << bit;
      vector[Number(bit)] += hash & mask ? 1 : -1;
    }
  }

  let out = 0n;
  for (let bit = 0n; bit < 64n; bit += 1n) {
    if (vector[Number(bit)] >= 0) out |= 1n << bit;
  }

  return out.toString(16).padStart(16, "0");
}

export function hammingDistanceHex64(leftHex, rightHex) {
  const left = BigInt(`0x${leftHex || "0"}`);
  const right = BigInt(`0x${rightHex || "0"}`);
  let xor = left ^ right;
  let count = 0;
  while (xor) {
    xor &= xor - 1n;
    count += 1;
  }
  return count;
}

export function nearSimilarityFromHamming(distance) {
  const maxBits = 64;
  return Math.max(0, Math.min(1, (maxBits - distance) / maxBits));
}

export function buildFingerprints(input) {
  const normalized = normalizeText(input);
  const exact = exactHash(normalized);
  const near = simhash64(normalized);

  return {
    normalized,
    exact,
    near,
    exactTagged: `exact:${exact}`,
    nearTagged: `near:${near}`,
  };
}
