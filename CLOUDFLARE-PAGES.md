# Cloudflare Pages Deployment Notes

## Recommended project type
Use Cloudflare Pages with Git integration, not Direct Upload.
This project will keep changing, and Git integration gives you automatic redeploys whenever you push updates.

Note:
Cloudflare's current docs say you cannot switch a Direct Upload project to Git integration later, and you also cannot switch a Git-integrated project to Direct Upload later.

## Current site structure
This is a static site.
There is no build step.
The repository root is the site output directory because `index.html` lives at the top level.

## Cloudflare Pages setup
1. Create a new Pages project.
2. Choose `Import an existing Git repository`.
3. Select this repository.
4. Set the production branch to `main`.
5. Leave the build command blank because this project does not need a framework build step.
6. Set the build output directory to the repository root, which is the folder containing `index.html`.
7. Leave the root directory advanced setting empty unless you later move the site into a subfolder.

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

## Files added for hosting
- `_headers`: browser caching and security headers
- `_redirects`: homepage canonical redirect from `/index.html` to `/`
- `robots.txt`: crawler guidance
- `sitemap.xml`: launch sitemap
- `404.html`: fallback page for missing routes

## Launch checklist
- Replace the placeholder WhatsApp number in `script.js`
- Add a real favicon and social preview image
- Replace avatar placeholders with exported trip photos and short clips
- Connect analytics and Search Console
- Test home, journeys, community, about, and 404 on mobile and desktop
