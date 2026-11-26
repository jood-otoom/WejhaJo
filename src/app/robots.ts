import type { MetadataRoute } from "next";
import { allowIndexing, siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return allowIndexing
    ? {
        rules: { userAgent: "*", allow: "/", disallow: "/api/" },
        sitemap: new URL("/sitemap.xml", siteUrl).href,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
