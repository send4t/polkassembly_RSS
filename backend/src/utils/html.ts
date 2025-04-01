import { JSDOM } from "jsdom";

/** Converts HTML to Notion-compatible block elements */
export function convertHtmlToNotionBlocks(html: string) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Create a single toggle block that will contain all content
  const mainBlock = {
    object: "block",
    type: "toggle",
    toggle: {
      rich_text: [
        {
          type: "text",
          text: { content: "Content" },
        },
      ],
      children: [] as any[],
    },
  };

  document.body.childNodes.forEach((node) => {
    if (node.nodeType === 3 && node.textContent?.trim()) {
      // Text Node
      mainBlock.toggle.children.push(
        createParagraphBlock(node.textContent.trim())
      );
    } else if (node.nodeType === 1) {
      // Element Node
      const element = node as HTMLElement;
      if (element.nodeName === "P") {
        mainBlock.toggle.children.push(
          createParagraphBlock(element.textContent?.trim() || "")
        );
      } else if (element.nodeName === "H1") {
        mainBlock.toggle.children.push(
          createHeadingBlock(element.textContent || "", 1)
        );
      } else if (element.nodeName === "H2") {
        mainBlock.toggle.children.push(
          createHeadingBlock(element.textContent || "", 2)
        );
      } else if (element.nodeName === "UL") {
        mainBlock.toggle.children.push(
          ...createListBlocks(element as Element, "bulleted")
        );
      } else if (element.nodeName === "OL") {
        mainBlock.toggle.children.push(
          ...createListBlocks(element as Element, "numbered")
        );
      } else if (element.nodeName === "A") {
        mainBlock.toggle.children.push(
          createParagraphBlock(
            element.textContent || "",
            element.getAttribute("href") || undefined
          )
        );
      }
    }
  });

  return [mainBlock];
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
  node.childNodes.forEach((child) => {
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
