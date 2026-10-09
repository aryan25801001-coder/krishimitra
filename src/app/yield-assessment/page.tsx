"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sprout,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Info,
  Layers,
  CloudRain,
  Droplets,
  TrendingUp,
  ShieldAlert,
  BookOpen,
  BookmarkPlus,
  Printer,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { AssessmentResult } from "@/lib/advisory-engine";
import { saveAssessment } from "@/lib/assessment-storage";
import ConfirmationModal from "@/components/ConfirmationModal";
import SearchableSelect from "@/components/SearchableSelect";
import { INDIAN_STATES } from "@/lib/constants";

export default function YieldAssessmentPage() {
  // Form State
  const [stateList, setStateList] = useState<string[]>(Array.from(INDIAN_STATES));
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [cropList, setCropList] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    state: "Punjab",
    district: "Ludhiana",
    crop: "Wheat",
    season: "Kharif",
    farmAreaAcres: "2.5",
    soilType: "Alluvial (Loamy)",
    soilPh: "7.2",
    nitrogenStatus: "Medium" as "Low" | "Medium" | "High",
    phosphorusStatus: "Medium" as "Low" | "Medium" | "High",
    potassiumStatus: "High" as "Low" | "Medium" | "High",
    irrigationType: "Canal" as "Rainfed" | "Canal" | "Tubewell / Borewell" | "Drip / Sprinkler",
    organicManureApplied: true,
    fertilizerApplication: "Standard ICAR Dose" as "Standard ICAR Dose" | "Suboptimal / Low" | "Excessive Chemical" | "Organic Only",
  });

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDistrictLoading, setIsDistrictLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);

  // 1. Load initial states and crops
  useEffect(() => {
    async function loadMetadata() {
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
        console.error("Failed to load agricultural metadata", err);
      }
    }
    loadMetadata();
  }, []);

  // 2. Cascade districts when state changes
  useEffect(() => {
    if (!formData.state) {
      setDistrictList([]);
      return;
    }
    async function loadDistricts() {
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
        console.error("Failed to fetch districts", e);
      } finally {
        setIsDistrictLoading(false);
      }
    }
    loadDistricts();
  }, [formData.state]);

  // Client-side validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.state.trim()) errs.state = "Please select a state.";
    if (!formData.district.trim()) errs.district = "Please select a district.";
    if (!formData.crop.trim()) errs.crop = "Please select a crop.";
    if (!formData.season) errs.season = "Please select a crop season.";

    const area = Number(formData.farmAreaAcres);
    if (isNaN(area) || area <= 0 || area > 5000) {
      errs.farmAreaAcres = "Enter a valid land area between 0.1 and 5,000 acres.";
    }

    if (formData.soilPh) {
      const ph = Number(formData.soilPh);
      if (isNaN(ph) || ph < 3.5 || ph > 10.5) {
        errs.soilPh = "Soil pH must be between 3.5 and 10.5.";
      }
    }

    setClientErrors(errs);
    if (Object.keys(errs).length > 0) {
      errorSummaryRef.current?.focus();
      return false;
    }
    return true;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    setIsSaved(false);

    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        if (resJson.validationErrors) {
          setClientErrors(resJson.validationErrors);
        }
        throw new Error(resJson.error || "Failed to process crop yield assessment.");
      }

      setResult(resJson.data);
      // Auto-save to local assessment history
      saveAssessment(resJson.data);
      setIsSaved(true);

      // Smooth scroll to result
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err: any) {
      setServerError(err.message || "A network error occurred. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset confirmation
  const handleConfirmReset = () => {
    setFormData({
      state: stateList[0] || "Punjab",
      district: districtList[0] || "Ludhiana",
      crop: "Wheat",
      season: "Rabi",
      farmAreaAcres: "2.5",
      soilType: "Alluvial (Loamy)",
      soilPh: "7.2",
      nitrogenStatus: "Medium",
      phosphorusStatus: "Medium",
      potassiumStatus: "High",
      irrigationType: "Canal",
      organicManureApplied: true,
      fertilizerApplication: "Standard ICAR Dose",
    });
    setClientErrors({});
    setServerError(null);
    setResult(null);
    setShowResetModal(false);
  };

  return (
    <div style={{ padding: "2.5rem 0 5rem" }}>
      <div className="section-container" style={{ maxWidth: "980px" }}>
        {/* Breadcrumb & Heading */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "1rem" }}>
          <ol style={{ display: "flex", gap: "0.5rem", listStyle: "none", fontSize: "0.875rem", color: "var(--color-neutral-500)" }}>
            <li><Link href="/" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Home</Link></li>
            <li>/</li>
            <li aria-current="page" style={{ color: "var(--color-neutral-700)", fontWeight: 600 }}>Crop Yield Assessment</li>
          </ol>
        </nav>

        <header style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
            <span className="badge badge-primary">ICAR &amp; ICRISAT Grounded</span>
            <span className="badge badge-neutral">All 36 States &amp; UTs Supported</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.375rem)", fontWeight: 800, color: "var(--color-neutral-900)", letterSpacing: "-0.025em", marginBottom: "0.5rem" }}>
            Crop Yield Potential &amp; Advisory Assessment
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "var(--color-neutral-600)", lineHeight: 1.6, maxWidth: "780px" }}>
            Enter your location, crop, soil metrics, and irrigation availability to receive an explainable yield projection, multi-factor risk score, and official ICAR agronomic guidelines.
          </p>
        </header>

        {/* Accessible Error Summary */}
        {Object.keys(clientErrors).length > 0 && (
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            role="alert"
            className="alert alert-danger"
            style={{ marginBottom: "2rem", outline: "none" }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
              <div>
                <strong style={{ display: "block", marginBottom: "0.375rem" }}>
                  Please fix the following {Object.keys(clientErrors).length} error(s) before proceeding:
                </strong>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.875rem" }}>
                  {Object.entries(clientErrors).map(([field, msg]) => (
                    <li key={field}>{msg}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {serverError && (
          <div role="alert" className="alert alert-danger" style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <AlertCircle size={20} />
              <span>{serverError}</span>
            </div>
          </div>
        )}

        {/* Assessment Form */}
        <form onSubmit={handleSubmit} noValidate style={{ background: "#ffffff", border: "1px solid var(--color-border)", borderRadius: 12, padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "3rem" }}>
          {/* Section 1: Geographic & Crop Details */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-neutral-900)", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--color-neutral-200)" }}>
              <Layers size={18} color="var(--color-primary)" />
              1. Location &amp; Crop Selection
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
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
                id="state-select"
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
                id="district-select"
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
                <label htmlFor="crop-select" className="form-label">
                  Crop <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  id="crop-select"
                  className={`form-select ${clientErrors.crop ? "form-input-error" : ""}`}
                  value={formData.crop}
                  onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                  disabled={isLoading || isDataLoading}
                  required
                >
                  <option value="">Select Crop</option>
                  {cropList.map((c) => (
                    <option key={c.name} value={c.name}>{c.name} ({c.category})</option>
                  ))}
                </select>
                {clientErrors.crop && <p className="form-error">{clientErrors.crop}</p>}
              </div>

              {/* Season */}
              <div>
                <label htmlFor="season-select" className="form-label">
                  Cultivation Season <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  id="season-select"
                  className="form-select"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  disabled={isLoading}
                >
                  <option value="Kharif">Kharif (Monsoon / Autumn)</option>
                  <option value="Rabi">Rabi (Winter / Spring)</option>
                  <option value="Zaid">Zaid (Summer)</option>
                  <option value="Annual">Annual (Full Year)</option>
                </select>
              </div>

              {/* Farm Area */}
              <div>
                <label htmlFor="area-input" className="form-label">
                  Farm Land Area (Acres) <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  id="area-input"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="5000"
                  className={`form-input ${clientErrors.farmAreaAcres ? "form-input-error" : ""}`}
                  value={formData.farmAreaAcres}
                  onChange={(e) => setFormData({ ...formData, farmAreaAcres: e.target.value })}
                  disabled={isLoading}
                  required
                />
                {clientErrors.farmAreaAcres && <p className="form-error">{clientErrors.farmAreaAcres}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Soil Health & Nutrient Status */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-neutral-900)", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--color-neutral-200)" }}>
              <Sprout size={18} color="var(--color-primary)" />
              2. Soil Characteristics &amp; Fertility
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
              {/* Soil Type */}
              <div>
                <label htmlFor="soil-type-input" className="form-label">Soil Type</label>
                <select
                  id="soil-type-input"
                  className="form-select"
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  disabled={isLoading}
                >
                  <option value="Alluvial (Loamy)">Alluvial (Loamy)</option>
                  <option value="Alluvial (Sandy Loam)">Alluvial (Sandy Loam)</option>
                  <option value="Deep Black Soil (Vertisol)">Deep Black (Vertisol)</option>
                  <option value="Medium Black (Clayey)">Medium Black (Clayey)</option>
                  <option value="Red Sandy Loam">Red Sandy Loam</option>
                  <option value="Desert / Sandy Alluvial">Desert / Sandy Alluvial</option>
                  <option value="Tarai / Silty Alluvial">Tarai / Silty Alluvial</option>
                  <option value="Deltaic Alluvial / Clayey">Deltaic Alluvial</option>
                </select>
              </div>

              {/* Soil pH */}
              <div>
                <label htmlFor="ph-input" className="form-label">
                  Soil pH (Acidity / Alkalinity)
                </label>
                <input
                  id="ph-input"
                  type="number"
                  step="0.1"
                  min="3.5"
                  max="10.5"
                  className={`form-input ${clientErrors.soilPh ? "form-input-error" : ""}`}
                  value={formData.soilPh}
                  onChange={(e) => setFormData({ ...formData, soilPh: e.target.value })}
                  disabled={isLoading}
                  placeholder="e.g. 7.2 (Neutral)"
                />
                <span style={{ fontSize: "0.75rem", color: "var(--color-neutral-500)" }}>
                  Optimal range for most crops: 6.0 - 8.0
                </span>
                {clientErrors.soilPh && <p className="form-error">{clientErrors.soilPh}</p>}
              </div>

              {/* Nitrogen */}
              <div>
                <label htmlFor="n-select" className="form-label">Nitrogen (N) Status</label>
                <select
                  id="n-select"
                  className="form-select"
                  value={formData.nitrogenStatus}
                  onChange={(e) => setFormData({ ...formData, nitrogenStatus: e.target.value as any })}
                  disabled={isLoading}
                >
                  <option value="Low">Low (&lt; 280 kg/ha)</option>
                  <option value="Medium">Medium (280 - 560 kg/ha)</option>
                  <option value="High">High (&gt; 560 kg/ha)</option>
                </select>
              </div>

              {/* Phosphorus */}
              <div>
                <label htmlFor="p-select" className="form-label">Phosphorus (P) Status</label>
                <select
                  id="p-select"
                  className="form-select"
                  value={formData.phosphorusStatus}
                  onChange={(e) => setFormData({ ...formData, phosphorusStatus: e.target.value as any })}
                  disabled={isLoading}
                >
                  <option value="Low">Low (&lt; 10 kg/ha)</option>
                  <option value="Medium">Medium (10 - 25 kg/ha)</option>
                  <option value="High">High (&gt; 25 kg/ha)</option>
                </select>
              </div>

              {/* Potassium */}
              <div>
                <label htmlFor="k-select" className="form-label">Potassium (K) Status</label>
                <select
                  id="k-select"
                  className="form-select"
                  value={formData.potassiumStatus}
                  onChange={(e) => setFormData({ ...formData, potassiumStatus: e.target.value as any })}
                  disabled={isLoading}
                >
                  <option value="Low">Low (&lt; 110 kg/ha)</option>
                  <option value="Medium">Medium (110 - 280 kg/ha)</option>
                  <option value="High">High (&gt; 280 kg/ha)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Water & Management */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-neutral-900)", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--color-neutral-200)" }}>
              <Droplets size={18} color="var(--color-primary)" />
              3. Irrigation &amp; Crop Management
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {/* Irrigation Type */}
              <div>
                <label htmlFor="irrigation-select" className="form-label">
                  Irrigation Availability <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  id="irrigation-select"
                  className="form-select"
                  value={formData.irrigationType}
                  onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value as any })}
                  disabled={isLoading}
                >
                  <option value="Canal">Canal Irrigation (Surface)</option>
                  <option value="Tubewell / Borewell">Tubewell / Borewell (Groundwater)</option>
                  <option value="Drip / Sprinkler">Micro-Irrigation (Drip / Sprinkler)</option>
                  <option value="Rainfed">Rainfed (100% Monsoon Dependent)</option>
                </select>
              </div>

              {/* Fertilizer Practice */}
              <div>
                <label htmlFor="fert-select" className="form-label">Nutrient Application Practice</label>
                <select
                  id="fert-select"
                  className="form-select"
                  value={formData.fertilizerApplication}
                  onChange={(e) => setFormData({ ...formData, fertilizerApplication: e.target.value as any })}
                  disabled={isLoading}
                >
                  <option value="Standard ICAR Dose">Recommended ICAR Split Dose</option>
                  <option value="Suboptimal / Low">Suboptimal / Low Fertilizer Input</option>
                  <option value="Excessive Chemical">High / Excessive Chemical Fertilizers</option>
                  <option value="Organic Only">Organic / Biofertilizer Only</option>
                </select>
              </div>

              {/* Organic Manure Checkbox */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1.75rem" }}>
                <input
                  id="manure-checkbox"
                  type="checkbox"
                  checked={formData.organicManureApplied}
                  onChange={(e) => setFormData({ ...formData, organicManureApplied: e.target.checked })}
                  disabled={isLoading}
                  style={{ width: "18px", height: "18px", accentColor: "var(--color-primary)", cursor: "pointer" }}
                />
                <label htmlFor="manure-checkbox" style={{ fontSize: "0.875rem", color: "var(--color-neutral-800)", cursor: "pointer", userSelect: "none" }}>
                  Farm Yard Manure (FYM) / Compost Applied (5-10 t/ha)
                </label>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid var(--color-neutral-200)" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowResetModal(true)}
              disabled={isLoading}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <RotateCcw size={16} />
              Reset Form
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || isDataLoading}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "200px", justifyContent: "center" }}
            >
              {isLoading ? (
                <>
                  <span className="spinner" style={{ width: 18, height: 18 }} aria-hidden="true" />
                  Calculating Assessment...
                </>
              ) : (
                <>
                  Generate Assessment
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results Section */}
        {result && (
          <div ref={resultSectionRef} style={{ animation: "fadeIn 0.3s ease" }}>
            {/* Data Availability Status Banner */}
            {result.dataAvailability?.notice && (
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: 10,
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                }}
              >
                <Info size={20} style={{ color: "#b45309", flexShrink: 0, marginTop: "0.125rem" }} />
                <div style={{ fontSize: "0.875rem", color: "#92400e", lineHeight: 1.5 }}>
                  <strong style={{ display: "block", marginBottom: "0.25rem" }}>
                    District Administrative Status & Data Availability:
                  </strong>
                  {result.dataAvailability.notice}
                </div>
              </div>
            )}

            {/* Header / Meta Strip */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem", background: "var(--color-green-50)", border: "1px solid var(--color-green-200)", borderRadius: 10, padding: "1.25rem 1.5rem", marginBottom: "2rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-green-700)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Assessment ID: {result.id}
                </span>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-neutral-900)", margin: "0.25rem 0" }}>
                  {result.input.crop} Evaluation for {result.input.district}, {result.input.state}
                </h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-neutral-600)", margin: 0 }}>
                  Season: {result.input.season} | Farm Area: {result.input.farmAreaAcres} Acres | Irrigation: {result.input.irrigationType}
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                {isSaved && (
                  <span className="badge badge-success" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <CheckCircle2 size={13} /> Saved to Dashboard
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-outline"
                  style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", padding: "0.4rem 0.75rem" }}
                >
                  <Printer size={15} /> Print Advisory
                </button>
              </div>
            </div>

            {/* Results Grid: 3 Pillars */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
              {/* Pillar 1: Yield Potential */}
              <div className="card" style={{ borderTop: "4px solid var(--color-primary)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-neutral-500)", letterSpacing: "0.05em" }}>
                    Yield Projection
                  </span>
                  <span className="badge badge-success">Confidence: {result.yieldEstimate.confidenceLevel}</span>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-neutral-900)", lineHeight: 1.1 }}>
                    {result.yieldEstimate.estimatedYieldQuintalsPerAcre} <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-neutral-600)" }}>Qtl / Acre</span>
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", marginTop: "0.25rem" }}>
                    ({result.yieldEstimate.estimatedYieldKgHa.toLocaleString()} kg / Hectare)
                  </div>
                </div>

                <div style={{ background: "var(--color-neutral-50)", borderRadius: 8, padding: "0.75rem", fontSize: "0.8125rem", border: "1px solid var(--color-neutral-200)", marginBottom: "1rem" }}>
                  <strong>Total Estimated Harvest:</strong> {result.yieldEstimate.estimatedTotalProductionQuintals} Quintals across {result.input.farmAreaAcres} acres.
                </div>

                <div style={{ fontSize: "0.75rem", color: "var(--color-neutral-500)", borderTop: "1px solid var(--color-neutral-200)", paddingTop: "0.75rem" }}>
                  <strong>Observed District Baseline:</strong> {result.historicalObserved.districtAvgYieldKgHa.toLocaleString()} kg/ha (ICRISAT DLD Records).
                </div>
              </div>

              {/* Pillar 2: Multi-Factor Risk */}
              <div className="card" style={{ borderTop: `4px solid ${result.riskAnalysis.overallRiskRating === "High Risk" ? "#dc2626" : result.riskAnalysis.overallRiskRating === "Moderate Risk" ? "var(--color-amber-500)" : "var(--color-primary)"}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-neutral-500)", letterSpacing: "0.05em" }}>
                    Multi-Factor Risk
                  </span>
                  <span className={`badge ${result.riskAnalysis.overallRiskRating === "High Risk" ? "badge-danger" : result.riskAnalysis.overallRiskRating === "Moderate Risk" ? "badge-warning" : "badge-success"}`}>
                    {result.riskAnalysis.overallRiskRating}
                  </span>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-neutral-900)", lineHeight: 1.1 }}>
                    {result.riskAnalysis.compositeRiskScore} <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-neutral-600)" }}>/ 100</span>
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", marginTop: "0.25rem" }}>
                    Composite Vulnerability Index
                  </div>
                </div>

                <ul style={{ listStyle: "none", fontSize: "0.8125rem", display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "1rem" }}>
                  <li style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-neutral-600)" }}>Drought Risk:</span>
                    <strong>{result.riskAnalysis.climateDroughtRiskPct}% probability</strong>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-neutral-600)" }}>Market Volatility (eNAM):</span>
                    <strong>CV {result.riskAnalysis.marketPriceVolatilityCV}%</strong>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-neutral-600)" }}>Pest Susceptibility:</span>
                    <strong>{result.riskAnalysis.pestVulnerability}</strong>
                  </li>
                </ul>

                <div style={{ fontSize: "0.75rem", color: "var(--color-neutral-500)", borderTop: "1px solid var(--color-neutral-200)", paddingTop: "0.75rem" }}>
                  Sources: IMD Gridded Rainfall, NRSC Flood Atlas, eNAM Mandi Records.
                </div>
              </div>

              {/* Pillar 3: Crop Profile & Benchmark */}
              <div className="card" style={{ borderTop: "4px solid var(--color-neutral-600)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-neutral-500)", letterSpacing: "0.05em" }}>
                    Agronomic Standard
                  </span>
                  <span className="badge badge-neutral">ICAR Standard</span>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-neutral-900)" }}>
                    {result.cropDetails.name}
                  </div>
                  <div style={{ fontSize: "0.8125rem", fontStyle: "italic", color: "var(--color-neutral-500)" }}>
                    {result.cropDetails.botanicalName}
                  </div>
                </div>

                <div style={{ fontSize: "0.8125rem", display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "1rem" }}>
                  <div><strong>Maturity:</strong> {result.cropDetails.growthDurationDays}</div>
                  <div><strong>Category:</strong> {result.cropDetails.category}</div>
                  <div><strong>Major Pests:</strong> {result.cropDetails.majorPests.split(",")[0]}</div>
                </div>

                <div style={{ fontSize: "0.75rem", color: "var(--color-neutral-500)", borderTop: "1px solid var(--color-neutral-200)", paddingTop: "0.75rem" }}>
                  Reference: {result.cropDetails.icarReference}
                </div>
              </div>
            </div>

            {/* Explainable Factor Breakdown */}
            <div className="card" style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <TrendingUp size={18} color="var(--color-primary)" />
                Explainable Yield Factor Adjustments
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-600)", marginBottom: "1.25rem" }}>
                How specific soil, nutrient, and water characteristics influence the baseline historical yield in {result.input.district}:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {result.yieldEstimate.factors.map((f, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.875rem 1rem",
                      borderRadius: 8,
                      border: "1px solid var(--color-neutral-200)",
                      background: f.impactPercent >= 0 ? "var(--color-green-50)" : "#fff8f8",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "240px" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-neutral-900)" }}>
                        {f.factor}
                      </div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--color-neutral-600)", marginTop: "0.125rem" }}>
                        {f.explanation}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", marginTop: "0.25rem" }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: "0.9375rem",
                          color: f.impactPercent > 0 ? "var(--color-green-700)" : f.impactPercent < 0 ? "#dc2626" : "var(--color-neutral-600)",
                        }}
                      >
                        {f.impactPercent > 0 ? `+${f.impactPercent}%` : f.impactPercent < 0 ? `${f.impactPercent}%` : "Baseline (0%)"}
                      </span>
                      <div style={{ fontSize: "0.6875rem", color: "var(--color-neutral-500)" }}>{f.datasetSource}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Agronomic Advisory */}
            <div className="card" style={{ marginBottom: "2rem", backgroundColor: "var(--color-neutral-50)" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={18} color="var(--color-primary)" />
                Official ICAR Agronomic Advisory &amp; Action Plan
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                {/* Certified Varieties */}
                <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: 8, border: "1px solid var(--color-border)" }}>
                  <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "0.75rem" }}>
                    🌱 Certified Varieties for Your Zone
                  </h4>
                  {result.agronomicAdvisory.recommendedVarieties.length > 0 ? (
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem", fontSize: "0.8125rem" }}>
                      {result.agronomicAdvisory.recommendedVarieties.map((v, i) => (
                        <li key={i} style={{ borderBottom: "1px solid var(--color-neutral-100)", paddingBottom: "0.375rem" }}>
                          <strong style={{ color: "var(--color-neutral-900)" }}>{v.name}</strong> ({v.durationDays} Days)
                          <p style={{ margin: "0.125rem 0 0", color: "var(--color-neutral-600)" }}>{v.traits}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-neutral-600)" }}>
                      Refer to your local Krishi Vigyan Kendra (KVK) for newly released regional varieties.
                    </p>
                  )}
                </div>

                {/* Nutrient Management */}
                <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: 8, border: "1px solid var(--color-border)" }}>
                  <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "0.75rem" }}>
                    🧪 ICAR Recommended Nutrient Doses
                  </h4>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    <span className="badge badge-neutral">N: {result.agronomicAdvisory.nutrientManagement.nKgHa} kg/ha</span>
                    <span className="badge badge-neutral">P: {result.agronomicAdvisory.nutrientManagement.pKgHa} kg/ha</span>
                    <span className="badge badge-neutral">K: {result.agronomicAdvisory.nutrientManagement.kKgHa} kg/ha</span>
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--color-neutral-700)", lineHeight: 1.5 }}>
                    <p style={{ marginBottom: "0.375rem" }}><strong>Basal:</strong> {result.agronomicAdvisory.nutrientManagement.basalAdvice}</p>
                    <p style={{ margin: 0 }}><strong>Top Dressing:</strong> {result.agronomicAdvisory.nutrientManagement.topDressingAdvice}</p>
                  </div>
                </div>

                {/* Water Management */}
                <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: 8, border: "1px solid var(--color-border)" }}>
                  <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "0.5rem" }}>
                    💧 Water &amp; Moisture Conservation
                  </h4>
                  <p style={{ fontSize: "0.8125rem", color: "var(--color-neutral-700)", lineHeight: 1.5, margin: 0 }}>
                    {result.agronomicAdvisory.waterManagement}
                  </p>
                </div>

                {/* Pest & Risk Mitigation */}
                <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: 8, border: "1px solid var(--color-border)" }}>
                  <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "0.5rem" }}>
                    🛡️ Integrated Pest &amp; Risk Mitigation
                  </h4>
                  <p style={{ fontSize: "0.8125rem", color: "var(--color-neutral-700)", lineHeight: 1.5, marginBottom: "0.5rem" }}>
                    {result.agronomicAdvisory.pestManagement}
                  </p>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-amber-700)", background: "var(--color-amber-50)", padding: "0.5rem", borderRadius: 6, border: "1px solid #fef08a" }}>
                    <strong>Risk Hedge:</strong> {result.agronomicAdvisory.riskMitigation}
                  </div>
                </div>
              </div>
            </div>

            {/* Scientific Disclaimer */}
            <div className="alert alert-warning" style={{ fontSize: "0.8125rem", marginBottom: "2rem" }}>
              <strong>Scientific Advisory Disclaimer:</strong> {result.disclaimer}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <Link href="/dashboard" className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                View All Saved Assessments in Dashboard <ChevronRight size={16} />
              </Link>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Perform Another Assessment
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showResetModal}
          title="Reset Assessment Form?"
          message="This will clear all entered parameters and return all fields to their default state. Any unsaved input will be lost."
          confirmLabel="Reset All Fields"
          onConfirm={handleConfirmReset}
          onCancel={() => setShowResetModal(false)}
        />
      </div>
    </div>
  );
}
