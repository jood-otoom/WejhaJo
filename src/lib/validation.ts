import { z } from "zod";
import { serviceOptions } from "@/data/services";

const cleanLine = (value: string) =>
  value
    .normalize("NFC")
    .replace(/\p{Cc}/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
const cleanDescription = (value: string) =>
  value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map(cleanLine)
    .join("\n")
    .trim();

export const contactSchema = z.strictObject({
  name: z
    .string()
    .max(120)
    .transform(cleanLine)
    .pipe(z.string().min(2, "Enter your full name.")),
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.email("Enter a valid email address.")),
  organization: z.string().max(160).transform(cleanLine),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine(
      (value) =>
        !value ||
        (/^[+()\d .-]+$/.test(value) && value.replace(/\D/g, "").length >= 6),
      "Enter a valid phone number.",
    ),
  service: z.enum(serviceOptions, { error: "Select a service." }),
  description: z
    .string()
    .max(5000)
    .transform(cleanDescription)
    .pipe(
      z.string().min(10, "Describe your project in at least 10 characters."),
    ),
  website: z.string().max(240),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactInquiry = Omit<z.output<typeof contactSchema>, "website">;

export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      message: string;
      fields?: Partial<Record<keyof ContactInput, string[]>>;
    };
