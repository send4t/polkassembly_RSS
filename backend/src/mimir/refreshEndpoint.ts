import { getNotionPages } from "../findNotionPage";
import { handleReferendaVote } from "./handleReferenda";

export async function sendReadyProposalsToMimir(): Promise<void> {
    try {
        const pages = await getNotionPages();
        const mimirPromises = [];

        for (const page of pages) {
            const network = page.properties?.["Chain"].select?.name;
            const postId = page.properties?.["Number"].title[0].text.content;
            //console.log("Network: ", network);
            //console.log("Post ID: ", postId);

            const promise = handleReferendaVote(page, network, postId); 
            mimirPromises.push(promise);
        }

        await Promise.all(mimirPromises);

    } catch (error) {
        console.error("Error while sending ReadyToVote proposals to Mimir: ", (error as any).message);
        throw error;
    }
}