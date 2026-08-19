'use strict';

/**
 * KELLY-MD Session Loader
 * Supports:
 *  - SESSION_ID environment variable
 *  - ./session file (or path from SESSION_FILE)
 *  - Already existing multi-file session folder
 *
 * Format expected: KELLY-MD~<base64(creds.json)>
 */

const fs = require('fs');
const path = require('path');

const PREFIX = process.env.SESSION_PREFIX || 'KELLY-MD';

function readSessionString() {
  // 1. Environment variable
  if (process.env.SESSION_ID && process.env.SESSION_ID.trim()) {
    return process.env.SESSION_ID.trim();
  }

  // 2. Dedicated file (default: ./session)
  const filePath = process.env.SESSION_FILE || path.join(process.cwd(), 'session');
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const content = fs.readFileSync(filePath, 'utf8').trim();
    if (content) return content;
  }

  // 3. Also accept session.txt
  const txtPath = path.join(process.cwd(), 'session.txt');
  if (fs.existsSync(txtPath)) {
    const content = fs.readFileSync(txtPath, 'utf8').trim();
    if (content) return content;
  }

  return null;
}

function decodeSessionString(raw) {
  if (!raw) return null;
  let data = raw.trim();

  // Strip optional prefix
  if (data.includes('~')) {
    const parts = data.split('~');
    // Allow any prefix ending with the base64 part
    data = parts.slice(1).join('~');
  }

  try {
    const json = Buffer.from(data, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (e) {
    throw new Error('Invalid SESSION_ID / session file. Make sure you copied the full string from WhatsApp.');
  }
}

/**
 * If a session string is present, write creds.json into the session directory
 * so useMultiFileAuthState can pick it up.
 */
function ensureSessionFromString(sessionDir) {
  const raw = readSessionString();
  if (!raw) return false;

  const creds = decodeSessionString(raw);
  if (!creds || typeof creds !== 'object') {
    throw new Error('Decoded session is empty or invalid.');
  }

  fs.mkdirSync(sessionDir, { recursive: true });
  const credsPath = path.join(sessionDir, 'creds.json');

  // Only write if missing or forced
  if (!fs.existsSync(credsPath) || process.env.FORCE_SESSION_WRITE === 'true') {
    fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2));
    console.log('✅ Session credentials written from SESSION_ID / session file');
  } else {
    console.log('ℹ️  Session folder already has creds.json — using existing files');
  }

  return true;
}

module.exports = {
  readSessionString,
  decodeSessionString,
  ensureSessionFromString,
  PREFIX
};
