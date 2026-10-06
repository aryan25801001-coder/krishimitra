import type { Metadata } from "next";
import { BarChart3, Database, Map, TrendingUp, AlertTriangle, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Visual summaries of district-level crop performance and agricultural risk indicators from open government datasets.",
};

const METRIC_CARDS = [
  {
    label: "Districts Covered",
    value: "578",
    sub: "Across 28 states — ICRISAT district data",
    icon: Map,
  },
  {
    label: "Crop Records",
    value: "3,600+",
    sub: "Season-crop-district combinations — MoAFW",
    icon: TrendingUp,
  },
  {
    label: "Years of Data",
    value: "1990–2020",
    sub: "30-year historical window — ICRISAT VDSA",
    icon: Database,
  },
  {
    label: "Risk Indicators",
    value: "4",
    sub: "Drought, Flood, Price, Soil — multi-source",
    icon: AlertTriangle,
  },
];

const PLANNED_CHARTS = [
  {
    title: "State-wise Average Yield (kg/ha)",
    description:
      "Bar chart comparing mean wheat and rice yields per state across the 1990–2020 period from MoAFW production statistics.",
    datasource: "MoAFW Annual Reports",
  },
  {
    title: "Rainfall Deficit Frequency by District",
    description:
      "Heatmap showing how often each district experienced below-normal rainfall (IMD definition: >19% deficit) since 2000.",
    datasource: "IMD Gridded Rainfall Data",
  },
  {
    title: "Crop Price Coefficient of Variation",
    description:
      "Horizontal bar chart showing price volatility (CV) for major crops in the last 5 years of eNAM mandi price records.",
    datasource: "eNAM Market Data",
  },
  {
    title: "Year-on-Year Yield Trend",
    description:
      "Line chart showing district yield trend for a selected crop and season over the full data window.",
    datasource: "ICRISAT District Level Data",
  },
];

function SkeletonChart({ title, description, datasource }: { title: string; description: string; datasource: string }) {
  return (
    <div className="card">
      <div style={{ marginBottom: "1rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-neutral-900)", marginBottom: "0.375rem" }}>
          {title}
        </h3>
        <p style={{ fontSize: "0.8125rem", color: "var(--color-muted)", lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
      {/* Skeleton chart area */}
      <div
        aria-label="Chart loading — will be available in Phase 2"
        role="img"
        style={{
          height: 180,
          borderRadius: 8,
          background: "var(--color-neutral-50)",
          border: "1px dashed var(--color-neutral-200)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          color: "var(--color-neutral-400)",
          fontSize: "0.8125rem",
        }}
      >
        <BarChart3 size={28} strokeWidth={1.5} />
        <span>Chart loads in Phase 2</span>
      </div>
      <p
        style={{
          marginTop: "0.625rem",
          fontSize: "0.75rem",
          color: "var(--color-muted)",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
        }}
      >
        <Info size={12} />
        Source: {datasource}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="section-container">
        {/* Header */}
        <header style={{ marginBottom: "2rem" }}>
          <span className="badge badge-neutral" style={{ marginBottom: "0.75rem" }}>
            Data Overview
          </span>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--color-neutral-900)",
              letterSpacing: "-0.025em",
              marginBottom: "0.625rem",
            }}
          >
            Agricultural Data Dashboard
          </h1>
          <p style={{ color: "var(--color-neutral-600)", fontSize: "1.0625rem", lineHeight: 1.65, maxWidth: "620px" }}>
            A visual overview of district-level crop performance and risk
            indicators sourced from publicly available government datasets.
            Charts activate in Phase 2.
          </p>
        </header>

        <div className="alert alert-info" style={{ marginBottom: "2.5rem" }}>
          <strong>Phase 1 scaffold:</strong> The metric cards below reflect the
          real scope of the datasets. Chart rendering with live data will be
          connected in Phase 2 once the PostgreSQL database and API routes are
          built.
        </div>

        {/* Metric cards */}
        <section aria-labelledby="metrics-heading" style={{ marginBottom: "3rem" }}>
          <h2
            id="metrics-heading"
            style={{
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--color-neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "1rem",
            }}
          >
            Dataset Scope
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {METRIC_CARDS.map(({ label, value, sub, icon: Icon }) => (
              <div
                key={label}
                className="card"
                style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {label}
                  </span>
                  <span style={{ color: "var(--color-primary)" }} aria-hidden="true">
                    <Icon size={16} strokeWidth={2} />
                  </span>
                </div>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-neutral-900)", lineHeight: 1 }}>
                  {value}
                </span>
                <span style={{ fontSize: "0.8125rem", color: "var(--color-neutral-500)", lineHeight: 1.5 }}>
                  {sub}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Chart placeholders */}
        <section aria-labelledby="charts-heading">
          <h2
            id="charts-heading"
            style={{
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--color-neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "1rem",
            }}
          >
            Planned Visualisations
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {PLANNED_CHARTS.map((c) => (
              <SkeletonChart key={c.title} {...c} />
            ))}
          </div>
        </section>

        {/* Methodology */}
        <div className="card" style={{ marginTop: "2.5rem", borderLeft: "4px solid var(--color-primary)" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem", color: "var(--color-neutral-900)" }}>
            How the Dashboard Will Work in Phase 2
          </h2>
          <ol style={{ paddingLeft: "1.25rem", color: "var(--color-neutral-600)", fontSize: "0.9rem", lineHeight: 1.75 }}>
            <li>Raw government CSVs are ingested into PostgreSQL via a Prisma migration.</li>
            <li>Next.js API routes query the database and return aggregated JSON.</li>
            <li>A charting library (e.g., Recharts or Chart.js) renders the data client-side.</li>
            <li>Filters for state, district, crop, and year will allow drill-down.</li>
            <li>All chart data is downloadable as CSV for offline use.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
