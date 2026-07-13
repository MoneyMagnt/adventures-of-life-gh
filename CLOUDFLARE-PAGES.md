# Cloudflare Pages Deployment Notes

## Deployment model
Keep the existing Git-integrated Cloudflare Pages project, but disable Cloudflare's automatic branch deployments. Production is deployed by the repository's `Site checks` GitHub Actions workflow only after the complete static, security, responsive, and browser suite passes.

In Cloudflare, open the Pages project, go to **Settings > Builds > Branch control**, turn off **Enable automatic production branch deployments**, and set automatic preview branch deployments to **None**. Cloudflare supports Wrangler deployments to an existing Git-integrated Pages project after automatic deployments are paused.

## Current site structure
The public site is generated into `dist/` by `npm run build`. The build script copies only an explicit public allowlist and assets actually referenced by those files. Repository data, tests, scripts, schemas, source photos, and credentials cannot enter `dist/`.

The Pages Functions remain in the root `functions/` directory. Run Wrangler from the repository root so it uploads those Functions alongside the static `dist/` build.

## Cloudflare Pages setup
1. Keep the current Pages project named `adventures-of-life-gh` and production branch `main`.
2. Disable Cloudflare's automatic production and preview branch deployments as described above.
3. In Cloudflare, create a custom API token with **Account > Cloudflare Pages > Edit** permission, scoped to this account.
4. In the GitHub repository, add the token as the Actions secret `CLOUDFLARE_API_TOKEN`.
5. Add the Cloudflare account ID as the Actions secret `CLOUDFLARE_ACCOUNT_ID`.
6. Protect `main` and require the GitHub `Site checks` workflow before merging.
7. The workflow runs `npm ci`, the dependency audit, all tests, and `npm run build`, then runs `wrangler pages deploy dist --project-name=adventures-of-life-gh --branch=main`.
8. Never deploy the repository root as the static output directory. Only `dist/` is public.

## Domain setup for adventuresoflifegh.com
1. Add `adventuresoflifegh.com` as a custom domain in the Pages project.
2. Add `www.adventuresoflifegh.com` as a second custom domain.
3. Because the apex domain is being used, move the domain's nameservers to Cloudflare so the domain becomes a Cloudflare zone.
4. After the custom domains are active, redirect `www` to the apex domain with a Bulk Redirect or Redirect Rule.
5. Redirect the default `*.pages.dev` production URL to `https://adventuresoflifegh.com`.
6. Turn on `Always Use HTTPS` in Cloudflare.

## Media guidance
Do not upload raw camera files to the site.
Use:
- `.webp` or `.jpg` for images
- compressed `.mp4` for short clips
- TikTok or YouTube embeds for longer videos

Keep individual files lean.
Cloudflare Pages currently has a 25 MiB per-file limit for site assets.
If large media becomes part of the stack later, move those files to Cloudflare R2 or Cloudflare Stream.

## English and French copy
- English source pages contain stable `<!--i18n:...-->` message IDs.
- French values live in `data/i18n-fr-stable.json`; generated French pages live under `/fr/`.
- After adding newly translated English body copy, run `npm run i18n:migrate`, review the new French catalog values, then run `npm run sync:fr`.
- `npm run test:static` fails if keyed English copy drifts, a French value is missing, or body copy falls back to fragile full-sentence matching.

## Reviews and inquiries backend
The community reviews form and the homepage trip inquiry form now expect:
- a Cloudflare D1 binding named `DB`
- a Turnstile site key in `TURNSTILE_SITE_KEY`
- a Turnstile secret key in `TURNSTILE_SECRET_KEY`
- an admin username in `ADMIN_USERNAME` (optional; defaults to `zico`)
- a strong admin password in `ADMIN_PASSWORD`
- the public site URL in `PUBLIC_SITE_URL` (`https://adventuresoflifegh.com`)

Setup:
1. Create a D1 database for reviews.
2. Bind that database to the Pages project as `DB`.
3. Create a Turnstile widget for this site.
4. Add `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` to the Pages project environment variables.
5. Generate a unique password of at least 20 characters and add it as `ADMIN_PASSWORD`.
6. Add `ADMIN_USERNAME` and `PUBLIC_SITE_URL`.
7. Deploy the Pages Functions with the rest of the site.
8. Run `npm run test:live` after the production deployment. Do not consider the release complete until it passes.

Notes:
- `functions/api/reviews.js`, `functions/api/inquiries.js`, and the shared security helper will create their tables automatically if they do not exist yet.
- `reviews-d1-schema.sql` contains the same review, inquiry, invite, and rate-limit schema if you want to inspect or initialize it manually.
- Reviews are no longer open-post by default. Live review publishing now requires a verified review link with a one-time token.
- Visit `/admin/` after deployment to manage inquiries, publish or unpublish reviews, revoke links, and generate up to 100 one-time attendee review links without writing SQL.
- The helper script `scripts/generate-review-invites.js` remains available as an offline recovery option.

## Submission notifications
The backend can send every new inquiry, published review, and generated invite batch to an HTTPS automation webhook.

Optional environment variables:
- `NOTIFICATION_WEBHOOK_URL`: an HTTPS endpoint in Make, Zapier, n8n, Slack automation, or another service you control
- `NOTIFICATION_WEBHOOK_SECRET`: a random secret of at least 32 characters used to sign the raw JSON body in `X-Adventures-Signature`

The backend refuses to send webhook data unless the signing secret is present and at least 32 characters long. The receiver should verify the `sha256=` HMAC signature before acting on a notification. Review-invite events contain private attendee links, so do not use an untrusted webhook endpoint.

## Admin security
- `/admin/` and `/api/admin/*` are protected by HTTP Basic authentication at the Pages Function layer.
- The password is read only from the Cloudflare environment and is never placed in the browser bundle or repository.
- Failed authentication is rate-limited by IP through D1.
- Keep Cloudflare's managed WAF rules enabled and add a Cloudflare Access policy in front of `/admin/*` for a second identity layer when available.
- Do not add a global `Access-Control-Allow-Origin: *` rule to API responses. The form APIs are same-origin only.
- Rotate `ADMIN_PASSWORD`, Turnstile secrets, API tokens, and webhook secrets immediately if any credential is ever copied into a log or committed.

Without the `DB` binding:
- the local preview can still show submitted reviews in browser storage
- the live site will not be able to store shared reviews or trip inquiries

Without the Turnstile keys:
- the live forms will stay locked and show a protection/configuration error
- the local preview will still work for testing

## Files added for hosting
- `_headers`: browser caching and security headers
- `_redirects`: homepage canonical redirect from `/index.html` to `/`
- `robots.txt`: crawler guidance
- `sitemap.xml`: launch sitemap
- `404.html`: fallback page for missing routes

## Launch checklist
- Run `npm ci`, `npm audit --audit-level=moderate`, and `npm run test:all` locally.
- Confirm `npm run build` produces only the allowlisted `dist/` output.
- Disable Cloudflare automatic branch deployments so an unverified push cannot bypass GitHub Actions.
- Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to GitHub Actions secrets.
- Confirm the D1 `DB` binding exists in both Preview and Production.
- Add production Turnstile keys, a strong admin password, and `PUBLIC_SITE_URL`.
- Protect `/admin/*` with Cloudflare Access in addition to the application password.
- Deploy only from a green `main` branch.
- Run `npm run test:live` and require every check to pass.
- Submit the sitemap in Google Search Console after the live gate passes.
