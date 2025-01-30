import axios from 'axios';

const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

/** Create a Referenda in the Notion database */
export async function createReferenda(databaseId: NotionDatabaseId, title: string, amount: number) {
  const notionApiUrl = 'https://api.notion.com/v1/pages';
  if (!notionDatabaseId) throw "Please specify NOTION_DATABASE_ID in .env!";

  const data: ReferendaPage = {
    object: "page",
    parent: { database_id: notionDatabaseId, type: "database_id" },
    properties: {
      'Name': {
        type: 'title',
        title: [{ text: { content: title } }]
      },
      'Requested $': {
        type: 'number',
        number: null
      },
      'Description': {
        type: 'rich_text',
        rich_text: [{ text: { content: "Hello World description" } }]
      },
      'Proposer': {
        type: 'rich_text',
        rich_text: [{ text: { content: "null" } }]
      },
      'Status': {
        type: 'select',
        select: { name: "null", id: undefined }
      },
      'Track Number': {
        type: 'number',
        number: null
      },
      'Hash': {
        type: 'rich_text',
        rich_text: [{ text: { content: "null" } }]
      },
      'Type': {
        type: 'select',
        select: { name: "null", id: undefined }
      },
      'Created At': {
        type: 'date',
        date: { start: new Date().toISOString() }
      },
      'Proposal Block': {
        type: 'rich_text',
        rich_text: [{ text: { content: "null" } }]
      },
      'Origin': {
        type: 'rich_text',
        rich_text: [{ text: { content: "null" } }]
      },
      'Spam Status': {
        type: 'checkbox',
        checkbox: false
      },
      'Spam Report Invalid': {
        type: 'checkbox',
        checkbox: false
      },
      'Spam Users Count': {
        type: 'number',
        number: null
      }
    },
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