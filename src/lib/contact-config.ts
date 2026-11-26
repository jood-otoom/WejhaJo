import { z } from "zod";

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
  const result = schema.safeParse(process.env);
  return result.success ? result.data : null;
}
