"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { processSteps } from "@/data/company";

export function ProcessTimeline() {
  const [selected, setSelected] = useState(0);
  const step = processSteps[selected];

  return (
    <div className="process">
      <ol className="process-controls" aria-label="Development stages">
        {processSteps.map(({ name }, index) => (
          <li key={name}>
            <button
              aria-pressed={selected === index}
              aria-controls="process-description"
              type="button"
              onClick={() => setSelected(index)}
            >
              <span className="step-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{name}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="process-detail" id="process-description">
        <div aria-live="polite">
          <h3>{step.name}</h3>
          <p>{step.description}</p>
        </div>
        {selected < processSteps.length - 1 && (
          <button
            className="button button-light"
            type="button"
            onClick={() => setSelected(selected + 1)}
          >
            Next stage <ArrowRight size={17} />
          </button>
        )}
      </div>
    </div>
  );
}
