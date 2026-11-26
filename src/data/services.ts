export const services = [
  {
    id: "ai",
    name: "Artificial Intelligence",
    description:
      "Make information easier to find and everyday decisions easier to make with AI designed around your workflows.",
    capabilities: [
      "AI assistants & agents",
      "Retrieval-augmented generation",
      "Machine learning",
    ],
  },
  {
    id: "mobile",
    name: "Mobile Application Development",
    description:
      "Build intuitive iOS and Android apps that work reliably wherever people need them.",
    capabilities: [
      "Cross-platform apps",
      "Booking & field workflows",
      "App integration",
    ],
  },
  {
    id: "web",
    name: "Web Development",
    description:
      "Create fast, accessible websites and web applications your team can confidently maintain.",
    capabilities: [
      "Corporate websites",
      "Content management",
      "Custom web platforms",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise and B2B Solutions",
    description:
      "Connect your teams, partners and operations through software built around the way you work.",
    capabilities: ["B2B portals", "CRM & operations", "Role-based workflows"],
  },
  {
    id: "data",
    name: "Data Science and Business Intelligence",
    description:
      "Turn scattered data into reporting and forecasts your team can act on.",
    capabilities: [
      "Interactive dashboards",
      "Predictive analytics",
      "Performance reporting",
    ],
  },
  {
    id: "automation",
    name: "Business Automation and Digital Transformation",
    description:
      "Reduce repetitive work and bring disconnected processes into a simpler digital workflow.",
    capabilities: [
      "Workflow automation",
      "APIs & integrations",
      "Digital operations",
    ],
  },
] as const;

export const serviceOptions = [
  "General inquiry",
  ...services.map(({ name }) => name),
  "Training & Onboarding",
] as const;
