import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Sources",
  description:
    "Full citation of every dataset used in KrishiMitra — ICRISAT, MoAFW, IMD, eNAM, NBSS, and NRSC open government data.",
};

export default function DataSourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
