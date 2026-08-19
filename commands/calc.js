async function calcCommand(sock, chatId, message, expression) {
    try {
        const expr = (expression || '').trim().replace(/×/g, '*').replace(/÷/g, '/').replace(/,/g, '');
        if (!expr) {
            return sock.sendMessage(chatId, {
                text: '❌ Usage: *.calc <expression>*\nExamples:\n.calc 2+2\n.calc (15*4)/3\n.calc 2^8'
            }, { quoted: message });
        }

        // only numbers + operators (safe)
        if (!/^[0-9+\-*/().%\s^]+$/.test(expr)) {
            return sock.sendMessage(chatId, {
                text: '❌ Invalid characters. Only numbers and + - * / % ^ ( ) allowed.'
            }, { quoted: message });
        }

        let safe = expr.replace(/\^/g, '**');

        let result;
        try {
            result = Function(`"use strict"; return (${safe})`)();
        } catch {
            return sock.sendMessage(chatId, {
                text: '❌ Invalid expression.'
            }, { quoted: message });
        }

        if (typeof result !== 'number' || !Number.isFinite(result)) {
            return sock.sendMessage(chatId, {
                text: '❌ Result is not a valid number.'
            }, { quoted: message });
        }

        const display = Number.isInteger(result) ? String(result) : parseFloat(result.toFixed(10)).toString();

        await sock.sendMessage(chatId, {
            text: `🧮 *Calculator*\n\n📥 \`${expr}\`\n📤 *${display}*`
        }, { quoted: message });
    } catch (err) {
        console.error('calc command error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Calculation failed.'
        }, { quoted: message });
    }
}

module.exports = calcCommand;
