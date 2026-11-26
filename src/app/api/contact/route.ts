import { NextResponse } from "next/server";
import { z } from "zod";
import { getContactConfig } from "@/lib/contact-config";
import { sendContact } from "@/lib/email";
import { limitContact } from "@/lib/rate-limit";
import { contactSchema, type ContactResponse } from "@/lib/validation";

export const maxDuration = 25;

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
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
    : undefined;
  const url = new URL(request.url);
  const host = request.headers.get("host") ?? url.host;
  const protocol = process.env.VERCEL === "1" ? "https:" : url.protocol;
  const requestOrigin = `${protocol}//${host}`;
  if (
    !origin ||
    (origin !== requestOrigin && origin !== siteOrigin) ||
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

  const config = getContactConfig();
  if (!config) return reply({ ok: false, message: unavailable }, 503);

  try {
    const limit = await limitContact(request, config);
    if (!limit.success) {
      return reply(
        {
          ok: false,
          message: "Too many inquiries were submitted. Please try again later.",
        },
        429,
        {
          "Retry-After": String(
            Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000)),
          ),
        },
      );
    }
  } catch {
    console.error("Contact rate limiter unavailable");
    return reply({ ok: false, message: unavailable }, 503);
  }

  try {
    if (await sendContact(inquiry, config)) return reply({ ok: true }, 200);
    console.error("Contact provider did not accept an inquiry");
  } catch {
    console.error("Contact provider unavailable");
  }
  return reply({ ok: false, message: unavailable }, 502);
}
