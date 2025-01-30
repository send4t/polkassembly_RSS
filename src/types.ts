type NotionDatabaseId = string;

interface NotionUser {
    object: "user";
    id: string;
}
  
interface NotionParent {
    type: "database_id";
    database_id: string;
}
  
interface NotionProperty {
    id: string;
    type: string;
    [key: string]: any; // Allows flexibility for different property types
}

interface NotionStatus {
    id: string;
    type: "status";
    status: { name: string; color?: string } | null;
}
  
interface NotionSelect {
    id: string;
    type: "select";
    select: { name: string; color?: string } | null;
}
  
interface NotionNumber {
    id: string;
    type: "number";
    number: number | null;
}
  
interface NotionDate {
    id: string;
    type: "date";
    date: { start: string; end?: string } | null;
}
  
interface NotionRichText {
    id: string;
    type: "rich_text";
    rich_text: { text: { content: string } }[];
}
  
interface NotionPage {
    object: "page";
    id: string;
    created_time: string;
    last_edited_time: string;
    created_by: NotionUser;
    last_edited_by: NotionUser;
    cover: null | string;
    icon: null | string;
    parent: NotionParent;
    archived: boolean;
    in_trash: boolean;
    properties: Record<string, NotionProperty>;
    url: string;
    public_url: string | null;
}
  
interface ReferendaPage extends NotionPage {
    scores: {
        necessity: number | null;  // I. Necessity (1-5)
        funding: number | null;    // II. Funding (1-5)
        competition: number | null; // III. Competition (1-5)
        blueprint: number | null;   // IV. Blueprint (1-5)
        trackRecord: number | null; // V. Track rec. (1-5)
        reports: number | null;     // VI. Reports (1-5)
        synergy: number | null;     // VII. Synergy (1-5)
        revenue: number | null;     // VIII. Revenue (1-5)
        security: number | null;    // IX. Security (1-5)
        openSource: number | null;  // X. Open-Source (1-5)
    };
  
    requestedAmount: number;
    timeline: string | null;
    link: string;
    status: string;
    responsiblePerson: string[];
    voteExecuted: string | null;
    votingDate: string | null;
    origin: string | null;
    aiSummary: string;
    reasonForVote: string;
    refScore: number | null;
    chain: string | null;
    name: string;
}