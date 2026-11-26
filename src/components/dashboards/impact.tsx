"use client";

import { geoArea, geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection, Polygon } from "geojson";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  governorates,
  impactMetrics,
  type GovernorateId,
  type ImpactMetric,
} from "@/data/showcases";

type RegionPaths = { id: GovernorateId; path: string }[];
const regions = Object.entries(governorates) as [
  GovernorateId,
  (typeof governorates)[GovernorateId],
][];
const metrics = Object.keys(impactMetrics) as ImpactMetric[];
const shades = ["#e0edff", "#c1d9ff", "#9dc3f7", "#78a9f0", "#548ce0"];
const format = new Intl.NumberFormat("en");

function projectBoundary(
  data: FeatureCollection<Polygon, { shapeISO: GovernorateId }>,
): RegionPaths {
  for (const feature of data.features) {
    if (geoArea(feature) > Math.PI * 2) {
      feature.geometry.coordinates = feature.geometry.coordinates.map((ring) =>
        [...ring].reverse(),
      );
    }
  }
  const draw = geoPath(
    geoMercator().fitExtent(
      [
        [8, 8],
        [252, 252],
      ],
      data,
    ),
  );
  return data.features.map((feature) => ({
    id: feature.properties.shapeISO,
    path: draw(feature) ?? "",
  }));
}

export function Impact() {
  const [selection, setSelection] = useState<GovernorateId | "">("");
  const [hover, setHover] = useState<GovernorateId | "">("");
  const [metric, setMetric] = useState<ImpactMetric>("reach");
  const [paths, setPaths] = useState<RegionPaths>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function loadMap() {
      try {
        const response = await fetch("/maps/jordan-governorates.geojson", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Map unavailable");
        const boundaries: FeatureCollection<
          Polygon,
          { shapeISO: GovernorateId }
        > = await response.json();
        setPaths(projectBoundary(boundaries));
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    void loadMap();
    return () => controller.abort();
  }, []);

  const total = regions.reduce((sum, [, region]) => sum + region[metric], 0);
  const maximum = Math.max(...regions.map(([, region]) => region[metric]));
  const value = selection ? governorates[selection][metric] : total;
  const displayed = selection
    ? regions.filter(([id]) => id === selection)
    : [...regions].sort(([, a], [, b]) => b[metric] - a[metric]).slice(0, 4);

  return (
    <section
      className="demo-panel impact-panel"
      aria-label="Program impact explorer"
    >
      <header className="demo-heading">
        <h3>Program impact explorer</h3>
        <span className="sample-label">Illustrative data</span>
      </header>
      <div className="demo-controls" role="group" aria-label="Impact metric">
        {metrics.map((item) => (
          <button
            type="button"
            key={item}
            className="filter"
            aria-pressed={item === metric}
            onClick={() => setMetric(item)}
          >
            {impactMetrics[item].label}
          </button>
        ))}
      </div>
      <div className="map-grid">
        <div>
          <div className="map-frame">
            {paths ? (
              <svg
                viewBox="0 0 260 260"
                className="jordan-map"
                role="group"
                aria-label="Map of Jordan’s governorates"
              >
                {paths.map(({ id, path }) => {
                  const region = governorates[id];
                  const shade =
                    shades[
                      Math.min(4, Math.floor((region[metric] / maximum) * 5))
                    ];
                  return (
                    <path
                      key={id}
                      d={path}
                      className="map-region"
                      role="button"
                      tabIndex={0}
                      aria-label={region.name}
                      aria-pressed={id === selection}
                      fill={id === selection ? "#193c78" : shade}
                      onClick={() => setSelection(id)}
                      onFocus={() => setHover(id)}
                      onBlur={() => setHover("")}
                      onPointerEnter={() => setHover(id)}
                      onPointerLeave={() => setHover("")}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelection(id);
                        }
                      }}
                    >
                      <title>
                        {region.name} · {format.format(region[metric])}{" "}
                        {impactMetrics[metric].unit.toLowerCase()}
                      </title>
                    </path>
                  );
                })}
              </svg>
            ) : (
              <p role="status">
                {error
                  ? "Map unavailable. Select a governorate to view its figures."
                  : "Loading governorate boundaries…"}
              </p>
            )}
            {hover && (
              <div className="map-tooltip" aria-hidden="true">
                {governorates[hover].name} ·{" "}
                {format.format(governorates[hover][metric])}
              </div>
            )}
          </div>
          <p className="map-credit">
            Boundaries by geoBoundaries and Wikimedia ·{" "}
            <a href="/maps/ATTRIBUTION.md">License</a>
          </p>
        </div>
        <div className="impact-summary">
          <label className="demo-label">
            Governorate
            <select
              value={selection}
              onChange={(event) =>
                setSelection(event.target.value as GovernorateId | "")
              }
            >
              <option value="">All governorates</option>
              {regions.map(([id, region]) => (
                <option value={id} key={id}>
                  {region.name}
                </option>
              ))}
            </select>
          </label>
          <div className="impact-value" aria-live="polite">
            <strong>{format.format(value)}</strong>
            <span>{impactMetrics[metric].unit}</span>
          </div>
          <div
            aria-label={
              selection
                ? "Selected governorate distribution"
                : "Highest totals by governorate"
            }
          >
            {displayed.map(([id, region]) => (
              <div className="impact-bar" key={id}>
                <div>
                  <span>{region.name}</span>
                  <span>{format.format(region[metric])}</span>
                </div>
                <span className="bar-track" aria-hidden="true">
                  <span
                    style={{
                      width: `${(region[metric] / maximum) * 100}%`,
                    }}
                  />
                </span>
              </div>
            ))}
          </div>
          <button
            className="text-link reset-map"
            type="button"
            disabled={!selection}
            onClick={() => setSelection("")}
          >
            <RotateCcw size={15} /> Reset selection
          </button>
        </div>
      </div>
      <p className="demo-note">
        The figures are sample data for exploring the interface.
      </p>
    </section>
  );
}
