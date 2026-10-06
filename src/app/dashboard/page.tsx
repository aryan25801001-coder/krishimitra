"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sprout,
  TrendingUp,
  ShieldAlert,
  Calendar,
  Layers,
  Trash2,
  Printer,
  ChevronRight,
  PlusCircle,
  BarChart3,
  Database,
  ExternalLink,
  BookOpen,
  Info,
  CheckCircle2,
} from "lucide-react";
import { AssessmentResult } from "@/lib/advisory-engine";
import { getStoredAssessments, deleteAssessment, clearAllAssessments } from "@/lib/assessment-storage";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentResult | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [ingestionStats, setIngestionStats] = useState<any | null>(null);

  useEffect(() => {
    // Load local stored assessments
    const loaded = getStoredAssessments();
    setAssessments(loaded);

    // Load pipeline stats
    fetch("/api/ingestion-status")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setIngestionStats(json.data);
      })
      .catch((e) => console.error("Failed to load ingestion stats", e));
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteAssessment(id);
    setAssessments(updated);
    if (selectedAssessment?.id === id) {
      setSelectedAssessment(null);
    }
    setDeleteTargetId(null);
  };

  const handleClearAll = () => {
    clearAllAssessments();
    setAssessments([]);
    setSelectedAssessment(null);
    setShowClearAllModal(false);
  };

  // Compute aggregate dashboard stats
  const totalAssessments = assessments.length;
  const avgYieldQtl =
    totalAssessments > 0
      ? (
          assessments.reduce(
            (acc, curr) => acc + curr.yieldEstimate.estimatedYieldQuintalsPerAcre,
            0
          ) / totalAssessments
        ).toFixed(1)
      : "—";

  const highRiskCount = assessments.filter(
    (a) => a.riskAnalysis.overallRiskRating === "High Risk"
  ).length;

  return (
    <div style={{ padding: "2.5rem 0 5rem" }}>
      <div className="section-container">
        {/* Header */}
        <header style={{ marginBottom: "2rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
              <span className="badge badge-primary">Farmer Advisory Center</span>
              <span className="badge badge-neutral">Live Operational Hub</span>
            </div>
            <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800, color: "var(--color-neutral-900)", margin: 0, letterSpacing: "-0.025em" }}>
              Agricultural Intelligence Dashboard
            </h1>
          </div>

          <Link href="/yield-assessment" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PlusCircle size={18} /> New Crop Assessment
          </Link>
        </header>

        {/* 4 Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
          {/* Total Assessments */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase" }}>
                Completed Assessments
              </span>
              <BarChart3 size={20} color="var(--color-primary)" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-neutral-900)" }}>
              {totalAssessments}
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--color-neutral-500)", margin: "0.25rem 0 0" }}>
              Saved in your personal farm history
            </p>
          </div>

          {/* Average Yield Potential */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase" }}>
                Avg. Yield Potential
              </span>
              <TrendingUp size={20} color="var(--color-primary)" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-neutral-900)" }}>
              {avgYieldQtl} <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-neutral-600)" }}>Qtl/Acre</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--color-neutral-500)", margin: "0.25rem 0 0" }}>
              Across your evaluated fields
            </p>
          </div>

          {/* High Risk Flags */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase" }}>
                High-Risk Fields
              </span>
              <ShieldAlert size={20} color="#dc2626" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: highRiskCount > 0 ? "#dc2626" : "var(--color-neutral-900)" }}>
              {highRiskCount}
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--color-neutral-500)", margin: "0.25rem 0 0" }}>
              Require priority drought/pest mitigation
            </p>
          </div>

          {/* Active Data Ingestion */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase" }}>
                Dataset Scope
              </span>
              <Database size={20} color="var(--color-primary)" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-neutral-900)" }}>
              {ingestionStats?.totalRegions ?? 33} <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-neutral-600)" }}>Districts</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--color-neutral-500)", margin: "0.25rem 0 0" }}>
              ICRISAT, IMD, MoAFW, eNAM, ICAR
            </p>
          </div>
        </div>

        {/* Assessment History Section */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-neutral-900)", margin: 0 }}>
              Recent Farmer Crop Assessments ({totalAssessments})
            </h2>

            {totalAssessments > 0 && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowClearAllModal(true)}
                style={{ fontSize: "0.8125rem", padding: "0.35rem 0.75rem", color: "#dc2626" }}
              >
                Clear History
              </button>
            )}
          </div>

          {totalAssessments === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
              <Sprout size={48} color="var(--color-neutral-400)" style={{ margin: "0 auto 1rem" }} />
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-neutral-800)", marginBottom: "0.5rem" }}>
                No Crop Assessments Run Yet
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", maxWidth: "460px", margin: "0 auto 1.5rem" }}>
                Start by entering your district, crop, and soil parameters. Your explainable yield potential and ICAR agronomic guidelines will appear here.
              </p>
              <Link href="/yield-assessment" className="btn btn-primary">
                Run Your First Assessment &rarr;
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
              {assessments.map((a) => (
                <div
                  key={a.id}
                  className="card"
                  style={{
                    borderLeft: `5px solid ${
                      a.riskAnalysis.overallRiskRating === "High Risk"
                        ? "#dc2626"
                        : a.riskAnalysis.overallRiskRating === "Moderate Risk"
                        ? "var(--color-amber-500)"
                        : "var(--color-primary)"
                    }`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-neutral-400)", fontWeight: 600 }}>{a.id}</span>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--color-neutral-900)", margin: "0.125rem 0" }}>
                          {a.input.crop} ({a.input.season})
                        </h3>
                        <p style={{ fontSize: "0.8125rem", color: "var(--color-neutral-600)", margin: 0 }}>
                          {a.input.district}, {a.input.state}
                        </p>
                      </div>
                      <span
                        className={`badge ${
                          a.riskAnalysis.overallRiskRating === "High Risk"
                            ? "badge-danger"
                            : a.riskAnalysis.overallRiskRating === "Moderate Risk"
                            ? "badge-warning"
                            : "badge-success"
                        }`}
                      >
                        {a.riskAnalysis.overallRiskRating}
                      </span>
                    </div>

                    <div style={{ background: "var(--color-neutral-50)", padding: "0.75rem", borderRadius: 8, margin: "0.75rem 0", fontSize: "0.8125rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ color: "var(--color-neutral-600)" }}>Estimated Yield:</span>
                        <strong>{a.yieldEstimate.estimatedYieldQuintalsPerAcre} Qtl/Acre</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--color-neutral-600)" }}>Total Harvest ({a.input.farmAreaAcres} ac):</span>
                        <strong>{a.yieldEstimate.estimatedTotalProductionQuintals} Qtl</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-neutral-100)", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setSelectedAssessment(a)}
                      style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                    >
                      View Full Advisory
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(a.id)}
                      aria-label={`Delete assessment ${a.id}`}
                      style={{ background: "transparent", border: "none", color: "var(--color-neutral-400)", cursor: "pointer", padding: "0.25rem" }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Assessment Modal / Full Viewer */}
        {selectedAssessment && (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(17, 24, 39, 0.6)",
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.25rem",
              zIndex: 9999,
            }}
            onClick={() => setSelectedAssessment(null)}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                maxWidth: "780px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "2rem",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                border: "1px solid var(--color-border)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", borderBottom: "1px solid var(--color-neutral-200)", paddingBottom: "1rem" }}>
                <div>
                  <span className="badge badge-primary">{selectedAssessment.id}</span>
                  <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--color-neutral-900)", margin: "0.375rem 0" }}>
                    {selectedAssessment.input.crop} Assessment Summary
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-600)", margin: 0 }}>
                    {selectedAssessment.input.district}, {selectedAssessment.input.state} | {selectedAssessment.input.season} | {selectedAssessment.input.farmAreaAcres} Acres
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAssessment(null)}
                  className="btn btn-outline"
                  style={{ fontSize: "0.8125rem", padding: "0.35rem 0.75rem" }}
                >
                  Close
                </button>
              </div>

              {/* Advisory Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ background: "var(--color-green-50)", padding: "1rem", borderRadius: 8, border: "1px solid var(--color-green-200)" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-green-800)" }}>YIELD PROJECTION</span>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-green-900)", margin: "0.25rem 0" }}>
                    {selectedAssessment.yieldEstimate.estimatedYieldQuintalsPerAcre} Qtl / Acre
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-neutral-600)", margin: 0 }}>
                    Total {selectedAssessment.yieldEstimate.estimatedTotalProductionQuintals} Quintals across field
                  </p>
                </div>

                <div style={{ background: "var(--color-neutral-50)", padding: "1rem", borderRadius: 8, border: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-neutral-700)" }}>RISK RATING</span>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-neutral-900)", margin: "0.25rem 0" }}>
                    {selectedAssessment.riskAnalysis.overallRiskRating}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-neutral-600)", margin: 0 }}>
                    Score {selectedAssessment.riskAnalysis.compositeRiskScore}/100
                  </p>
                </div>
              </div>

              {/* Recommended Varieties */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "0.5rem" }}>
                  Certified ICAR Varieties
                </h4>
                <ul style={{ listStyle: "none", fontSize: "0.8125rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {selectedAssessment.agronomicAdvisory.recommendedVarieties.map((v, i) => (
                    <li key={i} style={{ background: "var(--color-neutral-50)", padding: "0.5rem 0.75rem", borderRadius: 6, border: "1px solid var(--color-neutral-200)" }}>
                      <strong>{v.name}</strong> ({v.durationDays} Days) — {v.traits}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nutrients & Water */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "0.5rem" }}>
                  Nutrient &amp; Water Schedule
                </h4>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-neutral-700)", lineHeight: 1.5, marginBottom: "0.5rem" }}>
                  <strong>Fertilizer:</strong> N: {selectedAssessment.agronomicAdvisory.nutrientManagement.nKgHa} kg, P: {selectedAssessment.agronomicAdvisory.nutrientManagement.pKgHa} kg, K: {selectedAssessment.agronomicAdvisory.nutrientManagement.kKgHa} kg/ha. {selectedAssessment.agronomicAdvisory.nutrientManagement.basalAdvice}.
                </p>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-neutral-700)", lineHeight: 1.5, margin: 0 }}>
                  <strong>Irrigation:</strong> {selectedAssessment.agronomicAdvisory.waterManagement}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", borderTop: "1px solid var(--color-neutral-200)", paddingTop: "1rem" }}>
                <button type="button" onClick={() => window.print()} className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <Printer size={15} /> Print
                </button>
                <button type="button" onClick={() => setSelectedAssessment(null)} className="btn btn-primary">
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Single Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteTargetId !== null}
          title="Delete Assessment Record?"
          message="Are you sure you want to remove this assessment from your dashboard history? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => deleteTargetId && handleDelete(deleteTargetId)}
          onCancel={() => setDeleteTargetId(null)}
        />

        {/* Clear All Confirmation Modal */}
        <ConfirmationModal
          isOpen={showClearAllModal}
          title="Clear All Assessment History?"
          message="Are you sure you want to remove all saved crop assessments from your dashboard? All saved records will be deleted."
          confirmLabel="Clear All"
          onConfirm={handleClearAll}
          onCancel={() => setShowClearAllModal(false)}
        />
      </div>
    </div>
  );
}
