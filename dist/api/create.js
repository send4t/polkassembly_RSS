"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReferenda = createReferenda;
const axios_1 = __importDefault(require("axios"));
const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
/** Create a Referenda in the Notion database */
function createReferenda(databaseId, title, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const notionApiUrl = 'https://api.notion.com/v1/pages';
        if (!notionDatabaseId)
            throw "Please specify NOTION_DATABASE_ID in .env!";
        const data = {
            object: "page",
            parent: { database_id: notionDatabaseId, type: "database_id" },
            properties: {
                'Name': {
                    type: 'title',
                    title: [{ text: { content: title } }]
                },
                'Requested $': {
                    type: 'number',
                    number: null
                },
                'Description': {
                    type: 'rich_text',
                    rich_text: [{ text: { content: "Hello World description" } }]
                },
                'Proposer': {
                    type: 'rich_text',
                    rich_text: [{ text: { content: "null" } }]
                },
                'Status': {
                    type: 'select',
                    select: { name: "null", id: undefined }
                },
                'Track Number': {
                    type: 'number',
                    number: null
                },
                'Hash': {
                    type: 'rich_text',
                    rich_text: [{ text: { content: "null" } }]
                },
                'Type': {
                    type: 'select',
                    select: { name: "null", id: undefined }
                },
                'Created At': {
                    type: 'date',
                    date: { start: new Date().toISOString() }
                },
                'Proposal Block': {
                    type: 'rich_text',
                    rich_text: [{ text: { content: "null" } }]
                },
                'Origin': {
                    type: 'rich_text',
                    rich_text: [{ text: { content: "null" } }]
                },
                'Spam Status': {
                    type: 'checkbox',
                    checkbox: false
                },
                'Spam Report Invalid': {
                    type: 'checkbox',
                    checkbox: false
                },
                'Spam Users Count': {
                    type: 'number',
                    number: null
                }
            },
        };
        try {
            const response = yield axios_1.default.post(notionApiUrl, data, {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_API_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': process.env.NOTION_VERSION,
                },
            });
            console.log('Page created successfully:', response.data);
        }
        catch (error) {
            console.error('Error creating page:', error.response ? error.response.data : error.message);
        }
    });
}
