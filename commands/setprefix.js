const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');

// Prefix is stored here. You can also edit this file directly to change the
// prefix manually — the bot reads it fresh every time a message comes in.
const PREFIX_PATH = path.join(__dirname, '..', 'data', 'prefix.json');

// Only these symbols are allowed as a prefix.
const ALLOWED_PREFIXES = ['.', '+', '*', '#'];
const DEFAULT_PREFIX = '.';

const HINT_TEXT =
    '❌ *Invalid setprefix command!*\n\n' +
    '*How to set a command prefix:*\n' +
    '`setprefix .` → sets prefix to *.*\n' +
    '`setprefix +` → sets prefix to *+*\n' +
    '`setprefix *` → sets prefix to *\\**\n' +
    '`setprefix #` → sets prefix to *#*\n\n' +
    'Only these symbols are allowed: . + * #\n' +
    '(Remember to type it using your CURRENT prefix, e.g. if your prefix is # you must type "#setprefix .")';

// Read the currently active prefix. Falls back to "." if the file is
// missing, empty, corrupted, or contains a symbol that isn't allowed
// (this also covers someone editing the file by hand with a bad value).
function readPrefix() {
    try {
        if (!fs.existsSync(PREFIX_PATH)) {
            writePrefix(DEFAULT_PREFIX);
            return DEFAULT_PREFIX;
        }
        const raw = fs.readFileSync(PREFIX_PATH, 'utf8');
        const data = JSON.parse(raw);
        if (data && typeof data.prefix === 'string' && ALLOWED_PREFIXES.includes(data.prefix.trim())) {
            return data.prefix.trim();
        }
        return DEFAULT_PREFIX;
    } catch (error) {
        console.error('Error reading prefix.json, defaulting to ".":', error.message);
        return DEFAULT_PREFIX;
    }
}

// Persist a new prefix to data/prefix.json.
function writePrefix(newPrefix) {
    try {
        const dataDir = path.dirname(PREFIX_PATH);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(PREFIX_PATH, JSON.stringify({ prefix: newPrefix }, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing prefix.json:', error.message);
        return false;
    }
}

// Handles the actual "setprefix <symbol>" command.
// `rawArg` is whatever the user typed after "setprefix" (already trimmed of the prefix+word itself).
async function setprefixCommand(sock, chatId, message, rawArg) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = message.key.fromMe || await isOwnerOrSudo(senderId, sock, chatId);

        if (!isOwner) {
            await sock.sendMessage(chatId, {
                text: '❌ Only the bot owner or sudo can change the command prefix!'
            }, { quoted: message });
            return;
        }

        const arg = (rawArg || '').trim();

        // Must be exactly one character, and one of the allowed symbols.
        if (!arg || arg.length !== 1 || !ALLOWED_PREFIXES.includes(arg)) {
            await sock.sendMessage(chatId, { text: HINT_TEXT }, { quoted: message });
            return;
        }

        const success = writePrefix(arg);

        if (success) {
            await sock.sendMessage(chatId, {
                text: `🫸 command prefix has been set to ${arg}`
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: 'please use the correct command to set prefix `setprefix +`'
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in setprefix command:', error);
        await sock.sendMessage(chatId, {
            text: 'please use the correct command to set prefix `setprefix +`'
        }, { quoted: message });
    }
}

module.exports = {
    setprefixCommand,
    readPrefix,
    writePrefix,
    ALLOWED_PREFIXES,
    DEFAULT_PREFIX,
    PREFIX_PATH
};
