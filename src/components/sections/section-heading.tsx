import type { ReactNode } from "react";

export function SectionHeading({
  label,
  title,
  children,
  id,
}: {
  label: string;
  title: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{label}</p>
      <h2 id={id}>{title}</h2>
      {children && <p className="section-intro">{children}</p>}
    </div>
  );
}
