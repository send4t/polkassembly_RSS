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
const utils_1 = require("../utils");
const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
/** Create a Referenda in the Notion database */
function createReferenda(databaseId, referenda, network) {
    return __awaiter(this, void 0, void 0, function* () {
        const notionApiUrl = 'https://api.notion.com/v1/pages';
        if (!notionDatabaseId)
            throw "Please specify NOTION_DATABASE_ID in .env!";
        // Fill the properties, that are coming from Polkassembly
        const properties = {
            name: referenda.title,
            requestedAmount: 0,
            chain: network,
            origin: (0, utils_1.getValidatedOrigin)(referenda.origin),
            timeline: (0, utils_1.getValidatedStatus)(referenda.status),
            status: undefined,
            link: `https://${network.toLowerCase()}.polkassembly.io/referenda/${referenda.post_id}`,
            number: referenda.post_id
        };
        // Prepare the data for Notion
        const data = prepareNotionData(databaseId, properties);
        // Send request to Notion
        try {
            const response = yield axios_1.default.post(notionApiUrl, data, {
                headers: {
                    'Authorization': `Bearer ${notionApiToken}`,
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
function prepareNotionData(databaseId, input) {
    const properties = {};
    if (input.name) {
        properties['Name'] = {
            type: 'title',
            title: [{ text: { content: input.name } }]
        };
    }
    if (input.number) {
        properties['Number'] = {
            type: 'number',
            number: input.number
        };
    }
    if (input.requestedAmount !== undefined) {
        properties['Requested $'] = {
            type: 'number',
            number: input.requestedAmount
        };
    }
    if (input.chain) {
        properties['Chain'] = {
            type: 'select',
            select: { name: input.chain }
        };
    }
    if (input.origin) {
        properties['Origin'] = {
            type: 'select',
            select: { name: input.origin }
        };
    }
    if (input.timeline) {
        properties['Timeline'] = {
            type: 'status',
            status: { name: input.timeline }
        };
    }
    if (input.status) {
        properties['Status'] = {
            type: 'status',
            status: { name: input.status }
        };
    }
    if (input.voting) {
        properties['Voting'] = {
            type: 'date',
            date: input.voting
        };
    }
    if (input.link) {
        properties['Link'] = {
            type: 'url',
            url: input.link
        };
    }
    return {
        object: 'page',
        parent: {
            database_id: databaseId,
            type: 'database_id'
        },
        properties
    };
}
