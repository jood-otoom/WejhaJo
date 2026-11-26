import { describe, expect, it, vi } from "vitest";
import { sendContact } from "@/lib/email";

const inquiry = {
  name: "Noor Ahmad",
  email: "noor@example.com",
  organization: "",
  phone: "",
  service: "General inquiry" as const,
  description: "We need scheduling.",
};

describe("Cloudflare email request", () => {
  it("uses the fixed verified destination, company sender and visitor Reply-To", async () => {
    const send = vi.fn().mockResolvedValue({ messageId: "test-id" });
    await expect(sendContact(inquiry, { send })).resolves.toBe("accepted");
    expect(send).toHaveBeenCalledWith({
      to: "official@gotimejo.com",
      from: { email: "official@wejhajo.org", name: "Wejha Website" },
      replyTo: inquiry.email,
      subject: "New Wejha website inquiry",
      text: expect.stringContaining(inquiry.description),
    });
  });

  it("suppresses in-flight and recently accepted duplicates on the same isolate", async () => {
    const message = { ...inquiry, description: "Handle duplicate requests." };
    let accept: (result: { messageId: string }) => void = () => {};
    const promise = new Promise<{ messageId: string }>((resolve) => {
      accept = resolve;
    });
    const binding = { send: vi.fn(() => promise) };
    const first = sendContact(message, binding);
    await expect(sendContact(message, binding)).resolves.toBe("pending");
    accept({ messageId: "test-id" });
    await expect(first).resolves.toBe("accepted");
    await expect(sendContact(message, binding)).resolves.toBe("duplicate");
    expect(binding.send).toHaveBeenCalledTimes(1);
  });

  it("allows the same inquiry to be sent after the duplicate window", async () => {
    vi.useFakeTimers();
    try {
      const message = { ...inquiry, description: "Test the duplicate window." };
      const send = vi.fn().mockResolvedValue({ messageId: "test-id" });
      await expect(sendContact(message, { send })).resolves.toBe("accepted");
      vi.advanceTimersByTime(60_000);
      await expect(sendContact(message, { send })).resolves.toBe("accepted");
      expect(send).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });
});
