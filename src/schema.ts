import axios from 'axios';
import fs from 'fs';

const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

export async function getDatabaseSchema() {
    const response = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${notionApiToken}`,
        'Notion-Version': '2021-05-13', // Make sure to use the correct API version
      },
    });
  
    const data = await response.json();
    fs.writeFileSync('schema.txt', JSON.stringify(data))
    console.log(data);
}