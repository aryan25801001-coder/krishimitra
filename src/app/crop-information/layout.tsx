import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crop Information",
  description:
    "Agronomic profiles for major Indian crops — water requirements, soil types, pests, and yield ranges from ICAR research publications.",
};

export default function CropInfoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
