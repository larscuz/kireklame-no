export const PROMPT_PREVIEW_MAX = 520;

export type PromptPanel = {
  id: string;
  title: string;
  content: string;
};

export function promptPreview(value: string, max = PROMPT_PREVIEW_MAX): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}...`;
}

export function parsePromptPanels(prompt: string): PromptPanel[] {
  const source = String(prompt ?? "").trim();
  if (!source) {
    return [{ id: "panel-1", title: "Prompt", content: "" }];
  }

  const pattern = /^DEL\s+(\d+)\s*[-–:]\s*(.+)$/gim;
  const matches = Array.from(source.matchAll(pattern));
  if (matches.length < 2) {
    return [{ id: "panel-1", title: "Prompt", content: source }];
  }

  const panels: PromptPanel[] = [];
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const number = String(match[1] ?? "").trim();
    const label = String(match[2] ?? "").trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? source.length) : source.length;
    const content = source.slice(start, end).trim();

    panels.push({
      id: `panel-${number || index + 1}`,
      title: `DEL ${number || index + 1} - ${label}`,
      content,
    });
  }

  return panels;
}
