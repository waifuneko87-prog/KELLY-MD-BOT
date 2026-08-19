// commands/imagine.js

const axios = require('axios');

async function imagineCommand(sock, chatId, message) {
  try {
    // Get message text
    let text = message.message?.conversation || 
               message.message?.extendedTextMessage?.text || '';

    // Extract prompt (remove command)
    let prompt = text.replace(/^\.(imagine|img|draw)\s*/i, '').trim();

    // If no prompt
    if (!prompt || prompt.length < 2) {
      return await sock.sendMessage(chatId, {
        text: `🎨 *Imagine Generator*\n\n` +
              `Usage:\n` +
              `.imagine a beautiful tree\n` +
              `.imagine cute anime girl in rain\n` +
              `.imagine cyberpunk city at night\n\n` +
              `Also works with:\n.img  |  .draw`
      }, { quoted: message });
    }

    // Limit prompt length
    if (prompt.length > 400) {
      return await sock.sendMessage(chatId, {
        text: '❌ Prompt is too long. Please keep it under 400 characters.'
      }, { quoted: message });
    }

    // Send loading message
    const loadingMsg = await sock.sendMessage(chatId, {
      text: `🎨 *Generating Image...*\n\n` +
            `Prompt: _${prompt}_\n\n` +
            `⏳ Please wait 10-30 seconds...`
    }, { quoted: message });

    // Encode prompt
    const encodedPrompt = encodeURIComponent(prompt);

    // Best free endpoints (Flux model)
    const endpoints = [
      `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=1024&height=1024&nologo=true&enhance=true`,
      `https://gen.pollinations.ai/image/${encodedPrompt}?model=flux&width=1024&height=1024&nologo=true`,
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`
    ];

    let imageBuffer = null;
    let lastError = null;

    // Try each endpoint
    for (const url of endpoints) {
      try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          timeout: 45000, // 45 seconds
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });

        if (response.status === 200 && response.data) {
          imageBuffer = Buffer.from(response.data);
          break; // Success
        }
      } catch (err) {
        lastError = err;
        continue; // Try next endpoint
      }
    }

    // If all failed
    if (!imageBuffer) {
      await sock.sendMessage(chatId, {
        text: `❌ Failed to generate image.\n\n` +
              `Possible reasons:\n` +
              `• Server is busy\n` +
              `• Prompt is blocked\n` +
              `• Try again in 20 seconds`
      }, { quoted: message });
      return;
    }

    // Send the generated image
    await sock.sendMessage(chatId, {
      image: imageBuffer,
      caption: `✨ *Image Generated*\n\n` +
               `🎨 Prompt: ${prompt}\n` +
               `🤖 Model: Flux (Free)\n` +
               `⚡ Kelly-MD`
    }, { quoted: message });

  } catch (error) {
    console.error('Imagine Command Error:', error.message);
    await sock.sendMessage(chatId, {
      text: '❌ Something went wrong while generating the image. Please try again.'
    }, { quoted: message });
  }
}

module.exports = imagineCommand;
