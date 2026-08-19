// commands/about.js

async function aboutCommand(sock, chatId, message) {
  try {
    const aboutText = `
╭━━━❮ *KELLY - FREE FIRE* ❯━━━
┃
┃ ✦ *Real Name:* Shimada Kiriko
┃ ✦ *Age:* 17 years
┃ ✦ *Birthday:* 1 April
┃ ✦ *Nationality:* Japanese
┃ ✦ *Occupation:* High School Track Sprinter
┃ ✦ *Ability:* Deadly Velocity (Dash)
┃
╰━━━━━━━━━━━━━━━━━━━━━━

*📖 Her Real Story:*

Kelly (real name *Shimada Kiriko*) had a happy childhood with her adoptive mother *Rena* and stepfather *Andrew* (a police officer).

After her mother and Andrew got divorced, she became very sad, but she still kept in contact with her stepfather.

She was always a talented runner. In high school, her track coach discovered her talent and she became the school’s track star. Running became her identity — no matter the obstacle, she always kept going.

One day she was kidnapped and dropped on the Free Fire island. To protect her real identity, she started using the name *Kelly*.

*🔗 Relationships:*
• Stepfather → Andrew
• Cousin → Hayato
• Close friends → Caroline & Maxim

*💬 Famous Line:*
"Keep Running! KIRIKO!"

*⚡ Ability:*
After sprinting for 4 seconds, her first shot deals extra damage (Deadly Velocity).

Kelly is one of the original characters of Free Fire and the first one to receive an Awakening.

╭────────────────────
│ *Kelly-MD Bot*
│ Keep Running! 🏃‍♀
╰────────────────────`;

    await sock.sendMessage(chatId, { 
      text: aboutText 
    }, { quoted: message });

  } catch (error) {
    console.error('Error in about command:', error);
    await sock.sendMessage(chatId, { 
      text: '❌ Failed to load Kelly info.' 
    }, { quoted: message });
  }
}

module.exports = aboutCommand;
