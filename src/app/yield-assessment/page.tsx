"use client";
import { useState } from "react";
import { Info, AlertCircle, ChevronDown, ArrowRight } from "lucide-react";
import { INDIAN_STATES, MAJOR_CROPS, CROP_SEASONS } from "@/lib/constants";

type FormState = {
  state: string;
  district: string;
  crop: string;
  season: string;
  area: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_STATE: FormState = {
  state: "",
  district: "",
  crop: "",
  season: "",
  area: "",
};

// Districts per state — a real subset for demonstration.
// In Phase 2 this will be populated from the DB.
const DISTRICTS_BY_STATE: Record<string, string[]> = {
  "Punjab": ["Amritsar", "Ludhiana", "Patiala", "Bathinda", "Gurdaspur", "Firozpur"],
  "Haryana": ["Ambala", "Hisar", "Karnal", "Rohtak", "Gurugram", "Sonipat"],
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Agra", "Allahabad", "Meerut", "Gorakhpur"],
  "Maharashtra": ["Pune", "Nashik", "Aurangabad", "Nagpur", "Solapur", "Kolhapur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Ajmer", "Bikaner", "Alwar"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Samastipur"],
  "West Bengal": ["Kolkata", "Murshidabad", "Nadia", "Bardhaman", "Jalpaiguri", "Bankura"],
  "Andhra Pradesh": ["Guntur", "Krishna", "Kurnool", "Chittoor", "East Godavari", "West Godavari"],
  "Karnataka": ["Bengaluru", "Mysuru", "Belagavi", "Dharwad", "Tumkur", "Vijayapura"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli"],
  "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Vadodara", "Junagadh", "Anand"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Berhampur", "Rourkela", "Sambalpur", "Puri"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Nalgonda"],
  "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tinsukia"],
};

function getDistricts(state: string): string[] {
  return DISTRICTS_BY_STATE[state] ?? [];
}

export default function YieldAssessmentPage() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const districts = getDistricts(form.state);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.state) e.state = "Please select a state.";
    if (!form.district) e.district = "Please select a district.";
    if (!form.crop) e.crop = "Please select a crop.";
    if (!form.season) e.season = "Please select a season.";
    if (form.area && (isNaN(Number(form.area)) || Number(form.area) <= 0))
      e.area = "Area must be a positive number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
      // Reset district when state changes
      ...(name === "state" ? { district: "" } : {}),
    }));
    // Clear the field error on change
    setErrors((err) => ({ ...err, [name]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate async — ML endpoint not built in Phase 1
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  }

  function handleReset() {
    setForm(INITIAL_STATE);
    setErrors({});
    setSubmitted(false);
  }

  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="section-container" style={{ maxWidth: "720px" }}>
        {/* Page header */}
        <header style={{ marginBottom: "2rem" }}>
          <span className="badge badge-green" style={{ marginBottom: "0.75rem" }}>
            Assessment Tool
          </span>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--color-neutral-900)",
              letterSpacing: "-0.025em",
              marginBottom: "0.625rem",
            }}
          >
            Crop Yield Assessment
          </h1>
          <p style={{ color: "var(--color-neutral-600)", fontSize: "1.0625rem", lineHeight: 1.65 }}>
            Select your location, crop, and season to receive a historical-data
            yield estimate based on district-level records from ICRISAT and MoAFW.
          </p>
        </header>

        {/* Disclaimer */}
        <div className="alert alert-warning" style={{ marginBottom: "2rem" }}>
          <strong>Note:</strong> Yield estimates in Phase 1 are based on
          historical district averages. The machine-learning model will be
          integrated in Phase 2. All source data is publicly available —{" "}
          <a href="/data-sources" style={{ color: "inherit", fontWeight: 600 }}>
            see Data Sources
          </a>
          .
        </div>

        {submitted ? (
          /* ── Result placeholder ──────────────────────────────────────── */
          <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--color-green-100)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
                color: "var(--color-primary)",
              }}
            >
              <ArrowRight size={24} />
            </div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--color-neutral-900)",
                marginBottom: "0.75rem",
              }}
            >
              Assessment Ready — Phase 2 Required
            </h2>
            <p
              style={{
                color: "var(--color-neutral-600)",
                fontSize: "0.9375rem",
                lineHeight: 1.65,
                maxWidth: "460px",
                margin: "0 auto 0.5rem",
              }}
            >
              Your inputs have been validated:
            </p>
            <dl
              style={{
                marginTop: "1rem",
                textAlign: "left",
                background: "var(--color-neutral-50)",
                borderRadius: 8,
                padding: "1rem 1.25rem",
                fontSize: "0.875rem",
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "0.375rem 1rem",
              }}
            >
              <dt style={{ fontWeight: 600, color: "var(--color-neutral-500)" }}>State</dt>
              <dd style={{ color: "var(--color-neutral-800)" }}>{form.state}</dd>
              <dt style={{ fontWeight: 600, color: "var(--color-neutral-500)" }}>District</dt>
              <dd style={{ color: "var(--color-neutral-800)" }}>{form.district}</dd>
              <dt style={{ fontWeight: 600, color: "var(--color-neutral-500)" }}>Crop</dt>
              <dd style={{ color: "var(--color-neutral-800)" }}>{form.crop}</dd>
              <dt style={{ fontWeight: 600, color: "var(--color-neutral-500)" }}>Season</dt>
              <dd style={{ color: "var(--color-neutral-800)" }}>{form.season}</dd>
              {form.area && (
                <>
                  <dt style={{ fontWeight: 600, color: "var(--color-neutral-500)" }}>Area</dt>
                  <dd style={{ color: "var(--color-neutral-800)" }}>{form.area} hectares</dd>
                </>
              )}
            </dl>
            <p
              className="alert alert-info"
              style={{ marginTop: "1.25rem", fontSize: "0.875rem" }}
            >
              The ML inference endpoint and district yield database will be connected
              in Phase 2. This form validates the input pipeline is functional.
            </p>
            <button
              className="btn btn-outline"
              onClick={handleReset}
              style={{ marginTop: "1.5rem" }}
            >
              Run Another Assessment
            </button>
          </div>
        ) : (
          /* ── Assessment form ─────────────────────────────────────────── */
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Crop yield assessment form"
            className="card"
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {/* State */}
            <div>
              <label htmlFor="state" className="form-label">
                State <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <select
                  id="state"
                  name="state"
                  className={`form-select${errors.state ? " error" : ""}`}
                  value={form.state}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.state ? "state-error" : undefined}
                  style={{ paddingRight: "2.5rem" }}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "var(--color-neutral-400)",
                  }}
                />
              </div>
              {errors.state && (
                <p id="state-error" className="form-error" role="alert">
                  {errors.state}
                </p>
              )}
            </div>

            {/* District */}
            <div>
              <label htmlFor="district" className="form-label">
                District <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <select
                  id="district"
                  name="district"
                  className={`form-select${errors.district ? " error" : ""}`}
                  value={form.district}
                  onChange={handleChange}
                  disabled={!form.state || districts.length === 0}
                  aria-required="true"
                  aria-describedby={errors.district ? "district-error" : "district-hint"}
                  style={{ paddingRight: "2.5rem" }}
                >
                  <option value="">
                    {form.state
                      ? districts.length > 0
                        ? "Select district"
                        : "Districts loading in Phase 2"
                      : "Select a state first"}
                  </option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "var(--color-neutral-400)",
                  }}
                />
              </div>
              {errors.district ? (
                <p id="district-error" className="form-error" role="alert">
                  {errors.district}
                </p>
              ) : (
                <p id="district-hint" className="form-hint">
                  {!form.state
                    ? "Choose a state to see available districts."
                    : districts.length === 0
                    ? "Full district list will be loaded from the database in Phase 2."
                    : `${districts.length} districts available for ${form.state}.`}
                </p>
              )}
            </div>

            {/* Crop */}
            <div>
              <label htmlFor="crop" className="form-label">
                Crop <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <select
                  id="crop"
                  name="crop"
                  className={`form-select${errors.crop ? " error" : ""}`}
                  value={form.crop}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.crop ? "crop-error" : undefined}
                  style={{ paddingRight: "2.5rem" }}
                >
                  <option value="">Select crop</option>
                  {MAJOR_CROPS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "var(--color-neutral-400)",
                  }}
                />
              </div>
              {errors.crop && (
                <p id="crop-error" className="form-error" role="alert">
                  {errors.crop}
                </p>
              )}
            </div>

            {/* Season */}
            <div>
              <label htmlFor="season" className="form-label">
                Growing Season <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <select
                  id="season"
                  name="season"
                  className={`form-select${errors.season ? " error" : ""}`}
                  value={form.season}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.season ? "season-error" : undefined}
                  style={{ paddingRight: "2.5rem" }}
                >
                  <option value="">Select season</option>
                  {CROP_SEASONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "var(--color-neutral-400)",
                  }}
                />
              </div>
              {errors.season && (
                <p id="season-error" className="form-error" role="alert">
                  {errors.season}
                </p>
              )}
            </div>

            {/* Area (optional) */}
            <div>
              <label htmlFor="area" className="form-label">
                Cultivated Area (hectares) — optional
              </label>
              <input
                id="area"
                name="area"
                type="number"
                className={`form-input${errors.area ? " error" : ""}`}
                value={form.area}
                onChange={handleChange}
                placeholder="e.g. 2.5"
                min="0.01"
                step="0.01"
                aria-describedby={errors.area ? "area-error" : "area-hint"}
              />
              {errors.area ? (
                <p id="area-error" className="form-error" role="alert">
                  {errors.area}
                </p>
              ) : (
                <p id="area-hint" className="form-hint">
                  Providing area allows the tool to calculate estimated total production.
                </p>
              )}
            </div>

            {/* Info note */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                background: "var(--color-neutral-50)",
                border: "1px solid var(--color-border)",
                borderRadius: 7,
                padding: "0.875rem 1rem",
                fontSize: "0.8125rem",
                color: "var(--color-neutral-600)",
              }}
            >
              <Info size={15} style={{ flexShrink: 0, marginTop: "1px", color: "var(--color-primary)" }} />
              <span>
                Yield estimates are computed from district-level historical records
                (1990–2020) from the ICRISAT District Level Data portal. Results show
                the 10-year moving average yield in kg/hectare.
              </span>
            </div>

            {/* Submit */}
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                aria-busy={loading}
                style={{ minWidth: 180 }}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Calculating…
                  </>
                ) : (
                  <>
                    Get Yield Estimate
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleReset}
                disabled={loading}
              >
                Clear Form
              </button>
            </div>

            {/* Required fields note */}
            <p style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>
              <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span> Required fields
            </p>
          </form>
        )}

        {/* Methodology note */}
        <div className="card" style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
            <AlertCircle
              size={18}
              style={{ flexShrink: 0, marginTop: "2px", color: "var(--color-amber-500)" }}
            />
            <div>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "var(--color-neutral-900)",
                  marginBottom: "0.375rem",
                }}
              >
                Methodology
              </h2>
              <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-600)", lineHeight: 1.65 }}>
                Phase 1 validates the form input pipeline. Phase 2 will connect a
                PostgreSQL database pre-loaded with ICRISAT district-season-crop yield
                records, and a Python/FastAPI endpoint running a regression model
                trained on that data. Estimates will always display confidence intervals
                and the data range used.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
