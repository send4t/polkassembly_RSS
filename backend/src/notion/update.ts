import axios from "axios";
import { fetchReferendumContent } from "../polkAssembly/fetchReferendas";
import { NotionPageId, NotionProperties, NotionUpdatePageRequest, UpdateReferendumInput } from "../types/notion";
import { PolkassemblyReferenda } from "../types/polkassemly";
import { Chain } from "../types/properties";
import { calculateReward, getValidatedStatus, sleep } from "../utils/utils";
import { updateContent } from "./updateContent";

const notionApiToken = process.env.NOTION_API_TOKEN;


/** Update a Referenda in the Notion database */
export async function updateReferenda(
    pageId: NotionPageId,
    referenda: PolkassemblyReferenda,
    exchangeRate: number,
    network: Chain
): Promise<NotionPageId> {
    const notionApiUrl = `https://api.notion.com/v1/pages/${pageId}`;
    const maxRetries = 3;
    let attempt = 0;

    // Fetch content (description) and reward information
    const contentResp = await fetchReferendumContent(referenda.post_id, referenda.network);
    const rewardString = calculateReward(contentResp, exchangeRate, network);

    // Fill the properties, that are coming from Polkassembly
    const properties: UpdateReferendumInput = {
        title: referenda.title,
        number: referenda.post_id,
        requestedAmount: rewardString,
        referendumTimeline: getValidatedStatus(referenda.status)
    }

    // Prepare the data for Notion
    const data = prepareNotionData(properties);

    try {
        await axios.patch(notionApiUrl, data, {
            headers: {
              'Authorization': `Bearer ${notionApiToken}`,
              'Content-Type': 'application/json',
              'Notion-Version': process.env.NOTION_VERSION,
            },
        });

        await sleep(100);
        
        attempt = 0;
        let contentUpdateSuccess = false;
        
        // Retry loop for content update
        while (attempt < maxRetries && !contentUpdateSuccess) {
            try {
                await updateContent(pageId, contentResp.content);
                contentUpdateSuccess = true;
            } catch (contentError) {
                attempt++;
                console.log(`Content update attempt ${attempt} failed: ${(contentError as any).message}`);
                
                if (attempt < maxRetries) {
                    const delayMs = 200 * Math.pow(2, attempt - 1);
                    console.log(`Retrying after ${delayMs}ms...`);
                    await sleep(delayMs);
                } else {
                    console.error('Max retries reached for content update, giving up.');
                    throw contentError;
                }
            }
        }

        return pageId;
        
    } catch (error) {
        console.error('Error updating page:', (error as any).response ? (error as any).response.data : (error as any).message);
        throw error;
    }
}

function prepareNotionData(input: UpdateReferendumInput): NotionUpdatePageRequest {
    const properties: NotionProperties = {};

    if (input.title && input.number) {
        properties['Title'] = {
            type: 'rich_text',
            rich_text: [{ text: { content: `#${input.number}-${input.title}` } }]
        };
    }

    if (input.requestedAmount !== undefined) {
        properties['Requested $'] = {
            type: 'number',
            number: input.requestedAmount === null ? undefined : input.requestedAmount
        };
    }

    if (input.referendumTimeline) {
        properties['Referendum timeline'] = {
            type: 'status',
            status: { name: input.referendumTimeline }
        };
    }

    return { properties };
}