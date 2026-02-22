import Link from "next/link";
import type { ReactNode } from "react";
import ActionBlock from "@/components/ki-opplaring/mdx/ActionBlock";
import Checklist from "@/components/ki-opplaring/mdx/Checklist";
import CopyButton from "@/components/ki-opplaring/mdx/CopyButton";
import Deliverable from "@/components/ki-opplaring/mdx/Deliverable";
import OutcomeBlock from "@/components/ki-opplaring/mdx/OutcomeBlock";
import Pitfalls from "@/components/ki-opplaring/mdx/Pitfalls";
import PromptExercise from "@/components/ki-opplaring/mdx/PromptExercise";
import PromptTransform from "@/components/ki-opplaring/mdx/PromptTransform";
import PromptVsMediaExercise from "@/components/ki-opplaring/mdx/PromptVsMediaExercise";
import Script10sExercise from "@/components/ki-opplaring/mdx/Script10sExercise";
import TemplateBlock from "@/components/ki-opplaring/mdx/TemplateBlock";
import { slugify } from "@/lib/slug";

type HeadingBlock = {
  kind: "heading";
  depth: number;
  text: string;
  id: string;
};

type ParagraphBlock = {
  kind: "paragraph";
  text: string;
};

type ListBlock = {
  kind: "ul" | "ol";
  items: string[];
};

type QuoteBlock = {
  kind: "quote";
  text: string;
};

type HrBlock = {
  kind: "hr";
};

type ComponentBlock = {
  kind: "component";
  name: string;
  props: Record<string, string>;
};

type Block = HeadingBlock | ParagraphBlock | ListBlock | QuoteBlock | HrBlock | ComponentBlock;

function toHeadingIdFactory() {
  const seen = new Map<string, number>();
  return (text: string): string => {
    const base = slugify(text) || "seksjon";
    const current = seen.get(base) ?? 0;
    const next = current + 1;
    seen.set(base, next);
    return next === 1 ? base : `${base}-${next}`;
  };
}

function parseComponentProps(raw: string): Record<string, string> {
  const props: Record<string, string> = {};
  const pattern = /([A-Za-z_][\w-]*)=("([^"]*)"|'([^']*)')/g;

  for (const match of raw.matchAll(pattern)) {
    const key = match[1];
    const value = match[3] ?? match[4] ?? "";
    props[key] = value;
  }

  return props;
}

function parseComponentLine(line: string): ComponentBlock | null {
  const match = line.match(/^<([A-Z][A-Za-z0-9]*)\s*([^>]*)\/>$/);
  if (!match) return null;

  return {
    kind: "component",
    name: match[1],
    props: parseComponentProps(match[2] ?? ""),
  };
}

function parseStringArray(value: string | undefined): string[] {
  const raw = String(value ?? "").trim();
  if (!raw) return [];

  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item)).map((item) => item.trim()).filter(Boolean);
      }
    } catch {
      return [];
    }
  }

  return raw
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBlocks(markdown: string): Block[] {
  const lines = String(markdown ?? "").replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  const headingId = toHeadingIdFactory();
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    const text = paragraphBuffer.map((line) => line.trim()).join(" ").trim();
    paragraphBuffer = [];
    if (!text) return;
    blocks.push({ kind: "paragraph", text });
  };

  for (let idx = 0; idx < lines.length; idx += 1) {
    const line = lines[idx].trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    const component = parseComponentLine(line);
    if (component) {
      flushParagraph();
      blocks.push(component);
      continue;
    }

    if (/^---+$/.test(line)) {
      flushParagraph();
      blocks.push({ kind: "hr" });
      continue;
    }

    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      const text = headingMatch[2].trim();
      blocks.push({
        kind: "heading",
        depth: headingMatch[1].length,
        text,
        id: headingId(text),
      });
      continue;
    }

    if (/^>\s+/.test(line)) {
      flushParagraph();
      const quoteLines: string[] = [line.replace(/^>\s+/, "")];
      while (idx + 1 < lines.length && /^>\s+/.test(lines[idx + 1].trim())) {
        idx += 1;
        quoteLines.push(lines[idx].trim().replace(/^>\s+/, ""));
      }
      blocks.push({ kind: "quote", text: quoteLines.join(" ").trim() });
      continue;
    }

    if (/^-\s+/.test(line)) {
      flushParagraph();
      const items: string[] = [line.replace(/^-\s+/, "").trim()];
      while (idx + 1 < lines.length && /^-\s+/.test(lines[idx + 1].trim())) {
        idx += 1;
        items.push(lines[idx].trim().replace(/^-\s+/, "").trim());
      }
      blocks.push({ kind: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      const items: string[] = [line.replace(/^\d+\.\s+/, "").trim()];
      while (idx + 1 < lines.length && /^\d+\.\s+/.test(lines[idx + 1].trim())) {
        idx += 1;
        items.push(lines[idx].trim().replace(/^\d+\.\s+/, "").trim());
      }
      blocks.push({ kind: "ol", items });
      continue;
    }

    paragraphBuffer.push(line);
  }

  flushParagraph();

  return blocks;
}

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /(`[^`]+`|\[[^\]]+\]\([^\)]+\))/g;
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(pattern)) {
    const full = match[0] ?? "";
    const index = match.index ?? 0;

    if (index > lastIndex) {
      out.push(<span key={`txt-${key++}`}>{text.slice(lastIndex, index)}</span>);
    }

    if (full.startsWith("`") && full.endsWith("`")) {
      out.push(
        <code key={`code-${key++}`} className="rounded bg-black/10 px-1 py-0.5 text-[0.94em] dark:bg-white/10">
          {full.slice(1, -1)}
        </code>
      );
      lastIndex = index + full.length;
      continue;
    }

    const linkMatch = full.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (linkMatch) {
      const label = linkMatch[1].trim();
      const href = linkMatch[2].trim();
      const internal = href.startsWith("/");
      const className = "underline underline-offset-4 hover:opacity-80";

      out.push(
        internal ? (
          <Link key={`link-${key++}`} href={href} className={className}>
            {label}
          </Link>
        ) : (
          <a key={`link-${key++}`} href={href} target="_blank" rel="noreferrer" className={className}>
            {label}
          </a>
        )
      );
      lastIndex = index + full.length;
      continue;
    }

    out.push(<span key={`txt-${key++}`}>{full}</span>);
    lastIndex = index + full.length;
  }

  if (lastIndex < text.length) {
    out.push(<span key={`txt-${key++}`}>{text.slice(lastIndex)}</span>);
  }

  return out.length ? out : [text];
}

type Props = {
  markdown: string;
  entryKey?: string;
};

export default function TrainingMarkdown({ markdown, entryKey }: Props) {
  const blocks = parseBlocks(markdown);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.kind === "component") {
          const props = block.props;

          if (block.name === "ActionBlock") {
            return (
              <ActionBlock
                key={`component-${index}`}
                id={props.id ?? `action-${index}`}
                title={props.title}
                task={props.task ?? "Fullfør oppgaven og lagre utkastet ditt."}
                placeholder={props.placeholder}
                example={props.example?.replace(/\\n/g, "\n")}
                guideKey={entryKey}
              />
            );
          }

          if (block.name === "TemplateBlock") {
            return (
              <TemplateBlock
                key={`component-${index}`}
                templateId={props.templateId ?? "ki-brief-v1"}
                actionId={props.actionId}
              />
            );
          }

          if (block.name === "Checklist") {
            return (
              <Checklist
                key={`component-${index}`}
                id={props.id ?? `checklist-${index}`}
                title={props.title}
                items={parseStringArray(props.items)}
                guideKey={entryKey}
              />
            );
          }

          if (block.name === "OutcomeBlock") {
            return <OutcomeBlock key={`component-${index}`} title={props.title} items={parseStringArray(props.items)} />;
          }

          if (block.name === "Pitfalls") {
            return <Pitfalls key={`component-${index}`} title={props.title} items={parseStringArray(props.items)} />;
          }

          if (block.name === "Deliverable") {
            return (
              <Deliverable
                key={`component-${index}`}
                title={props.title}
                description={props.description}
                items={parseStringArray(props.items)}
              />
            );
          }

          if (block.name === "CopyButton") {
            return <CopyButton key={`component-${index}`} value={props.value ?? ""} label={props.label} />;
          }

          if (block.name === "PromptTransform") {
            return (
              <PromptTransform
                key={`component-${index}`}
                id={props.id ?? `prompt-transform-${index}`}
                title={props.title}
                placeholder={props.placeholder}
                context={props.context}
                guideKey={entryKey}
              />
            );
          }

          if (block.name === "PromptExercise") {
            return (
              <PromptExercise
                key={`component-${index}`}
                id={props.id ?? `prompt-exercise-${index}`}
                title={props.title}
                guideKey={entryKey}
                context={props.context}
                defaultBadPrompt={props.defaultBadPrompt}
                defaultGoodPrompt={props.defaultGoodPrompt}
              />
            );
          }

          if (block.name === "PromptVsMediaExercise") {
            return (
              <PromptVsMediaExercise
                key={`component-${index}`}
                id={props.id ?? `prompt-vs-media-${index}`}
                title={props.title}
                guideKey={entryKey}
              />
            );
          }

          if (block.name === "Script10sExercise" || block.name === "BriefBuilderExercise") {
            return (
              <Script10sExercise
                key={`component-${index}`}
                id={props.id ?? `script10s-${index}`}
                title={props.title}
                guideKey={entryKey}
              />
            );
          }

          return (
            <pre key={`component-${index}`} className="rounded-xl border border-[rgb(var(--border))] bg-black/10 p-3 text-xs">
              <code>{`<${block.name} />`}</code>
            </pre>
          );
        }

        if (block.kind === "heading") {
          if (block.depth === 2) {
            return (
              <h2 key={`${block.id}-${index}`} id={block.id} className="scroll-mt-24 pt-2 text-2xl font-semibold tracking-tight">
                {block.text}
              </h2>
            );
          }
          return (
            <h3 key={`${block.id}-${index}`} id={block.id} className="scroll-mt-24 pt-1 text-xl font-semibold tracking-tight">
              {block.text}
            </h3>
          );
        }

        if (block.kind === "paragraph") {
          return (
            <p key={`p-${index}`} className="text-[17px] leading-relaxed text-[rgb(var(--fg))]/90">
              {renderInline(block.text)}
            </p>
          );
        }

        if (block.kind === "ul") {
          return (
            <ul key={`ul-${index}`} className="list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-[rgb(var(--fg))]/90">
              {block.items.map((item, itemIndex) => (
                <li key={`li-${itemIndex}`}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.kind === "ol") {
          return (
            <ol key={`ol-${index}`} className="list-decimal space-y-2 pl-6 text-[17px] leading-relaxed text-[rgb(var(--fg))]/90">
              {block.items.map((item, itemIndex) => (
                <li key={`li-${itemIndex}`}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }

        if (block.kind === "quote") {
          return (
            <blockquote
              key={`quote-${index}`}
              className="border-l-2 border-black/30 bg-black/5 px-4 py-3 text-[16px] italic leading-relaxed text-[rgb(var(--fg))]/85 dark:border-white/30 dark:bg-white/5"
            >
              {renderInline(block.text)}
            </blockquote>
          );
        }

        return <hr key={`hr-${index}`} className="border-black/15 dark:border-white/15" />;
      })}
    </div>
  );
}
