import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { site } from "@/config/site";
import { getContactConfig } from "@/lib/contact-config";

beforeEach(() => {
  vi.stubEnv("CONTACT_FROM_EMAIL", "website@example.com");
  vi.stubEnv("RESEND_API_KEY", "test-resend-key");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.com");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-redis-token");
  vi.stubEnv(
    "CONTACT_HASH_SECRET",
    "test-signing-secret-at-least-32-characters",
  );
});

afterEach(() => vi.unstubAllEnvs());

describe("contact recipient", () => {
  it.each([undefined, "", "previous@example.com", site.email])(
    "uses the official mailbox in production with binding %s",
    (binding) => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("CONTACT_RECIPIENT_EMAIL", binding);
      expect(getContactConfig()?.CONTACT_RECIPIENT_EMAIL).toBe(site.email);
    },
  );

  it("allows a test mailbox in standalone development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("CONTACT_RECIPIENT_EMAIL", "qa@example.com");
    expect(getContactConfig()?.CONTACT_RECIPIENT_EMAIL).toBe("qa@example.com");
  });

  it("still requires a valid sender and provider credentials", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("RESEND_API_KEY", undefined);
    expect(getContactConfig()).toBeNull();
  });
});
