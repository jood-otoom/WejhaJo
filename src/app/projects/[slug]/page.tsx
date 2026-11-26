import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { getProject, projects, statusLabels } from "@/data/projects";
import { ProjectPreview } from "@/components/projects/project-preview";
import { ProjectShowcase } from "@/components/dashboards/showcase-loaders";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const path = `/projects/${project.slug}`;
  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${project.name} | Wejha`,
      description: project.description,
      url: path,
      siteName: "Wejha",
      type: "website",
      images: [`${path}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${path}/opengraph-image`],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <article>
      <header className="section dark project-hero">
        <div className="shell">
          <Link href="/#work" className="text-link">
            <ArrowLeft size={17} /> All projects
          </Link>
          <div className="project-hero-grid">
            <div>
              <p className="eyebrow">
                {project.category} · {statusLabels[project.status]}
              </p>
              <h1>{project.name}</h1>
              <p>{project.description}</p>
              <ul className="project-stack" aria-label="Technology stack">
                {project.technologies.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <figure>
              <ProjectPreview kind={project.preview} />
              <figcaption>Illustrative product interface</figcaption>
            </figure>
          </div>
        </div>
      </header>
      <section className="section project-content" aria-labelledby="overview">
        <div className="shell">
          <div className="project-details-grid">
            <div>
              <h2 id="overview">Overview</h2>
              <p>{project.description}</p>
              <h3>Business challenge</h3>
              <p>{project.challenge}</p>
              <h3>Intended business value</h3>
              <p>{project.value}</p>
            </div>
            <aside className="card">
              <h3>Solution capabilities</h3>
              <ul>
                {project.capabilities.map((capability) => (
                  <li key={capability}>
                    <Check size={17} aria-hidden="true" />
                    {capability}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
          <ProjectShowcase kind={project.preview} />
          <Link href="/#contact" className="button">
            Discuss a similar project <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </article>
  );
}
