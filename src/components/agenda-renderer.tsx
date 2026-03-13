import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

interface AgendaRendererProps {
  markdown: string;
}

async function renderMarkdown(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}

export async function AgendaRenderer({ markdown }: AgendaRendererProps) {
  const html = await renderMarkdown(markdown);

  return (
    <div
      className="agenda-content prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
