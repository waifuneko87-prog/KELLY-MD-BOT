const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(process.cwd(), 'data');
const ACCESS_FILE = path.join(DATA_DIR, 'restrictedAccess.json');

const CODE_TTL = 10 * 60 * 1000;      // 10 minutes
const ACCESS_TTL = 30 * 60 * 1000;    // 30 minutes

function ensureStorage() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(ACCESS_FILE)) {
        fs.writeFileSync(
            ACCESS_FILE,
            JSON.stringify({
                pending: {},
                access: {}
            }, null, 2)
        );
    }
}

function loadData() {
    ensureStorage();

    try {
        return JSON.parse(fs.readFileSync(ACCESS_FILE, 'utf8'));
    } catch (error) {
        console.error('❌ Restricted access database error:', error);

        return {
            pending: {},
            access: {}
        };
    }
}

function saveData(data) {
    ensureStorage();

    fs.writeFileSync(
        ACCESS_FILE,
        JSON.stringify(data, null, 2)
    );
}

function cleanupExpired(data) {
    const now = Date.now();

    for (const code of Object.keys(data.pending)) {
        if (data.pending[code].expiresAt <= now) {
            delete data.pending[code];
        }
    }

    for (const userId of Object.keys(data.access)) {
        if (data.access[userId].expiresAt <= now) {
            delete data.access[userId];
        }
    }
}

function normalizeJid(value) {
    if (!value) return null;

    let jid = String(value).trim();

    if (jid.includes('@')) {
        return jid;
    }

    jid = jid.replace(/\D/g, '');

    if (!jid) return null;

    return `${jid}@s.whatsapp.net`;
}

function getOwnerJid() {
    const number = process.env.OWNER_NUMBER;

    if (!number) {
        return null;
    }

    return normalizeJid(number);
}

function generateCode() {
    const random = crypto
        .randomBytes(9)
        .toString('hex')
        .toUpperCase();

    return `KELLY-${random.slice(0, 4)}-${random.slice(4, 8)}-${random.slice(8, 12)}`;
}

function requestAccess(userId, chatId) {
    const data = loadData();

    cleanupExpired(data);

    // Remove an older pending request from the same user
    for (const code of Object.keys(data.pending)) {
        if (data.pending[code].userId === userId) {
            delete data.pending[code];
        }
    }

    const code = generateCode();

    data.pending[code] = {
        userId,
        chatId,
        createdAt: Date.now(),
        expiresAt: Date.now() + CODE_TTL,
        used: false
    };

    saveData(data);

    return {
        code,
        expiresAt: data.pending[code].expiresAt
    };
}

function redeemCode(code, userId) {
    const data = loadData();

    cleanupExpired(data);

    const normalizedCode = String(code || '').trim().toUpperCase();

    const request = data.pending[normalizedCode];

    if (!request) {
        saveData(data);

        return {
            success: false,
            reason: 'invalid'
        };
    }

    if (request.used) {
        delete data.pending[normalizedCode];
        saveData(data);

        return {
            success: false,
            reason: 'used'
        };
    }

    if (request.expiresAt <= Date.now()) {
        delete data.pending[normalizedCode];
        saveData(data);

        return {
            success: false,
            reason: 'expired'
        };
    }

    // The code is intentionally not locked to the requesting user.
    // The owner can give the code to the person they approve.
    data.access[userId] = {
        grantedAt: Date.now(),
        expiresAt: Date.now() + ACCESS_TTL
    };

    request.used = true;

    delete data.pending[normalizedCode];

    saveData(data);

    return {
        success: true,
        expiresAt: data.access[userId].expiresAt
    };
}

function hasAccess(userId) {
    const data = loadData();

    cleanupExpired(data);

    const access = data.access[userId];

    if (!access) {
        saveData(data);
        return false;
    }

    if (access.expiresAt <= Date.now()) {
        delete data.access[userId];
        saveData(data);
        return false;
    }

    saveData(data);

    return true;
}

function revokeAccess(userId) {
    const data = loadData();

    cleanupExpired(data);

    const existed = Boolean(data.access[userId]);

    delete data.access[userId];

    saveData(data);

    return existed;
}

function getAccessInfo(userId) {
    const data = loadData();

    cleanupExpired(data);

    const access = data.access[userId];

    saveData(data);

    if (!access) {
        return null;
    }

    return access;
}

function getPendingInfo(code) {
    const data = loadData();

    cleanupExpired(data);

    const request = data.pending[code];

    saveData(data);

    return request || null;
}

module.exports = {
    requestAccess,
    redeemCode,
    hasAccess,
    revokeAccess,
    getAccessInfo,
    getPendingInfo,
    getOwnerJid,
    normalizeJid,
    CODE_TTL,
    ACCESS_TTL
};
