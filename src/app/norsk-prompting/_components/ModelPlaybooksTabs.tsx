"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ModelPlaybook, ModelTemplateCategory, ModelTemplateCategoryId } from "@/data/norskPrompting/modelPlaybooks";
import CopyTextButton from "./CopyTextButton";

type Props = {
  categories: ModelTemplateCategory[];
};

type ListProps = {
  title: string;
  items: string[];
};

function BulletList({ title, items }: ListProps) {
  return (
    <article className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/62 p-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/90">
        {items.map((item) => (
          <li key={`${title}-${item}`}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function buildLookup(categories: ModelTemplateCategory[]) {
  const map = new Map<string, { categoryId: ModelTemplateCategoryId; model: ModelPlaybook }>();
  for (const category of categories) {
    for (const model of category.models) {
      if (model.status !== "documented") continue;
      map.set(model.id, { categoryId: category.id, model });
    }
  }
  return map;
}

function getDefaultDocumentedModelId(category?: ModelTemplateCategory): string {
  if (!category) return "";

  const documentedModels = category.models.filter((model) => model.status === "documented");
  if (documentedModels.length === 0) return "";

  const preferredByCategory: Partial<Record<ModelTemplateCategoryId, string>> = {
    video: "kling-3-0",
  };

  const preferredId = preferredByCategory[category.id];
  if (preferredId && documentedModels.some((model) => model.id === preferredId)) {
    return preferredId;
  }

  return documentedModels[0].id;
}

function withGuardrails(template: string, guardrails: string[]): string {
  if (guardrails.length === 0) return template;
  const guardrailBlock = `Guardrails:\n${guardrails.map((item) => `- ${item}`).join("\n")}`;
  return `${template}\n\n${guardrailBlock}`;
}

export default function ModelPlaybooksTabs({ categories }: Props) {
  const firstCategory = categories[0];
  const [activeCategoryId, setActiveCategoryId] = useState<ModelTemplateCategoryId | "">(
    firstCategory?.id ?? ""
  );
  const activeCategory = categories.find((category) => category.id === activeCategoryId) ?? firstCategory;
  const [selectedModelId, setSelectedModelId] = useState<string>(getDefaultDocumentedModelId(firstCategory));

  const lookup = useMemo(() => buildLookup(categories), [categories]);

  const resolvedModel = lookup.get(selectedModelId);
  const activeCategoryModels = (activeCategory?.models ?? []).filter((model) => model.status === "documented");
  const selectedModel =
    resolvedModel && resolvedModel.categoryId === activeCategory?.id
      ? resolvedModel.model
      : activeCategoryModels[0];

  const modelOptions = activeCategoryModels;

  if (!activeCategory) {
    return (
      <section className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
        <p className="text-sm text-[rgb(var(--muted))]">Ingen modellmaler er registrert ennå.</p>
      </section>
    );
  }

  function handleCategoryChange(categoryId: ModelTemplateCategoryId) {
    setActiveCategoryId(categoryId);
    const category = categories.find((entry) => entry.id === categoryId);
    setSelectedModelId(getDefaultDocumentedModelId(category));
  }

  return (
    <section className="space-y-4">
      <article className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Interne faner</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = category.id === activeCategory.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryChange(category.id)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                  active
                    ? "border-zinc-300/35 bg-zinc-300/12 text-zinc-100"
                    : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
                }`}
              >
                {category.title}
              </button>
            );
          })}
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Velg modell</span>
          <select
            value={selectedModel?.id ?? ""}
            onChange={(event) => setSelectedModelId(event.target.value)}
            disabled={modelOptions.length === 0}
            className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:border-zinc-300"
          >
            {modelOptions.length === 0 ? (
              <option value="">Ingen dokumenterte modeller</option>
            ) : (
              modelOptions.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.modelName}
                </option>
              ))
            )}
          </select>
        </label>
      </article>

      {!selectedModel ? (
        <article className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
          <p className="text-sm text-[rgb(var(--muted))]">
            Ingen dokumenterte modeller for kategorien {activeCategory.title} ennå.
          </p>
        </article>
      ) : null}

      {selectedModel ? (
      <article className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">{activeCategory.title}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{selectedModel.modelName}</h2>
        <p className="mt-2 text-sm text-[rgb(var(--fg))]/90">{selectedModel.summary}</p>
        <p className="mt-2 text-xs text-[rgb(var(--muted))]">{selectedModel.documentationStatus}</p>

        {selectedModel.bestPracticeBanner ? (
          <div className="mt-3 rounded-xl border border-zinc-300/35 bg-zinc-300/10 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-100">Best Practice</p>
            <p className="mt-1 text-sm text-zinc-100/90">{selectedModel.bestPracticeBanner}</p>
          </div>
        ) : null}

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <BulletList title="Hva modellen er optimalisert for" items={selectedModel.optimizedFor} />
          <BulletList title="Operative regler" items={selectedModel.operationalRules} />
          <BulletList title="Modellens styrker" items={selectedModel.strengths} />
          <BulletList title="Modellens svakheter" items={selectedModel.weaknesses} />
          <BulletList title="Typiske feil" items={selectedModel.typicalErrors} />
          <BulletList title="Dokumentasjonsbasert prinsipp" items={selectedModel.documentationPrinciples} />
        </div>

        <article className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/62 p-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
            Hvordan modellen bør promptes (struktur)
          </h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/90">
            {selectedModel.promptFieldStructure.map((field) => (
              <li key={`${selectedModel.id}-${field.section}`}>
                <strong>
                  {field.section}. {field.title}:
                </strong>{" "}
                {field.instruction}
              </li>
            ))}
          </ol>
        </article>

        {selectedModel.fieldCompiler ? (
          <article className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/62 p-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
              {selectedModel.fieldCompiler.heading}
            </h3>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-[rgb(var(--fg))]/90">
              {selectedModel.fieldCompiler.steps.map((step) => (
                <li key={`${selectedModel.id}-compiler-${step.section}`}>
                  <p>
                    <strong>
                      {step.section}. {step.title}
                    </strong>
                  </p>
                  <p className="text-xs text-[rgb(var(--muted))]">
                    Felter: {step.fields.join(" · ")}
                  </p>
                  <p className="text-xs text-[rgb(var(--muted))]">Hvorfor: {step.why}</p>
                </li>
              ))}
            </ol>

            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Kompilert prompt</p>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/72 p-3 text-xs text-[rgb(var(--fg))]/90">
              {selectedModel.fieldCompiler.compiledPromptTemplate}
            </pre>
            <div className="mt-2">
              <CopyTextButton
                value={withGuardrails(
                  selectedModel.fieldCompiler.compiledPromptTemplate,
                  selectedModel.guardrails ?? []
                )}
                label="Kopier kompilert mal"
              />
            </div>
          </article>
        ) : null}

        <article className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/62 p-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Optimal promptstruktur</h3>
          <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/72 p-3 text-xs text-[rgb(var(--fg))]/90">
            {selectedModel.optimalPromptStructure}
          </pre>

          <div className="mt-3 flex flex-wrap gap-2">
            <CopyTextButton value={selectedModel.optimalPromptStructure} label="Kopier struktur" />
            {selectedModel.expanderSeedInput && selectedModel.expanderOutputType ? (
              <Link
                href={`/norsk-prompting/prompt-utvider?input=${encodeURIComponent(selectedModel.expanderSeedInput)}&outputType=${selectedModel.expanderOutputType}`}
                className="inline-flex rounded-full border border-zinc-300/35 bg-zinc-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-100"
              >
                Kjør i utvider
              </Link>
            ) : null}
          </div>
        </article>

        {selectedModel.modeTemplates && selectedModel.modeTemplates.length > 0 ? (
          <article className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/62 p-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
              Maler for modus
            </h3>
            <div className="mt-2 space-y-3">
              {selectedModel.modeTemplates.map((template) => (
                <section key={template.id} className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/72 p-3">
                  <p className="text-sm font-semibold">{template.title}</p>
                  <p className="mt-1 text-xs text-[rgb(var(--muted))]">{template.purpose}</p>
                  <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/70 p-3 text-xs text-[rgb(var(--fg))]/90">
                    {template.template}
                  </pre>
                  {selectedModel.guardrails && selectedModel.guardrails.length > 0 ? (
                    <div className="mt-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/68 p-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                        Guardrails
                      </p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-[rgb(var(--fg))]/90">
                        {selectedModel.guardrails.map((guardrail) => (
                          <li key={`${template.id}-guardrail-${guardrail}`}>{guardrail}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <div className="mt-2">
                    <CopyTextButton
                      value={withGuardrails(template.template, selectedModel.guardrails ?? [])}
                      label="Kopier mal"
                    />
                  </div>
                </section>
              ))}
            </div>
          </article>
        ) : null}
      </article>
      ) : null}
    </section>
  );
}
