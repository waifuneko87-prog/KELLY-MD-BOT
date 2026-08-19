const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function dailymotionCommand(sock, chatId, message) {
    let filePath = null;

    try {
        const text =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            '';

        const match = text.match(
            /https?:\/\/(?:www\.)?dailymotion\.com\/video\/([a-zA-Z0-9]+)/
        );

        if (!match) {
            return await sock.sendMessage(
                chatId,
                {
                    text:
                        '📥 *Dailymotion Downloader*\n\n' +
                        'Usage:\n' +
                        '*.dailymotion <Dailymotion link>*\n\n' +
                        'Example:\n' +
                        '.dailymotion https://www.dailymotion.com/video/x123abc'
                },
                { quoted: message }
            );
        }

        const videoId = match[1];

        await sock.sendMessage(
            chatId,
            {
                text: '⏳ Fetching Dailymotion video...'
            },
            { quoted: message }
        );

        const apiUrl = `https://api.dailymotion.com/video/${videoId}`;

        const { data } = await axios.get(apiUrl, {
            params: {
                fields:
                    'id,title,duration,stream_h264_url,stream_h264_720_url,stream_h264_1080_url,stream_h264_480_url'
            },
            timeout: 30000
        });

        if (!data || !data.id) {
            return await sock.sendMessage(
                chatId,
                {
                    text: '❌ Dailymotion video not found.'
                },
                { quoted: message }
            );
        }

        // Prefer 720p, then 480p, then standard stream.
        const videoUrl =
            data.stream_h264_720_url ||
            data.stream_h264_480_url ||
            data.stream_h264_url;

        if (!videoUrl) {
            return await sock.sendMessage(
                chatId,
                {
                    text:
                        '❌ No downloadable video stream is available for this Dailymotion video.\n\n' +
                        'The video may be protected, private, geo-restricted, or unavailable for direct streaming.'
                },
                { quoted: message }
            );
        }

        const tempDir = path.join(__dirname, '../temp');

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        filePath = path.join(
            tempDir,
            `dailymotion-${Date.now()}.mp4`
        );

        const response = await axios.get(videoUrl, {
            responseType: 'stream',
            timeout: 120000,
            maxContentLength: 60 * 1024 * 1024,
            maxBodyLength: 60 * 1024 * 1024
        });

        await new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);

            response.data.pipe(writer);

            writer.on('finish', resolve);
            writer.on('error', reject);

            response.data.on('error', reject);
        });

        if (!fs.existsSync(filePath)) {
            throw new Error('Downloaded file does not exist');
        }

        const stats = fs.statSync(filePath);

        if (stats.size > 60 * 1024 * 1024) {
            throw new Error('Video is larger than 60 MB');
        }

        const title = data.title || 'Dailymotion Video';

        await sock.sendMessage(
            chatId,
            {
                video: fs.readFileSync(filePath),
                mimetype: 'video/mp4',
                caption:
                    `✅ *Dailymotion Downloaded*\n\n` +
                    `🎬 ${title.substring(0, 100)}\n` +
                    `⚡ KELLY-MD`
            },
            { quoted: message }
        );

    } catch (error) {
        console.error(
            'Dailymotion download error:',
            error.response?.data || error.message
        );

        await sock.sendMessage(
            chatId,
            {
                text:
                    '❌ *Dailymotion download failed.*\n\n' +
                    'The video may be unavailable, protected, or too large.'
            },
            { quoted: message }
        );

    } finally {
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (_) {}
        }
    }
}

module.exports = dailymotionCommand;
