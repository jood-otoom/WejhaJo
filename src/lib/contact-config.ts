import { z } from "zod";
import { site } from "@/config/site";

const schema = z.object({
  CONTACT_RECIPIENT_EMAIL: z.email(),
  CONTACT_FROM_EMAIL: z.email(),
  RESEND_API_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.url({ protocol: /^https$/ }),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  CONTACT_HASH_SECRET: z.string().min(32),
});

export type ContactConfig = z.output<typeof schema>;

export function getContactConfig() {
  const configuredRecipient = process.env.CONTACT_RECIPIENT_EMAIL?.trim();
  // Route production inquiries to the published address even if an old binding
  // is still present. Standalone development can use an explicit test mailbox.
  const recipient =
    process.env.NODE_ENV === "production" ? site.email : configuredRecipient;
  const result = schema.safeParse({
    ...process.env,
    CONTACT_RECIPIENT_EMAIL: recipient || site.email,
  });
  return result.success ? result.data : null;
}
