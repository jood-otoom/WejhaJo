import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getContactBindings() {
  try {
    const { env } = getCloudflareContext();
    const { CONTACT_EMAIL, CONTACT_CLIENT_LIMIT, CONTACT_ENDPOINT_LIMIT } = env;
    if (
      typeof CONTACT_EMAIL?.send === "function" &&
      typeof CONTACT_CLIENT_LIMIT?.limit === "function" &&
      typeof CONTACT_ENDPOINT_LIMIT?.limit === "function"
    ) {
      return {
        email: CONTACT_EMAIL,
        clientLimit: CONTACT_CLIENT_LIMIT,
        endpointLimit: CONTACT_ENDPOINT_LIMIT,
      };
    }
  } catch {
    // The Cloudflare runtime context can be absent in standalone Next.js.
  }
  return null;
}

export type ContactBindings = NonNullable<
  ReturnType<typeof getContactBindings>
>;
