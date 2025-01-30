import axios from 'axios';
import { Chain, CreateReferendumInput, NotionCreatePageRequest, NotionDatabaseId, NotionProperties, Origin, TimelineStatus, VoteStatus } from '../types/notion';

const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

/** Create a Referenda in the Notion database */
export async function createReferenda(databaseId: NotionDatabaseId, title: string, amount: number) {
  const notionApiUrl = 'https://api.notion.com/v1/pages';
  if (!notionDatabaseId) throw "Please specify NOTION_DATABASE_ID in .env!";

  const properties: CreateReferendumInput = {
    name: "Enums",
    requestedAmount: 320,
    chain: Chain.Polkadot,
    origin: Origin.SmallSpender,
    timeline: TimelineStatus.Deciding,
    status: VoteStatus.Considering 
  }

  const data = prepareNotionData(databaseId, properties);
  

  try {
    const response = await axios.post(notionApiUrl, data, {
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': process.env.NOTION_VERSION,
      },
    });

    console.log('Page created successfully:', response.data);
  } catch (error) {
    console.error('Error creating page:', (error as any).response ? (error as any).response.data : (error as any).message);
  }
}

function prepareNotionData(
    databaseId: string, 
    input: CreateReferendumInput
  ): NotionCreatePageRequest {
    const properties: NotionProperties = {};
  
    if (input.name) {
      properties['Name'] = {
        type: 'title',
        title: [{ text: { content: input.name } }]
      };
    }
  
    if (input.requestedAmount !== undefined) {
      properties['Requested $'] = {
        type: 'number',
        number: input.requestedAmount
      };
    }
  
    if (input.chain) {
      properties['Chain'] = {
        type: 'select',
        select: { name: input.chain }
      };
    }
  
    if (input.origin) {
      properties['Origin'] = {
        type: 'select',
        select: { name: input.origin }
      };
    }
  
    if (input.timeline) {
      properties['Timeline'] = {
        type: 'status',
        status: { name: input.timeline }
      };
    }
  
    if (input.status) {
      properties['Status'] = {
        type: 'status',
        status: { name: input.status }
      };
    }
  
    return {
      object: 'page',
      parent: {
        database_id: databaseId,
        type: 'database_id'
      },
      properties
    };
  }
  