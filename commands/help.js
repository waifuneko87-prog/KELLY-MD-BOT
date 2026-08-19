const fs = require('fs');
const path = require('path');
const { readPrefix } = require('./setprefix');

module.exports = async (sock, chatId, message) => {
    try {
        const prefix = readPrefix();
        const version = process.env.BOT_VERSION || '3.3.2';
        const developer = process.env.BOT_OWNER || 'Sonali';

        // Mode
        let mode = 'Public';
        try {
            const modeData = JSON.parse(
                fs.readFileSync(path.join(process.cwd(), 'data', 'messageCount.json'), 'utf8')
            );
            if (typeof modeData.isPublic === 'boolean') {
                mode = modeData.isPublic ? 'Public' : 'Private';
            }
        } catch (e) {
            mode = 'Public';
        }

        // Uptime
        function formatUptime(seconds) {
            const days = Math.floor(seconds / 86400);
            seconds %= 86400;
            const hours = Math.floor(seconds / 3600);
            seconds %= 3600;
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            const parts = [];
            if (days) parts.push(`${days}d`);
            if (hours) parts.push(`${hours}h`);
            if (minutes) parts.push(`${minutes}m`);
            parts.push(`${secs}s`);
            return parts.join(' ');
        }
        const uptime = formatUptime(process.uptime());

        // Command count
        let commandCount = 0;
        try {
            const commandsPath = path.join(process.cwd(), 'commands');
            if (fs.existsSync(commandsPath)) {
                commandCount = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js')).length;
            }
        } catch (e) {
            commandCount = 0;
        }

        const p = prefix;
        const line = '╭─────────────────────╮';
        const mid  = '├─────────────────────┤';
        const end  = '╰─────────────────────╯';
        const blank = '│                     │';

        const menu = `
${line}
│  ✦  K E L L Y - M D  ✦  │
│   WhatsApp Assistant    │
${mid}
│  Prefix   : ${p}
│  Version  : ${version}
│  Mode     : ${mode}
│  Commands : ${commandCount}
│  Uptime   : ${uptime}
│  Developer: ${developer}
${end}

┌─『 ⚡ MAIN 』
│ ${p}help  ${p}menu  ${p}about
│ ${p}owner  ${p}ping  ${p}alive
│ ${p}settings  ${p}github
│ ${p}groupid  ${p}jid  ${p}chatid
└──────────────

┌─『 🧠 AI & INTEL 』
│ ${p}ai <text>     ${p}gpt <text>
│ ${p}gemini <text> ${p}chatbot
│ ${p}chat <text>   ${p}chatclear
│ ${p}translate <text>  ${p}trt
│ ${p}summarize <text>  ${p}summary
│ ${p}wiki <query>  ${p}lyrics <song>
│ ${p}weather <city>  ${p}news
│ ${p}sora <prompt> ${p}imagine <prompt>
└──────────────

┌─『 🎮 GAMES 』
│ ${p}quiz   ${p}trivia  ${p}hangman
│ ${p}ttt    ${p}tictactoe  ${p}move <1-9>
│ ${p}surrender  ${p}guess <letter>
│ ${p}answer <ans>  ${p}8ball <q>
│ ${p}poll <q> | opt1 | opt2
└──────────────

┌─『 😂 FUN 』
│ ${p}joke  ${p}quote  ${p}fact  ${p}meme
│ ${p}compliment  ${p}insult
│ ${p}dare  ${p}truth  ${p}flirt
│ ${p}simp  ${p}stupid  ${p}ship
│ ${p}wasted  ${p}character  ${p}character0
│ ${p}motivation
└──────────────

┌─『 ❤️ LOVE & VIBES 』
│ ${p}goodnight  ${p}gn  ${p}lovenight
│ ${p}shayari  ${p}roseday
│ ${p}ship  ${p}simp
└──────────────

┌─『 🖼️ STICKERS & MEDIA 』
│ ${p}sticker  ${p}s  ${p}simage
│ ${p}attp <text>  ${p}tovideo
│ ${p}stickercrop  ${p}crop
│ ${p}stickertelegram  ${p}telesticker
│ ${p}take  ${p}steal
│ ${p}emojimix  ${p}emix
│ ${p}gif <search>  ${p}photos <search>
│ ${p}vv  ${p}viewonce
└──────────────

┌─『 🎨 IMAGE TOOLS 』
│ ${p}removebg  ${p}rmbg  ${p}nobg
│ ${p}remini  ${p}enhance  ${p}upscale
│ ${p}blur  ${p}img-blur
│ ${p}img <prompt>  ${p}draw <prompt>
└──────────────

┌─『 ✍️ TEXT MAKER 』
│ ${p}metallic  ${p}ice  ${p}snow
│ ${p}matrix  ${p}neon  ${p}devil
│ ${p}purple  ${p}thunder  ${p}leaves
│ ${p}1917  ${p}arena  ${p}hacker
│ ${p}sand  ${p}blackpink  ${p}glitch
│ ${p}fire  ${p}light  ${p}impressive
└──────────────

┌─『 📥 DOWNLOAD 』
│ ${p}play <song>  ${p}song  ${p}music
│ ${p}mp3  ${p}ytmp3  ${p}ytmp4
│ ${p}spotify <query>
│ ${p}video <url>  ${p}download <url>
│ ${p}tiktok  ${p}tt  ${p}dailymotion
│ ${p}instagram  ${p}insta  ${p}ig
│ ${p}igs  ${p}igsc  ${p}facebook  ${p}fb
└──────────────

┌─『 🔧 TOOLS 』
│ ${p}qr <text>  ${p}calc <expr>
│ ${p}password  ${p}pass  ${p}pw
│ ${p}short <url>  ${p}url  ${p}tourl
│ ${p}ss <url>  ${p}screenshot
│ ${p}tts <text>  ${p}delete  ${p}del
│ ${p}remind <time> <text>
│ ${p}reminders
└──────────────

┌─『 👥 GROUP 』
│ ${p}tagall  ${p}hidetag <text>
│ ${p}tag <text>  ${p}tagnotadmin
│ ${p}kick @user  ${p}promote @user
│ ${p}demote @user
│ ${p}mute  ${p}unmute
│ ${p}warn @user  ${p}warnings @user
│ ${p}groupinfo  ${p}groupstats  ${p}staff
│ ${p}clear  ${p}resetlink  ${p}revoke
│ ${p}setgdesc  ${p}setgname  ${p}setgpp
│ ${p}topmembers
└──────────────

┌─『 🛡️ SECURITY 』
│ ${p}antilink  ${p}antitag
│ ${p}antibadword  ${p}antidelete
│ ${p}anticall  ${p}pmblocker
│ ${p}ban @user  ${p}unban @user
└──────────────

┌─『 ⚙️ AUTOMATION 』
│ ${p}autostatus  ${p}autoread
│ ${p}autotyping  ${p}autoreact  ${p}areact
│ ${p}mention  ${p}setmention
│ ${p}welcome  ${p}goodbye
│ ${p}misc  ${p}misc-sudo
└──────────────

┌─『 🎭 ANIME 』
│ ${p}anime  ${p}animu  ${p}animuquote
│ ${p}nom  ${p}poke  ${p}cry  ${p}kiss
│ ${p}pat  ${p}hug  ${p}wink  ${p}facepalm
│ ${p}loli  ${p}nekos [type]
└──────────────

┌─『 🌍 SPECIAL 』
│ ${p}pies  ${p}china  ${p}japan  ${p}korea
│ ${p}india  ${p}indonesia  ${p}malaysia
│ ${p}thailand
└──────────────

┌─『 👑 OWNER 』
│ ${p}mode  ${p}sudo  ${p}setpp
│ ${p}setprefix  ${p}cleartmp
│ ${p}clearsession  ${p}update
│ ${p}revokeaccess
└──────────────

┌─『 🔞 NSFW 』
│ ${p}nudes  ${p}candy  ${p}hentai
│ ${p}unhentai  ${p}porn  ${p}ht
│ ${p}eporner  ${p}nekos
└──────────────

╭─────────────────────╮
│  ✦ KELLY-MD ✦       │
│  Keep Running!      │
│  © ${new Date().getFullYear()} ${developer}
╰─────────────────────╯
`.trim();

        const botImage = path.join(__dirname, '..', 'assets', 'bot_image.jpg');

        const payload = fs.existsSync(botImage)
            ? { image: fs.readFileSync(botImage), caption: menu }
            : { text: menu };

        await sock.sendMessage(chatId, payload, { quoted: message });

    } catch (error) {
        console.error('❌ Help menu error:', error);
        await sock.sendMessage(
            chatId,
            { text: '❌ Failed to load the menu.' },
            { quoted: message }
        );
    }
};
