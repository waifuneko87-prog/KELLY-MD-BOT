const axios = require('axios');

module.exports = async (sock, chatId, message, args) => {
    try {
        const query = args?.trim();

        if (!query) {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        '❌ *Please provide a search query.*\n\n' +
                        'Example:\n.photos japan'
                },
                { quoted: message }
            );
            return;
        }

        const apiKey = process.env.PEXELS_API_KEY;

        if (!apiKey) {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        '❌ Pexels API key is not configured.\n\n' +
                        'Please add `PEXELS_API_KEY` to the .env file.'
                },
                { quoted: message }
            );
            return;
        }

        await sock.sendMessage(
            chatId,
            {
                text: `🔍 Searching for 5 photos of *${query}*...`
            },
            { quoted: message }
        );

        const response = await axios.get(
            'https://api.pexels.com/v1/search',
            {
                headers: {
                    Authorization: apiKey
                },
                params: {
                    query: query,
                    per_page: 5
                },
                timeout: 15000
            }
        );

        const photos = response.data?.photos || [];

        if (photos.length === 0) {
            await sock.sendMessage(
                chatId,
                {
                    text: `❌ No photos found for *${query}*.`
                },
                { quoted: message }
            );
            return;
        }

        let sent = 0;

        for (const photo of photos) {
            try {
                const imageUrl =
                    photo.src?.large2x ||
                    photo.src?.large ||
                    photo.src?.original;

                if (!imageUrl) continue;

                await sock.sendMessage(
                    chatId,
                    {
                        image: { url: imageUrl },
                        caption:
                            `🖼️ *${query}*\n` +
                            `Photo ${sent + 1}/${photos.length}\n\n` +
                            `📸 Photo by ${photo.photographer} on Pexels`
                    },
                    { quoted: message }
                );

                sent++;

                await new Promise(resolve =>
                    setTimeout(resolve, 700)
                );

            } catch (error) {
                console.error(
                    `❌ Failed to send Pexels photo:`,
                    error.message
                );
            }
        }

        if (sent === 0) {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        '❌ Photos were found, but I could not send them to WhatsApp.'
                },
                { quoted: message }
            );
        }

    } catch (error) {
        console.error('❌ Pexels photos error:', error);

        let errorMessage =
            '❌ Failed to search for photos. Please try again later.';

        if (error.response?.status === 401) {
            errorMessage =
                '❌ Invalid Pexels API key.\n\n' +
                'Please check your PEXELS_API_KEY in .env.';
        } else if (error.response?.status === 429) {
            errorMessage =
                '⚠️ Pexels API rate limit reached.\n\n' +
                'Please try again later.';
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
