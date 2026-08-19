const fetch = require('node-fetch');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-flash-latest';

const conversations = new Map();

const MAX_HISTORY = 12;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `
You are KELLY, the casual friend inside a WhatsApp bot called KELLY-MD.

Your personality:
- You are funny, playful, warm and natural.
- Talk like a real friend, not like a customer-support bot.
- You can tease the user lightly and joke around.
- Use emojis naturally, but don't overuse them.
- Keep normal replies fairly short.
- Don't give huge explanations unless the user asks.
- React naturally to casual/random messages.
- You can be dramatic or sarcastic in a playful way.
- If the user is sad, upset, lonely or discussing something serious, become caring and supportive instead of making jokes.
- Don't constantly mention that you are an AI.
- Don't repeatedly introduce yourself.
- Don't say "How may I assist you?" unless it genuinely fits.
- Remember details from the conversation history provided to you.
- This is primarily casual conversation and entertainment.

You are KELLY-MD's friendly chat personality.
`;

function getConversationKey(chatId) {
    return chatId;
}

function getHistory(chatId) {
    const key = getConversationKey(chatId);

    if (!conversations.has(key)) {
        conversations.set(key, []);
    }

    return conversations.get(key);
}

function trimHistory(history) {
    while (history.length > MAX_HISTORY) {
        history.shift();
    }
}

function clearConversation(chatId) {
    conversations.delete(getConversationKey(chatId));
}

async function chatCommand(sock, chatId, message, args) {
    try {
        const query = String(args || '').trim();

        if (!query) {
            return await sock.sendMessage(
                chatId,
                {
                    text:
`💬 *KELLY CHAT*

Talk to me like a friend 😂

Example:
.chat hey Kelly
.chat I'm bored
.chat what are you doing?
.chat tell me something funny

Use:
.chatclear

to forget our current conversation.`
                },
                { quoted: message }
            );
        }

        if (!GEMINI_API_KEY) {
            return await sock.sendMessage(
                chatId,
                {
                    text:
`❌ Gemini API is not configured.

Please add:

GEMINI_API_KEY=your_key

to the .env file.`
                },
                { quoted: message }
            );
        }

        if (query.length > MAX_MESSAGE_LENGTH) {
            return await sock.sendMessage(
                chatId,
                {
                    text: `❌ Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`
                },
                { quoted: message }
            );
        }

        const history = getHistory(chatId);

        history.push({
            role: 'user',
            parts: [{ text: query }]
        });

        trimHistory(history);

        await sock.sendMessage(
            chatId,
            {
                react: {
                    text: '💭',
                    key: message.key
                }
            }
        );

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': GEMINI_API_KEY
                },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [
                            {
                                text: SYSTEM_PROMPT
                            }
                        ]
                    },
                    contents: history,
                    generationConfig: {
                        temperature: 1.0,
                        maxOutputTokens: 300
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini Chat API:', data);

            history.pop();

            throw new Error(
                data?.error?.message ||
                `Gemini API returned ${response.status}`
            );
        }

        const answer =
            data.candidates?.[0]?.content?.parts
                ?.map(part => part.text || '')
                .join('')
                .trim();

        if (!answer) {
            history.pop();

            throw new Error('Gemini returned an empty response.');
        }

        history.push({
            role: 'model',
            parts: [{ text: answer }]
        });

        trimHistory(history);

        await sock.sendMessage(
            chatId,
            {
                text: answer
            },
            { quoted: message }
        );

    } catch (error) {
        console.error('❌ Chat command error:', error);

        await sock.sendMessage(
            chatId,
            {
                text:
`🥲 My brain just tripped over itself.

Try again in a moment.`
            },
            { quoted: message }
        );
    }
}

chatCommand.clearConversation = clearConversation;

module.exports = chatCommand;
