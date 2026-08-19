const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'messageCount.json');

function loadMessageCounts() {
    try {
        if (!fs.existsSync(dataFilePath)) return {};
        return JSON.parse(fs.readFileSync(dataFilePath, 'utf8')) || {};
    } catch (error) {
        console.error('Error loading message counts:', error);
        return {};
    }
}

async function groupStatsCommand(sock, chatId, message, isGroup) {
    if (!isGroup) {
        await sock.sendMessage(chatId, { text: 'This command is only available in group chats.' }, { quoted: message });
        return;
    }

    const groupCounts = loadMessageCounts()[chatId] || {};
    const entries = Object.entries(groupCounts).sort(([, a], [, b]) => b - a);
    const totalMessages = entries.reduce((sum, [, count]) => sum + Number(count || 0), 0);

    if (!entries.length) {
        await sock.sendMessage(chatId, { text: '📊 No message activity has been recorded for this group yet.' }, { quoted: message });
        return;
    }

    const top = entries.slice(0, 5);
    let text = `📊 *GROUP STATISTICS*\n\n`;
    text += `👥 Members tracked: *${entries.length}*\n`;
    text += `💬 Messages tracked: *${totalMessages}*\n\n`;
    text += `🏆 *Top Members*\n`;
    top.forEach(([jid, count], index) => {
        text += `${index + 1}. @${jid.split('@')[0]} — *${count}* messages\n`;
    });

    await sock.sendMessage(chatId, {
        text,
        mentions: top.map(([jid]) => jid)
    }, { quoted: message });
}

module.exports = groupStatsCommand;
