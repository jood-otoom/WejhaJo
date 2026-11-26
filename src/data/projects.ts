export const projectCategories = [
  "Artificial Intelligence",
  "Web Applications",
  "Mobile Applications",
  "Enterprise Systems",
  "Data & Analytics",
] as const;
export type ProjectCategory = (typeof projectCategories)[number];
export type ProjectStatus =
  "company-product" | "completed-project" | "solution-showcase";
export type ProjectPreview =
  | "booking"
  | "knowledge"
  | "support"
  | "procurement"
  | "forecast"
  | "corporate"
  | "commerce"
  | "intelligence"
  | "documents"
  | "operations";

export const statusLabels: Record<ProjectStatus, string> = {
  "company-product": "Wejha product",
  "completed-project": "Completed project",
  "solution-showcase": "Solution showcase",
};

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  challenge: string;
  capabilities: readonly string[];
  technologies: readonly string[];
  value: string;
  preview: ProjectPreview;
}

export const projects: readonly Project[] = [
  {
    slug: "gotime",
    name: "GoTime",
    category: "Mobile Applications",
    status: "company-product",
    preview: "booking",
    description:
      "Sports venue discovery, booking and management in one platform.",
    challenge:
      "Players need accurate availability, while operators need one place to manage courts, time slots and reservations.",
    capabilities: [
      "Browse venues by sport",
      "Find a date and available time",
      "Review and manage reservations",
      "Manage venue schedules and bookings",
    ],
    technologies: ["Flutter", "Laravel", "REST APIs"],
    value:
      "Make it easier for people to find somewhere to play and for venue operators to manage their schedules.",
  },
  {
    slug: "enterprise-knowledge-assistant",
    name: "Enterprise Knowledge Assistant",
    category: "Artificial Intelligence",
    status: "solution-showcase",
    preview: "knowledge",
    description:
      "Search internal documents and get answers with references to the original sources.",
    challenge:
      "Teams spend time looking through policies, handbooks and shared folders for a reliable answer.",
    capabilities: [
      "Document indexing and semantic search",
      "Retrieval-augmented responses",
      "Source reference cards",
      "Workspace access controls",
    ],
    technologies: ["Python", "FastAPI", "PostgreSQL", "LLMs & RAG"],
    value:
      "Help staff find guidance faster and check the underlying source before acting.",
  },
  {
    slug: "intelligent-customer-support",
    name: "Intelligent Customer Support",
    category: "Artificial Intelligence",
    status: "solution-showcase",
    preview: "support",
    description:
      "Bilingual AI assistance for common customer questions and human handoffs.",
    challenge:
      "Support teams need to answer recurring inquiries consistently in Arabic and English while keeping complex cases with the right people.",
    capabilities: [
      "Arabic and English dialogs",
      "Knowledge-base answers",
      "Human handoff",
      "Conversation review",
    ],
    technologies: ["React", "Python", "FastAPI", "LLMs"],
    value:
      "Give customers timely guidance and give support staff more room for cases that need their judgment.",
  },
  {
    slug: "b2b-procurement-platform",
    name: "B2B Procurement Platform",
    category: "Enterprise Systems",
    status: "solution-showcase",
    preview: "procurement",
    description:
      "Manage suppliers, purchase orders and inventory from a shared workspace.",
    challenge:
      "Purchasing, stock information and supplier conversations can become fragmented across inboxes and spreadsheets.",
    capabilities: [
      "Supplier directory",
      "Quotation requests",
      "Purchase orders and approvals",
      "Inventory visibility",
    ],
    technologies: ["Next.js", "Laravel", "PostgreSQL"],
    value:
      "Make purchases easier to track and give procurement teams a shared view of orders, suppliers and stock.",
  },
  {
    slug: "sales-forecasting-system",
    name: "Sales Forecasting System",
    category: "Data & Analytics",
    status: "solution-showcase",
    preview: "forecast",
    description:
      "Historical sales and demand forecasts for inventory and planning teams.",
    challenge:
      "Teams need to anticipate stock needs while understanding seasonality and the uncertainty in a forecast.",
    capabilities: [
      "Historical trend analysis",
      "Configurable forecast horizon",
      "Prediction range visualization",
      "Planning insights",
    ],
    technologies: ["Python", "scikit-learn", "PostgreSQL", "Recharts"],
    value:
      "Help planning teams compare likely demand with capacity and make better informed stock decisions.",
  },
  {
    slug: "corporate-digital-platform",
    name: "Corporate Digital Platform",
    category: "Web Applications",
    status: "solution-showcase",
    preview: "corporate",
    description:
      "Responsive corporate website with editorial workflows and inquiry capture.",
    challenge:
      "Growing organizations need a reliable home for their brand that staff can update as services and information change.",
    capabilities: [
      "Responsive, bilingual-ready design",
      "Editorial content management",
      "Search and social metadata",
      "Inquiry capture",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    value:
      "Give visitors a clear way to learn about the organization and give staff ownership of everyday updates.",
  },
  {
    slug: "e-commerce-platform",
    name: "E-Commerce Platform",
    category: "Web Applications",
    status: "solution-showcase",
    preview: "commerce",
    description:
      "A digital storefront with product, order and inventory management.",
    challenge:
      "A business needs to keep the storefront, available stock and order fulfillment in sync.",
    capabilities: [
      "Product catalog",
      "Checkout workflows",
      "Order tracking",
      "Inventory management",
    ],
    technologies: ["Next.js", "Laravel", "PostgreSQL"],
    value:
      "Make buying simpler for customers and give operations staff clearer visibility into stock and orders.",
  },
  {
    slug: "business-intelligence-platform",
    name: "Business Intelligence Platform",
    category: "Data & Analytics",
    status: "solution-showcase",
    preview: "intelligence",
    description:
      "Explore KPIs, demographic breakdowns, regional trends and reporting in one place.",
    challenge:
      "Teams need a consistent picture of progress across data sources, time periods and operating regions.",
    capabilities: [
      "KPI scorecards",
      "Date and program filters",
      "Demographic reporting",
      "Governorate-level exploration",
    ],
    technologies: ["React", "Recharts", "D3 Geo", "PostgreSQL"],
    value:
      "Help managers spot trends, understand where activity is concentrated and communicate results clearly.",
  },
  {
    slug: "intelligent-document-processing",
    name: "Intelligent Document Processing",
    category: "Artificial Intelligence",
    status: "solution-showcase",
    preview: "documents",
    description:
      "Automate extraction and classification for incoming invoices and documents.",
    challenge:
      "Manual sorting and data entry slow down teams that process documents in varied formats.",
    capabilities: [
      "Text and field extraction",
      "Document classification",
      "Field validation",
      "Human review queue",
    ],
    technologies: ["Python", "FastAPI", "OCR", "PostgreSQL"],
    value:
      "Reduce repetitive entry and surface uncertain or incomplete fields for staff to review.",
  },
  {
    slug: "field-operations-management",
    name: "Field Operations Management",
    category: "Mobile Applications",
    status: "solution-showcase",
    preview: "operations",
    description:
      "Assign tasks, coordinate field teams and track progress throughout the day.",
    challenge:
      "Distributed teams need clear assignments and a simple way to report work as it happens.",
    capabilities: [
      "Task assignment",
      "Mobile status updates",
      "Staff coordination",
      "Progress reporting",
    ],
    technologies: ["Flutter", "FastAPI", "PostgreSQL"],
    value:
      "Help staff see what needs attention and give coordinators a shared view of progress in the field.",
  },
];

export const getProject = (slug: string) =>
  projects.find((project) => project.slug === slug);
