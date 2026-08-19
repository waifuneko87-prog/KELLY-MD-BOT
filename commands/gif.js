const axios = require('axios');

module.exports = async (sock, chatId, message, args) => {
    try {
        const query = args?.trim();

        if (!query) {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        '❌ *Please provide a GIF search term.*\n\n' +
                        'Example:\n.gif happy'
                },
                { quoted: message }
            );
            return;
        }

        const apiKey = process.env.GIPHY_API_KEY;

        if (!apiKey) {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        '❌ *GIPHY API key is not configured.*\n\n' +
                        'Please add GIPHY_API_KEY to your .env file.'
                },
                { quoted: message }
            );
            return;
        }

        await sock.sendMessage(
            chatId,
            {
                text: `🔍 Searching for a GIF of *${query}*...`
            },
            { quoted: message }
        );

        const response = await axios.get(
            'https://api.giphy.com/v1/gifs/search',
            {
                params: {
                    api_key: apiKey,
                    q: query,
                    limit: 10,
                    rating: 'pg-13'
                },
                timeout: 15000
            }
        );

        const gifs = response.data?.data || [];

        if (!gifs.length) {
            await sock.sendMessage(
                chatId,
                {
                    text: `❌ No GIFs found for *${query}*.`
                },
                { quoted: message }
            );
            return;
        }

        // Pick a random result instead of always sending the first one
        const gif = gifs[Math.floor(Math.random() * gifs.length)];

        const images = gif.images || {};

        // Prefer MP4 because it is usually smaller and more reliable,
        // but fall back to GIF renditions.
        const mp4Url = images?.downsized_small?.mp4 ||
                       images?.original_mp4?.mp4;

        const gifUrl = images?.downsized?.url ||
                       images?.fixed_height?.url ||
                       images?.original?.url;

        if (mp4Url) {
            await sock.sendMessage(
                chatId,
                {
                    video: { url: mp4Url },
                    gifPlayback: true,
                    caption: `🎬 *${query}*\n\nPowered by GIPHY`
                },
                { quoted: message }
            );
        } else if (gifUrl) {
            await sock.sendMessage(
                chatId,
                {
                    video: { url: gifUrl },
                    gifPlayback: true,
                    caption: `🎬 *${query}*\n\nPowered by GIPHY`
                },
                { quoted: message }
            );
        } else {
            await sock.sendMessage(
                chatId,
                {
                    text: '❌ GIPHY returned a GIF, but no usable rendition was found.'
                },
                { quoted: message }
            );
        }

    } catch (error) {
        console.error('❌ GIF command error:', error);

        let errorMessage = '❌ Failed to search for a GIF. Please try again.';

        if (error.response?.status === 401) {
            errorMessage =
                '❌ *Invalid GIPHY API key.*\n\n' +
                'Please check GIPHY_API_KEY in your .env file.';
        } else if (error.response?.status === 403) {
            errorMessage =
                '❌ GIPHY rejected the API request.\n\n' +
                'Please check your API key and GIPHY API access.';
        } else if (error.response?.status === 429) {
            errorMessage =
                '⚠️ GIPHY API rate limit reached. Please try again later.';
        }

        await sock.sendMessage(
            chatId,
            {
                text: errorMessage
            },
            { quoted: message }
        );
    }
};
