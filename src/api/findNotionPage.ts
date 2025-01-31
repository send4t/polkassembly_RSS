import axios from "axios";

const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;


/** Function to query Notion database for a matching "URL" (post_id from URL) */ 
export async function findNotionPageByPostId(postId: number) {
    try {
      const postIdString = postId.toString();
  
      const response = await axios.post(
        `https://api.notion.com/v1/databases/${notionDatabaseId}/query`,
        {},
        {
          headers: {
            Authorization: `Bearer ${notionApiToken}`,
            "Notion-Version": "2022-06-28",
          },
        }
      );
  
      if (response.data.results) {
        for (const page of response.data.results) {
          const urlProperty = page.properties.Link?.url || "";
          const match = urlProperty.match(/(\d+)$/);
          if (match && match[1] === postIdString) {
            return page;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error querying Notion database:", (error as any).message);
      return null;
    }
}