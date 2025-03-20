import { getDatabaseSchema } from './utils/schema';

// Self-executing async function
(async () => {
    try {
        console.log('Fetching Notion database schema...');
        await getDatabaseSchema();
        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
    }
})(); 