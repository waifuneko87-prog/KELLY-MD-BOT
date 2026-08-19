const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../data/miscConfig.json');

function loadConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            const def = { miscSudoEnabled: false, groups: {} };
            const dir = path.dirname(CONFIG_PATH);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(def, null, 2));
            return def;
        }
        const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        if (!data.groups) data.groups = {};
        if (typeof data.miscSudoEnabled !== 'boolean') data.miscSudoEnabled = false;
        return data;
    } catch (error) {
        console.error('❌ Error loading miscConfig:', error.message);
        return { miscSudoEnabled: false, groups: {} };
    }
}

function saveConfig(config) {
    try {
        const dir = path.dirname(CONFIG_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('❌ Error saving miscConfig:', error.message);
        return false;
    }
}

// Global: whether misc commands (heart, jail, triggered, etc.) can be used
// against the bot owner / sudo users (and, when on, against admins too,
// since admin restrictions never override the sudo/owner restriction).
function getMiscSudo() {
    return !!loadConfig().miscSudoEnabled;
}

function setMiscSudo(enabled) {
    const config = loadConfig();
    config.miscSudoEnabled = !!enabled;
    return saveConfig(config);
}

// Per-group: whether regular (non-admin) members can use misc commands
// against a group admin. Defaults to false (admin protection ON).
function getGroupMisc(chatId) {
    const config = loadConfig();
    return !!(config.groups[chatId] && config.groups[chatId].enabled);
}

function setGroupMisc(chatId, enabled) {
    const config = loadConfig();
    if (!config.groups[chatId]) config.groups[chatId] = {};
    config.groups[chatId].enabled = !!enabled;
    return saveConfig(config);
}

module.exports = {
    getMiscSudo,
    setMiscSudo,
    getGroupMisc,
    setGroupMisc
};
