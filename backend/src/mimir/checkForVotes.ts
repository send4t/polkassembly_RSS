import { ApiPromise, WsProvider } from "@polkadot/api";
import { KUSAMA_PROVIDER, POLKADOT_PROVIDER, TRACKS } from "../utils/constants";
import { Chain, ReferendumId, SuggestedVote } from "../types/properties";
import { ReadyProposal } from "../types/mimir";

export async function checkForVotes(
  readyProposals: ReadyProposal[]
): Promise<void> {
  try {
    if (readyProposals.length === 0) {
      console.log("No ready proposals found.");
      //return;
      readyProposals = [{
        id: 1519,
        voted: SuggestedVote.Aye
      }]
    }

    const votedPolkadot = await fetchActiveVotes(
      process.env.POLKADOT_MULTISIG as string,
      Chain.Polkadot
    );
    const votedKusama = await fetchActiveVotes(
      process.env.KUSAMA_MULTISIG as string,
      Chain.Kusama
    );
    const votedList = [...votedPolkadot, ...votedKusama];
    console.log("Voted list:", votedList);

    readyProposals.forEach((proposal, index) => {
      const found = votedList.includes(proposal.id);
      console.log("Found: ", found);
      console.log("Index: ", index);
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
