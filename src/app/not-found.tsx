import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found — 404",
  description: "The page you are looking for could not be found.",
};

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Yield Assessment", href: "/yield-assessment" },
  { label: "Risk Assessment", href: "/risk-assessment" },
  { label: "Crop Information", href: "/crop-information" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.25rem",
      }}
    >
      <div style={{ maxWidth: 560, textAlign: "center" }}>
        {/* 404 number */}
        <div
          aria-hidden="true"
          style={{
            fontSize: "clamp(5rem, 18vw, 8rem)",
            fontWeight: 900,
            color: "var(--color-neutral-100)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            marginBottom: "-0.5rem",
            userSelect: "none",
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: "clamp(1.375rem, 3vw, 1.75rem)",
            fontWeight: 800,
            color: "var(--color-neutral-900)",
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            color: "var(--color-neutral-600)",
            fontSize: "1.0625rem",
            lineHeight: 1.65,
            marginBottom: "2rem",
          }}
        >
          The page you are looking for does not exist, may have been moved, or
          the URL may be incorrect.
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.875rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "3rem",
          }}
        >
          <Link href="/" className="btn btn-primary">
            <Home size={16} />
            Go to Home
          </Link>
          <Link href="/yield-assessment" className="btn btn-outline">
            <ArrowLeft size={16} />
            Yield Assessment
          </Link>
        </div>

        {/* Quick links */}
        <div
          style={{
            background: "var(--color-neutral-50)",
            border: "1px solid var(--color-border)",
            borderRadius: 10,
            padding: "1.5rem",
            textAlign: "left",
          }}
        >
          <h2
            style={{
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "var(--color-neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "1rem",
            }}
          >
            You might be looking for
          </h2>
          <ul
            style={{
              listStyle: "none",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
            }}
          >
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontSize: "0.875rem",
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    fontWeight: 500,
                    padding: "0.375rem 0",
                  }}
                >
                  <Search size={13} aria-hidden="true" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
