import axios from "axios";
import { convertHtmlToNotionBlocks } from "../utils/html";
import { NotionPageId } from "../types/notion";

const notionApiToken = process.env.NOTION_API_TOKEN;

export async function updateContent(pageId: NotionPageId, content: string) {
  const notionApiUrl = `https://api.notion.com/v1/blocks/${pageId}/children`;

  try {
    // Retrieve existing blocks
    const existingBlocksResponse = await axios.get(notionApiUrl, {
      headers: {
        Authorization: `Bearer ${notionApiToken}`,
        "Notion-Version": process.env.NOTION_VERSION,
      },
    });

    const existingBlocks: { id: string; type: string }[] =
      existingBlocksResponse.data.results;

    // Delete existing paragraph blocks
    const deletePromises = existingBlocks.map((block) =>
      axios.delete(`https://api.notion.com/v1/blocks/${block.id}`, {
        headers: {
          Authorization: `Bearer ${notionApiToken}`,
          "Notion-Version": process.env.NOTION_VERSION,
        },
      })
    );

    await Promise.all(deletePromises); // Delete all in parallel

    // Convert HTML content to Notion blocks
    const newDescriptionBlocks = convertHtmlToNotionBlocks(content);

    if (newDescriptionBlocks.length === 0) {
      console.log("No content to update.");
      return;
    }

    // Add new blocks
    await axios.patch(
      notionApiUrl,
      { children: newDescriptionBlocks },
      {
        headers: {
          Authorization: `Bearer ${notionApiToken}`,
          "Content-Type": "application/json",
          "Notion-Version": process.env.NOTION_VERSION,
        },
      }
    );

    console.log(`Description updated successfully for proposal ${pageId}`);
  } catch (error) {
    console.error(
      "Error updating content:",
      (error as any).response
        ? (error as any).response.data
        : (error as any).message
    );
  }
}
