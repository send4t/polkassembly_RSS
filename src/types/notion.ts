export type NotionDatabaseId = string;

export enum Chain {
    Polkadot = "Polkadot",
    Kusama = "Kusama"
}

export enum TimelineStatus {
    LeadIn = "Lead-in",
    Submitted = "Submitted",
    Deciding = "Deciding",
    Confirmation = "Confirmation",
    Enactment = "Enactment",
    TimedOut = "TimedOut",
    Executed = "Executed"
}

export enum VoteStatus {
    NotStarted = "Not started",
    Considering = "Considering",
    Debating = "Debating",
    Waiting = "Waiting",
    VotedAye = "Voted 👍 Aye 👍",
    VotedAbstain = "Voted ✌️ Abstain ✌️",
    VotedNay = "Voted 👎 Nay 👎",
    NotVoted = "Not Voted"
}

export enum Origin {
    Root = "0 - Root",
    WhitelistedCaller = "1 - Whitelisted Caller",
    WishForChange = "2 - Wish For Change",
    StakingAdmin = "10 - Staking Admin",
    Treasurer = "11 - Treasurer",
    LeaseAdmin = "12 - Lease Admin",
    FellowshipAdmin = "13 - Fellowship Admin",
    GeneralAdmin = "14 - General Admin",
    AuctionAdmin = "15 - Auction Admin",
    ReferendumCanceller = "20 - Referendum Canceller",
    ReferendumKiller = "21 - Referendum Killer",
    SmallTipper = "30 - Small Tipper",
    BigTipper = "31 - Big Tipper",
    SmallSpender = "32- Small Spender",
    MediumSpender = "33 - Medium Spender",
    BigSpender = "34 - Big Spender"
} 

export interface CreateReferendumInput {
    name?: string;
    requestedAmount?: number | null;
    chain?: Chain;
    origin?: Origin;
    timeline?: TimelineStatus;
    status?: VoteStatus;
}

export interface NotionProperties {
    'Name'?: {
      type: 'title';
      title: Array<{
        text: {
          content: string;
        };
      }>;
    };
    'Requested $'?: {
      type: 'number';
      number: number | null;
    };
    'Chain'?: {
      type: 'select';
      select: {
        name: Chain;
      };
    };
    'Origin'?: {
      type: 'select';
      select: {
        name: Origin;
      };
    };
    'Timeline'?: {
      type: 'status';
      status: {
        name: TimelineStatus;
      };
    };
    'Status'?: {
      type: 'status';
      status: {
        name: VoteStatus;
      };
    };
  }

export interface NotionCreatePageRequest {
    object: 'page';
    parent: {
        database_id: NotionDatabaseId;
        type: 'database_id';
    };
    properties: NotionProperties;
}