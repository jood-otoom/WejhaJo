import { createHash } from "node:crypto";
import { site } from "@/config/site";
import type { ContactEmailBinding } from "@/types/cloudflare";
import type { ContactInquiry } from "./validation";

// Keep the private destination aligned with the restriction in wrangler.jsonc.
const recipient = "official@gotimejo.com";
const duplicateWindowMs = 60_000;
const maximumTracked = 128;
// Retain fingerprints on this isolate only. Each request awaits its own send.
const pending = new Set<string>();
const recentlyAccepted = new Map<string, number>();

export async function sendContact(
  inquiry: ContactInquiry,
  email: ContactEmailBinding,
) {
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(inquiry))
    .digest("hex");
  if (pending.has(fingerprint)) return "pending";
  if ((recentlyAccepted.get(fingerprint) ?? 0) > Date.now()) return "duplicate";
  if (pending.size >= maximumTracked) return "busy";

  pending.add(fingerprint);
  try {
    const result = await email.send({
      from: { email: site.email, name: "Wejha Website" },
      to: recipient,
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
    });
    if (!result?.messageId?.trim()) return "unconfirmed";

    recentlyAccepted.delete(fingerprint);
    const oldest = recentlyAccepted.keys().next().value;
    if (recentlyAccepted.size >= maximumTracked && oldest) {
      recentlyAccepted.delete(oldest);
    }
    recentlyAccepted.set(fingerprint, Date.now() + duplicateWindowMs);
    return "accepted";
  } finally {
    pending.delete(fingerprint);
  }
}
