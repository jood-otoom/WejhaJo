# WejhaJo

Wejha’s official company website includes ten project pages, six interactive product experiences, and a server-side inquiry form. The public site is configured for `https://wejhajo.org`.

## Local setup

Use Node.js 24 and npm. The dependency lockfile includes the OpenNext Cloudflare adapter and Wrangler.

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). For deployment parity, build and start the local Cloudflare Workers runtime.

```bash
npm run build:worker
npm run preview
```

Open [localhost:8787](http://localhost:8787). The preview runs the built Worker in workerd. Portfolio previews work without credentials. A valid inquiry gets a temporary-unavailable response until contact configuration is present.

## Runtime secrets

On the `wejha-website` Worker, add these as **Secrets** under **Settings → Variables & Secrets**. Keep credential values out of GitHub and the Workers Builds variables. The app reads them at request time, so the Worker build needs no secrets. For local testing, copy `.env.example` to `.dev.vars` for Wrangler or `.env.local` for `next dev`. Use sandbox credentials for local testing. Standalone `next dev` can use a test mailbox.

| Variable                   | Value                                                                         |
| -------------------------- | ----------------------------------------------------------------------------- |
| `CONTACT_RECIPIENT_EMAIL`  | `official@wejhajo.org`.                                                       |
| `CONTACT_FROM_EMAIL`       | Bare sender email address on a domain or subdomain verified in Resend.        |
| `RESEND_API_KEY`           | Resend key with send access for the verified sender domain.                   |
| `UPSTASH_REDIS_REST_URL`   | The Upstash Redis HTTPS REST endpoint.                                        |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash REST token with write access.                                         |
| `CONTACT_HASH_SECRET`      | A stable signing secret. Generate a random value with `openssl rand -hex 32`. |

Production builds route inquiries to the official address in `src/config/site.ts` even when the Worker still has an older recipient binding. In **Settings → Variables & Secrets**, set `CONTACT_RECIPIENT_EMAIL` to `official@wejhajo.org` so the dashboard matches. Cloudflare Email Routing forwards incoming messages from that address to the company inbox. The Resend sender and the visitor’s Reply-To address are configured separately.

The inquiry endpoint uses Cloudflare’s `CF-Connecting-IP` in the Worker, hashes visitor identifiers before sending them to Upstash, and uses a shared fallback when no trusted IP is available. Use a separate Upstash database for local provider tests to keep production counters isolated. Requests are limited to five per visitor per 15 minutes and 80 total per hour. The same signing secret also generates email idempotency keys. [Cloudflare request headers](https://developers.cloudflare.com/fundamentals/reference/http-headers/#cf-connecting-ip) · [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run format:check
npm run build:worker
npx playwright install chromium webkit
npm run test:e2e
```

The Playwright suite starts the built Worker with Wrangler on port 3100. Run it without local contact secrets to exercise the unconfigured endpoint. It covers navigation and accessibility, all project routes and filters, the interactive portfolio, responsive layouts, and contact form behavior. GitHub Actions runs the same checks on pushes and pull requests.

## Cloudflare Workers deployment

1. In Cloudflare, open **Workers & Pages → Create → Import a repository** or connect an existing `wejha-website` Worker under **Settings → Build**. Give Cloudflare’s GitHub app access to the private `jood-otoom/WejhaJo` repository. Use the following Workers Builds settings. [Connect a repository and configure Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)

   | Setting                      | Value                  |
   | ---------------------------- | ---------------------- |
   | Worker name                  | `wejha-website`        |
   | Production branch            | `main`                 |
   | Root directory               | Repository root        |
   | Build command                | `npm run build:worker` |
   | Deploy command               | `npm run deploy`       |
   | Non-production branch builds | Off                    |

2. Review the Privacy Policy and Terms of Use before publishing. Verify the sending domain in Resend, provision Upstash Redis, and set the Worker’s runtime settings above. The first deploy can run before those secrets are set. The contact endpoint returns 503 until configuration is complete. [Resend domain setup](https://resend.com/docs/dashboard/domains/introduction) · [Upstash setup](https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted)
3. Confirm the `wejhajo.org` zone is active in the same Cloudflare account. The first deployment attaches the apex as a Worker Custom Domain using `wrangler.jsonc`. Review any existing records or routes on that hostname before authorizing the change. Cloudflare creates the DNS record and manages TLS for the Custom Domain. [Cloudflare Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
4. After deployment, verify the HTTPS homepage, canonical metadata, sitemap and a project detail on the apex domain. Submit a real test inquiry and verify Resend acceptance, inbox receipt, and Reply-To behavior.

Cloudflare Workers Builds runs the build and deploy commands on pushes to `main` after you connect the repository. For an authorized manual deployment, run `npm ci`, `npm run build:worker`, and `npm run deploy` in that order using a Wrangler-authenticated account. The deploy command publishes the existing Worker build. [OpenNext build and deploy commands](https://opennext.js.org/cloudflare/howtos/dev-deploy)

## Maintenance

- Update project copy, categories, status, technologies, and intended outcomes in `src/data/projects.ts`. Apply `completed-project` only after evidence and publication approval.
- Edit services, industries, process, and technologies under `src/data`. Showcase datasets are in `src/data/showcases.ts`. The Jordan map uses bundled governorate data with attribution under `public/maps`.
- Maintain the optimized logo assets in `public/brand`. The toolkit uses the original two-snake mark to identify Python. [Python logo guidelines](https://www.python.org/community/logos/)
- Shared language, direction, and the canonical URL live in `src/config/site.ts`. OpenNext serves the prerendered pages, social images, and lightweight brand files from Workers Static Assets.
- The contact API lives at `src/app/api/contact/route.ts`. Redis stores short-lived abuse counters and Resend processes plain-text inquiry delivery. Inquiry messages go to the configured mailbox.
