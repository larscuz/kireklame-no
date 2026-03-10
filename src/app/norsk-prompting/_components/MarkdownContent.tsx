import { renderMarkdown } from "@/lib/norsk-prompting/markdown";

type Props = {
  content: string;
};

export default async function MarkdownContent({ content }: Props) {
  const html = await renderMarkdown(content);

  return (
    <div
      className="np-markdown-content space-y-3 text-sm leading-relaxed text-[rgb(var(--fg))]/90
        [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight
        [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight
        [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight
        [&_h4]:mt-3 [&_h4]:text-base [&_h4]:font-semibold
        [&_p]:mt-2 [&_p]:leading-relaxed
        [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5
        [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5
        [&_li]:text-sm [&_li]:text-[rgb(var(--fg))]/85
        [&_strong]:font-semibold [&_strong]:text-[rgb(var(--fg))]
        [&_em]:italic
        [&_a]:text-[rgb(var(--fg))] [&_a]:underline [&_a]:underline-offset-4
        [&_code]:rounded [&_code]:bg-[rgb(var(--bg))]/75 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-[rgb(var(--fg))]/92
        [&_pre]:mt-3 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[rgb(var(--border))] [&_pre]:bg-[rgb(var(--bg))]/70 [&_pre]:p-4
        [&_pre_code]:bg-transparent [&_pre_code]:p-0
        [&_hr]:my-4 [&_hr]:border-[rgb(var(--border))]
        [&_table]:mt-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
        [&_th]:border [&_th]:border-[rgb(var(--border))] [&_th]:bg-[rgb(var(--bg))]/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold
        [&_td]:border [&_td]:border-[rgb(var(--border))] [&_td]:px-3 [&_td]:py-2
        [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[rgb(var(--muted))]"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
