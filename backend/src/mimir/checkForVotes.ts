import { ApiPromise, WsProvider } from "@polkadot/api";

export async function checkForVotes() {
  try {
    // only do this, if there are ReadyToVote tranasctions
    // then fetch all the votes with api.query.convictionVoting.votingOf(account);
    fetchActiveVotes(process.env.POLKADOT_MULTISIG as string, 1522);
    // then do a filter on the votes
  } catch (error) {
    console.error("Error checking vote statuses (checkForVotes):", error);
  }
}

async function fetchActiveVotes(account: string, referendumIndex: number) {
  try {
    const wsProvider = new WsProvider("wss://rpc.polkadot.io");
    const api = await ApiPromise.create({ provider: wsProvider });

    const refId = 1522;
    const referendum = await api.query.referenda.referendumInfoFor(refId);

    // 1. Get all keys (track IDs)
    const keys = await api.query.referenda.tracks.keys(); // Vec<StorageKey>
    console.table(keys);

    const voting = (await api.query.convictionVoting.votingFor(
      account,
      33
    )) as any;
    console.table(voting.toHuman());

    if (voting.isDirect) {
      const votes = voting.asDirect.votes;
      for (const [index, vote] of votes) {
        if (index.toNumber() === referendumIndex) {
          console.log(`✅ Voted on Referendum #${referendumIndex}`);
          console.log(`Vote info:`, vote.toHuman());
          return true;
        }
      }
    }

    console.log(`❌ Did not vote on Referendum #${referendumIndex}`);
    return false;
  } catch (error) {
    console.error(
      `Error checking vote for account ${account} on referendum ${referendumIndex}:`,
      error
    );
    throw error;
  }
}
