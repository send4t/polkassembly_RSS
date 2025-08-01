import { ReadyProposal } from "../types/mimir";
import { NotionPage } from "../types/notion";
import {
  Chain,
  InternalStatus,
  ReferendumId,
  SuggestedVote,
} from "../types/properties";
import { proposeVoteTransaction } from "./proposeVote";
import { createSubsystemLogger, logError } from "../config/logger";
import { Subsystem, ErrorType } from "../types/logging";

const logger = createSubsystemLogger(Subsystem.MIMIR);

/** Decides whether to send transaction to Mimir with true or false value, abstain will not send transaction. */
export async function handleReferendaVote(
  page: NotionPage,
  network: Chain,
  postId: ReferendumId
): Promise<ReadyProposal | undefined> {
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
    logger.info({ postId, network, pageId: page.id }, "Proposal is in ReadyToVote status");
    let ready: ReadyProposal | undefined = undefined;
    switch (page.properties?.["Suggested vote"].select?.name) {
      case SuggestedVote.Aye:
        logger.info({ postId, network, vote: SuggestedVote.Aye }, "Sending transaction to Mimir (Aye)");
        ready = await proposeVoteTransaction(
          multisig,
          network,
          postId,
          SuggestedVote.Aye
        );
        break;
      case SuggestedVote.Nay:
        logger.info({ postId, network, vote: SuggestedVote.Nay }, "Sending transaction to Mimir (Nay)");
        ready = await proposeVoteTransaction(
          multisig,
          network,
          postId,
          SuggestedVote.Nay
        );
        break;
      case SuggestedVote.Abstain:
        logger.info({ postId, network, vote: SuggestedVote.Abstain }, "Sending transaction to Mimir (Abstain)");
        ready = await proposeVoteTransaction(
          multisig,
          network,
          postId,
          SuggestedVote.Abstain
        );
        break;
      default:
        logError(logger, { 
          postId, 
          network, 
          suggestedVote: page.properties?.["Suggested vote"].select?.name 
        }, "No suggested vote found", ErrorType.MISSING_VOTE);
    }

    if (ready) {
      return ready;
    } else {
      return undefined;
    }
  }
}
