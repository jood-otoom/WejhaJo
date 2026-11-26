import { createHmac } from "node:crypto";
import { Resend } from "resend";
import type { ContactConfig } from "./contact-config";
import type { ContactInquiry } from "./validation";

export async function sendContact(
  inquiry: ContactInquiry,
  config: ContactConfig,
): Promise<boolean> {
  const fingerprint = createHmac("sha256", config.CONTACT_HASH_SECRET)
    .update(
      JSON.stringify([
        inquiry.name,
        inquiry.email,
        inquiry.organization,
        inquiry.phone,
        inquiry.service,
        inquiry.description,
      ]),
    )
    .digest("hex");
  const resend = new Resend(config.RESEND_API_KEY);
  const result = await resend.emails.send(
    {
      from: `Wejha Website <${config.CONTACT_FROM_EMAIL}>`,
      to: config.CONTACT_RECIPIENT_EMAIL,
      replyTo: inquiry.email,
      subject: "New Wejha website inquiry",
      text: [
        `Name: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        `Organization: ${inquiry.organization || "Not provided"}`,
        `Phone: ${inquiry.phone || "Not provided"}`,
        `Service: ${inquiry.service}`,
        "",
        inquiry.description,
      ].join("\n"),
    },
    {
      idempotencyKey: `wejha-inquiry/${fingerprint}`,
      signal: AbortSignal.timeout(10_000),
    },
  );
  return !result.error && Boolean(result.data?.id);
}
