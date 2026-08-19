const axios = require('axios');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { uploadImage } = require('../lib/uploadImage');
const { resolveMiscTargetJid, enforceMiscPermission } = require('../lib/miscPermission');
const { getMiscSudo, setMiscSudo, getGroupMisc, setGroupMisc } = require('../lib/miscConfig');
const isOwnerOrSudo = require('../lib/isOwner');
const isAdmin = require('../lib/isAdmin');

async function getQuotedOrOwnImageUrl(sock, message) {
    // 1) Quoted image (highest priority)
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted?.imageMessage) {
        const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        return await uploadImage(buffer);
    }

    // 2) Image in the current message
    if (message.message?.imageMessage) {
        const stream = await downloadContentFromMessage(message.message.imageMessage, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        return await uploadImage(buffer);
    }

    // 3) Mentioned or replied participant avatar
    let targetJid;
    const ctx = message.message?.extendedTextMessage?.contextInfo;
    if (ctx?.mentionedJid?.length > 0) {
        targetJid = ctx.mentionedJid[0];
    } else if (ctx?.participant) {
        targetJid = ctx.participant;
    } else {
        targetJid = message.key.participant || message.key.remoteJid;
    }

    try {
        const url = await sock.profilePictureUrl(targetJid, 'image');
        return url;
    } catch {
        return 'https://i.imgur.com/2wzGhpF.png';
    }
}

async function handleHeart(sock, chatId, message) {
    try {
        const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
        const url = `https://api.some-random-api.com/canvas/misc/heart?avatar=${encodeURIComponent(avatarUrl)}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
    } catch (error) {
        console.error('Error in misc heart:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to create heart image. Try again later.' }, { quoted: message });
    }
}

async function miscCommand(sock, chatId, message, args) {
    const sub = (args[0] || '').toLowerCase();
    const rest = args.slice(1);

    // Permission gate: block misc commands (heart, jail, triggered, etc.)
    // from being used against the owner/sudo user or a group admin unless
    // explicitly allowed via .misc-sudo / .misc toggles.
    const targetJid = resolveMiscTargetJid(message);
    if (!(await enforceMiscPermission(sock, chatId, message, targetJid))) return;

    async function simpleAvatarOnly(endpoint) {
        const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
        const url = `https://api.some-random-api.com/canvas/misc/${endpoint}?avatar=${encodeURIComponent(avatarUrl)}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
    }

    try {
        switch (sub) {
            case 'heart':
                await simpleAvatarOnly('heart');
                break;
            
            case 'horny':
                await simpleAvatarOnly('horny');
                break;
            case 'circle':
                await simpleAvatarOnly('circle');
                break;
            case 'lgbt':
                await simpleAvatarOnly('lgbt');
                break;
            case 'lied':
                await simpleAvatarOnly('lied');
                break;
            case 'lolice':
                await simpleAvatarOnly('lolice');
                break;
            case 'simpcard':
                await simpleAvatarOnly('simpcard');
                break;
            case 'tonikawa':
                await simpleAvatarOnly('tonikawa');
                break;

            case 'its-so-stupid': {
                const dog = rest.join(' ').trim();
                if (!dog) {
                    await sock.sendMessage(chatId, { text: 'Usage: .misc its-so-stupid <text>' }, { quoted: message });
                    return;
                }
                const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
                const url = `https://api.some-random-api.com/canvas/misc/its-so-stupid?dog=${encodeURIComponent(dog)}&avatar=${encodeURIComponent(avatarUrl)}`;
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
                break;
            }

            case 'namecard': {
                // .misc namecard username|birthday|description(optional)
                const joined = rest.join(' ');
                const [username, birthday, description] = joined.split('|').map(s => (s || '').trim());
                if (!username || !birthday) {
                    await sock.sendMessage(chatId, { text: 'Usage: .misc namecard username|birthday|description(optional)' }, { quoted: message });
                    return;
                }
                const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
                const params = new URLSearchParams({ username, birthday, avatar: avatarUrl });
                if (description) params.append('description', description);
                const url = `https://api.some-random-api.com/canvas/misc/namecard?${params.toString()}`;
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
                break;
            }

           
            case 'oogway':
            case 'oogway2': {
                const quote = rest.join(' ').trim();
                if (!quote) {
                    await sock.sendMessage(chatId, { text: `Usage: .misc ${sub} <quote>` }, { quoted: message });
                    return;
                }
                const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
                const url = `https://api.some-random-api.com/canvas/misc/${sub}?quote=${encodeURIComponent(quote)}&avatar=${encodeURIComponent(avatarUrl)}`;
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
                break;
            }

            case 'tweet': {
                // .misc tweet displayname|username|comment|theme(optional: light/dark)
                const joined = rest.join(' ');
                const [displayname, username, comment, theme] = joined.split('|').map(s => (s || '').trim());
                if (!displayname || !username || !comment) {
                    await sock.sendMessage(chatId, { text: 'Usage: .misc tweet displayname|username|comment|theme(optional light/dark)' }, { quoted: message });
                    return;
                }
                const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
                const params = new URLSearchParams({ displayname, username, comment, avatar: avatarUrl });
                if (theme) params.append('theme', theme);
                const url = `https://api.some-random-api.com/canvas/misc/tweet?${params.toString()}`;
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
                break;
            }

            case 'youtube-comment': {
                // .misc youtube-comment username|comment
                const joined = rest.join(' ');
                const [username, comment] = joined.split('|').map(s => (s || '').trim());
                if (!username || !comment) {
                    await sock.sendMessage(chatId, { text: 'Usage: .misc youtube-comment username|comment' }, { quoted: message });
                    return;
                }
                const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
                const params = new URLSearchParams({ username, comment, avatar: avatarUrl });
                const url = `https://api.some-random-api.com/canvas/misc/youtube-comment?${params.toString()}`;
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
                break;
            }
            // Overlay endpoints
            case 'comrade':
            case 'gay':
            case 'glass':
            case 'jail':
            case 'passed':
            case 'triggered': {
                const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
                const overlay = sub; // same name for path
                const url = `https://api.some-random-api.com/canvas/overlay/${overlay}?avatar=${encodeURIComponent(avatarUrl)}`;
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
                break;
            }

            default:
                await sock.sendMessage(chatId, { text: 'Usage: .misc <heart|horny|circle|lgbt|lesbian|nonbinary|pansexual|transgender|lied|lolice|simpcard|tonikawa|its-so-stupid <text>|namecard u|b|d?|nobitches <text>|oogway <q>|oogway2 <q>|tweet dn|un|c|theme?|youtube-comment un|c>' }, { quoted: message });
                break;
        }
    } catch (error) {
        console.error('Error in misc command:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to generate image. Check your parameters and try again.' }, { quoted: message });
    }
}

// .misc <on/off> — per-group toggle controlling whether regular (non-admin)
// members are allowed to use misc commands (.heart, .jail, .triggered, etc.)
// against a group admin. Defaults to OFF (admin protection ON).
// Usable by group admins, the bot owner, or sudo users.
async function miscToggleCommand(sock, chatId, message, args) {
    const senderId = message.key.participant || message.key.remoteJid;
    const isGroup = chatId.endsWith('@g.us');

    if (!isGroup) {
        await sock.sendMessage(chatId, { text: '❌ This command can only be used in groups.' }, { quoted: message });
        return;
    }

    const senderIsOwnerOrSudo = message.key.fromMe || await isOwnerOrSudo(senderId, sock, chatId);
    let senderIsAdmin = false;
    if (!senderIsOwnerOrSudo) {
        try {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            senderIsAdmin = adminStatus.isSenderAdmin;
        } catch (_) {}
    }

    if (!senderIsOwnerOrSudo && !senderIsAdmin) {
        await sock.sendMessage(chatId, { text: '❌ Only group admins, the owner, or sudo can use .misc' }, { quoted: message });
        return;
    }

    const sub = (args || '').trim().toLowerCase();
    if (sub !== 'on' && sub !== 'off') {
        const state = getGroupMisc(chatId);
        await sock.sendMessage(chatId, {
            text: `*MISC ADMIN PROTECTION*\n\nCurrently *${state ? 'ON' : 'OFF'}* in this group.\n(ON = members can use misc commands against admins)\n\nUsage: .misc on/off`
        }, { quoted: message });
        return;
    }

    const enable = sub === 'on';
    setGroupMisc(chatId, enable);
    await sock.sendMessage(chatId, {
        text: enable
            ? '✅ Misc commands can now be used against admins in this group.'
            : '🛡 Admin protection enabled — misc commands can no longer be used against admins in this group.'
    }, { quoted: message });
}

// .misc-sudo <on/off> — global toggle controlling whether misc commands can
// be used against the bot owner / sudo users (and, by extension, admins,
// since admin protection never overrides sudo protection). Defaults to OFF.
// Owner/sudo only.
async function miscSudoToggleCommand(sock, chatId, message, args) {
    const senderId = message.key.participant || message.key.remoteJid;
    const senderIsOwnerOrSudo = message.key.fromMe || await isOwnerOrSudo(senderId, sock, chatId);

    if (!senderIsOwnerOrSudo) {
        await sock.sendMessage(chatId, { text: '❌ Only the bot owner or sudo can use .misc-sudo' }, { quoted: message });
        return;
    }

    const sub = (args || '').trim().toLowerCase();
    if (sub !== 'on' && sub !== 'off') {
        const state = getMiscSudo();
        await sock.sendMessage(chatId, {
            text: `*MISC SUDO PROTECTION*\n\nCurrently *${state ? 'ON' : 'OFF'}*.\n(ON = anyone can use misc commands against sudo/owner and admins)\n\nUsage: .misc-sudo on/off`
        }, { quoted: message });
        return;
    }

    const enable = sub === 'on';
    setMiscSudo(enable);
    await sock.sendMessage(chatId, {
        text: enable
            ? '✅ Misc commands can now be used against sudo/owner (and admins) by anyone.'
            : '🫸 Sudo/owner protection enabled — misc commands can no longer be used against sudo/owner.'
    }, { quoted: message });
}

module.exports = { miscCommand, handleHeart, miscToggleCommand, miscSudoToggleCommand };


