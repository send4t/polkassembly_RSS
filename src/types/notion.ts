import { Chain, Link, Origin, TimelineStatus, VoteStatus, VotingTime } from "./properties";

export type NotionDatabaseId = string;

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