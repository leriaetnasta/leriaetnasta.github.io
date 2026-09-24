# Runbook: from local folder to live site with an AI assistant

Everything here, end to end, in the order it has to happen. Each phase ends with a check, so
you know it worked before moving on. Phases 1 to 4 cost nothing. Phase 5 is the only one that
involves money, and it is optional.

| Phase | What you get | Cost | Rough time |
| --- | --- | --- | --- |
| 1 | The site live on the internet | Free | 10 min |
| 2 | The AI assistant answering from your CV | Free | 1 to 2 h |
| 3 | The widget using it, with a fallback | Free | 1 h |
| 4 | Both deploying on every push | Free | 20 min |
| 5 | Your own domain and a working email | ~$12 to $15 a year | 30 min + DNS wait |

---

## Phase 0: decide your address first

This decides what you type in later phases, so choose now.

- **Free:** `https://leriaetnasta.github.io` (if the repo is named `leriaetnasta.github.io`)
  or `https://leriaetnasta.github.io/loubna-portfolio/` (any other repo name).
- **Paid:** `https://loubnatalha.dev`, about $12 to $15 a year.

Neither `loubnatalha.dev` nor `loubnatalha.com` is registered today. **Your contact section
already advertises `hello@loubnatalha.dev`, so that address bounces right now.** Either buy the
domain (phase 5) or change the address in `public/i18n/en.json` and `fr.json` to one that works.

You can start free and add the domain later without redoing anything.

---

## Phase 1: publish the site

**1.1** Create an empty repo at <https://github.com/new>. Public, no README, no .gitignore.
Name it `leriaetnasta.github.io` for the short URL, or `loubna-portfolio`.

**1.2** Point the local repo at it and push. The local commits already exist.

```bash
cd ~/loubna-portfolio
git remote add origin git@github-personal:leriaetnasta/<REPO>.git
git push -u origin main
```

`github-personal` is the SSH alias already configured on this machine for your personal account.

**1.3** In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
This is a one-time switch and the workflow cannot set it for you.

**1.4** Watch the run in the **Actions** tab. It installs, tests, builds and deploys.

**Check:** open your URL. The page loads, English and French both work, and the Selected work
pictures appear. If the text is missing, the base path is wrong: confirm the repo name matches
what you typed.

---

## Phase 2: the AI assistant Worker

**2.1** Register a workers.dev subdomain, once per account:
<https://dash.cloudflare.com> → **Workers & Pages** → onboarding. Pick something clean such as
`leriaetnasta`, because it shows up in the public URL.

**2.2** Configure the Worker. Replace `~/cv-assistant/wrangler.jsonc` with:

```jsonc
{
  "name": "cv-assistant",
  "main": "src/index.ts",
  "compatibility_date": "2026-09-24",
  "observability": { "enabled": true },
  "ai": { "binding": "AI", "remote": true },
  "ratelimits": [
    { "name": "CHAT_LIMITER", "namespace_id": "1001", "simple": { "limit": 20, "period": 60 } }
  ]
}
```

The scaffold leaves `<WORKER_NAME>` and `<COMPATIBILITY_DATE>` as literal placeholders, which
fail on deploy. Windows are limited to 10 or 60 seconds, so the plan's "20 per 10 minutes"
becomes 20 per 60 seconds.

**2.3** Log in and generate types:

```bash
cd ~/cv-assistant
npx wrangler login
npx wrangler types
```

**2.4** Write `src/index.ts` (the four gates, prompt assembly, SSE streaming) and the script that
turns `public/i18n/*.json` into `knowledge.json`. Ask me and I'll write both.

Use `@cf/meta/llama-3.3-70b-instruct-fp8-fast` for better answers, or
`@cf/meta/llama-3.2-3b-instruct` to spend fewer neurons per question. The older
`@cf/meta/llama-3.1-8b-instruct` no longer exists.

**2.5** Run it locally:

```bash
npx wrangler dev
```

Workers AI has no local simulation: it always calls the real API and spends real neurons, even
in dev. While working on routing, CORS and validation, press `l` for local mode, which is free
but makes AI calls fail. Switch back when you want real answers. The rate limiter does simulate
locally, so you can test 429 handling offline.

**2.6** Smoke test, in a second terminal:

```bash
curl -N -X POST http://localhost:8787/api/chat \
  -H 'content-type: application/json' \
  -H 'origin: http://localhost:4200' \
  -d '{"sessionId":"test","locale":"en","messages":[{"role":"user","content":"Can she start in March?"}]}'
```

**Check:** tokens stream back as `data:` lines, and the answer only contains things that are
actually in your CV. Ask it something you never wrote, such as "does she know Kubernetes?", and
it should decline instead of inventing.

**2.7** Deploy:

```bash
npx wrangler deploy     # prints https://cv-assistant.<subdomain>.workers.dev
npx wrangler tail       # live logs, useful on the first real request
```

Repeat the curl against the deployed URL, with `-H 'origin: https://<your site>'`. Then repeat it
with a wrong origin and confirm you get 403.

---

## Phase 3: wire the widget

**3.1** In the portfolio: add a `ChatService` that POSTs and reads the stream, extend
`ChatMessage` with `status` and `sources`, render tokens as they arrive, and fall back to the
existing `matchAnswer()` on any error or a 15-second timeout. Put the Worker URL in
`environment.ts`; it is not a secret.

**3.2** Test locally:

```bash
cd ~/loubna-portfolio
npm start               # http://localhost:4200
```

**Check:** ask a question phrased differently from your keyword list, such as "can she start in
March?". You should get a real answer with source chips. Then stop the Worker and ask again: you
should still get the old keyword answer, marked as an offline answer, with no error and no
spinner stuck on screen.

**3.3** Ship it:

```bash
git add -A && git commit -m "Add streaming CV assistant" && git push
```

---

## Phase 4: deploy the Worker automatically

**4.1** Cloudflare dashboard → **My Profile → API Tokens → Create Token → Edit Cloudflare
Workers** template. Copy the token once; it is shown a single time.

**4.2** GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**,
named `CLOUDFLARE_API_TOKEN`.

**4.3** Add the phase 2 job to `.github/workflows/deploy.yml`: regenerate `knowledge.json`, run
`wrangler deploy`, then smoke test `/api/chat`.

**Check:** edit one line in `public/i18n/en.json`, push, and confirm both the site and the
assistant's knowledge change after the run finishes.

---

## Phase 5 (optional): your own domain

Only needed if you want `loubnatalha.dev` instead of `leriaetnasta.github.io`, or a working
`hello@` address. The domain itself is the only thing you pay for.

**5.1** Buy it. Cloudflare Registrar sells at cost with no markup, which makes it among the
cheapest, and it has no upsells at checkout. Roughly $12 to $15 a year for `.dev`. Any registrar
works; `.dev` always requires HTTPS, which you have anyway.

**5.2** Point it at GitHub Pages. In Cloudflare DNS add a `CNAME` for `www` pointing to
`leriaetnasta.github.io`, and for the bare domain use the A records GitHub documents in
[their Pages DNS guide](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).
Set them to **DNS only** (grey cloud), not proxied, or GitHub cannot issue the certificate.

**5.3** In the repo: **Settings → Pages → Custom domain**, enter the domain, wait for the check
to pass, then tick **Enforce HTTPS**. The certificate can take up to an hour.

**5.4** Make the email work. Cloudflare **Email Routing** is free: add `hello@loubnatalha.dev` as
a rule forwarding to your real inbox, and it adds the MX records for you. Receiving is free;
*replying as* `hello@` needs extra setup in Gmail, so until then reply from your normal address.

**5.5** Update the site: the CORS allowlist in the Worker must include the new origin, and if you
changed the email, update it in `public/i18n/en.json` and `fr.json`.

**Check:** the domain loads over HTTPS, the assistant still answers (allowlist updated), and a
test email to `hello@` arrives in your inbox.

---

## If something breaks

| Symptom | Likely cause |
| --- | --- |
| Page loads but has no text | Wrong base path: repo name and `--base-href` disagree |
| Actions run fails on `ng test` | A real test failure; run `npx ng test --watch=false` locally |
| `wrangler dev` wants a subdomain | Phase 2.1 not done; `l` only works for non-AI parts |
| Deploy fails on placeholders | `<WORKER_NAME>` still in `wrangler.jsonc` |
| Widget always answers offline | Worker URL wrong, or origin not on the allowlist. Check `wrangler tail` |
| 429 immediately | Rate limit is per key; check you aren't keying every visitor to the same value |
| Custom domain stuck on "check in progress" | DNS still propagating, or the record is proxied instead of DNS only |
