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
    Root0 = "0 - Root",
    WhitelistedCaller1 = "1 - Whitelisted Caller",
    WishForChange2 = "2 - Wish For Change",
    StakingAdmin10 = "10 - Staking Admin",
    Treasurer11 = "11 - Treasurer",
    LeaseAdmin12 = "12 - Lease Admin",
    FellowshipAdmin13 = "13 - Fellowship Admin",
    GeneralAdmin14 = "14 - General Admin",
    AuctionAdmin15 = "15 - Auction Admin",
    ReferendumCanceller20 = "20 - Referendum Canceller",
    ReferendumKiller21 = "21 - Referendum Killer",
    SmallTipper30 = "30 - Small Tipper",
    BigTipper31 = "31 - Big Tipper",
    SmallSpender32 = "32 - Small Spender",
    MediumSpender33 = "33 - Medium Spender",
    BigSpender34 = "34 - Big Spender",
    
    MediumSpender = "MediumSpender",
    BigTipperAlt = "BigTipper",
    NoOriginInformationAvailable = "No origin information available",
    SmallSpenderAlt = "SmallSpender",
    WishForChange = "WishForChange",
    SmallTipper = "SmallTipper",
    FellowshipAdmin = "FellowshipAdmin",
    Root = "Root",
    WhitelistedCaller = "WhitelistedCaller",
    Treasurer = "Treasurer"
  }


export type Link = string;

export type VotingTime = string;