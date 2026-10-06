import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the KrishiMitra research team for questions about data accuracy, methodology, or collaboration.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
