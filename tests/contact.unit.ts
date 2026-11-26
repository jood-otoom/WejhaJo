import { getCloudflareContext } from "@opennextjs/cloudflare";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { contactSchema } from "@/lib/validation";

vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: vi.fn() }));

const send = vi.fn();
const clientLimit = vi.fn();
const endpointLimit = vi.fn();
const env = {
  CONTACT_EMAIL: { send },
  CONTACT_CLIENT_LIMIT: { limit: clientLimit },
  CONTACT_ENDPOINT_LIMIT: { limit: endpointLimit },
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

function submit(fields = {}, headers = {}) {
  return POST(request(JSON.stringify({ ...inquiry, ...fields }), headers));
}

function mockBindings(env: CloudflareEnv) {
  // The contact handler consumes only the runtime environment.
  vi.mocked(getCloudflareContext).mockReturnValue({
    env,
    cf: undefined,
    ctx: {} as ReturnType<typeof getCloudflareContext>["ctx"],
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  mockBindings(env);
  clientLimit.mockResolvedValue({ success: true });
  endpointLimit.mockResolvedValue({ success: true });
  send.mockResolvedValue({ messageId: "test-accepted-id" });
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
  it("checks the Cloudflare client and endpoint limits before sending a normalized inquiry", async () => {
    const response = await submit({}, { "cf-connecting-ip": "192.0.2.1" });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(clientLimit).toHaveBeenCalledWith({ key: "192.0.2.1" });
    expect(endpointLimit).toHaveBeenCalledWith({ key: "contact" });
    expect(endpointLimit).toHaveBeenCalledBefore(send);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: inquiry.email,
        text: expect.stringMatching(/Name: Noor Ahmad\n/),
      }),
    );
  });

  it("matches the browser origin when the runtime normalizes the request hostname", async () => {
    const response = await submit(
      { description: "I would like help with a new on-site workflow." },
      {
        host: "127.0.0.1:3000",
        origin: "http://127.0.0.1:3000",
        "sec-fetch-site": "same-origin",
        "x-forwarded-for": "192.0.2.1",
      },
    );
    expect(response.status).toBe(200);
    expect(clientLimit).toHaveBeenCalledWith({ key: "shared" });
  });

  it("blocks cross-site and unsupported submissions", async () => {
    expect(
      (await POST(request("{}", { origin: "https://another.example" }))).status,
    ).toBe(403);
    expect(
      (await POST(request("{}", { "content-type": "text/plain" }))).status,
    ).toBe(415);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects malformed, oversized and invalid bodies", async () => {
    expect((await POST(request("{bad"))).status).toBe(400);
    expect((await POST(request("x".repeat(24_001)))).status).toBe(413);
    const invalid = await submit({ email: "bad" });
    expect(invalid.status).toBe(422);
    expect((await invalid.json()).fields.email).toEqual([
      "Enter a valid email address.",
    ]);
    expect((await submit({ to: "another@example.com" })).status).toBe(422);
    expect(send).not.toHaveBeenCalled();
  });

  it("blocks honeypot entries", async () => {
    expect((await submit({ website: "bot" })).status).toBe(400);
    expect(clientLimit).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it.each(Object.keys(env) as (keyof typeof env)[])(
    "returns 503 when the %s binding is missing",
    async (name) => {
      mockBindings({ ...env, [name]: undefined });
      expect((await submit()).status).toBe(503);
      expect(send).not.toHaveBeenCalled();
    },
  );

  it("returns 503 outside the Workers runtime", async () => {
    vi.mocked(getCloudflareContext).mockImplementation(() => {
      throw new Error("Missing Worker context");
    });
    expect((await submit()).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });

  it("fails closed when a rate limiter is unavailable", async () => {
    endpointLimit.mockRejectedValueOnce(new Error("test"));
    expect((await submit()).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });

  it("reports per-client and endpoint throttling with a retry interval", async () => {
    clientLimit.mockResolvedValueOnce({ success: false });
    const clientResponse = await submit();
    expect(clientResponse.status).toBe(429);
    expect(clientResponse.headers.get("retry-after")).toBe("60");
    expect(endpointLimit).not.toHaveBeenCalled();

    endpointLimit.mockResolvedValueOnce({ success: false });
    const endpointResponse = await submit();
    expect(endpointResponse.status).toBe(429);
    expect(endpointResponse.headers.get("retry-after")).toBe("60");
    expect(send).not.toHaveBeenCalled();
  });

  it("never claims success if the binding rejects or returns no acceptance ID", async () => {
    send.mockResolvedValueOnce({}).mockRejectedValueOnce(
      Object.assign(new Error("private payload"), {
        code: "E_RECIPIENT_NOT_ALLOWED",
      }),
    );
    const fields = {
      description: "Please help us plan a new purchase process.",
    };
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await submit(fields);
      expect(response.status).toBe(502);
      expect(await response.json()).toEqual({
        ok: false,
        message:
          "We couldn’t send your inquiry right now. Please try again later.",
      });
    }
    expect((await submit(fields)).status).toBe(200);
  });

  it("returns 409 for an already accepted inquiry without sending again", async () => {
    const fields = {
      description: "We need a duplicate-safe contact workflow.",
    };
    expect((await submit(fields)).status).toBe(200);
    const response = await submit(fields);
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      ok: false,
      message: "This inquiry was already sent.",
    });
    expect(send).toHaveBeenCalledTimes(1);
  });
});
