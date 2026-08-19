const https = require('https');
const http = require('http');

function isValidUrl(str) {
    try {
        const u = new URL(str);
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
        return false;
    }
}

function requestJson(url, options = {}) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        const req = lib.request(url, {
            method: options.method || 'GET',
            headers: options.headers || {},
            timeout: 12000
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });
        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('timeout'));
        });
        if (options.body) req.write(options.body);
        req.end();
    });
}

async function shortCommand(sock, chatId, message, text) {
    try {
        let url = (text || '').trim();
        if (!url) {
            return sock.sendMessage(chatId, {
                text: '❌ Usage: *.short <url>*\nExample: .short https://example.com/very/long/path'
            }, { quoted: message });
        }

        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        if (!isValidUrl(url)) {
            return sock.sendMessage(chatId, {
                text: '❌ Invalid URL.'
            }, { quoted: message });
        }

        // is.gd — free, no API key
        const api = 'https://is.gd/create.php?format=json&url=' + encodeURIComponent(url);
        const res = await requestJson(api);

        if (res.body && res.body.shorturl) {
            await sock.sendMessage(chatId, {
                text: `🔗 *Link Shortened*\n\n` +
                      `Original:\n${url}\n\n` +
                      `Short:\n*${res.body.shorturl}*`
            }, { quoted: message });
            return;
        }

        // fallback v.gd
        const api2 = 'https://v.gd/create.php?format=json&url=' + encodeURIComponent(url);
        const res2 = await requestJson(api2);
        if (res2.body && res2.body.shorturl) {
            await sock.sendMessage(chatId, {
                text: `🔗 *Link Shortened*\n\n` +
                      `Original:\n${url}\n\n` +
                      `Short:\n*${res2.body.shorturl}*`
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            text: '❌ Could not shorten that link. Try again later.'
        }, { quoted: message });
    } catch (err) {
        console.error('short command error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Link shortener failed. (network / rate limit)'
        }, { quoted: message });
    }
}

module.exports = shortCommand;
