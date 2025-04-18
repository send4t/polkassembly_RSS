import { ReadyProposal } from "../types/mimir";

/* Saves readyProposals to a file, as JSON */
export async function saveReadyProposalsToFile(
  readyProposals: ReadyProposal[],
  filePath: string
): Promise<void> {
  try {
    const fs = require("fs").promises;
    const path = require("path");
    const dir = path.dirname(filePath);

    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(filePath, JSON.stringify(readyProposals, null, 2));
  } catch (error) {
    console.error("Error saving ready proposals to file:", error);
    throw error;
  }
}

/* Loads readyProposals from a file, file has to be JSON */
export async function loadReadyProposalsFromFile(
  filePath: string
): Promise<ReadyProposal[]> {
  try {
    const fs = require("fs").promises;

    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading ready proposals from file:", error);
    throw error;
  }
}
