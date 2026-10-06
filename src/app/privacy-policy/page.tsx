import type { Metadata } from "next";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "KrishiMitra's privacy policy — what data we collect, how we use it, and your rights.",
};

const LAST_UPDATED = new Date("2024-10-01");

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>
            Last updated: {formatDate(LAST_UPDATED)}
          </p>
        </header>

        <div className="alert alert-info" style={{ marginBottom: "2rem" }}>
          KrishiMitra is a non-commercial research prototype. We collect
          minimal data and do not sell, share, or monetise any personal
          information.
        </div>

        <article className="prose">
          <h2>1. Who We Are</h2>
          <p>
            KrishiMitra (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;the
            project&rdquo;) is an internship research project that operates the
            website at krishimitra.in. The project is not a registered company.
            For enquiries, see our{" "}
            <a href="/contact">Contact page</a>.
          </p>

          <h2>2. What Data We Collect</h2>
          <h3>2a. Data You Provide</h3>
          <p>
            <strong>Assessment forms:</strong> In Phase 1, the Crop Yield
            Assessment and Farmer Risk Assessment forms are processed entirely
            on your device (client-side). No form data is transmitted to our
            servers or stored anywhere in Phase 1.
          </p>
          <p>
            <strong>Contact form:</strong> If you submit the contact form, we
            collect your name, email address, and message text. In Phase 1 this
            data is not yet connected to a mail server and is not persisted. In
            Phase 2, submitted contact data will be stored in a secure database
            solely to enable us to reply to you.
          </p>
          <h3>2b. Data Collected Automatically</h3>
          <p>
            <strong>Server logs:</strong> Our hosting provider (Vercel) may
            retain standard access logs (IP address, URL, timestamp,
            browser/OS) for up to 30 days for security and performance
            monitoring. We do not have direct access to individual log entries.
          </p>
          <p>
            <strong>Cookies and local storage:</strong> We store a single item
            in your browser&rsquo;s <code>localStorage</code> to remember
            whether you have accepted the cookie notice (key:{" "}
            <code>cookie-consent</code>). This is not a tracking cookie. We do
            not use any analytics, advertising, or third-party tracking cookies.
          </p>

          <h2>3. How We Use Your Data</h2>
          <ul>
            <li>To respond to contact form enquiries.</li>
            <li>
              To remember your cookie consent choice so the banner does not
              reappear on every visit.
            </li>
            <li>
              For server security and uptime monitoring through Vercel&rsquo;s
              infrastructure logs.
            </li>
          </ul>
          <p>We do not use your data to:</p>
          <ul>
            <li>Build marketing profiles or target advertisements.</li>
            <li>Share with third parties for their own use.</li>
            <li>Train machine-learning models on personal data.</li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>
            Contact form messages will be retained only as long as necessary to
            resolve your enquiry, and deleted thereafter. Vercel infrastructure
            logs are retained according to Vercel&rsquo;s data retention policy
            (typically 30 days). LocalStorage data remains on your device until
            you clear it or uninstall your browser.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You have the right to request access to, correction of, or deletion
            of any personal data we hold about you. To make a request, use the{" "}
            <a href="/contact">Contact form</a>. We will respond within 30
            days.
          </p>

          <h2>6. Third-Party Services</h2>
          <p>
            This site is hosted on <strong>Vercel</strong>. Please review
            Vercel&rsquo;s{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>{" "}
            for information on how they handle infrastructure-level data.
          </p>
          <p>
            We do not embed Google Analytics, Facebook Pixel, or any other
            third-party tracking service.
          </p>

          <h2>7. External Data Links</h2>
          <p>
            This site links to external government portals (ICRISAT, MoAFW,
            IMD, eNAM, NRSC, etc.). When you follow those links, the respective
            organisations&rsquo; own privacy policies apply. We are not
            responsible for their data practices.
          </p>

          <h2>8. Children&rsquo;s Privacy</h2>
          <p>
            This service is not directed at children under 13. We do not
            knowingly collect personal data from children.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this policy as the project evolves. The &ldquo;Last
            updated&rdquo; date at the top of this page will reflect any
            changes. Continued use of the site after a revision constitutes
            acceptance.
          </p>

          <h2>10. Contact</h2>
          <p>
            For any privacy-related questions or requests, please use our{" "}
            <a href="/contact">Contact page</a>.
          </p>
        </article>
      </div>
    </div>
  );
}
