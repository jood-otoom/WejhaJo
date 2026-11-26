export interface ContactEmailBinding {
  send(message: {
    from: { email: string; name: string };
    to: string;
    replyTo: string;
    subject: string;
    text: string;
  }): Promise<{ messageId: string }>;
}

export interface ContactRateLimitBinding {
  limit(input: { key: string }): Promise<{ success: boolean }>;
}

declare global {
  interface CloudflareEnv {
    CONTACT_EMAIL?: ContactEmailBinding;
    CONTACT_CLIENT_LIMIT?: ContactRateLimitBinding;
    CONTACT_ENDPOINT_LIMIT?: ContactRateLimitBinding;
  }
}
