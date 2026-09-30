# Two sites, one domain

This project serves both of your websites from a single deployment.

| Address | What it is | Source |
| --- | --- | --- |
| `/` and everything under it | ForexAnalyzer Pro (the public trading site) | `sites/apex-trade-command/`, built into `public/apex/` |
| `/bulkemailsender` | OutreachOS (your private email sender) | `src/routes/bulkemailsender/` |
| `/bulkemailsender-unlock` | Password screen for the private site | `src/routes/bulkemailsender-unlock.tsx` |

## The private site

Nobody reaches `/bulkemailsender` without the password. Visiting it sends you
to the unlock screen; after the correct password the unlock is remembered in a
secure cookie for 30 days. Visitors to the trading site never see it and no
link points to it.

## Running and building

```bash
bun install          # once
bun run dev          # both sites on http://localhost:8080
bun run build        # builds the deployable app
bun run build:apex   # only needed after you change the trading site's source
```

The trading site is pre-built into `public/apex/`, so a normal `bun run build`
is enough unless you edit files inside `sites/apex-trade-command/`.

## Hosting

This needs a host that runs server code (Vercel, Netlify Functions, Cloudflare,
Render, a Node server). A plain static `dist` upload is not enough, because the
private site and its email sending run on the server.

## Settings to add on your host

| Name | Purpose |
| --- | --- |
| `SITE_PASSWORD` | The password for the private site. If unset, the built-in one is used. |
| `SESSION_SECRET` | Any long random string; keeps the unlock cookie secure. |
| `RESEND_API_KEY` | Your Resend key, used to send the emails. |
