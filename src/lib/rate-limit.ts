import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import type { ContactConfig } from "./contact-config";

let limiters: { perVisitor: Ratelimit; global: Ratelimit } | undefined;

function getLimiters(config: ContactConfig) {
  if (limiters) return limiters;
  const redis = new Redis({
    url: config.UPSTASH_REDIS_REST_URL,
    token: config.UPSTASH_REDIS_REST_TOKEN,
    retry: false,
    signal: () => AbortSignal.timeout(4_000),
  });
  const prefix = "wejha:contact";
  limiters = {
    perVisitor: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      prefix: `${prefix}:visitor`,
      timeout: 4_000,
      ephemeralCache: false,
    }),
    global: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(80, "1 h"),
      prefix: `${prefix}:global`,
      timeout: 4_000,
      ephemeralCache: false,
    }),
  };
  return limiters;
}

function getWorkerClientIp(request: Request) {
  try {
    getCloudflareContext();
    return request.headers.get("cf-connecting-ip");
  } catch {
    // A standalone Next.js server has no trusted Cloudflare ingress.
    return null;
  }
}

export async function limitContact(request: Request, config: ContactConfig) {
  const { perVisitor, global } = getLimiters(config);
  const clientIp = getWorkerClientIp(request);
  const identity = clientIp && isIP(clientIp) ? clientIp : "shared";
  const hash = createHmac("sha256", config.CONTACT_HASH_SECRET)
    .update(`visitor:${identity}`)
    .digest("hex");

  const visitor = await perVisitor.limit(hash);
  if (visitor.reason === "timeout") throw new Error("Rate limiter timed out");
  if (!visitor.success) return visitor;
  const overall = await global.limit("all");
  if (overall.reason === "timeout") throw new Error("Rate limiter timed out");
  return overall;
}
