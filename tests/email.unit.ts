import { describe, expect, it, vi } from "vitest";
import { sendContact } from "@/lib/email";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const config = {
  CONTACT_RECIPIENT_EMAIL: "team@example.com",
  CONTACT_FROM_EMAIL: "website@example.com",
  RESEND_API_KEY: "test",
  UPSTASH_REDIS_REST_URL: "https://redis.example.com",
  UPSTASH_REDIS_REST_TOKEN: "test",
  CONTACT_HASH_SECRET: "test-signing-secret-not-for-runtime",
};
const inquiry = {
  name: "Noor Ahmad",
  email: "noor@example.com",
  organization: "",
  phone: "",
  service: "General inquiry" as const,
  description: "We need scheduling.",
};

describe("provider request", () => {
  it("uses an approved From address, visitor Reply-To and stable non-PII idempotency key", async () => {
    send.mockResolvedValue({ data: { id: "test-id" }, error: null });
    await expect(sendContact(inquiry, config)).resolves.toBe(true);
    await sendContact(inquiry, config);
    await sendContact(
      { ...inquiry, description: "A different inquiry." },
      config,
    );
    const [message, options] = send.mock.calls[0];
    expect(message).toMatchObject({
      to: config.CONTACT_RECIPIENT_EMAIL,
      from: `Wejha Website <${config.CONTACT_FROM_EMAIL}>`,
      replyTo: inquiry.email,
    });
    expect(message).not.toHaveProperty("html");
    expect(options.idempotencyKey).toMatch(/^wejha-inquiry\/[a-f0-9]{64}$/);
    expect(send.mock.calls[1][1].idempotencyKey).toBe(options.idempotencyKey);
    expect(send.mock.calls[2][1].idempotencyKey).not.toBe(
      options.idempotencyKey,
    );
  });

  it("requires an acceptance ID", async () => {
    send.mockResolvedValue({
      data: null,
      error: { name: "provider_error" },
    });
    expect(await sendContact(inquiry, config)).toBe(false);
    send.mockResolvedValue({ data: {}, error: null });
    expect(await sendContact(inquiry, config)).toBe(false);
  });
});
