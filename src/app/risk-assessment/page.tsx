"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Info,
  Layers,
  CloudRain,
  TrendingDown,
  Bug,
  Droplets,
  CheckCircle2,
  Printer,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import ConfirmationModal from "@/components/ConfirmationModal";
import SearchableSelect from "@/components/SearchableSelect";
import { INDIAN_STATES } from "@/lib/constants";

export default function RiskAssessmentPage() {
  const [stateList, setStateList] = useState<string[]>(Array.from(INDIAN_STATES));
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [cropList, setCropList] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    state: "Maharashtra",
    district: "Nashik",
    crop: "Cotton",
    season: "Kharif",
    irrigationType: "Canal",
    landType: "Lowland (Submergence prone)",
  });

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDistrictLoading, setIsDistrictLoading] = useState(false);
  const [riskData, setRiskData] = useState<any | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Load initial states and crops
  useEffect(() => {
    async function loadData() {
      try {
        const [statesRes, cropsRes] = await Promise.all([
          fetch("/api/regions?list=states").then((r) => r.json()).catch(() => null),
          fetch("/api/crops").then((r) => r.json()).catch(() => null),
        ]);
        if (statesRes && statesRes.success && statesRes.data.length > 0) {
          setStateList(statesRes.data);
        }
        if (cropsRes && cropsRes.success && cropsRes.data.length > 0) {
          setCropList(cropsRes.data);
        }
      } catch (err) {
        console.error("Failed to load metadata", err);
      }
    }
    loadData();
  }, []);

  // Cascade districts
  useEffect(() => {
    if (!formData.state) {
      setDistrictList([]);
      return;
    }
    async function fetchDistricts() {
      setIsDistrictLoading(true);
      try {
        const res = await fetch(`/api/regions?state=${encodeURIComponent(formData.state)}&list=districts`);
        const json = await res.json();
        if (json.success) {
          setDistrictList(json.data);
          if (json.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              district: json.data.includes(prev.district) ? prev.district : json.data[0],
            }));
          }
        }
      } catch (e) {
        console.error("Failed to load districts", e);
      } finally {
        setIsDistrictLoading(false);
      }
    }
    fetchDistricts();
  }, [formData.state]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.state) errs.state = "Please select a state.";
    if (!formData.district) errs.district = "Please select a district.";
    if (!formData.crop) errs.crop = "Please select a crop.";
    setClientErrors(errs);
    if (Object.keys(errs).length > 0) {
      errorSummaryRef.current?.focus();
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const url = `/api/risk-assessment?district=${encodeURIComponent(formData.district)}&crop=${encodeURIComponent(formData.crop)}&season=${encodeURIComponent(formData.season)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setRiskData(json);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch (e) {
      console.error("Risk evaluation failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      state: stateList[0] || "Maharashtra",
      district: districtList[0] || "Aurangabad",
      crop: "Cotton",
      season: "Kharif",
      irrigationType: "Canal",
      landType: "Lowland (Submergence prone)",
    });
    setClientErrors({});
    setRiskData(null);
    setShowResetModal(false);
  };

  return (
    <div style={{ padding: "2.5rem 0 5rem" }}>
      <div className="section-container" style={{ maxWidth: "980px" }}>
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "1rem" }}>
          <ol style={{ display: "flex", gap: "0.5rem", listStyle: "none", fontSize: "0.875rem", color: "var(--color-neutral-500)" }}>
            <li><Link href="/" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Home</Link></li>
            <li>/</li>
            <li aria-current="page" style={{ color: "var(--color-neutral-700)", fontWeight: 600 }}>Farmer Risk Assessment</li>
          </ol>
        </nav>

        <header style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
            <span className="badge badge-warning">IMD &amp; NRSC Sourced</span>
            <span className="badge badge-neutral">Multi-Factor Vulnerability</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.375rem)", fontWeight: 800, color: "var(--color-neutral-900)", letterSpacing: "-0.025em", marginBottom: "0.5rem" }}>
            Agricultural Risk &amp; Vulnerability Assessment
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "var(--color-neutral-600)", lineHeight: 1.6, maxWidth: "780px" }}>
            Evaluate compound agricultural risks — including meteorological drought frequency, flood hazard classification, mandi price volatility, and seasonal pest pressures.
          </p>
        </header>

        {/* Error Summary */}
        {Object.keys(clientErrors).length > 0 && (
          <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="alert alert-danger" style={{ marginBottom: "2rem", outline: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertCircle size={18} />
              <span>Please select all required location and crop fields.</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} noValidate style={{ background: "#ffffff", border: "1px solid var(--color-border)", borderRadius: 12, padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "3rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
            {/* Country */}
            <div>
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-input"
                value="India 🇮🇳 (All 36 States & UTs)"
                readOnly
                disabled
                style={{ background: "var(--color-neutral-100)", color: "var(--color-neutral-700)", fontWeight: 500 }}
              />
            </div>

            {/* State / UT */}
            <SearchableSelect
              id="state-field"
              label="State / Union Territory"
              value={formData.state}
              options={stateList}
              onChange={(val) => setFormData((prev) => ({ ...prev, state: val, district: "" }))}
              placeholder="Search State or Union Territory..."
              disabled={isLoading || isDataLoading}
              required
              error={clientErrors.state}
              loading={isDataLoading}
            />

            {/* District */}
            <SearchableSelect
              id="district-field"
              label={formData.state ? `District (${districtList.length} Districts)` : "District"}
              value={formData.district}
              options={districtList}
              onChange={(val) => setFormData((prev) => ({ ...prev, district: val }))}
              placeholder={formData.state ? "Search District..." : "Select State / UT First"}
              disabled={isLoading || isDataLoading || isDistrictLoading || !formData.state || districtList.length === 0}
              required
              error={clientErrors.district}
              loading={isDistrictLoading}
              emptyMessage="No districts found for selected State/UT"
            />

            {/* Crop */}
            <div>
              <label htmlFor="crop-field" className="form-label">
                Crop <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <select
                id="crop-field"
                className={`form-select ${clientErrors.crop ? "form-input-error" : ""}`}
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                disabled={isLoading || isDataLoading}
                required
              >
                <option value="">Select Crop</option>
                {cropList.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Season */}
            <div>
              <label htmlFor="season-field" className="form-label">Season</label>
              <select
                id="season-field"
                className="form-select"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                disabled={isLoading}
              >
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Zaid">Zaid (Summer)</option>
                <option value="Annual">Annual</option>
              </select>
            </div>

            {/* Irrigation */}
            <div>
              <label htmlFor="irrigation-field" className="form-label">Water Source</label>
              <select
                id="irrigation-field"
                className="form-select"
                value={formData.irrigationType}
                onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                disabled={isLoading}
              >
                <option value="Canal">Canal Irrigation</option>
                <option value="Tubewell / Borewell">Tubewell / Borewell</option>
                <option value="Drip / Sprinkler">Drip / Sprinkler</option>
                <option value="Rainfed">Rainfed (Monsoon only)</option>
              </select>
            </div>

            {/* Land Topography */}
            <div>
              <label htmlFor="land-field" className="form-label">Land Topography</label>
              <select
                id="land-field"
                className="form-select"
                value={formData.landType}
                onChange={(e) => setFormData({ ...formData, landType: e.target.value })}
                disabled={isLoading}
              >
                <option value="Upland (Well-drained)">Upland (Well-drained)</option>
                <option value="Medium Land">Medium Land</option>
                <option value="Lowland (Submergence prone)">Lowland (Waterlogging prone)</option>
                <option value="Coastal / Saline">Coastal / Saline affected</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid var(--color-neutral-200)" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowResetModal(true)}
              disabled={isLoading}
            >
              <RotateCcw size={16} /> Reset
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || isDataLoading}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {isLoading ? "Evaluating Risk Vectors..." : "Analyze Agricultural Risks"}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        {/* Results */}
        {riskData && (
          <div ref={resultRef} style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ background: "#ffffff", border: "1px solid var(--color-border)", borderRadius: 12, padding: "2rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--color-neutral-200)" }}>
                <div>
                  <span className="badge badge-neutral" style={{ marginBottom: "0.25rem" }}>
                    District Risk Profile
                  </span>
                  <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--color-neutral-900)", margin: 0 }}>
                    {riskData.crop} Risk Matrix for {riskData.district}
                  </h2>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    className={`badge ${
                      riskData.riskProfile.overallRiskRating === "High Risk"
                        ? "badge-danger"
                        : riskData.riskProfile.overallRiskRating === "Moderate Risk"
                        ? "badge-warning"
                        : "badge-success"
                    }`}
                    style={{ fontSize: "0.9375rem", padding: "0.35rem 0.85rem" }}
                  >
                    {riskData.riskProfile.overallRiskRating} ({riskData.riskProfile.riskScore}/100)
                  </span>
                </div>
              </div>

              {/* 4 Risk Dimension Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
                {/* 1. Meteorological Drought */}
                <div style={{ background: "var(--color-neutral-50)", padding: "1.25rem", borderRadius: 8, border: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#d97706", marginBottom: "0.5rem" }}>
                    <CloudRain size={20} />
                    <strong style={{ fontSize: "0.875rem", color: "var(--color-neutral-900)" }}>Drought Risk</strong>
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-neutral-900)", margin: "0.25rem 0" }}>
                    {riskData.riskProfile.droughtRiskPct}%
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-neutral-600)", margin: 0 }}>
                    Historical frequency of seasonal rainfall deficit (&gt;19% below normal).
                  </p>
                  <span style={{ fontSize: "0.6875rem", color: "var(--color-neutral-400)", display: "block", marginTop: "0.5rem" }}>
                    Source: {riskData.provenance.droughtSource}
                  </span>
                </div>

                {/* 2. Flood Hazard */}
                <div style={{ background: "var(--color-neutral-50)", padding: "1.25rem", borderRadius: 8, border: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#2563eb", marginBottom: "0.5rem" }}>
                    <Droplets size={20} />
                    <strong style={{ fontSize: "0.875rem", color: "var(--color-neutral-900)" }}>Inundation Hazard</strong>
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-neutral-900)", margin: "0.25rem 0" }}>
                    {riskData.riskProfile.floodRiskClass}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-neutral-600)", margin: 0 }}>
                    Satellite-derived flood inundation vulnerability mapping.
                  </p>
                  <span style={{ fontSize: "0.6875rem", color: "var(--color-neutral-400)", display: "block", marginTop: "0.5rem" }}>
                    Source: {riskData.provenance.floodSource}
                  </span>
                </div>

                {/* 3. Market Price Volatility */}
                <div style={{ background: "var(--color-neutral-50)", padding: "1.25rem", borderRadius: 8, border: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#dc2626", marginBottom: "0.5rem" }}>
                    <TrendingDown size={20} />
                    <strong style={{ fontSize: "0.875rem", color: "var(--color-neutral-900)" }}>Price Volatility</strong>
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-neutral-900)", margin: "0.25rem 0" }}>
                    CV {riskData.riskProfile.marketVolatilityCV}%
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-neutral-600)", margin: 0 }}>
                    Coefficient of Variation across wholesale APMC mandi arrivals.
                  </p>
                  <span style={{ fontSize: "0.6875rem", color: "var(--color-neutral-400)", display: "block", marginTop: "0.5rem" }}>
                    Source: {riskData.provenance.marketSource}
                  </span>
                </div>

                {/* 4. Pest Pressure */}
                <div style={{ background: "var(--color-neutral-50)", padding: "1.25rem", borderRadius: 8, border: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#7c3aed", marginBottom: "0.5rem" }}>
                    <Bug size={20} />
                    <strong style={{ fontSize: "0.875rem", color: "var(--color-neutral-900)" }}>Pest Vulnerability</strong>
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-neutral-900)", margin: "0.25rem 0" }}>
                    {riskData.riskProfile.pestVulnerability}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-neutral-600)", margin: 0 }}>
                    Seasonal pest resurgence index for {riskData.crop}.
                  </p>
                  <span style={{ fontSize: "0.6875rem", color: "var(--color-neutral-400)", display: "block", marginTop: "0.5rem" }}>
                    Source: ICAR Crop Protection Division
                  </span>
                </div>
              </div>

              {/* Key Drivers & Mitigation Advice */}
              <div style={{ background: "var(--color-green-50)", borderRadius: 10, padding: "1.5rem", border: "1px solid var(--color-green-200)", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--color-green-900)", marginBottom: "0.75rem" }}>
                  Primary Risk Drivers Identified
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-800)", marginBottom: "1rem", lineHeight: 1.5 }}>
                  {riskData.riskProfile.keyDrivers}
                </p>

                <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--color-green-900)", marginBottom: "0.75rem" }}>
                  Recommended Risk Mitigation Strategy
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-800)", margin: 0, lineHeight: 1.5 }}>
                  {riskData.riskProfile.mitigationAdvice}
                </p>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <Link href="/yield-assessment" className="btn btn-outline">
                  Calculate Combined Yield Potential &rarr;
                </Link>
                <button type="button" onClick={() => window.print()} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <Printer size={16} /> Print Risk Assessment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showResetModal}
          title="Reset Risk Parameters?"
          message="This will reset all selected fields back to default options."
          confirmLabel="Reset"
          onConfirm={handleReset}
          onCancel={() => setShowResetModal(false)}
        />
      </div>
    </div>
  );
}
