import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";

type $Node = cheerio.Cheerio<AnyNode>;

/**
 * Convert agenda HTML to clean Markdown using Cheerio for parsing
 * and string manipulation for output.
 */
export function htmlToMarkdown(html: string): string {
  const $ = cheerio.load(html);

  // Remove script, style, and other non-content elements
  $("script, style, link, meta, noscript, iframe").remove();

  // Process from the body (or root if no body)
  const root = $("body").length ? $("body") : $.root();

  const md = processNode($, root);

  // Collapse multiple blank lines to double newline, trim
  return md
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+$/gm, "")
    .trim();
}

function processNode($: cheerio.CheerioAPI, node: $Node): string {
  let result = "";

  node.contents().each((_, el) => {
    if (el.type === "text") {
      const text = $(el).text();
      // Preserve text but normalize internal whitespace
      result += text.replace(/[ \t]+/g, " ");
    } else if (el.type === "tag") {
      const tagName = (el as Element).tagName.toLowerCase();
      const $el = $(el);

      switch (tagName) {
        case "h1":
          result += `\n\n# ${inlineText($, $el)}\n\n`;
          break;
        case "h2":
          result += `\n\n## ${inlineText($, $el)}\n\n`;
          break;
        case "h3":
          result += `\n\n### ${inlineText($, $el)}\n\n`;
          break;
        case "h4":
          result += `\n\n#### ${inlineText($, $el)}\n\n`;
          break;
        case "h5":
          result += `\n\n##### ${inlineText($, $el)}\n\n`;
          break;
        case "h6":
          result += `\n\n###### ${inlineText($, $el)}\n\n`;
          break;

        case "p":
          result += `\n\n${processNode($, $el)}\n\n`;
          break;

        case "br":
          result += "\n";
          break;

        case "strong":
        case "b":
          result += `**${inlineText($, $el)}**`;
          break;

        case "em":
        case "i":
          result += `*${inlineText($, $el)}*`;
          break;

        case "a": {
          const href = $el.attr("href");
          const text = inlineText($, $el);
          if (href && text) {
            result += `[${text}](${href})`;
          } else {
            result += text;
          }
          break;
        }

        case "ul":
          result += "\n\n" + processListItems($, $el, "ul") + "\n\n";
          break;

        case "ol":
          result += "\n\n" + processListItems($, $el, "ol") + "\n\n";
          break;

        case "li":
          // Handled by processListItems, but handle standalone li
          result += `- ${inlineText($, $el)}\n`;
          break;

        case "table":
          result += "\n\n" + processTable($, $el) + "\n\n";
          break;

        case "div":
        case "section":
        case "article":
        case "main":
        case "header":
        case "footer":
        case "nav":
        case "aside":
        case "span":
          result += processNode($, $el);
          break;

        case "hr":
          result += "\n\n---\n\n";
          break;

        case "blockquote":
          result +=
            "\n\n" +
            processNode($, $el)
              .trim()
              .split("\n")
              .map((line) => `> ${line}`)
              .join("\n") +
            "\n\n";
          break;

        case "pre":
        case "code":
          result += "`" + $el.text().trim() + "`";
          break;

        default:
          // For unrecognized tags, process children (strip the tag)
          result += processNode($, $el);
          break;
      }
    }
  });

  return result;
}

function inlineText($: cheerio.CheerioAPI, $el: $Node): string {
  // Process inline content recursively to handle nested bold/italic/links
  let result = "";

  $el.contents().each((_, child) => {
    if (child.type === "text") {
      result += $(child).text().replace(/[ \t]+/g, " ");
    } else if (child.type === "tag") {
      const tag = (child as Element).tagName.toLowerCase();
      const $child = $(child);

      switch (tag) {
        case "strong":
        case "b":
          result += `**${inlineText($, $child)}**`;
          break;
        case "em":
        case "i":
          result += `*${inlineText($, $child)}*`;
          break;
        case "a": {
          const href = $child.attr("href");
          const text = inlineText($, $child);
          if (href && text) {
            result += `[${text}](${href})`;
          } else {
            result += text;
          }
          break;
        }
        case "br":
          result += "\n";
          break;
        case "code":
          result += "`" + $child.text().trim() + "`";
          break;
        default:
          result += inlineText($, $child);
          break;
      }
    }
  });

  return result.trim();
}

function processListItems(
  $: cheerio.CheerioAPI,
  $list: $Node,
  type: "ul" | "ol"
): string {
  const items: string[] = [];
  let index = 1;

  $list.children("li").each((_, li) => {
    const $li = $(li);
    const prefix = type === "ul" ? "- " : `${index}. `;
    const text = inlineText($, $li);
    if (text) {
      items.push(`${prefix}${text}`);
      index++;
    }
  });

  return items.join("\n");
}

function processTable($: cheerio.CheerioAPI, $table: $Node): string {
  const rows: string[][] = [];

  // Process header rows
  $table.find("thead tr, tr:has(th)").each((_, tr) => {
    const cells: string[] = [];
    $(tr)
      .find("th, td")
      .each((_, cell) => {
        cells.push(inlineText($, $(cell)));
      });
    if (cells.length > 0) {
      rows.push(cells);
    }
  });

  const headerRowCount = rows.length;

  // Process body rows
  $table.find("tbody tr, tr").each((_, tr) => {
    const $tr = $(tr);
    // Skip rows that are header rows (already processed)
    if ($tr.find("th").length > 0 && $tr.find("td").length === 0) return;
    // Skip if already in thead
    if ($tr.parent().is("thead")) return;

    const cells: string[] = [];
    $tr.find("td, th").each((_, cell) => {
      cells.push(inlineText($, $(cell)));
    });
    if (cells.length > 0) {
      rows.push(cells);
    }
  });

  if (rows.length === 0) return "";

  // Determine column count
  const colCount = Math.max(...rows.map((r) => r.length));

  // Normalize all rows to same column count
  const normalized = rows.map((row) => {
    while (row.length < colCount) row.push("");
    return row;
  });

  // Build markdown table
  const lines: string[] = [];

  if (headerRowCount > 0) {
    // Use first row as header
    lines.push("| " + normalized[0].join(" | ") + " |");
    lines.push("| " + normalized[0].map(() => "---").join(" | ") + " |");
    for (let i = 1; i < normalized.length; i++) {
      lines.push("| " + normalized[i].join(" | ") + " |");
    }
  } else {
    // No header row, just output rows with a separator after first
    lines.push("| " + normalized[0].join(" | ") + " |");
    lines.push("| " + normalized[0].map(() => "---").join(" | ") + " |");
    for (let i = 1; i < normalized.length; i++) {
      lines.push("| " + normalized[i].join(" | ") + " |");
    }
  }

  return lines.join("\n");
}
