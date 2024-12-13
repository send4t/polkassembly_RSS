const { main } = require("./update");

let lastProcessedPostId = null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    if (req.body.reset) {
      lastProcessedPostId = parseInt(req.body.lastProcessedPostId || 1229, 10);
      console.log(`Starting update process from post ID: ${lastProcessedPostId}`);
    }

    // Process the next batch
    const nextPostId = await main(lastProcessedPostId);
    lastProcessedPostId = nextPostId;

    res.status(200).json({
      message: `Processed posts up to ID: ${lastProcessedPostId}`,
      nextPostId: lastProcessedPostId,
    });
  } catch (error) {
    console.error("Error during update:", error.message);
    res.status(500).json({ error: error.message });
  }
}
