function generatePassword(length = 16, options = {}) {
    const {
        upper = true,
        lower = true,
        numbers = true,
        symbols = true
    } = options;

    const sets = [];
    if (upper) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (lower) sets.push('abcdefghijklmnopqrstuvwxyz');
    if (numbers) sets.push('0123456789');
    if (symbols) sets.push('!@#$%^&*()-_=+[]{}|;:,.<>?');

    if (sets.length === 0) sets.push('abcdefghijklmnopqrstuvwxyz0123456789');

    const all = sets.join('');
    let password = '';

    // at least one from each set
    for (const set of sets) {
        password += set[Math.floor(Math.random() * set.length)];
    }

    for (let i = password.length; i < length; i++) {
        password += all[Math.floor(Math.random() * all.length)];
    }

    // shuffle
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    return password;
}

async function passwordCommand(sock, chatId, message, argsText) {
    try {
        const parts = (argsText || '').trim().split(/\s+/).filter(Boolean);
        let length = 16;
        let useSymbols = true;

        for (const p of parts) {
            if (/^\d+$/.test(p)) {
                length = parseInt(p, 10);
            } else if (p === 'nosymbol' || p === 'nosymbols' || p === 'simple') {
                useSymbols = false;
            }
        }

        if (length < 4) length = 4;
        if (length > 64) length = 64;

        const pass = generatePassword(length, {
            upper: true,
            lower: true,
            numbers: true,
            symbols: useSymbols
        });

        await sock.sendMessage(chatId, {
            text: `🔐 *Password Generator*\n\n` +
                  `Length: *${length}*\n` +
                  `Symbols: *${useSymbols ? 'yes' : 'no'}*\n\n` +
                  `\`${pass}\`\n\n` +
                  `_Usage: .password [length] [nosymbol]_`
        }, { quoted: message });
    } catch (err) {
        console.error('password command error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to generate password.'
        }, { quoted: message });
    }
}

module.exports = passwordCommand;
