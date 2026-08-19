const start = document.getElementById('start');
const view = document.getElementById('codeview');
const phone = document.getElementById('phone');
const pair = document.getElementById('pair');
const err = document.getElementById('err');
const code = document.getElementById('code');
const status = document.getElementById('status');
let timer;

code.onclick = async () => {
  if (code.textContent !== '----') {
    try {
      await navigator.clipboard.writeText(code.textContent.replace(/-/g, ''));
      status.textContent = 'Pairing code copied (without dashes).';
    } catch {
      status.textContent = 'Could not copy. Please copy manually.';
    }
  }
};

pair.onclick = async () => {
  err.textContent = '';
  pair.disabled = true;
  pair.textContent = 'Requesting…';
  try {
    const r = await fetch('/api/pair', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone.value })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Unable to create session.');
    start.classList.add('hide');
    view.classList.remove('hide');
    poll(d.sessionId);
  } catch (e) {
    err.textContent = e.message;
    pair.disabled = false;
    pair.textContent = 'Get Pairing Code';
  }
};

async function poll(id) {
  clearInterval(timer);
  const check = async () => {
    try {
      const r = await fetch('/api/status/' + encodeURIComponent(id));
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Session unavailable.');

      if (d.pairingCode) code.textContent = d.pairingCode;

      if (d.status === 'waiting_for_link') {
        status.textContent = 'Enter the code in WhatsApp → Linked devices.';
      } else if (d.status === 'connected') {
        status.textContent = '🟢 Linked! Preparing your session…';
      } else if (d.status === 'session_sent') {
        status.textContent = '✅ Session ID sent to your WhatsApp DM. Check your messages and paste it into the bot.';
        clearInterval(timer);
      } else if (d.status === 'error') {
        status.textContent = '❌ ' + (d.error || 'Connection failed.');
        clearInterval(timer);
      } else {
        status.textContent = '⏳ ' + (d.status || 'Connecting…');
      }
    } catch (e) {
      status.textContent = '❌ ' + e.message;
      clearInterval(timer);
    }
  };
  await check();
  timer = setInterval(check, 2000);
}
