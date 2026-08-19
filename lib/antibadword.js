const { setAntiBadword, getAntiBadword, removeAntiBadword, incrementWarningCount, resetWarningCount } = require('../lib/index');
const isAdmin = require('../lib/isAdmin');
const fs = require('fs');
const path = require('path');

// Load antibadword config
function loadAntibadwordConfig(groupId) {
    try {
        const configPath = path.join(__dirname, '../data/userGroupData.json');
        if (!fs.existsSync(configPath)) {
            return {};
        }
        const data = JSON.parse(fs.readFileSync(configPath));
        return data.antibadword?.[groupId] || {};
    } catch (error) {
        console.error('❌ Error loading antibadword config:', error.message);
        return {};
    }
}

// ---------------------------------------------------------------------------
// Obfuscation-resistant word matching
// ---------------------------------------------------------------------------

const LEET_MAP = {
    a: 'a4@àáâãäåāăą',
    b: 'b8ɓß',
    c: 'cçćĉčč̣',
    d: 'dḍɗđđď',
    e: 'e3€£',
    f: 'f',
    g: 'g9gʻĝģğǧ',
    h: 'hĥḥ',
    i: 'i1!|¡ìíîïīįıị',
    j: 'jǰǰ̣ĵ',
    k: 'kķƙ',
    l: 'l1ĺļľł',
    m: 'm',
    n: 'nn̈ñńņňŉŋɲṅ',
    o: 'o0oʻòóôõöøōŏőọơ',
    p: 'p₽',
    q: 'q',
    r: 'rŕřṛπ',
    s: 's5$ŝśšṣ̌şșṣ§',
    t: 't7țṭťŧ',
    u: 'uùúûüūŭůűųưụ',
    v: 'v',
    w: 'w₩ŵẁẃẅ',
    x: 'x×x̌',
    y: 'y¥ÿýỳŷƴ',
    z: 'z2źżžẓ̌'
};

const SEPARATOR = '[\\s.\\-_*]{0,2}';

function escapeRegexChar(ch) {
    return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function charPattern(ch) {
    const lower = ch.toLowerCase();
    if (LEET_MAP[lower]) {
        return `[${LEET_MAP[lower]}]`;
    }
    return escapeRegexChar(lower);
}

// Build one obfuscation-tolerant regex for a single word or short phrase.
function buildBadWordRegex(word) {
    const chars = word.toLowerCase().split('');
    const pattern = chars.map(charPattern).join(SEPARATOR);
    // Boundary check ensuring words aren't matched within innocent longer terms
    return new RegExp(`(?<![a-z0-9])${pattern}(?![a-z0-9])`, 'i');
}

// Massive, comprehensive list of bad words, non-words, slang & slurs
const BAD_WORDS = [
    // -----------------------------------------------------------------------
    // Native Hindi Script (हिंदी गालियां और अश्लील शब्द)
    // -----------------------------------------------------------------------
    'चूतिया', 'चूतीया', 'मादरचोद', 'भोसड़ीके', 'भोसडीके', 'भोसड़ीवाला', 'बहनचोद',
    'भेंचोद', 'गांडू', 'गांड', 'लंड', 'लौड़ा', 'लौड़े', 'रंडी', 'हरामी', 'हरामजादा',
    'हरामजादे', 'कमीना', 'झांट', 'चूत', 'भोसड़ा', 'टट्टे', 'मुठमार', 'चोदना', 'चोदने',
    'चोदाई', 'चोदू', 'छिनाल', 'रांड', 'गांडफट्टू', 'साला', 'साली', 'हिजड़ा', 'छक्का',
    'चूतमारानी', 'लंडलेवा', 'भोसड़ी', 'चोद',

    // -----------------------------------------------------------------------
    // Native Urdu Script (اردو گالیاں)
    // -----------------------------------------------------------------------
    'چوتیا', 'مادرچود', 'بہنچود', 'بھینچود', 'گانڈو', 'گانڈ', 'لنڈ', 'لوڑا', 'رنڈی',
    'حرامی', 'حرامزادا', 'حرامزادے', 'کمینہ', 'جھانٹ', 'چوت', 'بھوسڑی', 'بھوسڑی کے',
    'تٹے', 'چودنا', 'چودنی', 'چودائی', 'چھنال', 'رانڈ', 'سالا', 'سالی', 'ہیجڑا', 'چھکا',
    'چود',

    // -----------------------------------------------------------------------
    // Non-Words, Short Forms, Abbreviations & Masked Spellings
    // -----------------------------------------------------------------------
    'fk', 'fck', 'fkk', 'fuk', 'fux', 'fkn', 'fkng', 'fukn', 'fukin', 'fckin',
    'fckg', 'fking', 'fckng', 'fucker', 'fckr', 'fukr', 'btch', 'bch', 'biatch',
    'bish', 'stfu', 'wtf', 'gtfo', 'kys', 'ffs', 'fml', 'dik', 'dck', 'dikhead',
    'dckhead', 'dcik', 'cnt', 'psy', 'wnkr', 'twt', 'sh1t', 'sh!t', 'shet', 'sht',
    'a$$', 'a$$hole', 'b!tch', 'b*tch', 'f*ck', 'f**k', 'bc', 'mkc', 'bkc',
    'bsdk', 'bsdka', 'bsdke', 'mf', 'mfer', 'mfers', 'hoe', 'hoes', 'thot', 'thots',

    // -----------------------------------------------------------------------
    // Native Bangla Script (বাংলা গালি ও অশ্লীল শব্দ)
    // -----------------------------------------------------------------------
    'বোকাচোদা', 'বোকাচুদা', 'খানকি', 'খানকির পোলা', 'খানকিরপোলা', 'খানকির পো', 'খানকির ছেলে',
    'মাগি', 'মাগির পোলা', 'মাগিরপোলা', 'মাগির ছেলে', 'চোদা', 'চুদা', 'চুদি', 'চোদার',
    'চুদমারানি', 'চুদনামি', 'বালের', 'বালছাল', 'হোগামারা', 'হোগা', 'গুয়া', 'পুংটা',
    'পুংটামি', 'ধর্ষণ', 'বেশ্যা', 'বেশ্যার পোলা', 'কুত্তা', 'শয়তান', 'জানোয়ার',
    'চোদানির', 'চোদানির পোলা', 'চোদানির পো', 'চুদাচুদি', 'বাল', 'গুদ', 'পুটকি',
    'পুটকি মারা', 'গান্ডু', 'হোগামারানি', 'চুদা খাই', 'চুদা খা', 'ছোটলোক', 'হারামি',
    'চোদাচ্ছিস', 'চোদাচ্ছে', 'হোগার ছাল', 'বালের চুল', 'গুদানি', 'চুদনি', 'মাগিবাজ',
    'খানকি মাগি', 'মাদারচোদ', 'ভোদাই', 'ভোদা', 'লোড়া', 'গোয়ার', 'খাংকির পোলা',
    'পোদ', 'পোদ মারা', 'হোগার পোলা', 'চোদানি',

    // -----------------------------------------------------------------------
    // Bangla Profanity & Vulgarities (Banglish / Romanized Script)
    // -----------------------------------------------------------------------
    'bokachoda', 'boka choda', 'bokachuda', 'khanki', 'khankir pola', 'khankirpola',
    'khankir po', 'khankir chhele', 'khankirchhele', 'magi', 'magir pola', 'magirpola',
    'magir chhele', 'magirchhele', 'chuda', 'chudi', 'chodani', 'chodar', 'chudmarani',
    'chudnami', 'chudachudu', 'baler', 'balchal', 'balchhal', 'balchhol', 'balermatha',
    'baler hair', 'huga', 'hugamara', 'hoga', 'hogamara', 'gudmarani', 'guda', 'gudi',
    'podmarani', 'shauwa', 'saowa', 'shawwa', 'vuda', 'vudai', 'vuni', 'nunu', 'kutta',
    'shoytan', 'janoar', 'dhorshon', 'tipatipi', 'pompom', 'gua', 'pasa', 'marani',
    'bessa', 'bessar pola', 'bessarpola', 'bessar chhele', 'chud', 'chudis', 'chudli',
    'chodne', 'bhaipo', 'podu', 'nodir pola', 'chechra', 'beshya', 'beshyarpola',
    'mugi', 'chudani', 'gandmarani', 'gand', 'gandoo', 'jhant', 'jhanto', 'harambaji',
    'putki', 'putki mara', 'putkimara', 'chodachodi', 'chudakhai', 'chuda kha',
    'chudanir po', 'chudachudis', 'magibaj', 'magibaaj', 'voda', 'vodai', 'loda',
    'ludi', 'podumara', 'pashamara', 'pasa mara', 'baaler', 'baler baal', 'baler matha',
    'baler chhul', 'hogar pola', 'chudni',

    // -----------------------------------------------------------------------
    // Hindi & Urdu Profanity / Slang (Romanized Script)
    // -----------------------------------------------------------------------
    'gandu', 'gaandu', 'gand', 'madarchod', 'mcfuk', 'bhosdike', 'bsdk', 'bhosda',
    'bhosdi', 'bhosadike', 'bhosdiwaala', 'bhosdiwale', 'lauda', 'laude', 'loda',
    'lode', 'laund', 'betichod', 'chutiya', 'chutiye', 'chutiyapa', 'chutiyap',
    'maa ki chut', 'maaki', 'maakichut', 'behenchod', 'behen ki chut', 'bhenchod',
    'bhenchoda', 'tatto ke saudagar', 'machar ki jhant', 'jhant ka baal', 'jhant',
    'randi', 'randiya', 'randibaaz', 'teri ma ki chut', 'teri maa ki', 'lund',
    'lund ke baal', 'lodu', 'benchod', 'chut', 'choot', 'laude ka baal', 'madar',
    'behen ke lode', 'chodne', 'sala kutta', 'harami', 'haramzada', 'haramzade',
    'randi ki aulad', 'gaand mara', 'chodau', 'lund le', 'gandu saala', 'kameena',
    'kaminey', 'chamiya', 'chodne wala', 'chudai', 'chutiye ke baap', 'chinal',
    'raand', 'harambor', 'kanchodi', 'chudakkad', 'gaandfat', 'gaandphad', 'tatte',
    'tatta', 'muth', 'muthi', 'muthmar', 'muthbaaz', 'chutmarani', 'saala', 'saali',
    'kamina', 'jhantu', 'chut ke baal', 'gaand ke andhe', 'madarchhod', 'bhen ke lode',
    'bhen ke takke', 'bhen ki lodi', 'gaandchat', 'chutchat', 'chutchatting',
    'bhonsri', 'bhosri', 'bhosriwala', 'bhosriwale', 'chudwa', 'chudwani', 'chudwana',
    'hijra', 'chakky', 'chakka', 'maderchod', 'maderchot', 'gandfat', 'gaandmasti',
    'bhenchodh', 'bhenchot',

    // -----------------------------------------------------------------------
    // English Profanity, Vulgarities & Compound Insults
    // -----------------------------------------------------------------------
    'fucker', 'idiot', 'nigga', 'fuck', 'fucking', 'fuckin', 'fucked', 'fuckers',
    'dick', 'bitch', 'bitches', 'bitchy', 'bastard', 'bastards', 'asshole', 'assholes',
    'shit', 'shits', 'shitty', 'damn', 'hell', 'piss', 'pissed', 'crap', 'slut',
    'sluts', 'slutty', 'whore', 'whores', 'prick', 'pricks', 'motherfucker',
    'motherfucking', 'motherfuckerz', 'motherfuker', 'cock', 'cocks', 'cunt',
    'cunts', 'pussy', 'pussies', 'twat', 'twats', 'wanker', 'wankers', 'douchebag',
    'jackass', 'moron', 'morons', 'retard', 'retarded', 'scumbag', 'skank', 'arse',
    'arsehole', 'bugger', 'assclown', 'poop', 'dipshit', 'dumbass', 'bullshit',
    'dickhead', 'cocksucker', 'shithead', 'asswipe', 'dumbfuck', 'fuckhead',
    'fuckface', 'jackoff', 'jerkoff',

    // -----------------------------------------------------------------------
    // Slurs & Hateful Terms
    // -----------------------------------------------------------------------
    'spic', 'chink', 'cracker', 'towelhead', 'gook', 'kike', 'paki', 'honky',
    'wetback', 'raghead', 'jungle bunny', 'sand nigger', 'beaner', 'fag', 'faggot',
    'dyke', 'tranny', 'homo', 'sissy', 'fairy', 'lesbo', 'nigger', 'niggas',
    'niggers', 'dih', 'r34', 'rule34',

    // -----------------------------------------------------------------------
    // Sexual Content & Exploitative Language
    // -----------------------------------------------------------------------
    'boobs', 'boobies', 'tits', 'blowjob', 'handjob', 'cum', 'cumshot', 'jizz',
    'deepthroat', 'fap', 'hentai', 'milf', 'anal', 'orgasm', 'dildo', 'vibrator',
    'gangbang', 'threesome', 'porn', 'porno', 'pornography', 'sex', 'xxx', 'nude',
    'nudes', 'naked', 'naked pics', 'send nudes', 'sexting', 'sexy pics', 'penis',
    'vagina', 'boner', 'horny', 'masturbate', 'masturbation', 'jerk off', 'creampie',
    'rape', 'rapist', 'molest', 'incest', 'pedo', 'pedophile', 'nsfw', 'onlyfans link',
    'strip for me',

    // -----------------------------------------------------------------------
    // Harassment, Threats & Self-Harm Bait
    // -----------------------------------------------------------------------
    'kill yourself', 'kys', 'go die', 'you should die', 'i will kill you',
    'i will rape you', 'send your nudes', 'show me your body', 'ill kill you',
    'i will beat you',

    // -----------------------------------------------------------------------
    // Illegal Drugs
    // -----------------------------------------------------------------------
    'weed', 'heroin', 'meth', 'crack', 'cocaine', 'lsd', 'mdma'
];

// Pre-build regexes once at module load.
const BAD_WORD_REGEXES = BAD_WORDS.map(w => ({ word: w, regex: buildBadWordRegex(w) }));

function findBadWordMatch(text) {
    if (!text || typeof text !== 'string') return null;
    for (const { word, regex } of BAD_WORD_REGEXES) {
        if (regex.test(text)) return word;
    }
    return null;
}

async function handleAntiBadwordCommand(sock, chatId, message, match) {
    if (!match) {
        return sock.sendMessage(chatId, {
            text: `*ANTIBADWORD SETUP*\n\n*.antibadword on*\nTurn on antibadword\n\n*.antibadword set <action>*\nSet action: delete/kick/warn\n\n*.antibadword off*\nDisables antibadword in this group`
        }, { quoted: message });
    }

    if (match === 'on') {
        const existingConfig = await getAntiBadword(chatId, 'on');
        if (existingConfig?.enabled) {
            return sock.sendMessage(chatId, { text: '*AntiBadword is already enabled for this group*' });
        }
        await setAntiBadword(chatId, 'on', 'delete');
        return sock.sendMessage(chatId, { text: '*AntiBadword has been enabled. Use .antibadword set <action> to customize action*' }, { quoted: message });
    }

    if (match === 'off') {
        const config = await getAntiBadword(chatId, 'on');
        if (!config?.enabled) {
            return sock.sendMessage(chatId, { text: '*AntiBadword is already disabled for this group*' });
        }
        await removeAntiBadword(chatId);
        return sock.sendMessage(chatId, { text: '*AntiBadword has been disabled for this group*' }, { quoted: message });
    }

    if (match.startsWith('set')) {
        const action = match.split(' ')[1];
        if (!action || !['delete', 'kick', 'warn'].includes(action)) {
            return sock.sendMessage(chatId, { text: '*Invalid action. Choose: delete, kick, or warn*' }, { quoted: message });
        }
        await setAntiBadword(chatId, 'on', action);
        return sock.sendMessage(chatId, { text: `*AntiBadword action set to: ${action}*` }, { quoted: message });
    }

    return sock.sendMessage(chatId, { text: '*Invalid command. Use .antibadword to see usage*' }, { quoted: message });
}

async function handleBadwordDetection(sock, chatId, message, userMessage, senderId) {
    if (!chatId.endsWith('@g.us')) return;
    if (message.key.fromMe) return;

    const antiBadwordConfig = await getAntiBadword(chatId, 'on');
    if (!antiBadwordConfig?.enabled) return;

    const matchedWord = findBadWordMatch(userMessage);
    if (!matchedWord) return;

    console.log(`[antibadword] matched "${matchedWord}" in group ${chatId} from ${senderId}`);

    let isSenderAdmin = false;
    let isBotAdmin = false;
    try {
        const adminStatus = await isAdmin(sock, chatId, senderId);
        isSenderAdmin = adminStatus.isSenderAdmin;
        isBotAdmin = adminStatus.isBotAdmin;
    } catch (err) {
        console.error('[antibadword] Error checking admin status:', err);
        return;
    }

    if (!isBotAdmin) {
        console.log('[antibadword] Bot is not admin in this group, cannot delete message.');
        return;
    }

    if (isSenderAdmin) return;

    try {
        await sock.sendMessage(chatId, { delete: message.key });
    } catch (err) {
        console.error('[antibadword] Error deleting message:', err);
        return;
    }

    await sock.sendMessage(chatId, {
        text: '_*Kelly* intercepted that message_ 🫸'
    });

    switch (antiBadwordConfig.action) {
        case 'delete':
            break;

        case 'kick':
            try {
                await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
                await sock.sendMessage(chatId, {
                    text: `*@${senderId.split('@')[0]} has been kicked for using banned language*`,
                    mentions: [senderId]
                });
            } catch (error) {
                console.error('Error kicking user:', error);
            }
            break;

        case 'warn':
            const warningCount = await incrementWarningCount(chatId, senderId);
            if (warningCount >= 3) {
                try {
                    await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
                    await resetWarningCount(chatId, senderId);
                    await sock.sendMessage(chatId, {
                        text: `*@${senderId.split('@')[0]} has been kicked after 3 warnings*`,
                        mentions: [senderId]
                    });
                } catch (error) {
                    console.error('Error kicking user after warnings:', error);
                }
            } else {
                await sock.sendMessage(chatId, {
                    text: `*@${senderId.split('@')[0]} warning ${warningCount}/3 for using banned language*`,
                    mentions: [senderId]
                });
            }
            break;
    }
}

module.exports = {
    handleAntiBadwordCommand,
    handleBadwordDetection
};

//more updated words 3.1
