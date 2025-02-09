import { NotionDatabaseId } from "../types/notion";
import { PolkassemblyReferenda } from "../types/polkassemly";
import { Chain } from "../types/properties";

const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;


/** Update a Referenda in the Notion database */
async function updateReferenda(
    databaseId: NotionDatabaseId,
    referenda: PolkassemblyReferenda,
    exchangeRate: number,
    network: Chain
) {
    try {
        
    } catch (error) {
        console.error('Error updating page:', (error as any).response ? (error as any).response.data : (error as any).message);
    }
}