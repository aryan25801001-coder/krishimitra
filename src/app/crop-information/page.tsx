"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sprout,
  Search,
  Droplets,
  Thermometer,
  Layers,
  Bug,
  BookOpen,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function CropInformationPage() {
  const [crops, setCrops] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCrops() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/crops");
        const json = await res.json();
        if (json.success) {
          setCrops(json.data);
        }
      } catch (err) {
        console.error("Failed to load crops", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCrops();
  }, []);

  const filteredCrops = crops.filter((c) => {
    const matchesSeason =
      selectedSeason === "All" ||
      c.season.toLowerCase() === selectedSeason.toLowerCase() ||
      c.season === "Annual";
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.botanicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeason && matchesSearch;
  });

  return (
    <div style={{ padding: "2.5rem 0 5rem" }}>
      <div className="section-container">
        {/* Header */}
        <header style={{ marginBottom: "2.5rem", maxWidth: "800px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span className="badge badge-primary">ICAR Agronomic Repository</span>
            <span className="badge badge-neutral">Certified Crop Standards</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.375rem)", fontWeight: 800, color: "var(--color-neutral-900)", letterSpacing: "-0.025em", marginBottom: "0.5rem" }}>
            Authentic Crop Knowledge Base &amp; Agronomic Guidelines
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "var(--color-neutral-600)", lineHeight: 1.6 }}>
            Explore certified crop parameters compiled from the Indian Council of Agricultural Research (ICAR). Access optimal soil pH, thermal limits, water needs, and nutrient schedules.
          </p>
        </header>

        {/* Search & Filter Bar */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between", background: "#ffffff", padding: "1.25rem", borderRadius: 10, border: "1px solid var(--color-border)", marginBottom: "2rem" }}>
          {/* Search Box */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--color-neutral-50)", padding: "0.5rem 0.875rem", borderRadius: 8, border: "1px solid var(--color-border)", flex: "1", minWidth: "240px" }}>
            <Search size={16} color="var(--color-neutral-400)" />
            <input
              type="text"
              placeholder="Search by crop, botanical name, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: "none", background: "transparent", width: "100%", outline: "none", fontSize: "0.875rem", color: "var(--color-neutral-800)" }}
            />
          </div>

          {/* Season Filters */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <Filter size={15} color="var(--color-neutral-500)" />
            {["All", "Kharif", "Rabi", "Annual"].map((season) => (
              <button
                key={season}
                type="button"
                className={`btn ${selectedSeason === season ? "btn-primary" : "btn-outline"}`}
                onClick={() => setSelectedSeason(season)}
                style={{ fontSize: "0.8125rem", padding: "0.35rem 0.75rem" }}
              >
                {season}
              </button>
            ))}
          </div>
        </div>

        {/* Crops Grid */}
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="card skeleton" style={{ height: 260 }} />
            ))}
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
            <Sprout size={40} color="var(--color-neutral-400)" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-neutral-800)", marginBottom: "0.375rem" }}>
              No matching crops found
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", margin: 0 }}>
              Try adjusting your search terms or filter selection.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {filteredCrops.map((crop) => (
              <div key={crop.name} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <span className="badge badge-neutral" style={{ fontSize: "0.6875rem", marginBottom: "0.25rem" }}>
                        {crop.category} • {crop.season}
                      </span>
                      <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-neutral-900)", margin: "0.125rem 0" }}>
                        {crop.name}
                      </h2>
                      <span style={{ fontSize: "0.8125rem", fontStyle: "italic", color: "var(--color-neutral-500)" }}>
                        {crop.botanicalName}
                      </span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div style={{ background: "var(--color-neutral-50)", padding: "0.75rem", borderRadius: 8, margin: "0.75rem 0", fontSize: "0.8125rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <div>
                      <span style={{ color: "var(--color-neutral-500)", display: "block" }}>Optimal Temp:</span>
                      <strong>{crop.optimalTempMinC}°C - {crop.optimalTempMaxC}°C</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--color-neutral-500)", display: "block" }}>Water Need:</span>
                      <strong>{crop.optimalRainfallMin} - {crop.optimalRainfallMax} mm</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--color-neutral-500)", display: "block" }}>Optimal Soil pH:</span>
                      <strong>{crop.optimalPhMin} - {crop.optimalPhMax}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--color-neutral-500)", display: "block" }}>Growth Duration:</span>
                      <strong>{crop.growthDaysMin} - {crop.growthDaysMax} Days</strong>
                    </div>
                  </div>

                  {/* Certified Varieties */}
                  {crop.varieties && crop.varieties.length > 0 && (
                    <div style={{ fontSize: "0.75rem", color: "var(--color-neutral-700)", marginBottom: "0.75rem" }}>
                      <strong>Certified Varieties:</strong>{" "}
                      {crop.varieties.map((v: any) => v.varietyName).join(", ")}
                    </div>
                  )}

                  {/* Pest Note */}
                  <div style={{ fontSize: "0.75rem", color: "var(--color-neutral-600)", borderTop: "1px solid var(--color-neutral-100)", paddingTop: "0.5rem" }}>
                    <strong>Major Pest Threat:</strong> {crop.majorPests.split(",")[0]}
                  </div>
                </div>

                {/* Card Action */}
                <div style={{ marginTop: "1.25rem", borderTop: "1px solid var(--color-neutral-200)", paddingTop: "0.75rem" }}>
                  <Link
                    href="/yield-assessment"
                    className="btn btn-outline"
                    style={{ width: "100%", justifyContent: "center", fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: "0.375rem" }}
                  >
                    Assess Yield for {crop.name} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
