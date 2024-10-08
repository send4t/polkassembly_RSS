import fetch from 'node-fetch'; // Ensure you're using ES module syntax if you're using imports

export default async function handler(req, res) {
    // Check if the method is GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Fetch the latest referendums and discussions
        const posts = await fetchReferendums();

        // Fetch content for each post
        const postsWithContent = await Promise.all(
            posts.map(async (post) => {
                const content = await fetchReferendumContent(post.post_id);
                return { 
                    ...post, 
                    content: content.content || 'No content available', 
                    reward: extractReward(content), // Extracting the reward
                    track_number: content.track_number || 'No track number available', // Adding track number
                    origin: content.origin || 'No origin information available', // Adding origin
                    timeline: content.timeline || [], // Adding timeline
                    post_id: post.post_id // Include post_id
                }; // Attach the fetched content and new fields
            })
        );

        // Check if the posts are valid before generating the RSS feed
        if (!postsWithContent || postsWithContent.length === 0) {
            console.log('No referendums available.');
            return res.status(200).send(generateEmptyRSSFeed());
        }

        // Generate the RSS feed with content
        const rssFeed = generateRSSFeed(postsWithContent);
        res.setHeader('Content-Type', 'application/rss+xml');
        res.status(200).send(rssFeed);

    } catch (error) {
        // Log the error for debugging
        console.error('Error generating RSS feed:', error.message);

        // Send a 500 Internal Server Error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Fetch referendums and discussions from Polkassembly API
async function fetchReferendums() {
    try {
        const response = await fetch('https://api.polkassembly.io/api/v1/latest-activity/all-posts?govType=open_gov&listingLimit=10', {
            method: 'GET',
            headers: {
                'x-network': 'polkadot', // Adjust to 'polkadot' if needed
                'Content-Type': 'application/json'
            }
        });

        // Check for response errors
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Ensure the data has the expected structure
        if (!data || !data.posts) {
            throw new Error('Unexpected response structure from Polkassembly API.');
        }

        // Get the current time and 24 hours ago
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Filter posts from the last 24 hours
        const recentPosts = data.posts.filter(post => {
            const postDate = new Date(post.created_at);
            return postDate >= twentyFourHoursAgo && postDate <= now;
        });

        return recentPosts;

    } catch (error) {
        console.error('Error fetching referendums:', error.message);
        throw error; // Propagate the error for the handler to catch
    }
}

// Fetch content of a specific referendum post by ID
async function fetchReferendumContent(postId) {
    try {
        const response = await fetch(`https://api.polkassembly.io/api/v1/posts/on-chain-post?postId=${postId}&proposalType=referendums_v2`, {
            method: 'GET',
            headers: {
                'x-network': 'polkadot', // Adjust to 'polkadot' if needed
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching post content: ${response.status} ${response.statusText}`);
        }

        const postContent = await response.json();
        return postContent; // Return the full content object

    } catch (error) {
        console.error('Error fetching referendum content:', error.message);
        return { content: 'No content available' }; // Fallback content in case of an error
    }
}

// Function to extract reward based on assetId
function extractReward(content) {
    if (content.beneficiaries && content.beneficiaries.length > 0) {
        const beneficiary = content.beneficiaries[0]; // Assuming the first beneficiary is the relevant one
        if (beneficiary.amount) {
            if (content.assetId === '1984') {
                const usdtAmount = (BigInt(beneficiary.amount) / BigInt(1e6)).toString(); // Convert from smallest unit
                return `${usdtAmount} USDT`; // Return as USDT
            }
        }
    }
    
    // If assetId is not '1984', check for requested DOT amount
    if (content.proposer && content.requested) {
        const dotAmount = (BigInt(content.requested) / BigInt(1e10)).toString(); // Adjust if needed for smallest unit
        return `${dotAmount} DOT`; // Return as DOT
    }

    return 'No reward information available';
}

// Generate the RSS feed
function generateRSSFeed(posts) {
    const items = posts.map(post => `
        <item>
            <title>${escapeXML(post.title)}</title>
            <description>${escapeXML(post.content || 'No description available.')}</description>
            <link>https://polkadot.polkassembly.io/post/${post.post_id}</link>
            <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
            <reward>${escapeXML(post.reward || 'No reward information available')}</reward>
            <track_number>${escapeXML(post.track_number || 'No track number available')}</track_number>
            <origin>${escapeXML(post.origin || 'No origin information available')}</origin>
            <post_id>${escapeXML(post.post_id)}</post_id> <!-- Include post_id -->
            <timeline>${generateTimelineXML(post.timeline)}</timeline>
        </item>
    `).join('');

    return `
    <rss version="2.0">
        <channel>
            <title>Polkassembly Referendums and Discussions</title>
            <link>https://yourwebsite.com</link>
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
                    <block>${escapeXML(status.block.toString())}</block>
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
            <link>https://yourwebsite.com</link>
            <description>No referendums or discussions available at this time.</description>
        </channel>
    </rss>`;
}

// Helper function to escape XML characters
function escapeXML(str) {
    // Convert to a string if it's not already, or use an empty string for null/undefined values
    if (typeof str !== 'string') {
        str = String(str || '');
    }

    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;');
}
