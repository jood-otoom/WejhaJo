import { isIP } from "node:net";
import type { ContactBindings } from "./contact-bindings";

// Both native limiters use a 60-second period in wrangler.jsonc.
export const contactRetryAfterSeconds = 60;

export async function limitContact(
  request: Request,
  { clientLimit, endpointLimit }: ContactBindings,
): Promise<boolean> {
  const ip = request.headers.get("cf-connecting-ip");
  // This helper is called only with the bindings from the Worker runtime.
  const client = await clientLimit.limit({
    key: ip && isIP(ip) ? ip : "shared",
  });
  if (!client.success) return false;

  const endpoint = await endpointLimit.limit({ key: "contact" });
  return endpoint.success;
}
