const axios = require('axios');

module.exports = async function (sock, chatId, message, city) {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;

if (!apiKey) {
    return await sock.sendMessage(
        chatId,
        {
            text: '❌ OPENWEATHER_API_KEY is missing from .env.'
        },
        { quoted: message }
    );
}
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const weather = response.data;
        const weatherText = `Weather in ${weather.name}: ${weather.weather[0].description}. Temperature: ${weather.main.temp}°C.`;
        await sock.sendMessage(chatId, { text: weatherText }, { quoted: message }   );
    } catch (error) {
        console.error('Error fetching weather:', error);
        await sock.sendMessage(chatId, { text: 'Sorry, I could not fetch the weather right now.' }, { quoted: message } );
    }
};
