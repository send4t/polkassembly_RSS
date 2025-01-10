// update.js
const axios = require("axios");
require('dotenv').config();
const { fetchReferendumContent } = require('./rss');

const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

// Handle a single Referenda element, when updating referendas. Called by refreshReferendas
async function handleReferenda(referenda) {
  console.log("ID: ", referenda.post_id)
  const content = await fetchReferendumContent(referenda.post_id);

  console.info("Title: ", referenda.title);
  console.info("Amount: ", content.requested);
  console.info("Description: ", content.content);
  console.info("Status: ", content.status);

  const findResult = await findNotionPageByPostId(referenda.post_id);
  //console.log("findResult: ", findResult);
  if (findResult) {
      // UPDATE
  } else {
      // CREATE
  }
}


// Function to fetch data from Polkassembly API
async function fetchDataFromAPI(startPostId) {
  try {
    const url = `https://api.polkassembly.io/api/v1/latest-activity/all-posts?govType=open_gov&listingLimit=200&startPostId=${startPostId}`;
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
      console.log(`Successfully updated timeline for pageId: ${pageId} with status: ${timelineStatus}`);
    }
  } catch (error) {
    console.error("Error updating Notion page:", error.response?.data || error.message);
  }
}

// Main function to fetch data and update Notion
async function main(lastProcessedPostId) {
  const apiData = await fetchDataFromAPI(lastProcessedPostId);
  if (!apiData || !Array.isArray(apiData)) return;

  let lastPostId = lastProcessedPostId;

  for (const specificPost of apiData) {
    const postId = specificPost.post_id;
    const timelineStatus = specificPost.status;

    if (!timelineStatus) continue;

    const notionPage = await findNotionPageByPostId(postId);
    if (notionPage) {
      // Detailed log before updating the Notion page
      console.log(`Updating post ID: ${postId} with status: ${timelineStatus}`);
      
      await updateNotionTimeline(notionPage.id, timelineStatus);

      // Log after update to confirm success
      console.log(`Successfully updated post ID: ${postId} with status: ${timelineStatus}`);

      lastPostId = postId; // Update the last processed post ID
    }
  }

  return lastPostId; // Return the last processed post ID for the next batch
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

module.exports = { main, fetchDataFromAPI, findNotionPageByPostId, handleReferenda };
