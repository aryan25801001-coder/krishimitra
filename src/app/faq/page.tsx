"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    category: "About the System",
    items: [
      {
        q: "What is KrishiMitra?",
        a: "KrishiMitra is a research prototype built as part of an internship project. It uses open government agricultural datasets to help farmers and researchers understand crop yield potential and field-level risks. It is not a commercial product.",
      },
      {
        q: "Who built this and why?",
        a: "This system was built by an internship team as a research project demonstrating how public agricultural data — from ICRISAT, MoAFW, IMD, and other government sources — can be made accessible to farmers through a web interface.",
      },
      {
        q: "Is this free to use?",
        a: "Yes. KrishiMitra is a non-commercial research prototype. There are no fees, subscriptions, or paid tiers.",
      },
      {
        q: "Is my data stored when I fill out the assessment form?",
        a: "In Phase 1, form data is processed client-side only and is not sent to any server or stored anywhere. Phase 2 will introduce optional account creation with explicit consent for data storage.",
      },
    ],
  },
  {
    category: "Yield Assessment",
    items: [
      {
        q: "How are yield estimates calculated?",
        a: "In Phase 1, the form validates your inputs but does not compute a live estimate. In Phase 2, a PostgreSQL database pre-loaded with ICRISAT district-season-crop yield records will power a regression model. Estimates will show the 10-year moving average yield in kg/hectare with a 90th-percentile confidence interval.",
      },
      {
        q: "Why does my district not appear in the dropdown?",
        a: "Phase 1 only includes a representative sample of districts for the most data-rich states. The full 580+ district list from the ICRISAT database will be loaded from PostgreSQL in Phase 2.",
      },
      {
        q: "How accurate are the yield estimates?",
        a: "Estimates are based on historical district averages and should not be treated as precise forecasts. Actual yields depend on seed variety, weather in the specific season, input use, pest pressure, and many other factors that this tool does not model individually.",
      },
      {
        q: "What time period do the yield records cover?",
        a: "The primary dataset (ICRISAT VDSA) covers 1966–2017. MoAFW state-level data extends through the most recently published Annual Report. We use the 1990–2020 window as the main analysis period to balance data availability and recency.",
      },
      {
        q: "Can I download the yield estimate results?",
        a: "A PDF export and CSV download will be added in Phase 2. In Phase 1, you can use your browser's print function (Ctrl+P) to save the result.",
      },
    ],
  },
  {
    category: "Risk Assessment",
    items: [
      {
        q: "What does the Risk Assessment measure?",
        a: "It profiles four risk categories: (1) Drought risk — based on IMD rainfall deficit frequency; (2) Flood/waterlogging risk — based on NRSC flood hazard maps and your stated land type; (3) Price volatility risk — based on eNAM mandi price CV for the crop; and (4) Soil degradation risk — based on NBSS soil health and NRSC land-use change data.",
      },
      {
        q: "What do High, Medium, and Low risk mean?",
        a: "Risk categories are relative rankings based on the historical data for Indian districts. 'High' means the district-crop combination falls in the top quartile of the risk metric historically. It does not mean a loss is certain — it means the probability and/or severity of the event has been above average in past records.",
      },
      {
        q: "Does the tool consider the current weather forecast?",
        a: "Not in Phase 1 or Phase 2 of this research prototype. Risk scores are based entirely on historical data. Real-time weather integration would require a weather API subscription and is planned for a future phase.",
      },
      {
        q: "Can I use this tool to make crop insurance decisions?",
        a: "No. KrishiMitra is a research and educational tool. For crop insurance decisions, consult PM Fasal Bima Yojana (PMFBY) guidelines, your bank, or your local agricultural insurance office.",
      },
    ],
  },
  {
    category: "Data & Methodology",
    items: [
      {
        q: "Where does the data come from?",
        a: "All data comes from publicly available government and CGIAR datasets: ICRISAT VDSA, MoAFW Annual Reports, IMD Gridded Rainfall, eNAM market prices, NBSS&LUP soil maps, and NRSC land-use / flood hazard data. See the Data Sources page for full citations.",
      },
      {
        q: "Is any data made up or estimated?",
        a: "No. We do not fabricate, interpolate, or generate synthetic data. Every number displayed links to a real data source. Where data is missing for a district, the tool will say so rather than guess.",
      },
      {
        q: "How do you define a 'drought year' for a district?",
        a: "We use the IMD definition: a season is classified as drought if the district receives more than 19% below its long-period average rainfall during the Southwest Monsoon (June–September). This is consistent with the standard used by the government for drought declaration.",
      },
      {
        q: "Will the model be open-source?",
        a: "Yes. The full codebase — including data processing scripts, model training code, and the web application — will be published on GitHub. The repository link will be added to this site once the code is reviewed.",
      },
    ],
  },
  {
    category: "Technical",
    items: [
      {
        q: "What technologies is this built with?",
        a: "The frontend is built with Next.js and TypeScript. The backend uses PostgreSQL with Prisma ORM for data storage. Machine learning processing will use Python and FastAPI in Phase 2. The application is deployed on Vercel.",
      },
      {
        q: "Does this work on mobile?",
        a: "Yes. The interface is designed mobile-first and has been tested on common screen sizes from 360px upwards.",
      },
      {
        q: "Does this site use cookies?",
        a: "Only essential cookies are used — specifically a cookie-consent flag stored in localStorage, and any cookies Next.js requires for server-side routing. No tracking, analytics, or advertising cookies are used.",
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${q.slice(0, 30).replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={`accordion-item${open ? " open" : ""}`}>
      <button
        className="accordion-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${id}-content`}
        id={`${id}-btn`}
      >
        {q}
        <ChevronDown size={18} className="accordion-icon" aria-hidden="true" />
      </button>
      <div
        className="accordion-content"
        id={`${id}-content`}
        role="region"
        aria-labelledby={`${id}-btn`}
      >
        {a}
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="section-container" style={{ maxWidth: "800px" }}>
        <header style={{ marginBottom: "2.5rem" }}>
          <span className="badge badge-neutral" style={{ marginBottom: "0.75rem" }}>Help</span>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--color-neutral-900)",
              letterSpacing: "-0.025em",
              marginBottom: "0.625rem",
            }}
          >
            Frequently Asked Questions
          </h1>
          <p style={{ color: "var(--color-neutral-600)", fontSize: "1.0625rem", lineHeight: 1.65 }}>
            Answers to common questions about how the system works, data
            accuracy, and how to use the tools.
          </p>
        </header>

        {FAQS.map((cat) => (
          <section key={cat.category} aria-labelledby={`faq-cat-${cat.category}`} style={{ marginBottom: "2.5rem" }}>
            <h2
              id={`faq-cat-${cat.category}`}
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--color-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.75rem",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid var(--color-green-200)",
              }}
            >
              {cat.category}
            </h2>
            <div>
              {cat.items.map((item) => (
                <AccordionItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}

        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "var(--color-green-50)",
            borderRadius: 8,
            border: "1px solid var(--color-green-200)",
          }}
        >
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-green-800)", marginBottom: "0.375rem" }}>
            Have a question not listed here?
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-green-700)", lineHeight: 1.6, marginBottom: "0.875rem" }}>
            Use the contact form and we will try to respond within 2 working days.
          </p>
          <a href="/contact" className="btn btn-primary btn-sm">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
