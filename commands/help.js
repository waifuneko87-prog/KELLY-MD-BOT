const fs = require('fs');
const path = require('path');
const { readPrefix } = require('./setprefix');

module.exports = async (sock, chatId, message) => {
    try {

        // ==============================
        // KELLY-MD INFORMATION
        // ==============================

        const prefix = readPrefix();
        const version = process.env.BOT_VERSION || '3.3.2';
        const developer = process.env.BOT_OWNER || 'Sonali';

        // Read current bot mode
        let mode = 'Public';

        try {
            const modeData = JSON.parse(
                fs.readFileSync(
                    path.join(process.cwd(), 'data', 'messageCount.json'),
                    'utf8'
                )
            );

            if (typeof modeData.isPublic === 'boolean') {
                mode = modeData.isPublic ? 'Public' : 'Private';
            }
        } catch (e) {
            mode = 'Public';
        }

        // ==============================
        // UPTIME
        // ==============================

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

        // ==============================
        // COMMAND COUNT
        // ==============================

        let commandCount = 196;

        try {
            const commandsPath = path.join(process.cwd(), 'commands');

            if (fs.existsSync(commandsPath)) {
                const files = fs.readdirSync(commandsPath);

                const jsFiles = files.filter(
                    file => file.endsWith('.js')
                );

                if (jsFiles.length > 0) {
                    commandCount = jsFiles.length;
                }
            }
        } catch (e) {
            commandCount = 196;
        }

        // ==============================
        // KELLY-MD MENU
        // ==============================

        const menu = `
━━━━━━━━━━━━━━━━━━━━━━

✦ K E L L Y - M D ✦
WhatsApp Assistant

━━━━━━━━━━━━━━━━━━━━━━

BOT INFORMATION

◉ Prefix   : ${prefix}
◉ Version  : ${version}
◉ Mode     : ${mode}
◉ Commands : ${commandCount}
◉ Uptime   : ${uptime}
◉ Developer: ${developer}

━━━━━━━━━━━━━━━━━━━━━━

⚡ MAIN COMMANDS

GENERAL

• ${prefix}help
• ${prefix}menu
• ${prefix}about
• ${prefix}kelly
• ${prefix}owner
• ${prefix}ping
• ${prefix}alive
• ${prefix}settings
• ${prefix}jid
• ${prefix}groupid
• ${prefix}chatid

━━━━━━━━━━━━━━━━━━━━━━

🧠 AI & INTELLIGENCE

• ${prefix}ai <text>
• ${prefix}gpt <text>
• ${prefix}gemini <text>
• ${prefix}chatbot
• ${prefix}translate <text>
• ${prefix}trt <text>
• ${prefix}summarize <text>
• ${prefix}summary <text>
• ${prefix}wiki <query>
• ${prefix}lyrics <song>
• ${prefix}weather <city>
• ${prefix}news
• ${prefix}sora <prompt>
• ${prefix}imagine <prompt>

━━━━━━━━━━━━━━━━━━━━━━

🎮 GAMES

• ${prefix}quiz
• ${prefix}trivia
• ${prefix}hangman
• ${prefix}ttt
• ${prefix}tictactoe
• ${prefix}move <1-9>
• ${prefix}surrender
• ${prefix}guess <letter>
• ${prefix}answer <answer>
• ${prefix}8ball <question>

━━━━━━━━━━━━━━━━━━━━━━

😂 FUN & ENTERTAINMENT

• ${prefix}joke
• ${prefix}quote
• ${prefix}fact
• ${prefix}meme
• ${prefix}compliment
• ${prefix}insult
• ${prefix}dare
• ${prefix}truth
• ${prefix}flirt
• ${prefix}simp
• ${prefix}stupid
• ${prefix}ship
• ${prefix}wasted
• ${prefix}character
• ${prefix}character0
• ${prefix}waste

━━━━━━━━━━━━━━━━━━━━━━

❤️ LOVE & VIBES

• ${prefix}goodnight
• ${prefix}lovenight
• ${prefix}gn
• ${prefix}shayari
• ${prefix}shayri
• ${prefix}roseday
• ${prefix}heart
• ${prefix}horny
• ${prefix}circle
• ${prefix}simpcard
• ${prefix}tonikawa
• ${prefix}lgbt

━━━━━━━━━━━━━━━━━━━━━━

🖼️ MEDIA

• ${prefix}gif <search>
• ${prefix}photos <search>
• ${prefix}sticker
• ${prefix}s
• ${prefix}simage
• ${prefix}attp <text>
• ${prefix}tovideo
• ${prefix}stickertovideo
• ${prefix}stovid
• ${prefix}crop
• ${prefix}take
• ${prefix}steal
• ${prefix}emojimix
• ${prefix}emix
• ${prefix}vv

━━━━━━━━━━━━━━━━━━━━━━

🎨 IMAGE TOOLS

• ${prefix}removebg
• ${prefix}rmbg
• ${prefix}nobg
• ${prefix}remini
• ${prefix}enhance
• ${prefix}upscale
• ${prefix}blur
• ${prefix}img <prompt>
• ${prefix}draw <prompt>

━━━━━━━━━━━━━━━━━━━━━━

✍️ TEXT MAKER

• ${prefix}metallic <text>
• ${prefix}ice <text>
• ${prefix}snow <text>
• ${prefix}impressive <text>
• ${prefix}matrix <text>
• ${prefix}light <text>
• ${prefix}neon <text>
• ${prefix}devil <text>
• ${prefix}purple <text>
• ${prefix}thunder <text>
• ${prefix}leaves <text>
• ${prefix}1917 <text>
• ${prefix}arena <text>
• ${prefix}hacker <text>
• ${prefix}sand <text>
• ${prefix}blackpink <text>
• ${prefix}glitch <text>
• ${prefix}fire <text>

━━━━━━━━━━━━━━━━━━━━━━

📥 DOWNLOAD

• ${prefix}download <url>
• ${prefix}dl <url>
• ${prefix}video <url>
• ${prefix}dailymotion <url>
• ${prefix}play <song>
• ${prefix}mp3 <song>
• ${prefix}ytmp3 <song>
• ${prefix}ytmp4 <url>
• ${prefix}song <song>
• ${prefix}music <song>
• ${prefix}spotify <query>
• ${prefix}tiktok <url>
• ${prefix}tt <url>
• ${prefix}instagram <url>
• ${prefix}insta <url>
• ${prefix}ig <url>
• ${prefix}igsc <url>
• ${prefix}igs <url>
• ${prefix}facebook <url>
• ${prefix}fb <url>

━━━━━━━━━━━━━━━━━━━━━━

🔧 TOOLS

• ${prefix}qr <text>
• ${prefix}calc <expression>
• ${prefix}calculate <expression>
• ${prefix}password
• ${prefix}pass
• ${prefix}pw
• ${prefix}short <url>
• ${prefix}shorten <url>
• ${prefix}tiny <url>
• ${prefix}tourl
• ${prefix}url
• ${prefix}ss <url>
• ${prefix}ssweb <url>
• ${prefix}screenshot <url>
• ${prefix}tts <text>
• ${prefix}delete
• ${prefix}del

━━━━━━━━━━━━━━━━━━━━━━

👥 GROUP MANAGEMENT

• ${prefix}tagall
• ${prefix}tagnotadmin
• ${prefix}hidetag <text>
• ${prefix}tag <text>
• ${prefix}kick @user
• ${prefix}promote @user
• ${prefix}demote @user
• ${prefix}mute
• ${prefix}unmute
• ${prefix}warn @user
• ${prefix}warnings @user
• ${prefix}groupinfo
• ${prefix}infogp
• ${prefix}staff
• ${prefix}admins
• ${prefix}listadmin
• ${prefix}groupstats
• ${prefix}clear
• ${prefix}resetlink
• ${prefix}revoke
• ${prefix}setgdesc <text>
• ${prefix}setgname <name>
• ${prefix}setgpp

━━━━━━━━━━━━━━━━━━━━━━

🛡️ SECURITY

• ${prefix}antilink
• ${prefix}antitag
• ${prefix}antibadword
• ${prefix}ban @user
• ${prefix}unban @user
• ${prefix}antidelete
• ${prefix}anticall
• ${prefix}pmblocker

━━━━━━━━━━━━━━━━━━━━━━

⚙️ AUTOMATION

• ${prefix}autostatus
• ${prefix}autoread
• ${prefix}autotyping
• ${prefix}autoreact
• ${prefix}areact
• ${prefix}mention
• ${prefix}setmention
• ${prefix}misc
• ${prefix}misc-sudo
• ${prefix}welcome
• ${prefix}goodbye

━━━━━━━━━━━━━━━━━━━━━━

🎭 ANIME & MEMES

• ${prefix}animu
• ${prefix}animuquote
• ${prefix}nom
• ${prefix}poke
• ${prefix}cry
• ${prefix}kiss
• ${prefix}pat
• ${prefix}hug
• ${prefix}wink
• ${prefix}facepalm
• ${prefix}loli
• ${prefix}comrade
• ${prefix}gay
• ${prefix}glass
• ${prefix}jail
• ${prefix}passed
• ${prefix}triggered
• ${prefix}tweet
• ${prefix}ytcomment
• ${prefix}oogway
• ${prefix}oogway2
• ${prefix}namecard

━━━━━━━━━━━━━━━━━━━━━━

🌍 SPECIAL

• ${prefix}pies
• ${prefix}china
• ${prefix}japan
• ${prefix}korea
• ${prefix}india
• ${prefix}indonesia
• ${prefix}malaysia
• ${prefix}thailand
• ${prefix}github
• ${prefix}motivation

━━━━━━━━━━━━━━━━━━━━━━

👑 OWNER ONLY

• ${prefix}mode
• ${prefix}sudo
• ${prefix}setpp
• ${prefix}setprefix
• ${prefix}cleartmp
• ${prefix}clearsession
• ${prefix}antidelete
• ${prefix}autostatus
• ${prefix}autoread
• ${prefix}autoreact
• ${prefix}autotyping
• ${prefix}areact
• ${prefix}pmblocker
• ${prefix}update

━━━━━━━━━━━━━━━━━━━━━━

🔞 NSFW (Restricted)
• ${prefix}nudes
• ${prefix}candy
• ${prefix}hentai [name]
• ${prefix}unhentai [name]
• ${prefix}porn
• ${prefix}ht [query]
• ${prefix}eporner [query]
• ${prefix}nekos [type]

━━━━━━━━━━━━━━━━━━━━━━

⚡ KELLY-MD
WhatsApp Assistant

© ${new Date().getFullYear()} KELLY-MD
━━━━━━━━━━━━━━━━━━━━━━
`;

        // ==============================
        // SEND MENU WITH BOT IMAGE
        // ==============================

        const botImage = path.join(
            __dirname,
            '..',
            'assets',
            'bot_image.jpg'
        );

        await sock.sendMessage(
            chatId,
            {
                image: fs.readFileSync(botImage),
                caption: menu
            },
            {
                quoted: message
            }
        );

    } catch (error) {

        console.error('❌ Help menu error:', error);

        await sock.sendMessage(
            chatId,
            {
                text: '❌ Failed to load the menu.'
            },
            {
                quoted: message
            }
        );
    }
};
