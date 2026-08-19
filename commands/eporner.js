const axios = require('axios');
const { hasAccess } = require('../lib/restrictedAccess');
const isOwnerOrSudo = require('../lib/isOwner');

module.exports = async (sock, chatId, message, args) => {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

        if (!isOwner && !hasAccess(senderId)) {
            return await sock.sendMessage(chatId, {
                text: '🔐 *Restricted Command*\n\nUse *.pass* to request temporary access from the owner.'
            }, { quoted: message });
        }

        const query = (args || '').trim() || 'all';
        const url = `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(query)}&per_page=1&page=1&thumbsize=big&order=latest&format=json&gay=0&lq=1`;

        const { data } = await axios.get(url, { timeout: 15000 });

        if (!data?.videos || data.videos.length === 0) {
            return await sock.sendMessage(chatId, { text: '❌ No results found.' }, { quoted: message });
        }

        const video = data.videos[0];
        const caption = `🎬 *Eporner*\n\n📌 ${video.title}\n⏱ \( {Math.floor(video.length_sec / 60)}: \){String(video.length_sec % 60).padStart(2, '0')}\n👁 ${video.views}\n🔗 ${video.url}\n\n⚡ KELLY-MD`;

        if (video.default_thumb?.src) {
            try {
                const thumb = await axios.get(video.default_thumb.src, { responseType: 'arraybuffer', timeout: 15000 });
                await sock.sendMessage(chatId, {
                    image: Buffer.from(thumb.data),
                    caption
                }, { quoted: message });
                return;
            } catch (_) {}
        }

        await sock.sendMessage(chatId, { text: caption }, { quoted: message });

    } catch (error) {
        console.error('eporner error:', error.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to search Eporner.' }, { quoted: message });
    }
};
