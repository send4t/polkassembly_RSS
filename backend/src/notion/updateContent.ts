import axios from "axios";
import { convertHtmlToNotionBlocks } from "../utils/html";
import { NotionPageId } from "../types/notion";
import { RateLimitHandler } from "../utils/rateLimitHandler";
import { RATE_LIMIT_CONFIGS } from "../config/rate-limit-config";
import { createSubsystemLogger } from "../config/logger";
import { Subsystem } from "../types/logging";

const logger = createSubsystemLogger(Subsystem.NOTION);

const notionApiToken = process.env.NOTION_API_TOKEN;

export async function updateContent(pageId: NotionPageId, content: string) {
  const notionApiUrl = `https://api.notion.com/v1/blocks/${pageId}/children`;
  const rateLimitHandler = RateLimitHandler.getInstance();

  try {
    // Retrieve existing blocks with rate limiting
    const existingBlocksResponse = await rateLimitHandler.executeWithRateLimit(
      async () => {
        return await axios.get(notionApiUrl, {
          headers: {
            Authorization: `Bearer ${notionApiToken}`,
            "Notion-Version": process.env.NOTION_VERSION,
          },
        });
      },
      RATE_LIMIT_CONFIGS.bulk,
      `get-blocks-${pageId}`
    );

    const existingBlocks: { id: string; type: string }[] =
      existingBlocksResponse.data.results;

    // Delete existing paragraph blocks with rate limiting
    const deletePromises = existingBlocks.map((block, index) =>
      rateLimitHandler.executeWithRateLimit(
        async () => {
          return await axios.delete(`https://api.notion.com/v1/blocks/${block.id}`, {
            headers: {
              Authorization: `Bearer ${notionApiToken}`,
              "Notion-Version": process.env.NOTION_VERSION,
            },
          });
        },
        RATE_LIMIT_CONFIGS.bulk,
        `delete-block-${block.id}-${index}`
      )
    );

    await Promise.all(deletePromises); // Delete all in parallel with rate limiting

    // Convert HTML content to Notion blocks
    const newDescriptionBlocks = convertHtmlToNotionBlocks(content);

    if (newDescriptionBlocks.length === 0) {
      logger.debug({ pageId }, "No content to update");
      return;
    }

    // Add new blocks with rate limiting
    await rateLimitHandler.executeWithRateLimit(
      async () => {
        return await axios.patch(
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
      },
      RATE_LIMIT_CONFIGS.bulk,
      `patch-content-${pageId}`
    );

    logger.info({ pageId, blocksCount: newDescriptionBlocks.length }, `Description updated successfully`);
  } catch (error) {
    logger.error({ 
      pageId,
      error: (error as any).response ? (error as any).response.data : (error as any).message
    }, "Error updating content");
  }
}
