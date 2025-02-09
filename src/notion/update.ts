import axios from "axios";
import { fetchReferendumContent } from "../polkAssembly/fetchReferendas";
import { NotionPageId, NotionProperties, NotionUpdatePageRequest, UpdateReferendumInput } from "../types/notion";
import { PolkassemblyReferenda } from "../types/polkassemly";
import { Chain } from "../types/properties";
import { calculateReward, getValidatedStatus } from "../utils/utils";
import { updateContent } from "./updateContent";

const notionApiToken = process.env.NOTION_API_TOKEN;


/** Update a Referenda in the Notion database */
export async function updateReferenda(
    pageId: NotionPageId,
    referenda: PolkassemblyReferenda,
    exchangeRate: number,
    network: Chain
) {
    const notionApiUrl = `https://api.notion.com/v1/pages/${pageId}`;

    // Fetch content (description) and reward information
    const contentResp = await fetchReferendumContent(referenda.post_id, referenda.network);
    const rewardString = calculateReward(contentResp, exchangeRate, network);

    // Fill the properties, that are coming from Polkassembly
    const properties: UpdateReferendumInput = {
        name: referenda.title,
        number: referenda.post_id,
        requestedAmount: rewardString,
        timeline: getValidatedStatus(referenda.status)
    }

    // Prepare the data for Notion
    const data = prepareNotionData(properties);

    try {
        const response = await axios.patch(notionApiUrl, data, {
            headers: {
              'Authorization': `Bearer ${notionApiToken}`,
              'Content-Type': 'application/json',
              'Notion-Version': process.env.NOTION_VERSION,
            },
        });

        // Add content to the newly created page
        await updateContent(pageId, contentResp.content);
        
    } catch (error) {
        console.error('Error updating page:', (error as any).response ? (error as any).response.data : (error as any).message);
        throw error;
    }
}

function prepareNotionData(input: UpdateReferendumInput): NotionUpdatePageRequest {
    const properties: NotionProperties = {};

    if (input.name) {
        properties['Name'] = {
            type: 'title',
            title: [{ text: { content: `#${input.number}-${input.name}` } }]
        };
    }

    if (input.requestedAmount !== undefined) {
        properties['Requested $'] = {
            type: 'number',
            number: input.requestedAmount
        };
    }

    if (input.timeline) {
        properties['Timeline'] = {
            type: 'status',
            status: { name: input.timeline }
        };
    }

    return { properties };
}