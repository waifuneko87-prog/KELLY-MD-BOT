async function pollCommand(sock, chatId, message, input) {
    const parts = input.split('|').map(part => part.trim()).filter(Boolean);
    const question = parts.shift();
    const options = parts;

    if (!question || options.length < 2) {
        await sock.sendMessage(chatId, {
            text: '🗳️ Usage: .poll <question> | <option 1> | <option 2>\n\nExample:\n.poll What should we watch? | Movie | Anime | Series'
        }, { quoted: message });
        return;
    }

    if (options.length > 12) {
        await sock.sendMessage(chatId, {
            text: '❌ A poll can have a maximum of 12 options.'
        }, { quoted: message });
        return;
    }

    try {
        await sock.sendMessage(chatId, {
            poll: {
                name: question,
                values: options,
                selectableCount: 1
            }
        }, { quoted: message });
    } catch (error) {
        console.error('Poll command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ I could not create the poll. Please try again.'
        }, { quoted: message });
    }
}

module.exports = pollCommand;
