const axios = require('axios');
const { hasAccess } = require('../lib/restrictedAccess');
const isOwnerOrSudo = require('../lib/isOwner');

const ALLOWED = ['hentai', 'hneko', 'hkitsune', 'paizuri', 'hboobs', 'hanal', 'tentacle', 'ass', 'pussy', 'boobs', 'pgif', '4k', 'anal', 'thigh', 'gonewild'];

module.exports = async (sock, chatId, message, args) => {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

        if (!isOwner && !hasAccess(senderId)) {
            return await sock.sendMessage(chatId, {
                text: '🔐 *Restricted Command*\n\nUse *.pass* to request temporary access from the owner.'
            }, { quoted: message });
        }

        let type = (args || '').trim().toLowerCase();
        if (!type || !ALLOWED.includes(type)) {
            type = ALLOWED[Math.floor(Math.random() * ALLOWED.length)];
        }

        const { data } = await axios.get(`https://nekobot.xyz/api/image?type=${type}`, { timeout: 15000 });

        if (!data?.success || !data.message) {
            return await sock.sendMessage(chatId, { text: '❌ Failed to get image.' }, { quoted: message });
        }

        const img = await axios.get(data.message, { responseType: 'arraybuffer', timeout: 20000 });
        await sock.sendMessage(chatId, {
            image: Buffer.from(img.data),
            caption: `🌸 *Nekos* (${type})\n⚡ KELLY-MD`
        }, { quoted: message });

    } catch (error) {
        console.error('nekos error:', error.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch from NekoBot.' }, { quoted: message });
    }
};
