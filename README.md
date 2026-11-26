# WejhaJo

Wejha’s official company website, rebuilt from the approved portfolio HTML. It includes ten project pages, six interactive product experiences, and a server-side inquiry form.

## Local setup

Use Node.js 24 and npm. Git is needed for publishing. Dependencies are pinned in `package-lock.json`.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [localhost:3000](http://localhost:3000). Portfolio demos work with no credentials. An unconfigured contact endpoint gives a clear temporary-unavailable response. Use sample contact details for local form testing.

## Environment variables

| Variable                   | Value                                                                                                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | The primary HTTPS origin of the production site, with no path. It controls canonical links, social metadata, the sitemap and production indexing. Leave blank for local work. |
| `CONTACT_RECIPIENT_EMAIL`  | Set to Wejha’s approved inquiry inbox.                                                                                                                                        |
| `CONTACT_FROM_EMAIL`       | A From address on the domain or subdomain verified in Resend. Use only the bare email address.                                                                                |
| `RESEND_API_KEY`           | A server-only Resend sending key for the verified domain.                                                                                                                     |
| `UPSTASH_REDIS_REST_URL`   | HTTPS REST URL of the Upstash Redis database used for rate limiting.                                                                                                          |
| `UPSTASH_REDIS_REST_TOKEN` | A server-only Upstash REST token with write access.                                                                                                                           |
| `CONTACT_HASH_SECRET`      | Generate a random 32-byte secret with `openssl rand -hex 32`. Keep it stable across instances and deployments.                                                                |

Store credentials in `.env.local` for local use and in Vercel environment settings for deployed environments. Use separate credentials and an approved test mailbox if enabling the contact endpoint on previews. Requests are limited to five per visitor per 15 minutes and 80 per hour per environment. Off Vercel, the per-visitor rule uses a shared bucket since the app has no trusted ingress header there.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run format:check
npm run build
npx playwright install chromium webkit
npm run test:e2e
```

The Playwright suite starts the production server on port 3100. Run it with the contact credentials unset to exercise the missing-configuration path. It tests all filters and project routes, navigation, the live portfolio interfaces, responsiveness at 375/768/1024/1440/1920px, axe accessibility and form behavior. Vitest tests provider acceptance, validation, idempotency and failure handling with test doubles. GitHub Actions runs these checks on pushes and pull requests. To preview the production build manually, use `npm run start`.

## Publish on GitHub and Vercel

1. Review the [Privacy Policy](src/app/privacy/page.tsx) and [Terms of Use](src/app/terms/page.tsx) with Wejha’s legal or privacy owner. Confirm retention periods, rights handling, processor terms and cross-border processing, and update the copy where needed. Confirm the canonical domain and the inquiry inbox.
2. In Resend, add the selected sending domain or subdomain. Add the DNS records Resend shows and wait for verification, then issue a sending key. Obtain an Upstash Redis REST endpoint and token. Keep all credentials out of source control. [Resend domain setup](https://resend.com/docs/dashboard/domains/introduction) · [Upstash setup](https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted)
3. Create an empty GitHub repository. Run the following commands from this application folder, after reviewing the files that will be staged. If working from a copy without Git metadata, run `git init -b main` first.

   ```bash
   git status --short
   git add .
   git diff --cached --stat
   git commit -m "Build Wejha company website"
   git remote add origin <approved-github-repository-url>
   git push -u origin main
   ```

4. Import the repository in Vercel as a Next.js project with the repository root, Node.js 24 and `main` as the production branch. Set the variables above in the **Production** environment. Deploy from the approved commit. Preview builds are marked for exclusion from search. [Vercel Git deployment](https://vercel.com/docs/git)
5. Add the approved domain in **Vercel → Project → Settings → Domains**. At the authoritative DNS provider, add the exact records Vercel displays and complete any TXT ownership verification. Preserve existing mail records. Redirect the alternate apex or `www` hostname to the primary one. Wait for DNS and the managed TLS certificate, confirm HTTP redirects to HTTPS, then redeploy if the canonical origin changed. [Vercel custom domain setup](https://vercel.com/docs/domains/set-up-custom-domain)
6. On the HTTPS domain, check `/robots.txt`, `/sitemap.xml`, a project detail and sharing image. Submit a real inquiry with an approved test address. Check provider acceptance in Resend, inbox receipt at Wejha and the recipient’s Reply-To behavior.

## Maintenance

- Update project copy, categorization, status, technology and intended outcomes in `src/data/projects.ts`. Use `completed-project` only after evidence and publication approval.
- Edit services, industries, process and technologies under `src/data`. Showcase datasets are in `src/data/showcases.ts`. The Jordan visualization uses bundled governorate data with attribution under `public/maps`.
- Maintain brand assets in `public/brand`. The logo crops preserve the supplied mark. The toolkit uses the unaltered two-snake logo to identify Python. The mark belongs to the Python Software Foundation. [Python logo guidelines](https://www.python.org/community/logos/) The site ships with no social links until Wejha has confirmed URLs.
- Page content is server-rendered. Small client components manage navigation and form state. Chart, workspace and map bundles load as needed. Shared English language and direction settings are in `src/config/site.ts`. The layout uses logical spacing to support later RTL work.
- The contact API lives at `src/app/api/contact/route.ts`. Redis stores short-lived abuse counters. Resend handles plain-text delivery and deduplicates identical submissions inside its idempotency window. The app stores no inquiry messages in a database. Production CSP allows inline scripts for Next.js static hydration and disallows external script origins and eval.
