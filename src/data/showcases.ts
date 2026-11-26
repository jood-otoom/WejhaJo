export const impactMetrics = {
  reach: { label: "Reach", unit: "People reached" },
  programs: { label: "Programs", unit: "Active programs" },
  training: { label: "Training", unit: "Staff trained" },
} as const;

export type ImpactMetric = keyof typeof impactMetrics;
export const governorates = {
  "JO-AM": { name: "Amman", reach: 265, programs: 5, training: 54 },
  "JO-AJ": { name: "Ajloun", reach: 57, programs: 2, training: 13 },
  "JO-AQ": { name: "Aqaba", reach: 72, programs: 2, training: 12 },
  "JO-BA": { name: "Balqa", reach: 93, programs: 3, training: 18 },
  "JO-IR": { name: "Irbid", reach: 177, programs: 4, training: 38 },
  "JO-JA": { name: "Jerash", reach: 61, programs: 2, training: 17 },
  "JO-KA": { name: "Karak", reach: 68, programs: 2, training: 16 },
  "JO-MD": { name: "Madaba", reach: 68, programs: 2, training: 15 },
  "JO-MA": { name: "Mafraq", reach: 106, programs: 3, training: 26 },
  "JO-MN": { name: "Ma’an", reach: 58, programs: 1, training: 12 },
  "JO-AT": { name: "Tafilah", reach: 45, programs: 1, training: 10 },
  "JO-AZ": { name: "Zarqa", reach: 170, programs: 4, training: 49 },
} as const;

export type GovernorateId = keyof typeof governorates;

export const salesHistory = [
  { month: "Jan", actual: 742 },
  { month: "Feb", actual: 892 },
  { month: "Mar", actual: 865 },
  { month: "Apr", actual: 1034 },
  { month: "May", actual: 984 },
  { month: "Jun", actual: 1167 },
  { month: "Jul", actual: 1260 },
  { month: "Aug", actual: 1184 },
  { month: "Sep", actual: 1370 },
  { month: "Oct", actual: 1480, forecast: 1480 },
];
export const salesForecast = [
  { month: "Nov", forecast: 1540 },
  { month: "Dec", forecast: 1685 },
  { month: "Jan ’27", forecast: 1505 },
  { month: "Feb ’27", forecast: 1630 },
  { month: "Mar ’27", forecast: 1740 },
  { month: "Apr ’27", forecast: 1825 },
].map(({ month, forecast }, index) => ({
  month,
  forecast,
  range: [forecast - 80 - index * 17, forecast + 80 + index * 17],
}));

export const programs = ["Skills workshops", "Community outreach"] as const;
export const participation = [
  {
    month: "May",
    program: "Skills workshops",
    women: 44,
    men: 29,
    undisclosed: 2,
    completed: 62,
  },
  {
    month: "May",
    program: "Community outreach",
    women: 68,
    men: 48,
    undisclosed: 4,
    completed: 88,
  },
  {
    month: "Jun",
    program: "Skills workshops",
    women: 51,
    men: 24,
    undisclosed: 3,
    completed: 65,
  },
  {
    month: "Jun",
    program: "Community outreach",
    women: 65,
    men: 42,
    undisclosed: 4,
    completed: 89,
  },
  {
    month: "Jul",
    program: "Skills workshops",
    women: 57,
    men: 41,
    undisclosed: 3,
    completed: 87,
  },
  {
    month: "Jul",
    program: "Community outreach",
    women: 70,
    men: 50,
    undisclosed: 7,
    completed: 98,
  },
  {
    month: "Aug",
    program: "Skills workshops",
    women: 65,
    men: 33,
    undisclosed: 4,
    completed: 91,
  },
  {
    month: "Aug",
    program: "Community outreach",
    women: 66,
    men: 48,
    undisclosed: 5,
    completed: 105,
  },
  {
    month: "Sep",
    program: "Skills workshops",
    women: 63,
    men: 41,
    undisclosed: 4,
    completed: 93,
  },
  {
    month: "Sep",
    program: "Community outreach",
    women: 81,
    men: 60,
    undisclosed: 4,
    completed: 115,
  },
  {
    month: "Oct",
    program: "Skills workshops",
    women: 81,
    men: 52,
    undisclosed: 8,
    completed: 118,
  },
  {
    month: "Oct",
    program: "Community outreach",
    women: 90,
    men: 50,
    undisclosed: 6,
    completed: 124,
  },
];

export const sampleQuestions = [
  {
    question: "How do I onboard a new teammate?",
    answer:
      "Start with the staff onboarding checklist. The hiring manager assigns a buddy, requests system access, and schedules an orientation during the first week.",
    source: "Staff handbook",
    page: 4,
    excerpt:
      "The manager assigns an onboarding buddy and schedules orientation within the first week.",
  },
  {
    question: "Who approves a purchase request?",
    answer:
      "The department lead approves requests up to JOD 500. Larger requests also need sign-off from the procurement manager before an order can be placed.",
    source: "Procurement policy",
    page: 7,
    excerpt:
      "Requests above JOD 500 require the department lead and procurement manager to sign off.",
  },
  {
    question: "Where do I report a system issue?",
    answer:
      "Use the internal service desk. Include the affected system, the time it happened and the steps you were taking. Flag issues that stop a team from working as urgent.",
    source: "IT service guide",
    page: 2,
    excerpt:
      "Report incidents through the service desk with the system name, timestamp and reproduction steps.",
  },
] as const;

export const venues = [
  {
    id: "west",
    name: "West Amman Courts",
    sport: "Padel",
    area: "West Amman",
    price: 18,
    slots: ["16:00", "17:30", "19:00", "20:30"],
  },
  {
    id: "community",
    name: "Community Sports Hall",
    sport: "Basketball",
    area: "Central Amman",
    price: 14,
    slots: ["15:00", "16:30", "18:00"],
  },
  {
    id: "capital",
    name: "Capital Five-a-Side",
    sport: "Football",
    area: "East Amman",
    price: 22,
    slots: ["17:00", "18:30", "20:00"],
  },
] as const;

export const orders = [
  {
    id: "PO-1042",
    supplier: "Atlas Office Supplies",
    item: "Printer paper",
    total: 240,
    status: "Delivered",
  },
  {
    id: "PO-1043",
    supplier: "Cedar Packaging",
    item: "Shipping cartons",
    total: 680,
    status: "In transit",
  },
  {
    id: "PO-1044",
    supplier: "Summit Equipment",
    item: "Storage racks",
    total: 1250,
    status: "In review",
  },
  {
    id: "PO-1045",
    supplier: "Atlas Office Supplies",
    item: "Toner cartridges",
    total: 360,
    status: "In review",
  },
] as const;

export const suppliers = [
  {
    name: "Atlas Office Supplies",
    category: "Office essentials",
    status: "Approved",
    leadTime: "2 days",
  },
  {
    name: "Cedar Packaging",
    category: "Packaging",
    status: "Approved",
    leadTime: "4 days",
  },
  {
    name: "Summit Equipment",
    category: "Equipment",
    status: "Under review",
    leadTime: "7 days",
  },
] as const;

export const inventory = [
  { sku: "STK-081", name: "Printer paper", available: 42, reorder: 15 },
  { sku: "STK-082", name: "Shipping cartons", available: 12, reorder: 25 },
  { sku: "STK-083", name: "Toner cartridges", available: 23, reorder: 10 },
  { sku: "STK-084", name: "Storage racks", available: 4, reorder: 5 },
] as const;
