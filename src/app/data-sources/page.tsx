import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Data Sources",
  description:
    "Full transparency on every dataset used in KrishiMitra — government portals, research institutes, and open data licenses.",
};

const DATA_SOURCES = [
  {
    category: "Crop Yield Data",
    sources: [
      {
        name: "ICRISAT District Level Data (VDSA)",
        org: "International Crops Research Institute for the Semi-Arid Tropics",
        description:
          "District-level area, production, and yield data for major crops in India covering 1966–2017. Includes Kharif, Rabi, and Zaid seasons. Freely available under Creative Commons.",
        coverage: "District level · 580+ districts · 1966–2017",
        url: "http://vdsa.icrisat.ac.in/vdsa-database.htm",
        license: "Creative Commons (CC BY-SA 4.0)",
        format: "CSV / Excel",
      },
      {
        name: "MoAFW Area, Production and Yield Statistics",
        org: "Ministry of Agriculture & Farmers Welfare, Government of India",
        description:
          "Annual state-wise and all-India area, production, and yield for principal crops. Published yearly in the Agricultural Statistics at a Glance report.",
        coverage: "State level · All India · 1950–present",
        url: "https://agricoop.nic.in/en/statistics",
        license: "Government Open Data (NDSAP-compliant)",
        format: "PDF / Excel",
      },
    ],
  },
  {
    category: "Rainfall & Climate",
    sources: [
      {
        name: "IMD Gridded Rainfall Data",
        org: "India Meteorological Department",
        description:
          "Daily gridded rainfall dataset at 0.25° resolution covering 1901–present. Used to compute seasonal rainfall totals and drought indices at district level.",
        coverage: "0.25° grid · India · 1901–present",
        url: "https://www.imdpune.gov.in/Clim_Pred_LRF_New/Grided_Data_Download.html",
        license: "IMD Data Policy — free for research use",
        format: "Binary Grid / NetCDF",
      },
      {
        name: "IMD District-wise Seasonal Rainfall",
        org: "India Meteorological Department",
        description:
          "Pre-aggregated district-level seasonal (JJAS, OND, DJF, MAM) rainfall normals and anomalies. Used to compute rainfall deficit frequency.",
        coverage: "District level · 1951–present",
        url: "https://mausam.imd.gov.in",
        license: "IMD Data Policy",
        format: "CSV",
      },
    ],
  },
  {
    category: "Market Price Data",
    sources: [
      {
        name: "eNAM — National Agriculture Market",
        org: "Small Farmers Agribusiness Consortium (SFAC), Ministry of Commerce",
        description:
          "Daily arrival and modal price data from 1,000+ regulated mandis across India. Used to compute price volatility (coefficient of variation) for each crop.",
        coverage: "Mandi level · 1,000+ APMCs · 2016–present",
        url: "https://www.enam.gov.in/web/",
        license: "Government Open Data (NDSAP)",
        format: "API / CSV",
      },
      {
        name: "Agmarknet Daily Price Data",
        org: "Directorate of Marketing & Inspection, MoAFW",
        description:
          "Historical mandi arrival and price records for all registered agricultural markets in India. Used as a secondary source for price trend analysis.",
        coverage: "Mandi level · All India · 2001–present",
        url: "https://agmarknet.gov.in",
        license: "Government Open Data",
        format: "CSV / Web portal",
      },
    ],
  },
  {
    category: "Soil & Land Use",
    sources: [
      {
        name: "NBSS&LUP Soil Resource Database",
        org: "National Bureau of Soil Survey & Land Use Planning, ICAR",
        description:
          "Digital soil maps and attribute data covering soil type, texture, pH, organic carbon, and fertility constraints at district and tehsil level.",
        coverage: "District / tehsil · All India",
        url: "https://www.nbsslup.in",
        license: "Research use with attribution",
        format: "Shapefile / PDF",
      },
      {
        name: "NRSC Land Use Land Cover Maps",
        org: "National Remote Sensing Centre, ISRO",
        description:
          "Satellite-derived land use classification at 1:50,000 scale. Used to identify flood-prone and degraded agricultural land zones.",
        coverage: "1:50,000 scale · All India · 2015–16 and later",
        url: "https://bhuvan.nrsc.gov.in",
        license: "Open — Government of India",
        format: "Raster / Shapefile",
      },
    ],
  },
  {
    category: "Flood Hazard",
    sources: [
      {
        name: "NRSC National Flood Hazard Atlas",
        org: "National Remote Sensing Centre, ISRO / NDMA",
        description:
          "District-level flood frequency and inundation extent derived from multi-year satellite analysis. Used to classify districts into flood risk categories.",
        coverage: "District level · All India",
        url: "https://bhuvan.nrsc.gov.in",
        license: "Open — Government of India",
        format: "Shapefile / Atlas PDF",
      },
    ],
  },
];

export default function DataSourcesPage() {
  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="section-container">
        <header style={{ marginBottom: "2rem" }}>
          <span className="badge badge-neutral" style={{ marginBottom: "0.75rem" }}>
            Transparency
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
            Data Sources
          </h1>
          <p style={{ color: "var(--color-neutral-600)", fontSize: "1.0625rem", lineHeight: 1.65, maxWidth: "640px" }}>
            Every dataset used in KrishiMitra is sourced from publicly
            available government or CGIAR databases. We do not generate,
            modify, or fabricate data. All sources are cited below with
            direct links to the originating institution.
          </p>
        </header>

        <div className="alert alert-success" style={{ marginBottom: "2.5rem" }}>
          <strong>Commitment:</strong> No data in this system is invented,
          averaged from non-existent records, or obtained from unverified
          third parties. Every number can be traced to a source linked below.
        </div>

        {DATA_SOURCES.map((cat) => (
          <section key={cat.category} aria-labelledby={`cat-${cat.category}`} style={{ marginBottom: "3rem" }}>
            <h2
              id={`cat-${cat.category}`}
              style={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "var(--color-neutral-900)",
                marginBottom: "1rem",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid var(--color-green-200)",
              }}
            >
              {cat.category}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {cat.sources.map((src) => (
                <div key={src.name} className="card">
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "var(--color-neutral-900)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {src.name}
                      </h3>
                      <p style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>
                        {src.org}
                      </p>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      aria-label={`Visit ${src.name} (opens in new tab)`}
                      style={{ flexShrink: 0 }}
                    >
                      Visit Source
                      <ExternalLink size={13} />
                    </a>
                  </div>

                  <p style={{ fontSize: "0.9rem", color: "var(--color-neutral-600)", lineHeight: 1.65, marginBottom: "0.875rem" }}>
                    {src.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                      fontSize: "0.8125rem",
                    }}
                  >
                    <span>
                      <strong style={{ color: "var(--color-neutral-700)" }}>Coverage:</strong>{" "}
                      <span style={{ color: "var(--color-muted)" }}>{src.coverage}</span>
                    </span>
                    <span>
                      <strong style={{ color: "var(--color-neutral-700)" }}>License:</strong>{" "}
                      <span style={{ color: "var(--color-muted)" }}>{src.license}</span>
                    </span>
                    <span>
                      <strong style={{ color: "var(--color-neutral-700)" }}>Format:</strong>{" "}
                      <span style={{ color: "var(--color-muted)" }}>{src.format}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Planned additions */}
        <div className="card" style={{ borderLeft: "4px solid var(--color-primary)" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem", color: "var(--color-neutral-900)" }}>
            Planned for Phase 2
          </h2>
          <ul style={{ paddingLeft: "1.25rem", color: "var(--color-neutral-600)", fontSize: "0.9rem", lineHeight: 1.8 }}>
            <li>PM-KISAN beneficiary district data (aggregated, no PII) — for farm-size distribution analysis</li>
            <li>Fasal Bima Yojana (PMFBY) claim data — for crop insurance risk benchmarking</li>
            <li>ICAR Crop Calendar — to map sowing/harvesting windows by district</li>
            <li>OpenWeatherMap historical API — for recent (2021–present) rainfall supplement</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
