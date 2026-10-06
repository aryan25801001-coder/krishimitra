"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sprout } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  // Trap body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        role="banner"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 500,
          height: "var(--header-h)",
          background: "#fff",
          borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
          boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.06)" : "none",
          transition: "box-shadow 0.2s, border-color 0.2s",
        }}
      >
        <div
          className="section-container"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label={`${SITE_NAME} home`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                background: "var(--color-primary)",
                color: "#fff",
                width: 34,
                height: 34,
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-hidden="true"
            >
              <Sprout size={18} strokeWidth={2.5} />
            </span>
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.125rem",
                color: "var(--color-neutral-900)",
                letterSpacing: "-0.02em",
              }}
            >
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary navigation" style={{ display: "flex", gap: "0.25rem" }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "btn btn-ghost btn-sm",
                  pathname === link.href && "active"
                )}
                aria-current={pathname === link.href ? "page" : undefined}
                style={
                  pathname === link.href
                    ? { color: "var(--color-primary)", background: "var(--color-green-50)" }
                    : {}
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="btn btn-ghost btn-sm"
            style={{ display: "none" }}
            id="hamburger-btn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 400,
            background: "rgba(0,0,0,0.4)",
          }}
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <nav
        id="mobile-drawer"
        aria-label="Mobile navigation"
        role="navigation"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(320px, 88vw)",
          background: "#fff",
          zIndex: 450,
          padding: "1.5rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s ease",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
          overflowY: "auto",
        }}
        aria-hidden={!menuOpen}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-neutral-900)" }}>
            Menu
          </span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "block",
              padding: "0.75rem 1rem",
              borderRadius: 7,
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "0.9375rem",
              color:
                pathname === link.href
                  ? "var(--color-primary)"
                  : "var(--color-neutral-700)",
              background:
                pathname === link.href ? "var(--color-green-50)" : "transparent",
              transition: "background 0.15s, color 0.15s",
            }}
            aria-current={pathname === link.href ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          header nav[aria-label="Primary navigation"] { display: none !important; }
          #hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
