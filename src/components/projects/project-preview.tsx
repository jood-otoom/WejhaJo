import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  ChartNoAxesCombined,
  CircleCheck,
  ClipboardList,
  FileText,
  Globe2,
  LayoutGrid,
  MessageSquare,
  Package,
  Search,
  Sparkles,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import type { ProjectPreview as Preview } from "@/data/projects";

const details = {
  booking: {
    title: "GoTime",
    label: "Find your game",
    icon: Trophy,
    tone: "green",
  },
  knowledge: {
    title: "Knowledge workspace",
    label: "Ask your documents",
    icon: Sparkles,
    tone: "blue",
  },
  support: {
    title: "Customer inbox",
    label: "Conversation overview",
    icon: MessageSquare,
    tone: "purple",
  },
  procurement: {
    title: "Procurement",
    label: "Purchase orders",
    icon: Package,
    tone: "amber",
  },
  forecast: {
    title: "Sales planner",
    label: "Demand forecast",
    icon: ChartNoAxesCombined,
    tone: "blue",
  },
  corporate: {
    title: "Digital workspace",
    label: "Content manager",
    icon: Globe2,
    tone: "purple",
  },
  intelligence: {
    title: "Reporting studio",
    label: "Performance overview",
    icon: Activity,
    tone: "blue",
  },
  documents: {
    title: "Document workspace",
    label: "Extraction review",
    icon: FileText,
    tone: "purple",
  },
  operations: {
    title: "Field operations",
    label: "Today's assignments",
    icon: ClipboardList,
    tone: "amber",
  },
} satisfies Record<
  Preview,
  { title: string; label: string; icon: typeof Activity; tone: string }
>;

const lists = {
  procurement: [
    ["PO-1042", "Delivered"],
    ["PO-1043", "In transit"],
    ["PO-1044", "In review"],
  ],
  corporate: [
    ["Home", "Published"],
    ["Services", "Published"],
    ["About", "Draft"],
  ],
  documents: [
    ["Invoice number", "INV-042"],
    ["Document type", "Invoice"],
    ["Review status", "Ready"],
  ],
  operations: [
    ["Site inspection", "Complete"],
    ["Equipment check", "In progress"],
    ["Team briefing", "Scheduled"],
  ],
} as const;

function InterfaceBody({ kind }: { kind: Preview }) {
  if (kind === "booking") {
    return (
      <>
        <div className="mock-court">
          <span />
          <Trophy size={16} />
        </div>
        <div className="mock-row">
          <span>West Amman Courts</span>
          <span className="mock-pill">Padel</span>
        </div>
        <div className="mock-slots">
          <CalendarDays size={12} />
          <span>16:00</span>
          <span>17:30</span>
          <span>19:00</span>
        </div>
      </>
    );
  }
  if (kind === "knowledge" || kind === "support") {
    return (
      <>
        <div className="mock-bubble">
          <Search size={12} />
          {kind === "knowledge"
            ? "What is our onboarding process?"
            : "Can I update my booking?"}
        </div>
        <div className="mock-answer">
          <CircleCheck size={12} />
          <span>
            {kind === "knowledge"
              ? "Start with the staff checklist."
              : "Open your reservation to make a change."}
          </span>
        </div>
        <div className="mock-reference">
          <FileText size={12} />
          {kind === "knowledge" ? "Staff handbook · p. 4" : "English · Arabic"}
        </div>
      </>
    );
  }
  if (kind === "forecast" || kind === "intelligence") {
    return (
      <>
        <div className="mock-stat">
          <strong>{kind === "forecast" ? "1,480" : "84%"}</strong>
          <span>
            <ArrowUpRight size={12} />{" "}
            {kind === "forecast" ? "Forecast units" : "Completion rate"}
          </span>
        </div>
        <div className="mock-chart">
          {kind === "forecast" ? (
            <svg viewBox="0 0 200 44" preserveAspectRatio="none">
              <path
                d="M1 36 26 29 49 32 72 19 97 24 120 11"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                d="M120 11 144 15 169 7 199 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
            </svg>
          ) : (
            [38, 52, 44, 73, 61, 88, 75, 98, 85].map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} />
            ))
          )}
        </div>
      </>
    );
  }
  return (
    <div className="mock-list">
      {lists[kind].map(([name, status]) => (
        <div className="mock-row" key={name}>
          <span>{name}</span>
          <span className="mock-pill">{status}</span>
        </div>
      ))}
    </div>
  );
}

export function ProjectPreview({ kind }: { kind: Preview }) {
  const { title, label, icon: Icon, tone } = details[kind];
  return (
    <div className={`project-preview tone-${tone}`} aria-hidden="true">
      <div className="mock-window">
        <div className="mock-top">
          <Icon size={13} />
          <span>{title}</span>
          <span className="mock-dots">•••</span>
        </div>
        <div className="mock-content">
          <div className="mock-side">
            <LayoutGrid size={12} />
            <Icon size={12} />
            <Users size={12} />
            <Timer size={12} />
          </div>
          <div className="mock-main">
            <strong className="mock-label">{label}</strong>
            <InterfaceBody kind={kind} />
          </div>
        </div>
      </div>
    </div>
  );
}
