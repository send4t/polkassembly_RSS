import { Chain, Link, Origin, TimelineStatus, VoteStatus, VotingTime } from "./properties";

export type NotionDatabaseId = string;
export type NotionPageId = string;

export interface CreateReferendumInput {
    name?: string;
    number?: number;
    requestedAmount?: number | null;
    chain?: Chain;
    origin?: Origin;
    timeline?: TimelineStatus;
    status?: VoteStatus;
    link?: Link;
    voting?: VotingTime;
    created_at?: string;
}

export interface UpdateReferendumInput {
  name?: string;
  number?: number;
  requestedAmount?: number | null;
  timeline?: TimelineStatus;
}

export interface NotionPage {
  id: NotionPageId;
  properties?: NotionProperties;
  last_edited_time?: string;
  created_time?: string;
  // ...
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
    'Number'?: {
      type: 'number';
      number: number;
    };
    'Link'?: {
      type: 'url';
      url: string;
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
    'Voting'?: {
      type: 'date';
      date: string;
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