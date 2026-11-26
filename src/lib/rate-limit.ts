import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
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
  const prefix = `wejha:contact:${process.env.VERCEL_ENV ?? "local"}`;
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

export async function limitContact(request: Request, config: ContactConfig) {
  const { perVisitor, global } = getLimiters(config);
  // Vercel overwrites this header. Local or other hosts share a fallback bucket.
  const forwarded =
    process.env.VERCEL === "1"
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      : undefined;
  const identity = forwarded && isIP(forwarded) ? forwarded : "shared";
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
