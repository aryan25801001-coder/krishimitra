# KrishiMitra — Crop Yield & Farmer Risk Advising System

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

An explainable, data-driven agricultural advisory web application built for Indian farmers. **KrishiMitra** combines historical district-level agricultural records, meteorological patterns, soil health data, and market metrics to deliver actionable yield assessments and agricultural risk evaluations without speculative marketing claims or black-box predictions.

---

## 🌾 Core Objectives

1. **Farmer-Centric Accessibility**: High-contrast, clean visual design optimized for mobile devices and low-bandwidth connections.
2. **Transparent, Real Data**: Grounded exclusively in authentic government and scientific research datasets (ICRISAT, MoAFW, IMD, eNAM, ICAR).
3. **Multi-Factor Risk Assessment**: Evaluate drought vulnerability, soil degradation, price volatility, and pest susceptibility.
4. **Explainable Recommendations**: Transparent reasoning behind all agronomic estimates.

---

## 🎨 Design Language & Philosophy

- **Background**: Neutral white & soft grays (`#ffffff`, `#f9fafb`, `#f3f4f6`)
- **Accent**: Natural agricultural greens (`#2d8f2d`, `#226822`, `#1a4f1a`)
- **Typography**: Inter (Google Fonts) with clear scale and robust readability
- **Strict Design Standards**:
  - No purple/neon gradients
  - No pill-shaped buttons (standard geometric radii)
  - No emoji-based iconography (clean Lucide vector icons with ARIA labels)
  - No disruptive cursor or full-page scroll animations
  - No artificial/speculative statistics, fake farmer reviews, or mock ratings

---

## 🧭 Page Overview (Phase 1)

| Route | Page | Description |
|---|---|---|
| `/` | **Home** | Overview hero, platform principles, feature breakdown, data transparency strip, and quick actions. |
| `/yield-assessment` | **Crop Yield Assessment** | Cascading state-to-district selector, season, crop type, validation, loading skeletons, and explainable estimate cards. |
| `/risk-assessment` | **Farmer Risk Assessment** | 5-dimension risk evaluation form across climate, soil, market, and pest vectors. |
| `/dashboard` | **Agricultural Dashboard** | Dataset scope metrics (districts, crops, historical span) with dataset attribution indicators. |
| `/crop-information` | **Crop Information** | 8 detailed agronomic crop profiles with rainfall requirements, soil types, temperature tolerances, and ICAR references. |
| `/data-sources` | **Data Sources** | Complete index of 10 official open datasets across 5 categories with licensing and direct access links. |
| `/faq` | **FAQ** | Accessible accordion with 22 frequently asked questions covering methodologies, limitations, and data freshness. |
| `/contact` | **Contact** | Validated academic feedback form with category selection and institutional contact information. |
| `/privacy-policy` | **Privacy Policy** | Transparent non-commercial research privacy declaration with zero tracking cookies. |
| `/terms` | **Terms & Conditions** | Research prototype disclaimer, advisory limitations, and open usage conditions. |
| `/*` | **Custom 404** | Accessible fallback page with direct navigation routes. |

---

## 🛠️ Global UI & Accessibility Features

- **Sticky Navigation Header**: Responsive navigation with mobile hamburger drawer and scroll shadow.
- **Scroll & Reading Progress Bar**: Real-time reading progress indicator on content-heavy pages.
- **Back-to-Top Control**: Appears smoothly after 400px scroll depth.
- **Cookie Consent Banner**: Minimalist cookie notice with `localStorage` preference persistence.
- **Floating Contact Action**: Quick assistance button with accessible aria attributes.
- **Skip-to-Content Link**: Keyboard accessible landmark for screen readers.
- **Print Optimization**: Clean print stylesheet omitting navigation, footers, and interactive elements.
- **Semantic HTML & WCAG 2.1 AA**: Form controls with associated labels, `role="alert"` for validation errors, and high color contrast.

---

## 📊 Open Agricultural Datasets Integrated

1. **ICRISAT District-Level Data (DLD)** — Historical crop yield, area, and production across 580+ Indian districts (1966–2017).
2. **MoAFW Agricultural Statistics at a Glance** — Annual state-wise crop production statistics (Ministry of Agriculture).
3. **IMD Gridded Daily Meteorological Datasets** — 0.25° gridded daily rainfall and temperature observations.
4. **Agmarknet & eNAM Market Mandi Prices** — Modal wholesale agricultural commodity prices.
5. **Soil Health Card Scheme (MoAFW)** — NPK macronutrient and micronutrient status ratings.
6. **ICAR Agronomic Guidelines** — Optimal temperature, rainfall, and soil classification metrics.

---

## 📁 Project Structure

```
krishi/
├── prisma/
│   └── schema.prisma          # PostgreSQL models (CropYield, DistrictRisk, CropProfile, Contact)
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with fonts, header, footer, global widgets
│   │   ├── globals.css        # Pure CSS design system, typography tokens, component styles
│   │   ├── not-found.tsx      # Accessible custom 404
│   │   ├── page.tsx           # Home page
│   │   ├── yield-assessment/  # Crop yield assessment form & results
│   │   ├── risk-assessment/   # Multi-factor risk assessment form & results
│   │   ├── dashboard/         # Agricultural metrics and data-scope overview
│   │   ├── crop-information/  # Agronomic crop profiles (Rice, Wheat, Maize, etc.)
│   │   ├── data-sources/      # Dataset documentation and citations
│   │   ├── faq/               # Accordion Q&A
│   │   ├── contact/           # Academic inquiry form
│   │   ├── privacy-policy/    # Privacy documentation
│   │   └── terms/             # Terms and research advisory disclaimer
│   ├── components/
│   │   ├── Header.tsx         # Desktop navbar & mobile drawer
│   │   ├── Footer.tsx         # Semantic multi-column footer
│   │   ├── ScrollProgress.tsx # Reading progress bar
│   │   ├── BackToTop.tsx      # Accessible back-to-top button
│   │   ├── CookieBanner.tsx   # Consent banner with localStorage
│   │   └── FloatingContact.tsx# Floating support button
│   └── lib/
│       ├── constants.ts       # Navigation links, crop seasons, states, datasets
│       └── utils.ts           # Class merger and date formatting utilities
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm, yarn, or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/username/krishi.git
cd krishi
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 🗺️ Project Roadmap

- [x] **Phase 1: Foundation & Web Experience**
  - Next.js 16 App Router setup with TypeScript
  - Complete farmer-friendly agricultural design system
  - 11 production-ready pages with responsive layout
  - Form validation, loading skeletons, error states, and ARIA accessibility
  - Data sources and academic citations

- [ ] **Phase 2: Database & Real Data Pipeline**
  - PostgreSQL database setup and Prisma migrations
  - ICRISAT and Agmarknet data ingestion and normalization scripts
  - Dynamic district-wise yield and price query endpoints

- [ ] **Phase 3: Machine Learning & Explainability Engine**
  - Python / FastAPI service for ML inference
  - Crop yield prediction using XGBoost & Random Forest
  - SHAP (SHapley Additive exPlanations) values for farmer-interpretable feature importance
  - Real-time weather API integration (IMD / Open-Meteo)

---

## 📜 License & Acknowledgements

- Built as an internship research prototype.
- Open-source datasets provided by ICRISAT, Ministry of Agriculture & Farmers Welfare (MoAFW), India Meteorological Department (IMD), and ICAR.
