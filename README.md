# 🌾 KrishiMitra (कृषि मित्र)

> **AI & Data-Driven Agricultural Advisory Platform for Crop Yield Estimation & Risk Assessment**

KrishiMitra is a full-stack agricultural decision-support web application designed for Indian farmers, agronomic researchers, and agricultural policy analysts. It combines a farmer-facing Next.js 16 frontend with a PostgreSQL-backed data layer and a Python FastAPI machine-learning inference engine to estimate crop yield potential and composite agricultural risk.

The core principle of KrishiMitra is **explainability and data provenance**: every estimate is transparently linked back to authentic weather, soil, agronomic, and market price datasets rather than opaque black-box recommendations.

---

## 🔗 Quick Links & Endpoints

| Service | Localhost URL | Details |
| :--- | :--- | :--- |
| **Frontend Web App** | [http://localhost:3000](http://localhost:3000) | Next.js 16 UI (Yield & Risk Assessment, Dashboard, Agronomic Profiles) |
| **ML Service API** | [http://127.0.0.1:8000](http://127.0.0.1:8000) | Python FastAPI Machine Learning inference backend |
| **ML API Documentation** | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) | Interactive Swagger UI for ML endpoints |
| **ML Health Check** | [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) | System & ML model artifact health status |

---

## ✨ Features

### 👨‍🌾 Farmer & User Experience
- **Crop Yield Assessment (`/yield-assessment`)**: Input state, district, season, crop, farm area, soil parameters, and irrigation type to receive data-backed yield potential estimates.
- **Agricultural Risk Assessment (`/risk-assessment`)**: Evaluates composite risk across drought/rainfall deficit, thermal stress, soil reaction (pH), nutrient status, and eNAM market price volatility.
- **Agronomic Knowledge Base (`/crop-information`)**: Comprehensive profiles covering ICAR optimal ranges (temp, rainfall, soil pH), growth cycles, major pests, and variety selection.
- **Research Dashboard (`/dashboard`)**: Summary metrics of agricultural conditions, dataset coverage, and regional crop performance.
- **Data Provenance (`/data-sources`)**: Full attribution and license documentation for ICRISAT, IMD, MoAFW, eNAM, and Soil Health Card datasets.

### ⚙️ Architecture & Administrative Layer
- **Prisma ORM & PostgreSQL Database**: Models for Regions, Crops, Soil Profiles, Weather Observations, Historical Yields, Fertilizer Recommendations, and District Risk Profiles.
- **Dynamic ML API Integration**: Next.js advisory engine connects dynamically to Python ML endpoints via `process.env.ML_SERVICE_URL` with local fallback.
- **Admin Security**: Secured API endpoints and admin login portal (`/admin/login`).

### 🤖 Machine Learning Inference Service (`ml_service/`)
- **Yield Prediction (`POST /predict/yield`)**: Predicts expected yield in tonnes/ha based on district climate, soil nutrients, organic carbon, and irrigation.
- **Risk Scoring (`POST /predict/risk`)**: Calculates normalized composite risk score (0-100) and risk category classification.

---

## 🛠 Tech Stack

- **Frontend Framework**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), TypeScript
- **Styling & UI**: Tailwind CSS v4, Custom Design System
- **Database & ORM**: [Prisma ORM v5](https://www.prisma.io/), PostgreSQL
- **ML Backend Service**: [FastAPI](https://fastapi.tiangolo.com/), Uvicorn, Python 3.11+
- **Machine Learning & Data**: scikit-learn, pandas, numpy, joblib
- **Authentication**: JWT (`jose`), `bcryptjs`
- **Concurrency & Tooling**: `concurrently`, ESLint, PostCSS

---

## 📁 Project Structure

```text
krishi/
├── .env                         # Environment variables configuration
├── package.json                 # Node dependencies and scripts
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── vercel.json                  # Vercel deployment configuration
├── prisma/
│   ├── schema.prisma            # Prisma database schema definition
│   ├── seed.ts                  # Database seeding script
│   └── data/                    # Historical yields and crop JSON data
├── public/                      # Static assets and sitemap
├── src/
│   ├── app/                     # Next.js App Router pages and API routes
│   │   ├── admin/               # Admin portal & login
│   │   ├── api/                 # Next.js REST API routes
│   │   ├── crop-information/    # Agronomic guidance
│   │   ├── dashboard/           # Summary dashboard
│   │   ├── data-sources/        # Data attribution
│   │   ├── risk-assessment/     # Field risk form & engine
│   │   ├── yield-assessment/    # Yield potential calculator
│   │   └── page.tsx             # Landing page
│   ├── components/              # Shared React components & UI cards
│   ├── lib/
│   │   ├── advisory-engine.ts   # Core rule engine & ML fetch integration
│   │   ├── session.ts           # Authentication session management
│   │   └── repositories.ts      # Prisma database query layer
│   └── middleware.ts            # Route protection middleware
└── ml_service/                  # Python FastAPI ML inference service
    ├── app.py                   # FastAPI server & route handlers
    ├── requirements.txt         # Python dependencies
    ├── artifacts/               # Trained model files (.joblib)
    ├── data/                    # Agricultural ML training datasets
    └── pipeline/                # Model training and pipeline scripts
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Python**: 3.11 or higher
- **PostgreSQL**: Local PostgreSQL server or Cloud PostgreSQL instance (Neon, Supabase, Railway)

### 2. Environment Setup

Create or update the `.env` file in the project root:

```env
# Database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/krishimitra?schema=public"

# App base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Remote ML service URL (defaults to http://127.0.0.1:8000 if unset)
ML_SERVICE_URL="http://127.0.0.1:8000"
```

### 3. Installation

#### Node.js Dependencies:
```bash
npm install
```

#### Python Virtual Environment & Dependencies:
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# macOS / Linux:
source .venv/bin/activate

# Install Python requirements
pip install -r ml_service/requirements.txt
```

### 4. Database Setup

Generate Prisma Client and push schema to your PostgreSQL database:

```bash
npm run db:generate
npm run db:push
```

*(Optional) Seed initial data or open Prisma Studio GUI:*
```bash
npm run db:studio
```

---

## 🏃 Running the Application

### Option A: Full-Stack Mode (Frontend + ML Service concurrently)

```bash
npm run dev
```
- Next.js Web App: [http://localhost:3000](http://localhost:3000)
- FastAPI ML Service: [http://127.0.0.1:8000](http://127.0.0.1:8000)

### Option B: Individual Service Mode

**Frontend Only:**
```bash
npm run dev:frontend
```

**ML Backend Service Only:**
```bash
npm run dev:backend
```

---

## 🌐 Production & Vercel Deployment Guide

When deploying KrishiMitra to production on platforms like **Vercel**:

### 1. Deploy Python ML Backend (`ml_service`)
Vercel serverless functions handle Node.js pages. The Python FastAPI service should be hosted on a cloud Python provider:
- Options: [Render](https://render.com), [Railway](https://railway.app), [Koyeb](https://www.koyeb.com), or [Hugging Face Spaces](https://huggingface.co/spaces)
- Deploy the `ml_service/` folder with start command:
  ```bash
  uvicorn app:app --host 0.0.0.0 --port 8000
  ```

### 2. Setup Vercel Environment Variables
In Vercel Dashboard -> Project Settings -> **Environment Variables**, configure:

| Key | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Cloud PostgreSQL Connection URL | `postgresql://user:pass@ep-xyz.neon.tech/krishimitra` |
| `DIRECT_URL` | Direct PostgreSQL URL (for connection pooling) | `postgresql://user:pass@ep-xyz.neon.tech/krishimitra` |
| `ML_SERVICE_URL` | Deployed Python ML Service URL | `https://krishi-ml-api.onrender.com` |
| `NEXT_PUBLIC_APP_URL` | Deployed Vercel Domain | `https://krishimitra.vercel.app` |

---

## 📜 Available NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `concurrently ...` | Runs both Next.js app and Python ML service simultaneously |
| `npm run dev:frontend` | `next dev --webpack` | Runs Next.js frontend only |
| `npm run dev:backend` | `cd ml_service && python -m uvicorn ...` | Runs FastAPI backend service only |
| `npm run build` | `prisma generate && next build` | Compiles Next.js production build |
| `npm run start` | `next start` | Starts Next.js production server |
| `npm run lint` | `eslint src ...` | Runs TypeScript & Next.js linter |
| `npm run db:generate` | `prisma generate` | Generates Prisma client types |
| `npm run db:push` | `prisma db push` | Pushes schema directly to database |
| `npm run db:studio` | `prisma studio` | Opens Prisma web database editor |

---

## 📊 Dataset Provenance & Attribution

The platform integrates data from open government & research institutions:
- **ICRISAT**: Village Dynamics in South Asia (VDSA) district yield database.
- **IMD (India Meteorological Department)**: Gridded historical rainfall & temperature statistics.
- **MoAFW (Ministry of Agriculture & Farmers Welfare)**: Crop production benchmarks & ICAR growth guidelines.
- **eNAM (National Agriculture Market)**: Mandi price trends and market volatility indices.
- **Soil Health Card Scheme**: District-level N-P-K nutrient status and organic carbon distributions.

---

## 📄 License & Disclaimer

KrishiMitra is an open-access agricultural decision-support research prototype. Advisory outputs are intended to guide decisions alongside local agricultural extension officer guidance. Check dataset licensing before commercial redistribution.
