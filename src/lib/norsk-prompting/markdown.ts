function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatInline(value: string): string {
  let out = escapeHtml(value);
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*(.+?)\*/g, "<em>$1</em>");
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>'
  );
  return out;
}

function renderBlock(block: string): string {
  const trimmed = block.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
    const code = trimmed.replace(/^```[a-zA-Z0-9_-]*\n?/, "").replace(/\n?```$/, "");
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }

  if (trimmed.startsWith("### ")) {
    return `<h3>${formatInline(trimmed.slice(4))}</h3>`;
  }

  if (trimmed.startsWith("## ")) {
    return `<h2>${formatInline(trimmed.slice(3))}</h2>`;
  }

  if (trimmed.startsWith("# ")) {
    return `<h1>${formatInline(trimmed.slice(2))}</h1>`;
  }

  const unordered = trimmed.split("\n").every((line) => line.startsWith("- "));
  if (unordered) {
    const items = trimmed
      .split("\n")
      .map((line) => `<li>${formatInline(line.slice(2).trim())}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  }

  const ordered = trimmed.split("\n").every((line) => /^\d+\.\s+/.test(line));
  if (ordered) {
    const items = trimmed
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s+/, ""))
      .map((line) => `<li>${formatInline(line.trim())}</li>`)
      .join("");
    return `<ol>${items}</ol>`;
  }

  return `<p>${trimmed.split("\n").map(formatInline).join("<br />")}</p>`;
}

export async function renderMarkdown(md: string): Promise<string> {
  return md
    .split(/\n{2,}/)
    .map(renderBlock)
    .filter(Boolean)
    .join("\n");
}
