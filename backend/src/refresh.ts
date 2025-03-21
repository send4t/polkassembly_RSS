import { Chain, InternalStatus, SuggestedVote } from "./types/properties";
import { createReferenda } from "./notion/create";
import { fetchDataFromAPI } from "./polkAssembly/fetchReferendas";
import { findNotionPageByPostId, getNotionPages } from "./notion/findNotionPage";
import { fetchDotToUsdRate, fetchKusToUsdRate } from "./utils/utils";
import { updateReferenda } from "./notion/update";
import { proposeVoteTransaction } from "./mimir/proposeVote";

const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const multisig = process.env.MULTISIG?.split(",") || [];

export async function refreshReferendas() {
    try {
        if (!notionDatabaseId) throw "Please specify REFRESH_INTERVAL in .env!";
        console.log("Refreshing Referendas...")

        // Fetch latest proposals from both networks, get list of Notion pages and fetch exchange rates
        const [polkadotPosts, kusamaPosts, pages, dotUsdRate, kusUsdRate] = await Promise.all([
            fetchDataFromAPI(30, Chain.Polkadot),
            fetchDataFromAPI(30, Chain.Kusama),
            getNotionPages(),
            fetchDotToUsdRate(),
            fetchKusToUsdRate()
        ]);

        // Combine them into one array
        const referendas = [...polkadotPosts.referendas, ...kusamaPosts.referendas];

        // Go through the fetched referendas
        for (const referenda of referendas) {
            // If Referenda exist in Notion, update it, otherwise, create new page
            const found = await findNotionPageByPostId(pages, referenda.post_id);
            const exchangeRate = referenda.network === Chain.Polkadot ?dotUsdRate : kusUsdRate;

            if (found) {
                console.log(`Proposal ${referenda.post_id} found in Notion.`);

                if (found.properties?.['Internal status'].status?.name === InternalStatus.NotStarted) {
                    console.log("This proposal is ready to vote. Sending transaction to Mimir...");
                    switch (found.properties?.['Suggested vote'].select?.options.name) {
                        case SuggestedVote.Aye:
                            await proposeVoteTransaction(multisig, referenda.network, referenda.post_id, true, 1);
                            break;
                        case SuggestedVote.Nay:
                            await proposeVoteTransaction(multisig, referenda.network, referenda.post_id, false, 1);
                            break;
                        case SuggestedVote.Abstain:
                            await proposeVoteTransaction(multisig, referenda.network, referenda.post_id, true, 1);
                            break;
                        default:
                            console.error("No suggested vote found.");
                    }
                }

                try {
                    await updateReferenda(found.id, referenda, exchangeRate, referenda.network);
                } catch (error) {
                    console.error("Error updating referenda: ", (error as any).message);
                }
            } else {
                console.log(`This proposal is not in Notion. ${referenda.post_id}`);
                try {
                    await createReferenda(notionDatabaseId, referenda, exchangeRate, referenda.network);
                } catch (error) {
                    console.error("Error creating referenda: ", (error as any).message);
                }
            }
        }
    } catch (error) {
        console.error("Error while refreshing Referendas: ", (error as any).message);
    }
}