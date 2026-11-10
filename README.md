# STRUMARO landing

- `public/` — static site (`index.html`, `support.js`, `assets/`)
- `api/lead.js` — Vercel function, sends form leads to Telegram
- `vercel.json` — output dir + asset caching

## Telegram
1. @BotFather → `/newbot` → copy the token.
2. Write any message to the bot (or add it to a group and write there).
3. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` → `chat.id` (groups are negative).

## Deploy (Vercel)
1. Push this folder to git → Vercel → Add New Project → import. Framework preset: Other. No build command.
2. Project Settings → Environment Variables: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (Production).
3. Redeploy (env vars apply only to new deployments).

CLI alternative: `npx vercel --prod`, then add the env vars and redeploy.

Test: `curl -X POST https://<site>/api/lead -H 'Content-Type: application/json' -d '{"name":"Тест","phone":"+380672605609"}'`
