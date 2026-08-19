# KELLY-MD Pairing Website

This is the web pairing service for KELLY-MD.

## What it does

1. User enters WhatsApp number
2. Server requests an 8-digit pairing code via Baileys
3. User enters the code in WhatsApp → Linked Devices
4. After successful link, the server builds a session string and **sends it to the user’s WhatsApp DM**
5. User copies the session string into the bot (`session` file or `SESSION_ID` env) and starts the bot

The pairing process is temporary — the socket is closed after the session is delivered.

## Run

```bash
# from bot root
npm run pair
# or
node pairing-server/server.js
```

Open `http://localhost:3000` (or your public URL).

## Environment

See root `.env.example` for `PAIRING_*` and `SESSION_PREFIX` variables.
