type NotionDatabaseId = string;

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

interface NotionUser {
    object: "user";
    id: string;
}

interface NotionParent {
    type: "database_id";
    database_id: string;
}

interface NotionProperty {
    id?: string;
    type: string;
    [key: string]: any; // Allows flexibility for different property types
}

interface NotionStatus {
    id?: string;
    type: "status";
    status: { name: string; color?: string } | null;
}

interface NotionSelect {
    id?: string;
    type: "select";
    select: { name: string; color?: string } | null;
}

interface NotionNumber {
    id?: string;
    type: "number";
    number: number | null;
}

interface NotionDate {
    id?: string;
    type: "date";
    date: { start: string | null; end?: string | null } | null;
}

interface NotionRichText {
    id?: string;
    type: "rich_text";
    rich_text: { text: { content: string } }[];
}

interface NotionPage {
    object: "page";
    id?: string;
    created_time?: string;
    last_edited_time?: string;
    created_by?: NotionUser;
    last_edited_by?: NotionUser;
    cover?: null | string;
    icon?: null | string;
    parent: NotionParent;
    archived?: boolean;
    in_trash?: boolean;
    properties: Record<string, NotionProperty>;
    url?: string;
    public_url?: string | null;
}

interface ReferendaPage extends NotionPage {
    properties: {
        'Name': NotionProperty & { type: 'title'; title: Array<{ text: { content: string } }> };
        'Requested $': NotionProperty & { type: 'number'; number: number | null };
        'Description'?: NotionProperty & { type: 'rich_text'; rich_text: Array<{ text: { content: string } }> };
        'Proposer'?: NotionProperty & { type: 'rich_text'; rich_text: Array<{ text: { content: string } }> };
        'Status': NotionProperty & { type: 'select'; select: { name: string, id: string | undefined } };
        'Track Number'?: NotionProperty & { type: 'number'; number: number | null };
        'Hash'?: NotionProperty & { type: 'rich_text'; rich_text: Array<{ text: { content: string } }> };
        'Type'?: NotionProperty & { type: 'select'; select: { name: string, id: string | undefined } };
        'Created At'?: NotionProperty & { type: 'date'; date: { start: string } };
        'Proposal Block'?: NotionProperty & { type: 'rich_text'; rich_text: Array<{ text: { content: string } }> };
        'Origin': NotionProperty & { type: 'rich_text'; rich_text: Array<{ text: { content: string } }> };
        'Spam Status'?: NotionProperty & { type: 'checkbox'; checkbox: boolean };
        'Spam Report Invalid'?: NotionProperty & { type: 'checkbox'; checkbox: boolean };
        'Spam Users Count'?: NotionProperty & { type: 'number'; number: number | null };

        'Chain': NotionProperty & { type: 'select'; select: { name: Chain }};
    };
}


interface NotionReferendaCreate extends NotionPage {
    properties: {
      'Chain': NotionProperty & { 
        type: 'select'; 
        select: { 
          name: 'Polkadot' | 'Kusama'; // Example options, can be extended
          id: string | undefined;
        };
      };
      'Origin': NotionProperty & { 
        type: 'rich_text'; 
        rich_text: Array<{ text: { content: string } }> 
      };
      'Requested $': NotionProperty & { 
        type: 'number'; 
        number: number | null 
      };
    };
  }
  