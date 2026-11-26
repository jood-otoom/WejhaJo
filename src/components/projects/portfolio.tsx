"use client";

import { useState } from "react";
import {
  projectCategories,
  projects,
  type ProjectCategory,
} from "@/data/projects";
import { ProjectPreview } from "./project-preview";

export function Portfolio() {
  const [category, setCategory] = useState<ProjectCategory | "All">("All");
  const shown =
    category === "All"
      ? projects
      : projects.filter((project) => project.category === category);

  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects">
        {(["All", ...projectCategories] as const).map((filter) => (
          <button
            className="filter"
            type="button"
            aria-pressed={category === filter}
            aria-controls="portfolio-grid"
            key={filter}
            onClick={() => setCategory(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} projects shown
      </p>
      <div className="card-grid" id="portfolio-grid">
        {shown.map((project) => (
          <article className="card project-card" key={project.slug}>
            <ProjectPreview kind={project.preview} />
            <div className="project-body">
              <span className="project-meta">{project.category}</span>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <ul className="project-stack" aria-label="Technologies">
                {project.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
