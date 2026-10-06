import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crop Yield Assessment",
  description:
    "Enter your state, district, crop, and season to receive a historical-data yield estimate derived from ICRISAT and MoAFW records.",
};

export default function YieldAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
