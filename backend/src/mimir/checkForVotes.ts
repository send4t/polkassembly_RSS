import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  KUSAMA_PROVIDER,
  POLKADOT_PROVIDER,
  READY_FILE,
  TRACKS,
} from "../utils/constants";
import {
  Chain,
  InternalStatus,
  ReferendumId,
  SuggestedVote,
} from "../types/properties";
import { NotionPageId, NotionProperties } from "../types/notion";
import axios from "axios";
import { findNotionPageByPostId, getNotionPages } from "../findNotionPage";
import {
  loadReadyProposalsFromFile,
  saveReadyProposalsToFile,
} from "../utils/readyFileHandlers";

const notionApiToken = process.env.NOTION_API_TOKEN;

export async function checkForVotes(): Promise<void> {
  try {
    const readyProposals = await loadReadyProposalsFromFile(
      READY_FILE as string
    );

    if (readyProposals.length === 0) {
      console.info("No ready proposals found.");
      return;
    }
    console.table(readyProposals);

    const votedPolkadot = await fetchActiveVotes(
      process.env.POLKADOT_MULTISIG as string,
      Chain.Polkadot
    );
    const votedKusama = await fetchActiveVotes(
      process.env.KUSAMA_MULTISIG as string,
      Chain.Kusama
    );
    const votedList = [...votedPolkadot, ...votedKusama];

    const pages = await getNotionPages();

    readyProposals.forEach(async (proposal, index) => {
      const refId = Number(proposal.id);
      const found = votedList.includes(refId);
      if (!found) return;

      const page = await findNotionPageByPostId(pages, refId);

      if (page) {
        console.info(`Page found (checkForVotes): ${page.id}`);
        await updateNotionToVoted(page.id, proposal.voted);
        console.info(`Notion page ${page.id} updated: ${proposal.voted}`);
        readyProposals.splice(index, 1);
        await saveReadyProposalsToFile(readyProposals, READY_FILE as string);
      } else {
        console.error("Page not found, id: ", refId);
      }
    });
  } catch (error) {
    console.error("Error checking vote statuses (checkForVotes):", error);
  }
}

async function fetchActiveVotes(
  account: string,
  network: Chain
): Promise<ReferendumId[]> {
  try {
    const wsProvider = new WsProvider(
      network === Chain.Kusama ? KUSAMA_PROVIDER : POLKADOT_PROVIDER
    );
    const api = await ApiPromise.create({ provider: wsProvider });

    let allVotes: ReferendumId[] = [];
    console.log(`Fetching votes for account: ${account}`);
    for (const trackId of TRACKS) {
      const votingResult = (await api.query.convictionVoting.votingFor(
        account,
        trackId
      )) as any;

      votingResult.toHuman().Casting.votes.forEach((vote: any) => {
        const refId = (vote[0] as string).split(",").join("");
        if (Number.isNaN(Number(refId))) throw "Invalid referendum ID";
        allVotes.push(Number(refId));
      });
    }

    return allVotes;
  } catch (error) {
    console.error(`Error checking vote for account ${account}:`, error);
    throw error;
  }
}

/** Update a Referenda in the Notion database
 *  Referenda will be updated to VotedAye, VotedNay, VotedAbstain */
export async function updateNotionToVoted(
  pageId: NotionPageId,
  vote: SuggestedVote
): Promise<NotionPageId> {
  const notionApiUrl = `https://api.notion.com/v1/pages/${pageId}`;

  const properties: NotionProperties = {};

  let status: InternalStatus;

  switch (vote) {
    case SuggestedVote.Aye:
      status = InternalStatus.VotedAye;
      break;
    case SuggestedVote.Nay:
      status = InternalStatus.VotedNay;
      break;
    case SuggestedVote.Abstain:
      status = InternalStatus.VotedAbstain;
      break;

    default:
      throw Error(`Invalid SuggestedVote value: ${vote}`);
  }

  properties["Internal status"] = {
    type: "status",
    status: { name: status },
  };

  const data = { properties };

  try {
    await axios.patch(notionApiUrl, data, {
      headers: {
        Authorization: `Bearer ${notionApiToken}`,
        "Content-Type": "application/json",
        "Notion-Version": process.env.NOTION_VERSION,
      },
    });

    return pageId;
  } catch (error) {
    console.error(
      "Error updating page:",
      (error as any).response
        ? (error as any).response.data
        : (error as any).message
    );
    throw error;
  }
}
