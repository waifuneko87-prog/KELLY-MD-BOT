async function groupidCommand(sock, chatId, message) {
    try {
        const jid = message.key.remoteJid;
        const isGroup = jid.endsWith('@g.us');
        const sender = message.key.participant || message.key.remoteJid;

        let text = `🆔 *Chat ID*\n\n`;
        text += `Chat: \`${jid}\`\n`;
        text += `Type: *${isGroup ? 'Group' : 'Private'}*\n`;
        text += `Your JID: \`${sender}\`\n`;

        if (isGroup) {
            try {
                const meta = await sock.groupMetadata(jid);
                text += `Group name: *${meta.subject || 'Unknown'}*\n`;
                text += `Participants: *${meta.participants?.length || '?'}*\n`;
            } catch (e) {
                // optional
            }
        }

        await sock.sendMessage(chatId, { text }, { quoted: message });
    } catch (err) {
        console.error('groupid command error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to get chat ID.'
        }, { quoted: message });
    }
}

module.exports = groupidCommand;
