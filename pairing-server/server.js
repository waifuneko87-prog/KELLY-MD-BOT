'use strict';

/**
 * KELLY-MD Pairing Website
 * UI inspired by Knight Bot Pair Code
 * - Pair Code + QR Code
 * - After link → session string sent to user's WhatsApp DM
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const pino = require('pino');
const QRCode = require('qrcode');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  delay,
  Browsers
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');

const app = express();
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PAIRING_PORT || process.env.PORT || 3000);
const HOST = process.env.PAIRING_HOST || '0.0.0.0';
const TEMP_DIR = path.join(ROOT, process.env.PAIRING_SESSIONS_DIR || 'temp_sessions');
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_ACTIVE = Number(process.env.MAX_ACTIVE_SESSIONS || 25);
const RATE_WINDOW = Number(process.env.PAIRING_RATE_WINDOW_MS || 600000);
const RATE_LIMIT = Number(process.env.PAIRING_RATE_LIMIT || 8);
const PENDING_TTL = Number(process.env.PAIRING_PENDING_TTL_MS || 600000);
const SESSION_PREFIX = process.env.SESSION_PREFIX || 'KELLY-MD';

fs.mkdirSync(TEMP_DIR, { recursive: true });

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));
app.use(express.static(PUBLIC_DIR));

const sessions = new Map();
const rates = new Map();

const now = () => Date.now();
const clientIp = (req) =>
  String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown')
    .split(',')[0].trim();

function validNumber(v) {
  const raw = String(v || '').replace(/[^0-9+]/g, '');
  if (!raw) return null;
  const p = parsePhoneNumberFromString(raw.startsWith('+') ? raw : `+${raw}`);
  return p && p.isValid() ? p.number.replace('+', '') : null;
}

function rateOK(req) {
  const k = clientIp(req);
  const e = rates.get(k) || { t: now(), n: 0 };
  if (now() - e.t > RATE_WINDOW) { e.t = now(); e.n = 0; }
  e.n++;
  rates.set(k, e);
  return e.n <= RATE_LIMIT;
}

function makeId() {
  return crypto.randomBytes(12).toString('hex');
}

function buildSessionString(authDir) {
  const credsPath = path.join(authDir, 'creds.json');
  if (!fs.existsSync(credsPath)) throw new Error('creds.json not found');
  const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
  return `${SESSION_PREFIX}~${Buffer.from(JSON.stringify(creds)).toString('base64')}`;
}

function cleanupSession(session, force = false) {
  try {
    if (session.sock) {
      try { session.sock.end(undefined); } catch {}
      session.sock = null;
    }
  } catch {}
  if (force || ['session_sent', 'error', 'logged_out'].includes(session.status)) {
    setTimeout(() => {
      try { fs.rmSync(session.dir, { recursive: true, force: true }); } catch {}
      sessions.delete(session.id);
    }, force ? 2500 : 25000);
  }
}

async function startPairing(session) {
  const { state, saveCreds } = await useMultiFileAuthState(session.dir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.ubuntu('Chrome'),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
    },
    markOnlineOnConnect: false,
    syncFullHistory: false,
    generateHighQualityLinkPreview: false
  });

  session.sock = sock;
  sock.ev.on('creds.update', saveCreds);

  // Pairing code path
  if (session.mode === 'pair' && !sock.authState.creds.registered) {
    try {
      await delay(2000);
      const code = await sock.requestPairingCode(session.phone);
      session.pairingCode = code?.match(/.{1,4}/g)?.join('-') || code;
      session.status = 'waiting_for_link';
      console.log(`[${session.id}] Pair code ${session.phone}: ${session.pairingCode}`);
    } catch (err) {
      session.status = 'error';
      session.error = err.message || 'Failed to request pairing code';
      console.error(`[${session.id}] pair error:`, err.message);
      cleanupSession(session);
      return;
    }
  }

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // QR mode
    if (qr && session.mode === 'qr') {
      try {
        session.qr = await QRCode.toDataURL(qr, { width: 280, margin: 2 });
        session.status = 'waiting_for_link';
      } catch (e) {
        console.error('QR render error', e.message);
      }
    }

    if (connection === 'open') {
      session.status = 'connected';
      session.connectedAt = new Date().toISOString();
      console.log(`[${session.id}] Linked OK`);

      try {
        await delay(2000);
        await saveCreds();
        const sessionString = buildSessionString(session.dir);
        const jid = sock.user.id;

        await sock.sendMessage(jid, { text: sessionString });
        await sock.sendMessage(jid, {
          text:
            `✅ *KELLY-MD Session Generated!*\n\n` +
            `1. Copy the message *above* (starts with \`${SESSION_PREFIX}~\`)\n` +
            `2. Create a file named \`session\` in your bot folder\n` +
            `   (or set SESSION_ID in environment)\n` +
            `3. Paste the full string and save\n` +
            `4. Run: \`npm start\`\n\n` +
            `⚠️ Do not share this session with anyone.`
        });

        session.status = 'session_sent';
        console.log(`[${session.id}] Session sent to DM`);
      } catch (err) {
        console.error(`[${session.id}] send session failed:`, err.message);
        session.status = 'error';
        session.error = 'Connected but failed to send session';
      }
      setTimeout(() => cleanupSession(session, true), 10000);
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error instanceof Boom
        ? lastDisconnect.error.output?.statusCode
        : lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut || code === 401) {
        session.status = 'logged_out';
      } else if (!['session_sent', 'connected'].includes(session.status)) {
        session.status = 'error';
        session.error = lastDisconnect?.error?.message || 'Connection closed';
      }
      cleanupSession(session);
    }
  });
}

function publicStatus(s) {
  return {
    id: s.id,
    status: s.status,
    pairingCode: s.status === 'waiting_for_link' ? (s.pairingCode || null) : null,
    qr: s.status === 'waiting_for_link' ? (s.qr || null) : null,
    connectedAt: s.connectedAt || null,
    error: s.error || null
  };
}

app.get('/api/health', (req, res) => {
  const active = [...sessions.values()].filter(
    s => !['session_sent', 'error', 'logged_out'].includes(s.status)
  ).length;
  res.json({ ok: true, service: 'KELLY-MD Pairing', activeSessions: active, prefix: SESSION_PREFIX });
});

app.post('/api/pair', async (req, res) => {
  if (!rateOK(req)) {
    return res.status(429).json({ error: 'Too many requests. Try again later.' });
  }
  const active = [...sessions.values()].filter(
    s => !['session_sent', 'error', 'logged_out'].includes(s.status)
  ).length;
  if (active >= MAX_ACTIVE) {
    return res.status(503).json({ error: 'Service is full. Try again later.' });
  }

  const mode = (req.body?.mode === 'qr') ? 'qr' : 'pair';
  let phone = null;

  if (mode === 'pair') {
    phone = validNumber(req.body?.phone);
    if (!phone) {
      return res.status(400).json({
        error: 'Enter a valid WhatsApp number with country code (e.g. +917023951514 or 917023951514).'
      });
    }
    const dup = [...sessions.values()].find(
      s => s.phone === phone && !['session_sent', 'error', 'logged_out'].includes(s.status)
    );
    if (dup) {
      return res.status(409).json({ error: 'This number already has an active pairing.', sessionId: dup.id });
    }
  }

  const id = makeId();
  const dir = path.join(TEMP_DIR, id);
  fs.mkdirSync(dir, { recursive: true });

  const session = {
    id, phone, dir, mode,
    createdAt: now(),
    status: 'starting',
    pairingCode: null,
    qr: null,
    connectedAt: null,
    error: null,
    sock: null
  };
  sessions.set(id, session);

  startPairing(session).catch(err => {
    console.error(`[${id}] fatal:`, err);
    session.status = 'error';
    session.error = err.message || 'Internal error';
    cleanupSession(session);
  });

  res.json({ sessionId: id, status: session.status });
});

app.get('/api/status/:id', (req, res) => {
  const s = sessions.get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Session not found or finished.' });
  res.json(publicStatus(s));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`🌸 KELLY-MD Pairing → http://${HOST}:${PORT}`);
  console.log(`   Session prefix: ${SESSION_PREFIX}`);
});

setInterval(() => {
  const cut = now() - PENDING_TTL;
  for (const [id, s] of sessions) {
    if (['session_sent', 'connected'].includes(s.status)) continue;
    if (s.createdAt < cut) {
      console.log(`[${id}] TTL cleanup`);
      cleanupSession(s, true);
    }
  }
  for (const [k, e] of rates) {
    if (now() - e.t > RATE_WINDOW) rates.delete(k);
  }
}, 60000);
