import fetch from 'node-fetch'; // Ensure you're using ES module syntax if you're using imports

export default async function handler(req, res) {
    // Check if the method is GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Fetch the latest referendums
        const posts = await fetchReferendums();

        // Fetch content for each post
        const postsWithContent = await Promise.all(
            posts.map(async (post) => {
                const content = await fetchReferendumContent(post.post_id);
                return { ...post, content: content.content || 'No content available' }; // Attach the fetched content
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

// Fetch referendums from Polkassembly API
// Fetch referendums from Polkassembly API
async function fetchReferendums() {
    try {
        // Fetch from Polkassembly API
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

        // Parse response
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

// Generate the RSS feed
function generateRSSFeed(posts) {
    const items = posts.map(post => `
        <item>
            <title>${escapeXML(post.title)}</title>
            <description>${escapeXML(post.content || 'No description available.')}</description>
            <link>https://polkadot.polkassembly.io/post/${post.post_id}</link>
            <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
        </item>
    `).join('');

    return `
    <rss version="2.0">
        <channel>
            <title>Polkassembly Referendums</title>
            <link>https://yourwebsite.com</link>
            <description>Latest referendums from Polkassembly.</description>
            ${items}
        </channel>
    </rss>`;
}

// Generate an empty RSS feed when no referendums are available
function generateEmptyRSSFeed() {
    return `
    <rss version="2.0">
        <channel>
            <title>Polkassembly Referendums</title>
            <link>https://yourwebsite.com</link>
            <description>No referendums available at this time.</description>
        </channel>
    </rss>`;
}

// Helper function to escape XML characters
function escapeXML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;');
}
