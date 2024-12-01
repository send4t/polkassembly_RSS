const axios = require('axios');

const notionDatabaseId = '137431027d5b8183a389dc666db5d7e2'; // Replace with your actual database ID
const notionPageId = '14e431027d5b81f2827de65fbaaa7ecc'; // The page ID you're querying

const notionApiToken = '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'; // Replace with your Notion API token

axios.get(`https://api.notion.com/v1/pages/${notionPageId}`, {
  headers: {
    Authorization: `Bearer ${notionApiToken}`,
    'Notion-Version': '2022-06-28'
  }
})
.then(response => {
  console.log('Page details:', response.data);
})
.catch(error => {
  console.error('Error fetching page:', error);
});
