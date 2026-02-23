import { cinematicGenres } from "@/data/norskPrompting/cinematicGenres";
import { norskPromptingGovernanceRules } from "@/data/norskPrompting/governanceRules";
import { glossaryTerms, norskPromptingRules, promptExamples, promptTemplates } from "@/data/norskPrompting/runtime";

export const norskPromptingContent = {
  rules: norskPromptingRules,
  glossary: glossaryTerms,
  templates: promptTemplates,
  examples: promptExamples,
  cinematicGenres,
  governanceRules: norskPromptingGovernanceRules,
};

export function getGlossaryTerm(slug: string) {
  return glossaryTerms.find((entry) => entry.slug === slug) ?? null;
}

export function getPromptExample(slug: string) {
  return promptExamples.find((entry) => entry.slug === slug) ?? null;
}

export function searchNorskPrompting(query: string) {
  const needle = String(query ?? "").trim().toLowerCase();
  if (!needle) return [];

  const termHits = glossaryTerms
    .filter((entry) => `${entry.term_no} ${entry.term_en} ${entry.definition_no}`.toLowerCase().includes(needle))
    .slice(0, 8)
    .map((entry) => ({
      type: "ordforråd",
      title: entry.term_no,
      description: entry.definition_no,
      href: `/norsk-prompting/ordforrad/${entry.slug}`,
    }));

  const templateHits = promptTemplates
    .filter((entry) => `${entry.title} ${entry.useCase}`.toLowerCase().includes(needle))
    .slice(0, 8)
    .map((entry) => ({
      type: "mal",
      title: entry.title,
      description: entry.useCase,
      href: `/norsk-prompting/maler#${entry.id}`,
    }));

  const exampleHits = promptExamples
    .filter((entry) => `${entry.title} ${entry.shortInput}`.toLowerCase().includes(needle))
    .slice(0, 8)
    .map((entry) => ({
      type: "eksempel",
      title: entry.title,
      description: entry.shortInput,
      href: `/norsk-prompting/eksempler/${entry.slug}`,
    }));

  return [...termHits, ...templateHits, ...exampleHits].slice(0, 16);
}
