import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  KUSAMA_PROVIDER,
  POLKADOT_PROVIDER,
  READY_FILE,
  SUBSCAN_ROW_COUNT,
  TRACKS,
} from "../utils/constants";
import {
  Chain,
  ExtrinsicHashMap,
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
import { sleep } from "../utils/utils";

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
    const extrinsicMap = await checkSubscan(votedList);

    readyProposals.forEach(async (proposal, index) => {
      const refId = Number(proposal.id);
      const found = votedList.includes(refId);
      if (!found) return;

      const page = await findNotionPageByPostId(pages, refId);

      if (page) {
        console.info(`Page found (checkForVotes): ${page.id}`);
        await updateNotionToVoted(page.id, proposal.voted, extrinsicMap[refId]);
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
  vote: SuggestedVote,
  subscanUrl: string
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

  properties["Voted link"] = {
    type: "url",
    url: subscanUrl,
  };

  const data = { properties };

  const maxRetries = 5;
  const retryDelay = 60000; // 1 minute in milliseconds
  let retryCount = 0;

  while (retryCount < maxRetries) {
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
      retryCount++;
      const errorMessage = (error as any).response
        ? (error as any).response.data
        : (error as any).message;
      
      console.error(`Error updating page (attempt ${retryCount}/${maxRetries}):`, errorMessage);
      
      if (retryCount === maxRetries) {
        throw new Error(`Failed to update Notion page after ${maxRetries} attempts: ${errorMessage}`);
      }
      
      console.log(`Waiting ${retryDelay/1000} seconds before retry...`);
      await sleep(retryDelay);
    }
  }

  return pageId;
}

export async function checkSubscan(votedList: ReferendumId[]): Promise<ExtrinsicHashMap> {
  try {
    let extrinsicHashMap: ExtrinsicHashMap = {};

    const subscanUrl = `https://polkadot.api.subscan.io/api/scan/proxy/extrinsics`;

    const data = {
      account: process.env.POLKADOT_MULTISIG as string,
      row: SUBSCAN_ROW_COUNT,
      page: 0,
      order: 'desc'
    }
    
    const apiKey = process.env.SUBSCAN_API_KEY;
    if (!apiKey) {
      throw new Error('SUBSCAN_API_KEY is not set in environment variables');
    }

    const resp = await axios.post(subscanUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    });

    for (const extrinsic of resp.data.data.extrinsics) {
      if (extrinsic?.params?.[0]?.value && votedList.includes(extrinsic.params[0].value)) {
        console.log("Voted: ", extrinsic.params[0].value);
        extrinsicHashMap[extrinsic.params[0].value] = extrinsic.extrinsic_hash;
      }
    }

    return extrinsicHashMap;

  } catch (error: any) {
    throw new Error(`Error checking Subscan: ${error.message}`);
  }
}
