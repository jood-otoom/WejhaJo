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

export const siteUrl = new URL("https://wejhajo.org");
export const allowIndexing = process.env.NODE_ENV === "production";
