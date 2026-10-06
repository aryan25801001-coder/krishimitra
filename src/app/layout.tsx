import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import CookieBanner from "@/components/CookieBanner";
import FloatingContact from "@/components/FloatingContact";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Crop Yield & Farmer Risk Advising`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "crop yield",
    "farmer risk",
    "agricultural advisory",
    "India farming",
    "kharif rabi crops",
    "soil data",
  ],
  authors: [{ name: "KrishiMitra Research Team" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Crop Yield & Farmer Risk Advising`,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2d8f2d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--font-inter, var(--font-sans))",
        }}
      >
        {/* Skip to content */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Reading progress */}
        <ScrollProgress />

        {/* Header */}
        <Header />

        {/* Page content */}
        <main id="main-content" style={{ flex: 1 }}>
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating utilities */}
        <BackToTop />
        <FloatingContact />
        <CookieBanner />
      </body>
    </html>
  );
}
