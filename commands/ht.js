const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { hasAccess } = require('../lib/restrictedAccess');
const isOwnerOrSudo = require('../lib/isOwner');

module.exports = async (sock, chatId, message, args) => {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

        if (!isOwner && !hasAccess(senderId)) {
            return await sock.sendMessage(chatId, {
                text: '🔐 *Restricted Command*\n\nUse *.pass* to request temporary access from the owner.'
            }, { quoted: message });
        }

        const query = (args || '').trim()
            ? `hentai ${args.trim()}`
            : 'hentai';

        await sock.sendMessage(chatId, {
            text: '⏳ Searching hentai video...'
        }, { quoted: message });

        // 1. Search Eporner (free, no key)
        const searchUrl = `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(query)}&per_page=8&page=1&thumbsize=big&order=latest&format=json&gay=0&lq=1`;
        const { data } = await axios.get(searchUrl, { timeout: 20000 });

        if (!data?.videos || data.videos.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ No hentai videos found.'
            }, { quoted: message });
        }

        // Pick random result
        const video = data.videos[Math.floor(Math.random() * data.videos.length)];
        const duration = `\( {Math.floor(video.length_sec / 60)}: \){String(video.length_sec % 60).padStart(2, '0')}`;
        const baseCaption = `🎬 *Hentai Video*\n\n📌 ${video.title}\n⏱ ${duration}\n👁 ${video.views || 'N/A'} views\n⚡ KELLY-MD`;

        // 2. Try Cobalt to download the actual video
        let videoSent = false;

        try {
            await sock.sendMessage(chatId, {
                text: '⬇️ Trying to download video...'
            }, { quoted: message });

            const { data: cobalt } = await axios.post('https://api.cobalt.tools/api/json', {
                url: video.url,
                videoQuality: '720',
                filenameStyle: 'basic',
                downloadMode: 'auto'
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 25000
            });

            if (cobalt && cobalt.url) {
                const videoRes = await axios.get(cobalt.url, {
                    responseType: 'arraybuffer',
                    timeout: 90000,
                    maxContentLength: 55 * 1024 * 1024 // \~55MB limit
                });

                const buffer = Buffer.from(videoRes.data);

                // Only send if file is reasonable size
                if (buffer.length > 100 * 1024 && buffer.length < 55 * 1024 * 1024) {
                    await sock.sendMessage(chatId, {
                        video: buffer,
                        caption: baseCaption + `\n🔗 ${video.url}`
                    }, { quoted: message });
                    videoSent = true;
                }
            }
        } catch (e) {
            console.log('Cobalt download failed for ht:', e.message);
        }

        // 3. Fallback: send thumbnail + link
        if (!videoSent) {
            if (video.default_thumb?.src) {
                try {
                    const thumbRes = await axios.get(video.default_thumb.src, {
                        responseType: 'arraybuffer',
                        timeout: 15000
                    });

                    await sock.sendMessage(chatId, {
                        image: Buffer.from(thumbRes.data),
                        caption: baseCaption + `\n🔗 ${video.url}\n\n⚠️ Full video download failed — open the link instead.`
                    }, { quoted: message });
                    return;
                } catch (_) {}
            }

            // Last resort: text only
            await sock.sendMessage(chatId, {
                text: baseCaption + `\n🔗 ${video.url}\n\n⚠️ Could not download the video file.`
            }, { quoted: message });
        }

    } catch (error) {
        console.error('ht command error:', error.message);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to fetch hentai video.'
        }, { quoted: message });
    }
};
