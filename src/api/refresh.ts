import { Chain } from "../types/properties";
import { createReferenda } from "./create";
import { fetchDataFromAPI } from "./fetchReferendas";
import { fetchDotToUsdRate } from "./rss";
import { handleReferenda } from "./update";


export async function refreshReferendas() {
    // Fetch latest proposals from both networks
    const polkadotPosts = await fetchDataFromAPI(30, Chain.Polkadot);
    const kusamaPosts = await fetchDataFromAPI(30, Chain.Kusama);

    // Combine them into one array
    const referendas = [...polkadotPosts.referendas, ...kusamaPosts.referendas];

    console.log("The Referendas: ", referendas);

    return;

    const create = createReferenda(process.env.NOTION_DATABASE_ID as any, referendas[1], Chain.Polkadot)
    
    return;


    console.log("Referendas: ", referendas);
    console.log("referenda count: ", referendas.length);
    const dotToUsdRate = await fetchDotToUsdRate();

    for (let i = 0; i < referendas.length; i++) {
        //console.log("Referenda: ", referendas[i]);
        await handleReferenda(referendas[i], dotToUsdRate);
    }
}