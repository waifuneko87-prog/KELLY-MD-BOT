const chatCommand = require('./chat');

module.exports = async (sock, chatId, message) => {
    try {
        chatCommand.clearConversation(chatId);

        await sock.sendMessage(
            chatId,
            {
                text:
`🧹 *CONVERSATION CLEARED*

Okay, fresh start 😂

What are we talking about now?`
            },
            { quoted: message }
        );

    } catch (error) {
        console.error('Chat clear error:', error);

        await sock.sendMessage(
            chatId,
            {
                text: '❌ Failed to clear the conversation.'
            },
            { quoted: message }
        );
    }
};
