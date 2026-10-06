import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about KrishiMitra — how yield estimates work, data accuracy, risk scoring methodology, and privacy.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
