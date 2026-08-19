// commands/music.js

const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

async function musicCommand(sock, chatId, message) {
  try {
    const text = message.message?.conversation || 
                 message.message?.extendedTextMessage?.text || '';

    const query = text.replace(/^\.music\s*/i, '').trim();

    if (!query) {
      return await sock.sendMessage(chatId, {
        text: `🎵 *Music Downloader*\n\nUsage:\n.music Shape of You\n.music Believer\n.music any song name`
      }, { quoted: message });
    }

    await sock.sendMessage(chatId, {
      text: `🔍 Searching: *${query}*\nPlease wait...`
    }, { quoted: message });

    // Search YouTube
    const search = await yts(query);
    const video = search.videos[0];

    if (!video) {
      return await sock.sendMessage(chatId, {
        text: '❌ No results found. Try another song name.'
      }, { quoted: message });
    }

    const title = video.title;
    const url = video.url;
    const duration = video.timestamp;
    const thumbnail = video.thumbnail;

    await sock.sendMessage(chatId, {
      text: `✅ *Found:*\n${title}\n⏱ ${duration}\n\n⏳ Downloading audio...`
    }, { quoted: message });

    // Temp folder
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const filePath = path.join(tempDir, `${Date.now()}.mp3`);

    // Download audio only
    const audioStream = ytdl(url, {
      filter: 'audioonly',
      quality: 'highestaudio'
    });

    const writeStream = fs.createWriteStream(filePath);
    audioStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      audioStream.on('error', reject);
    });

    // Send as audio
    await sock.sendMessage(chatId, {
      audio: fs.readFileSync(filePath),
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: `Duration: ${duration} | Kelly-MD`,
          thumbnailUrl: thumbnail,
          sourceUrl: url,
          mediaType: 1
        }
      }
    }, { quoted: message });

    // Delete temp file
    fs.unlinkSync(filePath);

  } catch (error) {
    console.error('Music Command Error:', error.message);
    await sock.sendMessage(chatId, {
      text: '❌ Failed to download the song. Please try again later.'
    }, { quoted: message });
  }
}

module.exports = musicCommand;
