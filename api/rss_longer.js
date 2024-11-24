const fetch = require('node-fetch'); // Ensure you have the 'node-fetch' library installed

// Your Notion API Key and Database ID
const NOTION_API_KEY = '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'; // Replace with your Notion API Key
const DATABASE_ID = '117ca2a77d87817ab04fffee0f6c4ffd'; // Replace with your Database ID

// Fetch items from the Notion database
async function getNotionDatabaseItems() {
    const url = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28', // Ensure this matches your API version
        },
        body: JSON.stringify({}),
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Log the results to the console
        //console.log('Database Items:', data.results);

        // Return the items
        return data.results;
    } catch (error) {
        console.error('Error fetching database items:', error.message);
    }
}

// Call the function

async function getPolkassemblyPost() {
    try {
        const response = await fetch('https://api.polkassembly.io/api/v1/latest-activity/all-posts?govType=open_gov&listingLimit=10', {
            method: 'GET',
            headers: {
                'x-network': 'polkadot', 
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const recentPosts = data.posts.filter(post => {
            const postDate = new Date(post.created_at);
            return postDate >= twentyFourHoursAgo && postDate <= now && post.post_id <= 2500;
        });
        console.log('Recent posts', data);
        return recentPosts;

    } catch (error) {
        console.error('Error fetching referendums:', error.message);
        throw error;
    }
}


const notionPost = getNotionDatabaseItems();

const polkassemblyPost = getPolkassemblyPost();

