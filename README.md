<p align="center">
  <img src="assets/banner.png" alt="KELLY-MD Banner" width="100%">
</p>

<h1 align="center">🌸 KELLY-MD</h1>

<p align="center">
  <b>A powerful WhatsApp Multi-Device Bot built with Baileys</b><br>
  Group management • Media tools • AI • Stickers • Games • Automation
</p>


---

## 🚀 Steps to Deploy Bot

### Step 1: Fork the Repository

Click the button below to fork this repository to your GitHub account:

<p align="center">
  <a href="https://github.com/waifuneko87-prog/KELLY-MD/fork">
    <img src="https://img.shields.io/badge/FORK-REPOSITORY-blue?style=for-the-badge" alt="Fork Repository"/>
  </a>
</p>

> ⚠️ **Important:** Fork the repo first. Without forking, some deploy options may not work properly.

---

### Step 2: Get Pair Code (Session ID)

Connect your WhatsApp account using the pairing website.  
Click the button below to open the **KELLY-MD Pair Site**:

<p align="center">
  <a href="https://YOUR-PAIR-SITE.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/GET%20PAIR%20CODE-Easy%20Method-ff4d4d?style=for-the-badge" alt="Get Pair Code"/>
  </a>
</p>

**How to use the pair site:**

1. Enter your WhatsApp number with country code (example: `917023951514`)
2. Click **Generate Pair Code**
3. On your phone open **WhatsApp → Settings → Linked devices → Link a device**
4. Choose **Link with phone number instead** and enter the code
5. After linking, you will receive a **session string** in your WhatsApp DM  
   (it starts with `KELLY-MD~...`)

**After getting the session:**

- Create a file named `session` in the bot folder and paste the full string  
  **OR**
- Set environment variable `SESSION_ID` with the full string

---

### Step 3: Deploy Now

  <a href="https://bot-hosting.net" target="_blank">
    <img src="https://img.shields.io/badge/DEPLOY%20ON%20PANEL-28a745?style=for-the-badge" alt="Deploy on Panel"/>
  </a>
</p>

#### Deploy on Panel (recommended for beginners)

1. Upload / connect this repository to your panel (Katabump, bot-hosting, etc.)
2. Put your session string in a file named `session` **or** set `SESSION_ID` in environment variables
3. Start command: `npm start`
4. Install command: `npm install`

#### Deploy on Render / Railway / VPS

```bash
git clone https://github.com/YOUR_USERNAME/KELLY-MD.git
cd KELLY-MD
npm install
# put session string in file "session" or set SESSION_ID
npm start
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SESSION_ID` | ✅ Yes* | Full session string from pair site (`KELLY-MD~...`) |
| `OWNER_NUMBER` | Recommended | Your number (country code, no +) |
| `BOT_NAME` | No | Bot display name (default: KELLY-MD) |
| `COMMAND_MODE` | No | `public` or `private` |

\* You can also put the session string in a file named `session` instead of using the env variable.

Copy `.env.example` to `.env` and edit if needed:

```bash
cp .env.example .env
```

---

## 📱 Pair Site (for developers)

Your public pair site:

**https://YOUR-PAIR-SITE.onrender.com**

To run the pair site yourself:

```bash
npm run pair
# opens on http://localhost:3000
```

---

## ✨ Features

- Tag all group members (`.tagall`)
- Admin restricted commands
- Anti-link, anti-badword, anti-delete
- Stickers, media download, TTS
- AI chat & tools
- Games (Tic-Tac-Toe and more)
- Welcome / goodbye messages
- Auto status, auto read, auto typing
- And many more commands

---

## ⚠️ Important Notes

- Do **not** share your session string with anyone
- Only one active connection per session is recommended
- If the bot logs out, generate a **new** session from the pair site
- Use responsibly and follow WhatsApp’s terms

---

## 📞 Support

<p align="center">
  <a href="t.me/sonali_sewvandi" target="_blank">
    <img src="https://img.shields.io/badge/CONTACT%20VIA%20TELEGRAM-2CA5E0?style=for-the-badge&logo=telegram" alt="Telegram"/>
  </a>
  &nbsp;
  <a href="https://wa.me/+966510806516" target="_blank">
    <img src="https://img.shields.io/badge/CONTACT%20VIA20%20WHATSAPP-25D366?style=for-the-badge&logo=whatsapp" alt="WhatsApp"/>
  </a>
</p>

---

## 📜 Credits

- SONALI
- MUAZ

---

<p align="center">
  <b>KELLY-MD</b> — Keep Running! KIRIKO! 🌸
</p>
