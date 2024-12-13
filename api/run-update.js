// run-update.js
const { main } = require("./update");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    let lastProcessedPostId = parseInt(req.body.lastProcessedPostId || 1229, 10); // Default to 1229 if not passed
    console.log(`Starting update from post ID: ${lastProcessedPostId}`);

    // Call the main update function with the last processed post ID
    const nextPostId = await main(lastProcessedPostId); // Assuming `main` accepts the starting post ID

    // Return the nextPostId to continue from where the batch left off
    return res.status(200).json({ nextPostId });
  } catch (error) {
    console.error("Error running update:", error.message);
    return res.status(500).send("An error occurred during the update process.");
  }
}
