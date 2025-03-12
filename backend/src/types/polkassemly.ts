import { Chain } from "./properties";

export enum PostType {
    ReferendumV2 = "ReferendumV2",
    Discussions = "Discussions"
};

export interface PolkassemblyReferenda {
    created_at: string;
    description?: string;
    hash?: string;
    method?: string;
    origin?: string;
    parent_bounty_index?: number | null;
    post_id: number;
    proposalHashBlock?: string | null;
    proposer: string;
    status?: string;
    title: string;
    track_number?: number;
    type: PostType;
    is_spam: boolean;
    is_spam_report_invalid: boolean;
    spam_users_count: number;
    topic?: { id: number; name: string }; // Only for "Discussions"
    user_id?: number; // Only for "Discussions"
    username?: string; // Only for "Discussions"
    network: Chain;
}

export interface FetchReferendaReturnType {
    referendas: PolkassemblyReferenda[];
    discussions: PolkassemblyReferenda[];
}