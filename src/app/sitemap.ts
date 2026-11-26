import type { MetadataRoute } from "next";
import { allowIndexing, siteUrl } from "@/config/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!allowIndexing) return [];
  return [
    "/",
    "/privacy",
    "/terms",
    ...projects.map(({ slug }) => `/projects/${slug}`),
  ].map((path) => ({ url: new URL(path, siteUrl).href }));
}
