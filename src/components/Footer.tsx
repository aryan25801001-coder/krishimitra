import Link from "next/link";
import { Sprout } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE, FOOTER_LINKS } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      style={{
        background: "var(--color-neutral-900)",
        color: "var(--color-neutral-300)",
        marginTop: "auto",
      }}
    >
      <div className="section-container" style={{ padding: "3rem var(--padding-x, 1.25rem)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2.5rem",
            paddingBottom: "2.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}
            >
              <span
                style={{
                  background: "var(--color-green-500)",
                  color: "#fff",
                  width: 32,
                  height: 32,
                  borderRadius: 7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-hidden="true"
              >
                <Sprout size={16} strokeWidth={2.5} />
              </span>
              <span
                style={{ fontWeight: 800, fontSize: "1rem", color: "#fff" }}
              >
                {SITE_NAME}
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--color-neutral-400)" }}>
              {SITE_TAGLINE}
            </p>
            <p
              style={{
                marginTop: "0.75rem",
                fontSize: "0.8125rem",
                color: "var(--color-neutral-500)",
                lineHeight: 1.55,
              }}
            >
              Built for Indian farmers using open government agricultural datasets.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-neutral-400)",
                marginBottom: "1rem",
              }}
            >
              Platform
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {FOOTER_LINKS.platform.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-neutral-400)",
                marginBottom: "1rem",
              }}
            >
              Resources
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {FOOTER_LINKS.resources.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-neutral-400)",
                marginBottom: "1rem",
              }}
            >
              Legal
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {FOOTER_LINKS.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            fontSize: "0.8125rem",
            color: "var(--color-neutral-500)",
          }}
        >
          <p>
            &copy; {year} {SITE_NAME}. All rights reserved. Data sourced from
            public government datasets.
          </p>
          <p>
            Built as part of an internship research project. Not for commercial
            use.
          </p>
        </div>
      </div>
    </footer>
  );
}
