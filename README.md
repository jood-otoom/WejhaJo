# WejhaJo

Wejha’s official company website includes a nine-project portfolio, an interactive regional impact explorer, and a server-side inquiry form. The public site is configured for `https://wejhajo.org`.

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

Open [localhost:8787](http://localhost:8787). The preview runs the built Worker in workerd. Wrangler simulates the native email binding and prints test messages to its terminal. Use synthetic data in preview. Standalone Next.js can render the site and validate form data, and valid inquiries require the Worker runtime.

## Contact form bindings

The form uses Cloudflare Email Sending and Rate Limiting through OpenNext’s request context. No environment variables, credentials, or local secret files are required for the form.

- `CONTACT_EMAIL` restricts inquiry delivery to the single verified destination in `wrangler.jsonc`. The sender is `official@wejhajo.org`, and the visitor’s validated address is the Reply-To. The public address still receives mail through the existing Email Routing rule. [Send bindings](https://developers.cloudflare.com/email-service/configuration/send-bindings/) · [Verified destinations and Workers Free](https://developers.cloudflare.com/email-service/configuration/destination-addresses/)
- `CONTACT_CLIENT_LIMIT` permits three eligible submissions per 60 seconds per client IP. `CONTACT_ENDPOINT_LIMIT` permits 20 per 60 seconds across clients served by the same Cloudflare location. Clients without a valid `CF-Connecting-IP` share a fallback key. The counters are approximate and location-specific. A strict global quota would require an authoritative shared counter such as a Durable Object. [Workers Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- The browser prevents repeated clicks. A bounded, in-memory fingerprint check suppresses concurrent and recently accepted copies on the same Worker isolate for up to 60 seconds after acceptance. The fingerprints and client IP keys are used inside Cloudflare, so no signing secret is needed. A failed send can be retried subject to the rate limits.

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

The Playwright suite starts the built Worker with Wrangler on port 3100. It exercises the local email simulator without credentials. It also covers navigation and accessibility, portfolio filters, the regional impact explorer, responsive layouts, and contact form behavior. GitHub Actions runs the same checks on pushes and pull requests.

## Cloudflare Workers deployment

1. Keep the existing GitHub connection on **Workers & Pages → wejhajo → Settings → Build**. Cloudflare’s GitHub app needs access to the private `jood-otoom/WejhaJo` repository. Use the following Workers Builds settings. [Connect a repository and configure Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)

   | Setting                      | Value                  |
   | ---------------------------- | ---------------------- |
   | Worker name                  | `wejhajo`              |
   | Production branch            | `main`                 |
   | Root directory               | Repository root        |
   | Build command                | `npm run build:worker` |
   | Deploy command               | `npm run deploy`       |
   | Non-production branch builds | Off                    |

2. In the same Cloudflare account, open **Compute → Email Service → Email Routing → Destination Addresses** and confirm the address pinned in `wrangler.jsonc` is **Verified**. Workers Builds provisions the three contact bindings from the repository. [Destination addresses](https://developers.cloudflare.com/email-service/configuration/destination-addresses/)
3. Keep `wejhajo.org` attached to the Worker under **Settings → Domains & Routes**. Keep the existing inbound routing rule for the public address. Verified-destination sends are available on Workers Free with Email Routing. If the Worker reports a sender-domain or setup error, open **Compute → Email Service → Email Sending → Onboard Domain**, select `wejhajo.org`, review the DNS records, and complete onboarding if offered on the current plan. [Email Sending setup](https://developers.cloudflare.com/email-service/get-started/send-emails/) · [Cloudflare Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
4. After deployment, submit a labeled test inquiry on the live site and confirm inbox receipt and Reply-To. A successful form response means Cloudflare accepted the request. If there is a failure, look for the Email Sending error code in the Worker logs. With Email Sending enabled, check the Email Service Activity log for the delivery status.
5. In **wejhajo → Settings → Variables & Secrets**, remove any legacy contact provider credentials, sender and recipient variables, and signing secret after you confirm the updated Worker is live. There are no replacement values to enter.

Cloudflare Workers Builds runs the build and deploy commands on pushes to `main` after you connect the repository. For an authorized manual deployment, run `npm ci`, `npm run build:worker`, and `npm run deploy` in that order using a Wrangler-authenticated account. The deploy command publishes the existing Worker build. [OpenNext build and deploy commands](https://opennext.js.org/cloudflare/howtos/dev-deploy)

## Maintenance

- Update project copy, categories, status, technologies, and intended outcomes in `src/data/projects.ts`. Apply `completed-project` only after evidence and publication approval.
- Edit services, industries, process, and technologies under `src/data`. Showcase datasets are in `src/data/showcases.ts`. The Jordan map uses bundled governorate data with attribution under `public/maps`.
- Maintain the optimized logo assets in `public/brand`. The toolkit uses the original two-snake mark to identify Python. [Python logo guidelines](https://www.python.org/community/logos/)
- Shared language, direction, and the canonical URL live in `src/config/site.ts`. OpenNext serves the prerendered pages, social images, and lightweight brand files from Workers Static Assets.
- The contact API lives at `src/app/api/contact/route.ts`. Cloudflare handles short-lived abuse counters and plain-text delivery to the configured mailbox.
