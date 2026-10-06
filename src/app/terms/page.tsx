import type { Metadata } from "next";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "KrishiMitra terms and conditions of use.",
};

const LAST_UPDATED = new Date("2024-10-01");

export default function TermsPage() {
  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="section-container" style={{ maxWidth: "760px" }}>
        <header style={{ marginBottom: "2rem" }}>
          <span className="badge badge-neutral" style={{ marginBottom: "0.75rem" }}>Legal</span>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--color-neutral-900)",
              letterSpacing: "-0.025em",
              marginBottom: "0.375rem",
            }}
          >
            Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>
            Last updated: {formatDate(LAST_UPDATED)}
          </p>
        </header>

        <div className="alert alert-warning" style={{ marginBottom: "2rem" }}>
          <strong>Important:</strong> KrishiMitra is a research prototype. Yield
          estimates and risk scores are based on historical averages and are not
          guaranteed forecasts. Do not make financial, insurance, or crop
          management decisions solely on the basis of this tool.
        </div>

        <article className="prose">
          <h2>1. Nature of the Service</h2>
          <p>
            KrishiMitra (&ldquo;the Service&rdquo;) is a non-commercial
            academic research prototype. It is provided &ldquo;as is&rdquo; for
            educational and research purposes only. The Service is not a
            licensed agricultural advisory, financial advisory, or insurance
            product.
          </p>

          <h2>2. Acceptance of Terms</h2>
          <p>
            By accessing or using KrishiMitra, you agree to be bound by these
            Terms &amp; Conditions. If you do not agree, please do not use the
            Service.
          </p>

          <h2>3. No Warranty</h2>
          <p>
            The Service is provided without any warranty, express or implied,
            including but not limited to warranties of merchantability, fitness
            for a particular purpose, or non-infringement.
          </p>
          <p>
            Yield estimates and risk scores are derived from historical district-
            level data. Actual agricultural outcomes depend on many factors —
            including current weather, input quality, seed variety, pest
            pressure, and farm management practices — that this tool does not
            model individually.
          </p>

          <h2>4. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, the KrishiMitra
            team shall not be liable for any direct, indirect, incidental,
            special, or consequential damages arising from your use of or
            inability to use the Service, including any decisions made on the
            basis of yield estimates or risk scores.
          </p>

          <h2>5. Data Accuracy</h2>
          <p>
            We strive to use accurate, publicly available datasets and to cite
            every source. However, we cannot guarantee the accuracy,
            completeness, or timeliness of third-party government data. If you
            identify a data error, please{" "}
            <a href="/contact">contact us</a>.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            The source code for KrishiMitra will be released on GitHub under an
            open-source licence (MIT or Apache 2.0 — to be determined). The
            underlying datasets belong to their respective publishers (ICRISAT,
            Government of India, etc.) and are subject to their own licences.
          </p>
          <p>
            The KrishiMitra name and logo may not be used without permission.
          </p>

          <h2>7. External Links</h2>
          <p>
            This site links to external government and research portals. We are
            not responsible for the content, accuracy, or privacy practices of
            those external sites.
          </p>

          <h2>8. Prohibited Uses</h2>
          <p>You may not use the Service to:</p>
          <ul>
            <li>Scrape or bulk-download data in a way that disrupts service for others.</li>
            <li>Represent KrishiMitra output as a licensed agricultural or financial advisory.</li>
            <li>Commercialise the Service or any output without permission.</li>
            <li>Violate any applicable Indian or international law.</li>
          </ul>

          <h2>9. Modifications to the Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of
            the Service at any time without notice, as this is an ongoing
            research project.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes shall be
            subject to the exclusive jurisdiction of the courts of India.
          </p>

          <h2>11. Contact</h2>
          <p>
            For questions about these terms, please use our{" "}
            <a href="/contact">Contact page</a>.
          </p>
        </article>
      </div>
    </div>
  );
}
