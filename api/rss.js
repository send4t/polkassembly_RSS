const fetch = require('node-fetch');  // Used to fetch the HTML from Polkassembly
const { XMLBuilder } = require('fast-xml-parser');  // Converts JSON to XML for RSS
const cheerio = require('cheerio');  // Used to parse the HTML from Polkassembly

export default async function handler(req, res) {
    // Step 1: Fetch HTML from Polkassembly's all-posts page
    const apiUrl = 'https://polkadot.polkassembly.io/all-posts?trackStatus=all&page=1';
    const response = await fetch(apiUrl);
    const html = await response.text();

    // Step 2: Parse the HTML to extract referendum data
    const referendums = parseReferendums(html);  // Call the function that scrapes the HTML

    // Step 3: Build RSS feed structure
    const feed = {
        rss: {
            "@version": "2.0",
            channel: {
                title: "Polkassembly Referendums",
                link: "https://polkadot.polkassembly.io/",
                description: "Latest referendums from Polkassembly",
                item: referendums.map(ref => ({
                    title: ref.title,
                    link: ref.link,
                    description: ref.description,
                }))
            }
        }
    };

    // Step 4: Convert JSON to XML (RSS format)
    const builder = new XMLBuilder({ format: true });
    const rssFeed = builder.build(feed);

    // Step 5: Return the RSS feed as XML response
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(rssFeed);
}

// Cheerio function to scrape referendum data from Polkassembly HTML
function parseReferendums(html) {
    const $ = cheerio.load(html);  // Load the HTML into Cheerio
    const referendums = [];

    // Iterate through each post element and extract title, link, and description
    $('.post-list-item').each((index, element) => {
        const title = $(element).find('.post-title').text().trim();  // Extract title
        const link = $(element).find('a').attr('href');  // Extract link
        const description = $(element).find('.post-excerpt').text().trim();  // Extract description

        // Add the scraped data to the referendums array
        referendums.push({
            title: title,
            link: `https://polkadot.polkassembly.io${link}`,  // Construct full URL
            description: description
        });
    });

    return referendums;  // Return the scraped referendum data
}
