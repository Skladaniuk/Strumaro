// Receives the lead form POST and forwards it to a Telegram chat.
// Env vars (Vercel → Project Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

const esc = s => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const clip = (s, n) => String(s ?? '').trim().slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return res.status(500).json({ ok: false, error: 'not configured' });

  // Vercel parses JSON bodies automatically; fall back for raw strings.
  let d = req.body;
  if (typeof d === 'string') { try { d = JSON.parse(d); } catch { d = null; } }
  if (!d || typeof d !== 'object') return res.status(400).json({ ok: false });

  const name = clip(d.name, 100);
  const phone = clip(d.phone, 30);
  if (!name || phone.replace(/\D/g, '').length < 9) return res.status(400).json({ ok: false, error: 'invalid' });

  const lines = [
    '🔌 <b>Нова заявка STRUMARO</b>',
    `<b>Ім’я:</b> ${esc(name)}`,
    `<b>Телефон:</b> ${esc(phone)}`,
    `<b>Модель:</b> ${esc(clip(d.model, 100))}`
  ];
  const msg = clip(d.msg, 1000);
  if (msg) lines.push(`<b>Коментар:</b> ${esc(msg)}`);
  const page = clip(d.page, 200);
  if (page) lines.push(`<b>Сторінка:</b> ${esc(page)}`);

  const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'HTML', disable_web_page_preview: true })
  });
  if (!tg.ok) return res.status(502).json({ ok: false });
  return res.status(200).json({ ok: true });
};
