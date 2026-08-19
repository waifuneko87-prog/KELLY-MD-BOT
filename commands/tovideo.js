const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

function cleanup(...files) {
    for (const f of files) {
        setTimeout(() => {
            fse.remove(f).catch(() => {});
        }, 15000);
    }
}

function runFfmpeg(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { maxBuffer: 20 * 1024 * 1024 }, (err, stdout, stderr) => {
            if (err) {
                err.stderr = stderr;
                return reject(err);
            }
            resolve({ stdout, stderr });
        });
    });
}

async function tovideoCommand(sock, chatId, message) {
    try {
        const quoted =
            message.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
            message.message?.quotedMessage ||
            null;

        const stickerMsg =
            quoted?.stickerMessage ||
            message.message?.stickerMessage ||
            null;

        if (!stickerMsg) {
            return sock.sendMessage(chatId, {
                text: '❌ Reply to a *sticker* with *.tovideo*\n\nWorks best with animated stickers.'
            }, { quoted: message });
        }

        const isAnimated = !!stickerMsg.isAnimated;

        await sock.sendMessage(chatId, {
            text: isAnimated
                ? '⏳ Converting animated sticker → video...'
                : '⏳ Converting sticker → video (static → 2s clip)...'
        }, { quoted: message });

        const stream = await downloadContentFromMessage(stickerMsg, 'sticker');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const id = Date.now();
        const inputPath = path.join(tempDir, `sticker_${id}.webp`);
        const outputPath = path.join(tempDir, `video_${id}.mp4`);

        await fs.promises.writeFile(inputPath, buffer);

        let ffmpegCmd;
        if (isAnimated) {
            // play animated webp frames
            ffmpegCmd = `ffmpeg -y -ignore_loop 0 -i "${inputPath}" ` +
                `-vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p" ` +
                `-c:v libx264 -pix_fmt yuv420p -movflags +faststart -an ` +
                `-t 10 "${outputPath}"`;
        } else {
            // static sticker → 2 second video
            ffmpegCmd = `ffmpeg -y -loop 1 -i "${inputPath}" ` +
                `-vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p" ` +
                `-c:v libx264 -pix_fmt yuv420p -movflags +faststart -an ` +
                `-t 2 -r 15 "${outputPath}"`;
        }

        try {
            await runFfmpeg(ffmpegCmd);
        } catch (e1) {
            console.error('tovideo primary ffmpeg failed, trying fallback:', e1.message || e1);
            const fallbackCmd = `ffmpeg -y -loop 1 -i "${inputPath}" ` +
                `-vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p" ` +
                `-c:v libx264 -pix_fmt yuv420p -movflags +faststart -an ` +
                `-t 2 -r 15 "${outputPath}"`;
            await runFfmpeg(fallbackCmd);
        }

        if (!fs.existsSync(outputPath)) {
            cleanup(inputPath, outputPath);
            return sock.sendMessage(chatId, {
                text: '❌ Conversion failed. Sticker may be unsupported.'
            }, { quoted: message });
        }

        const videoBuffer = await fs.promises.readFile(outputPath);

        await sock.sendMessage(chatId, {
            video: videoBuffer,
            mimetype: 'video/mp4',
            caption: isAnimated ? '✅ Animated sticker → video' : '✅ Sticker → video'
        }, { quoted: message });

        cleanup(inputPath, outputPath);
    } catch (err) {
        console.error('tovideo command error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to convert sticker to video.\nMake sure ffmpeg is installed on the server.'
        }, { quoted: message });
    }
}

module.exports = tovideoCommand;
