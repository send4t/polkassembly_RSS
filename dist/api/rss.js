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
const axios = require("axios");
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the method is GET
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
        try {
            // Fetch the latest referendums and discussions
            const posts = yield fetchReferendums();
            // Fetch DOT/USD exchange rate
            const dotToUsdRate = yield fetchDotToUsdRate();
            // Fetch content for each post and calculate rewards in USD or USDT
            const postsWithContent = yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
                const content = yield fetchReferendumContent(post.post_id);
                const reward = extractReward(content, dotToUsdRate);
                return Object.assign(Object.assign({}, post), { content: content.content || 'No content available', reward: reward, track_number: content.track_number || 'No track number available', origin: content.origin || 'No origin information available', timeline: content.timeline || [], post_id: post.post_id });
            })));
            // Check if the posts are valid before generating the RSS feed
            if (!postsWithContent || postsWithContent.length === 0) {
                console.log('No referendums available.');
                return res.status(200).send(generateEmptyRSSFeed());
            }
            // Generate the RSS feed with content
            const rssFeed = generateRSSFeed(postsWithContent);
            res.setHeader('Content-Type', 'application/rss+xml');
            res.status(200).send(rssFeed);
        }
        catch (error) {
            console.error('Error generating RSS feed:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
// Fetch referendums and discussions from Polkassembly API
function fetchReferendums() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://api.polkassembly.io/api/v1/latest-activity/all-posts?govType=open_gov&listingLimit=10', {
                method: 'GET',
                headers: {
                    'x-network': 'polkadot',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
            }
            const data = yield response.json();
            const now = new Date();
            const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const recentPosts = data.posts.filter(post => {
                const postDate = new Date(post.created_at);
                return postDate >= twentyFourHoursAgo && postDate <= now && post.post_id <= 2500;
            });
            return recentPosts;
        }
        catch (error) {
            console.error('Error fetching referendums:', error.message);
            throw error;
        }
    });
}
// Fetch content of a specific referendum post by ID
function fetchReferendumContent(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get('https://api.polkassembly.io/api/v1/posts/on-chain-post', {
                params: {
                    postId: postId,
                    proposalType: 'referendums_v2',
                },
                headers: {
                    'x-network': 'polkadot',
                    'Content-Type': 'application/json',
                },
            });
            if (response.status !== 200) {
                throw new Error(`Error fetching post content: ${response.status} ${response.statusText}`);
            }
            return response.data;
        }
        catch (error) {
            console.error('Error fetching referendum content:', error.message);
            return { content: 'No content available' };
        }
    });
}
// Fetch DOT/USD exchange rate
function fetchDotToUsdRate() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
            const data = yield response.json();
            return data.polkadot.usd || 0;
        }
        catch (error) {
            console.error('Error fetching DOT/USD rate:', error.message);
            return 0;
        }
    });
}
// Extract reward and convert to USD or show USDT
function extractReward(content, dotToUsdRate) {
    if (content.beneficiaries && content.beneficiaries.length > 0) {
        const beneficiary = content.beneficiaries[0];
        if (content.assetId === '1984') {
            const usdtAmount = (BigInt(beneficiary.amount) / BigInt(1e6)).toString();
            return `${usdtAmount} USDT`;
        }
    }
    if (content.proposer && content.requested) {
        const dotAmount = BigInt(content.requested) / BigInt(1e10);
        const usdValue = (parseFloat(dotAmount) * dotToUsdRate).toFixed(2);
        return `$${usdValue} USD`;
    }
    return 'No reward information available';
}
// Generate the RSS feed
function generateRSSFeed(posts) {
    const items = posts.map(post => {
        const pubDate = new Date(post.created_at).toUTCString();
        const endDate = new Date(new Date(post.created_at).getTime() + 28 * 24 * 60 * 60 * 1000).toUTCString();
        return `
            <item>
                <title>${escapeXML(post.title)}</title>
                <description>${escapeXML(post.content || 'No description available.')}</description>
                <link>https://polkadot.polkassembly.io/referenda/${post.post_id}</link>
                <pubDate>${pubDate}</pubDate>
                <endDate>${endDate}</endDate> 
                <reward>${escapeXML(post.reward || 'No reward information available')}</reward>
                <track_number>${escapeXML(post.track_number || 'No track number available')}</track_number>
                <origin>${escapeXML(post.origin || 'No origin information available')}</origin>
                <post_id>${escapeXML(post.post_id)}</post_id> 
                <timeline>${generateTimelineXML(post.timeline)}</timeline>
            </item>
        `;
    }).join('');
    return `
    <rss version="2.0">
        <channel>
            <title>Polkassembly Referendums and Discussions</title>
            <link>polkadothungary.net</link>
            <description>Latest referendums and discussions from Polkassembly.</description>
            ${items}
        </channel>
    </rss>`;
}
// Generate XML for the timeline
function generateTimelineXML(timeline) {
    return timeline.map(event => `
        <event>
            <created_at>${new Date(event.created_at).toUTCString()}</created_at>
            <hash>${escapeXML(event.hash || '')}</hash>
            <statuses>${event.statuses ? event.statuses.map(status => `
                <status>
                    <timestamp>${new Date(status.timestamp).toUTCString()}</timestamp>
                    <block>${status.block ? escapeXML(status.block.toString()) : 'No block information available'}</block>
                    <statusText>${escapeXML(status.status)}</statusText>
                </status>
            `).join('') : 'No statuses available'}
            </statuses>
        </event>
    `).join('') || 'No timeline available';
}
// Generate an empty RSS feed when no referendums are available
function generateEmptyRSSFeed() {
    return `
    <rss version="2.0">
        <channel>
            <title>Polkassembly Referendums and Discussions</title>
            <link>polkadothungary.net</link>
            <description>No referendums or discussions available at this time.</description>
        </channel>
    </rss>`;
}
// Helper function to escape XML characters
function escapeXML(str) {
    if (typeof str !== 'string') {
        str = String(str || '');
    }
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
module.exports = { fetchReferendums, fetchReferendumContent, fetchDotToUsdRate, extractReward };
