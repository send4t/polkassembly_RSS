const { main } = require("./update");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    await main();
    return res.status(200).send("Update completed successfully.");
  } catch (error) {
    console.error("Error running update:", error.message);
    return res.status(500).send("An error occurred during the update process.");
  }
}
