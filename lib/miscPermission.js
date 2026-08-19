const isAdmin = require('./isAdmin');
const isOwnerOrSudo = require('./isOwner');
const { getMiscSudo, getGroupMisc } = require('./miscConfig');

/**
 * Figures out who a misc command (.heart, .jail, .triggered, etc.) is being
 * used "against" — i.e. whose avatar it will use. Priority: explicit
 * @mention, then a replied-to message's participant. If neither is present
 * the command falls back to the sender's own avatar, so there is no target
 * to check permissions against.
 */
function resolveMiscTargetJid(message) {
    const ctx = message.message?.extendedTextMessage?.contextInfo;
    if (ctx?.mentionedJid?.length > 0) {
        return ctx.mentionedJid[0];
    }
    if (ctx?.participant) {
        return ctx.participant;
    }
    return null;
}

/**
 * Decides whether senderId may run a misc command against targetJid.
 *
 * Rules:
 *  - No target (self / own avatar) -> always allowed.
 *  - Target is owner/sudo -> allowed only if miscSudoEnabled (global) is on.
 *  - Target is a group admin (and sender isn't that same admin) ->
 *      - admins & owner/sudo senders: always allowed
 *      - regular members: allowed only if this group's misc toggle is on
 *  - Anything else (regular member target) -> always allowed.
 *
 * Returns { allowed: boolean, reason: null | 'sudo' | 'admin' }
 */
async function checkMiscPermission(sock, chatId, senderId, targetJid) {
    if (!targetJid || targetJid === senderId) {
        return { allowed: true, reason: null };
    }

    // Sudo/owner protection always takes priority, and applies everywhere
    // (groups and DMs), regardless of who the sender is.
    let targetIsOwnerOrSudo = false;
    try {
        targetIsOwnerOrSudo = await isOwnerOrSudo(targetJid, sock, chatId);
    } catch (_) {}

    if (targetIsOwnerOrSudo) {
        if (getMiscSudo()) {
            return { allowed: true, reason: null };
        }
        return { allowed: false, reason: 'sudo' };
    }

    // Admin protection only makes sense inside groups.
    const isGroup = typeof chatId === 'string' && chatId.endsWith('@g.us');
    if (isGroup) {
        try {
            const { isSenderAdmin: isTargetAdmin } = await isAdmin(sock, chatId, targetJid);
            if (isTargetAdmin) {
                const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId).catch(() => false);
                if (senderIsOwnerOrSudo) {
                    return { allowed: true, reason: null };
                }

                const { isSenderAdmin } = await isAdmin(sock, chatId, senderId);
                if (isSenderAdmin) {
                    return { allowed: true, reason: null };
                }

                if (getGroupMisc(chatId)) {
                    return { allowed: true, reason: null };
                }
                return { allowed: false, reason: 'admin' };
            }
        } catch (_) {
            // If we can't determine group metadata, fail open (allow).
        }
    }

    return { allowed: true, reason: null };
}

/**
 * Convenience wrapper: runs checkMiscPermission and, if denied, sends the
 * appropriate denial message (and the 🫸 reaction for the sudo/owner case)
 * on its own. Returns true if the caller should proceed, false if it
 * already handled the denial and the caller should stop.
 */
async function enforceMiscPermission(sock, chatId, message, targetJid) {
    const senderId = message.key.participant || message.key.remoteJid;
    const permission = await checkMiscPermission(sock, chatId, senderId, targetJid);
    if (permission.allowed) return true;

    if (permission.reason === 'sudo') {
        try {
            await sock.sendMessage(chatId, { react: { text: '🫸', key: message.key } });
        } catch (_) {}
        await sock.sendMessage(chatId, {
            text: '⊘ Permission denied by *Pain* 🫸\n> reason: sudo user / owner'
        }, { quoted: message });
    } else if (permission.reason === 'admin') {
        await sock.sendMessage(chatId, {
            text: '🛡 Admin protection is ON \n> use .misc <on/off> to toggle'
        }, { quoted: message });
    }
    return false;
}

module.exports = { resolveMiscTargetJid, checkMiscPermission, enforceMiscPermission };
