const {
    requestAccess,
    redeemCode,
    getOwnerJid,
    CODE_TTL,
    ACCESS_TTL
} = require('../lib/restrictedAccess');

function formatTime(ms) {
    return Math.max(1, Math.ceil(ms / 60000));
}

module.exports = async (sock, chatId, message, args) => {
    try {
        const senderId =
            message.key.participant ||
            message.key.remoteJid;

        const input = String(args || '').trim();

        // ==========================================
        // .pass CODE
        // ==========================================

        if (input) {
            const result = redeemCode(input, senderId);

            if (!result.success) {

                let text = '❌ *Invalid unlock code.*';

                if (result.reason === 'expired') {
                    text = '⏰ *This unlock code has expired.*';
                }

                if (result.reason === 'used') {
                    text = '🔒 *This unlock code has already been used.*';
                }

                return await sock.sendMessage(
                    chatId,
                    { text },
                    { quoted: message }
                );
            }

            return await sock.sendMessage(
                chatId,
                {
                    text:
`✅ *ACCESS GRANTED*

🔓 Restricted features are now unlocked.

⏱️ Access duration: ${formatTime(ACCESS_TTL)} minutes

⚡ KELLY-MD`
                },
                { quoted: message }
            );
        }

        // ==========================================
        // .pass
        // ==========================================

        const ownerJid = getOwnerJid();

        if (!ownerJid) {
            return await sock.sendMessage(
                chatId,
                {
                    text:
`❌ *Owner number is not configured.*

The bot owner needs to add:

OWNER_NUMBER=your_number

to the environment configuration.`
                },
                { quoted: message }
            );
        }

        const request = requestAccess(
            senderId,
            chatId
        );

        const requesterNumber =
            senderId
                .replace('@s.whatsapp.net', '')
                .replace('@g.us', '');

        const expiresIn =
            formatTime(CODE_TTL);

        // ==========================================
        // SEND REQUEST TO OWNER
        // ==========================================

        await sock.sendMessage(
            ownerJid,
            {
                text:
`🔐 *KELLY-MD ACCESS REQUEST*

👤 User:
${requesterNumber}

💬 Chat:
${chatId}

━━━━━━━━━━━━━━━━━━━━

🔑 Unlock Code:

*${request.code}*

⏱️ Code expires in ${expiresIn} minutes.

⚠️ Give this code only to the person you approve.

━━━━━━━━━━━━━━━━━━━━
KELLY-MD ACCESS SYSTEM`
            }
        );

        // ==========================================
        // CONFIRM REQUEST
        // ==========================================

        await sock.sendMessage(
            chatId,
            {
                text:
`🔐 *ACCESS REQUESTED*

Your request has been sent to the bot owner.

⏳ Please wait for the owner to provide your unlock code.

When you receive it, use:

*.pass YOUR-CODE*

⚠️ The code is temporary and can only be used once.`
            },
            { quoted: message }
        );

    } catch (error) {

        console.error('❌ Pass command error:', error);

        await sock.sendMessage(
            chatId,
            {
                text: '❌ Failed to process the access request.'
            },
            { quoted: message }
        );
    }
};
