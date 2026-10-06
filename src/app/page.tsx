import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import {
  TrendingUp,
  ShieldAlert,
  BarChart3,
  Leaf,
  Database,
  HelpCircle,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Crop Yield & Farmer Risk Advising`,
  description:
    "KrishiMitra helps Indian farmers understand crop yield potential and agricultural risks using real government datasets and data-driven recommendations.",
};

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Crop Yield Assessment",
    description:
      "Enter your district, crop, and season to get yield potential estimates derived from historical ICRISAT and MoAFW data.",
    href: "/yield-assessment",
  },
  {
    icon: ShieldAlert,
    title: "Farmer Risk Assessment",
    description:
      "Understand drought, flood, price-volatility, and soil-degradation risks for your specific region and crop combination.",
    href: "/risk-assessment",
  },
  {
    icon: BarChart3,
    title: "Interactive Dashboard",
    description:
      "Visual summaries of district-level crop performance and risk indicators drawn from open agricultural datasets.",
    href: "/dashboard",
  },
  {
    icon: Leaf,
    title: "Crop Information",
    description:
      "Detailed agronomic profiles for major Kharif, Rabi, and Zaid crops — water needs, soil types, pest risks, and more.",
    href: "/crop-information",
  },
  {
    icon: Database,
    title: "Data Sources",
    description:
      "Full transparency on every dataset used — government portals, research institutes, and open data licenses.",
    href: "/data-sources",
  },
  {
    icon: HelpCircle,
    title: "FAQ",
    description:
      "Answers to common questions about how yield estimates work, data accuracy, and how to use the tools.",
    href: "/faq",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Select your crop and location",
    body: "Choose your state, district, crop name, and growing season from the dropdown menus.",
  },
  {
    step: "2",
    title: "Review data-driven insights",
    body: "The system queries historical yield records and climate data to generate estimates and risk profiles.",
  },
  {
    step: "3",
    title: "Understand the reasoning",
    body: "Every output shows which data points influenced the result, so you know why a recommendation was made.",
  },
  {
    step: "4",
    title: "Download or share your report",
    body: "Export a plain-language summary to share with your bank, KVK, or cooperative.",
  },
];

const DATA_BADGES = [
  "ICRISAT District Data",
  "MoAFW Production Statistics",
  "IMD Rainfall Records",
  "NRSC Land Use Data",
  "eNAM Price Data",
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero-heading"
        style={{
          background: "linear-gradient(160deg, #f0faf0 0%, #ffffff 60%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "5rem 0 4rem",
        }}
      >
        <div className="section-container">
          <div style={{ maxWidth: "640px" }}>
            <span className="badge badge-green" style={{ marginBottom: "1rem" }}>
              Internship Research Project
            </span>
            <h1
              id="hero-heading"
              style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 800,
                color: "var(--color-neutral-900)",
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                marginBottom: "1.25rem",
              }}
            >
              Data-Driven Advising for
              <br />
              <span style={{ color: "var(--color-primary)" }}>
                Indian Farmers
              </span>
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                color: "var(--color-neutral-600)",
                lineHeight: 1.7,
                marginBottom: "2rem",
                maxWidth: "520px",
              }}
            >
              KrishiMitra uses real government agricultural datasets to help
              farmers understand crop yield potential and assess field-level
              risks — with full transparency on every data source.
            </p>
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <Link href="/yield-assessment" className="btn btn-primary btn-lg">
                Assess Crop Yield
                <ArrowRight size={18} />
              </Link>
              <Link href="/risk-assessment" className="btn btn-outline btn-lg">
                Check Field Risks
              </Link>
            </div>

            {/* Data source badges */}
            <div
              style={{
                marginTop: "2.5rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-muted)",
                  marginRight: "0.25rem",
                }}
              >
                Data from:
              </span>
              {DATA_BADGES.map((d) => (
                <span key={d} className="badge badge-neutral">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Disclaimer banner ─────────────────────────────────────────── */}
      <div
        role="note"
        className="alert alert-info"
        style={{
          borderRadius: 0,
          borderLeft: "none",
          borderTop: "1px solid #bfdbfe",
          borderBottom: "1px solid #bfdbfe",
          padding: "0.75rem 0",
        }}
      >
        <div className="section-container" style={{ fontSize: "0.875rem" }}>
          <strong>Research prototype:</strong> Yield estimates and risk scores
          are based on historical averages from open datasets. They are not
          guaranteed predictions. Always consult your local KVK or agricultural
          extension officer.
        </div>
      </div>

      {/* ── Features grid ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="features-heading"
        style={{ padding: "4rem 0" }}
      >
        <div className="section-container">
          <header style={{ marginBottom: "2.5rem" }}>
            <h2 id="features-heading" className="section-title">
              What KrishiMitra Offers
            </h2>
            <p className="section-subtitle">
              Six modules built on real datasets — no invented numbers, no
              marketing claims.
            </p>
          </header>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {FEATURES.map(({ icon: Icon, title, description, href }) => (
              <article key={href} className="card">
                <div
                  aria-hidden="true"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 8,
                    background: "var(--color-green-50)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.875rem",
                    color: "var(--color-primary)",
                  }}
                >
                  <Icon size={20} strokeWidth={2} />
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--color-neutral-900)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--color-neutral-600)",
                    lineHeight: 1.65,
                    marginBottom: "1rem",
                  }}
                >
                  {description}
                </p>
                <Link
                  href={href}
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  Explore <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" style={{ margin: 0 }} />

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section
        aria-labelledby="how-heading"
        style={{ padding: "4rem 0", background: "var(--color-neutral-50)" }}
      >
        <div className="section-container">
          <header style={{ marginBottom: "2.5rem" }}>
            <h2 id="how-heading" className="section-title">
              How It Works
            </h2>
            <p className="section-subtitle">
              Four steps from field question to data-backed answer.
            </p>
          </header>

          <ol
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1.5rem",
              listStyle: "none",
            }}
          >
            {HOW_IT_WORKS.map(({ step, title, body }) => (
              <li
                key={step}
                style={{
                  background: "#fff",
                  border: "1px solid var(--color-border)",
                  borderRadius: 10,
                  padding: "1.5rem",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 7,
                    background: "var(--color-primary)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  {step}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "var(--color-neutral-900)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-neutral-600)",
                    lineHeight: 1.65,
                  }}
                >
                  {body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Data transparency strip ───────────────────────────────────── */}
      <section
        aria-labelledby="data-heading"
        style={{
          padding: "3rem 0",
          background: "var(--color-green-700)",
          color: "#fff",
        }}
      >
        <div className="section-container">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
            }}
          >
            <div>
              <h2
                id="data-heading"
                style={{
                  fontSize: "1.375rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                Built on Open Government Data
              </h2>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9375rem" }}>
                Every dataset is publicly available. We cite our sources — you
                can verify every number.
              </p>
              <ul
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.875rem",
                  listStyle: "none",
                }}
              >
                {[
                  "ICRISAT Village Level Data",
                  "MoAFW Annual Reports",
                  "IMD Gridded Rainfall",
                  "eNAM Market Prices",
                  "NBSS&LUP Soil Maps",
                ].map((src) => (
                  <li
                    key={src}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    <CheckCircle size={14} style={{ flexShrink: 0, color: "var(--color-green-300)" }} />
                    {src}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/data-sources"
              className="btn btn-outline"
              style={{ borderColor: "#fff", color: "#fff" }}
            >
              View All Data Sources
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="cta-heading"
        style={{ padding: "4rem 0", textAlign: "center" }}
      >
        <div className="section-container">
          <h2 id="cta-heading" className="section-title" style={{ textAlign: "center" }}>
            Ready to Assess Your Crop?
          </h2>
          <p
            style={{
              color: "var(--color-muted)",
              marginTop: "0.625rem",
              marginBottom: "2rem",
              fontSize: "1.0625rem",
            }}
          >
            Start with the Yield Assessment — it takes under 2 minutes.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/yield-assessment" className="btn btn-primary btn-lg">
              Start Yield Assessment
            </Link>
            <Link href="/faq" className="btn btn-ghost btn-lg">
              Read the FAQ first
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
