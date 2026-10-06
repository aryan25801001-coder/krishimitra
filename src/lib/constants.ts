export const SITE_NAME = "KrishiMitra";
export const SITE_TAGLINE = "Crop Yield & Farmer Risk Advising System";
export const SITE_DESCRIPTION =
  "KrishiMitra helps Indian farmers make data-driven decisions about crop selection, yield potential, and agricultural risk management using real government datasets.";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Yield Assessment", href: "/yield-assessment" },
  { label: "Risk Assessment", href: "/risk-assessment" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Crop Info", href: "/crop-information" },
  { label: "Data Sources", href: "/data-sources" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  platform: [
    { label: "Yield Assessment", href: "/yield-assessment" },
    { label: "Risk Assessment", href: "/risk-assessment" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Crop Information", href: "/crop-information" },
  ],
  resources: [
    { label: "Data Sources", href: "/data-sources" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
} as const;

export const CROP_SEASONS = [
  "Kharif (Jun–Oct)",
  "Rabi (Nov–Apr)",
  "Zaid (Mar–Jun)",
  "Annual",
] as const;

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export const MAJOR_CROPS = [
  "Rice",
  "Wheat",
  "Maize",
  "Sorghum (Jowar)",
  "Pearl Millet (Bajra)",
  "Barley",
  "Chickpea (Chana)",
  "Lentil (Masoor)",
  "Pigeon Pea (Arhar)",
  "Groundnut",
  "Soybean",
  "Sunflower",
  "Mustard",
  "Cotton",
  "Sugarcane",
  "Potato",
  "Onion",
  "Tomato",
] as const;
