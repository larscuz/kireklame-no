import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cinematicGenres } from "@/data/norskPrompting/cinematicGenres";
import { promptExamples } from "@/data/norskPrompting/examples";
import { glossaryTerms } from "@/data/norskPrompting/glossary";
import { norskPromptingGovernanceRules } from "@/data/norskPrompting/governanceRules";
import { norskPromptingRules } from "@/data/norskPrompting/rules";
import { promptTemplates } from "@/data/norskPrompting/templates";
import type { GovernanceAppliesTo } from "@/data/norskPrompting/types";
import {
  analyseSemantiskDuplikat,
  normalizeCandidate,
  type DuplikatEntry,
} from "@/lib/norsk-prompting/semantiskDuplikatkontroll";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sourceTypeSchema = z.enum([
  "rules",
  "glossary",
  "templates",
  "examples",
  "representationSwitches",
]);

const bodySchema = z.object({
  sourceType: sourceTypeSchema,
  candidate: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
      title: z.string().optional(),
      term_no: z.string().optional(),
      definition: z.string().optional(),
      definition_no: z.string().optional(),
      description: z.string().optional(),
      promptImpact: z.string().optional(),
      useCase: z.string().optional(),
      constraints: z.union([z.string(), z.array(z.string())]).optional(),
      negative: z.union([z.string(), z.array(z.string())]).optional(),
    })
    .passthrough(),
});

function toRuleEntries(): DuplikatEntry[] {
  return norskPromptingRules.map((rule) => ({
    id: rule.id,
    sourceType: "rules",
    name: rule.name,
    definition: rule.description,
    promptImpact: rule.addToPrompt,
    constraints: rule.addToPrompt,
    negative: rule.negativeAdd,
  }));
}

function toGlossaryEntries(): DuplikatEntry[] {
  return glossaryTerms.map((term) => ({
    id: term.slug,
    sourceType: "glossary",
    name: term.term_no,
    definition: term.definition_no,
    promptImpact: term.promptImpact,
    constraints: term.examples.join(" "),
    negative: term.relatedTerms.join(" "),
  }));
}

function toTemplateEntries(): DuplikatEntry[] {
  return promptTemplates.map((template) => ({
    id: template.id,
    sourceType: "templates",
    name: template.title,
    definition: template.useCase,
    promptImpact: template.blocks.map((block) => `${block.title}: ${block.instruction}`).join(" "),
    constraints: template.recommendedRules.join(" "),
    negative: "",
  }));
}

function toExampleEntries(): DuplikatEntry[] {
  return promptExamples.map((example) => ({
    id: example.slug,
    sourceType: "examples",
    name: example.title,
    definition: example.shortInput,
    promptImpact: example.longOutput,
    constraints: example.ruleIds.join(" "),
    negative: example.whyWorks.join(" "),
  }));
}

function toRepresentationSwitchEntries(): DuplikatEntry[] {
  return cinematicGenres.map((genre) => ({
    id: genre.id,
    sourceType: "representationSwitches",
    name: genre.navn,
    definition: genre.effekt,
    promptImpact: genre.promptStruktur.mal,
    constraints: genre.representasjonsskift ?? "",
    negative: genre.sterkeBegreper.join(" "),
  }));
}

function entriesForSourceType(sourceType: GovernanceAppliesTo): DuplikatEntry[] {
  if (sourceType === "rules") return toRuleEntries();
  if (sourceType === "glossary") return toGlossaryEntries();
  if (sourceType === "templates") return toTemplateEntries();
  if (sourceType === "examples") return toExampleEntries();
  return toRepresentationSwitchEntries();
}

export async function POST(req: NextRequest) {
  try {
    const body = bodySchema.safeParse(await req.json().catch(() => ({})));

    if (!body.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Ugyldig payload. Bruk sourceType + candidate.",
        },
        { status: 400 }
      );
    }

    const { sourceType, candidate } = body.data;
    const candidateEntry = normalizeCandidate(candidate, sourceType);
    const existingEntries = entriesForSourceType(sourceType);
    const analyse = analyseSemantiskDuplikat(candidateEntry, existingEntries);

    return NextResponse.json({
      ok: true,
      rule: norskPromptingGovernanceRules[0],
      sourceType,
      candidate: candidateEntry,
      decision: {
        action: analyse.action,
        overlapPercent: analyse.overlapPercent,
        reason: analyse.reason,
        forslag: analyse.forslag,
        metrics: {
          nameSimilarity: Number((analyse.metrics.nameSimilarity * 100).toFixed(1)),
          definitionSimilarity: Number((analyse.metrics.definitionSimilarity * 100).toFixed(1)),
          promptImpactSimilarity: Number((analyse.metrics.promptImpactSimilarity * 100).toFixed(1)),
          constraintsSimilarity: Number((analyse.metrics.constraintsSimilarity * 100).toFixed(1)),
          negativeSimilarity: Number((analyse.metrics.negativeSimilarity * 100).toFixed(1)),
          samletOverlap: analyse.overlapPercent,
        },
      },
      matchedEntry: analyse.match,
      poolSize: existingEntries.length,
    });
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : "Ukjent feil";

    return NextResponse.json(
      {
        ok: false,
        error: `Feil i semantisk duplikatkontroll: ${message}`,
      },
      { status: 500 }
    );
  }
}
