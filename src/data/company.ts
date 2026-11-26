export const industries = [
  {
    name: "NGOs and Non-Profit Organizations",
    description:
      "Digital transformation for program teams, including beneficiary management, reporting and workflow automation.",
  },
  {
    name: "Corporate and Enterprise",
    description:
      "Connected systems that simplify operations, information access and collaboration.",
  },
  {
    name: "Retail and E-Commerce",
    description:
      "Digital storefronts, stock visibility and order management built around real buying journeys.",
  },
  {
    name: "Sports and Recreation",
    description:
      "Booking tools and venue management that make it easier for people to play.",
  },
  {
    name: "Education and Training",
    description:
      "Learning platforms and practical digital tools for staff, educators and learners.",
  },
  {
    name: "Startups and Entrepreneurs",
    description:
      "Focused product development to get an idea into the hands of real users.",
  },
] as const;

export const processSteps = [
  {
    name: "Discover",
    description:
      "We listen to your team, map the way you work and agree on the outcomes that will guide the project.",
  },
  {
    name: "Design",
    description:
      "We turn shared priorities into prototypes, accessible user journeys and a system architecture your team can build on.",
  },
  {
    name: "Develop",
    description:
      "We build in small, reviewable increments so your team can try the product and give feedback as it takes shape.",
  },
  {
    name: "Test",
    description:
      "We check workflows, accessibility, performance and security before the system becomes part of your day-to-day work.",
  },
  {
    name: "Deploy",
    description:
      "We release the solution with a rollout plan, clear ownership and support through the transition.",
  },
  {
    name: "Train & Empower",
    description:
      "Our trainers work alongside your staff with practical sessions, onboarding and resources they can return to.",
  },
  {
    name: "Support & Grow",
    description:
      "We stay close after launch, help resolve issues and evolve the system as your organization’s needs change.",
  },
] as const;

export const toolkit = [
  {
    name: "Frontend",
    technologies: ["React", "Next.js", "TypeScript", "Figma"],
  },
  { name: "Backend", technologies: ["Laravel", "Python", "FastAPI"] },
  { name: "Mobile Development", technologies: ["Flutter", "Dart"] },
  {
    name: "Artificial Intelligence",
    technologies: ["LLMs & RAG", "scikit-learn"],
  },
  { name: "Databases", technologies: ["PostgreSQL", "Supabase"] },
  {
    name: "Cloud and Infrastructure",
    technologies: ["Docker", "Cloudflare", "Vercel"],
  },
  {
    name: "APIs and Integrations",
    technologies: ["REST APIs", "OpenAPI", "Webhooks"],
  },
] as const;
