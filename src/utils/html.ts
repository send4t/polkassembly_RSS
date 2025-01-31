import { JSDOM } from 'jsdom';


/** Converts HTML to Notion-compatible block elements */
export function convertHtmlToNotionBlocks(html: string) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const blocks: any[] = [];
  
    document.body.childNodes.forEach(node => {
      if (node.nodeType === 3) {
        // Text Node
        blocks.push(createParagraphBlock(node.textContent?.trim() || ""));
      } else if (node.nodeType === 1) {
        // Element Node
        if (node.nodeName === "P") {
          blocks.push(createParagraphBlock(node.textContent?.trim() || ""));
        } else if (node.nodeName === "H1") {
          blocks.push(createHeadingBlock(node.textContent || "", 1));
        } else if (node.nodeName === "H2") {
          blocks.push(createHeadingBlock(node.textContent || "", 2));
        } else if (node.nodeName === "UL") {
          blocks.push(...createListBlocks(node, "bulleted"));
        } else if (node.nodeName === "OL") {
          blocks.push(...createListBlocks(node, "numbered"));
        } else if (node.nodeName === "A") {
          blocks.push(createParagraphBlock(node.textContent || "", node.getAttribute("href")));
        }
      }
    });
  
    return blocks;
  }
  
/** Creates a paragraph block */
function createParagraphBlock(text: string, link?: string) {
    return {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: text,
              link: link ? { url: link } : undefined,
            },
          },
        ],
      },
    };
  }
  
/** Creates a heading block */
function createHeadingBlock(text: string, level: 1 | 2 | 3) {
    return {
      object: "block",
      type: `heading_${level}`,
      [`heading_${level}`]: {
        rich_text: [
          {
            type: "text",
            text: { content: text },
          },
        ],
      },
    };
  }
  
/** Creates bulleted or numbered list blocks */
function createListBlocks(node: Element, listType: "bulleted" | "numbered") {
    const items: any[] = [];
    node.childNodes.forEach(child => {
      if (child.nodeName === "LI") {
        items.push({
          object: "block",
          type: `${listType}_list_item`,
          [`${listType}_list_item`]: {
            rich_text: [
              {
                type: "text",
                text: { content: child.textContent?.trim() || "" },
              },
            ],
          },
        });
      }
    });
    return items;
}