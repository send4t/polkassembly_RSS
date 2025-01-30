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
// update.js
const axios = require("axios");
require('dotenv').config();
const { fetchReferendumContent, extractReward } = require('./rss');
const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
// Handle a single Referenda element, when updating referendas. Called by refreshReferendas
function handleReferenda(referenda, dotToUsdRate) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("ID: ", referenda.post_id);
        const content = yield fetchReferendumContent(referenda.post_id);
        //console.log("Content.assetId: ", content);
        // !! Nem mindig jól csinálja a számításokat.
        const reward = extractReward(content, dotToUsdRate);
        console.log("Reward: ", reward);
        return;
        console.log("assetId: ", content.assetId);
        if (content.assetId === null) {
            const plancks = content.requested || 0;
            console.info("This is DOT: ", plancks / Math.pow(10, 10));
        }
        if (content.assetId == 1984 || content.assetId == 1337) {
            const largenum = content.requested || 0;
            console.info("This is USD (USDC or USDT): ", largenum / Math.pow(10, 6)); // It's important that USDC and USDT has both 6 decimals
        }
        //console.info("Title: ", referenda.title);
        //console.info("Amount: ", content.requested);
        //console.info("Description: ", content.content);
        //console.info("Status: ", content.status);
        const findResult = yield findNotionPageByPostId(referenda.post_id);
        //console.log("findResult: ", findResult);
        if (findResult) {
            // UPDATE
            yield checkPropertyType(findResult.id);
            yield updateReferenda(findResult.id, 333);
        }
        else {
            // CREATE
            console.log("No");
        }
    });
}
// Check structure of Notion property
function checkPropertyType(pageId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get(`https://api.notion.com/v1/pages/${pageId}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_API_TOKEN}`,
                    'Notion-Version': process.env.NOTION_VERSION,
                },
            });
            console.log('Property structure:', response.data.properties['Requested $']);
        }
        catch (error) {
            console.error('Error checking property:', error);
        }
    });
}
// Update a Referenda
function updateReferenda(pageId, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const notionApiUrl = 'https://api.notion.com/v1/pages/' + pageId;
        const data = {
            properties: {
                'Requested $': {
                    type: 'number',
                    number: amount
                },
            }
        };
        try {
            const response = yield axios.patch(notionApiUrl, data, {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_API_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': process.env.NOTION_VERSION,
                },
            });
            console.log('Page updated successfully:', response.data);
        }
        catch (error) {
            console.error('Error updating page:', error.message);
            console.error(error);
        }
    });
}
// Function to fetch data from Polkassembly API
function fetchDataFromAPI(startPostId_1) {
    return __awaiter(this, arguments, void 0, function* (startPostId, page = 1, limit = 200) {
        try {
            //const url = `https://polkadot.polkassembly.io/api/v1/posts/active-proposals-count`
            //const url = `https://api.polkassembly.io/api/v1/latest-activity/on-chain-posts?proposalType=open_gov&listingLimit=20&trackNo=2`
            //const url = `https://api.polkassembly.io/api/v1/listing/on-chain-posts?page=${page}&proposalType=referendums_v2&listingLimit=${limit}&trackNo=1&trackStatus=All&sortBy=newest`;
            const url = `https://api.polkassembly.io/api/v1/latest-activity/all-posts?govType=open_gov&listingLimit=${limit}`;
            const response = yield axios.get(url, {
                headers: {
                    "x-network": "polkadot",
                },
            });
            return response.data.posts || [];
        }
        catch (error) {
            console.error("Error fetching data from Polkassembly API:", error.message);
            return [];
        }
    });
}
// Function to update 'Referendum timeline' field in Notion page
function updateNotionTimeline(pageId, timelineStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield axios.patch(`https://api.notion.com/v1/pages/${pageId}`, {
                properties: {
                    'Referendum timeline': {
                        status: {
                            name: timelineStatus,
                        },
                    },
                },
            }, {
                headers: {
                    Authorization: `Bearer ${notionApiToken}`,
                    "Notion-Version": "2022-06-28",
                },
            });
            if (response.status === 200) {
                console.log(`Successfully updated timeline for pageId: ${pageId} with status: ${timelineStatus}`);
            }
        }
        catch (error) {
            console.error("Error updating Notion page:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
    });
}
// Main function to fetch data and update Notion
function main(lastProcessedPostId) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiData = yield fetchDataFromAPI(lastProcessedPostId);
        if (!apiData || !Array.isArray(apiData))
            return;
        let lastPostId = lastProcessedPostId;
        for (const specificPost of apiData) {
            const postId = specificPost.post_id;
            const timelineStatus = specificPost.status;
            if (!timelineStatus)
                continue;
            const notionPage = yield findNotionPageByPostId(postId);
            if (notionPage) {
                // Detailed log before updating the Notion page
                console.log(`Updating post ID: ${postId} with status: ${timelineStatus}`);
                yield updateNotionTimeline(notionPage.id, timelineStatus);
                // Log after update to confirm success
                console.log(`Successfully updated post ID: ${postId} with status: ${timelineStatus}`);
                lastPostId = postId; // Update the last processed post ID
            }
        }
        return lastPostId; // Return the last processed post ID for the next batch
    });
}
// Function to query Notion database for a matching "URL" (post_id from URL)
function findNotionPageByPostId(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const postIdString = postId.toString();
            const response = yield axios.post(`https://api.notion.com/v1/databases/${notionDatabaseId}/query`, {}, {
                headers: {
                    Authorization: `Bearer ${notionApiToken}`,
                    "Notion-Version": "2022-06-28",
                },
            });
            if (response.data.results) {
                for (const page of response.data.results) {
                    const urlProperty = ((_a = page.properties.Link) === null || _a === void 0 ? void 0 : _a.url) || "";
                    const match = urlProperty.match(/(\d+)$/);
                    if (match && match[1] === postIdString) {
                        return page;
                    }
                }
            }
            return null;
        }
        catch (error) {
            console.error("Error querying Notion database:", error.message);
            return null;
        }
    });
}
module.exports = { main, fetchDataFromAPI, findNotionPageByPostId, handleReferenda };
