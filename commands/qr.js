const QRCode = require('qrcode');

async function qrCommand(sock, chatId, message, text) {
    try {
        const input = (text || '').trim();
        if (!input) {
            return sock.sendMessage(chatId, {
                text: '❌ Usage: *.qr <text or url>*\nExample: .qr https://example.com'
            }, { quoted: message });
        }

        const buffer = await QRCode.toBuffer(input, {
            type: 'png',
            width: 512,
            margin: 2,
            errorCorrectionLevel: 'M',
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        await sock.sendMessage(chatId, {
            image: buffer,
            caption: `✅ QR generated\n📝 ${input.length > 80 ? input.slice(0, 77) + '...' : input}`
        }, { quoted: message });
    } catch (err) {
        console.error('qr command error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to generate QR code.'
        }, { quoted: message });
    }
}

module.exports = qrCommand;
