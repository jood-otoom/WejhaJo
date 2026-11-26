import { NextResponse } from "next/server";
import { z } from "zod";
import { siteUrl } from "@/config/site";
import { getContactBindings } from "@/lib/contact-bindings";
import { sendContact } from "@/lib/email";
import { contactRetryAfterSeconds, limitContact } from "@/lib/rate-limit";
import { contactSchema, type ContactResponse } from "@/lib/validation";

const maximumBytes = 24_000;
const unavailable =
  "We couldn’t send your inquiry right now. Please try again later.";

class RequestTooLarge extends Error {}

async function readJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > maximumBytes)
    throw new RequestTooLarge();
  if (!request.body) throw new SyntaxError("Missing request body");
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maximumBytes) {
        await reader.cancel();
        throw new RequestTooLarge();
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}

function reply(
  body: ContactResponse,
  status: number,
  headers?: Record<string, string>,
) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  const host = request.headers.get("host") ?? url.host;
  const requestOrigin = `${url.protocol}//${host}`;
  if (
    !origin ||
    (origin !== requestOrigin && origin !== siteUrl.origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    return reply(
      { ok: false, message: "Submit your inquiry from the website." },
      403,
    );
  }
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  ) {
    return reply({ ok: false, message: "Use the website inquiry form." }, 415);
  }

  let raw: unknown;
  try {
    raw = await readJson(request);
  } catch (error) {
    return error instanceof RequestTooLarge
      ? reply({ ok: false, message: "Your inquiry is too long." }, 413)
      : reply({ ok: false, message: "The inquiry could not be read." }, 400);
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success)
    return reply(
      {
        ok: false,
        message: "Check the highlighted fields and try again.",
        fields: z.flattenError(parsed.error).fieldErrors,
      },
      422,
    );

  const { website, ...inquiry } = parsed.data;
  if (website)
    return reply(
      {
        ok: false,
        message:
          "Your inquiry could not be sent. Please check the form and try again.",
      },
      400,
    );

  const bindings = getContactBindings();
  if (!bindings) {
    console.error("Contact Worker bindings missing");
    return reply({ ok: false, message: unavailable }, 503);
  }

  try {
    if (!(await limitContact(request, bindings))) {
      return reply(
        {
          ok: false,
          message: "Too many inquiries were submitted. Please try again later.",
        },
        429,
        {
          "Retry-After": String(contactRetryAfterSeconds),
        },
      );
    }
  } catch {
    console.error("Contact rate limiter unavailable");
    return reply({ ok: false, message: unavailable }, 503);
  }

  try {
    const result = await sendContact(inquiry, bindings.email);
    if (result === "accepted") return reply({ ok: true }, 200);
    if (result === "duplicate" || result === "pending") {
      return reply(
        {
          ok: false,
          message:
            result === "duplicate"
              ? "This inquiry was already sent."
              : "This inquiry is already being sent. Please wait a moment.",
        },
        409,
      );
    }
    if (result === "busy")
      return reply({ ok: false, message: unavailable }, 503);
    console.error("Cloudflare Email Sending did not return an acceptance ID");
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error ? error.code : null;
    console.error(
      "Cloudflare Email Sending failed",
      typeof code === "string" && /^E_[A-Z_]+$/.test(code) ? code : "",
    );
  }
  return reply({ ok: false, message: unavailable }, 502);
}
