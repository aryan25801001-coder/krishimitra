"use client";
import { useState } from "react";
import { AlertTriangle, Info, ChevronDown, ArrowRight } from "lucide-react";
import { INDIAN_STATES, MAJOR_CROPS } from "@/lib/constants";

type RiskForm = {
  state: string;
  district: string;
  crop: string;
  landType: string;
  irrigationType: string;
  farmSize: string;
};

type FormErrors = Partial<Record<keyof RiskForm, string>>;

const LAND_TYPES = [
  "Canal-irrigated flatland",
  "Rainfed upland",
  "Rainfed lowland / flood-prone",
  "Dryland / semi-arid",
  "Hilly / undulating terrain",
  "Coastal / saline-prone",
];

const IRRIGATION_TYPES = [
  "Canal",
  "Borewell / tubewell",
  "Drip / micro-irrigation",
  "Rainfed (no irrigation)",
  "Tank / pond",
];

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
};

const RISK_CATEGORIES = [
  {
    key: "drought",
    label: "Drought Risk",
    description:
      "Based on IMD historical rainfall deficit data for your district and IMD aridity index for the region.",
  },
  {
    key: "flood",
    label: "Flood / Waterlogging Risk",
    description:
      "Derived from NRSC flood hazard mapping and historical inundation frequency for your stated land type.",
  },
  {
    key: "price",
    label: "Price Volatility Risk",
    description:
      "Computed from eNAM mandi price coefficient of variation for the selected crop over the last 5 years.",
  },
  {
    key: "soil",
    label: "Soil Degradation Risk",
    description:
      "Based on NBSS&LUP soil health card data and NRSC land-use change records for your district.",
  },
];

export default function RiskAssessmentPage() {
  const [form, setForm] = useState<RiskForm>({
    state: "",
    district: "",
    crop: "",
    landType: "",
    irrigationType: "",
    farmSize: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const districts = DISTRICTS_BY_STATE[form.state] ?? [];

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.state) e.state = "Please select a state.";
    if (!form.district) e.district = "Please select a district.";
    if (!form.crop) e.crop = "Please select a crop.";
    if (!form.landType) e.landType = "Please select a land type.";
    if (!form.irrigationType) e.irrigationType = "Please select an irrigation type.";
    if (form.farmSize && (isNaN(Number(form.farmSize)) || Number(form.farmSize) <= 0))
      e.farmSize = "Farm size must be a positive number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
      ...(name === "state" ? { district: "" } : {}),
    }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1600);
  }

  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="section-container" style={{ maxWidth: "760px" }}>
        <header style={{ marginBottom: "2rem" }}>
          <span className="badge badge-amber" style={{ marginBottom: "0.75rem" }}>
            Risk Tool
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
            Farmer Risk Assessment
          </h1>
          <p style={{ color: "var(--color-neutral-600)", fontSize: "1.0625rem", lineHeight: 1.65 }}>
            Understand drought, flood, price-volatility, and soil-degradation risks
            for your field based on district-level government data.
          </p>
        </header>

        <div className="alert alert-warning" style={{ marginBottom: "2rem" }}>
          <strong>Phase 1 note:</strong> Risk scoring from live datasets will be
          activated in Phase 2. This form validates the input pipeline and shows
          the structure of the risk output.
        </div>

        {submitted ? (
          <div>
            <div className="alert alert-success" style={{ marginBottom: "1.5rem" }}>
              Input validated. Risk score computation will run in Phase 2 once the
              dataset API is connected.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {RISK_CATEGORIES.map(({ key, label, description }) => (
                <div
                  key={key}
                  className="card"
                  style={{
                    borderLeft: "4px solid var(--color-border)",
                    padding: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-neutral-900)" }}>
                      {label}
                    </h3>
                    <span
                      className="skeleton"
                      style={{ width: 48, height: 22, borderRadius: 4 }}
                      aria-label="Score loading"
                    />
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--color-muted)", lineHeight: 1.6 }}>
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <p
              className="alert alert-info"
              style={{ fontSize: "0.875rem", marginBottom: "1.25rem" }}
            >
              Skeleton cards above show how risk scores will be displayed. Each
              score (Low / Medium / High) will link to the underlying dataset used.
            </p>

            <button
              className="btn btn-outline"
              onClick={() => { setForm({ state: "", district: "", crop: "", landType: "", irrigationType: "", farmSize: "" }); setSubmitted(false); }}
            >
              Run Another Assessment
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Farmer risk assessment form"
            className="card"
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {/* State */}
            <div>
              <label htmlFor="risk-state" className="form-label">
                State <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <select id="risk-state" name="state" className={`form-select${errors.state ? " error" : ""}`}
                  value={form.state} onChange={handleChange} aria-required="true"
                  style={{ paddingRight: "2.5rem" }}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-neutral-400)" }} />
              </div>
              {errors.state && <p className="form-error" role="alert">{errors.state}</p>}
            </div>

            {/* District */}
            <div>
              <label htmlFor="risk-district" className="form-label">
                District <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <select id="risk-district" name="district" className={`form-select${errors.district ? " error" : ""}`}
                  value={form.district} onChange={handleChange}
                  disabled={!form.state || districts.length === 0}
                  aria-required="true" style={{ paddingRight: "2.5rem" }}>
                  <option value="">{form.state ? (districts.length > 0 ? "Select district" : "Full list in Phase 2") : "Select state first"}</option>
                  {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-neutral-400)" }} />
              </div>
              {errors.district && <p className="form-error" role="alert">{errors.district}</p>}
            </div>

            {/* Crop */}
            <div>
              <label htmlFor="risk-crop" className="form-label">
                Crop <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <select id="risk-crop" name="crop" className={`form-select${errors.crop ? " error" : ""}`}
                  value={form.crop} onChange={handleChange} aria-required="true"
                  style={{ paddingRight: "2.5rem" }}>
                  <option value="">Select crop</option>
                  {MAJOR_CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-neutral-400)" }} />
              </div>
              {errors.crop && <p className="form-error" role="alert">{errors.crop}</p>}
            </div>

            {/* Land type */}
            <div>
              <label htmlFor="risk-land" className="form-label">
                Land Type <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <select id="risk-land" name="landType" className={`form-select${errors.landType ? " error" : ""}`}
                  value={form.landType} onChange={handleChange} aria-required="true"
                  style={{ paddingRight: "2.5rem" }}>
                  <option value="">Select land type</option>
                  {LAND_TYPES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-neutral-400)" }} />
              </div>
              {errors.landType && <p className="form-error" role="alert">{errors.landType}</p>}
            </div>

            {/* Irrigation */}
            <div>
              <label htmlFor="risk-irrigation" className="form-label">
                Irrigation Type <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <select id="risk-irrigation" name="irrigationType" className={`form-select${errors.irrigationType ? " error" : ""}`}
                  value={form.irrigationType} onChange={handleChange} aria-required="true"
                  style={{ paddingRight: "2.5rem" }}>
                  <option value="">Select irrigation type</option>
                  {IRRIGATION_TYPES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-neutral-400)" }} />
              </div>
              {errors.irrigationType && <p className="form-error" role="alert">{errors.irrigationType}</p>}
            </div>

            {/* Farm size */}
            <div>
              <label htmlFor="risk-size" className="form-label">
                Farm Size (hectares) — optional
              </label>
              <input id="risk-size" name="farmSize" type="number"
                className={`form-input${errors.farmSize ? " error" : ""}`}
                value={form.farmSize} onChange={handleChange}
                placeholder="e.g. 1.5" min="0.01" step="0.01"
                aria-describedby={errors.farmSize ? "size-error" : "size-hint"} />
              {errors.farmSize
                ? <p id="size-error" className="form-error" role="alert">{errors.farmSize}</p>
                : <p id="size-hint" className="form-hint">Farm size helps contextualise exposure to economic loss.</p>}
            </div>

            <div style={{ display: "flex", gap: "0.5rem", background: "var(--color-neutral-50)", border: "1px solid var(--color-border)", borderRadius: 7, padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "var(--color-neutral-600)" }}>
              <Info size={15} style={{ flexShrink: 0, marginTop: "1px", color: "var(--color-primary)" }} />
              <span>Risk scores use IMD rainfall records, eNAM price data, NBSS soil maps, and NRSC flood hazard layers. All sources are openly licensed.</span>
            </div>

            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <button type="submit" className="btn btn-primary" disabled={loading} aria-busy={loading} style={{ minWidth: 180 }}>
                {loading ? (
                  <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Analysing…</>
                ) : (
                  <>Get Risk Profile<ArrowRight size={16} /></>
                )}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => { setForm({ state: "", district: "", crop: "", landType: "", irrigationType: "", farmSize: "" }); setErrors({}); }} disabled={loading}>
                Clear Form
              </button>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>
              <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span> Required fields
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
