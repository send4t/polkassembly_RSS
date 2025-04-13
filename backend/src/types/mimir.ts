import { ReferendumId, SuggestedVote } from "./properties";

export interface VotingPayload {
  calldata: string;
  timestamp: number;
}

export interface ReadyProposal {
  id: ReferendumId;
  voted: SuggestedVote;
  timestamp?: number;
}
