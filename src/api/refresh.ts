import axios from "axios";
import { Chain } from "../types/properties";
import { createReferenda } from "./create";
import { fetchDataFromAPI } from "./fetchReferendas";
import { findNotionPageByPostId, getNotionPages } from "./findNotionPage";

const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;


export async function refreshReferendas() {
    try {
        if (!notionDatabaseId) throw "Please specify REFRESH_INTERVAL in .env!";

        // Fetch latest proposals from both networks
        const polkadotPosts = await fetchDataFromAPI(30, Chain.Polkadot);
        const kusamaPosts = await fetchDataFromAPI(30, Chain.Kusama);
        const pages = await getNotionPages();

        // Combine them into one array
        const referendas = [...polkadotPosts.referendas, ...kusamaPosts.referendas];

        // Go through the fetched referendas
        for (const referenda of referendas) {
            // If Referenda exist in Notion, update it, otherwise, create new page
            const found = await findNotionPageByPostId(pages, referenda.post_id);

            if (found) {
                console.log(`Proposal ${referenda.post_id} found in Notion.`);
                try {
                    // UPDATE
                    
                } catch (error) {
                    console.error("Error updating referenda: ", (error as any).message);
                }
            } else {
                console.log(`This proposal is not in Notion. ${referenda.post_id}`);
                console.log(referenda.status)
                try {
                    await createReferenda(notionDatabaseId, referenda, referenda.network);
                } catch (error) {
                    console.error("Error creating referenda: ", (error as any).message);
                }
            }
        }
    } catch (error) {
        console.error("Error while refreshing Referendas: ", (error as any).message);
    }
}