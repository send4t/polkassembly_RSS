const axios = require("axios");



// Function to fetch data from Polkassembly API
async function fetchDataFromAPI() {
  try {
    const url =
      "https://api.polkassembly.io/api/v1/latest-activity/all-posts?govType=open_gov&listingLimit=200";
    const response = await axios.get(url, {
      headers: {
        "x-network": "polkadot",
      },
    });
    return response.data.posts || [];
  } catch (error) {
    console.error("Error fetching data from Polkassembly API:", error.message);
    return [];
  }
}

// Function to query Notion database for a matching "URL" (post_id from URL)
async function findNotionPageByPostId(postId) {
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
    console.error("Error querying Notion database:", error.message);
    return null;
  }
}

// Function to update 'Referendum timeline' field in Notion page
async function updateNotionTimeline(pageId, timelineStatus) {
  try {
    const response = await axios.patch(
      `https://api.notion.com/v1/pages/${pageId}`,
      {
        properties: {
          'Referendum timeline': {
            status: {
              name: timelineStatus,
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${notionApiToken}`,
          "Notion-Version": "2022-06-28",
        },
      }
    );
    if (response.status === 200) {
      console.log(`Successfully updated timeline for pageId: ${pageId}`);
    }
  } catch (error) {
    console.error("Error updating Notion page:", error.response?.data || error.message);
  }
}


// Main function to fetch data and update Notion
async function main() {
  const apiData = await fetchDataFromAPI();
  if (!apiData || !Array.isArray(apiData)) return;

  const filteredPosts = apiData.filter(
    (post) => post.post_id >= 1229 && post.post_id <= 1400
  );

  for (const specificPost of filteredPosts) {
    const postId = specificPost.post_id;
    const timelineStatus = specificPost.status;

    if (!timelineStatus) continue;

    const notionPage = await findNotionPageByPostId(postId);
    if (notionPage) {
      await updateNotionTimeline(notionPage.id, timelineStatus);
    }
  }
}

module.exports = { main };
