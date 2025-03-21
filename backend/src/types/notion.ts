import { Chain, Link, Origin, TimelineStatus, InternalStatus, VotingTime } from "./properties";

export type NotionDatabaseId = string;
export type NotionPageId = string;

export interface CreateReferendumInput {
    title?: string;
    number?: number;
    requestedAmount?: number | null;
    chain?: Chain;
    origin?: Origin;
    referendumTimeline?: TimelineStatus;
    internalStatus?: InternalStatus;
    link?: Link;
    voting?: VotingTime;
    created_at?: string;
}

export interface UpdateReferendumInput {
  title?: string;
  number?: number;
  requestedAmount?: number | null;
  referendumTimeline?: TimelineStatus;
}

export interface NotionPage {
  id: NotionPageId;
  properties?: NotionProperties;
  last_edited_time?: string;
  created_time?: string;
  // ...
}

export interface NotionProperties {
    [key: string]: {
        type: string;
        title?: Array<{ text: { content: string } }>;
        rich_text?: Array<{ text: { content: string } }>;
        number?: number;
        select?: { name: string, options?: {
            name: string;
            id: string;
            color: string;
            description?: string;
        }};
        status?: { name: string };
        url?: string;
        date?: string | {
            start: string;
            end?: string;
            time_zone?: string | null;
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

export interface NotionUpdatePageRequest {
    properties: NotionProperties;
}