import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { imageSize, socialImage } from "@/lib/social-image";

export const alt = "Wejha project preview";
export const size = imageSize;
export const contentType = "image/png";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return socialImage(project.name, project.category, project.description);
}
