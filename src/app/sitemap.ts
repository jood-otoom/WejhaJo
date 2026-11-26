import type { MetadataRoute } from "next";
import { allowIndexing, siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!allowIndexing) return [];
  return ["/", "/privacy", "/terms"].map((path) => ({
    url: new URL(path, siteUrl).href,
  }));
}
