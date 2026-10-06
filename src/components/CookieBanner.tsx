"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) {
      // Slight delay so banner doesn't flash on first paint
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  return (
    <div
      id="cookie-banner"
      className={show ? "show" : ""}
      role="region"
      aria-label="Cookie consent"
    >
      <p>
        We use essential cookies to keep this site working. See our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link> for details.
      </p>
      <button
        className="btn btn-primary btn-sm"
        onClick={accept}
        aria-label="Accept cookies"
      >
        Accept
      </button>
    </div>
  );
}
