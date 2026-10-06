import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Agricultural data dashboard — district-level crop performance metrics and risk indicators from open government datasets.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
