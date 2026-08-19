'use strict';

/**
 * KELLY-MD Pairing Website
 * Pair Code + QR → session string DM'd to user
 * Hardened against "Stream Errored (restart required)"
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
const MAX_ACTIVE = Number(process.env.MAX_ACTIVE_SESSIONS || 20);
const RATE_WINDOW = Number(process.env.PAIRING_RATE_WINDOW_MS || 600000);
const RATE_LIMIT = Number(process.env.PAIRING_RATE_LIMIT || 8);
const PENDING_TTL = Number(process.env.PAIRING_PENDING_TTL_MS || 600000);
const SESSION_PREFIX = process.env.SESSION_PREFIX || 'KELLY-MD';
const MAX_RETRIES = 3;

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

function clearAuthDir(dir) {
  try {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir)) {
      try { fs.unlinkSync(path.join(dir, f)); } catch {}
    }
  } catch {}
}

function cleanupSession(session, force = false) {
  try {
    if (session.sock) {
      try { session.sock.ev.removeAllListeners(); } catch {}
      try { session.sock.end(undefined); } catch {}
      try { session.sock.ws?.close(); } catch {}
      session.sock = null;
    }
  } catch {}
  if (force || ['session_sent', 'error', 'logged_out'].includes(session.status)) {
    setTimeout(() => {
      try { fs.rmSync(session.dir, { recursive: true, force: true }); } catch {}
      sessions.delete(session.id);
    }, force ? 3000 : 30000);
  }
}

function isRestartError(err) {
  const msg = String(err?.message || err || '').toLowerCase();
  const code = err?.output?.statusCode || err?.statusCode;
  return (
    code === 515 ||
    code === DisconnectReason.restartRequired ||
    msg.includes('stream errored') ||
    msg.includes('restart required') ||
    msg.includes('connection closed') ||
    msg.includes('timed out') ||
    msg.includes('statuscode: 515')
  );
}

async function startPairing(session) {
  if (session._stopped) return;

  session.retries = session.retries || 0;

  // Fresh auth folder on retry (avoid corrupted partial state)
  if (session.retries > 0) {
    clearAuthDir(session.dir);
  }

  const { state, saveCreds } = await useMultiFileAuthState(session.dir);
  let version;
  try {
    ({ version } = await fetchLatestBaileysVersion());
  } catch {
    version = [2, 3000, 1025190524];
  }

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.ubuntu('Chrome'),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    markOnlineOnConnect: false,
    syncFullHistory: false,
    generateHighQualityLinkPreview: false,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 10000,
    retryRequestDelayMs: 500,
    emitOwnEvents: false,
    fireInitQueries: false,
    getMessage: async () => undefined
  });

  session.sock = sock;
  sock.ev.on('creds.update', saveCreds);

  // Request pairing code
  if (session.mode === 'pair' && !sock.authState.creds.registered) {
    try {
      await delay(2500);
      if (session._stopped) return;
      const code = await sock.requestPairingCode(session.phone);
      session.pairingCode = code?.match(/.{1,4}/g)?.join('-') || code;
      session.status = 'waiting_for_link';
      session.error = null;
      console.log(`[${session.id}] Pair code for ${session.phone}: ${session.pairingCode}`);
    } catch (err) {
      console.error(`[${session.id}] pair code error:`, err.message);
      if (session.retries < MAX_RETRIES && isRestartError(err)) {
        session.retries += 1;
        session.status = 'starting';
        session.error = null;
        console.log(`[${session.id}] Retrying pair code (${session.retries}/${MAX_RETRIES})...`);
        try { sock.end(undefined); } catch {}
        await delay(2000);
        return startPairing(session);
      }
      session.status = 'error';
      session.error = err.message || 'Failed to get pairing code. Try again.';
      cleanupSession(session);
      return;
    }
  }

  sock.ev.on('connection.update', async (update) => {
    if (session._stopped) return;
    const { connection, lastDisconnect, qr } = update;

    if (qr && session.mode === 'qr') {
      try {
        session.qr = await QRCode.toDataURL(qr, { width: 280, margin: 2 });
        session.status = 'waiting_for_link';
        session.error = null;
      } catch (e) {
        console.error('QR render error', e.message);
      }
    }

    if (connection === 'open') {
      session.status = 'connected';
      session.connectedAt = new Date().toISOString();
      session.error = null;
      console.log(`[${session.id}] Linked OK`);

      try {
        await delay(2500);
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
        session.error = 'Linked, but failed to send session. Try again.';
      }
      setTimeout(() => cleanupSession(session, true), 12000);
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error instanceof Boom
        ? lastDisconnect.error.output?.statusCode
        : lastDisconnect?.error?.output?.statusCode;
      const errMsg = lastDisconnect?.error?.message || 'Connection closed';

      console.log(`[${session.id}] Connection closed:`, statusCode, errMsg);

      // Already finished successfully
      if (['session_sent', 'connected'].includes(session.status)) {
        cleanupSession(session);
        return;
      }

      // Logged out
      if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
        session.status = 'logged_out';
        session.error = 'Logged out. Start pairing again.';
        cleanupSession(session, true);
        return;
      }

      // Stream error / restart required → auto retry
      if (session.retries < MAX_RETRIES && isRestartError(lastDisconnect?.error || errMsg)) {
        session.retries += 1;
        session.status = 'starting';
        session.error = null;
        session.pairingCode = null;
        session.qr = null;
        console.log(`[${session.id}] Stream error — restarting (${session.retries}/${MAX_RETRIES})...`);
        try {
          sock.ev.removeAllListeners();
          sock.end(undefined);
        } catch {}
        session.sock = null;
        await delay(3000);
        return startPairing(session);
      }

      session.status = 'error';
      session.error = 'Stream Errored (restart required). Tap Generate again.';
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
        error: 'Enter a valid WhatsApp number with country code (e.g. 917023951514).'
      });
    }
    const dup = [...sessions.values()].find(
      s => s.phone === phone && !['session_sent', 'error', 'logged_out'].includes(s.status)
    );
    if (dup) {
      // kill old attempt so user can retry cleanly
      dup._stopped = true;
      cleanupSession(dup, true);
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
    sock: null,
    retries: 0,
    _stopped: false
  };
  sessions.set(id, session);

  startPairing(session).catch(err => {
    console.error(`[${id}] fatal:`, err);
    session.status = 'error';
    session.error = err.message || 'Internal error. Try again.';
    cleanupSession(session);
  });

  res.json({ sessionId: id, status: session.status });
});

app.get('/api/status/:id', (req, res) => {
  const s = sessions.get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Session not found or finished. Generate again.' });
  res.json(publicStatus(s));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`🌸 KELLY-MD Pairing → http://${HOST}:${PORT}`);
  console.log(`   Session prefix: ${SESSION_PREFIX}`);
});

// Ignore noisy stream errors so the process stays up
process.on('uncaughtException', (err) => {
  const e = String(err);
  if (
    e.includes('Stream Errored') ||
    e.includes('restart required') ||
    e.includes('Connection Closed') ||
    e.includes('Timed Out') ||
    e.includes('statusCode: 515') ||
    e.includes('not-authorized') ||
    e.includes('rate-overlimit')
  ) return;
  console.error('uncaughtException:', err);
});

process.on('unhandledRejection', (err) => {
  const e = String(err);
  if (
    e.includes('Stream Errored') ||
    e.includes('restart required') ||
    e.includes('Connection Closed')
  ) return;
  console.error('unhandledRejection:', err);
});

setInterval(() => {
  const cut = now() - PENDING_TTL;
  for (const [id, s] of sessions) {
    if (['session_sent', 'connected'].includes(s.status)) continue;
    if (s.createdAt < cut) {
      console.log(`[${id}] TTL cleanup`);
      s._stopped = true;
      cleanupSession(s, true);
    }
  }
  for (const [k, e] of rates) {
    if (now() - e.t > RATE_WINDOW) rates.delete(k);
  }
}, 60000);
