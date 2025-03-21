import { NotionPage } from "../types/notion";
import { Chain, InternalStatus, ReferendumId, SuggestedVote } from "../types/properties";
import { proposeVoteTransaction } from "./proposeVote";


/** Decides whether to send transaction to Mimir with true or false value, abstain will not send transaction. */
export async function handleReferendaVote(page: NotionPage, network: Chain, postId: ReferendumId): Promise<void> {
    let multisig: string[] = [];
    if (network === Chain.Polkadot) {
        multisig = process.env.POLKADOT_MULTISIG?.split(",") || [];
    }
    if (network === Chain.Kusama) {
        multisig = process.env.KUSAMA_MULTISIG?.split(",") || [];
    }

    //console.log("Internal status: ", page.properties?.['Internal status'].status?.name);
    if (page.properties?.['Internal status'].status?.name === InternalStatus.ReadyToVote) {
        console.info("This proposal is in ReadyToVote status.");
        switch (page.properties?.['Suggested vote'].select?.options?.name) {
            case SuggestedVote.Aye:
                console.info("Sending transaction to Mimir (Aye) ...");
                await proposeVoteTransaction(multisig, network, postId, true, 1);
                break;
            case SuggestedVote.Nay:
                console.info("Sending transaction to Mimir (Nay) ...");
                await proposeVoteTransaction(multisig, network, postId, false, 1);
                break;
            case SuggestedVote.Abstain:
                console.info("Abstain, not sending transaction to Mimir.");
                break;
            default:
                console.error("No suggested vote found.");
                console.error("Suggested vote field is: ", page.properties?.['Suggested vote'].select?.options?.name);
        }
    }
}