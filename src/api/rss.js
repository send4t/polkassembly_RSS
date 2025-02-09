


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

module.exports = { fetchReferendums, fetchDotToUsdRate, extractReward };