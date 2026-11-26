"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { ProjectPreview } from "@/data/projects";

function LoadingPreview() {
  return (
    <p className="preview-loading" role="status">
      Loading interactive preview…
    </p>
  );
}

const Impact = dynamic(() => import("./impact").then(({ Impact }) => Impact), {
  ssr: false,
  loading: LoadingPreview,
});
const Intelligence = dynamic(
  () => import("./charts").then(({ Intelligence }) => Intelligence),
  { ssr: false, loading: LoadingPreview },
);
const Forecast = dynamic(
  () => import("./charts").then(({ Forecast }) => Forecast),
  { ssr: false, loading: LoadingPreview },
);
const Knowledge = dynamic(
  () => import("./workspaces").then(({ Knowledge }) => Knowledge),
  { ssr: false, loading: LoadingPreview },
);
const Booking = dynamic(
  () => import("./workspaces").then(({ Booking }) => Booking),
  { ssr: false, loading: LoadingPreview },
);
const Procurement = dynamic(
  () => import("./workspaces").then(({ Procurement }) => Procurement),
  { ssr: false, loading: LoadingPreview },
);

function NearViewport({ children }: { children: ReactNode }) {
  const anchor = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!anchor.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(anchor.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={anchor} className="impact-slot">
      {visible ? children : <LoadingPreview />}
    </div>
  );
}

export function ImpactPreview() {
  return (
    <NearViewport>
      <Impact />
    </NearViewport>
  );
}

export function ProjectShowcase({ kind }: { kind: ProjectPreview }) {
  switch (kind) {
    case "booking":
      return <Booking />;
    case "knowledge":
      return <Knowledge />;
    case "procurement":
      return <Procurement />;
    case "forecast":
      return <Forecast />;
    case "intelligence":
      return (
        <>
          <Intelligence />
          <ImpactPreview />
        </>
      );
    default:
      return null;
  }
}
