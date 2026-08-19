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

        const { data } = await axios.get('https://nekobot.xyz/api/image?type=hentai', { timeout: 15000 });

        if (!data?.success || !data.message) {
            return await sock.sendMessage(chatId, { text: '❌ Failed to get hentai.' }, { quoted: message });
        }

        const img = await axios.get(data.message, { responseType: 'arraybuffer', timeout: 20000 });
        const caption = args
            ? `🔞 *Hentai*\n🔍 ${args}\n⚡ KELLY-MD`
            : `🔞 *Hentai*\n⚡ KELLY-MD`;

        await sock.sendMessage(chatId, {
            image: Buffer.from(img.data),
            caption
        }, { quoted: message });

    } catch (error) {
        console.error('hentai error:', error.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch hentai.' }, { quoted: message });
    }
};
