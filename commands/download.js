// commands/download.js

const axios = require('axios');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

async function downloadCommand(sock, chatId, message) {
  try {
    const text = message.message?.conversation || 
                 message.message?.extendedTextMessage?.text || '';

    const urlMatch = text.match(/(https?:\/\/[^\s]+)/i);
    
    if (!urlMatch) {
      return await sock.sendMessage(chatId, {
        text: `📥 *Video Downloader*\n\nUsage:\n.download <link>\n\nSupported:\n• YouTube\n• TikTok\n• Instagram\n• Twitter/X\n• Facebook\n• Reddit\n• SpankBang\n• Vimeo\n• Dailymotion`
      }, { quoted: message });
    }

    const url = urlMatch[0];
    await sock.sendMessage(chatId, { 
      text: '⏳ Downloading video, please wait...' 
    }, { quoted: message });

    // ==================== YOUTUBE ====================
    if (ytdl.validateURL(url)) {
      try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.substring(0, 80);

        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const filePath = path.join(tempDir, `${Date.now()}.mp4`);
        const video = ytdl(url, { quality: '18' });

        await new Promise((resolve, reject) => {
          video.pipe(fs.createWriteStream(filePath))
            .on('finish', resolve)
            .on('error', reject);
        });

        await sock.sendMessage(chatId, {
          video: fs.readFileSync(filePath),
          caption: `✅ *YouTube Downloaded*\n\n🎬 ${title}\n⚡ Kelly-MD`
        }, { quoted: message });

        fs.unlinkSync(filePath);
        return;
      } catch (err) {
        console.log('YouTube failed, trying other methods...');
      }
    }

    // ==================== OTHER PLATFORMS (including SpankBang) ====================
    try {
      const { data } = await axios.post('https://api.cobalt.tools/api/json', {
        url: url,
        videoQuality: "720",
        filenameStyle: "basic",
        downloadMode: "auto"
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 30000
      });

      if (data && data.url) {
        const videoResponse = await axios.get(data.url, {
          responseType: 'arraybuffer',
          timeout: 90000,
          maxContentLength: 70 * 1024 * 1024
        });

        await sock.sendMessage(chatId, {
          video: Buffer.from(videoResponse.data),
          caption: `✅ *Downloaded Successfully*\n\n🔗 ${url}\n⚡ Kelly-MD`
        }, { quoted: message });

        return;
      }
    } catch (e) {
      console.log('General method failed');
    }

    // Failed
    await sock.sendMessage(chatId, {
      text: `❌ Failed to download.\n\nPossible reasons:\n• Private video\n• File too large\n• Temporary block\n\nTry another link.`
    }, { quoted: message });

  } catch (error) {
    console.error('Download Error:', error.message);
    await sock.sendMessage(chatId, {
      text: '❌ An error occurred while downloading.'
    }, { quoted: message });
  }
}

module.exports = downloadCommand;
