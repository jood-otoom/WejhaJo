"use client";

import { useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  participation,
  programs,
  salesForecast,
  salesHistory,
} from "@/data/showcases";

const format = new Intl.NumberFormat("en");
const palette = {
  primary: "#2469e8",
  secondary: "#007c74",
  muted: "#63728c",
  grid: "#e1e8f4",
};

export function Forecast() {
  const [horizon, setHorizon] = useState(3);
  const projection = salesForecast.slice(0, horizon);
  const data = [...salesHistory, ...projection];
  const end = projection[projection.length - 1];

  return (
    <section
      className="demo-panel full-demo"
      aria-label="Sales forecasting dashboard"
    >
      <header className="demo-heading">
        <h3>Sales forecasting dashboard</h3>
        <span className="sample-label">Illustrative data</span>
      </header>
      <div className="dashboard-toolbar">
        <div className="demo-kpi">
          <span>Latest observed sales</span>
          <strong>
            {format.format(1480)} <small>units</small>
          </strong>
        </div>
        <div className="demo-kpi">
          <span>Forecast for {end.month}</span>
          <strong>
            {format.format(end.forecast)} <small>units</small>
          </strong>
        </div>
        <label className="demo-label">
          Forecast period
          <select
            value={horizon}
            onChange={(event) => setHorizon(Number(event.target.value))}
          >
            <option value={1}>1 month</option>
            <option value={3}>3 months</option>
            <option value={6}>6 months</option>
          </select>
        </label>
      </div>
      <div
        className="chart-frame"
        role="group"
        aria-label="Historical sales, projected sales and expected range"
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 15, left: 0, bottom: 5 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} stroke={palette.grid} />
            <XAxis
              dataKey="month"
              minTickGap={14}
              tick={{ fontSize: 12, fill: palette.muted }}
            />
            <YAxis width={42} tick={{ fontSize: 11, fill: palette.muted }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              name="Expected range"
              dataKey="range"
              fill="#deedff"
              stroke="none"
              isAnimationActive={false}
            />
            <Line
              name="Historical"
              dataKey="actual"
              type="monotone"
              stroke={palette.primary}
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              name="Forecast"
              dataKey="forecast"
              type="monotone"
              stroke={palette.secondary}
              strokeWidth={3}
              strokeDasharray="6 5"
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <details className="chart-data">
        <summary>View forecast data</summary>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Historical units</th>
              <th>Forecast units</th>
              <th>Expected range</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.month}>
                <th scope="row">{row.month}</th>
                <td>{"actual" in row ? row.actual : "—"}</td>
                <td>{row.forecast ?? "—"}</td>
                <td>{"range" in row ? row.range.join("–") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <p className="demo-note">
        Forecast values and uncertainty ranges are illustrative.
      </p>
    </section>
  );
}

type ParticipationTotals = {
  women: number;
  men: number;
  undisclosed: number;
  completed: number;
};
const demographics = [
  { key: "women", label: "Women", color: palette.primary },
  { key: "men", label: "Men", color: palette.secondary },
  { key: "undisclosed", label: "Not disclosed", color: "#8a62ce" },
] as const;
const months = [...new Set(participation.map(({ month }) => month))];

export function Intelligence() {
  const [range, setRange] = useState(6);
  const [program, setProgram] = useState("All programs");
  const periods = months.slice(-range);
  const data = periods.map((month) => {
    const chosen = participation.filter(
      (entry) =>
        entry.month === month &&
        (program === "All programs" || entry.program === program),
    );
    const values = chosen.reduce<ParticipationTotals>(
      (sum, row) => ({
        women: sum.women + row.women,
        men: sum.men + row.men,
        undisclosed: sum.undisclosed + row.undisclosed,
        completed: sum.completed + row.completed,
      }),
      { women: 0, men: 0, undisclosed: 0, completed: 0 },
    );
    return { month, ...values };
  });
  const total = (key: keyof ParticipationTotals) =>
    data.reduce((sum, row) => sum + row[key], 0);
  const participants = total("women") + total("men") + total("undisclosed");
  const completed = total("completed");
  const completion = Math.round((completed / participants) * 100);

  return (
    <section
      className="demo-panel full-demo"
      aria-label="Business intelligence dashboard"
    >
      <header className="demo-heading">
        <h3>Business intelligence dashboard</h3>
        <span className="sample-label">Illustrative data</span>
      </header>
      <div className="demo-controls dashboard-filters">
        <label className="demo-label">
          Date range
          <select
            value={range}
            onChange={(event) => setRange(Number(event.target.value))}
          >
            <option value={6}>May – October</option>
            <option value={3}>August – October</option>
            <option value={1}>October</option>
          </select>
        </label>
        <label className="demo-label">
          Program
          <select
            aria-label="Program"
            value={program}
            onChange={(event) => setProgram(event.target.value)}
          >
            <option>All programs</option>
            {programs.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="dashboard-toolbar" aria-live="polite">
        <div className="demo-kpi">
          <span>Participants</span>
          <strong>{format.format(participants)}</strong>
        </div>
        <div className="demo-kpi">
          <span>Completions</span>
          <strong>{format.format(completed)}</strong>
        </div>
        <div className="demo-kpi">
          <span>Completion rate</span>
          <strong>{completion}%</strong>
          <progress value={completion} max={100} aria-label="Completion rate" />
        </div>
      </div>
      <h4 className="chart-title">Participant demographics by month</h4>
      <div
        className="chart-frame"
        role="group"
        aria-label="Participant demographics by month"
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 16, bottom: 4, left: 0 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} stroke={palette.grid} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: palette.muted }}
            />
            <YAxis width={38} tick={{ fontSize: 11, fill: palette.muted }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {demographics.map(({ key, label, color }) => (
              <Bar
                key={key}
                dataKey={key}
                name={label}
                stackId="participants"
                fill={color}
                isAnimationActive={false}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <details className="chart-data">
        <summary>View demographic data</summary>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              {demographics.map(({ label }) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.month}>
                <th scope="row">{row.month}</th>
                {demographics.map(({ key }) => (
                  <td key={key}>{row[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}
