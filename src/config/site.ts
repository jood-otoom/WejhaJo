export const site = {
  name: "Wejha",
  slogan: "Technology with Purpose.",
  description:
    "Wejha builds intelligent software, AI and digital solutions that help businesses and organizations work smarter and create lasting value.",
  location: "Amman, Jordan",
  language: "en",
  direction: "ltr",
} as const;

export const navigation = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Projects" },
  { id: "process", label: "Our Approach" },
  { id: "contact", label: "Contact" },
] as const;

export const productionUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const siteUrl = new URL(productionUrl || "http://localhost:3000");
export const allowIndexing =
  Boolean(productionUrl) &&
  (process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true);
