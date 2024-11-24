const axios = require('axios');
const moment = require('moment');
const notionDatabaseId = '117ca2a77d87817ab04fffee0f6c4ffd';
const notionApiUrl = 'https://api.notion.com/v1/pages';
const notionApiToken = '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';



// Function to fetch data from the API (assumed you already have this)

async function fetchDataFromAPI() {
    try {
        const url = 'https://api.polkassembly.io/api/v1/latest-activity/all-posts?govType=open_gov&listingLimit=10';
        const response = await axios.get(url, {
            headers: {
                'x-network': 'polkadot'  // Replace with the appropriate network identifier if different
            }
        });
        console.log(response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error fetching data from API:', error.response.status, error.response.data);
        } else {
            console.error('Request error:', error.message);
        }
    }
}

fetchDataFromAPI();

// Function to update Notion database
async function updateNotionDatabase(data) {
  try {
    for (const item of data) {
      const nameField = item.name; // Assuming "name" is the field with the ID and title

      // Extracting the post_id from the name field
      const postIdMatch = nameField.match(/#(\d+)/); // Match any number after "#"
      const postId = postIdMatch ? postIdMatch[1] : null;

      if (postId) {
        const notionPageData = {
          parent: { database_id: notionDatabaseId },
          properties: {
            Name: {
              title: [
                {
                  text: {
                    content: nameField,
                  },
                },
              ],
            },
            Post_ID: {
              rich_text: [
                {
                  text: {
                    content: postId,
                  },
                },
              ],
            },
            Created_Time: {
              date: {
                start: moment(item.created_time).toISOString(),
              },
            },
          },
        };

        // Check if the page with the post_id already exists
        const existingPage = await findNotionPageByPostId(postId);
        if (existingPage) {
          // Update existing page
          await updateNotionPage(existingPage.id, notionPageData);
        } else {
          // Create a new page
          await createNotionPage(notionPageData);
        }
      } else {
        console.log(`No valid post ID found in name field: ${nameField}`);
      }
    }
  } catch (error) {
    console.error("Error updating Notion database:", error);
  }
}

// Function to find an existing Notion page by post_id
async function findNotionPageByPostId(postId) {
  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${notionDatabaseId}/query`,
      {
        filter: {
          property: 'Post_ID',
          rich_text: {
            equals: postId,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${notionApiToken}`,
          'Notion-Version': '2024-11-01', // Update to the latest version of the Notion API
        },
      }
    );

    const results = response.data.results;
    if (results.length > 0) {
      return results[0]; // Assuming you want to match by the first result
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error finding Notion page by post_id:", error);
    return null;
  }
}

// Function to create a new page in Notion
async function createNotionPage(notionPageData) {
  try {
    const response = await axios.post(notionApiUrl, notionPageData, {
      headers: {
        Authorization: `Bearer ${notionApiToken}`,
        'Notion-Version': '2024-11-01',
      },
    });
    console.log("Notion page created:", response.data);
  } catch (error) {
    console.error("Error creating Notion page:", error);
  }
}

// Function to update an existing Notion page
async function updateNotionPage(pageId, notionPageData) {
  try {
    const response = await axios.patch(
      `https://api.notion.com/v1/pages/${pageId}`,
      notionPageData,
      {
        headers: {
          Authorization: `Bearer ${notionApiToken}`,
          'Notion-Version': '2024-11-01',
        },
      }
    );
    console.log("Notion page updated:", response.data);
  } catch (error) {
    console.error("Error updating Notion page:", error);
  }
}

// Main process
async function main() {
  const dataFromAPI = await fetchDataFromAPI();
  if (dataFromAPI && dataFromAPI.length > 0) {
    await updateNotionDatabase(dataFromAPI);
  } else {
    console.log("No data found from API.");
  }
}

main();
