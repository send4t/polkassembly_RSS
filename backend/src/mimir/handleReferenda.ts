import { ReadyProposal } from "../types/mimir";
import { NotionPage } from "../types/notion";
import {
  Chain,
  InternalStatus,
  ReferendumId,
  SuggestedVote,
} from "../types/properties";
import { READY_FILE } from "../utils/constants";
import {
  loadReadyProposalsFromFile,
  saveReadyProposalsToFile,
} from "../utils/readyFileHandlers";
import { proposeVoteTransaction } from "./proposeVote";

/** Decides whether to send transaction to Mimir with true or false value, abstain will not send transaction. */
export async function handleReferendaVote(
  page: NotionPage,
  network: Chain,
  postId: ReferendumId
): Promise<void> {
  const readyProposals = await loadReadyProposalsFromFile(READY_FILE as string);

  let multisig: string = "";
  if (network === Chain.Polkadot) {
    multisig = process.env.POLKADOT_MULTISIG || "";
  }
  if (network === Chain.Kusama) {
    multisig = process.env.KUSAMA_MULTISIG || "";
  }

  //console.log("Internal status: ", page.properties?.['Internal status'].status?.name);
  if (
    page.properties?.["Internal status"].status?.name ===
    InternalStatus.ReadyToVote
  ) {
    console.info("This proposal is in ReadyToVote status.");
    let ready: ReadyProposal | undefined = undefined;
    switch (page.properties?.["Suggested vote"].select?.name) {
      case SuggestedVote.Aye:
        console.info("Sending transaction to Mimir (Aye) ...");
        ready = await proposeVoteTransaction(
          multisig,
          network,
          postId,
          SuggestedVote.Aye
        );
        break;
      case SuggestedVote.Nay:
        console.info("Sending transaction to Mimir (Nay) ...");
        ready = await proposeVoteTransaction(
          multisig,
          network,
          postId,
          SuggestedVote.Nay
        );
        break;
      case SuggestedVote.Abstain:
        console.info("Sending transaction to Mimir (Abstain) ...");
        ready = await proposeVoteTransaction(
          multisig,
          network,
          postId,
          SuggestedVote.Abstain
        );
        break;
      default:
        console.error("No suggested vote found.");
        console.error(
          "Suggested vote field is: ",
          page.properties?.["Suggested vote"].select?.name
        );
    }

    if (ready) {
      readyProposals.push(ready);
      await saveReadyProposalsToFile(readyProposals, READY_FILE as string);
    }
  }
}
