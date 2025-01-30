import axios from 'axios';

const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

/** Create a Referenda in the Notion database */
export async function createReferenda(databaseId: NotionDatabaseId, title: string, amount: number) {
  const notionApiUrl = 'https://api.notion.com/v1/pages';

  const data = {
    parent: { database_id: databaseId },
    properties: {
      'Name': {
        title: [{ text: { content: title } }]
      },
      'Requested $': {
        type: 'number',
        number: amount
      },
    }
  };

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