const {
    revokeAccess,
    normalizeJid
} = require('../lib/restrictedAccess');

module.exports = async (sock, chatId, message, args) => {
    try {
        const senderId =
            message.key.participant ||
            message.key.remoteJid;

        const ownerNumber =
            String(process.env.OWNER_NUMBER || '')
                .replace(/\D/g, '');

        const senderNumber =
            senderId
                .replace(/\D/g, '');

        if (
            !message.key.fromMe &&
            ownerNumber &&
            senderNumber !== ownerNumber
        ) {
            return await sock.sendMessage(
                chatId,
                {
                    text: '❌ Owner only command.'
                },
                { quoted: message }
            );
        }

        const input = String(args || '').trim();

        if (!input) {
            return await sock.sendMessage(
                chatId,
                {
                    text:
`❌ *Missing user.*

Usage:

.revokeaccess 947XXXXXXXXX

or reply to a user's message with:

.revokeaccess`
                },
                { quoted: message }
            );
        }

        const targetJid = normalizeJid(input);

        if (!targetJid) {
            return await sock.sendMessage(
                chatId,
                {
                    text: '❌ Invalid WhatsApp number.'
                },
                { quoted: message }
            );
        }

        const revoked = revokeAccess(targetJid);

        if (!revoked) {
            return await sock.sendMessage(
                chatId,
                {
                    text: 'ℹ️ That user does not currently have restricted access.'
                },
                { quoted: message }
            );
        }

        await sock.sendMessage(
            chatId,
            {
                text:
`🔒 *ACCESS REVOKED*

User:
${targetJid.replace('@s.whatsapp.net', '')}

Their restricted access has been removed.`
            },
            { quoted: message }
        );

    } catch (error) {

        console.error('❌ Revoke access error:', error);

        await sock.sendMessage(
            chatId,
            {
                text: '❌ Failed to revoke access.'
            },
            { quoted: message }
        );
    }
};
