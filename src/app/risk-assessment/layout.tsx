import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Farmer Risk Assessment",
  description:
    "Understand drought, flood, price-volatility, and soil-degradation risks for your crop and district using real government dataset indicators.",
};

export default function RiskAssessmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
