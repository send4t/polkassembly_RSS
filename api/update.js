const axios = require("axios");

const notionDatabaseId = "117ca2a77d87817ab04fffee0f6c4ffd";
const notionApiUrl = "https://api.notion.com/v1/pages";
const notionApiToken = "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";

// Function to fetch data from Polkassembly API
async function fetchDataFromAPI() {
  try {
    console.log("Fetching data from Polkassembly API...");
    const url =
      "https://api.polkassembly.io/api/v1/latest-activity/all-posts?govType=open_gov&listingLimit=50";
    const response = await axios.get(url, {
      headers: {
        "x-network": "polkadot", // Replace with the appropriate network identifier if different
      },
    });

    // Debugging: Log the structure of the response
    console.log("API Response Structure:", JSON.stringify(response.data, null, 2));

    // Adjust to match the actual structure (example assumes posts are in `response.data.posts`)
    return response.data.posts || []; // Use `|| []` as a fallback if `posts` is undefined
  } catch (error) {
    console.error(
      "Error fetching data from Polkassembly API:",
      error.response ? error.response.status : error.message
    );
    return [];
  }
}

// Function to query Notion database for a matching "Number" (post_id)
async function findNotionPageByPostId(postId) {
  try {
    console.log("Querying Notion with postId:", postId);

    const response = await axios.post(
      `https://api.notion.com/v1/databases/${notionDatabaseId}/query`,
      {
        filter: {
          property: "Number", // Adjust this to match your schema
          number: {
            equals: parseInt(postId), // Ensure postId type matches the database
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${notionApiToken}`,
          "Notion-Version": "2022-06-28", // Use a valid API version
        },
      }
    );

    console.log("Query Response:", JSON.stringify(response.data, null, 2));
    return response.data.results.length > 0 ? response.data.results[0] : null;
  } catch (error) {
    console.error("Error querying Notion database:", error.response?.data || error.message);
    return null;
  }
}

// Function to update the "Timeline" property of a Notion page
async function updateNotionTimeline(pageId, timelineStatus) {
  try {
    console.log("Updating timeline for page:", pageId, "with status:", timelineStatus);

    // Define the valid status options for the "Timeline" property (if it's a Status field)
    const validTimelineStatuses = [
      "Lead-in",
      "In Progress",
      "Deciding",
      "Confirmation",
      "Enactment",
      "Timed out",
      "Executed"
    ];

    // Check if the provided status is valid
    if (!validTimelineStatuses.includes(timelineStatus)) {
      console.error(`Invalid timeline status: ${timelineStatus}. Valid options are: ${validTimelineStatuses.join(', ')}`);
      return;
    }

    // Prepare the payload for updating the timeline status
    const updatePayload = {
      properties: {
        Timeline: {
          status: {
            name: timelineStatus, // For Status type field, use `status` instead of `select`
          },
        },
      },
    };

    console.log("Payload being sent to Notion:", JSON.stringify(updatePayload, null, 2));

    const response = await axios.patch(
      `${notionApiUrl}/${pageId}`,
      updatePayload,
      {
        headers: {
          Authorization: `Bearer ${notionApiToken}`,
          "Notion-Version": "2022-06-28", // Use the correct Notion API version
        },
      }
    );

    console.log("Notion page successfully updated:", response.data);
  } catch (error) {
    console.error(
      `Error updating timeline for Notion page ${pageId}:`,
      error.response?.data || error.message
    );
  }
}

// Main function to fetch data and update Notion
async function main() {
  console.log("Starting process for all proposals...");

  const apiData = await fetchDataFromAPI();
  if (!apiData || !Array.isArray(apiData)) {
    console.error("API data is not in an iterable format. Exiting.");
    return;
  }

  for (const specificPost of apiData) {
    const postId = specificPost.post_id;
    const timelineStatus = specificPost.status; // Use the "status" field from the API

    console.log(`Processing post_id: ${postId}, timelineStatus: ${timelineStatus}`);

    const notionPage = await findNotionPageByPostId(postId);
    if (notionPage) {
      console.log(`Found Notion page: ${notionPage.id} for post_id: ${postId}`);
      await updateNotionTimeline(notionPage.id, timelineStatus);
    } else {
      console.log(`No matching Notion page found for post_id: ${postId}`);
    }
  }

  console.log("Process completed for all proposals.");
}

main();
