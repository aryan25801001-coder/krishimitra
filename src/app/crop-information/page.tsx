import type { Metadata } from "next";
import Link from "next/link";
import { Droplets, Thermometer, Wind, Leaf, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Crop Information",
  description:
    "Detailed agronomic profiles for major Indian crops — water requirements, optimal soil types, typical pests, and seasonal guidance.",
};

const CROPS = [
  {
    name: "Rice",
    season: "Kharif",
    waterNeed: "High (1,200–2,000 mm)",
    soilType: "Heavy clayey or loamy soils with good water retention",
    optimalTemp: "20–35°C",
    majorPests: "Brown plant hopper, stem borer, blast disease",
    yieldRange: "2,000–6,500 kg/ha (varies by variety and irrigation)",
    notes:
      "Transplanted paddy accounts for most production. Direct-seeded rice is expanding in Punjab and Haryana to address labour and water concerns.",
    source: "ICAR Rice Knowledge Management Portal",
  },
  {
    name: "Wheat",
    season: "Rabi",
    waterNeed: "Moderate (450–650 mm, 4–5 irrigations)",
    soilType: "Well-drained loam or clay-loam, pH 6–7.5",
    optimalTemp: "10–25°C (cool during grain filling)",
    majorPests: "Yellow rust, Karnal bunt, aphids",
    yieldRange: "2,500–5,500 kg/ha",
    notes:
      "Heat stress during grain filling (March–April) is a major risk in central India. Timely sowing (November) is critical for yield.",
    source: "ICAR-IIWBR Wheat Cultivation Guide",
  },
  {
    name: "Maize",
    season: "Kharif / Rabi",
    waterNeed: "Moderate (500–800 mm)",
    soilType: "Well-drained sandy loam to loam soils",
    optimalTemp: "18–32°C",
    majorPests: "Fall armyworm, maize stem borer, turcicum blight",
    yieldRange: "2,500–7,000 kg/ha",
    notes:
      "Fall armyworm (Spodoptera frugiperda) has spread rapidly across India since 2018. Early monitoring is essential.",
    source: "ICAR-IIMR Maize Research",
  },
  {
    name: "Sorghum (Jowar)",
    season: "Kharif / Rabi",
    waterNeed: "Low–Moderate (400–600 mm)",
    soilType: "Deep black cotton soil (Vertisols), also sandy loam",
    optimalTemp: "25–35°C",
    majorPests: "Shoot fly, midge, charcoal rot",
    yieldRange: "800–3,500 kg/ha",
    notes:
      "Drought-tolerant and suitable for semi-arid regions. Rabi jowar (Maharashtra) is important for food security in dry areas.",
    source: "ICAR-IIMR Sorghum Guide",
  },
  {
    name: "Chickpea (Chana)",
    season: "Rabi",
    waterNeed: "Low (300–450 mm)",
    soilType: "Well-drained sandy loam to medium black soils",
    optimalTemp: "15–25°C",
    majorPests: "Pod borer (Helicoverpa), wilt (Fusarium), stunt virus",
    yieldRange: "700–2,500 kg/ha",
    notes:
      "Largest pulse crop in India. Desi varieties dominate; kabuli types are grown for export. Frost risk during flowering in north India.",
    source: "ICAR-IIPR Pulse Cultivation Guides",
  },
  {
    name: "Groundnut",
    season: "Kharif",
    waterNeed: "Moderate (500–700 mm)",
    soilType: "Well-drained sandy loam, light-textured soils",
    optimalTemp: "25–30°C",
    majorPests: "Leaf miner, tikka disease, stem rot",
    yieldRange: "1,000–3,500 kg/ha (pod yield)",
    notes:
      "Gujarat, Andhra Pradesh, and Rajasthan are the major producing states. Aflatoxin contamination is a quality concern in stored groundnuts.",
    source: "ICAR-NRCG Groundnut Research",
  },
  {
    name: "Cotton",
    season: "Kharif",
    waterNeed: "High (700–1,200 mm)",
    soilType: "Deep black cotton soils (Vertisols)",
    optimalTemp: "21–30°C",
    majorPests: "Pink bollworm, whitefly (Bemisia tabaci — sucking pest), bacterial blight",
    yieldRange: "300–800 kg/ha (lint)",
    notes:
      "Bt cotton dominates area in India. Pink bollworm resistance to Bt protein is a documented concern requiring management.",
    source: "ICAR-CICR Cotton Research",
  },
  {
    name: "Sugarcane",
    season: "Annual / Adsali",
    waterNeed: "Very High (1,500–2,500 mm or equivalent irrigation)",
    soilType: "Deep, well-drained loamy to sandy loam soils",
    optimalTemp: "20–35°C",
    majorPests: "Top borer, pyrilla, red rot disease",
    yieldRange: "60–120 tonnes/ha (cane; not sugar)",
    notes:
      "Maharashtra, Uttar Pradesh, and Karnataka are the leading states. Water-intensive crop; drip irrigation adoption is increasing.",
    source: "ICAR-SBI Sugarcane Research",
  },
];

const SEASON_COLOR: Record<string, string> = {
  "Kharif": "badge-green",
  "Rabi": "badge-neutral",
  "Annual / Adsali": "badge-amber",
  "Kharif / Rabi": "badge-neutral",
};

export default function CropInformationPage() {
  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="section-container">
        {/* Page header */}
        <header style={{ marginBottom: "2.5rem" }}>
          <span className="badge badge-green" style={{ marginBottom: "0.75rem" }}>
            Agronomic Data
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
            Crop Information
          </h1>
          <p style={{ color: "var(--color-neutral-600)", fontSize: "1.0625rem", lineHeight: 1.65, maxWidth: "600px" }}>
            Agronomic profiles for major Indian crops, compiled from ICAR
            research publications and government extension materials. All
            data is publicly available.
          </p>
        </header>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.25rem",
            marginBottom: "2rem",
            padding: "0.875rem 1.125rem",
            background: "var(--color-neutral-50)",
            borderRadius: 8,
            border: "1px solid var(--color-border)",
            fontSize: "0.8125rem",
          }}
        >
          <span style={{ fontWeight: 600, color: "var(--color-neutral-600)" }}>Season key:</span>
          <span className="badge badge-green">Kharif (Jun–Oct)</span>
          <span className="badge badge-neutral">Rabi (Nov–Apr)</span>
          <span className="badge badge-amber">Annual / Adsali</span>
        </div>

        {/* Crop grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {CROPS.map((crop) => (
            <article key={crop.name} className="card">
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontWeight: 800,
                      fontSize: "1.125rem",
                      color: "var(--color-neutral-900)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {crop.name}
                  </h2>
                  <span className={`badge ${SEASON_COLOR[crop.season] ?? "badge-neutral"}`}>
                    {crop.season}
                  </span>
                </div>
                <span aria-hidden="true" style={{ color: "var(--color-primary)", opacity: 0.7 }}>
                  <Leaf size={20} strokeWidth={1.75} />
                </span>
              </div>

              <dl
                style={{
                  display: "grid",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <Droplets size={14} style={{ flexShrink: 0, marginTop: "2px", color: "#3b82f6" }} aria-hidden="true" />
                  <div>
                    <dt style={{ display: "inline", fontWeight: 600, color: "var(--color-neutral-700)" }}>Water: </dt>
                    <dd style={{ display: "inline", color: "var(--color-neutral-600)" }}>{crop.waterNeed}</dd>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <Thermometer size={14} style={{ flexShrink: 0, marginTop: "2px", color: "#ef4444" }} aria-hidden="true" />
                  <div>
                    <dt style={{ display: "inline", fontWeight: 600, color: "var(--color-neutral-700)" }}>Temperature: </dt>
                    <dd style={{ display: "inline", color: "var(--color-neutral-600)" }}>{crop.optimalTemp}</dd>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <Wind size={14} style={{ flexShrink: 0, marginTop: "2px", color: "var(--color-neutral-400)" }} aria-hidden="true" />
                  <div>
                    <dt style={{ display: "inline", fontWeight: 600, color: "var(--color-neutral-700)" }}>Soil: </dt>
                    <dd style={{ display: "inline", color: "var(--color-neutral-600)" }}>{crop.soilType}</dd>
                  </div>
                </div>

                <div style={{ marginTop: "0.25rem" }}>
                  <dt style={{ fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: "0.2rem" }}>Yield Range</dt>
                  <dd style={{ color: "var(--color-neutral-600)" }}>{crop.yieldRange}</dd>
                </div>

                <div>
                  <dt style={{ fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: "0.2rem" }}>Major Pests & Diseases</dt>
                  <dd style={{ color: "var(--color-neutral-600)" }}>{crop.majorPests}</dd>
                </div>

                <div
                  style={{
                    background: "var(--color-green-50)",
                    borderRadius: 6,
                    padding: "0.625rem 0.75rem",
                    marginTop: "0.25rem",
                  }}
                >
                  <dt style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--color-green-700)", marginBottom: "0.2rem" }}>Key Note</dt>
                  <dd style={{ fontSize: "0.8125rem", color: "var(--color-green-700)", lineHeight: 1.6 }}>{crop.notes}</dd>
                </div>

                <dd style={{ fontSize: "0.75rem", color: "var(--color-muted)", marginTop: "0.25rem" }}>
                  Source: {crop.source}
                </dd>
              </dl>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: "3rem",
            padding: "2rem",
            background: "var(--color-neutral-50)",
            borderRadius: 10,
            border: "1px solid var(--color-border)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--color-neutral-900)", marginBottom: "0.375rem" }}>
              Run a yield or risk assessment for these crops
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-600)" }}>
              Use the assessment tools to get district-specific data for any of the crops above.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/yield-assessment" className="btn btn-primary btn-sm">
              Yield Assessment <ArrowRight size={14} />
            </Link>
            <Link href="/risk-assessment" className="btn btn-outline btn-sm">
              Risk Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
