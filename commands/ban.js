const fs = require('fs');
const { channelInfo } = require('../lib/messageConfig');
const isAdmin = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');

// .ban blocks a user from using the bot's commands. This is a KELLY-MD-level
// restriction, not a WhatsApp group action, so it does NOT require the bot to
// be a WhatsApp group admin. Permission to use .ban itself is:
//   - The bot owner or a sudo user (works everywhere, group or private,
//     even if they are not a group admin themselves)
//   - A group admin (group chats only)
async function banCommand(sock, chatId, message) {
    const senderId = message.key.participant || message.key.remoteJid;
    const isGroup = chatId.endsWith('@g.us');

    const senderIsOwnerOrSudo = message.key.fromMe || await isOwnerOrSudo(senderId, sock, chatId);

    if (!senderIsOwnerOrSudo) {
        if (!isGroup) {
            await sock.sendMessage(chatId, { text: 'Only owner/sudo can use .ban in private chat', ...channelInfo }, { quoted: message });
            return;
        }
        const { isSenderAdmin } = await isAdmin(sock, chatId, senderId);
        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, { text: 'Only group admins, the owner, or sudo can use .ban', ...channelInfo }, { quoted: message });
            return;
        }
    }

    let userToBan;

    // Check for mentioned users
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        userToBan = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    // Check for replied message
    else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToBan = message.message.extendedTextMessage.contextInfo.participant;
    }

    if (!userToBan) {
        await sock.sendMessage(chatId, {
            text: 'Please mention the user or reply to their message to ban!',
            ...channelInfo
        }, { quoted: message });
        return;
    }

    // Prevent banning the bot itself
    try {
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        if (userToBan === botId || userToBan === botId.replace('@s.whatsapp.net', '@lid')) {
            await sock.sendMessage(chatId, { text: 'You can not ban *KELLY-MD* itself 🫸', ...channelInfo }, { quoted: message });
            return;
        }
    } catch {}

    // Prevent banning the owner or another sudo user
    try {
        const targetIsOwnerOrSudo = await isOwnerOrSudo(userToBan, sock, chatId);
        if (targetIsOwnerOrSudo) {
            await sock.sendMessage(chatId, { text: 'You can not ban a God 🫸', ...channelInfo, mentions: [userToBan] }, { quoted: message });
            return;
        }
    } catch {}

    try {
        // Add user to banned list
        const bannedUsers = JSON.parse(fs.readFileSync('./data/banned.json'));
        if (!bannedUsers.includes(userToBan)) {
            bannedUsers.push(userToBan);
            fs.writeFileSync('./data/banned.json', JSON.stringify(bannedUsers, null, 2));

            await sock.sendMessage(chatId, {
                text: `🚫 Successfully banned @${userToBan.split('@')[0]} from using the bot!`,
                mentions: [userToBan],
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `@${userToBan.split('@')[0]} is already banned!`,
                mentions: [userToBan],
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in ban command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to ban user!', ...channelInfo }, { quoted: message });
    }
}

module.exports = banCommand;
