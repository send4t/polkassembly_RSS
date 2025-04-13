import { ApiPromise, WsProvider } from "@polkadot/api";
import { TRACKS } from "../utils/constants";
import { ReferendumId } from "../types/properties";

export async function checkForVotes() {
  try {
    // only do this, if there are ReadyToVote tranasctions
    // then fetch all the votes with api.query.convictionVoting.votingOf(account);
    const votedList = await fetchActiveVotes(
      process.env.POLKADOT_MULTISIG as string
    );
    console.log("Voted list:", votedList);
    // then do a filter on the votes
  } catch (error) {
    console.error("Error checking vote statuses (checkForVotes):", error);
  }
}

async function fetchActiveVotes(account: string): Promise<ReferendumId[]> {
  try {
    const wsProvider = new WsProvider("wss://rpc.polkadot.io");
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
