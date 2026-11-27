"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useRef, useState } from "react";

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
