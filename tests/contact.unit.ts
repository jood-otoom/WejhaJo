import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { getContactConfig, type ContactConfig } from "@/lib/contact-config";
import { sendContact } from "@/lib/email";
import { limitContact } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";

vi.mock("@/lib/contact-config", () => ({ getContactConfig: vi.fn() }));
vi.mock("@/lib/rate-limit", () => ({ limitContact: vi.fn() }));
vi.mock("@/lib/email", () => ({ sendContact: vi.fn() }));

const config: ContactConfig = {
  CONTACT_RECIPIENT_EMAIL: "inquiries@example.com",
  CONTACT_FROM_EMAIL: "website@example.com",
  RESEND_API_KEY: "test",
  UPSTASH_REDIS_REST_URL: "https://redis.example.com",
  UPSTASH_REDIS_REST_TOKEN: "test",
  CONTACT_HASH_SECRET: "test-signing-secret-not-for-runtime",
};
const inquiry = {
  name: " Noor   Ahmad ",
  email: "noor@example.com",
  organization: "Example team",
  phone: "",
  service: "General inquiry",
  description: "We need a booking workflow.\r\nWe have a small team.",
  website: "",
};
const origin = "http://localhost:3000";

function request(body: string, headers: Record<string, string> = {}) {
  return new Request(`${origin}/api/contact`, {
    method: "POST",
    body,
    headers: { origin, "content-type": "application/json", ...headers },
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getContactConfig).mockReturnValue(config);
  vi.mocked(limitContact).mockResolvedValue({
    success: true,
    limit: 5,
    remaining: 4,
    reset: Date.now() + 1000,
    pending: Promise.resolve(),
  });
  vi.mocked(sendContact).mockResolvedValue(true);
});

describe("contact validation", () => {
  it("cleans text, preserves message paragraph breaks and accepts optional empty fields", () => {
    const result = contactSchema.parse({
      ...inquiry,
      organization: "",
      description: "  We need scheduling.\r\n\r\n  Can you help? ",
    });
    expect(result).toMatchObject({
      name: "Noor Ahmad",
      organization: "",
      phone: "",
      description: "We need scheduling.\n\nCan you help?",
    });
  });

  it("rejects invalid email, phone and service choices", () => {
    expect(
      contactSchema.safeParse({
        ...inquiry,
        email: "noor@@example.com",
        phone: "call me",
        service: "unknown",
      }).success,
    ).toBe(false);
  });
});

describe("contact route", () => {
  it("returns success after rate checks and provider acceptance", async () => {
    const response = await POST(request(JSON.stringify(inquiry)));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(sendContact).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Noor Ahmad",
        email: inquiry.email,
        description: expect.stringContaining("\n"),
      }),
      config,
    );
    expect(vi.mocked(sendContact).mock.calls[0][0]).not.toHaveProperty(
      "website",
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("matches the browser origin when the runtime normalizes the request hostname", async () => {
    const response = await POST(
      request(JSON.stringify(inquiry), {
        host: "127.0.0.1:3000",
        origin: "http://127.0.0.1:3000",
        "sec-fetch-site": "same-origin",
      }),
    );
    expect(response.status).toBe(200);
  });

  it("blocks cross-site and unsupported submissions", async () => {
    expect(
      (await POST(request("{}", { origin: "https://another.example" }))).status,
    ).toBe(403);
    expect(
      (await POST(request("{}", { "content-type": "text/plain" }))).status,
    ).toBe(415);
    expect(sendContact).not.toHaveBeenCalled();
  });

  it("rejects malformed, oversized and invalid bodies", async () => {
    expect((await POST(request("{bad"))).status).toBe(400);
    expect((await POST(request("x".repeat(24_001)))).status).toBe(413);
    const invalid = await POST(
      request(JSON.stringify({ ...inquiry, email: "bad" })),
    );
    expect(invalid.status).toBe(422);
    expect((await invalid.json()).fields.email).toEqual([
      "Enter a valid email address.",
    ]);
    expect(sendContact).not.toHaveBeenCalled();
  });

  it("blocks honeypot entries", async () => {
    expect(
      (await POST(request(JSON.stringify({ ...inquiry, website: "bot" }))))
        .status,
    ).toBe(400);
    expect(limitContact).not.toHaveBeenCalled();
    expect(sendContact).not.toHaveBeenCalled();
  });

  it("returns an accurate 503 when configuration is missing or the limiter is unavailable", async () => {
    vi.mocked(getContactConfig).mockReturnValueOnce(null);
    expect((await POST(request(JSON.stringify(inquiry)))).status).toBe(503);
    vi.mocked(limitContact).mockRejectedValueOnce(new Error("test"));
    expect((await POST(request(JSON.stringify(inquiry)))).status).toBe(503);
    expect(sendContact).not.toHaveBeenCalled();
  });

  it("reports throttling with a retry interval", async () => {
    vi.mocked(limitContact).mockResolvedValue({
      success: false,
      limit: 5,
      remaining: 0,
      reset: Date.now() + 60_000,
      pending: Promise.resolve(),
    });
    const response = await POST(request(JSON.stringify(inquiry)));
    expect(response.status).toBe(429);
    expect(Number(response.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(sendContact).not.toHaveBeenCalled();
  });

  it("never claims delivery if the provider rejects or fails", async () => {
    vi.mocked(sendContact)
      .mockResolvedValueOnce(false)
      .mockRejectedValueOnce(new Error("test"));
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await POST(request(JSON.stringify(inquiry)));
      expect(response.status).toBe(502);
      expect(await response.json()).toEqual({
        ok: false,
        message: expect.any(String),
      });
    }
  });
});
