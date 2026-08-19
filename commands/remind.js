const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'reminders.json');
let schedulerStarted = false;

function loadReminders() {
    try {
        if (!fs.existsSync(dataFile)) return [];
        return JSON.parse(fs.readFileSync(dataFile, 'utf8')) || [];
    } catch (error) {
        console.error('Error loading reminders:', error);
        return [];
    }
}

function saveReminders(reminders) {
    fs.writeFileSync(dataFile, JSON.stringify(reminders, null, 2));
}

function parseDuration(value) {
    const match = /^([0-9]+(?:\.[0-9]+)?)(s|m|h|d)$/i.exec(value);
    if (!match) return null;
    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    const ms = amount * multipliers[unit];
    if (!Number.isFinite(ms) || ms < 1000 || ms > 365 * 86400000) return null;
    return ms;
}

function formatDuration(ms) {
    const minutes = Math.round(ms / 60000);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'}`;
    const days = Math.round(hours / 24);
    return `${days} day${days === 1 ? '' : 's'}`;
}

async function remindCommand(sock, chatId, message, input, senderId) {
    const parts = input.trim().split(/\s+/);
    const duration = parts.shift();
    const reminderText = parts.join(' ').trim();

    if (!duration || !reminderText) {
        await sock.sendMessage(chatId, {
            text: '⏰ Usage: .remind <time> <message>\n\nExamples:\n.remind 10m drink water\n.remind 2h call mom\n.remind 1d study'
        }, { quoted: message });
        return;
    }

    const delay = parseDuration(duration);
    if (!delay) {
        await sock.sendMessage(chatId, {
            text: '❌ Invalid time. Use a number followed by s, m, h, or d.\nExample: .remind 30m drink water'
        }, { quoted: message });
        return;
    }

    const reminders = loadReminders();
    const reminder = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        chatId,
        senderId,
        text: reminderText,
        dueAt: Date.now() + delay
    };
    reminders.push(reminder);
    saveReminders(reminders);

    await sock.sendMessage(chatId, {
        text: `⏰ *Reminder set!*\n\nI'll remind you in *${formatDuration(delay)}*.\n📝 ${reminderText}`
    }, { quoted: message });
}

function startReminderScheduler(sock) {
    if (schedulerStarted) return;
    schedulerStarted = true;

    const check = async () => {
        const now = Date.now();
        const reminders = loadReminders();
        const due = reminders.filter(item => item.dueAt <= now);
        const pending = reminders.filter(item => item.dueAt > now);

        if (due.length) saveReminders(pending);

        for (const reminder of due) {
            try {
                await sock.sendMessage(reminder.chatId, {
                    text: `⏰ *Reminder!*\n\n📝 ${reminder.text}`
                });
            } catch (error) {
                console.error('Error sending reminder:', error);
            }
        }
    };

    check();
    setInterval(check, 5000);
}

module.exports = { remindCommand, startReminderScheduler };
