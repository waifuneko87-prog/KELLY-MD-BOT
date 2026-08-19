const axios = require('axios');
const { hasAccess } = require('../lib/restrictedAccess');
const isOwnerOrSudo = require('../lib/isOwner');

const TYPES = ['ass', 'pussy', 'boobs', 'gonewild', '4k', 'anal', 'thigh'];

module.exports = async (sock, chatId, message) => {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

        if (!isOwner && !hasAccess(senderId)) {
            return await sock.sendMessage(chatId, {
                text: '🔐 *Restricted Command*\n\nUse *.pass* to request temporary access from the owner.'
            }, { quoted: message });
        }

        const type = TYPES[Math.floor(Math.random() * TYPES.length)];
        const { data } = await axios.get(`https://nekobot.xyz/api/image?type=${type}`, { timeout: 15000 });

        if (!data?.success || !data.message) {
            return await sock.sendMessage(chatId, { text: '❌ Failed to get image.' }, { quoted: message });
        }

        const img = await axios.get(data.message, { responseType: 'arraybuffer', timeout: 20000 });
        await sock.sendMessage(chatId, {
            image: Buffer.from(img.data),
            caption: `🔥 *Nudes*\n⚡ KELLY-MD`
        }, { quoted: message });

    } catch (error) {
        console.error('nudes error:', error.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch nudes.' }, { quoted: message });
    }
};
