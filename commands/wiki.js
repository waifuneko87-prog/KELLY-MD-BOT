const axios = require('axios');

async function wikiCommand(sock, chatId, message, query) {
    if (!query) {
        await sock.sendMessage(chatId, {
            text: '📚 Usage: .wiki <topic>\nExample: .wiki Sri Lanka'
        }, { quoted: message });
        return;
    }

    try {
        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/\s+/g, '_'))}`, {
            headers: { 'User-Agent': 'KELLY-MD/2.0 (WhatsApp bot)' },
            timeout: 15000
        });
        const data = response.data;

        if (!data?.extract) throw new Error('No article found');

        let summary = data.extract.replace(/\s+/g, ' ').trim();
        if (summary.length > 1800) summary = `${summary.slice(0, 1797).trim()}...`;

        let text = `📚 *${data.title || query}*\n\n${summary}`;
        if (data.content_urls?.desktop?.page) text += `\n\n🔗 ${data.content_urls.desktop.page}`;

        await sock.sendMessage(chatId, { text }, { quoted: message });
    } catch (error) {
        console.error('Wiki command error:', error.message);
        await sock.sendMessage(chatId, {
            text: `❌ I couldn't find a Wikipedia article for *${query}*.`
        }, { quoted: message });
    }
}

module.exports = wikiCommand;
