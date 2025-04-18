import { getNotionPages } from "../findNotionPage";
import { handleReferendaVote } from "./handleReferenda";

export async function sendReadyProposalsToMimir(): Promise<void> {
  try {
    console.info("Sending ReadyToVote proposals to Mimir ...");
    const pages = await getNotionPages();
    const mimirPromises = [];

    for (const page of pages) {
      const network = page.properties?.["Chain"].select?.name;
      const postId = page.properties?.["Number"].title[0].text.content;

      const promise = handleReferendaVote(page, network, postId);
      mimirPromises.push(promise);
    }

    const results = await Promise.allSettled(mimirPromises);

    // Log failed operations
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`Promise ${index} failed:`, result.reason);
      }
    });
  } catch (error) {
    console.error(
      "Error while sending ReadyToVote proposals to Mimir: ",
      (error as any).message
    );
    throw error;
  }
}
